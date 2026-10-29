const pagesEl = document.getElementById('pages');
const refreshBtn = document.getElementById('refreshBtn');
let loadedMenuSignature = null;

async function loadMenu(isManualRefresh = false) {
  if (!pagesEl.querySelector('.svg-page')) {
    pagesEl.innerHTML = '<div class="loading-spinner"><div class="spinner" aria-hidden="true"></div><p>جاري تحميل المنيو...</p></div>';
  }
  try {
    const response = await fetch(isManualRefresh ? '/api/menu?fresh=1' : '/api/menu', { cache: 'no-store' });
    if (!response.ok) throw new Error(`Menu request failed (${response.status})`);
    const data = await response.json();
    const signature = JSON.stringify([data.updatedAt, (data.pages || []).map((page) => [page.id, page.updatedAt || null])]);
    if (!isManualRefresh && signature === loadedMenuSignature) return;
    loadedMenuSignature = signature;
    if (!data.pages.length) {
      pagesEl.innerHTML = '<div class="no-menu"><div class="no-menu-icon"><i class="fas fa-clipboard-list" aria-hidden="true"></i></div><h2 class="no-menu-title">المنيو غير متوفر حاليًا</h2><p class="no-menu-text">لم يتم رفع ملف المنيو بعد، يرجى التحقق لاحقًا.</p></div>';
      return;
    }
    const existing = [...pagesEl.querySelectorAll('.svg-page img')];
    if (existing.length === data.pages.length && existing.every((img, i) => img.getAttribute('src') === menuImageUrl(data.pages[i], 1024, data.updatedAt))) return;
    pagesEl.innerHTML = data.pages.map((page, index) => {
      const src = menuImageUrl(page, 1024, data.updatedAt);
      const srcset = [640, 1024, 1600, 2400].map(w => `${menuImageUrl(page, w, data.updatedAt)} ${w}w`).join(', ');
      const fallback = `/api/pages/${encodeURIComponent(page.id)}/preview.webp?w=1600&v=${encodeURIComponent(page.updatedAt || data.updatedAt || '')}`;
      const altText = `منيو ${escapeHtml(page.name)} - قائمة طعام وأسعار مطعم فالح أبو العنبة (منذ 1961)`;
      return `<figure class="svg-page"><img src="${src}" srcset="${srcset}" sizes="(max-width: 700px) 100vw, min(1100px, 100vw)" width="1054" height="1492" alt="${altText}" data-preview-fallback="${fallback}" loading="${index === 0 ? 'eager' : 'lazy'}" decoding="async" fetchpriority="${index === 0 ? 'high' : 'low'}"></figure>`;
    }).join('');
  } catch {
    if (!pagesEl.querySelector('.svg-page')) {
      pagesEl.innerHTML = '<div class="no-menu"><div class="no-menu-icon"><i class="fas fa-exclamation-triangle" aria-hidden="true"></i></div><h2 class="no-menu-title">تعذر تحميل المنيو</h2><p class="no-menu-text">حاول تحديث الصفحة مرة أخرى.</p></div>';
    }
  }
}

function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#039;', '"':'&quot;' }[char])); }
pagesEl.addEventListener('error', event => {
  const image = event.target;
  if (!image.dataset?.previewFallback) return;
  const fallback = image.dataset.previewFallback;
  delete image.dataset.previewFallback;
  image.removeAttribute('srcset');
  image.src = fallback;
}, true);
refreshBtn.addEventListener('click', () => loadMenu(true));

// Replace pre-rendered pages with the current menu state from GitHub.
loadMenu(false);

// Keep already-open customer pages in sync with admin changes.
window.setInterval(() => {
  if (!document.hidden) loadMenu(false);
}, 30000);
document.addEventListener('visibilitychange', () => {
  if (!document.hidden) loadMenu(false);
});
