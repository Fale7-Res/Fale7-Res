const fs = require('fs');

function cleanText(txt) {
  return String(txt || '').replace(/<[^>]+>/g, '').trim();
}

function parsePage1(svgContent) {
  const matches = [...svgContent.matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/gi)];
  const texts = matches.map(m => cleanText(m[1])).filter(Boolean);

  const sections = [];

  // Section 1: سندوتشات فالح
  // Starts after index 5 ('الصنف') up to index 69
  const falahItems = [];
  let i = 6;
  while (i < 70 && i + 3 < texts.length) {
    const name = texts[i];
    const pFransawi = texts[i + 1];
    const pSaj = texts[i + 2];
    const pSamoon = texts[i + 3];

    // Verify next 3 are numbers
    if (/^\d+$/.test(pFransawi) && /^\d+$/.test(pSaj) && /^\d+$/.test(pSamoon)) {
      falahItems.push({
        name,
        price: pSamoon,
        priceMax: pFransawi,
        variants: [
          { name: "صمون عراقي", price: pSamoon },
          { name: "صاج", price: pSaj },
          { name: "فرنساوي", price: pFransawi }
        ]
      });
      i += 4;
    } else {
      i++;
    }
  }

  sections.push({
    id: "faleh-sandwiches",
    name: "سندوتشات فالح (صمون عراقي - صاج - فرنساوي)",
    description: "سندوتشات فالح الشهيرة بخبز الصمون العراقي الهش أو الصاج أو الفرنساوي",
    items: falahItems
  });

  // Section 2: سندوتشات اللحوم والمشويات
  // Starts after 'سندوتشات اللحوم' header (around index 70-74)
  const meatItems = [];
  while (i < texts.length && texts[i] !== 'كفتة') {
    i++;
  }
  while (i < texts.length && texts[i] !== 'الأكثر' && i + 3 < texts.length) {
    const name = texts[i];
    const pFransawi = texts[i + 1];
    const pSaj = texts[i + 2];
    const pSamoon = texts[i + 3];

    if (/^\d+$/.test(pFransawi) && /^\d+$/.test(pSaj) && /^\d+$/.test(pSamoon)) {
      meatItems.push({
        name,
        price: pSamoon,
        priceMax: pFransawi,
        variants: [
          { name: "صمون عراقي", price: pSamoon },
          { name: "صاج", price: pSaj },
          { name: "فرنساوي", price: pFransawi }
        ]
      });
      i += 4;
    } else {
      break;
    }
  }

  sections.push({
    id: "meat-grill-sandwiches",
    name: "سندوتشات اللحوم والمشويات العراقية",
    description: "تشكيلة لحوم ومشويات طازجة على الفحم بخبز الصمون العراقي أو الصاج أو الفرنساوي",
    items: meatItems
  });

  // Section 3: الأكثر طلباً
  const popularNames = ["فلافل صمون", "مكس صمون", "فاهيتا فراخ", "كفتة صمون"];
  const popularItems = [];
  for (const pName of popularNames) {
    // Find price from existing items
    const match = [...falahItems, ...meatItems].find(it => pName.includes(it.name));
    popularItems.push({
      name: pName,
      price: match ? match.price : "30",
      description: `سندوتش ${pName} الأكثر طلباً في مطعم فالح أبو العنبة`
    });
  }
  sections.push({
    id: "most-popular",
    name: "الأكثر طلباً",
    items: popularItems
  });

  return sections;
}

function parsePage2(svgContent) {
  const matches = [...svgContent.matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/gi)];
  const texts = matches.map(m => cleanText(m[1])).filter(Boolean);

  const sections = [];

  // 1. وجبات فالح
  const mealItems = [];
  let i = 0;
  while (i < texts.length && texts[i] !== 'وجبة اقتصادية ورك') i++;

  while (i < texts.length && texts[i] !== 'مشويات فالح') {
    if (texts[i] === 'الوجبة' || texts[i] === 'السعر (جنيه)') {
      i++;
      continue;
    }
    const name = texts[i];
    const price = texts[i + 1];
    if (name && price && /^\d+$/.test(price)) {
      mealItems.push({
        name: name.replace(/^[(\s]+|[)\s]+$/g, '').trim(),
        price,
        description: "تشمل أرز وبطاطس وسلطات وخبز"
      });
      i += 2;
    } else {
      i++;
    }
  }

  sections.push({
    id: "meals",
    name: "وجبات فالح المتكاملة",
    description: "وجبات تقدم مع أرز وبطاطس وسلطات وخبز",
    items: mealItems
  });

  // 2. مشويات فالح
  const grillItems = [];
  while (i < texts.length && texts[i] !== 'المعجنات') {
    if (texts[i] === 'الصنف' || texts[i] === 'السعر (جنيه)' || texts[i] === 'مشويات فالح' || texts[i].includes('خبز و سلطات')) {
      i++;
      continue;
    }
    const name = texts[i];
    const price = texts[i + 1];
    if (name && price && /^\d+$/.test(price)) {
      grillItems.push({
        name,
        price,
        description: "مشويات على الفحم تقدم مع خبز وسلطات"
      });
      i += 2;
    } else {
      i++;
    }
  }

  sections.push({
    id: "grills",
    name: "مشويات فالح على الفحم",
    description: "مشويات عراقية على الفحم تقدم مع خبز وسلطات",
    items: grillItems
  });

  // 3. المعجنات
  const pastryItems = [];
  while (i < texts.length && texts[i] !== 'أطباق فالح') {
    if (texts[i] === 'الصنف' || texts[i] === 'السعر (جنيه)' || texts[i] === 'المعجنات') {
      i++;
      continue;
    }
    const name = texts[i];
    const price = texts[i + 1];
    if (name && price && /^\d+$/.test(price)) {
      pastryItems.push({
        name: name.startsWith('فطيرة') || name.startsWith('لحمة') || name.startsWith('مسخن') ? name : `فطيرة ${name}`,
        price
      });
      i += 2;
    } else {
      i++;
    }
  }

  sections.push({
    id: "pastries",
    name: "المعجنات والفطائر",
    items: pastryItems
  });

  // 4. أطباق فالح
  const platterItems = [];
  while (i < texts.length && texts[i] !== 'المقبلات') {
    if (texts[i] === 'الصنف' || texts[i] === 'أطباق فالح' || texts[i] === 'كبير' || texts[i] === 'وسط' || texts[i] === 'صغير') {
      i++;
      continue;
    }
    const name = texts[i];
    const p1 = texts[i + 1];
    const p2 = texts[i + 2];
    const p3 = texts[i + 3];

    // Check if table row
    if (name.startsWith('طبق')) {
      const variants = [];
      if (/^\d+$/.test(p3)) variants.push({ name: "صغير", price: p3 });
      if (/^\d+$/.test(p2)) variants.push({ name: "وسط", price: p2 });
      if (/^\d+$/.test(p1)) variants.push({ name: "كبير", price: p1 });

      const price = variants.length > 0 ? variants[0].price : "30";
      platterItems.push({
        name,
        price,
        priceMax: variants.length > 1 ? variants[variants.length - 1].price : undefined,
        variants: variants.length > 1 ? variants : undefined
      });
      i += 4;
    } else {
      i++;
    }
  }

  sections.push({
    id: "platters",
    name: "أطباق فالح",
    items: platterItems
  });

  // 5. المقبلات
  const appetizerItems = [];
  while (i < texts.length && texts[i] !== 'الأرز و المكرونة') {
    if (texts[i] === 'الصنف' || texts[i] === 'المقبلات' || texts[i] === 'كبير' || texts[i] === 'وسط' || texts[i] === 'صغير') {
      i++;
      continue;
    }
    const name = texts[i];
    const p1 = texts[i + 1];
    const p2 = texts[i + 2];
    const p3 = texts[i + 3];

    const variants = [];
    if (/^\d+$/.test(p3)) variants.push({ name: "صغير", price: p3 });
    if (/^\d+$/.test(p2)) variants.push({ name: "وسط", price: p2 });
    if (/^\d+$/.test(p1)) variants.push({ name: "كبير", price: p1 });

    if (variants.length > 0) {
      appetizerItems.push({
        name,
        price: variants[0].price,
        priceMax: variants.length > 1 ? variants[variants.length - 1].price : undefined,
        variants: variants.length > 1 ? variants : undefined
      });
      i += 4;
    } else {
      i++;
    }
  }

  sections.push({
    id: "appetizers",
    name: "المقبلات العراقية والسلطات",
    items: appetizerItems
  });

  // 6. الأرز والمكرونة
  const pastaItems = [];
  while (i < texts.length && texts[i] !== 'المشروبات') {
    if (texts[i] === 'الصنف' || texts[i] === 'الأرز و المكرونة' || texts[i] === 'كبير' || texts[i] === 'وسط' || texts[i] === 'صغير') {
      i++;
      continue;
    }
    const name = texts[i];
    const p1 = texts[i + 1];
    const p2 = texts[i + 2];
    const p3 = texts[i + 3];

    if (/^\d+$/.test(p1) || /^\d+$/.test(p2) || /^\d+$/.test(p3)) {
      const variants = [];
      if (/^\d+$/.test(p3)) variants.push({ name: "صغير", price: p3 });
      if (/^\d+$/.test(p2)) variants.push({ name: "وسط", price: p2 });
      if (/^\d+$/.test(p1)) variants.push({ name: "كبير", price: p1 });
      pastaItems.push({
        name: name === 'الأرز' ? 'طبق أرز' : name,
        price: variants[0].price,
        priceMax: variants.length > 1 ? variants[variants.length - 1].price : undefined,
        variants: variants.length > 1 ? variants : undefined
      });
      i += 4;
    } else {
      i++;
    }
  }

  sections.push({
    id: "rice-pasta",
    name: "الأرز والمكرونة",
    items: pastaItems
  });

  // 7. المشروبات والإضافات
  const drinkItems = [];
  while (i < texts.length && texts[i] !== 'خدمة التوصيل') {
    if (texts[i] === 'الصنف' || texts[i] === 'السعر (جنيه)' || texts[i] === 'المشروبات' || texts[i] === 'الإضافات' || texts[i] === 'صواني فالح' || texts[i] === 'قريبًا') {
      i++;
      continue;
    }
    const name = texts[i];
    const price = texts[i + 1];
    if (name && price && /^\d+$/.test(price)) {
      drinkItems.push({
        name: name.includes('كانز') ? 'مشروب كانز (أنواع)' : name.includes('لتر') ? 'مشروب لتر (أنواع)' : name,
        price
      });
      i += 2;
    } else {
      i++;
    }
  }

  sections.push({
    id: "beverages-addons",
    name: "المشروبات والإضافات",
    items: drinkItems
  });

  return sections;
}

function parseAllSvgMenu(svg1, svg2) {
  const p1 = parsePage1(svg1);
  const p2 = parsePage2(svg2);
  return [...p1, ...p2];
}

const s1 = fs.readFileSync('uploads/24834de6-002c-49a7-b049-8682e47098e7.svg', 'utf8');
const s2 = fs.readFileSync('uploads/e50f1da9-7181-4555-b0bc-d2ca166374f4.svg', 'utf8');
const allSections = parseAllSvgMenu(s1, s2);
console.log('Total extracted sections:', allSections.length);
allSections.forEach(s => console.log(`- ${s.name}: ${s.items.length} items`));
console.log('\nSample items from section 0:', allSections[0].items.slice(0, 3));
console.log('\nSample items from section 3 (meals):', allSections[3].items.slice(0, 3));
