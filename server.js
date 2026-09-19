const express = require('express');
const session = require('express-session');
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
let stateCache = null;
let stateCacheTime = 0;

app.use(express.json({ limit: '25mb' }));
app.use(session({ secret: sessionSecret, resave: false, saveUninitialized: false }));
app.use(express.static(path.join(root, 'public')));

async function ensureStore() {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.mkdir(uploadDir, { recursive: true });
  try { await fs.access(stateFile); } catch { await fs.writeFile(stateFile, JSON.stringify({ pages: [] }, null, 2)); }
}

async function readState() {
  await ensureStore();
  if (isVercel && stateCache && Date.now() - stateCacheTime < 30000) return stateCache;
  if (isVercel && githubToken && githubRepository) {
    const remote = await readFromGitHub('data/menu.json');
    if (remote) {
      stateCache = JSON.parse(remote);
      stateCacheTime = Date.now();
      return stateCache;
    }
  }
  const state = JSON.parse(await fs.readFile(stateFile, 'utf8'));
  if (isVercel) { stateCache = state; stateCacheTime = Date.now(); }
  return state;
}

async function writeState(state) {
  if (isVercel) return;
  await fs.writeFile(stateFile, JSON.stringify({ ...state, updatedAt: new Date().toISOString() }, null, 2));
}

function splitSvgFile(buffer) {
  const source = buffer.toString('utf8').trim();
  const pages = source.match(/<svg\b[\s\S]*?<\/svg>/gi);
  if (!pages?.length) throw new Error('الملف لا يحتوي على SVG صالح');
  return pages;
}

function escapeXmlText(value) {
  return String(value).replace(/[&<>]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[character]));
}

function applyTextChanges(svg, changes) {
  if (!Array.isArray(changes) || changes.length > 500) throw new Error('قائمة التعديلات غير صحيحة');
  const values = new Map();
  for (const change of changes) {
    const index = Number.parseInt(change.index, 10);
    const value = String(change.value ?? '').trim();
    if (!Number.isInteger(index) || !value || value.length > 300) throw new Error('بيانات التعديل غير صحيحة');
    values.set(`${change.type === 'price' ? 'data-price-index' : 'data-product-index'}:${index}`, escapeXmlText(value));
  }
  return svg.replace(/(<text\b[^>]*\b(data-price-index|data-product-index)=["'](\d+)["'][^>]*>)([\s\S]*?)(<\/text>)/gi, (match, start, attribute, index, body, end) => {
    const value = values.get(`${attribute.toLowerCase()}:${index}`);
    return value === undefined ? match : `${start}${value}${end}`;
  });
}

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
    const rawUrl = `https://raw.githubusercontent.com/${githubRepository}/${encodeURIComponent(githubBranch)}/${filePath.split('/').map(encodeURIComponent).join('/')}`;
    const rawResponse = await fetch(rawUrl, { cache: 'no-store' });
    if (!rawResponse.ok) return null;
    return rawResponse.text();
  }
  const encodedPath = filePath.split('/').map(encodeURIComponent).join('/');
  const response = await fetch(`https://api.github.com/repos/${githubRepository}/contents/${encodedPath}?ref=${encodeURIComponent(githubBranch)}`, {
    headers: { Authorization: `Bearer ${githubToken}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' }
  });
  if (!response.ok) return null;
  const data = await response.json();
  return Buffer.from(data.content.replace(/\s/g, ''), 'base64').toString('utf8');
}

async function readPageSource(page) {
  try {
    return await fs.readFile(path.join(uploadDir, page.fileName), 'utf8');
  } catch {
    return isVercel && githubToken && githubRepository
      ? readFromGitHub(`uploads/${page.fileName}`)
      : null;
  }
}

async function generatePreviewFiles(page, svg) {
  const baseName = path.basename(page.fileName, path.extname(page.fileName)).replace(/[^a-zA-Z0-9_-]/g, '-');
  const previewFiles = {};
  for (const width of previewWidths) {
    const previewPath = `previews/${baseName}-${width}.webp`;
    const previewBuffer = await sharp(Buffer.from(svg))
      .resize({ width })
      .webp({ quality: 84, effort: 3 })
      .toBuffer();
    previewFiles[String(width)] = previewPath;
    if (!isVercel) {
      await fs.mkdir(path.dirname(path.join(root, previewPath)), { recursive: true });
      await fs.writeFile(path.join(root, previewPath), previewBuffer);
    }
    await commitToGitHub(previewPath, previewBuffer, `Generate WebP preview for ${page.name}`);
  }
  page.previewFiles = previewFiles;
  page.previewFile = previewFiles['1600'];
}

async function deleteFromGitHub(filePath, message) {
  if (!githubToken || !githubRepository) return;
  const encodedPath = filePath.split('/').map(encodeURIComponent).join('/');
  const headers = { Authorization: `Bearer ${githubToken}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' };
  const apiUrl = `https://api.github.com/repos/${githubRepository}/contents/${encodedPath}`;
  const current = await fetch(`${apiUrl}?ref=${encodeURIComponent(githubBranch)}`, { headers });
  if (!current.ok) return;
  const { sha } = await current.json();
  await fetch(apiUrl, { method: 'DELETE', headers: { ...headers, 'Content-Type': 'application/json' }, body: JSON.stringify({ message, sha, branch: githubBranch }) });
}

app.get('/api/menu', async (req, res) => {
  const state = await readState();
  res.json({ pages: state.pages, updatedAt: state.updatedAt || null });
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

app.get('/api/pages/:id/file', async (req, res) => {
  const state = await readState();
  const page = state.pages.find((item) => item.id === req.params.id);
  if (!page) return res.sendStatus(404);
  res.set('Cache-Control', 'public, max-age=31536000, immutable');
  if (!page.changes?.length) return res.sendFile(path.join(uploadDir, page.fileName));
  const cacheKey = `${page.id}:${page.updatedAt || ''}`;
  const cached = renderedSvgCache.get(cacheKey);
  if (cached) return res.set('Content-Type', 'image/svg+xml; charset=utf-8').end(cached);
  let source;
  try {
    source = await fs.readFile(path.join(uploadDir, page.fileName), 'utf8');
  } catch {
    source = isVercel && githubToken && githubRepository
      ? await readFromGitHub(`uploads/${page.fileName}`)
      : null;
  }
  if (typeof source !== 'string') return res.sendStatus(404);
  const file = Buffer.from(applyTextChanges(source, page.changes || []));
  renderedSvgCache.clear();
  renderedSvgCache.set(cacheKey, file);
  res.set('Content-Type', 'image/svg+xml; charset=utf-8').end(file);
});

app.get('/api/pages/:id/preview', async (req, res) => {
  const state = await readState();
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
  const state = await readState();
  const page = state.pages.find((item) => item.id === req.params.id);
  if (!page) return res.sendStatus(404);
  const requestedWidth = Number.parseInt(req.query.w, 10);
  const width = previewWidths.includes(requestedWidth) ? requestedWidth : 1600;
  const previewFile = page.previewFiles?.[String(width)] || (width === 1600 ? page.previewFile : null);
  if (!page.changes?.length && previewFile) {
    return res.sendFile(path.join(root, previewFile), { headers: { 'Cache-Control': 'public, max-age=31536000, immutable', 'Content-Type': 'image/webp' } });
  }
  let source;
  try {
    source = await fs.readFile(path.join(uploadDir, page.fileName), 'utf8');
  } catch {
    source = isVercel && githubToken && githubRepository ? await readFromGitHub(`uploads/${page.fileName}`) : null;
  }
  if (typeof source !== 'string') return res.sendStatus(404);
  const key = previewCacheKey(page, source);
  let image = previewImageCache.get(key);
  if (!image) {
    const svg = applyTextChanges(source, page.changes || []);
    image = await sharp(Buffer.from(svg)).resize({ width, withoutEnlargement: true }).webp({ quality: 84, effort: 3 }).toBuffer();
    previewImageCache.clear();
    previewImageCache.set(key, image);
  }
  res.set({ 'Cache-Control': 'public, max-age=31536000, immutable', 'Content-Type': 'image/webp' }).end(image);
});

app.put('/api/pages/:id', auth, async (req, res) => {
  const state = await readState();
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
  if (typeof req.body.name === 'string' && req.body.name.trim()) page.name = req.body.name.trim();
  page.updatedAt = new Date().toISOString();
  const source = nextSvg === null ? await readPageSource(page) : nextSvg;
  if (typeof source !== 'string') return res.status(404).json({ message: 'ملف SVG الأصلي غير موجود' });
  const renderedSvg = nextSvg === null ? applyTextChanges(source, page.changes || []) : source;
  await generatePreviewFiles(page, renderedSvg);
  await writeState(state);
  if (nextSvg !== null) await commitToGitHub(`uploads/${page.fileName}`, nextSvg, `Update menu page ${page.name}`);
  await commitToGitHub('data/menu.json', JSON.stringify({ ...state, updatedAt: new Date().toISOString() }, null, 2), `Update menu metadata for ${page.name}`);
  res.json({ success: true, page });
});

app.delete('/api/pages/:id', auth, async (req, res) => {
  const state = await readState();
  const pageIndex = state.pages.findIndex((item) => item.id === req.params.id);
  if (pageIndex < 0) return res.sendStatus(404);
  const [page] = state.pages.splice(pageIndex, 1);
  if (isVercel && (!githubToken || !githubRepository)) return res.status(503).json({ message: 'إعدادات GitHub غير مكتملة في Vercel' });
  if (!isVercel) await fs.rm(path.join(uploadDir, page.fileName), { force: true });
  await writeState(state);
  await deleteFromGitHub(`uploads/${page.fileName}`, `Delete menu page ${page.name}`);
  await commitToGitHub('data/menu.json', JSON.stringify({ ...state, updatedAt: new Date().toISOString() }, null, 2), `Delete menu page ${page.name}`);
  res.json({ success: true });
});

app.get('/api/pages/:id/download', auth, async (req, res) => {
  const state = await readState();
  const page = state.pages.find((item) => item.id === req.params.id);
  if (!page) return res.sendStatus(404);
  res.download(path.join(uploadDir, page.fileName), `${page.name.replace(/[^\\w\\u0600-\\u06ff -]/g, '') || 'menu-page'}.svg`);
});

app.get('/admin', (req, res) => res.sendFile(path.join(root, 'public', 'admin.html')));
app.get('*', (req, res) => res.sendFile(path.join(root, 'public', 'index.html')));

app.use((error, req, res, next) => {
  console.error('Unhandled request error:', error);
  if (res.headersSent) return next(error);
  res.status(500).json({ message: 'حدث خطأ داخلي أثناء معالجة الطلب' });
});

if (require.main === module) ensureStore().then(() => app.listen(port, () => console.log(`Fale7 Menu Studio running on http://localhost:${port}`)));

module.exports = app;
