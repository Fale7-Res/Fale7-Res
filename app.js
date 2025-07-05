const express = require("express");
const cookieSession = require("cookie-session");
const multer = require("multer");
const { put, del, head } = require("@vercel/blob");
const views = require('./views');

const app = express();
const BLOB_READ_WRITE_TOKEN = "vercel_blob_rw_lx7fCZBwbzt55vlQ_BD9rYottV2MvqRePIY4SAJQW0l79pE";

// Trust the Vercel proxy for secure cookies
app.set('trust proxy', true);

// Use cookie-session which is better for serverless environments
app.use(cookieSession({
  name: 'menu-session-stable', // A new name to avoid conflicts with old cookies
  keys: ["a-very-secret-and-new-key-for-signing-cookies-1961"], // New secret key
  maxAge: 24 * 60 * 60 * 1000, // 24 hours
  secure: true,
  httpOnly: true,
  sameSite: 'lax'
}));

// Middleware to parse POST data
app.use(express.urlencoded({ extended: true }));

// Setup multer to use memory storage, not disk, for Vercel's ephemeral filesystem
const upload = multer({ storage: multer.memoryStorage() });

// Middleware to protect routes that require authentication
const requireLogin = (req, res, next) => {
  if (!req.session || !req.session.loggedIn) {
    // For API-like requests, send a JSON error. For page requests, redirect.
    if (req.xhr || (req.headers.accept && req.headers.accept.includes('json'))) {
        return res.status(401).json({ success: false, message: "Unauthorized. Please log in again." });
    }
    return res.redirect("/login");
  }
  next();
};

// --- Routes ---

app.get("/", (req, res) => res.redirect("/menu"));

// Login page
app.get("/login", (req, res) => {
  res.send(views.login({ error: null }));
});

// Handle login attempt
app.post("/login", (req, res) => {
  if (req.body.password === "fale71961") {
    req.session.loggedIn = true;
    res.redirect("/admin");
  } else {
    res.status(401).send(views.login({ error: "كلمة المرور غير صحيحة" }));
  }
});

// Admin dashboard
app.get("/admin", requireLogin, (req, res) => {
  res.send(views.admin());
});

// Logout
app.get("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

// Public menu page
app.get("/menu", async (req, res) => {
  try {
    // Check if the 'menu.pdf' exists in Vercel Blob
    const blob = await head('menu.pdf', { token: BLOB_READ_WRITE_TOKEN });
    // Pass the blob URL and a cache-busting version to the template
    res.send(views.menu({
      menuExists: true,
      menuUrl: blob.url,
      version: new Date(blob.uploadedAt).getTime() 
    }));
  } catch (error) {
    if (error.status === 404) {
      // This is expected if the menu hasn't been uploaded yet
      res.send(views.menu({ menuExists: false }));
    } else {
      console.error('Error fetching menu from Vercel Blob:', error);
      res.status(500).send("<h1>Error fetching menu data.</h1>");
    }
  }
});

// Handle menu upload
app.post("/upload", requireLogin, upload.single("menu"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded." });
  }

  try {
    // Upload the file from memory buffer to Vercel Blob
    await put("menu.pdf", req.file.buffer, {
      access: 'public',
      contentType: 'application/pdf',
      addRandomSuffix: false, // Ensure the filename is always 'menu.pdf'
      token: BLOB_READ_WRITE_TOKEN,
    });
    return res.json({ success: true, message: "Menu uploaded successfully." });
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    return res.status(500).json({ success: false, message: 'Error uploading file.' });
  }
});

// Handle menu deletion
app.get("/delete-menu", requireLogin, async (req, res) => {
  try {
    // To delete a blob, you need its full URL. We get it from head() first.
    const blobInfo = await head('menu.pdf', { token: BLOB_READ_WRITE_TOKEN });
    if (blobInfo) {
       await del(blobInfo.url, { token: BLOB_READ_WRITE_TOKEN });
    }
    console.log('Menu deleted successfully from Vercel Blob.');
    return res.json({ success: true, message: "Menu deleted." });
  } catch (error) {
    if (error.status === 404) {
       // If the file doesn't exist, consider it a success from the user's perspective.
       return res.json({ success: true, message: "Menu already deleted." });
    }
    console.error('Error deleting menu from Vercel Blob:', error);
    return res.status(500).json({ success: false, message: "Error deleting menu." });
  }
});


// Export the app for Vercel's serverless environment
module.exports = app;

// Start the server only if the file is run directly (for local development)
if (require.main === module) {
  // Helper to parse command-line arguments for local development
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
  
  app.listen(PORT, HOSTNAME, () => {
    console.log(`🚀 Server ready at http://${HOSTNAME}:${PORT}`);
  });
}
