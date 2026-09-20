const fs = require('fs');
const path = require('path');
const { getMenuSections, generateSchemaGraph, renderHtmlMenu, renderQuickFacts } = require('../menuData');

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

        const pagesRegex = /<div id="pages" class="svg-pages">[\s\S]*?<\/div>/i;
        content = content.replace(pagesRegex, `<div id="pages" class="svg-pages">\n      ${pagesHtml}\n    </div>`);
      }
    } catch (e) {
      console.error('Error pre-rendering pages:', e);
    }
  }

  // 3. Replace or inject SEO / GEO Semantic Container
  const renderedMenu = renderHtmlMenu(sections);
  const renderedQuickFacts = renderQuickFacts();

  const newGeoContainer = `<aside class="seo-semantic-container" aria-label="قائمة طعام وتفاصيل مطعم فالح أبو العنبة المكتوبة">
      <details class="seo-menu-accordion" open>
        <summary class="seo-menu-summary"><i class="fas fa-utensils" aria-hidden="true"></i> تفاصيل المنيو وقائمة الأسعار المكتوبة (Machine-Readable Menu)</summary>
        <div class="seo-menu-body">
          ${renderedQuickFacts}
          ${renderedMenu}
        </div>
      </details>
    </aside>`;

  const geoRegex = /<aside class="seo-semantic-container"[\s\S]*?<\/aside>/i;
  if (geoRegex.test(content)) {
    content = content.replace(geoRegex, newGeoContainer);
  } else {
    content = content.replace('</main>', `  ${newGeoContainer}\n  </main>`);
  }

  fs.writeFileSync(indexPath, content, 'utf8');
  console.log('Successfully synced public/index.html with pre-rendered pages, GEO structured data and dynamic menu!');
}

if (require.main === module) {
  syncIndexHtml();
}

module.exports = { syncIndexHtml };
