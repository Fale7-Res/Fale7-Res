const pagesEl = document.getElementById('pages');
const refreshBtn = document.getElementById('refreshBtn');
const downloadBtn = document.getElementById('downloadBtn');

async function loadMenu() {
  pagesEl.innerHTML = '<div class="loading-spinner"><div class="spinner" aria-hidden="true"></div><p>جاري تحميل المنيو...</p></div>';
  downloadBtn.hidden = true;
  try {
    const response = await fetch('/api/menu', { cache: 'no-store' });
    const data = await response.json();
    if (!data.pages.length) {
      pagesEl.innerHTML = '<div class="no-menu"><div class="no-menu-icon"><i class="fas fa-clipboard-list" aria-hidden="true"></i></div><h2 class="no-menu-title">المنيو غير متوفر حاليًا</h2><p class="no-menu-text">لم يتم رفع ملف المنيو بعد، يرجى التحقق لاحقًا.</p></div>';
      return;
    }
    downloadBtn.href = `/api/pages/${encodeURIComponent(data.pages[0].id)}/download`;
    downloadBtn.hidden = false;
    pagesEl.innerHTML = data.pages.map((page, index) => `<figure class="svg-page"><img src="/api/pages/${encodeURIComponent(page.id)}/preview?v=${encodeURIComponent(page.updatedAt || data.updatedAt || '')}" alt="${escapeHtml(page.name)}" loading="${index === 0 ? 'eager' : 'lazy'}" decoding="async" fetchpriority="${index === 0 ? 'high' : 'low'}"></figure>`).join('');
  } catch {
    pagesEl.innerHTML = '<div class="no-menu"><div class="no-menu-icon"><i class="fas fa-exclamation-triangle" aria-hidden="true"></i></div><h2 class="no-menu-title">تعذر تحميل المنيو</h2><p class="no-menu-text">حاول تحديث الصفحة مرة أخرى.</p></div>';
  }
}
function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#039;', '"':'&quot;' }[char])); }
refreshBtn.addEventListener('click', loadMenu);
loadMenu();
