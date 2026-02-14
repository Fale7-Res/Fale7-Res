const express = require("express");
const session = require("express-session");
const multer = require("multer");
const path = require("path");
const { put, del, list } = require('@vercel/blob');
const { handleUpload } = require('@vercel/blob/client');

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
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    // السماح برفع ملفات PDF كبيرة نسبيًا
    fileSize: 50 * 1024 * 1024,
  },
});

// توزيع الملفات الثابتة مثل robots.txt و sitemap.xml من مجلد public
app.use(express.static(path.join(__dirname, "public")));

const getMenuViewData = async () => {
  const blobOptions = process.env.BLOB_READ_WRITE_TOKEN ? { token: process.env.BLOB_READ_WRITE_TOKEN } : {};
  const { blobs } = await list({ prefix: 'menu.pdf', limit: 1, ...blobOptions });

  if (blobs.length > 0) {
    return {
      menuExists: true,
      menuUrl: `${blobs[0].url}?v=${menuVersion}`,
    };
  }

  return { menuExists: false };
};

// المسارات
app.get("/", async (req, res) => {
  try {
    const menuData = await getMenuViewData();
    res.send(views.menu({ ...menuData, canonicalUrl: "https://fale7-res.vercel.app/" }));
  } catch (error) {
    console.error('خطأ في التحقق من Blob:', error);
    res.send(views.menu({ menuExists: false, canonicalUrl: "https://fale7-res.vercel.app/" }));
  }
});

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

app.post("/upload", (req, res, next) => {
  upload.single("menu")(req, res, (error) => {
    if (error instanceof multer.MulterError && error.code === 'LIMIT_FILE_SIZE') {
      return res.status(413).json({
        success: false,
        message: 'حجم ملف المنيو كبير جدًا. الحد الأقصى 50MB.',
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
  if (!req.session.loggedIn) {
    return res.status(401).json({ message: "Unauthorized" });
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
      return res.json({ success: true, message: "Menu uploaded.", url: result.url });
    } catch (error) {
      console.error('خطأ في رفع الملف إلى Blob:', error);
      return res.status(500).json({ success: false, message: "خطأ في رفع المنيو." });
    }
  }
  res.status(400).json({ success: false, message: "لم يتم رفع أي ملف." });
});

app.post('/api/blob-upload', express.json(), async (req, res) => {
  if (!req.session.loggedIn) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const jsonResponse = await handleUpload({
      body: req.body,
      request: req,
      token: process.env.BLOB_READ_WRITE_TOKEN,
      onBeforeGenerateToken: async () => ({
        allowedContentTypes: ['application/pdf'],
        maximumSizeInBytes: 50 * 1024 * 1024,
        addRandomSuffix: false,
      }),
      onUploadCompleted: async () => {
        menuVersion = Date.now();
      },
    });

    return res.status(200).json(jsonResponse);
  } catch (error) {
    console.error('خطأ في إنشاء توكن رفع Blob:', error);
    return res.status(400).json({ error: 'فشل رفع المنيو مباشرة.' });
  }
});

app.get("/menu", async (req, res) => {
  try {
    const menuData = await getMenuViewData();
    res.send(views.menu({ ...menuData, canonicalUrl: "https://fale7-res.vercel.app/menu" }));
  } catch (error) {
    console.error('خطأ في التحقق من Blob:', error);
    res.send(views.menu({ menuExists: false, canonicalUrl: "https://fale7-res.vercel.app/menu" }));
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/login");
  });
});

// استيراد القوالب من ملف views.js
const views = require('./views');

app.listen(PORT, HOSTNAME, () => {
  console.log(`🚀 شغال على http://localhost:${PORT}`);
});
