const fs = require('fs');
const path = require('path');

function cleanText(txt) {
  return String(txt || '').replace(/<[^>]+>/g, '').trim();
}

function applyTextChanges(svg, changes) {
  if (!Array.isArray(changes) || changes.length === 0) return svg;
  const values = new Map();
  for (const change of changes) {
    const index = Number.parseInt(change.index, 10);
    const value = String(change.value ?? '').trim();
    if (Number.isInteger(index) && value) {
      values.set(`${change.type === 'price' ? 'data-price-index' : 'data-product-index'}:${index}`, value);
    }
  }
  return svg.replace(/(<text\b[^>]*\b(data-price-index|data-product-index)=["'](\d+)["'][^>]*>)([\s\S]*?)(<\/text>)/gi, (match, start, attribute, index, body, end) => {
    const value = values.get(`${attribute.toLowerCase()}:${index}`);
    return value === undefined ? match : `${start}${value}${end}`;
  });
}

function parsePage1(svgContent) {
  const matches = [...svgContent.matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/gi)];
  const texts = matches.map(m => cleanText(m[1])).filter(Boolean);
  const sections = [];

  // Section 1: سندوتشات فالح
  const falahItems = [];
  let i = 6;
  while (i < 70 && i + 3 < texts.length) {
    const name = texts[i];
    const pFransawi = texts[i + 1];
    const pSaj = texts[i + 2];
    const pSamoon = texts[i + 3];

    if (/^\d+$/.test(pFransawi) && /^\d+$/.test(pSaj) && /^\d+$/.test(pSamoon)) {
      falahItems.push({
        name,
        price: pSamoon,
        priceMax: pFransawi,
        description: `سندوتش ${name} بخبز الصمون العراقي، الصاج، أو الفرنساوي`,
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
  const meatItems = [];
  while (i < texts.length && texts[i] !== 'كفتة') i++;
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
        description: `سندوتش ${name} طازج على الفحم بخبز الصمون العراقي، الصاج، أو الفرنساوي`,
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
    const match = [...falahItems, ...meatItems].find(it => pName.includes(it.name));
    popularItems.push({
      name: pName,
      price: match ? match.price : "30",
      description: `سندوتش ${pName} الأكثر طلباً بمطعم فالح أبو العنبة`
    });
  }
  sections.push({
    id: "most-popular",
    name: "الأكثر طلباً",
    description: "الأصناف الأكثر طلباً ومحبة لدى زبائن مطعم فالح أبو العنبة",
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
        description: "وجبة متكاملة تشمل أرز وبطاطس وسلطات وخبز"
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
        description: "مشويات عراقية على الفحم تقدم مع خبز وسلطات بدون أرز وبطاطس"
      });
      i += 2;
    } else {
      i++;
    }
  }

  sections.push({
    id: "grills",
    name: "مشويات فالح على الفحم",
    description: "مشويات عراقية على الفحم تقدم مع خبز وسلطات فقط بدون أرز وبطاطس",
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
        price,
        description: `فطيرة ومخبوزات طازجة`
      });
      i += 2;
    } else {
      i++;
    }
  }

  sections.push({
    id: "pastries",
    name: "المعجنات والفطائر",
    description: "فطائر ومعجنات طازجة ومسخن ولحمة بعجين",
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
        description: `${name} بأحجام مختلفة`,
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
    description: "أطباق فطور ومقبلات بأحجام مختلفة (صغير - وسط - كبير)",
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
        description: `مقبلات عراقية طازجة (${name})`,
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
    description: "عنبة عراقية أصلية، مسبحة، طحينة، سلطة خضراء، وثومية",
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
        description: `${name} شهي وساخن`,
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
    description: "أرز مصري وبسمتي، مكرونة بشاميل، ومكرونة نجرسكو",
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
        price,
        description: `${name}`
      });
      i += 2;
    } else {
      i++;
    }
  }

  sections.push({
    id: "beverages-addons",
    name: "المشروبات والإضافات",
    description: "مشروبات غازية، مياه معدنية، وإضافات متنوعة",
    items: drinkItems
  });

  return sections;
}

function getMenuSections() {
  const root = __dirname;
  const menuJsonPath = path.join(root, 'data', 'menu.json');
  const uploadDir = path.join(root, 'uploads');

  try {
    if (fs.existsSync(menuJsonPath)) {
      const state = JSON.parse(fs.readFileSync(menuJsonPath, 'utf8'));
      if (Array.isArray(state.pages) && state.pages.length >= 2) {
        const p1 = state.pages[0];
        const p2 = state.pages[1];

        const p1Path = path.join(uploadDir, p1.fileName);
        const p2Path = path.join(uploadDir, p2.fileName);

        if (fs.existsSync(p1Path) && fs.existsSync(p2Path)) {
          let svg1 = fs.readFileSync(p1Path, 'utf8');
          let svg2 = fs.readFileSync(p2Path, 'utf8');

          if (p1.changes) svg1 = applyTextChanges(svg1, p1.changes);
          if (p2.changes) svg2 = applyTextChanges(svg2, p2.changes);

          const sec1 = parsePage1(svg1);
          const sec2 = parsePage2(svg2);
          const dynamicSections = [...sec1, ...sec2];

          if (dynamicSections.length > 0) {
            return dynamicSections;
          }
        }
      }
    }
  } catch (err) {
    console.error('Dynamic SVG extraction error, falling back to cached json:', err.message);
  }

  // Fallback to data/menu-data.json if exists
  const filePath = path.join(root, 'data', 'menu-data.json');
  try {
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      if (Array.isArray(data.sections) && data.sections.length > 0) {
        return data.sections;
      }
    }
  } catch (e) {}

  return [];
}

function generateSchemaGraph(sections) {
  const baseUrl = "https://fale7-res.vercel.app";
  const schemaSections = sections.map(section => ({
    "@type": "MenuSection",
    "name": section.name,
    "description": section.description || undefined,
    "hasMenuItem": section.items.map(item => {
      const menuItem = {
        "@type": "MenuItem",
        "name": item.name,
        "description": item.description || undefined,
        "inLanguage": "ar"
      };
      if (item.variants && item.variants.length > 0) {
        menuItem.offers = item.variants.map(v => ({
          "@type": "Offer",
          "name": `${item.name} (${v.name})`,
          "price": v.price,
          "priceCurrency": "EGP",
          "availability": "https://schema.org/InStock"
        }));
      } else if (item.price) {
        menuItem.offers = {
          "@type": "Offer",
          "price": item.price,
          "priceCurrency": "EGP",
          "availability": "https://schema.org/InStock"
        };
      }
      return menuItem;
    })
  }));

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        "url": `${baseUrl}/`,
        "name": "فالح أبو العنبة",
        "description": "منيو سندوتشات ومأكولات مطعم فالح أبو العنبة الرسمي (منذ 1961) - أكل ومطعم عراقي في مصر",
        "inLanguage": "ar"
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${baseUrl}/#breadcrumb`,
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "الرئيسية",
            "item": `${baseUrl}/`
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "المنيو وقائمة الطعام",
            "item": `${baseUrl}/#menu`
          }
        ]
      },
      {
        "@type": "Restaurant",
        "@id": `${baseUrl}/#restaurant`,
        "name": "مطعم فالح أبو العنبة",
        "alternateName": ["فالح أبو العنبة", "Fale7 Restaurant", "مطعم فالح 1961", "مطعم عراقي فالح أبو العنبة"],
        "description": "مطعم فالح أبو العنبة (تأسس منذ عام 1961) - أكل ومطعم عراقي في مصر، يقدم أشهى المأكولات العراقية وسندوتشات الصمون العراقي، فلافل، كفتة، شيش، مشويات على الفحم، وجبات، ومعجنات بمدينة 6 أكتوبر، محافظة الجيزة.",
        "foundingDate": "1961",
        "url": `${baseUrl}/`,
        "telephone": ["+201000602832", "+201144741115"],
        "servesCuisine": ["Iraqi", "Middle Eastern", "Sandwiches", "Grill"],
        "priceRange": "$$",
        "currenciesAccepted": "EGP",
        "paymentAccepted": "Cash, Credit Card, Visa, InstaPay, Mobile Wallets",
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": [
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
              "Sunday"
            ],
            "opens": "07:00",
            "closes": "03:00"
          }
        ],
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "شارع مكة المكرمة، سنتر الأردنية، بالقرب من قسم أول 6 أكتوبر، الحي السابع",
          "addressLocality": "مدينة 6 أكتوبر",
          "addressRegion": "محافظة الجيزة",
          "addressCountry": "EG"
        },
        "hasMap": "https://maps.app.goo.gl/DqNEo521pyEbMpD49",
        "sameAs": [
          "https://www.facebook.com/share/1FTjzqpHv8/",
          "https://www.tiktok.com/@fale7_1961",
          "https://maps.app.goo.gl/DqNEo521pyEbMpD49"
        ],
        "image": `${baseUrl}/previews/24834de6-002c-49a7-b049-8682e47098e7-88a8ff393e10-1600.webp`,
        "hasMenu": {
          "@type": "Menu",
          "@id": `${baseUrl}/#menu`,
          "name": "قائمة طعام ومنيو مطعم فالح أبو العنبة",
          "inLanguage": "ar",
          "hasMenuSection": schemaSections
        }
      }
    ]
  };
}

function renderHtmlMenu(sections) {
  let html = `<div class="geo-menu-wrapper" itemscope itemtype="https://schema.org/Menu">
    <header class="geo-menu-header">
      <h1 itemprop="name">منيو مطعم فالح أبو العنبة الرسمي (منذ 1961)</h1>
      <p class="geo-tagline" itemprop="description">أكل ومطعم عراقي في مصر - ألذ سندوتشات صمون ومشويات ووجبات على أصولها بالأسعار الرسمية المعتمدة</p>
    </header>

    <div class="geo-sections-grid">`;

  for (const sec of sections) {
    html += `\n      <section class="geo-menu-section" id="${sec.id}" itemscope itemtype="https://schema.org/MenuSection">
        <h2 class="geo-section-title" itemprop="name">${sec.name}</h2>
        ${sec.description ? `<p class="geo-section-desc" itemprop="description">${sec.description}</p>` : ''}
        <ul class="geo-items-list">`;

    for (const item of sec.items) {
      html += `\n          <li class="geo-item-card" itemscope itemtype="https://schema.org/MenuItem">
            <div class="geo-item-main">
              <span class="geo-item-name" itemprop="name">${item.name}</span>
              ${item.description ? `<span class="geo-item-desc" itemprop="description">${item.description}</span>` : ''}
            </div>`;

      if (item.variants && item.variants.length > 0) {
        html += `\n            <div class="geo-item-variants">`;
        for (const v of item.variants) {
          html += `\n              <span class="geo-variant" itemscope itemtype="https://schema.org/Offer">
                <span class="variant-type">${v.name}:</span>
                <strong class="variant-price" itemprop="price">${v.price}</strong>
                <span class="variant-currency" itemprop="priceCurrency" content="EGP">ج.م</span>
              </span>`;
        }
        html += `\n            </div>`;
      } else if (item.price) {
        html += `\n            <div class="geo-item-price" itemscope itemtype="https://schema.org/Offer">
              <strong class="price-val" itemprop="price">${item.price}</strong>
              <span class="price-curr" itemprop="priceCurrency" content="EGP">ج.م</span>
            </div>`;
      }

      html += `\n          </li>`;
    }

    html += `\n        </ul>
      </section>`;
  }

  html += `\n    </div>
  </div>`;
  return html;
}

function renderQuickFacts() {
  return `<section class="geo-quick-facts" id="restaurant-facts" aria-label="معلومات وحقائق سريعة عن مطعم فالح أبو العنبة">
    <h2>معلومات مطعم فالح أبو العنبة وإجابات سريعة (Facts & Overview)</h2>
    <dl class="geo-facts-list">
      <div class="geo-fact-item">
        <dt>اسم المطعم الرسمي:</dt>
        <dd>سندوتشات ومأكولات مطعم فالح أبو العنبة (فالح أبو العنبة)</dd>
      </div>
      <div class="geo-fact-item">
        <dt>تاريخ التأسيس والخبرة:</dt>
        <dd>تأسس عام 1961 (منذ 1961 - أكثر من 60 عامًا من الخبرة والتراث في الأكل والمطبخ العراقي الأصيل).</dd>
      </div>
      <div class="geo-fact-item">
        <dt>نوع المأكولات (Cuisine):</dt>
        <dd>أكل ومطعم عراقي في مصر (Iraqi Cuisine)، سندوتشات خبز صمون عراقي، فلافل، مشويات على الفحم، كفتة، شيش، برجر، وجبات عائلية، عنبة عراقية، مسبحة، كبيبة، ومعجنات.</dd>
      </div>
      <div class="geo-fact-item">
        <dt>مواعيد وساعات العمل (Opening Hours):</dt>
        <dd>يوميًا من 7:00 صباحًا حتى 3:00 فجرًا (07:00 AM - 03:00 AM).</dd>
      </div>
      <div class="geo-fact-item">
        <dt>أرقام خدمة التوصيل والدليفري (Delivery Phones):</dt>
        <dd>
          <a href="tel:01000602832" dir="ltr">0100 060 2832</a> / 
          <a href="tel:01144741115" dir="ltr">0114 474 1115</a>
        </dd>
      </div>
      <div class="geo-fact-item">
        <dt>الموقع الجغرافي والعنوان التفصيلي:</dt>
        <dd>محافظة الجيزة، مدينة 6 أكتوبر، الحي السابع، شارع مكة المكرمة، سنتر الأردنية، بالقرب من قسم أول 6 أكتوبر - <a href="https://maps.app.goo.gl/DqNEo521pyEbMpD49" target="_blank" rel="noopener noreferrer">عرض الموقع المباشر على خرائط جوجل</a></dd>
      </div>
      <div class="geo-fact-item">
        <dt>طرق الدفع المقبولة والعملة:</dt>
        <dd>كاش (نقدًا)، فيزا (بطاقات بنكية)، انستا باي (InstaPay)، ومحافظ إلكترونية بالجنيه المصري (EGP).</dd>
      </div>
      <div class="geo-fact-item">
        <dt>منصات التواصل الرسمية:</dt>
        <dd>
          <a href="https://www.facebook.com/share/1FTjzqpHv8/" target="_blank" rel="noopener noreferrer">فيسبوك (Facebook)</a> | 
          <a href="https://www.tiktok.com/@fale7_1961" target="_blank" rel="noopener noreferrer">تيك توك (TikTok)</a>
        </dd>
      </div>
    </dl>
  </section>`;
}

module.exports = {
  getMenuSections,
  generateSchemaGraph,
  renderHtmlMenu,
  renderQuickFacts,
  parsePage1,
  parsePage2,
  applyTextChanges
};
