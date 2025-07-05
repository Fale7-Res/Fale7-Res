const express = require("express");
const session = require("express-session");
const path = require("path");
// const multer = require("multer"); // Removed as Vercel Blob will handle uploads
// const fs = require("fs"); // Removed as Vercel Blob will handle file system operations
const { put, del, list } = require("@vercel/blob"); // Import Vercel Blob functions

const app = express();

// A simple in-memory cache-busting version key.
let menuVersion = Date.now();

// Helper to parse command-line arguments
const args = process.argv.slice(2).reduce((acc, arg, index, arr) => {
  if (arg.startsWith("--")) {
    const key = arg.substring(2);
    const next = arr[index + 1];
    if (next && !next.startsWith("--")) {
      acc[key] = next;
    } else {
      acc[key] = true;
    }
  }
  return acc;
}, {});

const PORT = args.port || process.env.PORT || 3000;
const HOSTNAME = args.hostname || "0.0.0.0";

// إعداد الجلسة
app.use(session({
  secret: "mySecret",
  resave: false,
  saveUninitialized: true,
}));

// استقبال بيانات POST
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Add this to parse JSON body for potential API calls

// Removed multer setup as Vercel Blob will handle uploads
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => cb(null, path.join(__dirname, "public")),
//   filename: (req, file, cb) => cb(null, "menu.pdf"),
// });
// const upload = multer({ storage });

// Removed public folder creation as Vercel Blob will handle storage
// const publicDir = path.join(__dirname, "public");
// if (!fs.existsSync(publicDir)) {
//   fs.mkdirSync(publicDir, { recursive: true });
// }

// Serve static files (if any other static files exist, otherwise this can be removed)
// For Vercel, static files are typically handled by Vercel itself from the 'public' directory
// app.use(express.static(publicDir, {
//   maxAge: '1y', // Aggressively cache for 1 year
//   etag: true,
//   lastModified: true
// }));

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

app.post("/upload", async (req, res) => {
  if (!req.session.loggedIn) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Assuming the file is sent as a base64 encoded string or similar in the request body
    // For actual file upload from a form, you'd need to adjust how the file data is received.
    // This example assumes a direct file buffer or stream from a client-side fetch/XHR.
    // For simplicity, let's assume the client sends a 'file' field with base64 data and 'filename'.
    const { fileContent, filename } = req.body;

    if (!fileContent || !filename) {
      return res.status(400).json({ success: false, message: "No file content or filename provided." });
    }

    // Convert base64 to Buffer if necessary, or directly use the file stream/buffer
    const buffer = Buffer.from(fileContent, 'base64');

    // Delete existing menu.pdf if it exists
    const { blobs } = await list({ prefix: 'menu.pdf' });
    if (blobs.length > 0) {
      await del(blobs[0].url);
      console.log('Existing menu.pdf deleted from Vercel Blob.');
    }

    // Upload the new file, always naming it 'menu.pdf'
    const { url } = await put('menu.pdf', buffer, { access: 'public', addRandomSuffix: false });
    menuVersion = Date.now(); // Invalidate cache by updating version
    return res.json({ success: true, message: "Menu uploaded.", url: url });
  } catch (error) {
    console.error("Error uploading menu to Vercel Blob:", error);
    res.status(500).json({ success: false, message: "Error uploading menu." });
  }
});

app.get("/menu", async (req, res) => {
  // Check if menu.pdf exists in Vercel Blob
  try {
    const { blobs } = await list({ prefix: 'menu.pdf' });
    const menuExists = blobs.length > 0;
    const menuUrl = menuExists ? blobs[0].url : '';

    res.send(views.menu({ menuExists: menuExists, version: menuVersion, menuUrl: menuUrl }));
  } catch (error) {
    console.error("Error checking menu existence in Vercel Blob:", error);
    res.status(500).send(views.menu({ menuExists: false, error: "Error loading menu." }));
  }
});

app.get("/delete-menu", async (req, res) => {
  if (req.session.loggedIn) {
    try {
      const { blobs } = await list({ prefix: 'menu.pdf' });
      if (blobs.length > 0) {
        await del(blobs[0].url);
        menuVersion = Date.now(); // Invalidate cache by updating version
        console.log('تم حذف ملف المنيو بنجاح من Vercel Blob');
        return res.json({ success: true, message: "Menu deleted." });
      } else {
        console.log('ملف المنيو غير موجود في Vercel Blob');
        return res.json({ success: true, message: "Menu already deleted." });
      }
    } catch (err) {
      console.error('خطأ في حذف ملف المنيو من Vercel Blob:', err);
      return res.status(500).json({ success: false, message: "Error deleting menu." });
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


