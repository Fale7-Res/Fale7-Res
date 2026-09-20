const pagesEl = document.getElementById('pages');
const refreshBtn = document.getElementById('refreshBtn');

async function loadMenu(isManualRefresh = false) {
  if (isManualRefresh || !pagesEl.querySelector('.svg-page')) {
    pagesEl.innerHTML = '<div class="loading-spinner"><div class="spinner" aria-hidden="true"></div><p>جاري تحميل المنيو...</p></div>';
  }
  try {
    const response = await fetch('/api/menu', { cache: 'no-store' });
    const data = await response.json();
    if (!data.pages.length) {
      pagesEl.innerHTML = '<div class="no-menu"><div class="no-menu-icon"><i class="fas fa-clipboard-list" aria-hidden="true"></i></div><h2 class="no-menu-title">المنيو غير متوفر حاليًا</h2><p class="no-menu-text">لم يتم رفع ملف المنيو بعد، يرجى التحقق لاحقًا.</p></div>';
      return;
    }
    pagesEl.innerHTML = data.pages.map((page, index) => {
      const base = `/api/pages/${encodeURIComponent(page.id)}/preview.webp`;
      const version = encodeURIComponent(page.updatedAt || data.updatedAt || '');
      const altText = `منيو ${escapeHtml(page.name)} - قائمة طعام وأسعار مطعم فالح أبو العنبة (منذ 1961)`;
      return `<figure class="svg-page"><img src="${base}?w=1024&v=${version}" srcset="${base}?w=640&v=${version} 640w, ${base}?w=1024&v=${version} 1024w, ${base}?w=1600&v=${version} 1600w, ${base}?w=2400&v=${version} 2400w" sizes="(max-width: 700px) 100vw, min(1100px, 100vw)" width="1054" height="1492" alt="${altText}" loading="${index === 0 ? 'eager' : 'lazy'}" decoding="async" fetchpriority="${index === 0 ? 'high' : 'low'}"></figure>`;
    }).join('');
  } catch {
    if (!pagesEl.querySelector('.svg-page')) {
      pagesEl.innerHTML = '<div class="no-menu"><div class="no-menu-icon"><i class="fas fa-exclamation-triangle" aria-hidden="true"></i></div><h2 class="no-menu-title">تعذر تحميل المنيو</h2><p class="no-menu-text">حاول تحديث الصفحة مرة أخرى.</p></div>';
    }
  }
}

function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#039;', '"':'&quot;' }[char])); }
refreshBtn.addEventListener('click', () => loadMenu(true));

// If not already server-rendered, load dynamically
if (!pagesEl.querySelector('.svg-page')) {
  loadMenu(false);
}
