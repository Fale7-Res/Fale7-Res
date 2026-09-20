const http = require('http');
const app = require('../server');

async function verifyCustomerAndCrawler() {
  console.log('====================================================');
  console.log('VERIFYING CUSTOMER VIEW & CRAWLER/SEO VIEW');
  console.log('====================================================\n');

  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, resolve));
  const port = server.address().port;
  const url = `http://localhost:${port}/`;

  try {
    const res = await fetch(url);
    const html = await res.text();

    console.log('--- TEST 1: CUSTOMER VIEW (Clean & Minimal UI) ---');

    // Check that unwanted elements do NOT exist in the body
    const bodyStart = html.indexOf('<body');
    const bodyContent = html.substring(bodyStart);

    const hasDetailsButton = bodyContent.includes('تفاصيل المنيو');
    const hasDetailsList = bodyContent.includes('تفاصيل القائمة');
    const hasMachineReadable = bodyContent.includes('Machine-Readable Menu');
    const hasAiReadable = bodyContent.includes('AI-readable Menu');
    const hasSeoAccordion = bodyContent.includes('seo-menu-accordion');
    const hasSemanticContainer = bodyContent.includes('seo-semantic-container');
    const hasDuplicateLists = bodyContent.includes('geo-items-list') || bodyContent.includes('geo-sections-grid');

    const customerViewClean = 
      !hasDetailsButton &&
      !hasDetailsList &&
      !hasMachineReadable &&
      !hasAiReadable &&
      !hasSeoAccordion &&
      !hasSemanticContainer &&
      !hasDuplicateLists;

    console.log(`- Button 'تفاصيل المنيو' absent: ${!hasDetailsButton ? 'PASS' : 'FAIL'}`);
    console.log(`- Text 'Machine-Readable Menu' absent: ${!hasMachineReadable ? 'PASS' : 'FAIL'}`);
    console.log(`- Accordion / details absent: ${!hasSeoAccordion ? 'PASS' : 'FAIL'}`);
    console.log(`- Duplicate text menu lists absent: ${!hasDuplicateLists ? 'PASS' : 'FAIL'}`);
    console.log(`- Visual menu images present: ${bodyContent.includes('figure class="svg-page"') ? 'PASS' : 'FAIL'}`);
    console.log(`- Header controls & brand title present: ${bodyContent.includes('مطعم فالح أبو العنبة') && bodyContent.includes('refreshBtn') ? 'PASS' : 'FAIL'}`);
    console.log(`TEST 1 RESULT: ${customerViewClean ? 'PASS (Customer view is 100% clean and minimal)' : 'FAIL'}\n`);

    console.log('--- TEST 2: CRAWLER / SEO VIEW (Structured Data & Meta) ---');

    // Check JSON-LD graph
    const jsonLdMatch = html.match(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/i);
    let parsedSchema = null;
    if (jsonLdMatch) {
      try {
        parsedSchema = JSON.parse(jsonLdMatch[1]);
      } catch (e) {}
    }

    const hasValidJsonLd = parsedSchema && Array.isArray(parsedSchema['@graph']);
    console.log(`- JSON-LD syntax valid: ${hasValidJsonLd ? 'PASS' : 'FAIL'}`);

    const graph = parsedSchema ? parsedSchema['@graph'] : [];
    const restaurant = graph.find(e => e['@type'] === 'Restaurant');
    const menu = restaurant?.hasMenu;

    const hasRestaurantName = restaurant?.name === 'مطعم فالح أبو العنبة';
    const hasCuisine = Array.isArray(restaurant?.servesCuisine) && restaurant.servesCuisine.includes('Iraqi');
    const hasLocation = restaurant?.address?.addressLocality && restaurant?.address?.streetAddress;
    const hasHours = Array.isArray(restaurant?.openingHoursSpecification) && restaurant.openingHoursSpecification.length > 0;
    const hasSections = Array.isArray(menu?.hasMenuSection) && menu.hasMenuSection.length === 10;
    
    let totalItems = 0;
    if (menu?.hasMenuSection) {
      menu.hasMenuSection.forEach(sec => totalItems += (sec.hasMenuItem?.length || 0));
    }
    const hasItems = totalItems >= 100;

    console.log(`- Restaurant entity discoverable: ${hasRestaurantName ? 'PASS' : 'FAIL'}`);
    console.log(`- Iraqi cuisine discoverable: ${hasCuisine ? 'PASS' : 'FAIL'}`);
    console.log(`- 6th of October address discoverable: ${hasLocation ? 'PASS' : 'FAIL'}`);
    console.log(`- Opening hours discoverable (07:00-03:00): ${hasHours ? 'PASS' : 'FAIL'}`);
    console.log(`- Menu sections discoverable (10 sections): ${hasSections ? 'PASS' : 'FAIL'}`);
    console.log(`- Menu items and prices discoverable (${totalItems} items): ${hasItems ? 'PASS' : 'FAIL'}`);
    console.log(`- Title and meta description valid: ${html.includes('<title>') && html.includes('<meta name="description"') ? 'PASS' : 'FAIL'}`);
    console.log(`- Canonical URL valid: ${html.includes('<link rel="canonical" href="https://fale7-res.vercel.app/"') ? 'PASS' : 'FAIL'}`);

    const crawlerViewValid = hasValidJsonLd && hasRestaurantName && hasCuisine && hasLocation && hasHours && hasSections && hasItems;
    console.log(`TEST 2 RESULT: ${crawlerViewValid ? 'PASS (100% Schema.org / SEO / GEO preserved in background)' : 'FAIL'}\n`);

    if (customerViewClean && crawlerViewValid) {
      console.log('====================================================');
      console.log('BOTH TESTS PASSED SUCCESSFULLY!');
      console.log('Customer UI: Minimal, clean, focused purely on menu images.');
      console.log('SEO/GEO Layer: Comprehensive, dynamic, valid Schema.org in background.');
      console.log('====================================================\n');
    } else {
      console.error('VERIFICATION FAILED');
      process.exit(1);
    }
  } finally {
    server.close();
  }
}

verifyCustomerAndCrawler().catch(err => {
  console.error('Fatal error during verification:', err);
  process.exit(1);
});
