module.exports = {
  // Ã¯Â¿Â½ÃÂ§Ã¯Â¿Â½ÃÂ¨ ÃÂªÃÂ³ÃÂ¬Ã¯Â¿Â½`Ã¯Â¿Â½ ÃÂ§Ã¯Â¿Â½ÃÂ¯ÃÂ®Ã¯Â¿Â½Ã¯Â¿Â½Ã¯Â¿Â½
  login: (data) => {
    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/png" href="/logo.png">
  <link rel="apple-touch-icon" href="/logo.png">
  <meta name="application-name" content="E79E A'D- #(H 'D9F(G">
  <meta name="robots" content="noindex, nofollow">
  
  <title>ÃÂªÃÂ³ÃÂ¬Ã¯Â¿Â½`Ã¯Â¿Â½ ÃÂ§Ã¯Â¿Â½ÃÂ¯ÃÂ®Ã¯Â¿Â½Ã¯Â¿Â½Ã¯Â¿Â½ | Ã¯Â¿Â½ ÃÂ¸ÃÂ§Ã¯Â¿Â½& ÃÂ¥ÃÂ¯ÃÂ§ÃÂ±ÃÂ© ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½&Ã¯Â¿Â½ Ã¯Â¿Â½`Ã¯Â¿Â½Ã¯Â¿Â½</title>
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
        <span class="icon">Ã¯Â¿Â½xÃ¯Â¿Â½</span>
        ÃÂªÃÂ³ÃÂ¬Ã¯Â¿Â½`Ã¯Â¿Â½ ÃÂ§Ã¯Â¿Â½ÃÂ¯ÃÂ®Ã¯Â¿Â½Ã¯Â¿Â½Ã¯Â¿Â½
      </h1>
      <p class="card-subtitle">Ã¯Â¿Â½ ÃÂ¸ÃÂ§Ã¯Â¿Â½& ÃÂ¥ÃÂ¯ÃÂ§ÃÂ±ÃÂ© ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½&Ã¯Â¿Â½ Ã¯Â¿Â½`Ã¯Â¿Â½Ã¯Â¿Â½</p>
    </div>
    <div class="card-content">
      ${data.error ? `
        <div class="alert alert-error">
          ${data.error}
        </div>
      ` : ''}
      
      <form method="POST">
        <div class="form-group">
          <label for="password" class="form-label">ÃâÃ¯Â¿Â½Ã¯Â¿Â½&ÃÂ© ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½&ÃÂ±Ã¯Â¿Â½Ã¯Â¿Â½ÃÂ±</label>
          <div class="password-container">
            <input 
              type="password" 
              id="password"
              name="password" 
              class="form-input"
              placeholder="ÃÂ£ÃÂ¯ÃÂ®Ã¯Â¿Â½ ÃâÃ¯Â¿Â½Ã¯Â¿Â½&ÃÂ© ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½&ÃÂ±Ã¯Â¿Â½Ã¯Â¿Â½ÃÂ±" 
              required 
              autocomplete="current-password"
            />
            <button type="button" class="toggle-password" id="togglePassword">
              <i class="fas fa-eye"></i>
            </button>
          </div>
        </div>
        
        <button type="submit" class="btn btn-primary">
          <span class="icon">Ã¯Â¿Â½xaÃ¯Â¿Â½</span>
          ÃÂ¯ÃÂ®Ã¯Â¿Â½Ã¯Â¿Â½Ã¯Â¿Â½
        </button>
      </form>
    </div>
  </div>
  
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const togglePassword = document.getElementById('togglePassword');
      const passwordInput = document.getElementById('password');
      
      togglePassword.addEventListener('click', function() {
        // ÃÂªÃÂ¨ÃÂ¯Ã¯Â¿Â½`Ã¯Â¿Â½ Ã¯Â¿Â½ Ã¯Â¿Â½Ã¯Â¿Â½ÃÂ¹ ÃÂ­Ã¯Â¿Â½Ã¯Â¿Â½ ÃâÃ¯Â¿Â½Ã¯Â¿Â½&ÃÂ© ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½&ÃÂ±Ã¯Â¿Â½Ã¯Â¿Â½ÃÂ±
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        // ÃÂªÃÂ¨ÃÂ¯Ã¯Â¿Â½`Ã¯Â¿Â½ ÃÂ§Ã¯Â¿Â½ÃÂ£Ã¯Â¿Â½`Ã¯Â¿Â½Ã¯Â¿Â½Ã¯Â¿Â½Ã¯Â¿Â½ ÃÂ©
        this.querySelector('i').classList.toggle('fa-eye');
        this.querySelector('i').classList.toggle('fa-eye-slash');
      });
    });
  </script>
</body>
</html>`;
  },

  // Ã¯Â¿Â½ÃÂ§Ã¯Â¿Â½ÃÂ¨ Ã¯Â¿Â½Ã¯Â¿Â½Ã¯Â¿Â½ÃÂ­ÃÂ© ÃÂ§Ã¯Â¿Â½ÃÂ¥ÃÂ¯ÃÂ§ÃÂ±ÃÂ©
  admin: () => {
    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" type="image/png" href="/logo.png">
  <link rel="apple-touch-icon" href="/logo.png">
  <meta name="application-name" content="E79E A'D- #(H 'D9F(G">
  <meta name="robots" content="noindex, nofollow">
  <title>Ã¯Â¿Â½Ã¯Â¿Â½Ã¯Â¿Â½ÃÂ­ÃÂ© ÃÂ§Ã¯Â¿Â½ÃÂªÃÂ­ÃâÃ¯Â¿Â½& | Ã¯Â¿Â½ ÃÂ¸ÃÂ§Ã¯Â¿Â½& ÃÂ¥ÃÂ¯ÃÂ§ÃÂ±ÃÂ© ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½&Ã¯Â¿Â½ Ã¯Â¿Â½`Ã¯Â¿Â½Ã¯Â¿Â½</title>
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
    <p id="loadingText">ÃÂ¬ÃÂ§ÃÂ±Ã¯Â¿Â½` ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½&ÃÂ¹ÃÂ§Ã¯Â¿Â½ÃÂ¬ÃÂ©...</p>
    <div class="progress-container">
        <div id="progressBar"></div>
    </div>
    <p id="progressPercentage">0%</p>
  </div>

  <div class="container">
    <div class="card">
      <div class="card-header">
        <h1 class="card-title">
          <span class="icon">Ã¯Â¿Â½a"Ã¯Â¸Â</span>
          Ã¯Â¿Â½Ã¯Â¿Â½Ã¯Â¿Â½ÃÂ­ÃÂ© ÃÂ§Ã¯Â¿Â½ÃÂªÃÂ­ÃâÃ¯Â¿Â½&
        </h1>
        <p class="card-subtitle">ÃÂ¥ÃÂ¯ÃÂ§ÃÂ±ÃÂ© Ã¯Â¿Â½&Ã¯Â¿Â½ Ã¯Â¿Â½`Ã¯Â¿Â½Ã¯Â¿Â½ ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½&ÃÂ·ÃÂ¹Ã¯Â¿Â½&</p>
      </div>
      <div class="card-content">
        <section class="upload-section">
          <h3 class="upload-section-title">ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½&Ã¯Â¿Â½ Ã¯Â¿Â½`Ã¯Â¿Â½Ã¯Â¿Â½ ÃÂ§Ã¯Â¿Â½ÃÂ±ÃÂ¦Ã¯Â¿Â½`ÃÂ³Ã¯Â¿Â½`</h3>
          <form class="upload-form" data-pathname="menu.pdf" data-label="ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½&Ã¯Â¿Â½ Ã¯Â¿Â½`Ã¯Â¿Â½Ã¯Â¿Â½ ÃÂ§Ã¯Â¿Â½ÃÂ±ÃÂ¦Ã¯Â¿Â½`ÃÂ³Ã¯Â¿Â½`">
            <div class="upload-area">
              <div class="upload-icon">Ã¯Â¿Â½x</div>
              <div class="upload-text">ÃÂ§ÃÂ³ÃÂ­ÃÂ¨ Ã¯Â¿Â½Ã¯Â¿Â½ÃÂ£ÃÂÃ¯Â¿Â½ÃÂª Ã¯Â¿Â½&Ã¯Â¿Â½ÃÂ PDF Ã¯Â¿Â½!Ã¯Â¿Â½ ÃÂ§</div>
              <div class="upload-hint">ÃÂ£Ã¯Â¿Â½Ã¯Â¿Â½ ÃÂ§Ã¯Â¿Â½ Ã¯Â¿Â½ÃÂ± Ã¯Â¿Â½Ã¯Â¿Â½ÃÂ§ÃÂ®ÃÂªÃ¯Â¿Â½`ÃÂ§ÃÂ± Ã¯Â¿Â½&Ã¯Â¿Â½  ÃÂ¬Ã¯Â¿Â½!ÃÂ§ÃÂ²Ãâ</div>
              <input type="file" name="menu" accept="application/pdf" required class="file-input" />
            </div>
            <div class="inline-actions">
              <button type="submit" class="btn btn-primary">
                <span class="icon">Ã¯Â¿Â½xÃ¯Â¿Â½</span>
                ÃÂ±ÃÂÃÂ¹ ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½&Ã¯Â¿Â½ Ã¯Â¿Â½`Ã¯Â¿Â½Ã¯Â¿Â½
              </button>
              <button type="button" class="btn btn-danger delete-page-btn" data-page-type="menu">
                <span class="icon">Ã¯Â¿Â½xÃ¯Â¸Â</span>
                ÃÂ­ÃÂ°ÃÂ ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½&Ã¯Â¿Â½ Ã¯Â¿Â½`Ã¯Â¿Â½Ã¯Â¿Â½
              </button>
            </div>
          </form>
        </section>

        <section class="upload-section">
          <h3 class="upload-section-title">ÃÂµÃÂÃÂ­ÃÂ© ÃÂ§Ã¯Â¿Â½ÃÂ¹ÃÂ±Ã¯Â¿Â½Ã¯Â¿Â½ÃÂ¶</h3>
          <form class="upload-form" data-pathname="offers.pdf" data-label="ÃÂµÃÂÃÂ­ÃÂ© ÃÂ§Ã¯Â¿Â½ÃÂ¹ÃÂ±Ã¯Â¿Â½Ã¯Â¿Â½ÃÂ¶">
            <div class="upload-area">
              <div class="upload-icon">Ã¯Â¿Â½x}Ã¯Â¿Â½</div>
              <div class="upload-text">ÃÂ§ÃÂ³ÃÂ­ÃÂ¨ Ã¯Â¿Â½Ã¯Â¿Â½ÃÂ£ÃÂÃ¯Â¿Â½ÃÂª Ã¯Â¿Â½&Ã¯Â¿Â½ÃÂ ÃÂ¹ÃÂ±Ã¯Â¿Â½Ã¯Â¿Â½ÃÂ¶ PDF Ã¯Â¿Â½!Ã¯Â¿Â½ ÃÂ§</div>
              <div class="upload-hint">ÃÂ£Ã¯Â¿Â½Ã¯Â¿Â½ ÃÂ§Ã¯Â¿Â½ Ã¯Â¿Â½ÃÂ± Ã¯Â¿Â½Ã¯Â¿Â½ÃÂ§ÃÂ®ÃÂªÃ¯Â¿Â½`ÃÂ§ÃÂ± Ã¯Â¿Â½&Ã¯Â¿Â½  ÃÂ¬Ã¯Â¿Â½!ÃÂ§ÃÂ²Ãâ</div>
              <input type="file" name="offers" accept="application/pdf" required class="file-input" />
            </div>
            <div class="inline-actions">
              <button type="submit" class="btn btn-primary">
                <span class="icon">Ã¯Â¿Â½xÃ¯Â¿Â½</span>
                Ã¯Â¿Â½ ÃÂ´ÃÂ± ÃÂ§Ã¯Â¿Â½ÃÂ¹ÃÂ±Ã¯Â¿Â½Ã¯Â¿Â½ÃÂ¶
              </button>
              <button type="button" class="btn btn-danger delete-page-btn" data-page-type="offers">
                <span class="icon">Ã¯Â¿Â½xÃ¯Â¸Â</span>
                ÃÂ­ÃÂ°ÃÂ ÃÂµÃÂÃÂ­ÃÂ© ÃÂ§Ã¯Â¿Â½ÃÂ¹ÃÂ±Ã¯Â¿Â½Ã¯Â¿Â½ÃÂ¶
              </button>
            </div>
          </form>
        </section>

        <section class="upload-section">
          <h3 class="upload-section-title">ÃÂµÃÂÃÂ­ÃÂ© Ã¯Â¿Â½&Ã¯Â¿Â½ Ã¯Â¿Â½`Ã¯Â¿Â½Ã¯Â¿Â½ ÃÂ§Ã¯Â¿Â½ÃÂ³ÃÂ­Ã¯Â¿Â½Ã¯Â¿Â½ÃÂ±</h3>
          <form class="upload-form" data-pathname="suhoor.pdf" data-label="Ã¯Â¿Â½&Ã¯Â¿Â½ Ã¯Â¿Â½`Ã¯Â¿Â½Ã¯Â¿Â½ ÃÂ§Ã¯Â¿Â½ÃÂ³ÃÂ­Ã¯Â¿Â½Ã¯Â¿Â½ÃÂ±">
            <div class="upload-area">
              <div class="upload-icon">Ã¯Â¿Â½xR"</div>
              <div class="upload-text">ÃÂ§ÃÂ³ÃÂ­ÃÂ¨ Ã¯Â¿Â½Ã¯Â¿Â½ÃÂ£ÃÂÃ¯Â¿Â½ÃÂª Ã¯Â¿Â½&Ã¯Â¿Â½ÃÂ ÃÂ³ÃÂ­Ã¯Â¿Â½Ã¯Â¿Â½ÃÂ± PDF Ã¯Â¿Â½!Ã¯Â¿Â½ ÃÂ§</div>
              <div class="upload-hint">ÃÂ£Ã¯Â¿Â½Ã¯Â¿Â½ ÃÂ§Ã¯Â¿Â½ Ã¯Â¿Â½ÃÂ± Ã¯Â¿Â½Ã¯Â¿Â½ÃÂ§ÃÂ®ÃÂªÃ¯Â¿Â½`ÃÂ§ÃÂ± Ã¯Â¿Â½&Ã¯Â¿Â½  ÃÂ¬Ã¯Â¿Â½!ÃÂ§ÃÂ²Ãâ</div>
              <input type="file" name="suhoor" accept="application/pdf" required class="file-input" />
            </div>
            <div class="inline-actions">
              <button type="submit" class="btn btn-primary">
                <span class="icon">Ã¯Â¿Â½xÃ¯Â¿Â½</span>
                Ã¯Â¿Â½ ÃÂ´ÃÂ± Ã¯Â¿Â½&Ã¯Â¿Â½ Ã¯Â¿Â½`Ã¯Â¿Â½Ã¯Â¿Â½ ÃÂ§Ã¯Â¿Â½ÃÂ³ÃÂ­Ã¯Â¿Â½Ã¯Â¿Â½ÃÂ±
              </button>
              <button type="button" class="btn btn-danger delete-page-btn" data-page-type="suhoor">
                <span class="icon">Ã¯Â¿Â½xÃ¯Â¸Â</span>
                ÃÂ­ÃÂ°ÃÂ ÃÂµÃÂÃÂ­ÃÂ© ÃÂ§Ã¯Â¿Â½ÃÂ³ÃÂ­Ã¯Â¿Â½Ã¯Â¿Â½ÃÂ±
              </button>
            </div>
          </form>
        </section>
        
        <div class="actions">
          <a href="/menu" target="_blank" class="btn btn-secondary">
            <span class="icon">Ã¯Â¿Â½x9</span>
            ÃÂµÃÂÃÂ­ÃÂ© ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½&ÃÂ³ÃÂªÃÂ®ÃÂ¯Ã¯Â¿Â½&
          </a>
        </div>
        
        <a href="/logout" class="btn btn-secondary">
          <span class="icon">Ã¯Â¿Â½xaÃ¯Â¿Â½</span>
          ÃÂªÃÂ³ÃÂ¬Ã¯Â¿Â½`Ã¯Â¿Â½ ÃÂ§Ã¯Â¿Â½ÃÂ®ÃÂ±Ã¯Â¿Â½Ã¯Â¿Â½ÃÂ¬
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
            uploadHint.textContent = 'ÃÂ­ÃÂ¬Ã¯Â¿Â½& ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½&Ã¯Â¿Â½ÃÂ: ' + fileSize;
          }
        });

        form.addEventListener('submit', async (e) => {
          e.preventDefault();

          if (!fileInput.files || fileInput.files.length === 0) {
            alert('ÃÂ§Ã¯Â¿Â½ÃÂ±ÃÂ¬ÃÂ§ÃÂ¡ ÃÂ§ÃÂ®ÃÂªÃ¯Â¿Â½`ÃÂ§ÃÂ± Ã¯Â¿Â½&Ã¯Â¿Â½ÃÂ ÃÂ£Ã¯Â¿Â½Ã¯Â¿Â½Ã¯Â¿Â½ÃÂ§Ã¯Â¿Â½9.');
            return;
          }

          const file = fileInput.files[0];
          if (file.type !== 'application/pdf') {
            alert('Ã¯Â¿Â½`ÃÂ±ÃÂ¬Ã¯Â¿Â½0 ÃÂ±ÃÂÃÂ¹ Ã¯Â¿Â½&Ã¯Â¿Â½ÃÂ PDF ÃÂÃ¯Â¿Â½ÃÂ·.');
            return;
          }

          loadingText.innerText = 'ÃÂ¬ÃÂ§ÃÂ±Ã¯Â¿Â½` ÃÂ±ÃÂÃÂ¹ ' + label + '...';
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
              throw new Error('Ã¯Â¿Â½Ã¯Â¿Â½& Ã¯Â¿Â½`ÃÂªÃ¯Â¿Â½& ÃÂ§ÃÂ³ÃÂªÃ¯Â¿Â½ÃÂ§Ã¯Â¿Â½& ÃÂ±ÃÂ§ÃÂ¨ÃÂ· ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½&Ã¯Â¿Â½ÃÂ ÃÂ¨ÃÂ¹ÃÂ¯ ÃÂ§Ã¯Â¿Â½ÃÂ±ÃÂÃÂ¹.');
            }

            progressBar.style.width = '100%';
            progressPercentage.innerText = '100%';
            loadingText.innerText = 'ÃÂ§ÃâÃÂªÃ¯Â¿Â½&Ã¯Â¿Â½ ÃÂ¨Ã¯Â¿Â½ ÃÂ¬ÃÂ§ÃÂ­!';
            setTimeout(() => window.location.reload(), 1000);
          } catch (error) {
            console.error('Upload error:', error);
            const errorMessage = error?.message || 'ÃÂ­ÃÂ¯ÃÂ« ÃÂ®ÃÂ·ÃÂ£ ÃÂ£ÃÂ«Ã¯Â¿Â½ ÃÂ§ÃÂ¡ ÃÂ±ÃÂÃÂ¹ ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½&Ã¯Â¿Â½ÃÂ.';
            if (errorMessage.includes('retrieve the client token') || errorMessage.includes('Unauthorized')) {
              alert('ÃÂ§Ã¯Â¿Â½ ÃÂªÃ¯Â¿Â½!ÃÂª ÃÂ¬Ã¯Â¿Â½ÃÂ³ÃÂ© ÃÂªÃÂ³ÃÂ¬Ã¯Â¿Â½`Ã¯Â¿Â½ ÃÂ§Ã¯Â¿Â½ÃÂ¯ÃÂ®Ã¯Â¿Â½Ã¯Â¿Â½Ã¯Â¿Â½. ÃÂ³ÃÂ¬Ã¯Â¿Â½ ÃÂ§Ã¯Â¿Â½ÃÂ¯ÃÂ®Ã¯Â¿Â½Ã¯Â¿Â½Ã¯Â¿Â½ Ã¯Â¿Â½&ÃÂ±ÃÂ© ÃÂ£ÃÂ®ÃÂ±Ã¯Â¿Â½0.');
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
          const confirmed = window.confirm('Ã¯Â¿Â½!Ã¯Â¿Â½ ÃÂ£Ã¯Â¿Â½ ÃÂª Ã¯Â¿Â½&ÃÂªÃÂ£ÃâÃÂ¯ Ã¯Â¿Â½&Ã¯Â¿Â½  ÃÂ­ÃÂ°ÃÂ Ã¯Â¿Â½!ÃÂ°Ã¯Â¿Â½! ÃÂ§Ã¯Â¿Â½ÃÂµÃÂÃÂ­ÃÂ©Ã¯Â¿Â½x');
          if (!confirmed) return;

          try {
            loadingOverlay.style.display = 'flex';
            loadingText.innerText = 'ÃÂ¬ÃÂ§ÃÂ±Ã¯Â¿Â½` ÃÂ­ÃÂ°ÃÂ ÃÂ§Ã¯Â¿Â½ÃÂµÃÂÃÂ­ÃÂ©...';
            progressBar.style.width = '30%';
            progressPercentage.innerText = '30%';

            const response = await fetch('/delete-page', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ pageType }),
            });

            const data = await response.json();
            if (!response.ok || !data.success) {
              throw new Error(data.message || 'ÃÂ­ÃÂ¯ÃÂ« ÃÂ®ÃÂ·ÃÂ£ ÃÂ£ÃÂ«Ã¯Â¿Â½ ÃÂ§ÃÂ¡ ÃÂ§Ã¯Â¿Â½ÃÂ­ÃÂ°ÃÂ.');
            }

            progressBar.style.width = '100%';
            progressPercentage.innerText = '100%';
            loadingText.innerText = 'ÃÂªÃ¯Â¿Â½& ÃÂ§Ã¯Â¿Â½ÃÂ­ÃÂ°ÃÂ ÃÂ¨Ã¯Â¿Â½ ÃÂ¬ÃÂ§ÃÂ­!';
            setTimeout(() => window.location.reload(), 800);
          } catch (error) {
            alert(error.message || 'ÃÂÃÂ´Ã¯Â¿Â½ ÃÂ­ÃÂ°ÃÂ ÃÂ§Ã¯Â¿Â½ÃÂµÃÂÃÂ­ÃÂ©.');
            loadingOverlay.style.display = 'none';
          }
        });
      });
    });
  </script>
</body>
</html>`;
  },

  // Ã¯Â¿Â½ÃÂ§Ã¯Â¿Â½ÃÂ¨ ÃÂµÃÂÃÂ­ÃÂ© ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½&Ã¯Â¿Â½ Ã¯Â¿Â½`Ã¯Â¿Â½Ã¯Â¿Â½
  menu: (data) => {
    const canonicalUrl = data.canonicalUrl || 'https://fale7-res.vercel.app/';
    const indexable = data.indexable !== false;
    const robotsContent = indexable
      ? 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
      : 'noindex, follow';

    const metaTitle = 'ÃÂÃÂ§Ã¯Â¿Â½ÃÂ­ ÃÂ£ÃÂ¨Ã¯Â¿Â½Ã¯Â¿Â½ ÃÂ§Ã¯Â¿Â½ÃÂ¹Ã¯Â¿Â½ ÃÂ¨Ã¯Â¿Â½! | Ã¯Â¿Â½&Ã¯Â¿Â½ Ã¯Â¿Â½`Ã¯Â¿Â½Ã¯Â¿Â½ ÃÂ³Ã¯Â¿Â½ ÃÂ¯Ã¯Â¿Â½Ã¯Â¿Â½ÃÂªÃÂ´ÃÂ§ÃÂª Ã¯Â¿Â½Ã¯Â¿Â½Ã¯Â¿Â½&ÃÂ´ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½Ã¯Â¿Â½` ÃÂ¹ÃÂ±ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½`ÃÂ© ÃÂÃ¯Â¿Â½` 6 ÃÂ£ÃâÃÂªÃ¯Â¿Â½Ã¯Â¿Â½ÃÂ¨ÃÂ±';
    const metaDescription =
      'Ã¯Â¿Â½&ÃÂ·ÃÂ¹Ã¯Â¿Â½& ÃÂÃÂ§Ã¯Â¿Â½ÃÂ­ ÃÂ£ÃÂ¨Ã¯Â¿Â½Ã¯Â¿Â½ ÃÂ§Ã¯Â¿Â½ÃÂ¹Ã¯Â¿Â½ ÃÂ¨Ã¯Â¿Â½! (Fale7) ÃÂÃ¯Â¿Â½` ÃÂ§Ã¯Â¿Â½ÃÂ¬Ã¯Â¿Â½`ÃÂ²ÃÂ© Ã¯Â¿Â½ 6 ÃÂ£ÃâÃÂªÃ¯Â¿Â½Ã¯Â¿Â½ÃÂ¨ÃÂ± Ã¯Â¿Â½ ÃÂ§Ã¯Â¿Â½ÃÂ­Ã¯Â¿Â½` ÃÂ§Ã¯Â¿Â½ÃÂ³ÃÂ§ÃÂ¨ÃÂ¹ Ã¯Â¿Â½ ÃÂ´ÃÂ§ÃÂ±ÃÂ¹ Ã¯Â¿Â½&ÃâÃÂ© ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½&ÃâÃÂ±Ã¯Â¿Â½&ÃÂ© Ã¯Â¿Â½ ÃÂ¨ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½ÃÂ±ÃÂ¨ Ã¯Â¿Â½&Ã¯Â¿Â½  ÃÂ³Ã¯Â¿Â½ ÃÂªÃÂ± ÃÂ§Ã¯Â¿Â½ÃÂ£ÃÂ±ÃÂ¯Ã¯Â¿Â½ Ã¯Â¿Â½`ÃÂ©. Ã¯Â¿Â½&Ã¯Â¿Â½ Ã¯Â¿Â½`Ã¯Â¿Â½Ã¯Â¿Â½ ÃÂ³Ã¯Â¿Â½ ÃÂ¯Ã¯Â¿Â½Ã¯Â¿Â½ÃÂªÃÂ´ÃÂ§ÃÂª Ã¯Â¿Â½Ã¯Â¿Â½Ã¯Â¿Â½&ÃÂ´ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½Ã¯Â¿Â½` ÃÂ¹ÃÂ±ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½`ÃÂ© Ã¯Â¿Â½Ã¯Â¿Â½ÃÂ¨ÃÂ·ÃÂ§ÃÂ·ÃÂ³ Ã¯Â¿Â½Ã¯Â¿Â½ÃÂÃ¯Â¿Â½ÃÂ§ÃÂÃ¯Â¿Â½. ÃÂ§ÃÂªÃÂµÃ¯Â¿Â½: 01000602832 / 01144741115. Ã¯Â¿Â½Ã¯Â¿Â½ÃÂ´ÃâÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½Ã¯Â¿Â½0: 01112595678.';
    const metaKeywords =
      'ÃÂÃÂ§Ã¯Â¿Â½ÃÂ­, ÃÂÃÂ§Ã¯Â¿Â½ÃÂ­ ÃÂ§ÃÂ¨Ã¯Â¿Â½Ã¯Â¿Â½ ÃÂ§Ã¯Â¿Â½ÃÂ¹Ã¯Â¿Â½ ÃÂ¨Ã¯Â¿Â½!, Ã¯Â¿Â½&ÃÂ·ÃÂ¹Ã¯Â¿Â½& ÃÂÃÂ§Ã¯Â¿Â½ÃÂ­, Ã¯Â¿Â½&ÃÂ·ÃÂ¹Ã¯Â¿Â½& ÃÂÃÂ§Ã¯Â¿Â½ÃÂ­ ÃÂ§ÃÂ¨Ã¯Â¿Â½Ã¯Â¿Â½ ÃÂ§Ã¯Â¿Â½ÃÂ¹Ã¯Â¿Â½ ÃÂ¨Ã¯Â¿Â½!, Ã¯Â¿Â½&Ã¯Â¿Â½ Ã¯Â¿Â½`Ã¯Â¿Â½Ã¯Â¿Â½ ÃÂÃÂ§Ã¯Â¿Â½ÃÂ­, Ã¯Â¿Â½&Ã¯Â¿Â½ Ã¯Â¿Â½`Ã¯Â¿Â½Ã¯Â¿Â½ Ã¯Â¿Â½&ÃÂ·ÃÂ¹Ã¯Â¿Â½& ÃÂÃÂ§Ã¯Â¿Â½ÃÂ­, Ã¯Â¿Â½&Ã¯Â¿Â½ Ã¯Â¿Â½`Ã¯Â¿Â½Ã¯Â¿Â½ ÃÂÃÂ§Ã¯Â¿Â½ÃÂ­ ÃÂ§ÃÂ¨Ã¯Â¿Â½Ã¯Â¿Â½ ÃÂ§Ã¯Â¿Â½ÃÂ¹Ã¯Â¿Â½ ÃÂ¨Ã¯Â¿Â½!, Ã¯Â¿Â½&Ã¯Â¿Â½ Ã¯Â¿Â½`Ã¯Â¿Â½Ã¯Â¿Â½ Ã¯Â¿Â½&ÃÂ·ÃÂ¹Ã¯Â¿Â½& ÃÂÃÂ§Ã¯Â¿Â½ÃÂ­ ÃÂ§ÃÂ¨Ã¯Â¿Â½Ã¯Â¿Â½ ÃÂ§Ã¯Â¿Â½ÃÂ¹Ã¯Â¿Â½ ÃÂ¨Ã¯Â¿Â½!, ÃÂ³Ã¯Â¿Â½ ÃÂ¯Ã¯Â¿Â½Ã¯Â¿Â½ÃÂªÃÂ´ÃÂ§ÃÂª 6 ÃÂ§ÃâÃÂªÃ¯Â¿Â½Ã¯Â¿Â½ÃÂ¨ÃÂ±, Ã¯Â¿Â½&ÃÂ´ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½Ã¯Â¿Â½` 6 ÃÂ§ÃâÃÂªÃ¯Â¿Â½Ã¯Â¿Â½ÃÂ¨ÃÂ±, ÃÂ¨ÃÂ·ÃÂ§ÃÂ·ÃÂ³ 6 ÃÂ§ÃâÃÂªÃ¯Â¿Â½Ã¯Â¿Â½ÃÂ¨ÃÂ±, ÃÂÃ¯Â¿Â½ÃÂ§ÃÂÃ¯Â¿Â½ 6 ÃÂ§ÃâÃÂªÃ¯Â¿Â½Ã¯Â¿Â½ÃÂ¨ÃÂ±, ÃÂ§ÃâÃ¯Â¿Â½ÃÂ§ÃÂª ÃÂ¹ÃÂ±ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½`ÃÂ©, Ã¯Â¿Â½&ÃÂ´ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½Ã¯Â¿Â½` ÃÂ¹ÃÂ±ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½`ÃÂ©, ÃÂÃ¯Â¿Â½ÃÂ§ÃÂÃ¯Â¿Â½ ÃÂ¹ÃÂ±ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½`ÃÂ©, ÃÂ§ÃÂÃÂ¶Ã¯Â¿Â½ Ã¯Â¿Â½&ÃÂ·ÃÂ¹Ã¯Â¿Â½& ÃÂÃ¯Â¿Â½` 6 ÃÂ§ÃâÃÂªÃ¯Â¿Â½Ã¯Â¿Â½ÃÂ¨ÃÂ±, ÃÂ§ÃÂÃÂ¶Ã¯Â¿Â½ ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½&ÃÂ·ÃÂ§ÃÂ¹Ã¯Â¿Â½& ÃÂÃ¯Â¿Â½` 6 ÃÂ§ÃâÃÂªÃ¯Â¿Â½Ã¯Â¿Â½ÃÂ¨ÃÂ±, Ã¯Â¿Â½&ÃÂ·ÃÂ¹Ã¯Â¿Â½& ÃÂ¹ÃÂ±ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½` ÃÂÃ¯Â¿Â½` Ã¯Â¿Â½&ÃÂµÃÂ±, Ã¯Â¿Â½&ÃÂ·ÃÂ¹Ã¯Â¿Â½& ÃÂ¹ÃÂ±ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½` ÃÂÃ¯Â¿Â½` 6 ÃÂ§ÃâÃÂªÃ¯Â¿Â½Ã¯Â¿Â½ÃÂ¨ÃÂ±';

    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5, user-scalable=yes">
  <link rel="icon" type="image/png" href="/logo.png">
  <link rel="apple-touch-icon" href="/logo.png">
  <meta name="application-name" content="E79E A'D- #(H 'D9F(G">
  <meta name="description" content="${metaDescription}">
  <meta name="keywords" content="${metaKeywords}">

  <meta property="og:title" content="${metaTitle}">
  <meta property="og:description" content="${metaDescription}">
  <meta property="og:url" content="${canonicalUrl}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="ar_EG">
  <meta property="og:site_name" content="ÙØ·Ø¹Ù ÙØ§ÙØ­ Ø£Ø¨Ù Ø§ÙØ¹ÙØ¨Ù">
  <meta property="og:image" content="https://fale7-res.vercel.app/logo.png">

  <meta name="robots" content="${robotsContent}">

  <title>${metaTitle}</title>
  <link rel="canonical" href="${canonicalUrl}">
  <meta name="language" content="ar">
  <meta name="geo.country" content="EG">
  <meta name="geo.region" content="EG-GZ">
  <meta name="geo.placename" content="6 ÃÂ£ÃâÃÂªÃ¯Â¿Â½Ã¯Â¿Â½ÃÂ¨ÃÂ±, ÃÂ§Ã¯Â¿Â½ÃÂ¬Ã¯Â¿Â½`ÃÂ²ÃÂ©">
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
    "name": "ÃÂÃÂ§Ã¯Â¿Â½ÃÂ­ ÃÂ£ÃÂ¨Ã¯Â¿Â½Ã¯Â¿Â½ ÃÂ§Ã¯Â¿Â½ÃÂ¹Ã¯Â¿Â½ ÃÂ¨Ã¯Â¿Â½!",
    "alternateName": "Fale7",
    "logo": "https://fale7-res.vercel.app/logo.png",
    "image": "https://fale7-res.vercel.app/logo.png",
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
      "addressRegion": "Ã¯Â¿Â½&ÃÂ­ÃÂ§ÃÂÃÂ¸ÃÂ© ÃÂ§Ã¯Â¿Â½ÃÂ¬Ã¯Â¿Â½`ÃÂ²ÃÂ©",
      "addressLocality": "6 ÃÂ£ÃâÃÂªÃ¯Â¿Â½Ã¯Â¿Â½ÃÂ¨ÃÂ±",
      "streetAddress": "ÃÂ§Ã¯Â¿Â½ÃÂ­Ã¯Â¿Â½` ÃÂ§Ã¯Â¿Â½ÃÂ³ÃÂ§ÃÂ¨ÃÂ¹ - ÃÂ´ÃÂ§ÃÂ±ÃÂ¹ Ã¯Â¿Â½&ÃâÃÂ© ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½&ÃâÃÂ±Ã¯Â¿Â½&ÃÂ© - ÃÂ¨ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½ÃÂ±ÃÂ¨ Ã¯Â¿Â½&Ã¯Â¿Â½  ÃÂ³Ã¯Â¿Â½ ÃÂªÃÂ± ÃÂ§Ã¯Â¿Â½ÃÂ£ÃÂ±ÃÂ¯Ã¯Â¿Â½ Ã¯Â¿Â½`ÃÂ©"
    },
    "areaServed": ["EG"],
    "openingHoursSpecification": [{
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": ["Saturday","Sunday","Monday","Tuesday","Wednesday","Thursday","Friday"],
      "opens": "07:00",
      "closes": "03:00"
    }],
    "servesCuisine": ["ÃÂ¹ÃÂ±ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½`", "Ã¯Â¿Â½&ÃÂ´ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½Ã¯Â¿Â½`", "ÃÂ³Ã¯Â¿Â½ ÃÂ¯Ã¯Â¿Â½Ã¯Â¿Â½ÃÂªÃÂ´ÃÂ§ÃÂª", "ÃÂÃ¯Â¿Â½ÃÂ§ÃÂÃ¯Â¿Â½"],
    "hasMap": "https://maps.app.goo.gl/K38LYo9oSC2Myd119",
    "menu": "https://fale7-res.vercel.app/",
    "sameAs": [
      "https://www.tiktok.com/@fale7_1961",
      "https://www.facebook.com/profile.php?id=100063865183387",
      "https://maps.app.goo.gl/K38LYo9oSC2Myd119"
    ]
  }
  </script>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "E79E A'D- #(H 'D9F(G",
    "url": "https://fale7-res.vercel.app/",
    "logo": "https://fale7-res.vercel.app/logo.png"
  }
  </script>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ÙØ·Ø¹Ù ÙØ§ÙØ­ Ø£Ø¨Ù Ø§ÙØ¹ÙØ¨Ù",
    "alternateName": ["Fale7"],
    "url": "https://fale7-res.vercel.app/",
    "inLanguage": "ar-EG",
    "publisher": {
      "@type": "Organization",
      "name": "ÙØ·Ø¹Ù ÙØ§ÙØ­ Ø£Ø¨Ù Ø§ÙØ¹ÙØ¨Ù",
      "url": "https://fale7-res.vercel.app/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://fale7-res.vercel.app/logo.png"
      }
    }
  }
  </script>

  <style>
    :root{
      --foreground: 0 0% 3.9%;
      --border: 0 0% 89.8%;
      --radius: 0.5rem;
      --safe-top: env(safe-area-inset-top);
      --safe-right: env(safe-area-inset-right);
      --safe-bottom: env(safe-area-inset-bottom);
      --safe-left: env(safe-area-inset-left);
      --header-offset: 0px;
      --page-max: 860px;
    }

    *{ box-sizing:border-box; }
    html{ text-size-adjust:100%; -webkit-text-size-adjust:100%; }

    body, html{
      margin:0; padding:0;
      height:100%;
      min-height:100dvh;
      background: linear-gradient(135deg, hsl(210 40% 98%) 0%, hsl(210 40% 95%) 100%);
      font-family:'Inter', Arial, Helvetica, sans-serif;
      color:hsl(var(--foreground));
      overflow:hidden;
      overscroll-behavior:none;
    }

    .top-bar{
      position:fixed;
      top:0; left:0; right:0;
      z-index:30;
      background: rgba(255,255,255,0.95);
      backdrop-filter: blur(10px);
      border-bottom:1px solid rgba(0,0,0,0.1);
      padding: calc(clamp(0.4rem, 1.2vw, 0.75rem) + min(var(--safe-top), 12px))
        calc(clamp(0.55rem, 2vw, 1rem) + var(--safe-right))
        clamp(0.4rem, 1.2vw, 0.75rem)
        calc(clamp(0.55rem, 2vw, 1rem) + var(--safe-left));
      display:flex;
      justify-content:space-between;
      align-items:center;
      gap:clamp(0.3rem, 1vw, 0.75rem);
      direction:rtl;
      flex-wrap:nowrap;
    }

    .action-buttons{
      display:flex;
      gap:clamp(0.25rem, 0.8vw, 0.5rem);
      overflow-x:auto;
      -webkit-overflow-scrolling:touch;
      scrollbar-width:none;
      flex:1 1 auto;
      min-width:0;
      padding-right:0;
    }
    .action-buttons::-webkit-scrollbar{ display:none; }

    .btn{
      display:flex;
      align-items:center;
      justify-content:center;
      gap:clamp(0.2rem, 0.7vw, 0.35rem);
      padding:clamp(0.3rem, 0.9vw, 0.45rem) clamp(0.5rem, 1.8vw, 0.85rem);
      border-radius: calc(var(--radius) - 2px);
      font-size:clamp(0.68rem, 1.8vw, 0.8rem);
      line-height:1.15;
      min-height:36px;
      font-weight:600;
      text-decoration:none;
      transition: all 0.2s;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.10), 0 2px 4px -1px rgba(0,0,0,0.06);
      white-space:nowrap;
      border:none;
      cursor:pointer;
      flex:0 0 auto;
    }
    .btn-secondary{
      background:#fff;
      color:#3b82f6;
      border:1px solid #3b82f6;
    }
    .btn-secondary:hover{ background:rgba(59,130,246,0.06); transform: translateY(-1px); }

    .social-icons{
      display:flex;
      gap:clamp(0.28rem, 1vw, 0.6rem);
      flex:0 0 auto;
    }
    .social-icon a{
      text-decoration:none;
      color:inherit;
      display:block;
      line-height:0;
    }
    .social-icon span{
      display:flex;
      align-items:center;
      justify-content:center;
      height:clamp(36px, 6vw, 44px);
      width:clamp(36px, 6vw, 44px);
      background:#fff;
      border-radius:50%;
      box-shadow:0 4px 12px rgba(0,0,0,0.12);
      transition:all 0.25s ease;
      font-size:clamp(14px, 2.5vw, 18px);
      color:#666;
    }
    .social-icon.tiktok:hover span{ background:#000; color:#fff; transform:translateY(-2px); }
    .social-icon.facebook:hover span{ background:#3b5998; color:#fff; transform:translateY(-2px); }
    .social-icon.location:hover span{ background:#34b7f1; color:#fff; transform:translateY(-2px); }

    .pdf-viewer-container{
      position:fixed;
      top: var(--header-offset);
      left:0; right:0; bottom:0;
      background:#fff;
      border-radius: 20px 20px 0 0;
      box-shadow: 0 -4px 20px rgba(0,0,0,0.10);
      overflow:hidden;
      display:flex;
      flex-direction:column;
    }
    .pdf-viewer-container.pdf-wrap{
      min-height:520px;
    }

    .pdf-canvas-container{
      position:relative;
      flex:1;
      overflow:auto;
      padding: 0.55rem;
    }

    .page-loader{
      position:absolute;
      inset:0;
      display:flex;
      align-items:center;
      justify-content:center;
      flex-direction:column;
      gap:0.75rem;
      background: rgba(255,255,255,0.92);
      backdrop-filter: blur(6px);
      z-index:5;
      padding:1rem;
      text-align:center;
    }
    .spinner{
      width:36px; height:36px;
      border:4px solid #f3f3f3;
      border-top:4px solid #3b82f6;
      border-radius:50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin{ 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }

    #pdfPages{
      width:100%;
      display:flex;
      flex-direction:column;
      align-items:center;
      gap:0.7rem;
    }

    .pdf-page{
      width: min(100%, var(--page-max));
      height:auto;
      border-radius:8px;
      box-shadow:0 4px 12px rgba(0,0,0,0.10);
      display:block;
    }

    .seo-section{
      width:100%;
      max-width:860px;
      margin: 0.5rem auto 0.9rem;
      padding: 0.65rem 0.7rem;
      background:#fff;
      border:1px solid rgba(0,0,0,0.08);
      border-radius:12px;
      font-size: 0.74rem;
      line-height:1.55;
      color:#475569;
    }
    .seo-section h2{
      margin:0 0 0.4rem;
      font-size:0.85rem;
      color:#334155;
    }
    .seo-section p{
      margin: 0 0 0.35rem;
    }
    .seo-section p:last-child{
      margin-bottom:0;
    }
    .seo-desc{
      font-size:12px;
      line-height:1.5;
      margin-top:6px;
      padding:0.55rem 0.6rem;
    }

    @media (max-width: 420px){
      .seo-section{ font-size:0.70rem; padding:0.6rem 0.65rem; }
      .seo-section h2{ font-size:0.82rem; }
      .seo-section p{ margin-bottom:0.3rem; }
      .seo-desc{ font-size:11px; line-height:1.45; }
    }
    @media (max-width: 360px){
      .seo-desc{ font-size:10px; }
    }

    .mobile-hint{
      position:fixed;
      bottom: calc(0.75rem + var(--safe-bottom));
      left:50%;
      transform:translateX(-50%);
      z-index:20;
      background: rgba(0,0,0,0.7);
      color:#fff;
      padding:0.45rem 0.85rem;
      border-radius:20px;
      font-size:0.72rem;
      backdrop-filter: blur(10px);
      white-space:nowrap;
    }
    @media (min-width:768px){ .mobile-hint{ display:none; } }

    @media (max-width:640px){
      .top-bar{
        padding: calc(0.34rem + min(var(--safe-top), 8px))
          calc(0.5rem + var(--safe-right))
          0.34rem
          calc(0.5rem + var(--safe-left));
        gap:0.32rem;
      }
      .social-icons{ gap:0.28rem; }
      .social-icon span{
        height:36px;
        width:36px;
        font-size:14px;
      }
      .action-buttons{
        gap:0.3rem;
        padding-right:0;
      }
      .btn{
        gap:0.2rem;
        padding:0.3rem 0.5rem;
        font-size:0.67rem;
        line-height:1.15;
        min-height:34px;
        max-width:112px;
        overflow:hidden;
        text-overflow:ellipsis;
      }
    }

    @media (max-width:380px){
      .top-bar{
        padding: calc(0.3rem + min(var(--safe-top), 6px))
          calc(0.44rem + var(--safe-right))
          0.3rem
          calc(0.44rem + var(--safe-left));
      }
      .social-icons{ gap:0.24rem; }
      .social-icon span{
        height:34px;
        width:34px;
        font-size:13px;
      }
      .btn{
        padding:0.27rem 0.42rem;
        font-size:0.64rem;
        min-height:32px;
        max-width:102px;
      }
    }

    .no-menu{
      display:flex;
      justify-content:center;
      align-items:center;
      min-height:100dvh;
      flex-direction:column;
      text-align:center;
      padding:2rem;
    }
    .no-menu-icon{ font-size:3.5rem; color:#94a3b8; margin-bottom:1rem; }
    .no-menu-title{ font-size:1.3rem; font-weight:700; color:#1e293b; margin:0 0 0.5rem; }
    .no-menu-text{ color:#64748b; max-width:420px; margin:0; }
  </style>
</head>

<body>
  ${
    data.menuExists
      ? `
  <div class="top-bar">
    <div class="action-buttons">
      ${data.offersExists ? `<a href="/offers" class="btn btn-secondary"><span>Ã¯Â¿Â½x}Ã¯Â¿Â½</span>ÃÂ§Ã¯Â¿Â½ÃÂ¹ÃÂ±Ã¯Â¿Â½Ã¯Â¿Â½ÃÂ¶</a>` : ''}
      ${data.suhoorExists ? `<a href="/suhoor" class="btn btn-secondary"><span>Ã¯Â¿Â½xR"</span>Ã¯Â¿Â½&Ã¯Â¿Â½ Ã¯Â¿Â½`Ã¯Â¿Â½Ã¯Â¿Â½ ÃÂ§Ã¯Â¿Â½ÃÂ³ÃÂ­Ã¯Â¿Â½Ã¯Â¿Â½ÃÂ±</a>` : ''}
    </div>
    <div class="social-icons">
      <div class="social-icon tiktok"><a href="https://www.tiktok.com/@fale7_1961" target="_blank" rel="noopener"><span><i class="fab fa-tiktok"></i></span></a></div>
      <div class="social-icon facebook"><a href="https://www.facebook.com/profile.php?id=100063865183387" target="_blank" rel="noopener"><span><i class="fab fa-facebook-f"></i></span></a></div>
      <div class="social-icon location"><a href="https://maps.app.goo.gl/K38LYo9oSC2Myd119" target="_blank" rel="noopener"><span><i class="fas fa-map-marker-alt"></i></span></a></div>
    </div>
  </div>

  <div class="pdf-viewer-container pdf-wrap">
    <div class="pdf-canvas-container" id="pdfContainer">
      <div class="page-loader" id="pageLoader">
        <div class="spinner"></div>
        <div>ÃÂ¬ÃÂ§ÃÂ±Ã¯Â¿Â½` ÃÂªÃÂ­Ã¯Â¿Â½&Ã¯Â¿Â½`Ã¯Â¿Â½ ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½&Ã¯Â¿Â½ Ã¯Â¿Â½`Ã¯Â¿Â½Ã¯Â¿Â½...</div>
      </div>

      <div id="pdfPages"></div>

      <section class="seo-section seo-desc" id="seoText" aria-label="Ã¯Â¿Â½&ÃÂ¹Ã¯Â¿Â½Ã¯Â¿Â½Ã¯Â¿Â½Ã¯Â¿Â½&ÃÂ§ÃÂª ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½&ÃÂ·ÃÂ¹Ã¯Â¿Â½&">
        <h2>Ã¯Â¿Â½&ÃÂ¹Ã¯Â¿Â½Ã¯Â¿Â½Ã¯Â¿Â½Ã¯Â¿Â½&ÃÂ§ÃÂª ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½&ÃÂ·ÃÂ¹Ã¯Â¿Â½&</h2>
        <p>Ã¯Â¿Â½&ÃÂ·ÃÂ¹Ã¯Â¿Â½& ÃÂÃÂ§Ã¯Â¿Â½ÃÂ­ ÃÂ£ÃÂ¨Ã¯Â¿Â½Ã¯Â¿Â½ ÃÂ§Ã¯Â¿Â½ÃÂ¹Ã¯Â¿Â½ ÃÂ¨Ã¯Â¿Â½! (Fale7) Ã¯Â¿Â½!Ã¯Â¿Â½Ã¯Â¿Â½ Ã¯Â¿Â½&ÃÂ·ÃÂ¹Ã¯Â¿Â½& Ã¯Â¿Â½`Ã¯Â¿Â½ÃÂ¯Ã¯Â¿Â½& ÃÂ§Ã¯Â¿Â½ÃÂ³Ã¯Â¿Â½ ÃÂ¯Ã¯Â¿Â½Ã¯Â¿Â½ÃÂªÃÂ´ÃÂ§ÃÂª Ã¯Â¿Â½Ã¯Â¿Â½ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½&ÃÂ´ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½Ã¯Â¿Â½` Ã¯Â¿Â½Ã¯Â¿Â½ÃÂ§Ã¯Â¿Â½ÃÂÃ¯Â¿Â½ÃÂ§ÃÂÃ¯Â¿Â½ Ã¯Â¿Â½Ã¯Â¿Â½ÃÂ§Ã¯Â¿Â½ÃÂ£ÃâÃ¯Â¿Â½ÃÂ§ÃÂª ÃÂ§Ã¯Â¿Â½ÃÂ¹ÃÂ±ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½`ÃÂ© ÃÂÃ¯Â¿Â½` Ã¯Â¿Â½&ÃÂ¯Ã¯Â¿Â½`Ã¯Â¿Â½ ÃÂ© 6 ÃÂ£ÃâÃÂªÃ¯Â¿Â½Ã¯Â¿Â½ÃÂ¨ÃÂ± ÃÂ¨Ã¯Â¿Â½&ÃÂ­ÃÂ§ÃÂÃÂ¸ÃÂ© ÃÂ§Ã¯Â¿Â½ÃÂ¬Ã¯Â¿Â½`ÃÂ²ÃÂ©Ã¯Â¿Â½R ÃÂªÃÂ­ÃÂ¯Ã¯Â¿Â½`ÃÂ¯Ã¯Â¿Â½9ÃÂ§ ÃÂÃ¯Â¿Â½` ÃÂ§Ã¯Â¿Â½ÃÂ­Ã¯Â¿Â½` ÃÂ§Ã¯Â¿Â½ÃÂ³ÃÂ§ÃÂ¨ÃÂ¹ ÃÂ´ÃÂ§ÃÂ±ÃÂ¹ Ã¯Â¿Â½&ÃâÃÂ© ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½&ÃâÃÂ±Ã¯Â¿Â½&ÃÂ© ÃÂ¨ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½ÃÂ±ÃÂ¨ Ã¯Â¿Â½&Ã¯Â¿Â½  ÃÂ³Ã¯Â¿Â½ ÃÂªÃÂ± ÃÂ§Ã¯Â¿Â½ÃÂ£ÃÂ±ÃÂ¯Ã¯Â¿Â½ Ã¯Â¿Â½`ÃÂ©.</p>
        <p>Ã¯Â¿Â½`ÃÂ¹Ã¯Â¿Â½&Ã¯Â¿Â½ ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½&ÃÂ·ÃÂ¹Ã¯Â¿Â½& Ã¯Â¿Â½`Ã¯Â¿Â½Ã¯Â¿Â½Ã¯Â¿Â½&Ã¯Â¿Â½`Ã¯Â¿Â½9ÃÂ§ Ã¯Â¿Â½&Ã¯Â¿Â½  ÃÂ§Ã¯Â¿Â½ÃÂ³ÃÂ§ÃÂ¹ÃÂ© 7 ÃÂµÃÂ¨ÃÂ§ÃÂ­Ã¯Â¿Â½9ÃÂ§ ÃÂ­ÃÂªÃ¯Â¿Â½0 3 ÃÂµÃÂ¨ÃÂ§ÃÂ­Ã¯Â¿Â½9ÃÂ§ Ã¯Â¿Â½Ã¯Â¿Â½Ã¯Â¿Â½`Ã¯Â¿Â½ÃÂ¯Ã¯Â¿Â½& Ã¯Â¿Â½&ÃÂ¬Ã¯Â¿Â½&Ã¯Â¿Â½Ã¯Â¿Â½ÃÂ¹ÃÂ© Ã¯Â¿Â½&ÃÂªÃ¯Â¿Â½ Ã¯Â¿Â½Ã¯Â¿Â½ÃÂ¹ÃÂ© Ã¯Â¿Â½&Ã¯Â¿Â½  ÃÂ§Ã¯Â¿Â½ÃÂ³Ã¯Â¿Â½ ÃÂ¯Ã¯Â¿Â½Ã¯Â¿Â½ÃÂªÃÂ´ÃÂ§ÃÂª Ã¯Â¿Â½Ã¯Â¿Â½ÃÂ§Ã¯Â¿Â½ÃÂ¨ÃÂ·ÃÂ§ÃÂ·ÃÂ³ Ã¯Â¿Â½Ã¯Â¿Â½ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½&ÃÂ´ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½Ã¯Â¿Â½` ÃÂ§Ã¯Â¿Â½ÃÂ¹ÃÂ±ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½`ÃÂ© Ã¯Â¿Â½Ã¯Â¿Â½ÃÂ§Ã¯Â¿Â½ÃÂÃ¯Â¿Â½ÃÂ§ÃÂÃ¯Â¿Â½ ÃÂ§Ã¯Â¿Â½ÃÂ¹ÃÂ±ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½`ÃÂ©.</p>
        <p><strong>ÃÂ§Ã¯Â¿Â½ÃÂ¹Ã¯Â¿Â½ Ã¯Â¿Â½Ã¯Â¿Â½ÃÂ§Ã¯Â¿Â½ :</strong> ÃÂ§Ã¯Â¿Â½ÃÂ¬Ã¯Â¿Â½`ÃÂ²ÃÂ© Ã¯Â¿Â½ 6 ÃÂ£ÃâÃÂªÃ¯Â¿Â½Ã¯Â¿Â½ÃÂ¨ÃÂ± Ã¯Â¿Â½ ÃÂ§Ã¯Â¿Â½ÃÂ­Ã¯Â¿Â½` ÃÂ§Ã¯Â¿Â½ÃÂ³ÃÂ§ÃÂ¨ÃÂ¹ Ã¯Â¿Â½ ÃÂ´ÃÂ§ÃÂ±ÃÂ¹ Ã¯Â¿Â½&ÃâÃÂ© ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½&ÃâÃÂ±Ã¯Â¿Â½&ÃÂ© Ã¯Â¿Â½ ÃÂ¨ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½ÃÂ±ÃÂ¨ Ã¯Â¿Â½&Ã¯Â¿Â½  ÃÂ³Ã¯Â¿Â½ ÃÂªÃÂ± ÃÂ§Ã¯Â¿Â½ÃÂ£ÃÂ±ÃÂ¯Ã¯Â¿Â½ Ã¯Â¿Â½`ÃÂ©</p>
        <p><strong>ÃÂ±Ã¯Â¿Â½Ã¯Â¿Â½& ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½!ÃÂ§ÃÂªÃÂ:</strong> 01000602832 / 01144741115</p>
        <p><strong>Ã¯Â¿Â½Ã¯Â¿Â½ÃÂ´ÃâÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½Ã¯Â¿Â½0 Ã¯Â¿Â½Ã¯Â¿Â½ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½&Ã¯Â¿Â½ÃÂªÃÂ±ÃÂ­ÃÂ§ÃÂª:</strong> 01112595678</p>
        <p><strong>ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½&Ã¯Â¿Â½Ã¯Â¿Â½Ã¯Â¿Â½ÃÂ¹ ÃÂ¹Ã¯Â¿Â½Ã¯Â¿Â½0 ÃÂ§Ã¯Â¿Â½ÃÂ®ÃÂ±Ã¯Â¿Â½`ÃÂ·ÃÂ©:</strong> <a href="https://maps.app.goo.gl/K38LYo9oSC2Myd119" target="_blank" rel="noopener">Google Maps</a></p>
      </section>
    </div>
  </div>

  <div class="mobile-hint">ÃÂ§ÃÂ³ÃÂªÃÂ®ÃÂ¯Ã¯Â¿Â½& ÃÂ¥ÃÂµÃÂ¨ÃÂ¹Ã¯Â¿Â½`Ã¯Â¿Â½  Ã¯Â¿Â½Ã¯Â¿Â½ÃÂªÃâÃÂ¨Ã¯Â¿Â½`ÃÂ± Ã¯Â¿Â½Ã¯Â¿Â½ÃÂ§Ã¯Â¿Â½ÃÂªÃÂµÃÂºÃ¯Â¿Â½`ÃÂ±</div>

  <script>
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    const TARGET_CSS_WIDTH = 860;
    let pdfDoc = null;
    let renderToken = 0;

    function syncHeaderOffset(){
      const topBar = document.querySelector('.top-bar');
      if(!topBar) return;
      const h = Math.ceil(topBar.getBoundingClientRect().height);
      document.documentElement.style.setProperty('--header-offset', h + 'px');
    }

    function getRenderScale(page){
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const v1 = page.getViewport({ scale: 1 });
      return (TARGET_CSS_WIDTH / v1.width) * dpr;
    }

    async function renderAllPages(){
      const pagesContainer = document.getElementById('pdfPages');
      const loader = document.getElementById('pageLoader');
      if(!pagesContainer || !pdfDoc) return;

      const current = ++renderToken;

      const fragment = document.createDocumentFragment();

      for(let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++){
        if(current !== renderToken) return;

        const page = await pdfDoc.getPage(pageNum);
        const scale = getRenderScale(page);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        canvas.className = 'pdf-page';

        const ctx = canvas.getContext('2d', { alpha: false });
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);

        await page.render({ canvasContext: ctx, viewport }).promise;
        page.cleanup();

        fragment.appendChild(canvas);
      }

      if(current !== renderToken) return;

      pagesContainer.innerHTML = '';
      pagesContainer.appendChild(fragment);

      if(loader) loader.style.display = 'none';
    }

    async function loadPDF(){
      const loader = document.getElementById('pageLoader');
      try{
        pdfDoc = await pdfjsLib.getDocument('${data.menuUrl}').promise;
        await renderAllPages();
      }catch(err){
        console.error('PDF load error:', err);
        const pagesContainer = document.getElementById('pdfPages');
        if(pagesContainer){
          pagesContainer.innerHTML =
            '<div style="text-align:center;padding:1.25rem;color:#475569">ÃÂªÃÂ¹ÃÂ°ÃÂ± ÃÂªÃÂ­Ã¯Â¿Â½&Ã¯Â¿Â½`Ã¯Â¿Â½ ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½&Ã¯Â¿Â½ Ã¯Â¿Â½`Ã¯Â¿Â½Ã¯Â¿Â½ ÃÂ§Ã¯Â¿Â½ÃÂ¢Ã¯Â¿Â½ . ÃÂ­ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½Ã¯Â¿Â½ Ã¯Â¿Â½ÃÂ§ÃÂ­Ã¯Â¿Â½Ã¯Â¿Â½9ÃÂ§.</div>';
        }
        if(loader) loader.style.display = 'none';
      }
    }

    document.addEventListener('DOMContentLoaded', () => {
      syncHeaderOffset();
      loadPDF();
    });

    window.addEventListener('resize', syncHeaderOffset);
    window.addEventListener('orientationchange', syncHeaderOffset);
  </script>
  `
      : `
  <div class="no-menu">
    <div class="no-menu-icon">Ã¯Â¿Â½x9</div>
    <h2 class="no-menu-title">ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½&Ã¯Â¿Â½ Ã¯Â¿Â½`Ã¯Â¿Â½Ã¯Â¿Â½ ÃÂºÃ¯Â¿Â½`ÃÂ± Ã¯Â¿Â½&ÃÂªÃ¯Â¿Â½Ã¯Â¿Â½ÃÂÃÂ± ÃÂ­ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½`ÃÂ§Ã¯Â¿Â½9</h2>
    <p class="no-menu-text">Ã¯Â¿Â½Ã¯Â¿Â½& Ã¯Â¿Â½`ÃÂªÃ¯Â¿Â½& ÃÂ±ÃÂÃÂ¹ Ã¯Â¿Â½&Ã¯Â¿Â½ÃÂ ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½&Ã¯Â¿Â½ Ã¯Â¿Â½`Ã¯Â¿Â½Ã¯Â¿Â½ ÃÂ¨ÃÂ¹ÃÂ¯Ã¯Â¿Â½R Ã¯Â¿Â½`ÃÂ±ÃÂ¬Ã¯Â¿Â½0 ÃÂ§Ã¯Â¿Â½ÃÂªÃÂ­Ã¯Â¿Â½Ã¯Â¿Â½ Ã¯Â¿Â½ÃÂ§ÃÂ­Ã¯Â¿Â½ÃÂ§Ã¯Â¿Â½9.</p>
  </div>
  `
  }
</body>
</html>`;
  },
  // Ã¯Â¿Â½ÃÂ§Ã¯Â¿Â½ÃÂ¨ ÃÂµÃÂÃÂ­ÃÂ§ÃÂª PDF ÃÂ§Ã¯Â¿Â½ÃÂ¥ÃÂ¶ÃÂ§ÃÂÃ¯Â¿Â½`ÃÂ© (ÃÂ§Ã¯Â¿Â½ÃÂ¹ÃÂ±Ã¯Â¿Â½Ã¯Â¿Â½ÃÂ¶ / ÃÂ§Ã¯Â¿Â½ÃÂ³ÃÂ­Ã¯Â¿Â½Ã¯Â¿Â½ÃÂ±)
  pdfPage: (data) => {
    const indexable =
      typeof data.indexable === 'boolean' ? data.indexable : data.pageExists;

    const robotsContent = indexable
      ? 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'
      : 'noindex, nofollow';

    const metaDescription = data.metaDescription || 'ÃÂµÃÂÃÂ­ÃÂ© ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½&Ã¯Â¿Â½ Ã¯Â¿Â½`Ã¯Â¿Â½Ã¯Â¿Â½ Ã¯Â¿Â½Ã¯Â¿Â½ÃÂ§Ã¯Â¿Â½ÃÂ¹ÃÂ±Ã¯Â¿Â½Ã¯Â¿Â½ÃÂ¶ ÃÂ§Ã¯Â¿Â½ÃÂ®ÃÂ§ÃÂµÃÂ© ÃÂ¨Ã¯Â¿Â½&ÃÂ·ÃÂ¹Ã¯Â¿Â½& ÃÂÃÂ§Ã¯Â¿Â½ÃÂ­ ÃÂ£ÃÂ¨Ã¯Â¿Â½Ã¯Â¿Â½ ÃÂ§Ã¯Â¿Â½ÃÂ¹Ã¯Â¿Â½ ÃÂ¨Ã¯Â¿Â½!.';

    return `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=5, user-scalable=yes">
  <link rel="icon" type="image/png" href="/logo.png">
  <link rel="apple-touch-icon" href="/logo.png">
  <meta name="application-name" content="E79E A'D- #(H 'D9F(G">
  <meta name="description" content="${metaDescription}">
  <meta property="og:title" content="${data.title}">
  <meta property="og:description" content="${metaDescription}">
  <meta property="og:url" content="${data.canonicalUrl}">
  <meta property="og:type" content="website">
  <meta property="og:locale" content="ar_EG">
  <meta property="og:site_name" content="ÙØ·Ø¹Ù ÙØ§ÙØ­ Ø£Ø¨Ù Ø§ÙØ¹ÙØ¨Ù">
  <meta property="og:image" content="https://fale7-res.vercel.app/logo.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${data.title}">
  <meta name="twitter:description" content="${metaDescription}">
  <meta name="twitter:image" content="https://fale7-res.vercel.app/logo.png">
  <meta name="robots" content="${robotsContent}">
  <title>${data.title}</title>
  <link rel="canonical" href="${data.canonicalUrl}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
  <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "E79E A'D- #(H 'D9F(G",
    "url": "https://fale7-res.vercel.app/",
    "logo": "https://fale7-res.vercel.app/logo.png"
  }
  </script>

  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "ÙØ·Ø¹Ù ÙØ§ÙØ­ Ø£Ø¨Ù Ø§ÙØ¹ÙØ¨Ù",
    "alternateName": ["Fale7"],
    "url": "https://fale7-res.vercel.app/",
    "inLanguage": "ar-EG",
    "publisher": {
      "@type": "Organization",
      "name": "ÙØ·Ø¹Ù ÙØ§ÙØ­ Ø£Ø¨Ù Ø§ÙØ¹ÙØ¨Ù",
      "url": "https://fale7-res.vercel.app/",
      "logo": {
        "@type": "ImageObject",
        "url": "https://fale7-res.vercel.app/logo.png"
      }
    }
  }
  </script>

  <style>
    :root{
      --foreground: 0 0% 3.9%;
      --radius: 0.5rem;
      --safe-top: env(safe-area-inset-top);
      --safe-right: env(safe-area-inset-right);
      --safe-bottom: env(safe-area-inset-bottom);
      --safe-left: env(safe-area-inset-left);
      --header-offset: 0px;
      --page-max: 860px;
    }
    *{ box-sizing:border-box; }
    html{ text-size-adjust:100%; -webkit-text-size-adjust:100%; }

    body, html{
      margin:0; padding:0;
      height:100%;
      min-height:100dvh;
      background: linear-gradient(135deg, hsl(210 40% 98%) 0%, hsl(210 40% 95%) 100%);
      font-family:'Inter', Arial, Helvetica, sans-serif;
      color:hsl(var(--foreground));
      overflow:hidden;
      overscroll-behavior:none;
    }

    .top-bar{
      position:fixed;
      top:0; left:0; right:0;
      z-index:30;
      background: rgba(255,255,255,0.95);
      backdrop-filter: blur(10px);
      border-bottom:1px solid rgba(0,0,0,0.1);
      padding: calc(clamp(0.4rem, 1.2vw, 0.75rem) + min(var(--safe-top), 12px))
        calc(clamp(0.55rem, 2vw, 1rem) + var(--safe-right))
        clamp(0.4rem, 1.2vw, 0.75rem)
        calc(clamp(0.55rem, 2vw, 1rem) + var(--safe-left));
      display:flex;
      justify-content:space-between;
      align-items:center;
      gap:clamp(0.3rem, 1vw, 0.75rem);
      direction:rtl;
      flex-wrap:nowrap;
    }

    .action-buttons{
      display:flex;
      gap:clamp(0.25rem, 0.8vw, 0.5rem);
      overflow-x:auto;
      -webkit-overflow-scrolling:touch;
      scrollbar-width:none;
      flex:1 1 auto;
      min-width:0;
      padding-right:0;
    }
    .action-buttons::-webkit-scrollbar{ display:none; }

    .btn{
      display:flex;
      align-items:center;
      justify-content:center;
      gap:clamp(0.2rem, 0.7vw, 0.35rem);
      padding:clamp(0.3rem, 0.9vw, 0.45rem) clamp(0.5rem, 1.8vw, 0.85rem);
      border-radius: calc(var(--radius) - 2px);
      font-size:clamp(0.68rem, 1.8vw, 0.8rem);
      line-height:1.15;
      min-height:36px;
      font-weight:600;
      text-decoration:none;
      transition: all 0.2s;
      box-shadow: 0 4px 6px -1px rgba(0,0,0,0.10), 0 2px 4px -1px rgba(0,0,0,0.06);
      white-space:nowrap;
      border:none;
      cursor:pointer;
      flex:0 0 auto;
    }
    .btn-secondary{
      background:#fff;
      color:#3b82f6;
      border:1px solid #3b82f6;
    }
    .btn-secondary:hover{ background:rgba(59,130,246,0.06); transform: translateY(-1px); }

    .social-icons{ display:flex; gap:clamp(0.28rem, 1vw, 0.6rem); flex:0 0 auto; }
    .social-icon a{
      text-decoration:none;
      color:inherit;
      display:block;
      line-height:0;
    }
    .social-icon span{
      display:flex; align-items:center; justify-content:center;
      height:clamp(36px, 6vw, 44px); width:clamp(36px, 6vw, 44px); background:#fff; border-radius:50%;
      box-shadow:0 4px 12px rgba(0,0,0,0.12);
      transition:all 0.25s ease;
      font-size:clamp(14px, 2.5vw, 18px); color:#666;
    }
    .social-icon.tiktok:hover span{ background:#000; color:#fff; transform:translateY(-2px); }
    .social-icon.facebook:hover span{ background:#3b5998; color:#fff; transform:translateY(-2px); }
    .social-icon.location:hover span{ background:#34b7f1; color:#fff; transform:translateY(-2px); }

    .pdf-viewer-container{
      position:fixed;
      top: var(--header-offset);
      left:0; right:0; bottom:0;
      background:#fff;
      border-radius: 20px 20px 0 0;
      box-shadow: 0 -4px 20px rgba(0,0,0,0.10);
      overflow:hidden;
      display:flex;
      flex-direction:column;
    }
    .pdf-viewer-container.pdf-wrap{
      min-height:520px;
    }

    .pdf-canvas-container{
      position:relative;
      flex:1;
      overflow:auto;
      padding:0.55rem;
    }

    .page-loader{
      position:absolute; inset:0;
      display:flex; align-items:center; justify-content:center;
      flex-direction:column; gap:0.75rem;
      background: rgba(255,255,255,0.92);
      backdrop-filter: blur(6px);
      z-index:5;
      padding:1rem;
      text-align:center;
    }
    .spinner{
      width:36px; height:36px;
      border:4px solid #f3f3f3;
      border-top:4px solid #3b82f6;
      border-radius:50%;
      animation: spin 1s linear infinite;
    }
    @keyframes spin{ 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }

    #pdfPages{
      width:100%;
      display:flex;
      flex-direction:column;
      align-items:center;
      gap:0.7rem;
    }

    .pdf-page{
      width: min(100%, var(--page-max));
      height:auto;
      border-radius:8px;
      box-shadow:0 4px 12px rgba(0,0,0,0.10);
      display:block;
    }

    .empty{
      display:flex;
      height:100%;
      align-items:center;
      justify-content:center;
      flex-direction:column;
      text-align:center;
      color:#475569;
      padding:1.25rem;
    }

    .mobile-hint{
      position:fixed;
      bottom: calc(0.75rem + var(--safe-bottom));
      left:50%;
      transform:translateX(-50%);
      z-index:20;
      background: rgba(0,0,0,0.7);
      color:#fff;
      padding:0.45rem 0.85rem;
      border-radius:20px;
      font-size:0.72rem;
      backdrop-filter: blur(10px);
      white-space:nowrap;
    }
    @media (min-width:768px){ .mobile-hint{ display:none; } }

    @media (max-width:640px){
      .top-bar{
        padding: calc(0.34rem + min(var(--safe-top), 8px))
          calc(0.5rem + var(--safe-right))
          0.34rem
          calc(0.5rem + var(--safe-left));
        gap:0.32rem;
      }
      .social-icons{ gap:0.28rem; }
      .social-icon span{
        height:36px;
        width:36px;
        font-size:14px;
      }
      .action-buttons{
        gap:0.3rem;
        padding-right:0;
      }
      .btn{
        gap:0.2rem;
        padding:0.3rem 0.5rem;
        font-size:0.67rem;
        line-height:1.15;
        min-height:34px;
        max-width:112px;
        overflow:hidden;
        text-overflow:ellipsis;
      }
    }

    @media (max-width:380px){
      .top-bar{
        padding: calc(0.3rem + min(var(--safe-top), 6px))
          calc(0.44rem + var(--safe-right))
          0.3rem
          calc(0.44rem + var(--safe-left));
      }
      .social-icons{ gap:0.24rem; }
      .social-icon span{
        height:34px;
        width:34px;
        font-size:13px;
      }
      .btn{
        padding:0.27rem 0.42rem;
        font-size:0.64rem;
        min-height:32px;
        max-width:102px;
      }
    }
  </style>
</head>

<body>
  <div class="top-bar">
    <div class="action-buttons">
      ${data.offersExists && data.pageType !== 'offers' ? `<a href="/offers" class="btn btn-secondary"><span>Ã¯Â¿Â½x}Ã¯Â¿Â½</span>ÃÂ§Ã¯Â¿Â½ÃÂ¹ÃÂ±Ã¯Â¿Â½Ã¯Â¿Â½ÃÂ¶</a>` : ''}
      ${data.suhoorExists && data.pageType !== 'suhoor' ? `<a href="/suhoor" class="btn btn-secondary"><span>Ã¯Â¿Â½xR"</span>Ã¯Â¿Â½&Ã¯Â¿Â½ Ã¯Â¿Â½`Ã¯Â¿Â½Ã¯Â¿Â½ ÃÂ§Ã¯Â¿Â½ÃÂ³ÃÂ­Ã¯Â¿Â½Ã¯Â¿Â½ÃÂ±</a>` : ''}
      <a href="/menu" class="btn btn-secondary"><span>Ã¯Â¿Â½xÃ¯Â¿Â½Ã¯Â¿Â½</span>ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½&Ã¯Â¿Â½ Ã¯Â¿Â½`Ã¯Â¿Â½Ã¯Â¿Â½ ÃÂ§Ã¯Â¿Â½ÃÂ±ÃÂ¦Ã¯Â¿Â½`ÃÂ³Ã¯Â¿Â½`</a>
    </div>

    <div class="social-icons">
      <div class="social-icon tiktok"><a href="https://www.tiktok.com/@fale7_1961" target="_blank" rel="noopener"><span><i class="fab fa-tiktok"></i></span></a></div>
      <div class="social-icon facebook"><a href="https://www.facebook.com/profile.php?id=100063865183387" target="_blank" rel="noopener"><span><i class="fab fa-facebook-f"></i></span></a></div>
      <div class="social-icon location"><a href="https://maps.app.goo.gl/K38LYo9oSC2Myd119" target="_blank" rel="noopener"><span><i class="fas fa-map-marker-alt"></i></span></a></div>
    </div>
  </div>

  ${
    data.pageExists
      ? `
  <div class="pdf-viewer-container pdf-wrap">
    <div class="pdf-canvas-container" id="pdfContainer">
      <div class="page-loader" id="pageLoader">
        <div class="spinner"></div>
        <div>ÃÂ¬ÃÂ§ÃÂ±Ã¯Â¿Â½` ÃÂ§Ã¯Â¿Â½ÃÂªÃÂ­Ã¯Â¿Â½&Ã¯Â¿Â½`Ã¯Â¿Â½...</div>
      </div>
      <div id="pdfPages"></div>
    </div>
  </div>

  <div class="mobile-hint">ÃÂ§ÃÂ³ÃÂªÃÂ®ÃÂ¯Ã¯Â¿Â½& ÃÂ¥ÃÂµÃÂ¨ÃÂ¹Ã¯Â¿Â½`Ã¯Â¿Â½  Ã¯Â¿Â½Ã¯Â¿Â½ÃÂªÃâÃÂ¨Ã¯Â¿Â½`ÃÂ± Ã¯Â¿Â½Ã¯Â¿Â½ÃÂ§Ã¯Â¿Â½ÃÂªÃÂµÃÂºÃ¯Â¿Â½`ÃÂ±</div>

  <script>
    pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

    const TARGET_CSS_WIDTH = 860;
    let pdfDoc = null;
    let renderToken = 0;

    function syncHeaderOffset(){
      const topBar = document.querySelector('.top-bar');
      if(!topBar) return;
      const h = Math.ceil(topBar.getBoundingClientRect().height);
      document.documentElement.style.setProperty('--header-offset', h + 'px');
    }

    function getRenderScale(page){
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const v1 = page.getViewport({ scale: 1 });
      return (TARGET_CSS_WIDTH / v1.width) * dpr;
    }

    async function renderAllPages(){
      const pagesContainer = document.getElementById('pdfPages');
      const loader = document.getElementById('pageLoader');
      if(!pagesContainer || !pdfDoc) return;

      const current = ++renderToken;
      const fragment = document.createDocumentFragment();

      for(let pageNum = 1; pageNum <= pdfDoc.numPages; pageNum++){
        if(current !== renderToken) return;

        const page = await pdfDoc.getPage(pageNum);
        const scale = getRenderScale(page);
        const viewport = page.getViewport({ scale });

        const canvas = document.createElement('canvas');
        canvas.className = 'pdf-page';

        const ctx = canvas.getContext('2d', { alpha: false });
        canvas.width = Math.floor(viewport.width);
        canvas.height = Math.floor(viewport.height);

        await page.render({ canvasContext: ctx, viewport }).promise;
        page.cleanup();

        fragment.appendChild(canvas);
      }

      if(current !== renderToken) return;

      pagesContainer.innerHTML = '';
      pagesContainer.appendChild(fragment);
      if(loader) loader.style.display = 'none';
    }

    async function loadPDF(){
      const loader = document.getElementById('pageLoader');
      try{
        pdfDoc = await pdfjsLib.getDocument('${data.pageUrl}').promise;
        await renderAllPages();
      }catch(e){
        console.error(e);
        const pagesContainer = document.getElementById('pdfPages');
        if(pagesContainer){
          pagesContainer.innerHTML = '<div class="empty"><h2>ÃÂªÃÂ¹ÃÂ°ÃÂ± ÃÂªÃÂ­Ã¯Â¿Â½&Ã¯Â¿Â½`Ã¯Â¿Â½ ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½&Ã¯Â¿Â½ÃÂ</h2><p>ÃÂ­ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½Ã¯Â¿Â½ Ã¯Â¿Â½&ÃÂ±ÃÂ© ÃÂ£ÃÂ®ÃÂ±Ã¯Â¿Â½0 Ã¯Â¿Â½ÃÂ§ÃÂ­Ã¯Â¿Â½Ã¯Â¿Â½9ÃÂ§.</p></div>';
        }
        if(loader) loader.style.display = 'none';
      }
    }

    document.addEventListener('DOMContentLoaded', () => {
      syncHeaderOffset();
      loadPDF();
    });

    // Ã¯Â¿Â½S& ÃÂ¨ÃÂ¯Ã¯Â¿Â½Ã¯Â¿Â½Ã¯Â¿Â½  ÃÂ¥ÃÂ¹ÃÂ§ÃÂ¯ÃÂ© ÃÂ±ÃÂ³Ã¯Â¿Â½& PDF ÃÂ¹Ã¯Â¿Â½ ÃÂ¯ rotate
    window.addEventListener('resize', syncHeaderOffset);
    window.addEventListener('orientationchange', syncHeaderOffset);
  </script>
  `
      : `
  <div class="empty">
    <h2>${data.emptyTitle || 'Ã¯Â¿Â½!ÃÂ°Ã¯Â¿Â½! ÃÂ§Ã¯Â¿Â½ÃÂµÃÂÃÂ­ÃÂ© ÃÂºÃ¯Â¿Â½`ÃÂ± Ã¯Â¿Â½&ÃÂªÃÂ§ÃÂ­ÃÂ© ÃÂ§Ã¯Â¿Â½ÃÂ¢Ã¯Â¿Â½ '}</h2>
    <p>${data.emptyText || 'Ã¯Â¿Â½`Ã¯Â¿Â½&ÃâÃ¯Â¿Â½ Ãâ ÃÂ§Ã¯Â¿Â½Ã¯Â¿Â½&ÃÂªÃÂ§ÃÂ¨ÃÂ¹ÃÂ© Ã¯Â¿Â½ÃÂ§ÃÂ­Ã¯Â¿Â½ÃÂ§Ã¯Â¿Â½9.'}</p>
  </div>
  `
  }
</body>
</html>`;
  }
};
