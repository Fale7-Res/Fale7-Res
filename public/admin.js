const loginPanel = document.getElementById('loginPanel');
const dashboard = document.getElementById('dashboard');
const loginForm = document.getElementById('loginForm');
const loginError = document.getElementById('loginError');
const logoutBtn = document.getElementById('logoutBtn');
const pageGrid = document.getElementById('pageGrid');
const editor = document.getElementById('editor');
const editorPreview = document.getElementById('editorPreview');
const textList = document.getElementById('textList');
const editorTitle = document.getElementById('editorTitle');
const editorStatus = document.getElementById('editorStatus');
let currentPage = null;
let currentSvg = '';
let editorSvg = null;
let priceNodes = [];
let textNodes = [];
let fixedNumberNodes = [];
let activePriceInput = null;
let selectedPrices = new Set();
let selectedProducts = new Set();
let selectedNumbers = new Set();
let selectionMode = 'none';
const priceCenters = new WeakMap();
const productRights = new WeakMap();

async function request(url, options = {}) {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.message || 'حدث خطأ غير متوقع');
  return data;
}

async function checkSession() {
  const data = await request('/api/session');
  setAuthenticated(data.isAdmin);
  if (data.isAdmin) loadPages();
}

function setAuthenticated(isAdmin) {
  loginPanel.hidden = isAdmin;
  dashboard.hidden = !isAdmin;
  logoutBtn.hidden = !isAdmin;
}

loginForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  loginError.textContent = '';
  try {
    await request('/api/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: document.getElementById('password').value }) });
    setAuthenticated(true);
    loadPages();
  } catch (error) { loginError.textContent = error.message; }
});

logoutBtn.addEventListener('click', async () => { await request('/api/logout', { method: 'POST' }); setAuthenticated(false); });
async function loadPages() {
  const data = await request('/api/menu');
  pageGrid.innerHTML = data.pages.length ? data.pages.map((page) => `<article class="page-card"><div class="page-thumb page-thumb-light" aria-hidden="true"><span>SVG</span></div><div class="page-info"><h3 title="${escapeHtml(page.name)}">${escapeHtml(page.name)}</h3><div class="page-actions"><button class="btn btn-primary" data-edit="${page.id}">تحرير الأسعار</button><a class="btn" href="/api/pages/${page.id}/download" download>تنزيل</a><button class="btn" data-delete="${page.id}" aria-label="حذف">×</button></div></div></article>`).join('') : '<div class="empty"><div><strong>لا توجد صفحات بعد</strong><span>أضف أول ملف SVG من الأعلى.</span></div></div>';
  pageGrid.querySelectorAll('[data-edit]').forEach((button) => button.addEventListener('click', () => openEditor(data.pages.find((page) => page.id === button.dataset.edit))));
  pageGrid.querySelectorAll('[data-delete]').forEach((button) => button.addEventListener('click', () => deletePage(button.dataset.delete)));
}

async function deletePage(id) {
  if (!confirm('حذف هذه الصفحة؟')) return;
  await request(`/api/pages/${id}`, { method: 'DELETE' });
  loadPages();
}

async function openEditor(page) {
  currentPage = page;
  editorTitle.textContent = page.name;
  editorStatus.textContent = 'جاري فتح الصفحة...';
  editor.classList.add('open'); editor.setAttribute('aria-hidden', 'false');
  currentSvg = await fetch(`/api/pages/${page.id}/file?v=${Date.now()}`).then((response) => response.text());
  renderEditor();
  editorStatus.textContent = '';
  document.getElementById('downloadEditor').href = `/api/pages/${page.id}/download?v=${Date.now()}`;
}

function renderEditor() {
  const parsed = new DOMParser().parseFromString(currentSvg, 'image/svg+xml');
  editorSvg = document.importNode(parsed.documentElement, true);
  editorPreview.replaceChildren(editorSvg);
  selectedPrices.clear();
  selectedProducts.clear();
  selectedNumbers.clear();
  selectionMode = 'none';
  updateSelectionModeButtons();
  textList.innerHTML = '<p class="notice">اضغط على رقم السعر داخل الصفحة لبدء التعديل.</p>';
  const restored = restoreLegacyNonPriceNodes();
  priceNodes = [...editorSvg.querySelectorAll('text')].filter((node) => isPriceText(node.textContent));
  textNodes = [...editorSvg.querySelectorAll('text')].filter((node) => !isPriceText(node.textContent) && !isPhoneText(node.textContent) && !node.hasAttribute('data-fixed-phone') && node.textContent.trim());
  restoreFixedTextNodes();
  fixedNumberNodes = [...editorSvg.querySelectorAll('text')].filter((node) => isPhoneText(node.textContent) || node.hasAttribute('data-fixed-phone'));
  const columnCenters = getColumnCenters(priceNodes);
  priceNodes.forEach((node, index) => {
    const width = getTextWidth(node);
    const x = Number.parseFloat(node.getAttribute('x')) || 0;
    const savedCenter = Number.parseFloat(node.getAttribute('data-price-center'));
    const anchor = node.getAttribute('text-anchor') || 'start';
    const measuredCenter = anchor === 'middle' ? x : anchor === 'end' ? x - width / 2 : x + width / 2;
    const center = Number.isFinite(savedCenter) ? savedCenter : columnCenters.get(getColumnKey(node)) ?? measuredCenter;
    priceCenters.set(node, center);
    node.classList.add('price-target');
    node.setAttribute('tabindex', '0');
    node.dataset.priceIndex = index;
    node.addEventListener('click', (event) => {
      event.stopPropagation();
      if (selectionMode === 'prices') {
        if (selectedPrices.has(node)) selectedPrices.delete(node); else selectedPrices.add(node);
        updatePriceSelection();
        return;
      }
      if (selectionMode === 'numbers') {
        if (selectedNumbers.has(node)) selectedNumbers.delete(node); else selectedNumbers.add(node);
        updateTextSelection();
        return;
      }
      if (selectionMode === 'products') return;
      selectedPrices.clear(); selectedPrices.add(node); updatePriceSelection();
      openPriceInput(node);
    });
    node.addEventListener('keydown', (event) => {
      if (event.key !== 'Enter' && event.key !== ' ') return;
      event.preventDefault();
      if (selectionMode === 'prices') {
        if (selectedPrices.has(node)) selectedPrices.delete(node); else selectedPrices.add(node);
        updatePriceSelection();
      } else if (selectionMode === 'numbers') {
        if (selectedNumbers.has(node)) selectedNumbers.delete(node); else selectedNumbers.add(node);
        updateTextSelection();
      } else if (selectionMode === 'products') {
        return;
      } else {
        openPriceInput(node);
      }
    });
  });
  textNodes.forEach((node, index) => {
    productRights.set(node, getProductRightAnchor(node));
    node.classList.add('product-target');
    node.setAttribute('tabindex', '0');
    node.dataset.productIndex = index;
    node.addEventListener('click', (event) => {
      event.stopPropagation();
      if (selectionMode !== 'products') return;
      if (selectedProducts.has(node)) selectedProducts.delete(node); else selectedProducts.add(node);
      updateTextSelection();
    });
    node.addEventListener('keydown', (event) => {
      if (selectionMode !== 'products' || (event.key !== 'Enter' && event.key !== ' ')) return;
      event.preventDefault();
      if (selectedProducts.has(node)) selectedProducts.delete(node); else selectedProducts.add(node);
      updateTextSelection();
    });
  });
  fixedNumberNodes.forEach((node) => {
    node.classList.add('number-target');
    node.setAttribute('tabindex', '0');
    node.addEventListener('click', (event) => {
      event.stopPropagation();
      if (selectionMode !== 'numbers') return;
      if (selectedNumbers.has(node)) selectedNumbers.delete(node); else selectedNumbers.add(node);
      updateTextSelection();
    });
    node.addEventListener('keydown', (event) => {
      if (selectionMode !== 'numbers' || (event.key !== 'Enter' && event.key !== ' ')) return;
      event.preventDefault();
      if (selectedNumbers.has(node)) selectedNumbers.delete(node); else selectedNumbers.add(node);
      updateTextSelection();
    });
  });
  const productRepaired = normalizeProductPositions(textNodes);
  if (priceNodes.length) normalizePricePositions();
  if (!priceNodes.length) textList.innerHTML = '<p class="notice">لم يتم العثور على أسعار رقمية داخل هذا الملف.</p>';
  return restored || productRepaired;
}

function isPriceText(value) {
  const text = String(value || '').trim();
  return /^\s*[0-9٠-٩]+(?:\s*[.,،]\s*[0-9٠-٩]+)?\s*$/.test(text) && text.length <= 24;
}

function isPhoneText(value) {
  const digits = String(value || '').replace(/[^0-9٠-٩]/g, '');
  return digits.length >= 8 && digits.length <= 24 && /[0-9٠-٩][\s-]*[0-9٠-٩]/.test(String(value || ''));
}

function restoreFixedTextNodes() {
  editorSvg.querySelectorAll('text').forEach((node) => {
    if (!isPhoneText(node.textContent) && !node.hasAttribute('data-fixed-phone')) return;
    node.classList.remove('product-target', 'product-selected', 'price-target', 'price-selected', 'number-selected');
    node.removeAttribute('tabindex');
    node.removeAttribute('data-product-index');
    node.removeAttribute('data-product-right');
  });
}

function restoreLegacyNonPriceNodes() {
  let restored = false;
  editorSvg.querySelectorAll('text[data-price-center]').forEach((node) => {
    if (isPriceText(node.textContent)) return;
    const center = Number.parseFloat(node.getAttribute('data-price-center'));
    if (!Number.isFinite(center)) return;
    node.setAttribute('text-anchor', 'start');
    node.setAttribute('x', String(center - getTextWidth(node) / 2));
    node.removeAttribute('data-price-center');
    node.classList.remove('price-target');
    node.removeAttribute('tabindex');
    restored = true;
  });
  return restored;
}

function openPriceInput(node) {
  closePriceInput();
  const input = document.createElement('input');
  input.className = 'price-input'; input.value = node.textContent.trim(); input.setAttribute('aria-label', 'تعديل السعر');
  editorPreview.append(input); activePriceInput = input;
  const previewRect = editorPreview.getBoundingClientRect();
  const nodeRect = node.getBoundingClientRect();
  input.style.left = `${nodeRect.left - previewRect.left + editorPreview.scrollLeft}px`;
  input.style.top = `${nodeRect.top - previewRect.top + editorPreview.scrollTop}px`;
  input.focus(); input.select();
  const commit = () => {
    if (!activePriceInput) return;
    node.textContent = input.value.trim() || node.textContent;
    normalizePricePositions();
    currentSvg = new XMLSerializer().serializeToString(editorSvg);
    closePriceInput();
  };
  input.addEventListener('blur', commit, { once: true });
  input.addEventListener('keydown', (event) => { if (event.key === 'Enter') { event.preventDefault(); input.blur(); } if (event.key === 'Escape') { activePriceInput = null; input.remove(); } });
}

function closePriceInput() {
  if (activePriceInput) { activePriceInput.remove(); activePriceInput = null; }
}

function updatePriceSelection() {
  priceNodes.forEach((node) => node.classList.toggle('price-selected', selectedPrices.has(node)));
  const selected = [...selectedPrices];
  if (selectionMode !== 'prices') {
    textList.innerHTML = '<p class="notice">اضغط على السعر لتعديله، أو فعّل تحديد أسعار لاختيار عدة أرقام.</p>';
    return;
  }
  if (!selected.length) {
    textList.innerHTML = '<p class="notice">وضع التحديد فعال. اضغط على الأسعار التي تريد تغييرها.</p>';
    return;
  }
  textList.innerHTML = `<div class="bulk-editor"><strong>تم تحديد ${selected.length} أسعار</strong><label for="bulkPrice">السعر الجديد</label><div class="bulk-editor-row"><input id="bulkPrice" inputmode="numeric" placeholder="اكتب السعر"><button id="applyBulkPrice" class="btn btn-primary">تحويلهم للسعر ده</button></div></div>`;
  const input = document.getElementById('bulkPrice');
  document.getElementById('applyBulkPrice').addEventListener('click', () => applyBulkPrice(input.value));
  input.addEventListener('keydown', (event) => { if (event.key === 'Enter') applyBulkPrice(input.value); });
}

function updateSelectionModeButtons() {
  const modes = [
    ['toggleProductSelection', 'products', 'تحديد أصناف', 'إنهاء تحديد الأصناف'],
    ['togglePriceSelection', 'prices', 'تحديد أسعار', 'إنهاء تحديد الأسعار'],
    ['toggleNumberSelection', 'numbers', 'تحديد أرقام مستقلة', 'إنهاء تحديد الأرقام']
  ];
  modes.forEach(([id, mode, idleLabel, activeLabel]) => {
    const button = document.getElementById(id);
    if (!button) return;
    button.textContent = selectionMode === mode ? activeLabel : idleLabel;
    button.classList.toggle('selection-mode-active', selectionMode === mode);
  });
  priceNodes.forEach((node) => node.classList.toggle('price-selected', selectedPrices.has(node)));
  textNodes.forEach((node) => {
    node.classList.toggle('product-selected', selectedProducts.has(node));
    node.classList.toggle('number-selected', selectedNumbers.has(node));
  });
  fixedNumberNodes.forEach((node) => node.classList.toggle('number-selected', selectedNumbers.has(node)));
}

function updateTextSelection() {
  updateSelectionModeButtons();
  const selected = selectionMode === 'products' ? [...selectedProducts] : [...selectedNumbers];
  if (!selected.length) {
    textList.innerHTML = `<p class="notice">وضع التحديد فعال. اضغط على ${selectionMode === 'products' ? 'أسماء الأصناف' : 'الأرقام المستقلة'}.</p>`;
    return;
  }
  const label = selectionMode === 'products' ? 'اسم الصنف الجديد' : 'الرقم الجديد';
  const button = selectionMode === 'products' ? 'تحويلهم للاسم ده' : 'تحويلهم للرقم ده';
  textList.innerHTML = `<div class="bulk-editor"><strong>تم تحديد ${selected.length} عناصر</strong><label for="bulkText">${label}</label><div class="bulk-editor-row"><input id="bulkText" placeholder="اكتب القيمة"><button id="applyBulkText" class="btn btn-primary">${button}</button></div></div>`;
  const input = document.getElementById('bulkText');
  document.getElementById('applyBulkText').addEventListener('click', () => applyBulkText(input.value));
  input.addEventListener('keydown', (event) => { if (event.key === 'Enter') applyBulkText(input.value); });
}

function applyBulkText(value) {
  const nextValue = String(value || '').trim();
  if (!nextValue) return;
  const selected = selectionMode === 'products' ? selectedProducts : selectedNumbers;
  selected.forEach((node) => { node.textContent = nextValue; });
  if (selectionMode === 'products') normalizeProductPositions();
  currentSvg = new XMLSerializer().serializeToString(editorSvg);
  updateTextSelection();
}

function normalizeProductPositions(nodes = [...selectedProducts]) {
  nodes.forEach((node) => {
    const right = productRights.get(node);
    if (!Number.isFinite(right)) return;
    node.setAttribute('text-anchor', 'start');
    node.setAttribute('direction', 'rtl');
    node.setAttribute('x', String(right));
    node.setAttribute('data-product-right', String(right));
  });
  return nodes.length > 0;
}

function getLocalRightEdge(node) {
  const box = node.getBBox();
  return box.x + box.width;
}

function getProductRightAnchor(node) {
  const x = Number.parseFloat(node.getAttribute('x'));
  if (Number.isFinite(x)) return x;
  return getLocalRightEdge(node);
}

function applyBulkPrice(value) {
  const nextValue = String(value || '').trim();
  if (!/^\d+$/.test(nextValue) && !/^[٠-٩]+$/.test(nextValue)) return;
  selectedPrices.forEach((node) => { node.textContent = nextValue; });
  normalizePricePositions();
  currentSvg = new XMLSerializer().serializeToString(editorSvg);
  updatePriceSelection();
}

function getTextWidth(node) {
  return node.getComputedTextLength ? node.getComputedTextLength() : node.getBBox().width;
}

function getColumnKey(node) {
  const group = node.closest('g[transform]');
  const match = group?.getAttribute('transform')?.match(/translate\(\s*([-+\d.]+)/);
  return match ? Math.round(Number(match[1])) : `node-${node.id}`;
}

function getColumnCenters(nodes) {
  const groups = new Map();
  nodes.forEach((node) => {
    const key = getColumnKey(node);
    const width = getTextWidth(node);
    const x = Number.parseFloat(node.getAttribute('x')) || 0;
    const anchor = node.getAttribute('text-anchor') || 'start';
    const center = anchor === 'middle' ? x : anchor === 'end' ? x - width / 2 : x + width / 2;
    const digits = String(node.textContent).replace(/[^0-9٠-٩]/g, '').length;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push({ center, digits });
  });
  return new Map([...groups].map(([key, values]) => {
    const stable = values.filter((item) => item.digits <= 2);
    const source = stable.length ? stable : values;
    source.sort((left, right) => left.center - right.center);
    return [key, source[Math.floor(source.length / 2)].center];
  }));
}

function normalizePricePositions() {
  priceNodes.forEach((node) => {
    const center = priceCenters.get(node);
    node.setAttribute('text-anchor', 'middle');
    node.setAttribute('x', String(center));
    node.setAttribute('data-price-center', String(center));
  });
}

document.getElementById('saveEditor').addEventListener('click', async () => {
  closePriceInput();
  const changes = [
    ...priceNodes.map((node) => ({ type: 'price', index: node.dataset.priceIndex, value: node.textContent.trim() })),
    ...textNodes.map((node) => ({ type: 'product', index: node.dataset.productIndex, value: node.textContent.trim() }))
  ];
  editorStatus.textContent = 'جاري الحفظ...';
  try {
    await request(`/api/pages/${currentPage.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ changes }) });
    editorStatus.textContent = 'تم حفظ التعديلات.';
    document.getElementById('downloadEditor').href = `/api/pages/${currentPage.id}/download?v=${Date.now()}`;
    loadPages();
  } catch (error) { editorStatus.textContent = error.message; }
});

document.getElementById('closeEditor').addEventListener('click', () => {
  if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  editor.classList.remove('open');
  editor.setAttribute('aria-hidden', 'true');
});
document.getElementById('togglePriceSelection').addEventListener('click', () => {
  closePriceInput();
  selectionMode = selectionMode === 'prices' ? 'none' : 'prices';
  selectedPrices.clear(); selectedProducts.clear(); selectedNumbers.clear();
  updateSelectionModeButtons(); updatePriceSelection();
});
document.getElementById('toggleProductSelection').addEventListener('click', () => {
  closePriceInput();
  selectionMode = selectionMode === 'products' ? 'none' : 'products';
  selectedPrices.clear(); selectedProducts.clear(); selectedNumbers.clear();
  updateSelectionModeButtons(); updateTextSelection();
});
document.getElementById('toggleNumberSelection').addEventListener('click', () => {
  closePriceInput();
  selectionMode = selectionMode === 'numbers' ? 'none' : 'numbers';
  selectedPrices.clear(); selectedProducts.clear(); selectedNumbers.clear();
  updateSelectionModeButtons(); updateTextSelection();
});
function escapeHtml(value) { return String(value).replace(/[&<>'"]/g, (char) => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":'&#039;', '"':'&quot;' }[char])); }
checkSession().catch(() => setAuthenticated(false));
