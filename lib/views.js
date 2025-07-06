module.exports = {
  login: (data) => `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>تسجيل الدخول | نظام إدارة المنيو</title>
  <link rel="stylesheet" href="/styles.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</head>
<body>
  <div class="card">
    <div class="card-header">
      <h1 class="card-title">
        <span class="icon">🔐</span>
        تسجيل الدخول
      </h1>
      <p class="card-subtitle">نظام إدارة المنيو</p>
    </div>
    <div class="card-content">
      ${data.error ? `
        <div class="alert alert-error">
          ${data.error}
        </div>
      ` : ''}
      <form method="POST" action="/api/login">
        <div class="form-group">
          <label for="password" class="form-label">كلمة المرور</label>
          <div class="password-container">
            <input 
              type="password" 
              id="password"
              name="password" 
              class="form-input"
              placeholder="أدخل كلمة المرور" 
              required 
              autocomplete="current-password"
            />
            <button type="button" class="toggle-password" id="togglePassword">
              <i class="fas fa-eye"></i>
            </button>
          </div>
        </div>
        <button type="submit" class="btn btn-primary">
          <span class="icon">🚪</span>
          دخول
        </button>
      </form>
    </div>
  </div>
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const togglePassword = document.getElementById('togglePassword');
      const passwordInput = document.getElementById('password');
      togglePassword.addEventListener('click', function() {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.querySelector('i').classList.toggle('fa-eye');
        this.querySelector('i').classList.toggle('fa-eye-slash');
      });
    });
  </script>
</body>
</html>`,

  admin: () => `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>لوحة التحكم | نظام إدارة المنيو</title>
  <link rel="stylesheet" href="/styles.css">
</head>
<body>
  <div id="loadingOverlay">
    <p id="loadingText">جاري المعالجة...</p>
    <div class="progress-container">
      <div id="progressBar"></div>
    </div>
    <p id="progressPercentage">0%</p>
  </div>
  <div class="container">
    <div class="card">
      <div class="card-header">
        <h1 class="card-title">
          <span class="icon">⚙️</span>
          لوحة التحكم
        </h1>
        <p class="card-subtitle">إدارة منيو المطعم</p>
      </div>
      <div class="card-content">
        <form id="uploadForm" method="POST" enctype="multipart/form-data" action="/api/upload">
          <div class="upload-area">
            <div class="upload-icon">📄</div>
            <div class="upload-text" id="uploadText">اسحب وأفلت ملف PDF هنا</div>
            <div class="upload-hint" id="uploadHint">أو انقر للاختيار من جهازك</div>
            <input type="file" id="fileInput" name="menu" accept="application/pdf" required class="file-input" />
          </div>
          <button type="submit" class="btn btn-primary">
            <span class="icon">📤</span>
            رفع المنيو الجديد
          </button>
        </form>
        <div class="actions">
          <a href="/menu" target="_blank" class="btn btn-secondary">
            <span class="icon">📋</span>
            صفحة المستخدم
          </a>
          <a href="/api/delete-menu" id="deleteBtn" class="btn btn-danger">
            <span class="icon">🗑️</span>
            حذف المنيو القديم
          </a>
        </div>
        <a href="/api/logout" class="btn btn-secondary">
          <span class="icon">🚪</span>
          تسجيل الخروج
        </a>
        <div class="debug-info">
          نظام إدارة المنيو - الإصدار 2.0
        </div>
      </div>
    </div>
  </div>
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const uploadForm = document.getElementById('uploadForm');
      const fileInput = document.getElementById('fileInput');
      const deleteBtn = document.getElementById('deleteBtn');
      const loadingOverlay = document.getElementById('loadingOverlay');
      const loadingText = document.getElementById('loadingText');
      const progressBar = document.getElementById('progressBar');
      const progressPercentage = document.getElementById('progressPercentage');
      const uploadText = document.getElementById('uploadText');
      const uploadHint = document.getElementById('uploadHint');

      fileInput.addEventListener('change', () => {
        if (fileInput.files.length > 0) {
          const file = fileInput.files[0];
          uploadText.textContent = file.name;
          const fileSize = file.size > 1024 * 1024 
            ? \`\${(file.size / 1024 / 1024).toFixed(2)} MB\`
            : \`\${(file.size / 1024).toFixed(2)} KB\`;
          uploadHint.textContent = \`حجم الملف: \${fileSize}\`;
        } else {
          uploadText.textContent = 'اسحب وأفلت ملف PDF هنا';
          uploadHint.textContent = 'أو انقر للاختيار من جهازك';
        }
      });

      uploadForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!fileInput.files || fileInput.files.length === 0) {
          alert('الرجاء اختيار ملف أولاً.');
          return;
        }
        const formData = new FormData(uploadForm);
        const xhr = new XMLHttpRequest();
        xhr.upload.addEventListener('progress', (event) => {
          if (event.lengthComputable) {
            const percentComplete = Math.round((event.loaded / event.total) * 100);
            progressBar.style.width = percentComplete + '%';
            progressPercentage.innerText = percentComplete + '%';
          }
        });
        xhr.addEventListener('load', () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            loadingText.innerText = 'اكتمل بنجاح!';
            progressBar.style.width = '100%';
            progressPercentage.innerText = '100%';
            setTimeout(() => window.location.reload(), 1000);
          } else {
            alert('حدث خطأ أثناء الرفع: ' + xhr.responseText);
            loadingOverlay.style.display = 'none';
          }
        });
        xhr.addEventListener('error', () => {
          alert('فشل الرفع. الرجاء التحقق من اتصالك بالشبكة.');
          loadingOverlay.style.display = 'none';
        });
        loadingText.innerText = 'جاري رفع المنيو...';
        progressBar.style.width = '0%';
        progressPercentage.innerText = '0%';
        loadingOverlay.style.display = 'flex';
        xhr.open('POST', '/api/upload');
        xhr.send(formData);
      });

      deleteBtn.addEventListener('click', (e) => {
        e.preventDefault();
        if (!confirm('هل أنت متأكد أنك تريد حذف المنيو؟ لا يمكن التراجع عن هذا الإجراء.')) {
          return;
        }
        loadingText.innerText = 'جاري حذف المنيو...';
        progressBar.style.width = '0%';
        progressPercentage.innerText = '0%';
        loadingOverlay.style.display = 'flex';
        let progress = 0;
        const interval = setInterval(() => {
          progress += 10;
          progressBar.style.width = progress + '%';
          progressPercentage.innerText = progress + '%';
          if (progress >= 100) {
            clearInterval(interval);
            fetch('/api/delete-menu')
              .then(response => response.json())
              .then(data => {
                if (data.success) {
                  loadingText.innerText = 'اكتمل الحذف!';
                  setTimeout(() => window.location.reload(), 1000);
                } else {
                  throw new Error(data.message || 'فشل الحذف');
                }
              })
              .catch(error => {
                alert('حدث خطأ: ' + error.message);
                loadingOverlay.style.display = 'none';
              });
          }
        }, 50);
      });
    });
  </script>
</body>
</html>`,

  menu: (data) => {
    const menuUrl = data.menuExists ? data.menuUrl : '';
    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content "width=device-width, initial-scale=1.0, maximum-scale=5, user-scalable=yes">
  <title>منيو المطعم | نظام إدارة المنيو</title>
  <link rel="stylesheet" href="/styles.css">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
</head>
<body>
  ${data.menuExists ? `
    <div class="top-bar">
      <div class="action-buttons">
        <a href="${menuUrl}" class="btn btn-primary" download>
          <span class="icon">📥</span>
          تحميل
        </a>
        <a href="javascript:location.reload(true)" class="btn btn-secondary">
          <span class="icon">🔄</span>
          تحديث
        </a>
      </div>
      <div class="social-icons">
        <div class="social-icon tiktok">
          <a href="https://www.tiktok.com/@fale7_1961?_Sos-8x1AmLeHCEc&_r=1" target="_blank">
            <span><i class="fab fa-tiktok"></i></span>
          </a>
        </div>
        <div class="social派生出來的字詞
          <a href="https://www.facebook.com/share/1FTjzqpHv8/" target="_blank">
            <span><i class="fab fa-facebook-f"></i></span>
          </a>
        </div>
        <div class="social-icon location">
          <a href="https://maps.app.goo.gl/DqNEo521pyEbMpD49" target="_blank">
            <span><i class="fas fa-map-marker-alt"></i></span>
          </a>
        </div>
      </div>
    </div>
    <div class="pdf-viewer-container">
      <div class="pdf-canvas-container" id="pdfContainer">
        <div class="loading-spinner">
          <div class="spinner"></div>
          <p>جاري تحميل المنيو...</p>
        </div>
      </div>
    </div>
    <div class="mobile-hint">
      استخدم إصبعين للتكبير والتصغير
    </div>
    <script>
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      async function loadPDF() {
        try {
          const container = document.getElementById('pdfContainer');
          const pdf = await pdfjsLib.getDocument('${menuUrl}').promise;
          container.innerHTML = '';
          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            const viewport = page.getViewport({ scale: 1.5 });
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            canvas.className = 'pdf-page';
            await page.render({ canvasContext: context, viewport: viewport }).promise;
            container.appendChild(canvas);
          }
        } catch (error) {
          console.error('خطأ في تحميل PDF:', error);
          document.getElementById('pdfContainer').innerHTML = 
            '<div style="text-align: center; padding: 2rem;"><p>حدث خطأ في تحميل المنيو. يرجى المحاولة مرة أخرى.</p></div>';
        }
      }
      document.addEventListener('DOMContentLoaded', loadPDF);
    </script>
  ` : `
    <div class="no-menu">
      <div class="no-menu-icon">📋</div>
      <h2 class="no-menu-title">المنيو غير متوفر حالياً</h2>
      <p class="no-menu-text">لم يتم رفع ملف المنيو بعد، يرجى التحقق لاحقاً.</p>
    </div>
  `}
</body>
</html>`;
  }
};
