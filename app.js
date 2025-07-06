const express = require("express");
const session = require("express-session");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

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

// إعداد رفع المنيو
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "public")),
  filename: (req, file, cb) => cb(null, "menu.pdf"),
});
const upload = multer({ storage });

// إنشاء مجلد public إذا لم يكن موجوداً
const publicDir = path.join(__dirname, "public");
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// ملفات ثابتة with long-term caching
app.use(express.static(publicDir, {
  maxAge: '1y',
  etag: true,
  lastModified: true
}));

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

app.post("/upload", upload.single("menu"), (req, res) => {
  if (!req.session.loggedIn) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (req.file) {
    menuVersion = Date.now(); // invalidate cache
    return res.json({ success: true, message: "Menu uploaded." });
  }
  res.status(400).json({ success: false, message: "No file uploaded." });
});

app.get("/menu", (req, res) => {
  const menuPath = path.join(__dirname, 'public', 'menu.pdf');
  if (fs.existsSync(menuPath)) {
    res.send(views.menu({ menuExists: true, version: menuVersion }));
  } else {
    res.send(views.menu({ menuExists: false }));
  }
});

app.get("/delete-menu", (req, res) => {
  if (req.session.loggedIn) {
    const menuPath = path.join(__dirname, 'public', 'menu.pdf');
    if (fs.existsSync(menuPath)) {
      try {
        fs.unlinkSync(menuPath);
        menuVersion = Date.now();
        console.log('تم حذف ملف المنيو بنجاح');
        return res.json({ success: true, message: "Menu deleted." });
      } catch (err) {
        console.error('خطأ في حذف ملف المنيو:', err);
        return res.status(500).json({ success: false, message: "Error deleting menu." });
      }
    } else {
      return res.json({ success: true, message: "Menu already deleted." });
    }
  } else {
    res.redirect("/login");
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
