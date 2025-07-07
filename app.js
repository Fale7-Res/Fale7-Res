const express = require("express");
const session = require("express-session");
const multer = require("multer");
const { put, list } = require('@vercel/blob');

const app = express();

// A simple in-memory cache-busting version key.
let menuVersion = Date.now();

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

// إعداد الجلسة
app.use(session({
  secret: "mySecret",
  resave: false,
  saveUninitialized: true,
}));

// استقبال بيانات POST
app.use(express.urlencoded({ extended: true }));

// إعداد رفع المنيو باستخدام الذاكرة بدلاً من القرص
const upload = multer({ storage: multer.memoryStorage() });

// المسارات
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
  if (req.session.loggedIn) {
    res.send(views.admin());
  } else {
    res.redirect("/login");
  }
});

app.post("/upload", upload.single("menu"), async (req, res) => {
  if (!req.session.loggedIn) {
    return res.status(401).json({ success: false, message: "غير مصرح" });
  }
  if (req.file) {
    try {
      const blobOptions = process.env.BLOB_READ_WRITE_TOKEN ? { token: process.env.BLOB_READ_WRITE_TOKEN } : {};
      
      // Check if menu.pdf exists and delete it
      const { blobs } = await list({ prefix: 'menu.pdf', limit: 1, ...blobOptions });
      if (blobs.length > 0) {
        await del(blobs[0].pathname, blobOptions);
        console.log('Existing menu.pdf deleted from Blob storage');
      }

      // Upload new file as menu.pdf without random suffix
      const result = await put('menu.pdf', req.file.buffer, { 
        access: 'public', 
        addRandomSuffix: false, 
        ...blobOptions 
      });
      menuVersion = Date.now(); // تحديث الإصدار لتجنب الكاش
      return res.json({ success: true, message: "تم رفع المنيو بنجاح.", url: result.url });
    } catch (error) {
      console.error('خطأ في رفع الملف إلى Blob:', error);
      return res.status(500).json({ success: false, message: "خطأ في رفع المنيو: " + error.message });
    }
  }
  res.status(400).json({ success: false, message: "لم يتم رفع أي ملف." });
});

app.get("/menu", async (req, res) => {
  try {
    const blobOptions = process.env.BLOB_READ_WRITE_TOKEN ? { token: process.env.BLOB_READ_WRITE_TOKEN } : {};
    const { blobs } = await list({ prefix: 'menu.pdf', limit: 1, ...blobOptions });
    if (blobs.length > 0) {
      const menuUrl = blobs[0].url;
      res.send(views.menu({ menuExists: true, menuUrl, version: menuVersion }));
    } else {
      res.send(views.menu({ menuExists: false }));
    }
  } catch (error) {
    console.error('خطأ في التحقق من Blob:', error);
    res.send(views.menu({ menuExists: false }));
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

// استيراد القوالب من ملف views.js
const views = require('./views');

app.listen(PORT, HOSTNAME, () => {
  console.log(`🚀 شغال على http://localhost:${PORT}`);
});
