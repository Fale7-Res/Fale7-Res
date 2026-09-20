const fs = require('fs');

function inspectPage(file) {
  const content = fs.readFileSync(file, 'utf8');
  const matches = [...content.matchAll(/<text\b([^>]*)>([\s\S]*?)<\/text>/gi)];
  console.log('=== File:', file, 'Text elements count:', matches.length);
  const items = [];
  matches.forEach((m, idx) => {
    const txt = m[2].replace(/<[^>]+>/g, '').trim();
    if (txt) {
      items.push({ idx, txt });
    }
  });
  return items;
}

const p1 = inspectPage('uploads/24834de6-002c-49a7-b049-8682e47098e7.svg');
console.log('Page 1 count:', p1.length);
p1.slice(0, 40).forEach(i => console.log(i.idx, i.txt));

console.log('\n--- Page 2 ---');
const p2 = inspectPage('uploads/e50f1da9-7181-4555-b0bc-d2ca166374f4.svg');
console.log('Page 2 count:', p2.length);
p2.slice(0, 40).forEach(i => console.log(i.idx, i.txt));
