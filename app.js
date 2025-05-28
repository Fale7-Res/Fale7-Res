const express = require('express');
const session = require('express-session');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const PASSWORD_FILE = path.join(__dirname, 'password.txt');
const upload = multer({ dest: 'temp/' });

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

// Ensure password file exists
if (!fs.existsSync(PASSWORD_FILE)) {
  fs.writeFileSync(PASSWORD_FILE, 'admin');
}

// Login page
app.get('/login', (req, res) => {
  res.render('login', { error: null });
});

app.post('/login', (req, res) => {
  const { password } = req.body;
  const savedPassword = fs.readFileSync(PASSWORD_FILE, 'utf-8').trim();
  if (password === savedPassword) {
    req.session.authenticated = true;
    return res.redirect('/admin');
  } else {
    return res.render('login', { error: 'Incorrect password.' });
  }
});

// Admin page
app.get('/admin', (req, res) => {
  if (!req.session.authenticated) return res.redirect('/login');
  res.render('admin');
});

// Change password
app.post('/change-password', (req, res) => {
  if (!req.session.authenticated) return res.redirect('/login');
  const newPassword = req.body.new_password.trim();
  fs.writeFileSync(PASSWORD_FILE, newPassword);
  res.redirect('/admin');
});

// Upload PDF
app.post('/upload', upload.single('menuFile'), (req, res) => {
  if (!req.session.authenticated) return res.status(403).json({ success: false, message: 'Unauthorized' });
  const file = req.file;
  if (!file) return res.json({ success: false, message: 'No file uploaded.' });
  if (file.mimetype !== 'application/pdf') {
    fs.unlinkSync(file.path);
    return res.json({ success: false, message: 'Only PDF allowed.' });
  }
  const targetPath = path.join(__dirname, 'public', 'menu.pdf');
  fs.renameSync(file.path, targetPath);
  return res.json({ success: true, message: 'Menu uploaded.' });
});

// Redirect root to menu
app.get('/', (req, res) => {
  res.redirect('/menu.pdf');
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
