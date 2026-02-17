const express = require("express");
const session = require("express-session");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const cookieParser = require("cookie-parser");
const {
  getConfig: getGithubConfig,
  resolvePdfPath,
  buildRawFileUrl,
  getFileSha,
  uploadOrUpdateFile,
  deleteFile,
  downloadFile,
} = require('./lib/githubStorage');
require("dotenv").config();

const app = express();

// A simple in-memory cache-busting version key.
let menuVersion = Date.now();

const STATIC_PAGE_FILES = {
  menu: 'menu.pdf',
  offers: 'offers.pdf',
  suhoor: 'suhoor.pdf',
};

const getMissingGithubEnv = () => ([
  'GITHUB_TOKEN',
  'GITHUB_OWNER',
  'GITHUB_REPO',
].filter((key) => !String(process.env[key] || '').trim()));

const DEFAULT_ALLOWED_PDFS = Object.values(STATIC_PAGE_FILES);
const EXTRA_ALLOWED_PDFS = String(process.env.ALLOWED_PDF_FILES || '')
  .split(',')
  .map((name) => name.trim().toLowerCase())
  .filter(Boolean);
const ALLOWED_PDFS = new Set([
  ...DEFAULT_ALLOWED_PDFS.map((name) => name.toLowerCase()),
  ...EXTRA_ALLOWED_PDFS,
]);
const DEFAULT_MAX_PDF_UPLOAD_MB = 20;
const parsedMaxPdfSizeMb = Number(process.env.MAX_PDF_UPLOAD_MB || DEFAULT_MAX_PDF_UPLOAD_MB);
const MAX_PDF_SIZE_MB = Number.isFinite(parsedMaxPdfSizeMb) && parsedMaxPdfSizeMb > 0
  ? parsedMaxPdfSizeMb
  : DEFAULT_MAX_PDF_UPLOAD_MB;
const MAX_PDF_SIZE_BYTES = Math.max(1, MAX_PDF_SIZE_MB) * 1024 * 1024;
const PLATFORM_DIRECT_UPLOAD_CAP_MB = process.env.VERCEL ? 3 : MAX_PDF_SIZE_MB;
const DEFAULT_DIRECT_UPLOAD_MAX_MB = PLATFORM_DIRECT_UPLOAD_CAP_MB;
const parsedDirectUploadMb = Number(process.env.DIRECT_UPLOAD_MAX_MB || DEFAULT_DIRECT_UPLOAD_MAX_MB);
const DIRECT_UPLOAD_MAX_MB = Number.isFinite(parsedDirectUploadMb) && parsedDirectUploadMb > 0
  ? Math.min(parsedDirectUploadMb, MAX_PDF_SIZE_MB, PLATFORM_DIRECT_UPLOAD_CAP_MB)
  : DEFAULT_DIRECT_UPLOAD_MAX_MB;
const DIRECT_UPLOAD_MAX_BYTES = Math.max(1, DIRECT_UPLOAD_MAX_MB) * 1024 * 1024;
const CHUNK_SESSION_TTL_MS = 20 * 60 * 1000;
const EXISTS_CACHE_TTL_MS = 30 * 1000;
const ADMIN_RATE_WINDOW_MS = 60 * 1000;
const ADMIN_RATE_MAX_REQUESTS = 20;
const existsCache = new Map();
const adminRateBuckets = new Map();
const chunkUploadSessions = new Map();

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

const missingGithubEnvAtBoot = getMissingGithubEnv();
if (missingGithubEnvAtBoot.length > 0) {
  console.warn(`GitHub PDF storage env vars missing: ${missingGithubEnvAtBoot.join(', ')}`);
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
app.use(express.urlencoded({ extended: true, limit: '200mb' }));
app.use(express.json({ limit: '200mb' }));

app.use((req, res, next) => {
  const privatePath = req.path === '/login'
    || req.path === '/admin'
    || req.path.startsWith('/admin/pdf')
    || req.path === '/upload'
    || req.path === '/delete-page'
    || req.path === '/logout';

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
    // السماح برفع ملفات PDF كبيرة نسبيًا (MB)
    fileSize: MAX_PDF_SIZE_BYTES,
  },
});

const getPdfFilename = (value) => {
  if (!value) return null;
  const normalized = String(value).trim().toLowerCase().replace(/\\/g, '/');
  const baseName = path.posix.basename(normalized);
  if (!baseName || baseName.includes('/') || baseName.includes('..')) {
    return null;
  }

  if (STATIC_PAGE_FILES[baseName]) {
    return STATIC_PAGE_FILES[baseName];
  }

  const byPageType = STATIC_PAGE_FILES[baseName.replace(/\.pdf$/i, '')];
  if (byPageType) {
    return byPageType;
  }

  const filename = baseName.endsWith('.pdf') ? baseName : `${baseName}.pdf`;
  if (!/^[a-z0-9][a-z0-9._-]{0,120}\.pdf$/i.test(filename)) {
    return null;
  }

  if (!ALLOWED_PDFS.has(filename.toLowerCase())) {
    return null;
  }

  return filename;
};

const canUseGithubStorage = () => {
  if (getMissingGithubEnv().length > 0) {
    return false;
  }

  try {
    getGithubConfig();
    return true;
  } catch {
    return false;
  }
};

const getCachedExists = (filename) => {
  const cached = existsCache.get(filename);
  if (!cached) return null;
  if ((Date.now() - cached.updatedAt) > EXISTS_CACHE_TTL_MS) {
    existsCache.delete(filename);
    return null;
  }
  return cached.exists;
};

const setCachedExists = (filename, exists) => {
  existsCache.set(filename, { exists, updatedAt: Date.now() });
};

const checkLocalPdfExists = async (filename) => {
  const localPath = path.join(PUBLIC_DIR, 'pdf', filename);
  try {
    await fs.promises.access(localPath, fs.constants.F_OK);
    return true;
  } catch {
    return false;
  }
};

const fileExistsInStorage = async (filename, force = false) => {
  const cached = !force ? getCachedExists(filename) : null;
  if (typeof cached === 'boolean') {
    return cached;
  }

  let exists = false;
  if (canUseGithubStorage()) {
    exists = Boolean(await getFileSha(resolvePdfPath(filename)));
  } else {
    exists = await checkLocalPdfExists(filename);
  }

  setCachedExists(filename, exists);
  return exists;
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

const getPageData = async (filename) => {
  const exists = await fileExistsInStorage(filename);
  if (!exists) {
    return { exists: false, url: null };
  }

  return {
    exists: true,
    url: withCacheVersion(`/pdf/${encodeURIComponent(filename)}`),
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

const updateVersionFor = (filename, exists) => {
  setCachedExists(filename, exists);
  menuVersion = Date.now();
};

const requireAdminAuth = (req, res, next) => {
  if (!isAuthenticated(req)) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  return next();
};

const requireGithubStorage = (req, res, next) => {
  if (!canUseGithubStorage()) {
    const missing = getMissingGithubEnv();
    return res.status(503).json({
      success: false,
      message: missing.length > 0
        ? `GitHub storage is not configured. Missing: ${missing.join(', ')}`
        : 'GitHub storage is not configured.',
      missing,
    });
  }
  return next();
};

const applyAdminRateLimit = (req, res, next) => {
  const clientIp = String(req.headers['x-forwarded-for'] || req.ip || 'unknown')
    .split(',')[0]
    .trim();
  const now = Date.now();
  const bucket = adminRateBuckets.get(clientIp) || [];
  const fresh = bucket.filter((stamp) => (now - stamp) < ADMIN_RATE_WINDOW_MS);

  if (fresh.length >= ADMIN_RATE_MAX_REQUESTS) {
    return res.status(429).json({
      success: false,
      message: 'Too many admin requests. Please retry shortly.',
    });
  }

  fresh.push(now);
  adminRateBuckets.set(clientIp, fresh);
  return next();
};

const getErrorStatusCode = (error, fallback = 500) => {
  const statusFromObject = Number(error?.status || error?.statusCode);
  if (Number.isInteger(statusFromObject) && statusFromObject >= 400 && statusFromObject <= 599) {
    return statusFromObject;
  }

  const message = String(error?.message || '');
  const matched = message.match(/\((\d{3})\)/);
  const statusFromMessage = matched ? Number(matched[1]) : NaN;
  if (Number.isInteger(statusFromMessage) && statusFromMessage >= 400 && statusFromMessage <= 599) {
    return statusFromMessage;
  }

  return fallback;
};

const uploadPdfFields = upload.fields([
  { name: 'file', maxCount: 1 },
  { name: 'menu', maxCount: 1 },
  { name: 'offers', maxCount: 1 },
  { name: 'suhoor', maxCount: 1 },
]);

const parseUploadRequest = (req, res, next) => {
  uploadPdfFields(req, res, (error) => {
    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        success: false,
        message: `PDF size is too large. Max allowed is ${MAX_PDF_SIZE_MB}MB.`,
      });
    }

    if (error) {
      return res.status(400).json({
        success: false,
        message: 'Unable to read the uploaded file.',
      });
    }

    return next();
  });
};

const getUploadedFile = (req) => {
  if (req.file) return req.file;
  const files = req.files || {};
  return files.file?.[0]
    || files.menu?.[0]
    || files.offers?.[0]
    || files.suhoor?.[0]
    || null;
};

const resolveFilenameFromRequest = (req, uploadedFile) => getPdfFilename(
  req.body?.filename
  || req.body?.pathname
  || req.body?.pageType
  || req.params.name
  || uploadedFile?.originalname
);

const parseChunkNumber = (value) => {
  const numberValue = Number.parseInt(String(value), 10);
  return Number.isFinite(numberValue) ? numberValue : NaN;
};

const sanitizeUploadId = (value) => {
  const uploadId = String(value || '').trim();
  if (!/^[a-zA-Z0-9_-]{8,80}$/.test(uploadId)) {
    return null;
  }
  return uploadId;
};

const getChunkSessionKey = (uploadId, filename) => `${uploadId}:${filename}`;

const cleanupExpiredChunkSessions = () => {
  const now = Date.now();
  for (const [key, session] of chunkUploadSessions.entries()) {
    if ((now - session.updatedAt) > CHUNK_SESSION_TTL_MS) {
      chunkUploadSessions.delete(key);
    }
  }
};

const uploadPdfHandler = async (req, res) => {
  const uploadedFile = getUploadedFile(req);
  if (!uploadedFile) {
    return res.status(400).json({ success: false, message: 'No file uploaded.' });
  }

  if (uploadedFile.mimetype !== 'application/pdf') {
    return res.status(400).json({ success: false, message: 'Only PDF files are allowed.' });
  }

  const filename = resolveFilenameFromRequest(req, uploadedFile);
  if (!filename) {
    return res.status(400).json({
      success: false,
      message: 'Invalid PDF name. Add it to ALLOWED_PDF_FILES to allow it.',
    });
  }

  const storagePath = resolvePdfPath(filename);
  await uploadOrUpdateFile(storagePath, uploadedFile.buffer, `Update ${filename}`);
  updateVersionFor(filename, true);

  const proxyUrl = withCacheVersion(`/pdf/${encodeURIComponent(filename)}`);
  const rawUrl = `${buildRawFileUrl(filename)}?v=${Date.now()}`;
  return res.json({
    success: true,
    message: 'PDF uploaded successfully.',
    filename,
    url: proxyUrl,
    rawUrl,
  });
};

const uploadPdfChunkHandler = async (req, res) => {
  const uploadedFile = getUploadedFile(req);
  if (!uploadedFile) {
    return res.status(400).json({ success: false, message: 'No chunk uploaded.' });
  }

  const uploadId = sanitizeUploadId(req.body?.uploadId);
  if (!uploadId) {
    return res.status(400).json({ success: false, message: 'Invalid upload id.' });
  }

  const chunkIndex = parseChunkNumber(req.body?.chunkIndex);
  const totalChunks = parseChunkNumber(req.body?.totalChunks);

  if (!Number.isInteger(chunkIndex) || chunkIndex < 0 || !Number.isInteger(totalChunks) || totalChunks <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid chunk metadata.' });
  }

  if (chunkIndex >= totalChunks) {
    return res.status(400).json({ success: false, message: 'Chunk index is out of range.' });
  }

  const estimatedSize = totalChunks * DIRECT_UPLOAD_MAX_BYTES;
  if (estimatedSize > (MAX_PDF_SIZE_BYTES + DIRECT_UPLOAD_MAX_BYTES)) {
    return res.status(413).json({ success: false, message: `PDF size is too large. Max allowed is ${MAX_PDF_SIZE_MB}MB.` });
  }

  if (uploadedFile.size > DIRECT_UPLOAD_MAX_BYTES) {
    return res.status(413).json({
      success: false,
      message: `Chunk is too large. Max chunk is ${DIRECT_UPLOAD_MAX_MB}MB.`,
    });
  }

  const filename = resolveFilenameFromRequest(req, uploadedFile);
  if (!filename) {
    return res.status(400).json({
      success: false,
      message: 'Invalid PDF name. Add it to ALLOWED_PDF_FILES to allow it.',
    });
  }

  cleanupExpiredChunkSessions();
  const sessionKey = getChunkSessionKey(uploadId, filename);
  const existing = chunkUploadSessions.get(sessionKey);
  const session = existing || {
    filename,
    totalChunks,
    chunks: new Array(totalChunks).fill(null),
    receivedBytes: 0,
    updatedAt: Date.now(),
  };

  if (session.totalChunks !== totalChunks) {
    return res.status(400).json({ success: false, message: 'Chunk session metadata mismatch.' });
  }

  const previousChunk = session.chunks[chunkIndex];
  if (previousChunk) {
    session.receivedBytes -= previousChunk.length;
  }

  const currentChunkBuffer = Buffer.from(uploadedFile.buffer);
  session.chunks[chunkIndex] = currentChunkBuffer;
  session.receivedBytes += currentChunkBuffer.length;
  session.updatedAt = Date.now();

  if (session.receivedBytes > MAX_PDF_SIZE_BYTES) {
    chunkUploadSessions.delete(sessionKey);
    return res.status(413).json({
      success: false,
      message: `PDF size is too large. Max allowed is ${MAX_PDF_SIZE_MB}MB.`,
    });
  }

  chunkUploadSessions.set(sessionKey, session);

  return res.json({
    success: true,
    uploadId,
    chunkIndex,
    totalChunks,
    filename,
    receivedChunks: session.chunks.filter(Boolean).length,
  });
};

const completeChunkedUploadHandler = async (req, res) => {
  const uploadId = sanitizeUploadId(req.body?.uploadId);
  if (!uploadId) {
    return res.status(400).json({ success: false, message: 'Invalid upload id.' });
  }

  const totalChunks = parseChunkNumber(req.body?.totalChunks);
  if (!Number.isInteger(totalChunks) || totalChunks <= 0) {
    return res.status(400).json({ success: false, message: 'Invalid total chunk count.' });
  }

  const filename = resolveFilenameFromRequest(req, null);
  if (!filename) {
    return res.status(400).json({
      success: false,
      message: 'Invalid PDF name. Add it to ALLOWED_PDF_FILES to allow it.',
    });
  }

  cleanupExpiredChunkSessions();
  const sessionKey = getChunkSessionKey(uploadId, filename);
  const session = chunkUploadSessions.get(sessionKey);
  if (!session) {
    return res.status(400).json({
      success: false,
      message: 'Upload session expired. Please upload again.',
    });
  }

  if (session.totalChunks !== totalChunks) {
    chunkUploadSessions.delete(sessionKey);
    return res.status(400).json({
      success: false,
      message: 'Upload session metadata mismatch.',
    });
  }

  const missingChunkIndex = session.chunks.findIndex((chunk) => !chunk);
  if (missingChunkIndex !== -1) {
    return res.status(400).json({
      success: false,
      message: `Missing uploaded chunk ${missingChunkIndex + 1}/${totalChunks}.`,
    });
  }

  if (session.receivedBytes > MAX_PDF_SIZE_BYTES) {
    chunkUploadSessions.delete(sessionKey);
    return res.status(413).json({
      success: false,
      message: `PDF size is too large. Max allowed is ${MAX_PDF_SIZE_MB}MB.`,
    });
  }

  const fullBuffer = Buffer.concat(session.chunks);
  if (!fullBuffer.subarray(0, 4).equals(Buffer.from('%PDF'))) {
    return res.status(400).json({ success: false, message: 'Uploaded file is not a valid PDF.' });
  }

  const storagePath = resolvePdfPath(filename);
  await uploadOrUpdateFile(storagePath, fullBuffer, `Update ${filename}`);
  updateVersionFor(filename, true);
  chunkUploadSessions.delete(sessionKey);

  const proxyUrl = withCacheVersion(`/pdf/${encodeURIComponent(filename)}`);
  const rawUrl = `${buildRawFileUrl(filename)}?v=${Date.now()}`;
  return res.json({
    success: true,
    message: 'PDF uploaded successfully.',
    filename,
    url: proxyUrl,
    rawUrl,
  });
};

setInterval(cleanupExpiredChunkSessions, 60 * 1000).unref();

const deletePdfByName = async (req, res) => {
  const filename = resolveFilenameFromRequest(req, null);
  if (!filename) {
    return res.status(400).json({ success: false, message: 'Invalid PDF name.' });
  }

  const storagePath = resolvePdfPath(filename);
  const result = await deleteFile(storagePath, `Delete ${filename}`);
  updateVersionFor(filename, false);

  return res.json({
    success: true,
    deleted: Boolean(result.deleted),
    message: result.deleted ? 'PDF deleted successfully.' : 'PDF was already missing.',
  });
};

const sendPdfResponse = async (filename, res) => {
  const safeFilename = getPdfFilename(filename);
  if (!safeFilename) {
    res.status(404).json({ error: 'PDF not found' });
    return;
  }

  try {
    let pdfBuffer = null;

    if (canUseGithubStorage()) {
      pdfBuffer = await downloadFile(resolvePdfPath(safeFilename));
    } else {
      const localPath = path.join(PUBLIC_DIR, 'pdf', safeFilename);
      try {
        pdfBuffer = await fs.promises.readFile(localPath);
      } catch {
        pdfBuffer = null;
      }
    }

    if (!pdfBuffer) {
      res.status(404).json({ error: 'PDF not found' });
      return;
    }

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${safeFilename}"`);
    res.setHeader('Cache-Control', 'public, max-age=300');
    res.send(pdfBuffer);
  } catch (error) {
    console.error('PDF proxy error:', error.message);
    res.status(500).json({ error: 'Failed to load PDF', details: error.message });
  }
};

// توزيع الملفات الثابتة من مجلد public (صور، تحقق جوجل، ...إلخ)

// المسارات
app.get("/", async (req, res) => {
  try {
    const menuData = await getMenuViewData();
    res.set('X-Robots-Tag', 'index, follow');
    res.send(views.menu({ ...menuData, canonicalUrl: `${SITE_URL}/`, indexable: true }));
  } catch (error) {
    console.error('Error while checking PDF availability:', error);
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
    res.send(views.admin({
      maxUploadMb: MAX_PDF_SIZE_MB,
      directUploadMb: DIRECT_UPLOAD_MAX_MB,
    }));
  } else {
    res.redirect("/login");
  }
});

app.post(
  '/admin/pdf/upload-chunk',
  requireAdminAuth,
  requireGithubStorage,
  applyAdminRateLimit,
  parseUploadRequest,
  async (req, res) => {
    try {
      await uploadPdfChunkHandler(req, res);
    } catch (error) {
      console.error('Chunk upload failed:', error.message);
      const status = getErrorStatusCode(error, 500);
      res.status(status).json({
        success: false,
        message: error.message || 'Failed to upload chunk.',
      });
    }
  }
);

app.post(
  '/admin/pdf/upload-complete',
  requireAdminAuth,
  requireGithubStorage,
  applyAdminRateLimit,
  async (req, res) => {
    try {
      await completeChunkedUploadHandler(req, res);
    } catch (error) {
      console.error('Chunk completion failed:', error.message);
      const status = getErrorStatusCode(error, 500);
      res.status(status).json({
        success: false,
        message: error.message || 'Failed to finalize PDF upload.',
      });
    }
  }
);

app.post(
  '/admin/pdf/upload',
  requireAdminAuth,
  requireGithubStorage,
  applyAdminRateLimit,
  parseUploadRequest,
  async (req, res) => {
    try {
      await uploadPdfHandler(req, res);
    } catch (error) {
      console.error('Upload failed:', error.message);
      const status = getErrorStatusCode(error, 500);
      res.status(status).json({
        success: false,
        message: error.message || 'Failed to upload PDF.',
      });
    }
  }
);

app.delete(
  '/admin/pdf/:name',
  requireAdminAuth,
  requireGithubStorage,
  applyAdminRateLimit,
  async (req, res) => {
    try {
      await deletePdfByName(req, res);
    } catch (error) {
      console.error('Delete failed:', error.message);
      const status = getErrorStatusCode(error, 500);
      res.status(status).json({
        success: false,
        message: error.message || 'Failed to delete PDF.',
      });
    }
  }
);

// Backward-compatible aliases used by old admin UI clients.
app.post(
  '/upload',
  requireAdminAuth,
  requireGithubStorage,
  applyAdminRateLimit,
  parseUploadRequest,
  async (req, res) => {
    try {
      await uploadPdfHandler(req, res);
    } catch (error) {
      console.error('Legacy upload failed:', error.message);
      const status = getErrorStatusCode(error, 500);
      res.status(status).json({
        success: false,
        message: error.message || 'Failed to upload PDF.',
      });
    }
  }
);

app.post(
  '/delete-page',
  requireAdminAuth,
  requireGithubStorage,
  applyAdminRateLimit,
  async (req, res) => {
    try {
      await deletePdfByName(req, res);
    } catch (error) {
      console.error('Legacy delete failed:', error.message);
      const status = getErrorStatusCode(error, 500);
      res.status(status).json({
        success: false,
        message: error.message || 'Failed to delete PDF.',
      });
    }
  }
);
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
app.get('/pdf/:file', async (req, res) => {
  let rawName = req.params.file || '';
  try {
    rawName = decodeURIComponent(rawName);
  } catch {
    rawName = req.params.file || '';
  }
  const filename = getPdfFilename(rawName);
  await sendPdfResponse(filename, res);
});

// Backward-compatible API route for existing frontend links.
app.get('/api/pdf/:pageType', async (req, res) => {
  const filename = getPdfFilename(req.params.pageType);
  if (!filename) {
    return res.status(404).json({ error: 'Page type not found' });
  }

  await sendPdfResponse(filename, res);
});

const views = require('./views');

app.listen(PORT, HOSTNAME, () => {
  console.log(`🚀 شغال على http://localhost:${PORT}`);
});

