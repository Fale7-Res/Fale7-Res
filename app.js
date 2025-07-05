
const express = require("express");
const session = require("express-session");
const path = require("path");
const multer = require("multer");
const { put, del, head } = require('@vercel/blob');

const app = express();

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

// Session setup
app.use(session({
  secret: "mySecret",
  resave: false,
  saveUninitialized: true,
}));

// POST data handling
app.use(express.urlencoded({ extended: true }));

// Multer setup for in-memory storage
const upload = multer({ storage: multer.memoryStorage() });

// The 'public' directory is no longer used for the menu PDF on Vercel.
const publicDir = path.join(__dirname, "public");
app.use(express.static(publicDir));


// Routes
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
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded." });
  }
  
  try {
    const blob = await put('menu.pdf', req.file.buffer, {
      access: 'public',
      cacheControl: 'public, max-age=31536000, immutable'
    });
    return res.json({ success: true, message: "Menu uploaded." });
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    return res.status(500).json({ success: false, message: "Error uploading menu." });
  }
});

app.get("/menu", async (req, res) => {
  try {
    const { url, version } = await head('menu.pdf');
    res.send(views.menu({ menuExists: true, menuUrl: url, version: version }));
  } catch (error) {
    if (error.status === 404) {
      res.send(views.menu({ menuExists: false }));
    } else {
      console.error("Error fetching menu from Vercel Blob:", error);
      res.send(views.menu({ menuExists: false, error: "حدث خطأ أثناء تحميل المنيو" }));
    }
  }
});

app.get("/delete-menu", async (req, res) => {
  if (!req.session.loggedIn) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const { url } = await head('menu.pdf');
    await del(url);
    return res.json({ success: true, message: "Menu deleted." });
  } catch (error) {
    if (error.status === 404) {
      return res.json({ success: true, message: "Menu already deleted." });
    }
    console.error('Error deleting from Vercel Blob:', error);
    return res.status(500).json({ success: false, message: "Error deleting menu." });
  }
});

app.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/login");
});

// Import views
const views = require('./views');

app.listen(PORT, HOSTNAME, () => {
  console.log(`🚀 شغال على http://localhost:${PORT}`);
});
