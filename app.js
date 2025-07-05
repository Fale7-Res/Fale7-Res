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

// يخبر الخادم بأن يثق بالمعلومات التي تصله من Vercel.
// هذا السطر هو مفتاح حل مشكلة تسجيل الدخول.
app.set('trust proxy', true);

app.use(cookieSession({
  name: 'fale7-session-stable', // اسم جديد للكوكى لضمان عدم استخدام أي نسخة قديمة
  keys: ["this-is-the-final-secret-key-i-swear-1961"], // مفتاح سري جديد تماماً
  maxAge: 24 * 60 * 60 * 1000, // 24 ساعة
  secure: true,   // ضروري لـ Vercel وبيئة HTTPS
  httpOnly: true, // إجراء أمني قياسي
  sameSite: 'lax' // أفضل توازن بين الأمان وسهولة الاستخدام
}));

// Middleware للتحقق من تسجيل الدخول وحماية الصفحات
const requireLogin = (req, res, next) => {
  if (!req.session || !req.session.loggedIn) {
    // إذا كان الطلب من جافاسكريبت (مثل الحذف والرفع)، أرجع خطأ
    if (req.xhr || (req.headers.accept && req.headers.accept.includes('json'))) {
      return res.status(401).json({ success: false, message: "انتهت الجلسة، يرجى تسجيل الدخول مرة أخرى." });
    }
    // إذا كان الطلب لصفحة، قم بالتحويل لصفحة الدخول
    return res.redirect('/login');
  }
  next();
};

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// سياسة أمان المحتوى لزيادة الأمان والسماح للمكونات بالعمل
app.use((req, res, next) => {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self'; " +
    "script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com blob:; " +
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; " +
    "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; " +
    "worker-src 'self' blob:; " +
    "connect-src 'self' https://*.blob.vercel-storage.com https://vitals.vercel-insights.com; " +
    "img-src 'self' data:; " +
    "object-src 'none';"
  );
  next();
});

const upload = multer({ storage: multer.memoryStorage() });

// --- المسارات العامة ---
app.get("/", (req, res) => res.redirect("/menu"));

app.get("/login", (req, res) => {
  res.send(views.login({ error: null }));
});

app.post("/login", (req, res) => {
  if (req.body.password === "fale71961") {
    req.session.loggedIn = true;
    res.redirect("/admin");
  } else {
    res.status(401).send(views.login({ error: "كلمة المرور غير صحيحة" }));
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
    if (error.status === 404) {
      // هذا طبيعي إذا لم يتم رفع المنيو بعد
      res.send(views.menu({ menuExists: false }));
    } else {
      // خطأ آخر غير متوقع
      console.error('Error fetching menu from Vercel Blob:', error.message);
      res.status(500).send("<h1>Error fetching menu</h1>");
    }
  }
});

// --- المسارات المحمية (تتطلب تسجيل دخول) ---
app.get("/admin", requireLogin, (req, res) => {
  res.send(views.admin());
});

app.post("/upload", requireLogin, upload.single("menu"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded." });
  }

  try {
    const blob = await put("menu.pdf", req.file.buffer, {
      access: 'public',
      contentType: 'application/pdf',
      addRandomSuffix: false, // لضمان ثبات اسم الملف
    });
    return res.json({ success: true, message: "Menu uploaded.", url: blob.url });
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    return res.status(500).json({ success: false, message: 'Error uploading file.' });
  }
});

app.get("/delete-menu", requireLogin, async (req, res) => {
  try {
    // للحذف، يجب أن نعرف الرابط الكامل للملف.
    // بما أننا لا نستخدم لاحقة عشوائية، يمكننا الحصول عليه من head()
    const blobInfo = await head('menu.pdf');
    await del(blobInfo.url);
    console.log('تم حذف ملف المنيو من Vercel Blob بنجاح');
    return res.json({ success: true, message: "Menu deleted." });
  } catch (error) {
    if (error.status === 404) {
       // إذا كان الملف غير موجود أصلاً، فهذا يعتبر نجاحاً من وجهة نظر المستخدم
       console.log('ملف المنيو غير موجود أصلاً في Vercel Blob (404)');
       return res.json({ success: true, message: "Menu already deleted." });
    }
    // خطأ آخر غير متوقع
    console.error('خطأ في حذف ملف المنيو من Vercel Blob:', error);
    return res.status(500).json({ success: false, message: "Error deleting menu." });
  }
});

app.get("/logout", (req, res) => {
  req.session = null; // لمسح الكوكي
  res.redirect("/login");
});

const views = require('./views');

app.listen(PORT, HOSTNAME, () => {
  console.log(`🚀 شغال على http://localhost:${PORT}`);
});
