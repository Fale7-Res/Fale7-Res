const fs = require('fs');
const path = require('path');
const { getMenuSections, generateSchemaGraph } = require('../menuData');

function syncIndexHtml() {
  const root = path.join(__dirname, '..');
  const indexPath = path.join(root, 'public', 'index.html');
  let content = fs.readFileSync(indexPath, 'utf8');

  const sections = getMenuSections();
  const schema = generateSchemaGraph(sections);
  const jsonLd = JSON.stringify(schema, null, 2);

  // 1. Replace Schema.org block
  const schemaRegex = /<script type="application\/ld\+json">[\s\S]*?<\/script>/i;
  const newSchemaTag = `<script type="application/ld+json">\n${jsonLd}\n  </script>`;
  if (schemaRegex.test(content)) {
    content = content.replace(schemaRegex, newSchemaTag);
  } else {
    content = content.replace('</head>', `  ${newSchemaTag}\n</head>`);
  }

  // 2. Pre-render SVG image pages directly inside <div id="pages" class="svg-pages">
  const menuJsonPath = path.join(root, 'data', 'menu.json');
  if (fs.existsSync(menuJsonPath)) {
    try {
      const state = JSON.parse(fs.readFileSync(menuJsonPath, 'utf8'));
      if (Array.isArray(state.pages) && state.pages.length > 0) {
        const pagesHtml = state.pages.map((page, index) => {
          const base = `/api/pages/${encodeURIComponent(page.id)}/preview.webp`;
          const version = encodeURIComponent(page.updatedAt || state.updatedAt || '');
          const altText = `منيو ${page.name} - قائمة طعام وأسعار مطعم فالح أبو العنبة (منذ 1961)`;
          const fetchPriority = index === 0 ? 'high' : 'low';
          const loading = index === 0 ? 'eager' : 'lazy';
          return `<figure class="svg-page"><img src="${base}?w=1024&v=${version}" srcset="${base}?w=640&v=${version} 640w, ${base}?w=1024&v=${version} 1024w, ${base}?w=1600&v=${version} 1600w, ${base}?w=2400&v=${version} 2400w" sizes="(max-width: 700px) 100vw, min(1100px, 100vw)" width="1054" height="1492" alt="${altText}" loading="${loading}" decoding="async" fetchpriority="${fetchPriority}"></figure>`;
        }).join('\n      ');

        const mainRegex = /<main class="svg-viewer" id="mainContent">[\s\S]*?<\/main>/i;
        content = content.replace(mainRegex, `<main class="svg-viewer" id="mainContent">\n    <div id="pages" class="svg-pages">\n      ${pagesHtml}\n    </div>\n  </main>`);
      }
    } catch (e) {
      console.error('Error pre-rendering pages:', e);
    }
  }

  // 3. Remove any visual SEO / GEO semantic container or accordion from Customer UI
  const geoRegex = /<!-- Crawlable Semantic Menu Content[\s\S]*?<\/aside>/i;
  if (geoRegex.test(content)) {
    content = content.replace(geoRegex, '');
  } else {
    content = content.replace(/<aside class="seo-semantic-container"[\s\S]*?<\/aside>/i, '');
  }

  // Clean any trailing whitespace or duplicated closing tags in main
  content = content.replace(/<\/div><p>جاري تحميل المنيو\.\.\.<\/p><\/div>/g, '');

  fs.writeFileSync(indexPath, content, 'utf8');
  console.log('Successfully synced public/index.html: Clean minimal customer UI + full background Schema.org!');
}

if (require.main === module) {
  syncIndexHtml();
}

module.exports = { syncIndexHtml };
