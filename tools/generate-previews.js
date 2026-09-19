const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');
const sharp = require('sharp');

const root = process.cwd();
const widths = [640, 1024, 1600, 2400];

async function run() {
  const state = JSON.parse(await fs.readFile(path.join(root, 'data/menu.json'), 'utf8'));
  await fs.mkdir(path.join(root, 'previews'), { recursive: true });
  const expected = new Set();
  for (const page of state.pages) {
    const source = await fs.readFile(path.join(root, 'uploads', page.fileName), 'utf8');
    const svg = applyChanges(source, page.changes || []);
    const baseName = path.basename(page.fileName, path.extname(page.fileName)).replace(/[^a-zA-Z0-9_-]/g, '-');
    const version = crypto.createHash('sha1').update(svg).digest('hex').slice(0, 12);
    const oldFiles = (await fs.readdir(path.join(root, 'previews'))).filter((file) => file.startsWith(`${baseName}-`) && file.endsWith('.webp'));
    await Promise.all(oldFiles.map((file) => fs.rm(path.join(root, 'previews', file), { force: true })));
    page.previewFiles = {};
    for (const width of widths) {
      const fileName = `previews/${baseName}-${version}-${width}.webp`;
      expected.add(fileName);
      await sharp(Buffer.from(svg)).resize({ width }).webp({ quality: 84, effort: 3 }).toFile(path.join(root, fileName));
      page.previewFiles[String(width)] = fileName;
    }
    page.previewFile = page.previewFiles['1600'];
  }
  const existing = await fs.readdir(path.join(root, 'previews'));
  await Promise.all(existing.filter((file) => file.endsWith('.webp') && !expected.has(`previews/${file}`)).map((file) => fs.rm(path.join(root, 'previews', file), { force: true })));
  await fs.writeFile(path.join(root, 'data/menu.json'), JSON.stringify(state, null, 2) + '\n');
}

function applyChanges(svg, changes) {
  const values = new Map(changes.map((change) => [`${change.type === 'price' ? 'data-price-index' : 'data-product-index'}:${change.index}`, escapeXml(change.value)]));
  const processedSvg = svg.replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
  return processedSvg.replace(/(<text\b[^>]*\b(data-price-index|data-product-index)=["'](\d+)["'][^>]*>)([\s\S]*?)(<\/text>)/gi, (match, start, attribute, index, body, end) => {
    const value = values.get(`${attribute.toLowerCase()}:${index}`);
    return value === undefined ? match : `${start}${value}${end}`;
  });
}

function escapeXml(value) {
  return String(value).replace(/[&<>]/g, (character) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[character]));
}

run().catch((error) => { console.error(error); process.exitCode = 1; });