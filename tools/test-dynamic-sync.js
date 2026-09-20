const http = require('http');
const fs = require('fs');
const path = require('path');
const app = require('../server');

async function testDynamicSync() {
  console.log('====================================================');
  console.log('TESTING DYNAMIC SVG UPDATE & SYNC');
  console.log('====================================================\n');

  const menuJsonPath = path.join(__dirname, '..', 'data', 'menu.json');
  const originalContent = fs.readFileSync(menuJsonPath, 'utf8');
  const state = JSON.parse(originalContent);

  const server = http.createServer(app);
  await new Promise(resolve => server.listen(0, resolve));
  const port = server.address().port;
  const url = `http://localhost:${port}/`;

  try {
    // 1. Initial price check
    const res1 = await fetch(url);
    const html1 = await res1.text();
    console.log('[Step 1] Initial HTML contains falafel samoon price (25):', html1.includes('25'));

    // 2. Simulate manager modifying SVG price in page.changes
    // In page 1, price index 2 is falafel samoon (originally 25). Let's change it to 28
    const page1 = state.pages[0];
    page1.changes = [
      { type: 'price', index: '2', value: '28' }
    ];
    fs.writeFileSync(menuJsonPath, JSON.stringify(state, null, 2), 'utf8');
    console.log('[Step 2] Simulated manager update saved in menu.json: changed price to 28.');

    // 3. Fetch GET / immediately without restarting server
    const res2 = await fetch(url);
    const html2 = await res2.text();
    const priceUpdatedInHtml = html2.includes('28');
    const priceUpdatedInJsonLd = html2.includes('"price": "28"');
    console.log('[Step 3] Live server-rendered HTML contains updated price (28):', priceUpdatedInHtml);
    console.log('[Step 3] Live Schema.org JSON-LD contains updated price (28):', priceUpdatedInJsonLd);

    if (priceUpdatedInHtml && priceUpdatedInJsonLd) {
      console.log('\n====================================================');
      console.log('RESULT: DYNAMIC SVG UPDATE PASSED (100%)');
      console.log('Prices and items update dynamically in initial HTML');
      console.log('and Schema.org whenever the SVG menu is updated!');
      console.log('====================================================\n');
    } else {
      throw new Error('Dynamic update failed to reflect in server-rendered output');
    }

  } finally {
    // Revert menu.json back to original
    fs.writeFileSync(menuJsonPath, originalContent, 'utf8');
    console.log('[Cleanup] Reverted test changes in menu.json.');
    server.close();
  }
}

testDynamicSync().catch(err => {
  console.error('Fatal error in dynamic sync test:', err);
  process.exit(1);
});
