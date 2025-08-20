module.exports = {
  // قالب تسجيل الدخول
  login: (data) => {
    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>تسجيل الدخول | نظام إدارة المنيو</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <style>
    :root {
      --background: 0 0% 100%;
      --foreground: 0 0% 3.9%;
      --card: 0 0% 100%;
      --card-foreground: 0 0% 3.9%;
      --primary: 0 0% 9%;
      --primary-foreground: 0 0% 98%;
      --secondary: 0 0% 96.1%;
      --secondary-foreground: 0 0% 9%;
      --muted: 0 0% 96.1%;
      --muted-foreground: 0 0% 45.1%;
      --accent: 0 0% 96.1%;
      --accent-foreground: 0 0% 9%;
      --destructive: 0 84.2% 60.2%;
      --destructive-foreground: 0 0% 98%;
      --border: 0 0% 89.8%;
      --input: 0 0% 89.8%;
      --ring: 0 0% 3.9%;
      --radius: 0.5rem;
    }
    
    * {
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', Arial, Helvetica, sans-serif;
      background: linear-gradient(135deg, hsl(210 40% 98%) 0%, hsl(210 40% 95%) 100%);
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
      margin: 0;
      padding: 1rem;
      color: hsl(var(--foreground));
    }
    
    .card {
      background: hsl(var(--card));
      border: 1px solid hsl(var(--border));
      border-radius: var(--radius);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      width: 100%;
      max-width: 400px;
      overflow: hidden;
    }
    
    .card-header {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      padding: 2rem;
      text-align: center;
    }
    
    .card-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    
    .card-subtitle {
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.875rem;
      margin: 0;
    }
    
    .card-content {
      padding: 2rem;
    }
    
    .form-group {
      margin-bottom: 1.5rem;
    }
    
    .form-label {
      display: block;
      font-size: 0.875rem;
      font-weight: 500;
      color: hsl(var(--foreground));
      margin-bottom: 0.5rem;
      text-align: right;
    }
    
    .password-container {
      position: relative;
    }
    
    .form-input {
      width: 100%;
      padding: 0.75rem;
      border: 1px solid hsl(var(--border));
      border-radius: calc(var(--radius) - 2px);
      font-size: 1rem;
      background: hsl(var(--background));
      color: hsl(var(--foreground));
      transition: border-color 0.2s, box-shadow 0.2s;
    }
    
    .form-input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }
    
    .toggle-password {
      position: absolute;
      left: 10px;
      top: 50%;
      transform: translateY(-50%);
      background: none;
      border: none;
      color: #64748b;
      cursor: pointer;
      font-size: 1rem;
      padding: 0.25rem;
      transition: color 0.2s;
    }
    
    .toggle-password:hover {
      color: #3b82f6;
    }
    
    .btn {
      width: 100%;
      padding: 0.75rem 1rem;
      border: none;
      border-radius: calc(var(--radius) - 2px);
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    
    .btn-primary {
      background: #3b82f6;
      color: white;
    }
    
    .btn-primary:hover {
      background: #2563eb;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }
    
    .btn-primary:active {
      transform: translateY(0);
    }
    
    .alert {
      padding: 0.75rem 1rem;
      border-radius: calc(var(--radius) - 2px);
      margin-bottom: 1rem;
      font-size: 0.875rem;
      text-align: center;
    }
    
    .alert-error {
      background: hsl(var(--destructive) / 0.1);
      color: hsl(var(--destructive));
      border: 1px solid hsl(var(--destructive) / 0.2);
    }
    
    .icon {
      width: 1.25rem;
      height: 1.25rem;
      display: inline-block;
    }
    
    @media (max-width: 480px) {
      body {
        padding: 0.5rem;
      }
      
      .card-header {
        padding: 1.5rem;
      }
      
      .card-content {
        padding: 1.5rem;
      }
      
      .card-title {
        font-size: 1.25rem;
      }
    }
  </style>
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
      
      <form method="POST">
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
        // تبديل نوع حقل كلمة المرور
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // تبديل الأيقونة
        this.querySelector('i').classList.toggle('fa-eye');
        this.querySelector('i').classList.toggle('fa-eye-slash');
      });
    });
  </script>
</body>
</html>`;
  },

  // قالب لوحة الإدارة
  admin: () => {
    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>لوحة التحكم | نظام إدارة المنيو</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --background: 0 0% 100%;
      --foreground: 0 0% 3.9%;
      --card: 0 0% 100%;
      --card-foreground: 0 0% 3.9%;
      --primary: 0 0% 9%;
      --primary-foreground: 0 0% 98%;
      --secondary: 0 0% 96.1%;
      --secondary-foreground: 0 0% 9%;
      --muted: 0 0% 96.1%;
      --muted-foreground: 0 0% 45.1%;
      --accent: 0 0% 96.1%;
      --accent-foreground: 0 0% 9%;
      --destructive: 0 84.2% 60.2%;
      --destructive-foreground: 0 0% 98%;
      --border: 0 0% 89.8%;
      --input: 0 0% 89.8%;
      --ring: 0 0% 3.9%;
      --radius: 0.5rem;
    }
    
    * {
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', Arial, Helvetica, sans-serif;
      background: linear-gradient(135deg, hsl(210 40% 98%) 0%, hsl(210 40% 95%) 100%);
      min-height: 100vh;
      margin: 0;
      padding: 1rem;
      color: hsl(var(--foreground));
    }
    
    .container {
      max-width: 600px;
      margin: 2rem auto;
    }
    
    .card {
      background: hsl(var(--card));
      border: 1px solid hsl(var(--border));
      border-radius: var(--radius);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      overflow: hidden;
    }
    
    .card-header {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      padding: 1.5rem;
      text-align: center;
    }
    
    .card-title {
      font-size: 1.5rem;
      font-weight: 700;
      margin: 0 0 0.5rem 0;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    
    .card-subtitle {
      color: rgba(255, 255, 255, 0.8);
      font-size: 0.875rem;
      margin: 0;
    }
    
    .card-content {
      padding: 1.5rem;
    }
    
    .upload-area {
      border: 2px dashed #cbd5e1;
      border-radius: var(--radius);
      padding: 2rem 1rem;
      text-align: center;
      margin-bottom: 1.5rem;
      transition: all 0.2s;
      cursor: pointer;
      position: relative;
    }
    
    .upload-area:hover {
      border-color: #3b82f6;
      background-color: rgba(59, 130, 246, 0.05);
    }
    
    .upload-icon {
      font-size: 2rem;
      color: #64748b;
      margin-bottom: 0.5rem;
    }
    
    .upload-text {
      color: #64748b;
      margin-bottom: 0.5rem;
      font-weight: 500;
      word-break: break-all;
    }
    
    .upload-hint {
      font-size: 0.875rem;
      color: #94a3b8;
    }
    
    .file-input {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0;
      cursor: pointer;
    }
    
    .btn {
      display: block;
      width: 100%;
      padding: 0.75rem 1rem;
      border: none;
      border-radius: calc(var(--radius) - 2px);
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      text-align: center;
      text-decoration: none;
      margin-bottom: 1rem;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    
    .btn-primary {
      background: #3b82f6;
      color: white;
    }
    
    .btn-primary:hover {
      background: #2563eb;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }
    
    .btn-primary:active {
      transform: translateY(0);
    }
    
    .btn-secondary {
      background: white;
      color: #3b82f6;
      border: 1px solid #3b82f6;
    }
    
    .btn-secondary:hover {
      background: rgba(59, 130, 246, 0.05);
      transform: translateY(-1px);
    }
    
    .icon {
      display: inline-block;
    }
    
    .actions {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1rem;
      margin-top: 1.5rem;
    }
    
    .debug-info {
      text-align: center;
      font-size: 0.75rem;
      color: #94a3b8;
      margin-top: 1.5rem;
    }

    #loadingOverlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.75);
        display: none;
        justify-content: center;
        align-items: center;
        z-index: 1000;
        flex-direction: column;
        color: white;
        text-align: center;
        backdrop-filter: blur(5px);
    }

    #loadingText {
        font-size: 1.25rem;
        font-weight: 500;
        margin-bottom: 1rem;
    }

    .progress-container {
        width: 80%;
        max-width: 400px;
        background-color: #4b5563;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid #6b7280;
    }

    #progressBar {
        width: 0%;
        height: 20px;
        background-color: #3b82f6;
        border-radius: 8px 0 0 8px;
        transition: width 0.2s ease-out;
    }

    #progressPercentage {
        font-size: 1rem;
        margin-top: 0.75rem;
        font-weight: 500;
    }
    
    @media (max-width: 640px) {
      .container {
        margin: 1rem auto;
      }
      
      .card-header {
        padding: 1.25rem;
      }
      
      .card-content {
        padding: 1.25rem;
      }
      
      .upload-area {
        padding: 1.5rem 1rem;
      }
    }
  </style>
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
        <form id="uploadForm" method="POST" enctype="multipart/form-data">
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
        </div>
        
        <a href="/logout" class="btn btn-secondary">
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
        const loadingOverlay = document.getElementById('loadingOverlay');
        const loadingText = document.getElementById('loadingText');
        const progressBar = document.getElementById('progressBar');
        const progressPercentage = document.getElementById('progressPercentage');
        const uploadText = document.getElementById('uploadText');
        const uploadHint = document.getElementById('uploadHint');

        // Display selected file name
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length > 0) {
                const file = fileInput.files[0];
                uploadText.textContent = file.name;
                // Convert bytes to a more readable format (KB or MB)
                const fileSize = file.size > 1024 * 1024 
                    ? \`\${(file.size / 1024 / 1024).toFixed(2)} MB\`
                    : \`\${(file.size / 1024).toFixed(2)} KB\`;
                uploadHint.textContent = \`حجم الملف: \${fileSize}\`;
            } else {
                uploadText.textContent = 'اسحب وأفلت ملف PDF هنا';
                uploadHint.textContent = 'أو انقر للاختيار من جهازك';
            }
        });

        // Handle Upload
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
            
            xhr.open('POST', '/upload');
            xhr.send(formData);
        });
    });
  </script>
</body>
</html>`;
  },

  // قالب صفحة المنيو
  menu: (data) => {
    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5, user-scalable=yes">
  <title>منيو المطعم | نظام إدارة المنيو</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
  <style>
    :root {
      --background: 0 0% 100%;
      --foreground: 0 0% 3.9%;
      --card: 0 0% 100%;
      --card-foreground: 0 0% 3.9%;
      --primary: 0 0% 9%;
      --primary-foreground: 0 0% 98%;
      --secondary: 0 0% 96.1%;
      --secondary-foreground: 0 0% 9%;
      --muted: 0 0% 96.1%;
      --muted-foreground: 0 0% 45.1%;
      --accent: 0 0% 96.1%;
      --accent-foreground: 0 0% 9%;
      --destructive: 0 84.2% 60.2%;
      --destructive-foreground: 0 0% 98%;
      --border: 0 0% 89.8%;
      --input: 0 0% 89.8%;
      --ring: 0 0% 3.9%;
      --radius: 0.5rem;
    }
    
    * {
      box-sizing: border-box;
    }
    
    body, html {
      margin: 0;
      padding: 0;
      height: 100%;
      background: linear-gradient(135deg, hsl(210 40% 98%) 0%, hsl(210 40% 95%) 100%);
      font-family: 'Inter', Arial, Helvetica, sans-serif;
      color: hsl(var(--foreground));
      overflow: hidden;
    }
    
    .top-bar {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 30;
      background: rgba(255, 255, 255, 0.95);
      backdrop-filter: blur(10px);
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      padding: 1rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .social-icons {
      display: flex;
      gap: 2rem;
    }

    .social-icon {
      position: relative;
      cursor: pointer;
    }
    
    .social-icon a {
      text-decoration: none;
      color: inherit;
    }
    
    .social-icon span {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 50px;
      width: 50px;
      background: white;
      border-radius: 50%;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transition: all 0.3s ease;
      font-size: 20px;
      color: #666;
    }
    
    .social-icon.tiktok:hover span {
      background: #000000;
      color: white;
      transform: translateY(-3px);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
    }
    
    .social-icon.facebook:hover span {
      background: #3b5998;
      color: white;
      transform: translateY(-3px);
      box-shadow: 0 8px 20px rgba(59, 89, 152, 0.4);
    }
    
    .social-icon.location:hover span {
      background: #34b7f1;
      color: white;
      transform: translateY(-3px);
      box-shadow: 0 8px 20px rgba(52, 183, 241, 0.4);
    }
    
    .pdf-viewer-container {
      position: fixed;
      top: 90px;
      left: 0;
      right: 0;
      bottom: 0;
      background: white;
      border-radius: 20px 20px 0 0;
      box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.1);
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    
    .pdf-canvas-container {
      flex: 1;
      overflow: auto;
      padding: 1rem;
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 1rem;
    }
    
    .pdf-page {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      max-width: 100%;
      height: auto;
    }
    
    .loading-spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 200px;
      gap: 1rem;
    }
    
    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .action-buttons {
      display: flex;
      flex-direction: row;
      gap: 1rem;
    }
    
    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      border-radius: calc(var(--radius) - 2px);
      font-size: 0.875rem;
      font-weight: 500;
      text-decoration: none;
      transition: all 0.2s;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      width: auto;
    }
    
    .btn-primary {
      background: #3b82f6;
      color: white;
    }
    
    .btn-primary:hover {
      background: #2563eb;
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
    }
    
    .btn-secondary {
      background: white;
      color: #3b82f6;
      border: 1px solid #3b82f6;
    }
    
    .btn-secondary:hover {
      background: rgba(59, 130, 246, 0.05);
      transform: translateY(-1px);
    }
    
    .icon {
      display: inline-block;
    }
    
    .no-menu {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 100vh;
      flex-direction: column;
      text-align: center;
      padding: 2rem;
    }
    
    .no-menu-icon {
      font-size: 4rem;
      color: #94a3b8;
      margin-bottom: 1.5rem;
    }
    
    .no-menu-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #1e293b;
      margin-bottom: 0.75rem;
    }
    
    .no-menu-text {
      color: #64748b;
      max-width: 400px;
      margin-bottom: 1.5rem;
    }
    
    .mobile-hint {
      position: fixed;
      bottom: 1rem;
      left: 50%;
      transform: translateX(-50%);
      z-index: 20;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: 0.5rem 1rem;
      border-radius: 20px;
      font-size: 0.75rem;
      text-align: center;
      backdrop-filter: blur(10px);
    }
    
    @media (min-width: 768px) {
      .mobile-hint {
        display: none;
      }
    }
    
    @media (max-width: 640px) {
      .top-bar {
        padding: 0.75rem;
      }
      .social-icons {
        gap: 1rem;
      }
      .action-buttons {
        gap: 0.5rem;
      }
      .social-icon span {
        height: 45px;
        width: 45px;
        font-size: 18px;
      }
      
      .pdf-viewer-container {
        top: 80px;
      }
      
      .btn {
        padding: 0.375rem 0.75rem;
        font-size: 0.75rem;
      }
      
      .no-menu-icon {
        font-size: 3rem;
      }
      
      .no-menu-title {
        font-size: 1.25rem;
      }
      
      .no-menu-text {
        font-size: 0.875rem;
      }
    }
  </style>
</head>
<body>
  ${data.menuExists ? `
    <!-- Top Bar -->
    <div class="top-bar">
       <div class="action-buttons">
        <a href="${data.menuUrl}" class="btn btn-primary" download>
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
          <a href="https://www.tiktok.com/@fale7_1961?_t=ZS-8x1AmLeHCEc&_r=1" target="_blank">
            <span><i class="fab fa-tiktok"></i></span>
          </a>
        </div>
        <div class="social-icon facebook">
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
    
    <!-- عارض PDF مخصص -->
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
      // تحديد مسار PDF.js worker
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      
      // تحميل وعرض PDF
      async function loadPDF() {
        try {
          const container = document.getElementById('pdfContainer');
          
          // تحميل PDF
          const pdf = await pdfjsLib.getDocument('${data.menuUrl}').promise;
          
          // مسح محتوى التحميل
          container.innerHTML = '';
          
          // عرض كل صفحة
          for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
            const page = await pdf.getPage(pageNum);
            
            // إنشاء canvas للصفحة
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            
            // تحديد حجم العرض
            const viewport = page.getViewport({ scale: 1.5 });
            canvas.height = viewport.height;
            canvas.width = viewport.width;
            canvas.className = 'pdf-page';
            
            // رسم الصفحة
            await page.render({
              canvasContext: context,
              viewport: viewport
            }).promise;
            
            container.appendChild(canvas);
          }
        } catch (error) {
          console.error('خطأ في تحميل PDF:', error);
          document.getElementById('pdfContainer').innerHTML = 
            '<div style="text-align: center; padding: 2rem;"><p>حدث خطأ في تحميل المنيو. يرجى المحاولة مرة أخرى.</p></div>';
        }
      }
      
      // تحميل PDF عند تحميل الصفحة
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
