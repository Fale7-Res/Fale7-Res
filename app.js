const express = require("express");
const session = require("express-session");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const { put, del, list } = require('@vercel/blob');
const { handleUpload } = require('@vercel/blob/client');
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
const LOGO_FILE_PATHS = [
  path.join(PUBLIC_DIR, 'Logo.png'),
  path.join(PUBLIC_DIR, 'logo.png'),
];
const resolveLogoPath = () => LOGO_FILE_PATHS.find((filePath) => fs.existsSync(filePath));
const AUTH_CONFIG_READY = Boolean(SESSION_SECRET && COOKIE_SECRET && ADMIN_PASSWORD);

if (!AUTH_CONFIG_READY) {
  console.warn('Admin authentication env vars are missing. Public pages and static assets will still work.');
}

app.get('/Logo.png', (req, res, next) => {
  const logoPath = resolveLogoPath();
  if (!logoPath) {
    return next();
  }

  res.sendFile(logoPath);
});

app.get('/favicon.ico', (req, res) => {
  const logoPath = resolveLogoPath();
  if (!logoPath) {
    return res.status(204).end();
  }

  res.sendFile(logoPath);
});

// Static assets should be served before auth checks/routes.
app.use(express.static(PUBLIC_DIR));

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

// Ø¥Ø¹Ø¯Ø§Ø¯ Ø§Ù„Ø¬Ù„Ø³Ø©
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

// Ø§Ø³ØªÙ‚Ø¨Ø§Ù„ Ø¨ÙŠØ§Ù†Ø§Øª POST
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

// Ø¥Ø¹Ø¯Ø§Ø¯ Ø±ÙØ¹ Ø§Ù„Ù…Ù†ÙŠÙˆ Ø¨Ø§Ø³ØªØ®Ø¯Ø§Ù… Ø§Ù„Ø°Ø§ÙƒØ±Ø© Ø¨Ø¯Ù„Ø§Ù‹ Ù…Ù† Ø§Ù„Ù‚Ø±Øµ
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    // Ø§Ù„Ø³Ù…Ø§Ø­ Ø¨Ø±ÙØ¹ Ù…Ù„ÙØ§Øª PDF ÙƒØ¨ÙŠØ±Ø© Ù†Ø³Ø¨ÙŠÙ‹Ø§
    fileSize: 50 * 1024 * 1024,
  },
});

const getBlobOptions = () => process.env.BLOB_READ_WRITE_TOKEN ? { token: process.env.BLOB_READ_WRITE_TOKEN } : {};

const getBlobByPathname = async (pathname) => {
  const blobOptions = getBlobOptions();
  const { blobs } = await list({ prefix: pathname, limit: 10, ...blobOptions });
  return blobs.find((blob) => blob.pathname === pathname) || null;
};

const getPageData = async (pathname) => {
  const blob = await getBlobByPathname(pathname);
  if (!blob) {
    return { exists: false, url: null };
  }

  return {
    exists: true,
    url: `${blob.url}?v=${menuVersion}`,
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

// ØªÙˆØ²ÙŠØ¹ Ø§Ù„Ù…Ù„ÙØ§Øª Ø§Ù„Ø«Ø§Ø¨ØªØ© Ù…Ù† Ù…Ø¬Ù„Ø¯ public (ØµÙˆØ±ØŒ ØªØ­Ù‚Ù‚ Ø¬ÙˆØ¬Ù„ØŒ ...Ø¥Ù„Ø®)

// Ø§Ù„Ù…Ø³Ø§Ø±Ø§Øª
app.get("/", async (req, res) => {
  try {
    const menuData = await getMenuViewData();
    res.set('X-Robots-Tag', 'index, follow');
    res.send(views.menu({ ...menuData, canonicalUrl: `${SITE_URL}/`, indexable: true }));
  } catch (error) {
    console.error('Ø®Ø·Ø£ ÙÙŠ Ø§Ù„ØªØ­Ù‚Ù‚ Ù…Ù† Blob:', error);
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
    res.send(views.login({ error: "ÙƒÙ„Ù…Ø© Ø§Ù„Ù…Ø±ÙˆØ± ØºÙŠØ± ØµØ­ÙŠØ­Ø©" }));
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
        message: 'Ø­Ø¬Ù… Ù…Ù„Ù Ø§Ù„Ù…Ù†ÙŠÙˆ ÙƒØ¨ÙŠØ± Ø¬Ø¯Ù‹Ø§. Ø§Ù„Ø­Ø¯ Ø§Ù„Ø£Ù‚ØµÙ‰ 50MB.',
      });
    }

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'ØªØ¹Ø°Ø± Ù‚Ø±Ø§Ø¡Ø© Ø§Ù„Ù…Ù„Ù Ø§Ù„Ù…Ø±ÙÙˆØ¹. ØªØ£ÙƒØ¯ Ø£Ù†Ù‡ PDF ØµØ§Ù„Ø­.',
      });
    }

    next();
  });
}, async (req, res) => {
  if (!isAuthenticated(req)) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!req.file) {
    return res.status(400).json({ success: false, message: "Ù„Ù… ÙŠØªÙ… Ø±ÙØ¹ Ø£ÙŠ Ù…Ù„Ù." });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(500).json({ success: false, message: "BLOB_READ_WRITE_TOKEN ØºÙŠØ± Ù…ÙˆØ¬ÙˆØ¯Ø© ÙÙŠ Ù…ØªØºÙŠØ±Ø§Øª Ø§Ù„Ø¨ÙŠØ¦Ø©." });
  }

  try {
    const blobOptions = getBlobOptions();

    const existingMenu = await getBlobByPathname(STATIC_PAGE_FILES.menu);
    if (existingMenu) {
      await del(existingMenu.pathname, blobOptions);
      console.log('Existing menu.pdf deleted from Blob storage');
    }

    const result = await put(STATIC_PAGE_FILES.menu, req.file.buffer, {
      access: 'public',
      addRandomSuffix: false,
      ...blobOptions,
    });

    menuVersion = Date.now();
    return res.json({ success: true, message: "Menu uploaded.", url: result.url });
  } catch (error) {
    console.error('Ø®Ø·Ø£ ÙÙŠ Ø±ÙØ¹ Ø§Ù„Ù…Ù„Ù Ø¥Ù„Ù‰ Blob:', error);
    return res.status(500).json({ success: false, message: "Ø®Ø·Ø£ ÙÙŠ Ø±ÙØ¹ Ø§Ù„Ù…Ù†ÙŠÙˆ." });
  }
});

app.post('/api/blob-upload', async (req, res) => {
  if (!isAuthenticated(req)) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return res.status(500).json({ error: 'Missing BLOB_READ_WRITE_TOKEN environment variable.' });
  }

  try {
    const jsonResponse = await handleUpload({
      body: req.body,
      request: req,
      token: process.env.BLOB_READ_WRITE_TOKEN,
      onBeforeGenerateToken: async (pathname) => {
        if (!Object.values(STATIC_PAGE_FILES).includes(pathname)) {
          throw new Error('Pathname ØºÙŠØ± Ù…Ø³Ù…ÙˆØ­ Ù„Ù„Ø±ÙØ¹.');
        }

        await deleteBlobByPathname(pathname);

        return {
          allowedContentTypes: ['application/pdf'],
          maximumSizeInBytes: 50 * 1024 * 1024,
          addRandomSuffix: false,
        };
      },
      onUploadCompleted: async () => {
        menuVersion = Date.now();
      },
    });

    return res.status(200).json(jsonResponse);
  } catch (error) {
    console.error('Ø®Ø·Ø£ ÙÙŠ Ø¥Ù†Ø´Ø§Ø¡ ØªÙˆÙƒÙ† Ø±ÙØ¹ Blob:', error);
    return res.status(400).json({ error: 'ÙØ´Ù„ Ø±ÙØ¹ Ø§Ù„Ù…Ù„Ù Ù…Ø¨Ø§Ø´Ø±Ø©.' });
  }
});

app.post('/delete-page', async (req, res) => {
  if (!isAuthenticated(req)) {
    return res.status(401).json({ success: false, message: 'Unauthorized' });
  }

  const pageType = req.body.pageType;
  const pathname = STATIC_PAGE_FILES[pageType];

  if (!pathname) {
    return res.status(400).json({ success: false, message: 'Ù†ÙˆØ¹ Ø§Ù„ØµÙØ­Ø© ØºÙŠØ± ØµØ§Ù„Ø­.' });
  }

  try {
    const removed = await deleteBlobByPathname(pathname);
    return res.json({
      success: true,
      message: removed ? 'ØªÙ… Ø­Ø°Ù Ø§Ù„ØµÙØ­Ø© Ø¨Ù†Ø¬Ø§Ø­.' : 'Ø§Ù„ØµÙØ­Ø© ØºÙŠØ± Ù…ÙˆØ¬ÙˆØ¯Ø© Ø¨Ø§Ù„ÙØ¹Ù„.',
    });
  } catch (error) {
    console.error('Ø®Ø·Ø£ ÙÙŠ Ø­Ø°Ù Ø§Ù„ØµÙØ­Ø©:', error);
    return res.status(500).json({ success: false, message: 'Ø­Ø¯Ø« Ø®Ø·Ø£ Ø£Ø«Ù†Ø§Ø¡ Ø­Ø°Ù Ø§Ù„ØµÙØ­Ø©.' });
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
      title: 'Ø¹Ø±ÙˆØ¶ ÙØ§Ù„Ø­ Ø£Ø¨Ùˆ Ø§Ù„Ø¹Ù†Ø¨Ù‡',
      canonicalUrl: `${SITE_URL}/`,
      pageExists: offersData.exists,
      pageUrl: offersData.url,
      menuUrl: menuData.menuUrl,
      offersExists: menuData.offersExists,
      suhoorExists: menuData.suhoorExists,
      pageType: 'offers',
      indexable: false,
      metaDescription: 'ØªØ§Ø¨Ø¹ Ø£Ø­Ø¯Ø« Ø¹Ø±ÙˆØ¶ Ù…Ø·Ø¹Ù… ÙØ§Ù„Ø­ Ø£Ø¨Ùˆ Ø§Ù„Ø¹Ù†Ø¨Ù‡ ÙÙŠ 6 Ø£ÙƒØªÙˆØ¨Ø±ØŒ Ù…ØµØ±ØŒ Ù…Ø¹ ØªØ­Ø¯ÙŠØ«Ø§Øª Ù…Ø³ØªÙ…Ø±Ø© Ù„Ù„Ø¹Ø±ÙˆØ¶ Ø§Ù„Ù…ØªØ§Ø­Ø©.',
      emptyTitle: 'Ù„Ø§ ØªÙˆØ¬Ø¯ Ø¹Ø±ÙˆØ¶ Ù…ØªØ§Ø­Ø© Ø­Ø§Ù„ÙŠØ§Ù‹',
      emptyText: 'ÙŠÙ…ÙƒÙ†Ùƒ Ù…ØªØ§Ø¨Ø¹Ø© Ø§Ù„ØµÙØ­Ø© Ù„Ø§Ø­Ù‚Ø§Ù‹ Ù„Ù…Ø¹Ø±ÙØ© Ø£Ø­Ø¯Ø« Ø§Ù„Ø¹Ø±ÙˆØ¶.',
    }));
  } catch (error) {
    console.error('Ø®Ø·Ø£ ÙÙŠ ØªØ­Ù…ÙŠÙ„ ØµÙØ­Ø© Ø§Ù„Ø¹Ø±ÙˆØ¶:', error);
    res.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    res.send(views.pdfPage({
      title: 'Ø¹Ø±ÙˆØ¶ ÙØ§Ù„Ø­ Ø£Ø¨Ùˆ Ø§Ù„Ø¹Ù†Ø¨Ù‡',
      canonicalUrl: `${SITE_URL}/`,
      pageExists: false,
      offersExists: false,
      suhoorExists: false,
      pageType: 'offers',
      indexable: false,
      metaDescription: 'ØªØ§Ø¨Ø¹ Ø£Ø­Ø¯Ø« Ø¹Ø±ÙˆØ¶ Ù…Ø·Ø¹Ù… ÙØ§Ù„Ø­ Ø£Ø¨Ùˆ Ø§Ù„Ø¹Ù†Ø¨Ù‡ ÙÙŠ 6 Ø£ÙƒØªÙˆØ¨Ø±ØŒ Ù…ØµØ±ØŒ Ù…Ø¹ ØªØ­Ø¯ÙŠØ«Ø§Øª Ù…Ø³ØªÙ…Ø±Ø© Ù„Ù„Ø¹Ø±ÙˆØ¶ Ø§Ù„Ù…ØªØ§Ø­Ø©.',
      emptyTitle: 'Ù„Ø§ ØªÙˆØ¬Ø¯ Ø¹Ø±ÙˆØ¶ Ù…ØªØ§Ø­Ø© Ø­Ø§Ù„ÙŠØ§Ù‹',
      emptyText: 'ÙŠÙ…ÙƒÙ†Ùƒ Ù…ØªØ§Ø¨Ø¹Ø© Ø§Ù„ØµÙØ­Ø© Ù„Ø§Ø­Ù‚Ø§Ù‹ Ù„Ù…Ø¹Ø±ÙØ© Ø£Ø­Ø¯Ø« Ø§Ù„Ø¹Ø±ÙˆØ¶.',
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
      title: 'Ù…Ù†ÙŠÙˆ Ø§Ù„Ø³Ø­ÙˆØ± | ÙØ§Ù„Ø­ Ø£Ø¨Ùˆ Ø§Ù„Ø¹Ù†Ø¨Ù‡',
      canonicalUrl: `${SITE_URL}/`,
      pageExists: suhoorData.exists,
      pageUrl: suhoorData.url,
      menuUrl: menuData.menuUrl,
      offersExists: menuData.offersExists,
      suhoorExists: menuData.suhoorExists,
      pageType: 'suhoor',
      indexable: false,
      metaDescription: 'Ù…Ù†ÙŠÙˆ Ø§Ù„Ø³Ø­ÙˆØ± ÙÙŠ Ù…Ø·Ø¹Ù… ÙØ§Ù„Ø­ Ø£Ø¨Ùˆ Ø§Ù„Ø¹Ù†Ø¨Ù‡: Ø§Ø®ØªÙŠØ§Ø±Ø§Øª Ù…ØªÙ†ÙˆØ¹Ø© Ù…Ù†Ø§Ø³Ø¨Ø© Ù„ÙØªØ±Ø© Ø§Ù„Ø³Ø­ÙˆØ± Ù…Ø¹ ØªØ­Ø¯ÙŠØ«Ø§Øª Ù…Ø³ØªÙ…Ø±Ø©.',
      emptyTitle: 'Ù…Ù†ÙŠÙˆ Ø§Ù„Ø³Ø­ÙˆØ± ØºÙŠØ± Ù…ØªÙˆÙØ± Ø­Ø§Ù„ÙŠØ§Ù‹',
      emptyText: 'Ø³ÙŠØªÙ… Ù†Ø´Ø± Ù…Ù†ÙŠÙˆ Ø§Ù„Ø³Ø­ÙˆØ± Ù‡Ù†Ø§ Ø¹Ù†Ø¯ Ø§Ù„ØªÙØ¹ÙŠÙ„ Ù…Ù† Ù„ÙˆØ­Ø© Ø§Ù„ØªØ­ÙƒÙ….',
    }));
  } catch (error) {
    console.error('Ø®Ø·Ø£ ÙÙŠ ØªØ­Ù…ÙŠÙ„ ØµÙØ­Ø© Ø§Ù„Ø³Ø­ÙˆØ±:', error);
    res.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    res.send(views.pdfPage({
      title: 'Ù…Ù†ÙŠÙˆ Ø§Ù„Ø³Ø­ÙˆØ± | ÙØ§Ù„Ø­ Ø£Ø¨Ùˆ Ø§Ù„Ø¹Ù†Ø¨Ù‡',
      canonicalUrl: `${SITE_URL}/`,
      pageExists: false,
      offersExists: false,
      suhoorExists: false,
      pageType: 'suhoor',
      indexable: false,
      metaDescription: 'Ù…Ù†ÙŠÙˆ Ø§Ù„Ø³Ø­ÙˆØ± ÙÙŠ Ù…Ø·Ø¹Ù… ÙØ§Ù„Ø­ Ø£Ø¨Ùˆ Ø§Ù„Ø¹Ù†Ø¨Ù‡: Ø§Ø®ØªÙŠØ§Ø±Ø§Øª Ù…ØªÙ†ÙˆØ¹Ø© Ù…Ù†Ø§Ø³Ø¨Ø© Ù„ÙØªØ±Ø© Ø§Ù„Ø³Ø­ÙˆØ± Ù…Ø¹ ØªØ­Ø¯ÙŠØ«Ø§Øª Ù…Ø³ØªÙ…Ø±Ø©.',
      emptyTitle: 'Ù…Ù†ÙŠÙˆ Ø§Ù„Ø³Ø­ÙˆØ± ØºÙŠØ± Ù…ØªÙˆÙØ± Ø­Ø§Ù„ÙŠØ§Ù‹',
      emptyText: 'Ø³ÙŠØªÙ… Ù†Ø´Ø± Ù…Ù†ÙŠÙˆ Ø§Ù„Ø³Ø­ÙˆØ± Ù‡Ù†Ø§ Ø¹Ù†Ø¯ Ø§Ù„ØªÙØ¹ÙŠÙ„ Ù…Ù† Ù„ÙˆØ­Ø© Ø§Ù„ØªØ­ÙƒÙ….',
    }));
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.clearCookie(AUTH_COOKIE_NAME, { path: '/' });
    res.redirect("/login");
  });
});

// Ø§Ø³ØªÙŠØ±Ø§Ø¯ Ø§Ù„Ù‚ÙˆØ§Ù„Ø¨ Ù…Ù† Ù…Ù„Ù views.js
const views = require('./views');

app.listen(PORT, HOSTNAME, () => {
  console.log(`ðŸš€ Ø´ØºØ§Ù„ Ø¹Ù„Ù‰ http://localhost:${PORT}`);
});

