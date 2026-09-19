const fs = require('fs');
let content = fs.readFileSync('server.js', 'utf8');

// Find and replace download route
const marker = "app.get('/api/pages/:id/download', auth, async (req, res) => {";
const idx = content.indexOf(marker);
if (idx === -1) { console.error('NOT FOUND'); process.exit(1); }

// Find end of this route
const closeIdx = content.indexOf('\r\n});', idx);
if (closeIdx === -1) { console.error('Route end not found'); process.exit(1); }

const before = content.slice(0, idx);
const after = content.slice(closeIdx + 4); // skip \r\n});

const newRoute = `app.get('/api/pages/:id/download', auth, async (req, res) => {
  const state = await readState();
  const page = state.pages.find((item) => item.id === req.params.id);
  if (!page) return res.sendStatus(404);
  const safeName = (page.name.replace(/[^\w\u0600-\u06ff -]/g, '') || 'menu-page') + '.svg';
  res.set({
    'Content-Type': 'image/svg+xml; charset=utf-8',
    'Content-Disposition': "attachment; filename*=UTF-8''" + encodeURIComponent(safeName),
    'Cache-Control': 'no-store'
  });
  if (isVercel && githubToken && githubRepository) {
    const source = await readFromGitHub(\`uploads/\${page.fileName}\`);
    if (!source) return res.sendStatus(404);
    return res.end(source);
  }
  res.sendFile(path.join(uploadDir, page.fileName));
});`;

fs.writeFileSync('server.js', before + newRoute + after, 'utf8');
console.log('SUCCESS: download route fixed');
