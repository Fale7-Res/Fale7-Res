const fs = require('fs');
const path = require('path');

// Base menu data representing all verified items from the official menu pages (Page 1 & Page 2)
const defaultMenuSections = [
  {
    id: "faleh-sandwiches",
    name: "سندوتشات فالح",
    description: "سندوتشات فالح متوفرة بخبز فرنساوي، صاج، أو صمون",
    items: [
      { name: "فلافل", price: "25", priceMax: "30", variants: [{ name: "صمون", price: "25" }, { name: "صاج", price: "25" }, { name: "فرنساوي", price: "30" }] },
      { name: "بطاطس", price: "30", priceMax: "35", variants: [{ name: "صمون", price: "30" }, { name: "صاج", price: "30" }, { name: "فرنساوي", price: "35" }] },
      { name: "مكس (بطاطس + فلافل)", price: "30", priceMax: "35", variants: [{ name: "صمون", price: "30" }, { name: "صاج", price: "30" }, { name: "فرنساوي", price: "35" }] },
      { name: "مكس باذنجان", price: "40", priceMax: "45", variants: [{ name: "صمون", price: "40" }, { name: "صاج", price: "40" }, { name: "فرنساوي", price: "45" }] },
      { name: "مكس فالح", price: "40", priceMax: "45", variants: [{ name: "صمون", price: "40" }, { name: "صاج", price: "40" }, { name: "فرنساوي", price: "45" }] },
      { name: "بطاطس رومي", price: "45", priceMax: "50", variants: [{ name: "صمون", price: "45" }, { name: "صاج", price: "45" }, { name: "فرنساوي", price: "50" }] },
      { name: "بطاطس موزاريلا", price: "45", priceMax: "50", variants: [{ name: "صمون", price: "45" }, { name: "صاج", price: "45" }, { name: "فرنساوي", price: "50" }] },
      { name: "بطاطس شيدر", price: "45", priceMax: "50", variants: [{ name: "صمون", price: "45" }, { name: "صاج", price: "45" }, { name: "فرنساوي", price: "50" }] },
      { name: "بطاطس 2 نوع جبنة", price: "55", priceMax: "60", variants: [{ name: "صمون", price: "55" }, { name: "صاج", price: "55" }, { name: "فرنساوي", price: "60" }] },
      { name: "بطاطس 3 نوع جبنة", price: "65", priceMax: "70", variants: [{ name: "صمون", price: "65" }, { name: "صاج", price: "65" }, { name: "فرنساوي", price: "70" }] },
      { name: "أومليت ساده", price: "35", priceMax: "40", variants: [{ name: "صمون", price: "35" }, { name: "صاج", price: "35" }, { name: "فرنساوي", price: "40" }] },
      { name: "أومليت جبنة", price: "45", priceMax: "50", variants: [{ name: "صمون", price: "45" }, { name: "صاج", price: "45" }, { name: "فرنساوي", price: "50" }] },
      { name: "بيض بالبسطرمة", price: "50", priceMax: "65", variants: [{ name: "صمون", price: "50" }, { name: "صاج", price: "50" }, { name: "فرنساوي", price: "65" }] },
      { name: "كبيبة", price: "45", priceMax: "50", variants: [{ name: "صمون", price: "45" }, { name: "صاج", price: "45" }, { name: "فرنساوي", price: "50" }] },
      { name: "جبنة مقلية", price: "45", priceMax: "50", variants: [{ name: "صمون", price: "45" }, { name: "صاج", price: "45" }, { name: "فرنساوي", price: "50" }] },
      { name: "لبنة", price: "25", priceMax: "30", variants: [{ name: "صمون", price: "25" }, { name: "صاج", price: "25" }, { name: "فرنساوي", price: "30" }] }
    ]
  },
  {
    id: "meat-grill-sandwiches",
    name: "سندوتشات اللحوم والمشويات",
    description: "تشكيلة لحوم ومشويات طازجة بخبز فرنساوي، صاج، أو صمون",
    items: [
      { name: "كفتة", price: "90", priceMax: "95", variants: [{ name: "صمون", price: "90" }, { name: "صاج", price: "90" }, { name: "فرنساوي", price: "95" }] },
      { name: "كفتة موزاريلا", price: "100", priceMax: "105", variants: [{ name: "صمون", price: "100" }, { name: "صاج", price: "100" }, { name: "فرنساوي", price: "105" }] },
      { name: "شيش", price: "90", priceMax: "95", variants: [{ name: "صمون", price: "90" }, { name: "صاج", price: "90" }, { name: "فرنساوي", price: "95" }] },
      { name: "شيش موزاريلا", price: "100", priceMax: "105", variants: [{ name: "صمون", price: "100" }, { name: "صاج", price: "100" }, { name: "فرنساوي", price: "105" }] },
      { name: "كبدة جريل", price: "70", priceMax: "75", variants: [{ name: "صمون", price: "70" }, { name: "صاج", price: "70" }, { name: "فرنساوي", price: "75" }] },
      { name: "برجر", price: "80", priceMax: "85", variants: [{ name: "صمون", price: "80" }, { name: "صاج", price: "80" }, { name: "فرنساوي", price: "85" }] },
      { name: "برجر بالجبنة", price: "90", priceMax: "95", variants: [{ name: "صمون", price: "90" }, { name: "صاج", price: "90" }, { name: "فرنساوي", price: "95" }] },
      { name: "برجر بالبيض", price: "90", priceMax: "95", variants: [{ name: "صمون", price: "90" }, { name: "صاج", price: "90" }, { name: "فرنساوي", price: "95" }] },
      { name: "برجر كينج (بيض + جبنة)", price: "100", priceMax: "105", variants: [{ name: "صمون", price: "100" }, { name: "صاج", price: "100" }, { name: "فرنساوي", price: "105" }] },
      { name: "بانيه بلدي", price: "90", priceMax: "95", variants: [{ name: "صمون", price: "90" }, { name: "صاج", price: "90" }, { name: "فرنساوي", price: "95" }] },
      { name: "بانيه بالجبنة", price: "100", priceMax: "105", variants: [{ name: "صمون", price: "100" }, { name: "صاج", price: "100" }, { name: "فرنساوي", price: "105" }] },
      { name: "كريسبي", price: "90", priceMax: "95", variants: [{ name: "صمون", price: "90" }, { name: "صاج", price: "90" }, { name: "فرنساوي", price: "95" }] },
      { name: "زنجر", price: "90", priceMax: "95", variants: [{ name: "صمون", price: "90" }, { name: "صاج", price: "90" }, { name: "فرنساوي", price: "95" }] },
      { name: "مكسيكان", price: "70", priceMax: "75", variants: [{ name: "صمون", price: "70" }, { name: "صاج", price: "70" }, { name: "فرنساوي", price: "75" }] },
      { name: "فاهيتا فراخ", price: "90", priceMax: "95", variants: [{ name: "صمون", price: "90" }, { name: "صاج", price: "90" }, { name: "فرنساوي", price: "95" }] },
      { name: "بيض باللحمة", price: "75", priceMax: "80", variants: [{ name: "صمون", price: "75" }, { name: "صاج", price: "75" }, { name: "فرنساوي", price: "80" }] }
    ]
  },
  {
    id: "meals",
    name: "وجبات فالح المتكاملة",
    description: "وجبات تشمل أرز وبطاطس وسلطات وخبز",
    items: [
      { name: "وجبة اقتصادية ورك", price: "110", description: "أرز وبطاطس وسلطات وخبز" },
      { name: "وجبة اقتصادية صدر", price: "140", description: "أرز وبطاطس وسلطات وخبز" },
      { name: "وجبة كبسة", price: "190", description: "كبسة مع صوص وسلطات وخبز" },
      { name: "وجبة عائلية", price: "380", description: "تشكيلة وجبة عائلية مع أرز وبطاطس وسلطات" },
      { name: "وجبة عائلية مسحب", price: "390", description: "دجاج مسحب عائلي مع أرز وبطاطس وسلطات" },
      { name: "وجبة مسحب", price: "200", description: "دجاج مسحب مع أرز وبطاطس وسلطات" },
      { name: "وجبة عائلية شيش", price: "385", description: "شيش طاووق عائلي مع أرز وبطاطس وسلطات" },
      { name: "وجبة موفرة ورك", price: "170", description: "أرز وبطاطس وسلطات وخبز" },
      { name: "وجبة موفرة صدر", price: "180", description: "أرز وبطاطس وسلطات وخبز" },
      { name: "وجبة كفتة", price: "170", description: "كفتة مشوية مع أرز وبطاطس وسلطات وخبز" },
      { name: "وجبة شيش", price: "170", description: "شيش طاووق مع أرز وبطاطس وسلطات وخبز" },
      { name: "وجبة شيش + كفتة", price: "170", description: "مكس شيش وكفتة مع أرز وبطاطس وسلطات" },
      { name: "وجبة مكس جريل ورك", price: "220", description: "مكس جريل ورك مع أرز وبطاطس وسلطات" },
      { name: "وجبة مكس جريل صدر", price: "230", description: "مكس جريل صدر مع أرز وبطاطس وسلطات" },
      { name: "وجبة بانيه / زنجر / كرسبي / فاهيتا", price: "175", description: "اختيارك من الدجاج المقلي أو الفاهيتا مع أرز وبطاطس وسلطات" }
    ]
  },
  {
    id: "grills",
    name: "مشويات فالح على الفحم",
    description: "تقدم مع خبز وسلطات فقط بدون أرز وبطاطس",
    items: [
      { name: "ربع فرخة ورك مشوي", price: "100" },
      { name: "ربع فرخة صدر مشوي", price: "120" },
      { name: "نصف فرخة مشوية", price: "165" },
      { name: "نصف فرخة شيش", price: "170" },
      { name: "نصف فرخة مسحب", price: "170" },
      { name: "فرخة مسحب كاملة", price: "350" },
      { name: "فرخة فحم كاملة", price: "340" },
      { name: "فرخة شيش كاملة", price: "345" },
      { name: "كفتة مشوية", price: "150", priceMax: "600", variants: [{ name: "ربع كيلو", price: "150" }, { name: "نصف كيلو", price: "300" }, { name: "كيلو", price: "600" }] },
      { name: "شيش طاووق مشوي", price: "150", priceMax: "600", variants: [{ name: "ربع كيلو", price: "150" }, { name: "نصف كيلو", price: "300" }, { name: "كيلو", price: "600" }] }
    ]
  },
  {
    id: "pastries",
    name: "المعجنات والفطائر",
    description: "فطائر طازجة مخبوزة بأجود المكونات",
    items: [
      { name: "فطيرة جبنة بيضاء", price: "15" },
      { name: "فطيرة جبنة رومي", price: "15" },
      { name: "فطيرة جبنة شيدر", price: "15" },
      { name: "فطيرة جبنة كيري", price: "15" },
      { name: "لحمة بعجين", price: "20" },
      { name: "فطيرة سوسيس", price: "15" },
      { name: "فطيرة سبانخ", price: "15" },
      { name: "فطيرة زعتر", price: "15" },
      { name: "فطيرة زعتر جبنة", price: "20" },
      { name: "مسخن", price: "50" }
    ]
  },
  {
    id: "platters",
    name: "أطباق فالح",
    description: "أطباق مقبلات وإفطار بأحجام مختلفة (صغير - وسط - كبير)",
    items: [
      { name: "طبق فلافل (5 حبات)", price: "5", priceMax: "15", variants: [{ name: "صغير", price: "5" }, { name: "وسط", price: "10" }, { name: "كبير", price: "15" }] },
      { name: "طبق بطاطس", price: "25", priceMax: "50", variants: [{ name: "صغير", price: "25" }, { name: "وسط", price: "30" }, { name: "كبير", price: "50" }] },
      { name: "طبق أومليت سادة", price: "30", priceMax: "50", variants: [{ name: "صغير", price: "30" }, { name: "وسط", price: "40" }, { name: "كبير", price: "50" }] },
      { name: "طبق أومليت بالجبنة", price: "40", priceMax: "50", variants: [{ name: "صغير", price: "40" }, { name: "وسط", price: "45" }, { name: "كبير", price: "50" }] },
      { name: "طبق بيض بالبسطرمة", price: "50", priceMax: "70", variants: [{ name: "صغير", price: "50" }, { name: "وسط", price: "60" }, { name: "كبير", price: "70" }] },
      { name: "طبق كبيبة (3 قطع)", price: "90" },
      { name: "طبق باذنجان", price: "15", priceMax: "30", variants: [{ name: "صغير", price: "15" }, { name: "وسط", price: "25" }, { name: "كبير", price: "30" }] },
      { name: "طبق بطاطس بالجبنة", price: "45", priceMax: "60", variants: [{ name: "صغير", price: "45" }, { name: "وسط", price: "55" }, { name: "كبير", price: "60" }] },
      { name: "طبق كبدة", price: "70", priceMax: "120", variants: [{ name: "صغير", price: "70" }, { name: "كبير", price: "120" }] },
      { name: "طبق لبنة", price: "30" }
    ]
  },
  {
    id: "appetizers",
    name: "المقبلات والسلطات",
    description: "مقبلات وسلطات طازجة متنوعة",
    items: [
      { name: "عنبة", price: "15", priceMax: "30", variants: [{ name: "صغير", price: "15" }, { name: "وسط", price: "20" }, { name: "كبير", price: "30" }] },
      { name: "مسبحة", price: "25" },
      { name: "طحينة", price: "15", priceMax: "25", variants: [{ name: "وسط", price: "15" }, { name: "كبير", price: "25" }] },
      { name: "سلطة خضراء", price: "20", priceMax: "30", variants: [{ name: "وسط", price: "20" }, { name: "كبير", price: "30" }] },
      { name: "ثومية", price: "15", priceMax: "30", variants: [{ name: "وسط", price: "15" }, { name: "كبير", price: "30" }] },
      { name: "حبة كبيبة", price: "30" }
    ]
  },
  {
    id: "rice-pasta",
    name: "الأرز والمكرونة",
    items: [
      { name: "طبق أرز", price: "35", priceMax: "55", variants: [{ name: "صغير", price: "35" }, { name: "وسط", price: "45" }, { name: "كبير", price: "55" }] },
      { name: "مكرونة بشاميل", price: "50" },
      { name: "مكرونة نجرسكو", price: "50" }
    ]
  },
  {
    id: "beverages-addons",
    name: "المشروبات والإضافات",
    items: [
      { name: "مياه معدنية", price: "10" },
      { name: "مشروب كانز (أنواع)", price: "25" },
      { name: "مشروب لتر (أنواع)", price: "35" },
      { name: "إضافة بيض", price: "10" },
      { name: "إضافة باذنجان", price: "5" },
      { name: "إضافة مسبحة", price: "5" },
      { name: "إضافة لبنة", price: "5" },
      { name: "إضافة جبنة رومي", price: "15" },
      { name: "إضافة جبنة شيدر", price: "15" },
      { name: "إضافة جبنة موزاريلا", price: "15" }
    ]
  },
  {
    id: "most-popular",
    name: "الأكثر طلباً",
    items: [
      { name: "فلافل صمون", price: "25", description: "سندوتش فلافل بخبز الصمون المميز" },
      { name: "مكس صمون", price: "30", description: "مكس بطاطس وفلافل بخبز الصمون" },
      { name: "فاهيتا فراخ", price: "90", description: "فاهيتا فراخ مميزة مع خضار" },
      { name: "كفتة صمون", price: "90", description: "كفتة مشوية على الفحم بخبز الصمون" }
    ]
  }
];

function getMenuSections() {
  const filePath = path.join(__dirname, '..', 'data', 'menu-data.json');
  try {
    if (fs.existsSync(filePath)) {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      if (Array.isArray(data.sections) && data.sections.length > 0) {
        return data.sections;
      }
    }
  } catch (err) {
    console.error('Error loading custom menu-data.json, falling back to defaults:', err);
  }
  return defaultMenuSections;
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
        "description": "منيو سندوتشات ومأكولات مطعم فالح أبو العنبة الرسمي - ألذ سندوتشات ومشويات على أصولها",
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
      <h1 itemprop="name">منيو مطعم فالح أبو العنبة الرسمي</h1>
      <p class="geo-tagline" itemprop="description">ألذ سندوتشات ومشويات ووجبات على أصولها - الأسعار الرسمية المعتمدة</p>
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
  defaultMenuSections,
  getMenuSections,
  generateSchemaGraph,
  renderHtmlMenu,
  renderQuickFacts
};
