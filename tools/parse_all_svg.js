const fs = require('fs');

function parseSvgTexts(file) {
  const content = fs.readFileSync(file, 'utf8');
  // Match text elements and extract clean text
  const regex = /<text\b[^>]*>([\s\S]*?)<\/text>/gi;
  let match;
  const list = [];
  while ((match = regex.exec(content)) !== null) {
    const raw = match[1].replace(/<[^>]+>/g, '').trim();
    if (raw) list.push(raw);
  }
  return list;
}

console.log('Page 1 items:');
console.log(JSON.stringify(parseSvgTexts('uploads/24834de6-002c-49a7-b049-8682e47098e7.svg'), null, 2));

console.log('\nPage 2 items:');
console.log(JSON.stringify(parseSvgTexts('uploads/e50f1da9-7181-4555-b0bc-d2ca166374f4.svg'), null, 2));
