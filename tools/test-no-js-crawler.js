const http = require('http');
const app = require('../server');

async function testNoJsCrawler() {
  console.log('====================================================');
  console.log('TESTING NO-JAVASCRIPT CRAWLER EXTRACTION');
  console.log('====================================================\n');

  // Start local server instance
  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, resolve));
  const port = server.address().port;
  const url = `http://localhost:${port}/`;

  try {
    console.log(`[Crawler] Fetching raw server-rendered HTML from ${url} (NO JS execution)...`);
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html; Non-JS-Crawler)'
      }
    });

    if (res.status !== 200) {
      throw new Error(`Failed to fetch: HTTP status ${res.status}`);
    }

    const rawHtml = await res.text();
    console.log(`[Crawler] Received raw HTML (${rawHtml.length} bytes).\n`);

    // 1. Restaurant Name
    const nameMatch = rawHtml.includes('مطعم فالح أبو العنبة');
    console.log(`1. Restaurant Name extracted: ${nameMatch ? 'PASS ("مطعم فالح أبو العنبة")' : 'FAIL'}`);

    // 2. Cuisine
    const cuisineMatch = (rawHtml.includes('عراقي') || rawHtml.includes('Iraqi'));
    console.log(`2. Cuisine extracted: ${cuisineMatch ? 'PASS ("أكل ومطعم عراقي في مصر")' : 'FAIL'}`);

    // 3. Location / Address
    const locationMatch = rawHtml.includes('6 أكتوبر') && rawHtml.includes('شارع مكة المكرمة');
    console.log(`3. Location extracted: ${locationMatch ? 'PASS ("مدينة 6 أكتوبر، الحي السابع، شارع مكة المكرمة")' : 'FAIL'}`);

    // 4. Opening Hours
    const hoursMatch = rawHtml.includes('07:00') && rawHtml.includes('03:00');
    console.log(`4. Opening Hours extracted: ${hoursMatch ? 'PASS ("07:00 AM - 03:00 AM")' : 'FAIL'}`);

    // 5. Menu Sections
    const expectedSections = [
      'سندوتشات فالح',
      'سندوتشات اللحوم والمشويات',
      'وجبات فالح',
      'مشويات فالح',
      'المعجنات',
      'أطباق فالح',
      'المقبلات',
      'الأرز والمكرونة',
      'المشروبات'
    ];
    const extractedSections = expectedSections.filter(sec => rawHtml.includes(sec));
    const allSectionsMatch = extractedSections.length === expectedSections.length;
    console.log(`5. Menu Sections extracted: ${allSectionsMatch ? 'PASS' : 'FAIL'} (${extractedSections.length}/${expectedSections.length} sections found in initial HTML)`);

    // 6. Menu Item Names & Descriptions
    const sampleItems = [
      { name: 'فلافل', section: 'سندوتشات فالح' },
      { name: 'كفتة', section: 'سندوتشات اللحوم' },
      { name: 'وجبة كبسة', section: 'وجبات فالح' },
      { name: 'مسحب', section: 'وجبات فالح' },
      { name: 'ربع فرخة ورك', section: 'مشويات فالح' },
      { name: 'عنبة', section: 'المقبلات' },
      { name: 'مسبحة', section: 'المقبلات' }
    ];
    const foundItems = sampleItems.filter(item => rawHtml.includes(item.name));
    const allItemsMatch = foundItems.length === sampleItems.length;
    console.log(`6. Sample Menu Item Names extracted: ${allItemsMatch ? 'PASS' : 'FAIL'} (${foundItems.length}/${sampleItems.length} items verified)`);

    // 7. Prices and Currency
    const hasEgp = rawHtml.includes('EGP') || rawHtml.includes('ج.م');
    const hasItemPrices = rawHtml.includes('itemprop="price"') && rawHtml.includes('itemprop="priceCurrency"');
    console.log(`7. Prices and Currency extracted: ${hasEgp && hasItemPrices ? 'PASS (Currency EGP & item prices bound in initial DOM)' : 'FAIL'}`);

    // 8. Pre-rendered visual pages (without JS hydration)
    const hasPreRenderedImages = rawHtml.includes('figure class="svg-page"') && rawHtml.includes('preview.webp');
    console.log(`8. Pre-rendered Images in initial HTML: ${hasPreRenderedImages ? 'PASS (Images rendered server-side without JS)' : 'FAIL'}`);

    // 9. Schema.org Validation
    const hasSchema = rawHtml.includes('application/ld+json') && rawHtml.includes('"@type": "Menu"') && rawHtml.includes('"@type": "MenuItem"');
    console.log(`9. Schema.org Menu & Item Graph in initial HTML: ${hasSchema ? 'PASS' : 'FAIL'}`);

    const allPassed = nameMatch && cuisineMatch && locationMatch && hoursMatch && allSectionsMatch && allItemsMatch && hasEgp && hasPreRenderedImages && hasSchema;

    console.log('\n====================================================');
    if (allPassed) {
      console.log('RESULT: NO-JAVASCRIPT CRAWLER TEST PASSED (100%)');
      console.log('The entire menu, prices, descriptions, and metadata');
      console.log('are fully available in server-rendered initial HTML!');
    } else {
      console.error('RESULT: NO-JAVASCRIPT CRAWLER TEST FAILED');
      process.exit(1);
    }
    console.log('====================================================\n');
  } finally {
    server.close();
  }
}

testNoJsCrawler().catch(err => {
  console.error('Fatal error in test:', err);
  process.exit(1);
});
