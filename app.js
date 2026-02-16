const express = require("express");
const session = require("express-session");
const multer = require("multer");
const path = require("path");
const cookieParser = require("cookie-parser");
const { put, del, list } = require('@vercel/blob');
require("dotenv").config();

const app = express();

// A simple in-memory cache-busting version key.
let menuVersion = Date.now();

const STATIC_PAGE_FILES = {
  menu: 'menu.pdf',
  offers: 'offers.pdf',
  suhoor: 'suhoor.pdf',
};

// Helper to parse command-line arguments
const args = process.argv.slice(2).reduce((acc, arg, index, arr) => {
  if (arg.startsWith('--')) {
    const key = arg.substring(2);
    const next = arr[index + 1];
    if (next && !next.startsWith('--')) {
      acc[key] = next;
    } else {
      acc[key] = true;
    }
  }
  return acc;
}, {});

const PORT = args.port || process.env.PORT || 3000;
const HOSTNAME = args.hostname || '0.0.0.0';
const IS_PROD = process.env.NODE_ENV === 'production';
const AUTH_COOKIE_NAME = 'fale7_admin_auth';
const SESSION_SECRET = process.env.SESSION_SECRET;
const COOKIE_SECRET = process.env.COOKIE_SECRET;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const SITE_URL = 'https://fale7-res.vercel.app';
const PUBLIC_DIR = path.join(__dirname, 'public');
const AUTH_CONFIG_READY = Boolean(SESSION_SECRET && COOKIE_SECRET && ADMIN_PASSWORD);

if (!AUTH_CONFIG_READY) {
  console.warn('Admin authentication env vars are missing. Public pages and static assets will still work.');
}

// Static assets should be served before auth checks/routes.
app.use(express.static(PUBLIC_DIR));

// Browser fallback requests for root favicon paths.
app.get('/favicon.ico', (req, res) => {
  res.redirect(301, '/assets/favicon.ico');
});

app.get('/favicon.png', (req, res) => {
  res.redirect(301, '/assets/favicon.png');
});

const getAuthCookieOptions = () => ({
  httpOnly: true,
  sameSite: 'lax',
  secure: IS_PROD,
  signed: true,
  path: '/',
});

const isAuthenticated = (req) => (
  Boolean(req.session?.loggedIn) || req.signedCookies?.[AUTH_COOKIE_NAME] === '1'
);

// إعداد الجلسة
app.use(cookieParser(COOKIE_SECRET));
if (SESSION_SECRET) {
  app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
      httpOnly: true,
      sameSite: 'lax',
      secure: IS_PROD,
    },
  }));
}

// استقبال بيانات POST
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
  const privatePath = req.path === '/login'
    || req.path === '/admin'
    || req.path === '/upload'
    || req.path === '/delete-page'
    || req.path === '/logout'
    || req.path.startsWith('/api/');

  if (privatePath) {
    res.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    if (!AUTH_CONFIG_READY) {
      return res.status(503).send('Admin authentication is not configured.');
    }
  }

  next();
});

// إعداد رفع المنيو باستخدام الذاكرة بدلاً من القرص
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    // السماح برفع ملفات PDF كبيرة نسبيًا (200MB)
    fileSize: 200 * 1024 * 1024,
  },
});

const getBlobOptions = () => process.env.BLOB_READ_WRITE_TOKEN ? { token: process.env.BLOB_READ_WRITE_TOKEN } : {};

const getBlobByPathname = async (pathname) => {
  try {
    const blobOptions = getBlobOptions();
    const { blobs } = await list({ prefix: pathname, limit: 10, ...blobOptions });
    return blobs.find((blob) => blob.pathname === pathname) || null;
  } catch (error) {
    console.error('Error listing blobs:', error.message);
    throw error;
  }
};

const withCacheVersion = (rawUrl) => {
  if (!rawUrl) return null;
  try {
    const parsed = new URL(rawUrl);
    parsed.searchParams.set('v', String(menuVersion));
    return parsed.toString();
  } catch {
    const separator = rawUrl.includes('?') ? '&' : '?';
    return `${rawUrl}${separator}v=${menuVersion}`;
  }
};

const getPageData = async (pathname) => {
  const blob = await getBlobByPathname(pathname);
  if (!blob) {
    return { exists: false, url: null };
  }

  // Determine the pageType from the pathname
  let pageType = 'menu';
  if (pathname === STATIC_PAGE_FILES.offers) pageType = 'offers';
  if (pathname === STATIC_PAGE_FILES.suhoor) pageType = 'suhoor';

  // Return a proxy URL that the server will handle
  const proxyUrl = `/api/pdf/${pageType}?v=${menuVersion}`;
  return {
    exists: true,
    url: proxyUrl,
  };
};

const getMenuViewData = async () => {
  const [menuData, offersData, suhoorData] = await Promise.all([
    getPageData(STATIC_PAGE_FILES.menu),
    getPageData(STATIC_PAGE_FILES.offers),
    getPageData(STATIC_PAGE_FILES.suhoor),
  ]);

  return {
    menuExists: menuData.exists,
    menuUrl: menuData.url,
    offersExists: offersData.exists,
    offersUrl: offersData.url,
    suhoorExists: suhoorData.exists,
    suhoorUrl: suhoorData.url,
  };
};

const deleteBlobByPathname = async (pathname) => {
  const blob = await getBlobByPathname(pathname);
  if (!blob) {
    return false;
  }

  await del(blob.pathname, getBlobOptions());
  menuVersion = Date.now();
  return true;
};

// توزيع الملفات الثابتة من مجلد public (صور، تحقق جوجل، ...إلخ)

// المسارات
app.get("/", async (req, res) => {
  try {
    const menuData = await getMenuViewData();
    res.set('X-Robots-Tag', 'index, follow');
    res.send(views.menu({ ...menuData, canonicalUrl: `${SITE_URL}/`, indexable: true }));
  } catch (error) {
    console.error('خطأ في التحقق من Blob:', error);
    res.set('X-Robots-Tag', 'index, follow');
    res.send(views.menu({ menuExists: false, offersExists: false, suhoorExists: false, canonicalUrl: `${SITE_URL}/`, indexable: true }));
  }
});

app.get("/login", (req, res) => {
  res.send(views.login({ error: null }));
});

app.post("/login", (req, res) => {
  if (req.body.password === ADMIN_PASSWORD) {
    req.session.loggedIn = true;
    res.cookie(AUTH_COOKIE_NAME, '1', getAuthCookieOptions());
    res.redirect("/admin");
  } else {
    res.send(views.login({ error: "كلمة المرور غير صحيحة" }));
  }
});

app.get("/admin", (req, res) => {
  if (isAuthenticated(req)) {
    res.send(views.admin());
  } else {
    res.redirect("/login");
  }
});

app.post("/upload", (req, res, next) => {
  upload.single("menu")(req, res, (error) => {
    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        success: false,
        message: 'حجم ملف المنيو كبير جدًا. الحد الأقصى 200MB.',
      });
    }

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'تعذر قراءة الملف المرفوع. تأكد أنه PDF صالح.',
      });
    }

    next();
  });
}, async (req, res) => {
  if (!isAuthenticated(req)) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!req.file) {
    return res.status(400).json({ success: false, message: "لم يتم رفع أي ملف." });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(500).json({ success: false, message: "BLOB_READ_WRITE_TOKEN is missing in environment variables." });
  }

  const pageType = req.body.pageType || 'menu';
  const pathname = STATIC_PAGE_FILES[pageType];
  if (!pathname) {
    return res.status(400).json({ success: false, message: "Invalid page type." });
  }

  try {
    const blobOptions = getBlobOptions();

    const existingBlob = await getBlobByPathname(pathname);
    if (existingBlob) {
      await del(existingBlob.pathname, blobOptions);
      console.log(`Existing ${pathname} deleted from Blob storage`);
    }

    const result = await put(pathname, req.file.buffer, {
      access: 'public',
      addRandomSuffix: false,
      ...blobOptions,
    });

    menuVersion = Date.now();
    return res.json({ success: true, message: "Page uploaded.", url: result.url });
  } catch (error) {
    console.error('خطأ في رفع الملف إلى Blob:', error);
    console.error('Error details:', error.message, error.stack);
    return res.status(500).json({ success: false, message: "خطأ في رفع المنيو." });
  }
});

app.post('/delete-page', async (req, res) => {
  if (!isAuthenticated(req)) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const pageType = req.body.pageType;
  const pathname = STATIC_PAGE_FILES[pageType];

  if (!pathname) {
    return res.status(400).json({ success: false, message: 'نوع الصفحة غير صالح.' });
  }

  try {
    const removed = await deleteBlobByPathname(pathname);
    return res.json({
      success: true,
      message: removed ? 'تم حذف الصفحة بنجاح.' : 'الصفحة غير موجودة بالفعل.',
    });
  } catch (error) {
    console.error('خطأ في حذف الصفحة:', error);
    return res.status(500).json({ success: false, message: 'حدث خطأ أثناء حذف الصفحة.' });
  }
});

app.get("/menu", (req, res) => {
  res.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  res.redirect(301, "/");
});

app.get('/offers', async (req, res) => {
  try {
    const [offersData, menuData] = await Promise.all([
      getPageData(STATIC_PAGE_FILES.offers),
      getMenuViewData(),
    ]);
    res.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    res.send(views.pdfPage({
      title: 'عروض فالح أبو العنبه',
      canonicalUrl: `${SITE_URL}/`,
      pageExists: offersData.exists,
      pageUrl: offersData.url,
      menuUrl: menuData.menuUrl,
      offersExists: menuData.offersExists,
      suhoorExists: menuData.suhoorExists,
      pageType: 'offers',
      indexable: false,
      metaDescription: 'تابع أحدث عروض مطعم فالح أبو العنبه في 6 أكتوبر، مصر، مع تحديثات مستمرة للعروض المتاحة.',
      emptyTitle: 'لا توجد عروض متاحة حالياً',
      emptyText: 'يمكنك متابعة الصفحة لاحقاً لمعرفة أحدث العروض.',
    }));
  } catch (error) {
    console.error('خطأ في تحميل صفحة العروض:', error);
    res.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    res.send(views.pdfPage({
      title: 'عروض فالح أبو العنبه',
      canonicalUrl: `${SITE_URL}/`,
      pageExists: false,
      offersExists: false,
      suhoorExists: false,
      pageType: 'offers',
      indexable: false,
      metaDescription: 'تابع أحدث عروض مطعم فالح أبو العنبه في 6 أكتوبر، مصر، مع تحديثات مستمرة للعروض المتاحة.',
      emptyTitle: 'لا توجد عروض متاحة حالياً',
      emptyText: 'يمكنك متابعة الصفحة لاحقاً لمعرفة أحدث العروض.',
    }));
  }
});

app.get('/suhoor', async (req, res) => {
  try {
    const [suhoorData, menuData] = await Promise.all([
      getPageData(STATIC_PAGE_FILES.suhoor),
      getMenuViewData(),
    ]);
    res.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    res.send(views.pdfPage({
      title: 'منيو السحور | فالح أبو العنبه',
      canonicalUrl: `${SITE_URL}/`,
      pageExists: suhoorData.exists,
      pageUrl: suhoorData.url,
      menuUrl: menuData.menuUrl,
      offersExists: menuData.offersExists,
      suhoorExists: menuData.suhoorExists,
      pageType: 'suhoor',
      indexable: false,
      metaDescription: 'منيو السحور في مطعم فالح أبو العنبه: اختيارات متنوعة مناسبة لفترة السحور مع تحديثات مستمرة.',
      emptyTitle: 'منيو السحور غير متوفر حالياً',
      emptyText: 'سيتم نشر منيو السحور هنا عند التفعيل من لوحة التحكم.',
    }));
  } catch (error) {
    console.error('خطأ في تحميل صفحة السحور:', error);
    res.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    res.send(views.pdfPage({
      title: 'منيو السحور | فالح أبو العنبه',
      canonicalUrl: `${SITE_URL}/`,
      pageExists: false,
      offersExists: false,
      suhoorExists: false,
      pageType: 'suhoor',
      indexable: false,
      metaDescription: 'منيو السحور في مطعم فالح أبو العنبه: اختيارات متنوعة مناسبة لفترة السحور مع تحديثات مستمرة.',
      emptyTitle: 'منيو السحور غير متوفر حالياً',
      emptyText: 'سيتم نشر منيو السحور هنا عند التفعيل من لوحة التحكم.',
    }));
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie(AUTH_COOKIE_NAME, { path: '/' });
    res.redirect("/login");
  });
});

// API endpoint to serve PDFs (proxies through server to handle auth)
app.get("/api/pdf/:pageType", async (req, res) => {
  try {
    const { pageType } = req.params;
    const pathname = STATIC_PAGE_FILES[pageType];
    
    if (!pathname) {
      return res.status(404).json({ error: "Page type not found" });
    }
    
    const blob = await getBlobByPathname(pathname);
    if (!blob) {
      return res.status(404).json({ error: "PDF not found" });
    }
    
    // Set response headers
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${pathname}"`);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    
    // Fetch and stream the blob
    const fetchResponse = await fetch(blob.url);
    
    if (!fetchResponse.ok) {
      console.error(`Blob fetch failed: ${fetchResponse.status} ${fetchResponse.statusText} for URL: ${blob.url}`);
      res.status(fetchResponse.status);
      res.send(`Error fetching PDF: ${fetchResponse.statusText}`);
      return;
    }
    
    // Stream the response body directly to the client
    const buffer = await fetchResponse.arrayBuffer();
    res.send(Buffer.from(buffer));
  } catch (error) {
    console.error('PDF proxy error:', error.message);
    res.status(500);
    res.json({ error: "Failed to load PDF", details: error.message });
  }
});

// استيراد القوالب من ملف views.js
const views = require('./views');

app.listen(PORT, HOSTNAME, () => {
  console.log(`🚀 شغال على http://localhost:${PORT}`);
});

