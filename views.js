module.exports = {
  // قالب تسجيل الدخول
  login: (data) => {
    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/png" href="/nbvnb1.png">
  <meta name="robots" content="noindex, nofollow">
  
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
      --safe-top: env(safe-area-inset-top);
      --safe-right: env(safe-area-inset-right);
      --safe-bottom: env(safe-area-inset-bottom);
      --safe-left: env(safe-area-inset-left);
    }
    
    * {
      box-sizing: border-box;
    }

    html {
      text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
    }

    body {
      font-family: 'Inter', Arial, Helvetica, sans-serif;
      background: linear-gradient(135deg, hsl(210 40% 98%) 0%, hsl(210 40% 95%) 100%);
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100dvh;
      margin: 0;
      padding: clamp(0.75rem, 2.5vw, 1.5rem);
      color: hsl(var(--foreground));
    }
    
    .card {
      background: hsl(var(--card));
      border: 1px solid hsl(var(--border));
      border-radius: var(--radius);
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
      width: 100%;
      max-width: min(400px, 100%);
      overflow: hidden;
    }
    
    .card-header {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
      color: white;
      padding: clamp(1.25rem, 3vw, 2rem);
      text-align: center;
    }
    
    .card-title {
      font-size: clamp(1.125rem, 2.6vw, 1.5rem);
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
      padding: clamp(1.25rem, 3vw, 2rem);
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
      min-height: 44px;
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
      min-height: 44px;
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
    
    @media (max-width: 768px) {
      body {
        padding: clamp(0.5rem, 2vw, 1rem);
      }
      
      .card {
        max-width: min(90vw, 380px);
      }
      
      .card-header {
        padding: clamp(1rem, 2.5vw, 1.5rem);
      }
      
      .card-content {
        padding: clamp(1rem, 2.5vw, 1.5rem);
      }
      
      .card-title {
        font-size: clamp(1.1rem, 2.5vw, 1.375rem);
      }
      
      .form-group {
        margin-bottom: 1.25rem;
      }
      
      .btn {
        padding: clamp(0.625rem, 2vw, 0.75rem);
        font-size: clamp(0.875rem, 2vw, 1rem);
      }
    }

    @media (max-width: 480px) {
      body {
        padding: 0.5rem;
      }
      
      .card {
        max-width: 100%;
      }
      
      .card-header {
        padding: 1.25rem 1rem;
      }
      
      .card-content {
        padding: 1.25rem 1rem;
      }
      
      .card-title {
        font-size: 1.125rem;
      }
      
      .form-label {
        font-size: 0.8125rem;
      }
      
      .form-input {
        padding: 0.625rem;
        font-size: 0.9375rem;
        min-height: 40px;
      }
      
      .btn {
        padding: 0.625rem 0.75rem;
        font-size: 0.875rem;
        min-height: 40px;
      }
    }

    @media (max-width: 360px) {
      .card-title {
        font-size: 1rem;
        gap: 0.25rem;
      }
      
      .form-input {
        font-size: 0.875rem;
        padding: 0.5rem;
      }
      
      .btn {
        font-size: 0.8125rem;
        padding: 0.5rem;
      }
    }

    @media (max-height: 600px) and (orientation: landscape) {
      body {
        align-items: center;
        padding: 0.5rem;
        min-height: 100vh;
      }
      
      .card {
        max-width: min(90vw, 500px);
        max-height: 90vh;
        overflow-y: auto;
      }
      
      .card-header {
        padding: 0.75rem 1rem;
      }
      
      .card-content {
        padding: 0.75rem 1rem;
      }
      
      .card-title {
        font-size: 1.125rem;
        margin: 0 0 0.25rem 0;
      }
      
      .card-subtitle {
        font-size: 0.75rem;
      }
      
      .form-group {
        margin-bottom: 0.75rem;
      }
      
      .form-label {
        font-size: 0.75rem;
        margin-bottom: 0.25rem;
      }
      
      .form-input {
        padding: 0.5rem;
        font-size: 0.875rem;
        min-height: 38px;
      }
      
      .btn {
        padding: 0.5rem 0.75rem;
        font-size: 0.875rem;
        min-height: 38px;
      }
    }

    @media (max-height: 500px) and (orientation: landscape) {
      .card {
        max-height: 95vh;
      }
      
      .card-header {
        padding: 0.5rem 1rem;
      }
      
      .card-content {
        padding: 0.5rem 1rem;
      }
      
      .card-title {
        font-size: 1rem;
        margin-bottom: 0;
      }
      
      .card-subtitle {
        font-size: 0.7rem;
      }
      
      .form-group {
        margin-bottom: 0.6rem;
      }
      
      .form-input {
        padding: 0.4rem;
        min-height: 36px;
      }
      
      .btn {
        min-height: 36px;
        padding: 0.4rem 0.6rem;
        font-size: 0.8rem;
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
  <link rel="icon" type="image/png" href="/nbvnb1.png">
  <meta name="robots" content="noindex, nofollow">
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
      --safe-top: env(safe-area-inset-top);
      --safe-right: env(safe-area-inset-right);
      --safe-bottom: env(safe-area-inset-bottom);
      --safe-left: env(safe-area-inset-left);
      --header-offset: 0px;
    }
    
    * {
      box-sizing: border-box;
    }

    html {
      text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
    }
    
    body {
      font-family: 'Inter', Arial, Helvetica, sans-serif;
      background: linear-gradient(135deg, hsl(210 40% 98%) 0%, hsl(210 40% 95%) 100%);
      min-height: 100dvh;
      margin: 0;
      padding: clamp(0.75rem, 2.5vw, 1.5rem);
      color: hsl(var(--foreground));
    }
    
    .container {
      width: min(100%, 720px);
      margin: clamp(0.75rem, 2.5vw, 2rem) auto;
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
      padding: clamp(1.125rem, 2.5vw, 1.5rem);
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
      padding: clamp(1rem, 2.5vw, 1.5rem);
    }
    
    .upload-area {
      border: 2px dashed #cbd5e1;
      border-radius: var(--radius);
      padding: clamp(1rem, 4vw, 2rem) clamp(0.75rem, 3vw, 1rem);
      text-align: center;
      margin-bottom: clamp(1rem, 2vw, 1.5rem);
      transition: all 0.2s;
      cursor: pointer;
      position: relative;
      min-height: 120px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    }
    
    .upload-area:hover {
      border-color: #3b82f6;
      background-color: rgba(59, 130, 246, 0.05);
    }

    .upload-section {
      border: 1px solid #e2e8f0;
      border-radius: 10px;
      padding: 1rem;
      margin-bottom: 1rem;
      background: #fff;
    }

    .upload-section-title {
      margin: 0 0 0.75rem 0;
      color: #1e293b;
      font-size: 1rem;
      font-weight: 700;
      text-align: right;
    }

    .inline-actions {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 0.5rem;
    }

    .btn-danger {
      background: #ef4444;
      color: #fff;
    }

    .btn-danger:hover {
      background: #dc2626;
      transform: translateY(-1px);
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
      overflow-wrap: anywhere;
      word-break: break-word;
    }
    
    .upload-hint {
      font-size: 0.875rem;
      color: #94a3b8;
      overflow-wrap: anywhere;
      word-break: break-word;
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
      display: flex;
      width: 100%;
      padding: clamp(0.625rem, 2vw, 0.75rem);
      border: none;
      border-radius: calc(var(--radius) - 2px);
      font-size: clamp(0.875rem, 2vw, 1rem);
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
      text-align: center;
      text-decoration: none;
      margin-bottom: clamp(0.75rem, 2vw, 1rem);
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      min-height: 44px;
      overflow-wrap: anywhere;
      flex-wrap: nowrap;
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
        padding: 1rem;
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
    
    @media (max-width: 1024px) {
      .container {
        width: min(100%, 680px);
      }
      
      .card-header {
        padding: clamp(1rem, 3vw, 1.5rem);
      }
      
      .card-content {
        padding: clamp(1rem, 3vw, 1.5rem);
      }
    }

    @media (max-width: 768px) {
      .container {
        width: min(100%, 600px);
        margin: clamp(0.5rem, 2vw, 1.5rem) auto;
      }
      
      .upload-area {
        min-height: 110px;
      }
      
      .card-header {
        padding: clamp(1rem, 2.5vw, 1.25rem);
      }
      
      .card-content {
        padding: clamp(1rem, 2.5vw, 1.25rem);
      }
      
      .upload-section {
        padding: clamp(0.75rem, 2vw, 1rem);
        margin-bottom: clamp(0.75rem, 2vw, 1rem);
        border-radius: 8px;
      }
      
      .upload-section-title {
        font-size: clamp(0.875rem, 2vw, 1rem);
      }
      
      .inline-actions {
        gap: clamp(0.4rem, 2vw, 0.5rem);
      }
      
      .btn {
        font-size: clamp(0.75rem, 2vw, 0.875rem);
        min-height: 42px;
      }
    }

    @media (max-width: 480px) {
      .container {
        width: 100%;
        margin: 0.5rem auto;
      }
      
      body {
        padding: 0.5rem;
      }
      
      .card-header {
        padding: 1rem 1.5rem;
      }
      
      .card-content {
        padding: 1rem 1.5rem;
      }
      
      .card-title {
        font-size: clamp(1.125rem, 4vw, 1.375rem);
      }
      
      .upload-area {
        padding: 1.25rem 0.75rem;
        min-height: 100px;
      }
      
      .upload-icon {
        font-size: 1.75rem;
        margin-bottom: 0.5rem;
      }
      
      .upload-text {
        font-size: 0.875rem;
        margin-bottom: 0.25rem;
      }
      
      .upload-hint {
        font-size: 0.75rem;
      }
      
      .upload-section {
        padding: 0.75rem;
        margin-bottom: 0.75rem;
        border-radius: 6px;
      }
      
      .upload-section-title {
        font-size: 0.875rem;
        margin-bottom: 0.5rem;
      }
      
      .inline-actions {
        grid-template-columns: 1fr;
        gap: 0.4rem;
      }
      
      .btn {
        padding: clamp(0.5rem, 1.5vw, 0.625rem) clamp(0.6rem, 2vw, 0.75rem);
        font-size: 0.75rem;
        min-height: 40px;
        margin-bottom: clamp(0.6rem, 1.5vw, 0.75rem);
      }
      
      .actions {
        gap: clamp(0.6rem, 1.5vw, 1rem);
      }
      
      .debug-info {
        font-size: 0.7rem;
        margin-top: 1rem;
      }
      
      #progressBar {
        height: 16px;
      }
      
      #progressPercentage {
        font-size: 0.875rem;
        margin-top: 0.5rem;
      }
    }

    @media (max-width: 360px) {
      .card {
        border-radius: 12px;
      }
      
      .card-title {
        font-size: 1rem;
        gap: 0.3rem;
      }
      
      .card-subtitle {
        font-size: 0.8rem;
      }
      
      .upload-area {
        padding: 1rem 0.6rem;
        min-height: 90px;
      }
      
      .upload-icon {
        font-size: 1.5rem;
      }
      
      .upload-text {
        font-size: 0.8125rem;
      }
      
      .btn {
        font-size: 0.7rem;
        padding: 0.45rem 0.5rem;
        min-height: 38px;
      }
      
      .inline-actions {
        gap: 0.3rem;
      }
    }

    @media (max-height: 600px) and (orientation: landscape) {
      .container {
        margin: 0.5rem auto;
      }
      
      .card {
        max-height: 90vh;
        overflow-y: auto;
      }
      
      .card-header {
        padding: 0.75rem 1rem;
      }
      
      .card-content {
        padding: 0.75rem 1rem;
      }
      
      .card-title {
        font-size: 1.125rem;
        margin-bottom: 0.2rem;
      }
      
      .upload-section {
        padding: 0.6rem;
        margin-bottom: 0.6rem;
      }
      
      .upload-section-title {
        font-size: 0.75rem;
        margin-bottom: 0.4rem;
      }
      
      .upload-area {
        padding: 0.75rem 0.5rem;
        min-height: 80px;
        margin-bottom: 0.6rem;
      }
      
      .upload-icon {
        font-size: 1.5rem;
        margin-bottom: 0.25rem;
      }
      
      .upload-text {
        font-size: 0.75rem;
        margin-bottom: 0.15rem;
      }
      
      .upload-hint {
        font-size: 0.65rem;
      }
      
      .btn {
        padding: 0.4rem 0.6rem;
        font-size: 0.7rem;
        min-height: 36px;
        margin-bottom: 0.5rem;
      }
      
      .actions {
        margin-top: 0.75rem;
        gap: 0.5rem;
      }
      
      .debug-info {
        font-size: 0.65rem;
        margin-top: 0.75rem;
      }
    }

    @media (max-height: 500px) and (orientation: landscape) {
      .card-header {
        padding: 0.5rem 1rem;
      }
      
      .card-content {
        padding: 0.5rem 1rem;
      }
      
      .card-title {
        font-size: 1rem;
        margin-bottom: 0;
      }
      
      .upload-section {
        padding: 0.5rem;
        margin-bottom: 0.5rem;
      }
      
      .upload-area {
        padding: 0.6rem 0.5rem;
        min-height: 70px;
        margin-bottom: 0.5rem;
      }
      
      .btn {
        padding: 0.35rem 0.5rem;
        font-size: 0.65rem;
        min-height: 34px;
        margin-bottom: 0.4rem;
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
        <section class="upload-section">
          <h3 class="upload-section-title">المنيو الرئيسي</h3>
          <form class="upload-form" data-pathname="menu.pdf" data-label="المنيو الرئيسي">
            <div class="upload-area">
              <div class="upload-icon">📄</div>
              <div class="upload-text">اسحب وأفلت ملف PDF هنا</div>
              <div class="upload-hint">أو انقر للاختيار من جهازك</div>
              <input type="file" name="menu" accept="application/pdf" required class="file-input" />
            </div>
            <div class="inline-actions">
              <button type="submit" class="btn btn-primary">
                <span class="icon">📤</span>
                رفع المنيو
              </button>
              <button type="button" class="btn btn-danger delete-page-btn" data-page-type="menu">
                <span class="icon">🗑️</span>
                حذف المنيو
              </button>
            </div>
          </form>
        </section>

        <section class="upload-section">
          <h3 class="upload-section-title">صفحة العروض</h3>
          <form class="upload-form" data-pathname="offers.pdf" data-label="صفحة العروض">
            <div class="upload-area">
              <div class="upload-icon">🎁</div>
              <div class="upload-text">اسحب وأفلت ملف عروض PDF هنا</div>
              <div class="upload-hint">أو انقر للاختيار من جهازك</div>
              <input type="file" name="offers" accept="application/pdf" required class="file-input" />
            </div>
            <div class="inline-actions">
              <button type="submit" class="btn btn-primary">
                <span class="icon">📤</span>
                نشر العروض
              </button>
              <button type="button" class="btn btn-danger delete-page-btn" data-page-type="offers">
                <span class="icon">🗑️</span>
                حذف صفحة العروض
              </button>
            </div>
          </form>
        </section>

        <section class="upload-section">
          <h3 class="upload-section-title">صفحة منيو السحور</h3>
          <form class="upload-form" data-pathname="suhoor.pdf" data-label="منيو السحور">
            <div class="upload-area">
              <div class="upload-icon">🌙</div>
              <div class="upload-text">اسحب وأفلت ملف سحور PDF هنا</div>
              <div class="upload-hint">أو انقر للاختيار من جهازك</div>
              <input type="file" name="suhoor" accept="application/pdf" required class="file-input" />
            </div>
            <div class="inline-actions">
              <button type="submit" class="btn btn-primary">
                <span class="icon">📤</span>
                نشر منيو السحور
              </button>
              <button type="button" class="btn btn-danger delete-page-btn" data-page-type="suhoor">
                <span class="icon">🗑️</span>
                حذف صفحة السحور
              </button>
            </div>
          </form>
        </section>
        
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
          Developed by Mohamed
        </div>
      </div>
    </div>
  </div>

  <script type="module">
    import { upload } from 'https://esm.sh/@vercel/blob/client';

    document.addEventListener('DOMContentLoaded', () => {
      const loadingOverlay = document.getElementById('loadingOverlay');
      const loadingText = document.getElementById('loadingText');
      const progressBar = document.getElementById('progressBar');
      const progressPercentage = document.getElementById('progressPercentage');

      const forms = document.querySelectorAll('.upload-form');
      forms.forEach((form) => {
        const fileInput = form.querySelector('input[type="file"]');
        const uploadText = form.querySelector('.upload-text');
        const uploadHint = form.querySelector('.upload-hint');
        const pathname = form.dataset.pathname;
        const label = form.dataset.label;

        fileInput.addEventListener('change', () => {
          if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            uploadText.textContent = file.name;
            const fileSize = file.size > 1024 * 1024
              ? ((file.size / 1024 / 1024).toFixed(2) + ' MB')
              : ((file.size / 1024).toFixed(2) + ' KB');
            uploadHint.textContent = 'حجم الملف: ' + fileSize;
          }
        });

        form.addEventListener('submit', async (e) => {
          e.preventDefault();

          if (!fileInput.files || fileInput.files.length === 0) {
            alert('الرجاء اختيار ملف أولاً.');
            return;
          }

          const file = fileInput.files[0];
          if (file.type !== 'application/pdf') {
            alert('يرجى رفع ملف PDF فقط.');
            return;
          }

          loadingText.innerText = 'جاري رفع ' + label + '...';
          progressBar.style.width = '20%';
          progressPercentage.innerText = '20%';
          loadingOverlay.style.display = 'flex';

          try {
            const result = await upload(pathname, file, {
              access: 'public',
              handleUploadUrl: '/api/blob-upload',
              multipart: true,
            });

            if (!result || !result.url) {
              throw new Error('لم يتم استلام رابط الملف بعد الرفع.');
            }

            progressBar.style.width = '100%';
            progressPercentage.innerText = '100%';
            loadingText.innerText = 'اكتمل بنجاح!';
            setTimeout(() => window.location.reload(), 1000);
          } catch (error) {
            console.error('Upload error:', error);
            const errorMessage = error?.message || 'حدث خطأ أثناء رفع الملف.';
            if (errorMessage.includes('retrieve the client token') || errorMessage.includes('Unauthorized')) {
              alert('انتهت جلسة تسجيل الدخول. سجل الدخول مرة أخرى.');
              window.location.href = '/login';
              return;
            }
            alert(errorMessage);
            loadingOverlay.style.display = 'none';
            progressBar.style.width = '0%';
            progressPercentage.innerText = '0%';
          }
        });
      });

      const deleteButtons = document.querySelectorAll('.delete-page-btn');
      deleteButtons.forEach((btn) => {
        btn.addEventListener('click', async () => {
          const pageType = btn.dataset.pageType;
          const confirmed = window.confirm('هل أنت متأكد من حذف هذه الصفحة؟');
          if (!confirmed) return;

          try {
            loadingOverlay.style.display = 'flex';
            loadingText.innerText = 'جاري حذف الصفحة...';
            progressBar.style.width = '30%';
            progressPercentage.innerText = '30%';

            const response = await fetch('/delete-page', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ pageType }),
            });

            const data = await response.json();
            if (!response.ok || !data.success) {
              throw new Error(data.message || 'حدث خطأ أثناء الحذف.');
            }

            progressBar.style.width = '100%';
            progressPercentage.innerText = '100%';
            loadingText.innerText = 'تم الحذف بنجاح!';
            setTimeout(() => window.location.reload(), 800);
          } catch (error) {
            alert(error.message || 'فشل حذف الصفحة.');
            loadingOverlay.style.display = 'none';
          }
        });
      });
    });
  </script>
</body>
</html>`;
  },

  // قالب صفحة المنيو
  menu: (data) => {
    const canonicalUrl = data.canonicalUrl || 'https://fale7-res.vercel.app/';
    const indexable = data.indexable !== false;
    const robotsContent = indexable ? 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' : 'noindex, follow';
    const metaTitle = 'فالح أبو العنبه | منيو سندوتشات ومشاوي عراقية في 6 أكتوبر';
    const metaDescription = 'مطعم فالح أبو العنبه (Fale7) في الجيزة – 6 أكتوبر – الحي السابع – شارع مكة المكرمة – بالقرب من سنتر الأردنية. منيو سندوتشات ومشاوي عراقية وبطاطس وفلافل. اتصل: 01000602832 / 01144741115. للشكاوى: 01112595678.';
    const metaKeywords = 'فالح, فالح ابو العنبه, مطعم فالح, مطعم فالح ابو العنبه, منيو فالح, منيو مطعم فالح, منيو فالح ابو العنبه, منيو مطعم فالح ابو العنبه, سندوتشات 6 اكتوبر, مشاوي 6 اكتوبر, بطاطس 6 اكتوبر, فلافل 6 اكتوبر, اكلات عراقية, مشاوي عراقية, فلافل عراقية, افضل مطعم في 6 اكتوبر, افضل المطاعم في 6 اكتوبر, مطعم عراقي في مصر, مطعم عراقي في 6 اكتوبر';
    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5, user-scalable=yes">
  <link rel="icon" type="image/png" href="/nbvnb1.png">
  <meta name="description" content="${metaDescription}">
  <meta name="keywords" content="${metaKeywords}">

  <meta property="og:title" content="${metaTitle}">
  <meta property="og:description" content="${metaDescription}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="ar_EG">
  <meta property="og:site_name" content="فالح أبو العنبه | Fale7">
  <meta property="og:image" content="https://fale7-res.vercel.app/nbvnb1.png">

  <meta name="robots" content="${robotsContent}">

  <title>${metaTitle}</title>
  <link rel="canonical" href="${canonicalUrl}">
  <meta name="language" content="ar">
  <meta name="geo.country" content="EG">
  <meta name="geo.region" content="EG-GZ">
  <meta name="geo.placename" content="6 أكتوبر, الجيزة">
  <meta name="geo.position" content="29.9753;30.9445">
  <meta name="ICBM" content="29.9753, 30.9445">
  <link rel="alternate" hreflang="ar-eg" href="https://fale7-res.vercel.app/">
  <link rel="alternate" hreflang="ar-iq" href="https://fale7-res.vercel.app/">
  <link rel="alternate" hreflang="x-default" href="https://fale7-res.vercel.app/">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@id": "https://fale7-res.vercel.app/#restaurant",
    "@type": "Restaurant",
    "name": "فالح أبو العنبه",
    "alternateName": "Fale7",
    "logo": "https://fale7-res.vercel.app/nbvnb1.png",
    "image": "https://fale7-res.vercel.app/nbvnb1.png",
    "url": "https://fale7-res.vercel.app/",
    "telephone": ["+201000602832", "+201144741115"],
    "contactPoint": [{
      "@type": "ContactPoint",
      "telephone": "+201112595678",
      "contactType": "customer service",
      "areaServed": ["EG"],
      "availableLanguage": ["ar"]
    }],
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "EG",
      "addressRegion": "محافظة الجيزة",
      "addressLocality": "6 أكتوبر",
      "streetAddress": "الحي السابع - شارع مكة المكرمة - بالقرب من سنتر الأردنية"
    },
    "areaServed": ["EG"],
    "openingHoursSpecification": [{
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Saturday","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday"],
      "opens": "07:00",
      "closes": "03:00"
    }],
    "servesCuisine": ["عراقي", "مشاوي", "سندوتشات", "فلافل"],
    "hasMap": "https://maps.app.goo.gl/K38LYo9oSC2Myd119",
    "menu": "https://fale7-res.vercel.app/",
    "sameAs": [
      "https://www.tiktok.com/@fale7_1961",
      "https://www.facebook.com/profile.php?id=100063865183387",
      "https://maps.app.goo.gl/K38LYo9oSC2Myd119"
    ]
  }
  </script>
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
      --safe-top: env(safe-area-inset-top);
      --safe-right: env(safe-area-inset-right);
      --safe-bottom: env(safe-area-inset-bottom);
      --safe-left: env(safe-area-inset-left);
      --header-offset: 0px;
    }
    
    html {
      text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
    }

    * {
      box-sizing: border-box;
    }
    
    body, html {
      margin: 0;
      padding: 0;
      height: 100%;
      min-height: 100dvh;
      background: linear-gradient(135deg, hsl(210 40% 98%) 0%, hsl(210 40% 95%) 100%);
      font-family: 'Inter', Arial, Helvetica, sans-serif;
      color: hsl(var(--foreground));
      overflow: hidden;
      overscroll-behavior: none;
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
      padding: calc(0.75rem + var(--safe-top)) calc(1rem + var(--safe-right)) 0.75rem calc(1rem + var(--safe-left));
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 0.75rem;
      direction: rtl;
    }
    
    .social-icons {
      display: flex;
      gap: clamp(0.4rem, 1.5vw, 1rem);
      order: 2;
      flex: 0 0 auto;
      flex-wrap: nowrap;
      min-width: 0;
    }

    .social-icon {
      position: relative;
      cursor: pointer;
      flex: 0 0 auto;
    }
    
    .social-icon a {
      text-decoration: none;
      color: inherit;
      display: block;
    }
    
    .social-icon span {
      display: flex;
      align-items: center;
      justify-content: center;
      height: clamp(40px, 4.2vw, 50px);
      width: clamp(40px, 4.2vw, 50px);
      background: white;
      border-radius: 50%;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transition: all 0.3s ease;
      font-size: clamp(15px, 2.8vw, 20px);
      color: #666;
      flex-shrink: 0;
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
      top: var(--header-offset);
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
      padding: clamp(0.5rem, 1.5vw, 1rem);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: clamp(0.5rem, 1.5vw, 0.75rem);
    }

    .seo-section{
      width:100%;
      max-width:860px;
      margin: 0.75rem auto 1.5rem;
      padding: 0.85rem 0.9rem;
      background:#fff;
      border:1px solid rgba(0,0,0,0.08);
      border-radius:12px;
      font-size: 0.85rem;
      line-height:1.7;
      color:#475569;
    }
    .seo-section h2{ margin:0 0 0.6rem; font-size:1rem; color: #334155; }
    .seo-section p { margin: 0 0 0.55rem; }
    .seo-section p:last-child { margin-bottom: 0; }
    
    .pdf-page {
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      max-width: 100%;
      height: auto;
      width: auto;
      display: block;
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
      gap: clamp(0.4rem, 1.5vw, 0.75rem);
      max-width: calc(100% - clamp(140px, 32vw, 180px));
      min-width: 0;
      order: 1;
      justify-content: flex-start;
      overflow-x: auto;
      overflow-y: hidden;
      white-space: nowrap;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      flex: 1 1 auto;
      padding-right: 0.5rem;
    }

    .action-buttons::-webkit-scrollbar {
      display: none;
    }
    
    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.35rem;
      padding: clamp(0.4rem, 1.5vw, 0.5rem) clamp(0.6rem, 2vw, 1rem);
      border-radius: calc(var(--radius) - 2px);
      font-size: clamp(0.7rem, 1.8vw, 0.875rem);
      font-weight: 500;
      text-decoration: none;
      transition: all 0.2s;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
      width: auto;
      white-space: nowrap;
      min-height: clamp(38px, 4vw, 44px);
      flex: 0 0 auto;
      border: none;
      cursor: pointer;
      overflow: hidden;
      text-overflow: ellipsis;
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
      min-height: 100dvh;
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
      bottom: calc(1rem + var(--safe-bottom));
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
    
    @media (max-width: 768px) {
      .top-bar {
        padding: calc(0.625rem + var(--safe-top)) calc(0.75rem + var(--safe-right)) 0.625rem calc(0.75rem + var(--safe-left));
        gap: clamp(0.4rem, 1.5vw, 0.625rem);
        min-height: clamp(56px, 8vh, 70px);
      }
      
      .action-buttons {
        max-width: calc(100% - clamp(120px, 28vw, 160px));
        gap: clamp(0.3rem, 1vw, 0.5rem);
      }
      
      .btn {
        padding: clamp(0.35rem, 1vw, 0.45rem) clamp(0.5rem, 1.5vw, 0.75rem);
        font-size: clamp(0.65rem, 1.5vw, 0.8rem);
        min-height: clamp(36px, 3vw, 40px);
      }
      
      .social-icons {
        gap: clamp(0.3rem, 1vw, 0.75rem);
      }
      
      .social-icon span {
        height: clamp(40px, 5.6vw, 46px);
        width: clamp(40px, 5.6vw, 46px);
        font-size: clamp(15px, 3.4vw, 17px);
      }
      
      .pdf-canvas-container {
        padding: clamp(0.75rem, 2vw, 1rem);
        gap: clamp(0.6rem, 2vw, 1rem);
      }
      
      .mobile-hint {
        font-size: clamp(0.65rem, 1.5vw, 0.75rem);
        padding: clamp(0.4rem, 1vw, 0.5rem) clamp(0.75rem, 2vw, 1rem);
        bottom: calc(clamp(0.75rem, 1.5vw, 1rem) + var(--safe-bottom));
      }
    }

    @media (max-width: 480px) {
      .top-bar {
        padding: calc(0.5rem + var(--safe-top)) calc(0.5rem + var(--safe-right)) 0.5rem calc(0.5rem + var(--safe-left));
        gap: 0.4rem;
        min-height: clamp(52px, 7vh, 64px);
      }
      
      .action-buttons {
        max-width: calc(100% - clamp(110px, 26vw, 140px));
        padding-right: 0.3rem;
      }
      
      .btn {
        padding: clamp(0.3rem, 0.8vw, 0.4rem) clamp(0.45rem, 1.2vw, 0.6rem);
        font-size: clamp(0.6rem, 1.2vw, 0.7rem);
        min-height: clamp(34px, 2.8vw, 38px);
        gap: 0.25rem;
      }
      
      .btn-primary:hover,
      .btn-secondary:hover {
        transform: translateY(-0.5px);
      }
      
      .social-icons {
        gap: clamp(0.25rem, 0.8vw, 0.5rem);
      }
      
      .social-icon span {
        height: clamp(40px, 10vw, 44px);
        width: clamp(40px, 10vw, 44px);
        font-size: clamp(14px, 4.2vw, 16px);
      }

      .seo-section {
        font-size: 0.8rem;
        line-height: 1.65;
        padding: 0.75rem 0.8rem;
      }

      .seo-section h2 {
        font-size: 0.95rem;
      }
      
      .pdf-canvas-container {
        padding: clamp(0.5rem, 1.5vw, 0.75rem);
        gap: clamp(0.5rem, 1.5vw, 0.75rem);
      }
      
      .pdf-page {
        border-radius: 6px;
      }
      
      .mobile-hint {
        font-size: clamp(0.6rem, 1.2vw, 0.7rem);
        padding: clamp(0.3rem, 0.8vw, 0.4rem) clamp(0.6rem, 1.5vw, 0.75rem);
        bottom: calc(clamp(0.5rem, 1vw, 0.75rem) + var(--safe-bottom));
      }
      
      .loading-spinner {
        height: 150px;
      }
      
      .spinner {
        width: 32px;
        height: 32px;
        border: 3px solid #f3f3f3;
        border-top: 3px solid #3b82f6;
      }
    }

    @media (max-width: 360px) {
      .top-bar {
        min-height: clamp(48px, 6vh, 56px);
        padding: calc(0.4rem + var(--safe-top)) calc(0.4rem + var(--safe-right)) 0.4rem calc(0.4rem + var(--safe-left));
      }
      
      .action-buttons {
        max-width: calc(100% - 100px);
      }
      
      .btn {
        padding: 0.3rem 0.4rem;
        font-size: 0.6rem;
        min-height: 32px;
        gap: 0.2rem;
      }
      
      .btn .icon {
        font-size: 0.8em;
      }
      
      .social-icon span {
        height: 40px;
        width: 40px;
        font-size: 16px;
      }
      
      .pdf-canvas-container {
        padding: 0.4rem;
        gap: 0.4rem;
      }
      
      .mobile-hint {
        font-size: 0.6rem;
        padding: 0.25rem 0.5rem;
      }
    }

    @media (max-height: 600px) and (orientation: landscape) {
      .top-bar {
        min-height: clamp(48px, 10vh, 70px);
        padding: calc(0.5rem + var(--safe-top)) calc(0.75rem + var(--safe-right)) 0.5rem calc(0.75rem + var(--safe-left));
        gap: 0.5rem;
      }
      
      .action-buttons {
        max-width: calc(100% - clamp(120px, 25vw, 150px));
        gap: 0.4rem;
      }
      
      .btn {
        padding: 0.35rem 0.65rem;
        font-size: 0.7rem;
        min-height: 36px;
      }
      
      .social-icons {
        gap: clamp(0.3rem, 1vw, 0.5rem);
      }
      
      .social-icon span {
        height: 38px;
        width: 38px;
        font-size: 15px;
      }
      
      .pdf-canvas-container {
        padding: clamp(0.5rem, 1.5vw, 0.75rem);
        gap: clamp(0.5rem, 1.5vw, 0.75rem);
      }
      
      .mobile-hint {
        font-size: 0.65rem;
        bottom: calc(0.5rem + var(--safe-bottom));
      }
      
      .no-menu-icon {
        font-size: clamp(2rem, 10vh, 3rem);
      }
      
      .no-menu-title {
        font-size: clamp(1rem, 4vw, 1.25rem);
      }
      
      .no-menu-text {
        font-size: clamp(0.75rem, 2vw, 0.875rem);
      }
    }

    @media (max-height: 500px) and (orientation: landscape) {
      .top-bar {
        min-height: clamp(44px, 8vh, 56px);
        padding: calc(0.4rem + var(--safe-top)) calc(0.6rem + var(--safe-right)) 0.4rem calc(0.6rem + var(--safe-left));
      }
      
      .action-buttons {
        gap: 0.3rem;
      }
      
      .btn {
        padding: 0.3rem 0.5rem;
        font-size: 0.65rem;
        min-height: 32px;
      }
      
      .social-icon span {
        height: 36px;
        width: 36px;
        font-size: 14px;
      }
      
      .pdf-canvas-container {
        padding: 0.4rem;
        gap: 0.4rem;
      }
      
      .spinner {
        width: 28px;
        height: 28px;
        border: 2px solid #f3f3f3;
        border-top: 2px solid #3b82f6;
      }
    }

    @media (max-width: 640px) and (orientation: portrait) {
      .top-bar {
        min-height: clamp(54px, 8vh, 68px);
      }
    }

    /* Legacy appearance sync (mobile) */
    .top-bar {
      padding: 1rem;
    }

    .social-icons {
      gap: 2rem;
    }

    .social-icon span {
      height: 50px;
      width: 50px;
      font-size: 20px;
    }

    .action-buttons {
      gap: 1rem;
      max-width: none;
      overflow: visible;
      padding-right: 0;
      flex: 0 1 auto;
    }

    .btn {
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      min-height: auto;
    }

    .pdf-viewer-container {
      top: 90px;
    }

    .pdf-canvas-container {
      padding: 1rem;
      gap: 1rem;
    }

    .mobile-hint {
      bottom: 1rem;
      padding: 0.5rem 1rem;
      font-size: 0.75rem;
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
    }
  </style>
</head>
<body>
  ${data.menuExists ? `
    <!-- Top Bar -->
    <div class="top-bar">
       <div class="action-buttons">
        ${data.offersExists ? `<a href="/offers" class="btn btn-secondary"><span class="icon">🎁</span>العروض</a>` : ''}
        ${data.suhoorExists ? `<a href="/suhoor" class="btn btn-secondary"><span class="icon">🌙</span>منيو السحور</a>` : ''}
      </div>
      <div class="social-icons">
        <div class="social-icon tiktok">
          <a href="https://www.tiktok.com/@fale7_1961" target="_blank">
            <span><i class="fab fa-tiktok"></i></span>
          </a>
        </div>
        <div class="social-icon facebook">
          <a href="https://www.facebook.com/profile.php?id=100063865183387" target="_blank">
            <span><i class="fab fa-facebook-f"></i></span>
          </a>
        </div>
        <div class="social-icon location">
          <a href="https://maps.app.goo.gl/K38LYo9oSC2Myd119" target="_blank">
            <span><i class="fas fa-map-marker-alt"></i></span>
          </a>
        </div>
      </div>
    </div>
    
    <!-- عارض PDF مخصص -->
    <div class="pdf-viewer-container">
      <div class="pdf-canvas-container" id="pdfContainer">
        <div id="pdfPages">
          <div class="loading-spinner">
            <div class="spinner"></div>
            <p>جاري تحميل المنيو...</p>
          </div>
        </div>

        <section class="seo-section" id="seoText" aria-label="معلومات المطعم">
          <h2>معلومات المطعم</h2>

          <p>مطعم فالح أبو العنبه (Fale7) هو مطعم يقدم السندوتشات والمشاوي والفلافل والأكلات العراقية في مدينة 6 أكتوبر بمحافظة الجيزة، تحديدًا في الحي السابع شارع مكة المكرمة بالقرب من سنتر الأردنية.</p>
          <p>يعمل المطعم يوميًا من الساعة 7 صباحًا حتى 3 صباحًا ويقدم مجموعة متنوعة من السندوتشات والبطاطس والمشاوي العراقية والفلافل العراقية والأكلات السريعة المناسبة لسكان مدينة 6 أكتوبر والمناطق المجاورة.</p>

          <p>يبحث سكان 6 أكتوبر عن مطعم قريب يقدم سندوتشات ومشاوي بطعم مميز، ويعد مطعم فالح من الأماكن المعروفة في الحي السابع للوجبات السريعة والأكل العراقي والمشاوي الطازجة.</p>
          <p>يمكنك مشاهدة المنيو كاملًا عبر الموقع أو زيارة صفحات المطعم الرسمية على تيك توك وفيسبوك لمعرفة أحدث العروض.</p>

          <p><strong>العنوان:</strong> الجيزة – 6 أكتوبر – الحي السابع – شارع مكة المكرمة – بالقرب من سنتر الأردنية</p>
          <p><strong>رقم الهاتف:</strong> 01000602832 / 01144741115</p>
          <p><strong>للشكاوى والمقترحات:</strong> 01112595678</p>
          <p><strong>صفحة تيك توك:</strong> fale7_1961</p>
          <p><strong>الموقع على الخريطة:</strong> <a href="https://maps.app.goo.gl/K38LYo9oSC2Myd119" target="_blank" rel="noopener">Google Maps</a></p>
        </section>
      </div>
    </div>
    
    <div class="mobile-hint">
      استخدم إصبعين للتكبير والتصغير
    </div>
    
    <script>
      // تحديد مسار PDF.js worker
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

      let pdfDoc = null;
      let renderToken = 0;
      let resizeTimer = null;

      function syncHeaderOffset() {
        const topBar = document.querySelector('.top-bar');
        if (!topBar) return;
        const height = Math.ceil(topBar.getBoundingClientRect().height);
        document.documentElement.style.setProperty('--header-offset', height + 'px');
      }

      async function renderAllPages() {
        const pagesContainer = document.getElementById('pdfPages');
        if (!pagesContainer || !pdfDoc) return;

        const currentToken = ++renderToken;
        pagesContainer.innerHTML = '';

        for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
          if (currentToken !== renderToken) return;

          const page = await pdfDoc.getPage(pageNum);
          const scale = 1.5;
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.className = 'pdf-page';
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({
            canvasContext: context,
            viewport
          }).promise;

          if (currentToken !== renderToken) return;
          pagesContainer.appendChild(canvas);
        }
      }

      // تحميل وعرض PDF
      async function loadPDF() {
        const pagesContainer = document.getElementById('pdfPages');
        try {
          pdfDoc = await pdfjsLib.getDocument('${data.menuUrl}').promise;
          await renderAllPages();
        } catch (error) {
          console.error('خطأ في تحميل PDF:', error);
          if (!pagesContainer) return;
          pagesContainer.innerHTML =
            '<div style="text-align: center; padding: 2rem;"><p>حدث خطأ في تحميل المنيو. يرجى المحاولة مرة أخرى.</p></div>';
        }
      }

      function handleViewportChange() {
        syncHeaderOffset();
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          if (pdfDoc) {
            renderAllPages();
          }
        }, 150);
      }
      
      // تحميل PDF عند تحميل الصفحة
      document.addEventListener('DOMContentLoaded', () => {
        syncHeaderOffset();
        loadPDF();
      });
      window.addEventListener('resize', handleViewportChange);
      window.addEventListener('orientationchange', handleViewportChange);
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
  },

  // قالب صفحات PDF الإضافية (العروض / السحور)
  pdfPage: (data) => {
    const indexable = typeof data.indexable === 'boolean' ? data.indexable : data.pageExists;
    const robotsContent = indexable ? 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1' : 'noindex, nofollow';
    const metaDescription = data.metaDescription || 'صفحة المنيو والعروض الخاصة بمطعم فالح أبو العنبه.';
    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5, user-scalable=yes">
  <link rel="icon" type="image/png" href="/nbvnb1.png">
  <meta name="description" content="${metaDescription}">
  <meta property="og:title" content="${data.title}">
  <meta property="og:description" content="${metaDescription}">
  <meta property="og:url" content="${data.canonicalUrl}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="ar_EG">
  <meta property="og:image" content="https://fale7-res.vercel.app/nbvnb1.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${data.title}">
  <meta name="twitter:description" content="${metaDescription}">
  <meta name="twitter:image" content="https://fale7-res.vercel.app/nbvnb1.png">
  <meta name="robots" content="${robotsContent}">
  <title>${data.title}</title>
  <link rel="canonical" href="${data.canonicalUrl}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
  <style>
    :root {
      --background: 0 0% 100%;
      --foreground: 0 0% 3.9%;
      --border: 0 0% 89.8%;
      --radius: 0.5rem;
      --safe-top: env(safe-area-inset-top);
      --safe-right: env(safe-area-inset-right);
      --safe-bottom: env(safe-area-inset-bottom);
      --safe-left: env(safe-area-inset-left);
      --header-offset: 0px;
    }

    * { box-sizing: border-box; }

    html {
      text-size-adjust: 100%;
      -webkit-text-size-adjust: 100%;
    }

    body, html {
      margin:0;
      padding:0;
      height:100%;
      min-height: 100dvh;
      background: linear-gradient(135deg, hsl(210 40% 98%) 0%, hsl(210 40% 95%) 100%);
      font-family: 'Inter', Arial, Helvetica, sans-serif;
      color: hsl(var(--foreground));
      overflow: hidden;
      overscroll-behavior: none;
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
      padding: calc(0.75rem + var(--safe-top)) calc(1rem + var(--safe-right)) 0.75rem calc(1rem + var(--safe-left));
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: clamp(0.5rem, 2vw, 0.75rem);
      direction: rtl;
      flex-wrap: nowrap;
      min-height: clamp(60px, 10vh, 80px);
      overflow: hidden;
    }

    .social-icons {
      display: flex;
      gap: clamp(0.4rem, 1.5vw, 1rem);
      order: 2;
      flex: 0 0 auto;
      flex-wrap: nowrap;
      min-width: 0;
    }

    .social-icon {
      position: relative;
      cursor: pointer;
      flex: 0 0 auto;
    }

    .social-icon a {
      text-decoration: none;
      color: inherit;
      display: block;
    }

    .social-icon span {
      display: flex;
      align-items: center;
      justify-content: center;
      height: clamp(40px, 4.2vw, 50px);
      width: clamp(40px, 4.2vw, 50px);
      background: white;
      border-radius: 50%;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transition: all 0.3s ease;
      font-size: clamp(15px, 2.8vw, 20px);
      color: #666;
      flex-shrink: 0;
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

    .action-buttons {
      display: flex;
      flex-direction: row;
      gap: clamp(0.4rem, 1.5vw, 0.75rem);
      max-width: calc(100% - clamp(140px, 32vw, 180px));
      min-width: 0;
      order: 1;
      justify-content: flex-start;
      overflow-x: auto;
      overflow-y: hidden;
      white-space: nowrap;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
      flex: 1 1 auto;
      padding-right: 0.5rem;
    }

    .action-buttons::-webkit-scrollbar {
      display: none;
    }

    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.35rem;
      padding: clamp(0.4rem, 1.5vw, 0.5rem) clamp(0.6rem, 2vw, 1rem);
      border-radius: calc(var(--radius) - 2px);
      font-size: clamp(0.7rem, 1.8vw, 0.875rem);
      font-weight: 500;
      text-decoration: none;
      transition: all 0.2s;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06);
      width: auto;
      white-space: nowrap;
      min-height: clamp(38px, 4vw, 44px);
      flex: 0 0 auto;
      border: none;
      cursor: pointer;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .btn-primary { background:#3b82f6; color:white; }
    .btn-primary:hover { background:#2563eb; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(59,130,246,0.4); }
    .btn-secondary { background:white; color:#3b82f6; border:1px solid #3b82f6; }
    .btn-secondary:hover { background:rgba(59,130,246,0.05); transform: translateY(-1px); }

    .pdf-viewer-container {
      position: fixed;
      top: var(--header-offset);
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
      padding: clamp(0.75rem, 2vw, 1rem);
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: clamp(0.75rem, 2vw, 1rem);
    }

    .pdf-page {
      box-shadow: 0 4px 12px rgba(0,0,0,0.12);
      border-radius: 8px;
      max-width: 100%;
      height: auto;
      width: auto;
    }

    .loading-spinner {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: clamp(150px, 30vh, 200px);
      gap: clamp(0.75rem, 2vw, 1rem);
      color: #475569;
      padding: 1rem;
    }

    .spinner {
      width: clamp(32px, 5vw, 40px);
      height: clamp(32px, 5vw, 40px);
      border: clamp(2px, 0.5vw, 4px) solid #f3f3f3;
      border-top: clamp(2px, 0.5vw, 4px) solid #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }

    .empty {
      display: flex;
      height: 100%;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      text-align: center;
      color: #475569;
      padding: clamp(1rem, 3vw, 2rem);
    }

    .empty h2 {
      font-size: clamp(1.125rem, 3vw, 1.5rem);
      margin: 0 0 0.75rem 0;
    }

    .empty p {
      font-size: clamp(0.875rem, 2vw, 1rem);
      max-width: 300px;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .mobile-hint {
      position: fixed;
      bottom: calc(clamp(0.75rem, 1.5vw, 1rem) + var(--safe-bottom));
      left: 50%;
      transform: translateX(-50%);
      z-index: 20;
      background: rgba(0, 0, 0, 0.7);
      color: white;
      padding: clamp(0.4rem, 1vw, 0.5rem) clamp(0.75rem, 2vw, 1rem);
      border-radius: 20px;
      font-size: clamp(0.65rem, 1.5vw, 0.75rem);
      text-align: center;
      backdrop-filter: blur(10px);
      white-space: nowrap;
      max-width: 90vw;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    @media (max-width: 768px) {
      .top-bar {
        padding: calc(0.625rem + var(--safe-top)) calc(0.75rem + var(--safe-right)) 0.625rem calc(0.75rem + var(--safe-left));
        gap: clamp(0.4rem, 1.5vw, 0.625rem);
        min-height: clamp(56px, 8vh, 70px);
      }

      .action-buttons {
        max-width: calc(100% - clamp(120px, 28vw, 160px));
        gap: clamp(0.3rem, 1vw, 0.5rem);
      }

      .btn {
        padding: clamp(0.35rem, 1vw, 0.45rem) clamp(0.5rem, 1.5vw, 0.75rem);
        font-size: clamp(0.65rem, 1.5vw, 0.8rem);
        min-height: clamp(36px, 3vw, 40px);
      }

      .social-icons {
        gap: clamp(0.3rem, 1vw, 0.75rem);
      }

      .social-icon span {
        height: clamp(40px, 5.6vw, 46px);
        width: clamp(40px, 5.6vw, 46px);
        font-size: clamp(15px, 3.4vw, 17px);
      }

      .pdf-canvas-container {
        padding: clamp(0.6rem, 1.5vw, 0.85rem);
        gap: clamp(0.6rem, 1.5vw, 0.85rem);
      }

      .mobile-hint {
        font-size: clamp(0.6rem, 1.2vw, 0.7rem);
      }
    }

    @media (max-width: 480px) {
      .top-bar {
        padding: calc(0.5rem + var(--safe-top)) calc(0.5rem + var(--safe-right)) 0.5rem calc(0.5rem + var(--safe-left));
        gap: 0.4rem;
        min-height: clamp(52px, 7vh, 64px);
      }

      .action-buttons {
        max-width: calc(100% - clamp(110px, 26vw, 140px));
        padding-right: 0.3rem;
      }

      .btn {
        padding: clamp(0.3rem, 0.8vw, 0.4rem) clamp(0.45rem, 1.2vw, 0.6rem);
        font-size: clamp(0.6rem, 1.2vw, 0.7rem);
        min-height: clamp(34px, 2.8vw, 38px);
        gap: 0.25rem;
      }

      .btn-primary:hover,
      .btn-secondary:hover {
        transform: translateY(-0.5px);
      }

      .social-icons {
        gap: clamp(0.25rem, 0.8vw, 0.5rem);
      }

      .social-icon span {
        height: clamp(40px, 10vw, 44px);
        width: clamp(40px, 10vw, 44px);
        font-size: clamp(14px, 4.2vw, 16px);
      }

      .pdf-canvas-container {
        padding: clamp(0.5rem, 1.5vw, 0.75rem);
        gap: clamp(0.5rem, 1.5vw, 0.75rem);
      }

      .pdf-page {
        border-radius: 6px;
      }

      .mobile-hint {
        font-size: clamp(0.55rem, 1vw, 0.65rem);
      }

      .loading-spinner {
        height: 140px;
      }

      .spinner {
        width: 28px;
        height: 28px;
        border: 3px solid #f3f3f3;
        border-top: 3px solid #3b82f6;
      }
    }

    @media (max-width: 360px) {
      .top-bar {
        min-height: clamp(48px, 6vh, 56px);
        padding: calc(0.4rem + var(--safe-top)) calc(0.4rem + var(--safe-right)) 0.4rem calc(0.4rem + var(--safe-left));
      }

      .action-buttons {
        max-width: calc(100% - 100px);
      }

      .btn {
        padding: 0.3rem 0.4rem;
        font-size: 0.6rem;
        min-height: 32px;
        gap: 0.2rem;
      }

      .btn .icon {
        font-size: 0.8em;
      }

      .social-icon span {
        height: 40px;
        width: 40px;
        font-size: 16px;
      }

      .pdf-canvas-container {
        padding: 0.4rem;
        gap: 0.4rem;
      }

      .mobile-hint {
        font-size: 0.55rem;
        padding: 0.25rem 0.5rem;
      }

      .empty h2 {
        font-size: 1rem;
      }

      .empty p {
        font-size: 0.8rem;
      }
    }

    @media (max-height: 600px) and (orientation: landscape) {
      .top-bar {
        min-height: clamp(48px, 10vh, 70px);
        padding: calc(0.5rem + var(--safe-top)) calc(0.75rem + var(--safe-right)) 0.5rem calc(0.75rem + var(--safe-left));
        gap: 0.5rem;
      }

      .action-buttons {
        max-width: calc(100% - clamp(120px, 25vw, 150px));
        gap: 0.4rem;
      }

      .btn {
        padding: 0.35rem 0.65rem;
        font-size: 0.7rem;
        min-height: 36px;
      }

      .social-icons {
        gap: clamp(0.3rem, 1vw, 0.5rem);
      }

      .social-icon span {
        height: 38px;
        width: 38px;
        font-size: 15px;
      }

      .pdf-canvas-container {
        padding: clamp(0.4rem, 1vw, 0.6rem);
        gap: clamp(0.4rem, 1vw, 0.6rem);
      }

      .mobile-hint {
        font-size: 0.6rem;
        bottom: calc(0.4rem + var(--safe-bottom));
      }
    }

    @media (max-height: 500px) and (orientation: landscape) {
      .top-bar {
        min-height: clamp(44px, 8vh, 56px);
        padding: calc(0.4rem + var(--safe-top)) calc(0.6rem + var(--safe-right)) 0.4rem calc(0.6rem + var(--safe-left));
      }

      .action-buttons {
        gap: 0.3rem;
      }

      .btn {
        padding: 0.3rem 0.5rem;
        font-size: 0.65rem;
        min-height: 32px;
      }

      .social-icon span {
        height: 36px;
        width: 36px;
        font-size: 14px;
      }

      .pdf-canvas-container {
        padding: 0.35rem;
        gap: 0.35rem;
      }

      .spinner {
        width: 24px;
        height: 24px;
        border: 2px solid #f3f3f3;
        border-top: 2px solid #3b82f6;
      }
    }

    @media (max-width: 640px) and (orientation: portrait) {
      .top-bar {
        min-height: clamp(54px, 8vh, 68px);
      }
    }

    /* Legacy appearance sync (mobile) */
    .top-bar {
      padding: 1rem;
    }

    .social-icons {
      gap: 2rem;
    }

    .social-icon span {
      height: 50px;
      width: 50px;
      font-size: 20px;
    }

    .action-buttons {
      gap: 1rem;
      max-width: none;
      overflow: visible;
      padding-right: 0;
      flex: 0 1 auto;
    }

    .btn {
      gap: 0.5rem;
      padding: 0.5rem 1rem;
      font-size: 0.875rem;
      min-height: auto;
    }

    .pdf-viewer-container {
      top: 90px;
    }

    .pdf-canvas-container {
      padding: 1rem;
      gap: 1rem;
    }

    .mobile-hint {
      bottom: 1rem;
      padding: 0.5rem 1rem;
      font-size: 0.75rem;
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
    }
  </style>
</head>
<body>
  <div class="top-bar">
    <div class="action-buttons">
      ${data.offersExists && data.pageType !== 'offers' ? `<a href="/offers" class="btn btn-secondary"><span>🎁</span>العروض</a>` : ''}
      ${data.suhoorExists && data.pageType !== 'suhoor' ? `<a href="/suhoor" class="btn btn-secondary"><span>🌙</span>منيو السحور</a>` : ''}
      <a href="/menu" class="btn btn-secondary">
        <span>🏠</span>
        المنيو الرئيسي
      </a>
    </div>
    <div class="social-icons">
      <div class="social-icon tiktok">
        <a href="https://www.tiktok.com/@fale7_1961" target="_blank">
          <span><i class="fab fa-tiktok"></i></span>
        </a>
      </div>
      <div class="social-icon facebook">
        <a href="https://www.facebook.com/profile.php?id=100063865183387" target="_blank">
          <span><i class="fab fa-facebook-f"></i></span>
        </a>
      </div>
      <div class="social-icon location">
        <a href="https://maps.app.goo.gl/K38LYo9oSC2Myd119" target="_blank">
          <span><i class="fas fa-map-marker-alt"></i></span>
        </a>
      </div>
    </div>
  </div>

  ${data.pageExists ? `
    <div class="pdf-viewer-container">
      <div class="pdf-canvas-container" id="pdfContainer">
        <div class="loading-spinner">
          <div class="spinner"></div>
          <p>جاري التحميل...</p>
        </div>
      </div>
    </div>
    <div class="mobile-hint">استخدم إصبعين للتكبير والتصغير</div>
    <script>
      pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      let pdfDoc = null;
      let renderToken = 0;
      let resizeTimer = null;

      function syncHeaderOffset() {
        const topBar = document.querySelector('.top-bar');
        if (!topBar) return;
        const height = Math.ceil(topBar.getBoundingClientRect().height);
        document.documentElement.style.setProperty('--header-offset', height + 'px');
      }

      async function renderAllPages() {
        const container = document.getElementById('pdfContainer');
        if (!container || !pdfDoc) return;

        const currentToken = ++renderToken;
        container.innerHTML = '';

        for (let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++) {
          if (currentToken !== renderToken) return;

          const page = await pdfDoc.getPage(pageNum);
          const scale = 1.5;
          const viewport = page.getViewport({ scale });

          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.className = 'pdf-page';
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({ canvasContext: context, viewport }).promise;

          if (currentToken !== renderToken) return;
          container.appendChild(canvas);
        }
      }

      async function loadPDF() {
        const container = document.getElementById('pdfContainer');
        try {
          pdfDoc = await pdfjsLib.getDocument('${data.pageUrl}').promise;
          await renderAllPages();
        } catch (e) {
          container.innerHTML = '<div class=\"empty\"><h2>تعذر تحميل الملف</h2><p>حاول مرة أخرى لاحقًا.</p></div>';
        }
      }

      function handleViewportChange() {
        syncHeaderOffset();
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          if (pdfDoc) {
            renderAllPages();
          }
        }, 150);
      }

      document.addEventListener('DOMContentLoaded', () => {
        syncHeaderOffset();
        loadPDF();
      });
      window.addEventListener('resize', handleViewportChange);
      window.addEventListener('orientationchange', handleViewportChange);
    </script>
  ` : `
    <div class="empty">
      <h2>${data.emptyTitle || 'هذه الصفحة غير متاحة الآن'}</h2>
      <p>${data.emptyText || 'يمكنك المتابعة لاحقاً.'}</p>
    </div>
  `}
</body>
</html>`;
  }


};
