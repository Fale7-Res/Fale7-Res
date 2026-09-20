const fs = require('fs');

function inspect(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const matches = [...content.matchAll(/<text([^>]*)>([\s\S]*?)<\/text>/gi)];
  const items = [];
  for (const m of matches) {
    const text = m[2].replace(/<[^>]+>/g, '').trim();
    if (!text) continue;
    const x = m[1].match(/\bx="([^"]+)"/)?.[1];
    const y = m[1].match(/\by="([^"]+)"/)?.[1];
    const transform = m[1].match(/\btransform="([^"]+)"/)?.[1];
    items.push({ text, x: parseFloat(x), y: parseFloat(y), transform });
  }
  return items;
}

const p1 = inspect('uploads/24834de6-002c-49a7-b049-8682e47098e7.svg');
console.log('Page 1 items count:', p1.length);
console.log('Sample Page 1:', p1.slice(0, 20));

const p2 = inspect('uploads/e50f1da9-7181-4555-b0bc-d2ca166374f4.svg');
console.log('Page 2 items count:', p2.length);
console.log('Sample Page 2:', p2.slice(0, 20));
