
const express = require("express");
const cookieSession = require("cookie-session");
const path = require("path");
const multer = require("multer");
const { put, del, head } = require("@vercel/blob");

const app = express();

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

// Trust the Vercel proxy to allow secure cookies
app.set('trust proxy', 1);

app.use(cookieSession({
  name: 'session',
  keys: ["mySecretKey"], // Use a strong, secret key
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// Add a Content Security Policy to allow necessary resources
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com blob:; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; " +
    "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; " +
    "worker-src 'self' blob:; " +
    "connect-src 'self' https://*.blob.vercel-storage.com https://vitals.vercel-insights.com; " +
    "img-src 'self' data: https://*.blob.vercel-storage.com; " +
    "object-src 'none'; " +
    "frame-src 'self';"
  );
  next();
});

const upload = multer({ storage: multer.memoryStorage() });

app.get("/", (req, res) => res.redirect("/menu"));

app.get("/login", (req, res) => {
  res.send(views.login({ error: null }));
});

app.post("/login", (req, res) => {
  if (req.body.password === "fale71961") {
    req.session.loggedIn = true;
    res.redirect("/admin");
  } else {
    res.send(views.login({ error: "كلمة المرور غير صحيحة" }));
  }
});

app.get("/admin", (req, res) => {
  if (req.session && req.session.loggedIn) {
    res.send(views.admin());
  } else {
    res.redirect("/login");
  }
});

app.post("/upload", upload.single("menu"), async (req, res) => {
  if (!req.session || !req.session.loggedIn) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded." });
  }

  try {
    const blob = await put("menu.pdf", req.file.buffer, {
      access: 'public',
      contentType: 'application/pdf',
      addRandomSuffix: false,
    });
    return res.json({ success: true, message: "Menu uploaded.", url: blob.url });
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    return res.status(500).json({ success: false, message: 'Error uploading file.' });
  }
});

app.get("/menu", async (req, res) => {
  try {
    const blob = await head('menu.pdf');
    res.send(views.menu({
      menuExists: true,
      menuUrl: blob.url
    }));
  } catch (error) {
    console.error('Error fetching menu from Vercel Blob:', error.message);
    res.send(views.menu({ menuExists: false }));
  }
});

app.get("/delete-menu", async (req, res) => {
  if (!req.session || !req.session.loggedIn) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const blob = await head('menu.pdf');
    if (blob && blob.url) {
      await del(blob.url);
      console.log('تم حذف ملف المنيو من Vercel Blob بنجاح');
      return res.json({ success: true, message: "Menu deleted." });
    } else {
      console.log('ملف المنيو غير موجود في Vercel Blob');
      return res.json({ success: true, message: "Menu already deleted." });
    }
  } catch (error) {
    if (error.status === 404) {
       console.log('ملف المنيو غير موجود في Vercel Blob');
       return res.json({ success: true, message: "Menu already deleted." });
    }
    console.error('خطأ في حذف ملف المنيو من Vercel Blob:', error);
    return res.status(500).json({ success: false, message: "Error deleting menu." });
  }
});

app.get("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

const views = require('./views');

app.listen(PORT, HOSTNAME, () => {
  console.log(`🚀 شغال على http://localhost:${PORT}`);
});
