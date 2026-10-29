const express = require('express');
const session = require('express-session');
const multer = require('multer');
const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');
const sharp = require('sharp');

const app = express();
const port = process.env.PORT || 3000;
const root = __dirname;
const dataDir = path.join(root, 'data');
const uploadDir = path.join(root, 'uploads');
const stateFile = path.join(dataDir, 'menu.json');
const adminPassword = process.env.ADMIN_PASSWORD || 'fale71961';
const sessionSecret = process.env.SESSION_SECRET || 'change-this-secret';
const adminCookieName = 'fale7_admin';
const previewCache = new Map();
const previewImageCache = new Map();
const previewWidths = [640, 1024, 1600, 2400];
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } });
let stateCache = null;
let stateCacheTime = 0;

// Vercel may populate req.body before Express middleware consumes the stream.
app.use((req, res, next) => {
  req.preParsedBody = req.body;
  next();
});
app.use(express.json({ limit: '25mb' }));
app.use(session({ secret: sessionSecret, resave: false, saveUninitialized: false }));

// Security & SEO baseline headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  next();
});

// Protect all private / admin / API routes with strict X-Robots-Tag
app.use(['/admin', '/admin.html', '/api'], (req, res, next) => {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
  next();
});

// Canonical redirects: prevent duplicate indexing of /index.html and /admin.html
app.get('/index.html', (req, res) => res.redirect(301, '/'));
app.get('/admin.html', (req, res) => res.redirect(301, '/admin'));
app.get('/menu', (req, res) => res.redirect(301, '/'));

// Dedicated SEO routes
app.get('/robots.txt', (req, res) => {
  res.setHeader('Content-Type', 'text/plain; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.sendFile(path.join(root, 'public', 'robots.txt'));
});

app.get('/sitemap.xml', (req, res) => {
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=86400');
  res.sendFile(path.join(root, 'public', 'sitemap.xml'));
});

// Previews static cache
app.use('/previews', express.static(path.join(root, 'previews'), {
  maxAge: '365d',
  immutable: true
}));

// Real-time GEO and Schema.org synchronization for customer homepage
const { getMenuSections, generateSchemaGraph, renderHtmlMenu, renderQuickFacts } = require('./menuData');

app.get('/', async (req, res) => {
  try {
    const indexPath = path.join(root, 'public', 'index.html');
    let content = await fs.readFile(indexPath, 'utf8');
    const sections = getMenuSections();
    const schema = generateSchemaGraph(sections);
    const jsonLd = JSON.stringify(schema, null, 2);

    content = content.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/i, `<script type="application/ld+json">\n${jsonLd}\n  </script>`);
    content = content.replace(/<aside class="seo-semantic-container"[\s\S]*?<\/aside>/i, '');

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=600');
    return res.send(content);
  } catch (err) {
    return res.sendFile(path.join(root, 'public', 'index.html'));
  }
});

// Canonical redirect: /about.html → /about
app.get('/about.html', (req, res) => res.redirect(301, '/about'));

// About page — "اعرفنا أكتر" — dynamically rendered for freshness
app.get('/about', async (req, res) => {
  try {
    const sections = getMenuSections();
    const schema = generateSchemaGraph(sections);
    // Override some schema fields for the /about page URL
    if (schema && schema['@graph']) {
      schema['@graph'].forEach(node => {
        if (node['@type'] === 'BreadcrumbList') {
          node.itemListElement = [
            { '@type': 'ListItem', position: 1, name: 'الرئيسية', item: 'https://fale7-res.vercel.app/' },
            { '@type': 'ListItem', position: 2, name: 'اعرفنا أكتر — المطعم والمنيو', item: 'https://fale7-res.vercel.app/about' }
          ];
        }
        if (node['@type'] === 'Restaurant') {
          node.url = 'https://fale7-res.vercel.app/';
          node['@id'] = 'https://fale7-res.vercel.app/#restaurant';
        }
        if (node['@type'] === 'WebSite') {
          node['@id'] = 'https://fale7-res.vercel.app/#website';
        }
      });
    }
    const jsonLd = JSON.stringify(schema, null, 2);
    const menuHtml = renderHtmlMenu(sections);
    const factsHtml = renderQuickFacts();

    const html = buildAboutPage({ jsonLd, menuHtml, factsHtml });

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=300, stale-while-revalidate=600');
    return res.send(html);
  } catch (err) {
    console.error('/about render error:', err);
    return res.status(500).send('Server error');
  }
});

function buildAboutPage({ jsonLd, menuHtml, factsHtml }) {
  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>اعرفنا أكتر — مطعم فالح أبو العنبة | منذ 1961 | أكل عراقي في 6 أكتوبر</title>
  <meta name="description" content="تعرف على مطعم فالح أبو العنبة (منذ 1961) — مطعم عراقي أصيل في مدينة 6 أكتوبر، الجيزة. تصفح قائمة الطعام الكاملة بالأسعار، المشويات، السندوتشات، الوجبات، المقبلات، مواعيد العمل، وطرق التوصيل.">
  <meta name="robots" content="index, follow, max-snippet:-1">
  <meta name="author" content="مطعم فالح أبو العنبة">
  <meta name="theme-color" content="#b45309">

  <!-- Canonical -->
  <link rel="canonical" href="https://fale7-res.vercel.app/about">

  <!-- Favicons -->
  <link rel="icon" type="image/png" sizes="64x64" href="/favicon.png">
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">

  <!-- Open Graph -->
  <meta property="og:site_name" content="فالح أبو العنبة">
  <meta property="og:type" content="website">
  <meta property="og:title" content="اعرفنا أكتر — مطعم فالح أبو العنبة | منذ 1961">
  <meta property="og:description" content="مطعم عراقي أصيل في 6 أكتوبر منذ 1961. سندوتشات صمون عراقي، مشويات، وجبات، فلافل، مقبلات وأكتر. تصفح المنيو الكاملة بالأسعار.">
  <meta property="og:url" content="https://fale7-res.vercel.app/about">
  <meta property="og:image" content="https://fale7-res.vercel.app/favicon.png">
  <meta property="og:image:alt" content="شعار مطعم فالح أبو العنبة">
  <meta property="og:locale" content="ar_EG">

  <!-- Twitter/X Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="اعرفنا أكتر — مطعم فالح أبو العنبة | منذ 1961">
  <meta name="twitter:description" content="مطعم عراقي أصيل في 6 أكتوبر منذ 1961 — سندوتشات، مشويات، وجبات، فلافل. المنيو الكاملة بالأسعار.">
  <meta name="twitter:image" content="https://fale7-res.vercel.app/favicon.png">

  <!-- Stylesheets -->
  <link rel="stylesheet" href="/styles.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">

  <!-- Structured Data -->
  <script type="application/ld+json">
${jsonLd}
  </script>
</head>
<body class="about-body">

  <!-- ===== HEADER / NAV ===== -->
  <header class="about-header" role="banner">
    <a href="/" class="about-back-btn" aria-label="رجوع للمنيو المصورة">
      <i class="fas fa-arrow-right" aria-hidden="true"></i>
      <span>رجوع للمنيو</span>
    </a>
    <div class="about-brand" aria-label="اسم المطعم">
      <span class="about-brand-name">مطعم فالح أبو العنبة</span>
      <span class="about-brand-year">منذ 1961</span>
    </div>
    <nav class="about-social-nav" aria-label="روابط التواصل الاجتماعي">
      <a href="https://www.tiktok.com/@fale7_1961" target="_blank" rel="noopener noreferrer" class="about-social-icon" aria-label="تيك توك فالح">
        <i class="fab fa-tiktok" aria-hidden="true"></i>
      </a>
      <a href="https://www.facebook.com/share/1FTjzqpHv8/" target="_blank" rel="noopener noreferrer" class="about-social-icon" aria-label="فيسبوك فالح">
        <i class="fab fa-facebook-f" aria-hidden="true"></i>
      </a>
      <a href="https://maps.app.goo.gl/DqNEo521pyEbMpD49" target="_blank" rel="noopener noreferrer" class="about-social-icon" aria-label="موقع المطعم على الخريطة">
        <i class="fas fa-map-marker-alt" aria-hidden="true"></i>
      </a>
    </nav>
  </header>

  <main class="about-main" id="main-content">

    <!-- ===== HERO STRIP ===== -->
    <section class="about-hero" aria-labelledby="about-hero-title">
      <div class="about-hero-inner">
        <p class="about-hero-eyebrow">منذ عام 1961</p>
        <h1 id="about-hero-title" class="about-hero-title">مطعم فالح أبو العنبة</h1>
        <p class="about-hero-tagline">أكل عراقي أصيل في قلب مدينة 6 أكتوبر، الجيزة</p>
      </div>
    </section>

    <!-- ===== ABOUT THE RESTAURANT ===== -->
    <section class="about-section" aria-labelledby="about-restaurant-title">
      <div class="about-section-inner">
        <h2 id="about-restaurant-title" class="about-section-title">
          <span class="about-section-icon" aria-hidden="true">🏪</span>
          عن المطعم
        </h2>
        <div class="about-cards-row">
          <article class="about-card about-card--story">
            <h3 class="about-card-title">قصتنا</h3>
            <p>مطعم فالح أبو العنبة بدأ رحلته منذ عام 1961، وعلى مدى أكثر من 60 عامًا أصبح وجهةً معروفة بين محبي الأكل العراقي الأصيل في مصر. يقدم المطعم أشهى السندوتشات والمأكولات العراقية بمكوناتٍ طازجة وأسعار مناسبة.</p>
            <p>نتميز بخبز الصمون العراقي الهش الذي يُخبز طازجًا، والمشويات المُعدّة على الفحم، والفلافل المقرمشة، والعنبة العراقية الأصلية التي لا مثيل لها.</p>
          </article>
          <article class="about-card about-card--cuisine">
            <h3 class="about-card-title">نوع الطعام</h3>
            <ul class="about-cuisine-list" role="list">
              <li><i class="fas fa-check-circle" aria-hidden="true"></i> أكل عراقي أصيل</li>
              <li><i class="fas fa-check-circle" aria-hidden="true"></i> سندوتشات صمون عراقي</li>
              <li><i class="fas fa-check-circle" aria-hidden="true"></i> مشويات على الفحم</li>
              <li><i class="fas fa-check-circle" aria-hidden="true"></i> فلافل مقرمشة</li>
              <li><i class="fas fa-check-circle" aria-hidden="true"></i> وجبات متكاملة</li>
              <li><i class="fas fa-check-circle" aria-hidden="true"></i> معجنات وفطائر</li>
              <li><i class="fas fa-check-circle" aria-hidden="true"></i> مقبلات عراقية (عنبة، مسبحة)</li>
            </ul>
          </article>
        </div>
      </div>
    </section>

    <!-- ===== INFO CARDS ===== -->
    <section class="about-section about-section--info" aria-labelledby="about-info-title">
      <div class="about-section-inner">
        <h2 id="about-info-title" class="about-section-title">
          <span class="about-section-icon" aria-hidden="true">📍</span>
          معلومات المطعم
        </h2>
        <div class="about-info-grid">

          <article class="about-info-card">
            <div class="about-info-icon" aria-hidden="true"><i class="fas fa-clock"></i></div>
            <h3 class="about-info-card-title">مواعيد العمل</h3>
            <p class="about-info-value">يوميًا من <strong>7 الصبح</strong> حتى <strong>3 الفجر</strong></p>
            <p class="about-info-note" dir="ltr">07:00 AM — 03:00 AM</p>
          </article>

          <article class="about-info-card">
            <div class="about-info-icon" aria-hidden="true"><i class="fas fa-map-marker-alt"></i></div>
            <h3 class="about-info-card-title">الموقع والعنوان</h3>
            <address class="about-info-value about-address">
              محافظة الجيزة، مدينة 6 أكتوبر<br>
              الحي السابع، شارع مكة المكرمة<br>
              سنتر الأردنية<br>
              بالقرب من قسم أول 6 أكتوبر
            </address>
            <a href="https://maps.app.goo.gl/DqNEo521pyEbMpD49" target="_blank" rel="noopener noreferrer" class="about-info-link">
              <i class="fas fa-directions" aria-hidden="true"></i> عرض على خرائط جوجل
            </a>
          </article>

          <article class="about-info-card">
            <div class="about-info-icon" aria-hidden="true"><i class="fas fa-phone-alt"></i></div>
            <h3 class="about-info-card-title">التوصيل والطلبات</h3>
            <p class="about-info-value">
              <a href="tel:01000602832" class="about-phone-link" dir="ltr">0100 060 2832</a>
            </p>
            <p class="about-info-value">
              <a href="tel:01144741115" class="about-phone-link" dir="ltr">0114 474 1115</a>
            </p>
          </article>

          <article class="about-info-card">
            <div class="about-info-icon" aria-hidden="true"><i class="fas fa-credit-card"></i></div>
            <h3 class="about-info-card-title">طرق الدفع</h3>
            <ul class="about-payment-list" role="list">
              <li><i class="fas fa-money-bill-wave" aria-hidden="true"></i> كاش (نقدًا)</li>
              <li><i class="fas fa-credit-card" aria-hidden="true"></i> فيزا (بطاقة بنكية)</li>
              <li><i class="fas fa-mobile-alt" aria-hidden="true"></i> انستا باي (InstaPay)</li>
              <li><i class="fas fa-wallet" aria-hidden="true"></i> محافظ إلكترونية</li>
            </ul>
            <p class="about-info-note">العملة: الجنيه المصري (EGP)</p>
          </article>

        </div>
      </div>
    </section>

    <!-- ===== MENU SECTIONS ===== -->
    <section class="about-section about-section--menu" aria-labelledby="about-menu-title">
      <div class="about-section-inner">
        <h2 id="about-menu-title" class="about-section-title">
          <span class="about-section-icon" aria-hidden="true">🍽️</span>
          القائمة والأسعار
        </h2>
        <p class="about-menu-subtitle">جميع الأسعار بالجنيه المصري (EGP) — الأسعار تعكس المنيو الرسمي الحالي</p>
        ${menuHtml}
      </div>
    </section>

  </main>

  <!-- ===== FOOTER ===== -->
  <footer class="about-footer" role="contentinfo">
    <div class="about-footer-inner">
      <p class="about-footer-brand">مطعم فالح أبو العنبة — منذ 1961</p>
      <nav class="about-footer-nav" aria-label="روابط التنقل">
        <a href="/" class="about-footer-link">
          <i class="fas fa-utensils" aria-hidden="true"></i> المنيو المصورة
        </a>
        <a href="https://maps.app.goo.gl/DqNEo521pyEbMpD49" target="_blank" rel="noopener noreferrer" class="about-footer-link">
          <i class="fas fa-map-marker-alt" aria-hidden="true"></i> الموقع
        </a>
        <a href="tel:01000602832" class="about-footer-link">
          <i class="fas fa-phone-alt" aria-hidden="true"></i> اتصل بنا
        </a>
      </nav>
      <a href="/" class="about-cta-back" aria-label="رجوع للمنيو المصورة">
        <i class="fas fa-arrow-right" aria-hidden="true"></i>
        رجوع للمنيو
      </a>
    </div>
  </footer>

</body>
</html>`;
}

app.use(express.static(path.join(root, 'public'), {
  maxAge: '1d',
  setHeaders(res, filePath) {
    if (/\.(?:html|js)$/i.test(filePath)) {
      res.setHeader('Cache-Control', 'no-cache, must-revalidate');
    }
  }
}));

async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.mkdir(uploadDir, { recursive: true });
  try { await fs.access(stateFile); } catch { await fs.writeFile(stateFile, JSON.stringify({ pages: [] }, null, 2)); }
}

async function readState({ fresh = false } = {}) {
  await ensureStore();
  if (!fresh && isVercel && stateCache && Date.now() - stateCacheTime < 30000) return stateCache;
  if (isVercel) {
    if (!githubToken || !githubRepository) throw new Error('إعدادات GitHub غير مكتملة في Vercel');
    const remote = await readFromGitHub('data/menu.json');
    if (!remote) throw new Error('تعذر قراءة حالة المنيو من GitHub');
    stateCache = JSON.parse(remote);
    stateCacheTime = Date.now();
    return stateCache;
  }
  const state = JSON.parse(await fs.readFile(stateFile, 'utf8'));
  if (isVercel) { stateCache = state; stateCacheTime = Date.now(); }
  return state;
}

async function writeState(state) {
  if (isVercel) return;
  await fs.writeFile(stateFile, JSON.stringify({ ...state, updatedAt: new Date().toISOString() }, null, 2));
}

let menuMutationQueue = Promise.resolve();

async function mutateMenuState(mutator, message) {
  const run = async () => {
    if (isVercel && (!githubToken || !githubRepository)) {
      throw new Error('إعدادات GitHub غير مكتملة في Vercel');
    }
    if (isVercel && githubToken && githubRepository) {
      const encodedPath = 'data/menu.json';
      const apiUrl = `https://api.github.com/repos/${githubRepository}/contents/${encodedPath}`;
      const headers = {
        Authorization: `Bearer ${githubToken}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28'
      };

      for (let attempt = 0; attempt < 5; attempt += 1) {
        const currentResponse = await fetch(`${apiUrl}?ref=${encodeURIComponent(githubBranch)}`, { headers });
        let currentState = { pages: [] };
        let currentSha;
        if (currentResponse.ok) {
          const currentData = await currentResponse.json();
          currentSha = currentData.sha;
          currentState = JSON.parse(Buffer.from(currentData.content.replace(/\s/g, ''), 'base64').toString('utf8'));
        } else if (currentResponse.status !== 404) {
          throw new Error(`تعذر قراءة حالة المنيو من GitHub (${currentResponse.status})`);
        }

        const value = mutator(currentState);
        currentState.updatedAt = new Date().toISOString();
        const saveResponse = await fetch(apiUrl, {
          method: 'PUT',
          headers: { ...headers, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message,
            content: Buffer.from(JSON.stringify(currentState, null, 2)).toString('base64'),
            branch: githubBranch,
            ...(currentSha ? { sha: currentSha } : {})
          })
        });

        if (saveResponse.ok) {
          stateCache = currentState;
          stateCacheTime = Date.now();
          renderedSvgCache.clear();
          previewCache.clear();
          return { state: currentState, value };
        }
        if (saveResponse.status !== 409 && saveResponse.status !== 422) {
          throw new Error(`تعذر حفظ حالة المنيو في GitHub (${saveResponse.status})`);
        }
      }
      throw new Error('تعارضت تعديلات المنيو أكثر من مرة؛ أعد المحاولة بعد لحظة');
    }

    const state = await readState({ fresh: true });
    const value = mutator(state);
    state.updatedAt = new Date().toISOString();
    await writeState(state);
    await commitToGitHub('data/menu.json', JSON.stringify(state, null, 2), message);
    stateCache = state;
    stateCacheTime = Date.now();
    return { state, value };
  };

  if (isVercel) return run();
  const pending = menuMutationQueue.then(run, run);
  menuMutationQueue = pending.then(() => undefined, () => undefined);
  return pending;
}

function splitSvgFile(buffer) {
  const source = buffer.toString('utf8').trim();
  const pages = [];
  let depth = 0;
  let startIndex = -1;
  const regex = /<\/?svg\b[^>]*>/gi;
  let match;
  while ((match = regex.exec(source)) !== null) {
    if (match[0].toLowerCase().startsWith('<svg')) {
      if (depth === 0) startIndex = match.index;
      depth++;
    } else if (match[0].toLowerCase().startsWith('</svg')) {
      depth--;
      if (depth === 0 && startIndex !== -1) {
        pages.push(source.substring(startIndex, match.index + match[0].length));
        startIndex = -1;
      }
    }
  }
  if (!pages.length) {
     const fallbackMatch = source.match(/<svg\b[\s\S]*?<\/svg>/gi);
     if (fallbackMatch) return fallbackMatch;
     throw new Error('الملف لا يحتوي على SVG صالح');
  }
  return pages;
}

const { applyTextChanges } = require('./svgEdits');

function optimizeSvg(svg) {
  return svg
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<\?xml[\s\S]*?\?>/gi, '')
    .replace(/<!DOCTYPE[\s\S]*?>/gi, '')
    .replace(/<title>[\s\S]*?<\/title>/gi, '')
    .replace(/<desc[\s\S]*?<\/desc>/gi, '')
    .replace(/\s+(?:inkscape|sodipodi):[\w-]+=(?:"[^"]*"|'[^']*')/gi, '')
    .replace(/\s+(?:data-price-index|data-product-index|data-price-center|data-product-right|tabindex)=(?:"[^"]*"|'[^']*')/gi, '')
    .replace(/\s+class=(?:"[^"]*"|'[^']*')/gi, '')
    .replace(/\s{2,}/g, ' ')
    .replace(/>\s+</g, '><')
    .trim();
}

function previewCacheKey(page, source) {
  return crypto.createHash('sha1').update(source).update(JSON.stringify(page.changes || [])).digest('hex');
}

function auth(req, res, next) {
  if (!req.session.isAdmin && !hasAdminCookie(req)) return res.status(401).json({ message: 'غير مصرح' });
  next();
}

function adminCookieSignature() {
  return crypto.createHmac('sha256', sessionSecret).update('admin').digest('hex');
}

function hasAdminCookie(req) {
  const cookies = String(req.headers.cookie || '').split(';').map((item) => item.trim());
  const value = cookies.find((item) => item.startsWith(`${adminCookieName}=`))?.slice(adminCookieName.length + 1);
  if (!value) return false;
  const expected = adminCookieSignature();
  const actual = Buffer.from(value);
  const target = Buffer.from(expected);
  return actual.length === target.length && crypto.timingSafeEqual(actual, target);
}

function setAdminCookie(res) {
  const secure = isVercel ? '; Secure' : '';
  res.setHeader('Set-Cookie', `${adminCookieName}=${adminCookieSignature()}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400${secure}`);
}

function clearAdminCookie(res) {
  res.setHeader('Set-Cookie', `${adminCookieName}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`);
}

const githubToken = process.env.GITHUB_TOKEN;
const githubRepository = process.env.GITHUB_REPOSITORY;
const githubBranch = process.env.GITHUB_BRANCH || 'main';
const isVercel = process.env.VERCEL === '1';
const renderedSvgCache = new Map();

async function commitToGitHub(filePath, content, message) {
  if (!githubToken || !githubRepository) return;
  const encodedPath = filePath.split('/').map(encodeURIComponent).join('/');
  const headers = { Authorization: `Bearer ${githubToken}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
  const apiUrl = `https://api.github.com/repos/${githubRepository}/contents/${encodedPath}`;
  const current = await fetch(`${apiUrl}?ref=${encodeURIComponent(githubBranch)}`, { headers });
  const currentData = current.ok ? await current.json() : null;
  const response = await fetch(apiUrl, {
    method: 'PUT',
    headers: { ...headers, 'Content-Type': 'application/json' },
    body: JSON.stringify({ message, content: Buffer.from(content).toString('base64'), branch: githubBranch, ...(currentData?.sha ? { sha: currentData.sha } : {}) })
  });
  if (!response.ok) throw new Error(`تعذر حفظ التعديل في GitHub (${response.status})`);
}

async function readFromGitHub(filePath) {
  if (filePath.startsWith('uploads/') || filePath === 'data/menu.json') {
    const rawUrl = `https://raw.githubusercontent.com/${githubRepository}/${encodeURIComponent(githubBranch)}/${filePath.split('/').map(encodeURIComponent).join('/')}?t=${Date.now()}`;
    const rawResponse = await fetch(rawUrl, { cache: 'no-store' });
    if (rawResponse.ok) return rawResponse.text();
  }
  const encodedPath = filePath.split('/').map(encodeURIComponent).join('/');
  const response = await fetch(`https://api.github.com/repos/${githubRepository}/contents/${encodedPath}?ref=${encodeURIComponent(githubBranch)}`, {
    headers: { Authorization: `Bearer ${githubToken}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' }
  });
  if (!response.ok) return null;
  const data = await response.json();
  return Buffer.from(data.content.replace(/\s/g, ''), 'base64').toString('utf8');
}

function pageAssetPaths(page) {
  const paths = new Set();
  const fileName = path.posix.basename(String(page.fileName || '').replace(/\\/g, '/'));
  if (fileName && fileName !== '.' && fileName !== '/') paths.add(`uploads/${fileName}`);
  for (const previewPath of [page.previewFile, ...Object.values(page.previewFiles || {})]) {
    const normalized = String(previewPath || '').replace(/\\/g, '/');
    if (normalized.startsWith('previews/') && path.posix.dirname(normalized) === 'previews') paths.add(normalized);
  }
  return [...paths];
}

async function deleteMenuPageFromGitHub(pageId) {
  if (!githubToken || !githubRepository) throw new Error('إعدادات GitHub غير مكتملة في Vercel');
  const apiRoot = `https://api.github.com/repos/${githubRepository}`;
  const headers = {
    Authorization: `Bearer ${githubToken}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28'
  };
  const refPath = `heads/${githubBranch.split('/').map(encodeURIComponent).join('/')}`;

  async function requestJson(url, options = {}) {
    const response = await fetch(url, options);
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(data.message || `GitHub ${response.status}`);
      error.status = response.status;
      throw error;
    }
    return data;
  }

  for (let attempt = 0; attempt < 5; attempt += 1) {
    const ref = await requestJson(`${apiRoot}/git/ref/${refPath}`, { headers });
    const parentSha = ref.object.sha;
    const parentCommit = await requestJson(`${apiRoot}/git/commits/${parentSha}`, { headers });
    const stateResponse = await requestJson(`${apiRoot}/contents/data/menu.json?ref=${encodeURIComponent(parentSha)}`, { headers });
    const state = JSON.parse(Buffer.from(stateResponse.content.replace(/\s/g, ''), 'base64').toString('utf8'));
    const pageIndex = state.pages.findIndex((item) => item.id === pageId);
    if (pageIndex < 0) return null;
    const [page] = state.pages.splice(pageIndex, 1);
    state.updatedAt = new Date().toISOString();

    const assetPaths = new Set(pageAssetPaths(page));
    try {
      const previewEntries = await requestJson(`${apiRoot}/contents/previews?ref=${encodeURIComponent(parentSha)}`, { headers });
      const baseName = path.basename(page.fileName, path.extname(page.fileName)).replace(/[^a-zA-Z0-9_-]/g, '-');
      for (const entry of previewEntries) {
        if (entry.type === 'file' && entry.name.startsWith(`${baseName}-`) && entry.name.endsWith('.webp')) {
          assetPaths.add(`previews/${entry.name}`);
        }
      }
    } catch (error) {
      if (error.status !== 404) throw error;
    }

    const jsonBlob = await requestJson(`${apiRoot}/git/blobs`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: Buffer.from(JSON.stringify(state, null, 2)).toString('base64'), encoding: 'base64' })
    });
    const assetsToDelete = [];
    for (const assetPath of assetPaths) {
      const encodedAssetPath = assetPath.split('/').map(encodeURIComponent).join('/');
      try {
        await requestJson(`${apiRoot}/contents/${encodedAssetPath}?ref=${encodeURIComponent(parentSha)}`, { headers });
        assetsToDelete.push(assetPath);
      } catch (error) {
        if (error.status !== 404) throw error;
      }
    }
    const tree = await requestJson(`${apiRoot}/git/trees`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        base_tree: parentCommit.tree.sha,
        tree: [
          ...assetsToDelete.map((assetPath) => ({ path: assetPath, mode: '100644', type: 'blob', sha: null })),
          { path: 'data/menu.json', mode: '100644', type: 'blob', sha: jsonBlob.sha }
        ]
      })
    });
    const commit = await requestJson(`${apiRoot}/git/commits`, {
      method: 'POST',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: `Delete menu page ${page.name} and its assets`, tree: tree.sha, parents: [parentSha] })
    });

    try {
      await requestJson(`${apiRoot}/git/refs/${refPath}`, {
        method: 'PATCH',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ sha: commit.sha, force: false })
      });
      stateCache = state;
      stateCacheTime = Date.now();
      renderedSvgCache.clear();
      previewCache.clear();
      return page;
    } catch (error) {
      if (error.status !== 409 && !(error.status === 422 && /fast.?forward/i.test(error.message))) throw error;
    }
  }
  throw new Error('تعارضت تغييرات GitHub أثناء الحذف؛ أعد المحاولة بعد لحظة');
}

app.get('/api/menu', async (req, res) => {
  const state = await readState({ fresh: true });
  res.set({
    'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
    Pragma: 'no-cache',
    Expires: '0'
  });
  res.json({ pages: state.pages.filter((page) => page.ready !== false), updatedAt: state.updatedAt || null });
});

app.get('/api/menu/data', (req, res) => {
  res.json({ sections: getMenuSections() });
});

app.put('/api/menu/data', auth, async (req, res) => {
  if (!Array.isArray(req.body.sections)) return res.status(400).json({ message: 'بيانات الأقسام غير صحيحة' });
  const targetFile = path.join(dataDir, 'menu-data.json');
  const payload = {
    version: 1,
    updatedAt: new Date().toISOString(),
    sections: req.body.sections
  };
  await fs.writeFile(targetFile, JSON.stringify(payload, null, 2), 'utf8');
  const { syncIndexHtml } = require('./tools/syncIndexHtml');
  syncIndexHtml();
  if (isVercel && githubToken && githubRepository) {
    await commitToGitHub('data/menu-data.json', JSON.stringify(payload, null, 2), 'Update structured menu data');
    const updatedIndex = await fs.readFile(path.join(root, 'public', 'index.html'), 'utf8');
    await commitToGitHub('public/index.html', updatedIndex, 'Sync GEO and Schema.org menu data');
  }
  res.json({ success: true, sections: payload.sections });
});

app.post('/api/login', (req, res) => {
  if (req.body.password !== adminPassword) return res.status(401).json({ message: 'كلمة المرور غير صحيحة' });
  req.session.isAdmin = true;
  setAdminCookie(res);
  res.json({ success: true });
});

app.post('/api/logout', (req, res) => {
  clearAdminCookie(res);
  req.session.destroy(() => res.json({ success: true }));
});
app.get('/api/session', (req, res) => res.json({ isAdmin: Boolean(req.session.isAdmin || hasAdminCookie(req)) }));

app.post('/api/pages', auth, upload.single('file'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'اختر ملف SVG أولاً' });
  if (isVercel && (!githubToken || !githubRepository)) return res.status(503).json({ message: 'إعدادات GitHub غير مكتملة في Vercel' });
  try {
    const svgs = splitSvgFile(req.file.buffer);
    const created = [];
    for (let index = 0; index < svgs.length; index += 1) {
      const id = crypto.randomUUID();
      const fileName = `${id}.svg`;
      const page = { id, name: svgs.length > 1 ? `${req.body.name || req.file.originalname} - صفحة ${index + 1}` : (req.body.name || req.file.originalname), fileName, createdAt: new Date().toISOString(), ready: false };
      if (!isVercel) await fs.writeFile(path.join(uploadDir, fileName), svgs[index]);
      await commitToGitHub(`uploads/${fileName}`, svgs[index], `Add menu page ${page.name}`);
      created.push(page);
    }
    await mutateMenuState((state) => {
      state.pages ||= [];
      state.pages.push(...created);
    }, 'Register uploaded menu pages');
    res.json({ success: true, count: created.length, pages: created });
  } catch (error) { res.status(400).json({ message: error.message || 'تعذر رفع ملف SVG' }); }
});

app.get('/api/pages/:id/file', async (req, res) => {
  const state = await readState({ fresh: true });
  const page = state.pages.find((item) => item.id === req.params.id);
  if (!page) return res.sendStatus(404);
  res.set({
    'Cache-Control': 'no-store',
    'Content-Type': 'image/svg+xml; charset=utf-8'
  });

  const cacheKey = `${page.id}:${page.updatedAt || ''}`;
  const cached = renderedSvgCache.get(cacheKey);
  if (cached) return res.end(cached);

  let source;
  try {
    source = await fs.readFile(path.join(uploadDir, page.fileName), 'utf8');
  } catch {
    source = isVercel && githubToken && githubRepository
      ? await readFromGitHub(`uploads/${page.fileName}`)
      : null;
  }
  if (typeof source !== 'string') return res.sendStatus(404);

  const file = page.changes?.length
    ? Buffer.from(applyTextChanges(source, page.changes || []))
    : Buffer.from(source);

  renderedSvgCache.clear();
  renderedSvgCache.set(cacheKey, file);
  res.end(file);
});

app.get('/api/pages/:id/preview', async (req, res) => {
  const state = await readState({ fresh: true });
  const page = state.pages.find((item) => item.id === req.params.id);
  if (!page) return res.sendStatus(404);
  let source;
  try {
    source = await fs.readFile(path.join(uploadDir, page.fileName), 'utf8');
  } catch {
    source = isVercel && githubToken && githubRepository ? await readFromGitHub(`uploads/${page.fileName}`) : null;
  }
  if (typeof source !== 'string') return res.sendStatus(404);
  const key = previewCacheKey(page, source);
  let preview = previewCache.get(key);
  if (!preview) {
    preview = Buffer.from(optimizeSvg(applyTextChanges(source, page.changes || [])));
    previewCache.clear();
    previewCache.set(key, preview);
  }
  res.set({ 'Cache-Control': 'public, max-age=31536000, immutable', 'Content-Type': 'image/svg+xml; charset=utf-8' }).end(preview);
});

app.get('/api/pages/:id/preview.webp', async (req, res) => {
  const state = await readState({ fresh: true });
  const page = state.pages.find((item) => item.id === req.params.id);
  if (!page) return res.sendStatus(404);
  const requestedWidth = Number.parseInt(req.query.w, 10);
  const width = previewWidths.includes(requestedWidth) ? requestedWidth : 1600;
  const previewFile = page.previewFiles?.[String(width)] || (width === 1600 ? page.previewFile : null);
  if (previewFile) {
    try {
      await fs.access(path.join(root, previewFile));
      return res.sendFile(path.join(root, previewFile), { headers: { 'Cache-Control': 'public, max-age=31536000, immutable', 'Content-Type': 'image/webp' } });
    } catch {
      // The preview workflow may not have deployed its generated file yet; serve the SVG meanwhile.
    }
  }
  let source;
  try {
    source = await fs.readFile(path.join(uploadDir, page.fileName), 'utf8');
  } catch {
    source = isVercel && githubToken && githubRepository ? await readFromGitHub(`uploads/${page.fileName}`) : null;
  }
  if (typeof source !== 'string') return res.sendStatus(404);
  // Redirect to raw SVG if WebP is not ready yet
  res.redirect('/api/pages/' + page.id + '/file');
});

// Keep this specific route before /api/pages/:id, which would otherwise match "order" as an ID.
app.put('/api/pages/order', auth, async (req, res) => {
  let payload = req.body;
  const parseBody = (value) => {
    if (Buffer.isBuffer(value)) value = value.toString('utf8');
    if (typeof value === 'string') {
      try { return JSON.parse(value); } catch { return null; }
    }
    return value;
  };
  payload = parseBody(payload);
  if ((!payload || (typeof payload === 'object' && !Array.isArray(payload) && Object.keys(payload).length === 0)) && req.preParsedBody) {
    payload = parseBody(req.preParsedBody);
  }
  if ((!payload || (typeof payload === 'object' && !Array.isArray(payload) && Object.keys(payload).length === 0)) && req.rawBody) {
    payload = parseBody(req.rawBody);
  }
  const queryPageIds = typeof req.query.pageIds === 'string' ? parseBody(req.query.pageIds) : null;
  const submittedIds = Array.isArray(queryPageIds) ? queryPageIds : (Array.isArray(payload) ? payload : payload?.pageIds);
  const pageIds = Array.isArray(submittedIds) ? submittedIds.map((id) => String(id ?? '').trim()) : null;
  if (!pageIds || pageIds.some((id) => !id) || new Set(pageIds).size !== pageIds.length) {
    return res.status(400).json({ message: 'طلب ترتيب الصفحات غير صالح: قائمة pageIds مفقودة أو تحتوي معرفات فارغة أو مكررة' });
  }
  try {
    const { state } = await mutateMenuState((latestState) => {
      const visiblePages = latestState.pages.filter((page) => page.ready !== false);
      if (pageIds.length !== visiblePages.length || pageIds.some((id) => !visiblePages.some((page) => page.id === id))) {
        throw new Error('تغيرت قائمة الصفحات؛ حدّث الصفحة وحاول مرة أخرى');
      }
      const reordered = new Map(visiblePages.map((page) => [page.id, page]));
      const orderedVisiblePages = pageIds.map((id) => reordered.get(id));
      let visibleIndex = 0;
      latestState.pages = latestState.pages.map((page) => page.ready === false ? page : orderedVisiblePages[visibleIndex++]);
    }, 'Reorder menu pages');
    res.json({ success: true, pages: state.pages.filter((page) => page.ready !== false), updatedAt: state.updatedAt || null });
  } catch (error) {
    const status = error.message === 'تغيرت قائمة الصفحات؛ حدّث الصفحة وحاول مرة أخرى' ? 409 : 500;
    res.status(status).json({ message: error.message || 'تعذر حفظ ترتيب الصفحات' });
  }
});

app.put('/api/pages/:id', auth, async (req, res) => {
  const state = await readState({ fresh: true });
  const page = state.pages.find((item) => item.id === req.params.id);
  if (!page) return res.status(400).json({ message: 'بيانات الصفحة غير صحيحة' });
  let nextSvg = req.body.svg;
  if (Array.isArray(req.body.changes)) {
    page.changes = req.body.changes;
    nextSvg = null;
  }
  if (nextSvg !== null && (typeof nextSvg !== 'string' || !/^\s*<svg\b[\s\S]*<\/svg>\s*$/i.test(nextSvg))) return res.status(400).json({ message: 'المحتوى الناتج ليس SVG صالحًا' });
  if (isVercel && (!githubToken || !githubRepository)) return res.status(503).json({ message: 'إعدادات GitHub غير مكتملة في Vercel' });
  if (!isVercel && nextSvg !== null) await fs.writeFile(path.join(uploadDir, page.fileName), nextSvg);
  if (nextSvg !== null) await commitToGitHub(`uploads/${page.fileName}`, nextSvg, `Update menu page ${page.name}`);
  const { value: updatedPage } = await mutateMenuState((latestState) => {
    const latestPage = latestState.pages.find((item) => item.id === req.params.id);
    if (!latestPage) throw new Error('الصفحة لم تعد موجودة؛ حدّث القائمة وحاول مرة أخرى');
    if (Array.isArray(req.body.changes)) latestPage.changes = req.body.changes;
    if (typeof req.body.name === 'string' && req.body.name.trim()) latestPage.name = req.body.name.trim();
    latestPage.updatedAt = new Date().toISOString();
    return latestPage;
  }, `Update menu metadata for ${page.name}`);
  try {
    const { syncIndexHtml } = require('./tools/syncIndexHtml');
    syncIndexHtml();
    const updatedIndex = await fs.readFile(path.join(root, 'public', 'index.html'), 'utf8');
    await commitToGitHub('public/index.html', updatedIndex, `Sync GEO and Schema.org for ${updatedPage.name}`);
  } catch (syncErr) {
    console.error('Failed to sync index.html on update:', syncErr.message);
  }
  res.json({ success: true, page: updatedPage });
});

app.delete('/api/pages/:id', auth, async (req, res) => {
  if (isVercel && (!githubToken || !githubRepository)) return res.status(503).json({ message: 'إعدادات GitHub غير مكتملة في Vercel' });
  let page;
  if (githubToken && githubRepository) {
    page = await deleteMenuPageFromGitHub(req.params.id);
    if (!page) return res.sendStatus(404);
    if (!isVercel) {
      for (const assetPath of pageAssetPaths(page)) {
        await fs.rm(path.join(root, assetPath), { force: true });
      }
      const localState = JSON.parse(await fs.readFile(stateFile, 'utf8'));
      localState.pages = localState.pages.filter((item) => item.id !== page.id);
      localState.updatedAt = new Date().toISOString();
      await fs.writeFile(stateFile, JSON.stringify(localState, null, 2));
    }
  } else {
    try {
      ({ value: page } = await mutateMenuState((state) => {
        const pageIndex = state.pages.findIndex((item) => item.id === req.params.id);
        if (pageIndex < 0) throw new Error('الصفحة غير موجودة أو سبق حذفها');
        return state.pages.splice(pageIndex, 1)[0];
      }, 'Delete menu page'));
    } catch (error) {
      if (error.message === 'الصفحة غير موجودة أو سبق حذفها') return res.sendStatus(404);
      throw error;
    }
    for (const assetPath of pageAssetPaths(page)) {
      await fs.rm(path.join(root, assetPath), { force: true });
    }
  }
  res.json({ success: true });
});

app.get('/api/pages/:id/download', auth, async (req, res) => {
  try {
    const state = await readState({ fresh: true });
    const page = state.pages.find((item) => item.id === req.params.id);
    if (!page) return res.sendStatus(404);
    const safeName = (page.name.replace(/[^w؀-ۿ -]/g, '') || 'menu-page') + '.svg';
    res.set({
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Content-Disposition': "attachment; filename*=UTF-8''" + encodeURIComponent(safeName),
      'Cache-Control': 'no-store'
    });
    const source = isVercel && githubToken && githubRepository
      ? await readFromGitHub(`uploads/${page.fileName}`)
      : await fs.readFile(path.join(uploadDir, page.fileName), 'utf8');
    if (typeof source !== 'string') return res.sendStatus(404);
    res.end(page.changes?.length ? applyTextChanges(source, page.changes) : source);
  } catch (error) {
    console.error('SVG download failed:', error);
    res.status(error.code === 'ENOENT' ? 404 : 500).end('تعذر تحميل ملف الصفحة');
  }
});


// POST /api/upload/blob — store one chunk as a GitHub Git blob, returns SHA
app.post('/api/upload/blob', auth, async (req, res) => {
  if (!githubToken || !githubRepository) return res.status(503).json({ message: 'إعدادات GitHub غير مكتملة' });
  const { data } = req.body;
  if (typeof data !== 'string' || !data) return res.status(400).json({ message: 'بيانات الجزء غير صالحة' });
  try {
    const response = await fetch(`https://api.github.com/repos/${githubRepository}/git/blobs`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${githubToken}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: data, encoding: 'base64' })
    });
    if (!response.ok) { const e = await response.json().catch(() => ({})); throw new Error(e.message || `GitHub ${response.status}`); }
    const { sha } = await response.json();
    res.json({ sha });
  } catch (err) { res.status(500).json({ message: err.message || 'فشل تخزين الجزء' }); }
});

// POST /api/upload/finalize — reassemble blobs into an SVG page
app.post('/api/upload/finalize', auth, async (req, res) => {
  const { name, originalName, blobs } = req.body;
  if (!Array.isArray(blobs) || !blobs.length) return res.status(400).json({ message: 'لا توجد أجزاء للتجميع' });
  if (!githubToken || !githubRepository) return res.status(503).json({ message: 'إعدادات GitHub غير مكتملة' });
  try {
    const parts = await Promise.all(blobs.map(async (sha) => {
      const r = await fetch(`https://api.github.com/repos/${githubRepository}/git/blobs/${sha}`, {
        headers: { Authorization: `Bearer ${githubToken}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' }
      });
      if (!r.ok) throw new Error(`فشل قراءة الجزء ${sha}`);
      const b = await r.json();
      return Buffer.from(b.content.replace(/\s/g, ''), 'base64');
    }));
    const fullBuffer = Buffer.concat(parts);
    const svgs = splitSvgFile(fullBuffer);
    const created = [];
    const pageName = ((name || originalName || 'منيو').trim());
    for (let index = 0; index < svgs.length; index++) {
      const id = crypto.randomUUID();
      const fileName = `${id}.svg`;
      const page = { id, name: svgs.length > 1 ? `${pageName} - صفحة ${index + 1}` : pageName, fileName, createdAt: new Date().toISOString(), ready: false };
      if (!isVercel) await fs.writeFile(path.join(uploadDir, fileName), svgs[index]);
      await commitToGitHub(`uploads/${fileName}`, svgs[index], `Add menu page ${page.name}`);
      created.push(page);
    }
    await mutateMenuState((state) => {
      state.pages ||= [];
      state.pages.push(...created);
    }, 'Register uploaded menu pages');
    res.json({ success: true, count: created.length, pages: created });
  } catch (error) { res.status(500).json({ message: error.message || 'فشل تجميع الملف' }); }
});

app.get('/admin', (req, res) => {
  res.setHeader('X-Robots-Tag', 'noindex, nofollow, noarchive');
  res.sendFile(path.join(root, 'public', 'admin.html'));
});
app.get('*', (req, res) => res.sendFile(path.join(root, 'public', 'index.html')));

app.use((error, req, res, next) => {
  console.error('Unhandled request error:', error);
  if (res.headersSent) return next(error);
  res.status(500).json({ message: 'حدث خطأ داخلي أثناء معالجة الطلب' });
});

if (require.main === module) ensureStore().then(() => app.listen(port, () => console.log(`Fale7 Menu Studio running on http://localhost:${port}`)));

module.exports = app;
