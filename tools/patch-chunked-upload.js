const fs = require('fs');

// ─── 1. PATCH server.js ────────────────────────────────────────────────────
let server = fs.readFileSync('server.js', 'utf8');

const blobAndFinalizeRoutes = `
// POST /api/upload/blob — store one chunk as a GitHub Git blob, returns SHA
app.post('/api/upload/blob', auth, async (req, res) => {
  if (!githubToken || !githubRepository) return res.status(503).json({ message: 'إعدادات GitHub غير مكتملة' });
  const { data } = req.body;
  if (typeof data !== 'string' || !data) return res.status(400).json({ message: 'بيانات الجزء غير صالحة' });
  try {
    const response = await fetch(\`https://api.github.com/repos/\${githubRepository}/git/blobs\`, {
      method: 'POST',
      headers: { Authorization: \`Bearer \${githubToken}\`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: data, encoding: 'base64' })
    });
    if (!response.ok) { const e = await response.json().catch(() => ({})); throw new Error(e.message || \`GitHub \${response.status}\`); }
    const { sha } = await response.json();
    res.json({ sha });
  } catch (err) { res.status(500).json({ message: err.message || 'فشل تخزين الجزء' }); }
});

// POST /api/upload/finalize — reassemble blobs into an SVG page
app.post('/api/upload/finalize', auth, async (req, res) => {
  const { name, originalName, blobs } = req.body;
  if (!Array.isArray(blobs) || !blobs.length) return res.status(400).json({ message: 'لا توجد أجزاء للتجميع' });
  if (!githubToken || !githubRepository) return res.status(503).json({ message: 'إعدادات GitHub غير مكتملة' });
  try {
    const parts = await Promise.all(blobs.map(async (sha) => {
      const r = await fetch(\`https://api.github.com/repos/\${githubRepository}/git/blobs/\${sha}\`, {
        headers: { Authorization: \`Bearer \${githubToken}\`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28' }
      });
      if (!r.ok) throw new Error(\`فشل قراءة الجزء \${sha}\`);
      const b = await r.json();
      return Buffer.from(b.content.replace(/\\s/g, ''), 'base64');
    }));
    const fullBuffer = Buffer.concat(parts);
    const svgs = splitSvgFile(fullBuffer);
    const state = await readState();
    const created = [];
    const pageName = ((name || originalName || 'منيو').trim());
    for (let index = 0; index < svgs.length; index++) {
      const id = crypto.randomUUID();
      const fileName = \`\${id}.svg\`;
      const page = { id, name: svgs.length > 1 ? \`\${pageName} - صفحة \${index + 1}\` : pageName, fileName, createdAt: new Date().toISOString() };
      if (!isVercel) await fs.writeFile(path.join(uploadDir, fileName), svgs[index]);
      await commitToGitHub(\`uploads/\${fileName}\`, svgs[index], \`Add menu page \${page.name}\`);
      state.pages.push(page);
      created.push(page);
    }
    state.updatedAt = new Date().toISOString();
    await writeState(state);
    await commitToGitHub('data/menu.json', JSON.stringify(state, null, 2), 'Register uploaded menu pages');
    stateCache = state;
    stateCacheTime = Date.now();
    triggerPreviewGeneration();
    res.json({ success: true, count: created.length, pages: created });
  } catch (error) { res.status(500).json({ message: error.message || 'فشل تجميع الملف' }); }
});

`;

// Insert before app.get('/admin')
const adminRouteMarker = "app.get('/admin',";
if (!server.includes(adminRouteMarker)) { console.error('Cannot find /admin route marker'); process.exit(1); }
server = server.replace(adminRouteMarker, blobAndFinalizeRoutes + adminRouteMarker);
fs.writeFileSync('server.js', server, 'utf8');
console.log('server.js patched ✓');

// ─── 2. PATCH admin.js ────────────────────────────────────────────────────
let admin = fs.readFileSync('public/admin.js', 'utf8');

const oldUpload = `uploadForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!fileInput.files[0]) return;
  const formData = new FormData();
  formData.append('file', fileInput.files[0]);
  formData.append('name', document.getElementById('pageName').value.trim());
  uploadStatus.textContent = 'جاري رفع المنيو...';
  try {
    const result = await request('/api/pages', { method: 'POST', body: formData });
    uploadStatus.textContent = \`تمت إضافة \${result.count} صفحة. جاري تجهيز صور العميل...\`;
    uploadForm.reset(); fileLabel.textContent = 'ملف واحد أو ملف متعدد الصفحات'; loadPages();
  } catch (error) { uploadStatus.textContent = error.message; }
});`;

// Normalize line endings for comparison
const normalizedAdmin = admin.replace(/\r\n/g, '\n');
const normalizedOld = oldUpload.replace(/\r\n/g, '\n');

if (!normalizedAdmin.includes(normalizedOld)) {
  console.error('Cannot find upload handler in admin.js');
  // Print what we have around line 61
  const lines = normalizedAdmin.split('\n');
  lines.slice(59, 75).forEach((l, i) => console.log(60+i+':', JSON.stringify(l)));
  process.exit(1);
}

const newUpload = `// Convert Uint8Array chunk to base64 safely (no stack overflow for large chunks)
function chunkToBase64(bytes) {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

const CHUNK_SIZE = 2 * 1024 * 1024; // 2 MB per chunk (safe under Vercel's 4.5 MB limit)

uploadForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  const file = fileInput.files[0];
  if (!file) return;
  const name = document.getElementById('pageName').value.trim() || file.name;

  // ── Small file: single request ──────────────────────────────────────────
  if (file.size <= CHUNK_SIZE) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('name', name);
    uploadStatus.textContent = 'جاري رفع المنيو...';
    try {
      const result = await request('/api/pages', { method: 'POST', body: formData });
      uploadStatus.textContent = \`تمت إضافة \${result.count} صفحة ✓\`;
      uploadForm.reset(); fileLabel.textContent = 'ملف واحد أو ملف متعدد الصفحات'; loadPages();
    } catch (error) { uploadStatus.textContent = error.message; }
    return;
  }

  // ── Large file: chunked upload via GitHub Blobs API ─────────────────────
  uploadStatus.textContent = 'جاري قراءة الملف...';
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  const totalChunks = Math.ceil(bytes.length / CHUNK_SIZE);
  const blobShas = [];

  for (let i = 0; i < totalChunks; i++) {
    uploadStatus.textContent = \`جاري رفع الجزء \${i + 1} من \${totalChunks}...\`;
    const chunk = bytes.slice(i * CHUNK_SIZE, (i + 1) * CHUNK_SIZE);
    try {
      const { sha } = await request('/api/upload/blob', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ data: chunkToBase64(chunk) })
      });
      blobShas.push(sha);
    } catch (err) {
      uploadStatus.textContent = \`فشل رفع الجزء \${i + 1}: \${err.message}\`;
      return;
    }
  }

  uploadStatus.textContent = 'جاري تجميع الأجزاء وحفظ الملف...';
  try {
    const result = await request('/api/upload/finalize', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, originalName: file.name, blobs: blobShas })
    });
    uploadStatus.textContent = \`تمت إضافة \${result.count} صفحة ✓\`;
    uploadForm.reset(); fileLabel.textContent = 'ملف واحد أو ملف متعدد الصفحات'; loadPages();
  } catch (error) { uploadStatus.textContent = error.message; }
});`;

admin = admin.replace(/\r\n/g, '\n').replace(normalizedOld, newUpload);
fs.writeFileSync('public/admin.js', admin, 'utf8');
console.log('public/admin.js patched ✓');
