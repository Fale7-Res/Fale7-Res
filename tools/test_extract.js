const fs = require('fs');

function extractMenuFromSvg(svgContent, pageNumber) {
  // Extract all text elements with their text and attributes
  const matches = [...svgContent.matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/gi)];
  const rawTexts = matches.map(m => m[1].replace(/<[^>]+>/g, '').trim()).filter(Boolean);

  if (pageNumber === 1) {
    // Page 1 contains Sandwiches & Meat Sandwiches
    // Let's inspect the flow
    console.log('Page 1 total texts:', rawTexts.length);
  }
}

const svg1 = fs.readFileSync('uploads/24834de6-002c-49a7-b049-8682e47098e7.svg', 'utf8');
extractMenuFromSvg(svg1, 1);
