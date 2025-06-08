const express = require("express");
const session = require("express-session");
const path = require("path");
const multer = require("multer");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

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

// ملفات ثابتة (باستثناء ملف المنيو)
app.use(express.static(publicDir, {
  setHeaders: (res, path, stat) => {
    // تطبيق رؤوس منع الكاش على جميع الملفات
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
    res.set('Surrogate-Control', 'no-store');
  }
}));

// مسار مخصص لتقديم ملف المنيو مع منع الكاش
app.get('/menu.pdf', (req, res) => {
  const menuPath = path.join(__dirname, 'public', 'menu.pdf');
  
  if (fs.existsSync(menuPath)) {
    // إضافة طابع زمني للرابط لمنع الكاش
    const timestamp = Date.now();
    
    // إعداد رؤوس منع الكاش
    res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
    res.setHeader('Surrogate-Control', 'no-store');
    res.setHeader('Content-Type', 'application/pdf');
    
    // إرسال الملف مباشرة
    res.sendFile(menuPath);
  } else {
    res.status(404).send('ملف المنيو غير موجود');
  }
});

// المسارات
app.get("/", (req, res) => res.redirect("/login"));

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
  res.redirect("/admin");
});

app.get("/menu", (req, res) => {
  // التحقق من وجود ملف المنيو قبل عرضه
  const menuPath = path.join(__dirname, 'public', 'menu.pdf');
  
  if (fs.existsSync(menuPath)) {
    res.send(views.menu({ menuExists: true }));
  } else {
    res.send(views.menu({ menuExists: false }));
  }
});

app.get("/delete-menu", (req, res) => {
  if (req.session.loggedIn) {
    // حذف ملف المنيو القديم
    const menuPath = path.join(__dirname, 'public', 'menu.pdf');
    
    if (fs.existsSync(menuPath)) {
      try {
        fs.unlinkSync(menuPath);
        console.log('تم حذف ملف المنيو بنجاح');
        
        // تنظيف الكاش عن طريق إعادة توجيه مع باراميتر لتجنب الكاش
        req.session.menuDeleted = Date.now(); // تخزين وقت الحذف في الجلسة
        return res.redirect("/admin?menu_deleted=" + Date.now());
      } catch (err) {
        console.error('خطأ في حذف ملف المنيو:', err);
      }
    } else {
      console.log('ملف المنيو غير موجود');
    }
    
    res.redirect("/admin");
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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 شغال على http://localhost:${PORT}`);
});
