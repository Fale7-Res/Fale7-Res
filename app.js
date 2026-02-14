const express = require("express");
const session = require("express-session");
const multer = require("multer");
const path = require("path");
const { put, del, list } = require('@vercel/blob');
const { handleUpload } = require('@vercel/blob/client');

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

// إعداد الجلسة
app.use(session({
  secret: "mySecret",
  resave: false,
  saveUninitialized: true,
}));

// استقبال بيانات POST
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

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

// المسارات
app.get("/", async (req, res) => {
  try {
    const menuData = await getMenuViewData();
    res.send(views.menu({ ...menuData, canonicalUrl: "https://fale7-res.vercel.app/", indexable: true }));
  } catch (error) {
    console.error('خطأ في التحقق من Blob:', error);
    res.send(views.menu({ menuExists: false, offersExists: false, suhoorExists: false, canonicalUrl: "https://fale7-res.vercel.app/", indexable: true }));
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

  if (!req.file) {
    return res.status(400).json({ success: false, message: "لم يتم رفع أي ملف." });
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
    console.error('خطأ في رفع الملف إلى Blob:', error);
    return res.status(500).json({ success: false, message: "خطأ في رفع المنيو." });
  }
});

app.post('/api/blob-upload', async (req, res) => {
  if (!req.session.loggedIn) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const jsonResponse = await handleUpload({
      body: req.body,
      request: req,
      token: process.env.BLOB_READ_WRITE_TOKEN,
      onBeforeGenerateToken: async (pathname) => {
        if (!Object.values(STATIC_PAGE_FILES).includes(pathname)) {
          throw new Error('Pathname غير مسموح للرفع.');
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
    console.error('خطأ في إنشاء توكن رفع Blob:', error);
    return res.status(400).json({ error: 'فشل رفع الملف مباشرة.' });
  }
});

app.post('/delete-page', async (req, res) => {
  if (!req.session.loggedIn) {
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

app.get("/menu", async (req, res) => {
  try {
    const menuData = await getMenuViewData();
    res.send(views.menu({ ...menuData, canonicalUrl: "https://fale7-res.vercel.app/menu", indexable: true }));
  } catch (error) {
    console.error('خطأ في التحقق من Blob:', error);
    res.send(views.menu({ menuExists: false, offersExists: false, suhoorExists: false, canonicalUrl: "https://fale7-res.vercel.app/menu", indexable: true }));
  }
});

app.get('/offers', async (req, res) => {
  try {
    const offersData = await getPageData(STATIC_PAGE_FILES.offers);
    res.send(views.pdfPage({
      title: 'عروض فالح أبو العنبه',
      canonicalUrl: 'https://fale7-res.vercel.app/offers',
      pageExists: offersData.exists,
      pageUrl: offersData.url,
      emptyTitle: 'لا توجد عروض متاحة حالياً',
      emptyText: 'يمكنك متابعة الصفحة لاحقاً لمعرفة أحدث العروض.',
    }));
  } catch (error) {
    console.error('خطأ في تحميل صفحة العروض:', error);
    res.send(views.pdfPage({
      title: 'عروض فالح أبو العنبه',
      canonicalUrl: 'https://fale7-res.vercel.app/offers',
      pageExists: false,
      emptyTitle: 'لا توجد عروض متاحة حالياً',
      emptyText: 'يمكنك متابعة الصفحة لاحقاً لمعرفة أحدث العروض.',
    }));
  }
});

app.get('/suhoor', async (req, res) => {
  try {
    const suhoorData = await getPageData(STATIC_PAGE_FILES.suhoor);
    res.send(views.pdfPage({
      title: 'منيو السحور | فالح أبو العنبه',
      canonicalUrl: 'https://fale7-res.vercel.app/suhoor',
      pageExists: suhoorData.exists,
      pageUrl: suhoorData.url,
      emptyTitle: 'منيو السحور غير متوفر حالياً',
      emptyText: 'سيتم نشر منيو السحور هنا عند التفعيل من لوحة التحكم.',
    }));
  } catch (error) {
    console.error('خطأ في تحميل صفحة السحور:', error);
    res.send(views.pdfPage({
      title: 'منيو السحور | فالح أبو العنبه',
      canonicalUrl: 'https://fale7-res.vercel.app/suhoor',
      pageExists: false,
      emptyTitle: 'منيو السحور غير متوفر حالياً',
      emptyText: 'سيتم نشر منيو السحور هنا عند التفعيل من لوحة التحكم.',
    }));
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
