const fs = require('fs');
const path = require('path');
const { getMenuSections, generateSchemaGraph, renderHtmlMenu, renderQuickFacts } = require('../menuData');

function syncIndexHtml() {
  const indexPath = path.join(__dirname, '..', 'public', 'index.html');
  let content = fs.readFileSync(indexPath, 'utf8');

  const sections = getMenuSections();
  const schema = generateSchemaGraph(sections);
  const jsonLd = JSON.stringify(schema, null, 2);

  // Replace Schema.org block
  const schemaRegex = /<script type="application\/ld\+json">[\s\S]*?<\/script>/i;
  const newSchemaTag = `<script type="application/ld+json">\n${jsonLd}\n  </script>`;
  if (schemaRegex.test(content)) {
    content = content.replace(schemaRegex, newSchemaTag);
  } else {
    content = content.replace('</head>', `  ${newSchemaTag}\n</head>`);
  }

  // Replace or inject SEO / GEO Semantic Container
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
  console.log('Successfully synced public/index.html with GEO structured data and visible menu!');
}

if (require.main === module) {
  syncIndexHtml();
}

module.exports = { syncIndexHtml };
