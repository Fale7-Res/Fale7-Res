# Fale7 Menu Studio

مشروع جديد في جذر المستودع لعرض وإدارة صفحات منيو SVG.

## التشغيل

```bash
npm install
npm start
```

ثم افتح:

- العميل: `http://localhost:3000/`
- لوحة المدير: `http://localhost:3000/admin`

كلمة المرور الافتراضية محليًا هي `fale71961`. غيّرها عبر `ADMIN_PASSWORD` قبل النشر، واضبط `SESSION_SECRET` أيضًا.

## طريقة العمل

- ملفات SVG الأساسية موجودة مسبقًا داخل `uploads/` ويتم نشرها مع المستودع.
- المدير لا يرفع ملفات؛ يحرر الأسعار والأصناف من لوحة الإدارة فقط.
- محرر الصفحة يعرض كل عناصر `text` و`tspan` للتعديل، لذلك يمكن تعديل الأسعار الموجودة كنصوص SVG.
- يمكن حفظ الصفحة وتنزيل SVG المحدث من لوحة الإدارة.
- عند النشر على Vercel، يكتب الحفظ Commit جديدًا في GitHub عبر `GITHUB_TOKEN` و`GITHUB_REPOSITORY` و`GITHUB_BRANCH`. لذلك تبقى التعديلات داخل المشروع وتُعاد عملية النشر تلقائيًا من GitHub.

## النشر على GitHub وVercel

1. ارفع المشروع إلى مستودع GitHub، وتأكد من وجود `data/menu.json` وملفات `uploads/*.svg`.
2. في Vercel اختر `Import Git Repository` ثم اختر المستودع واضغط Deploy.
3. أضف Environment Variables في Vercel:
	- `ADMIN_PASSWORD`
	- `SESSION_SECRET`
	- `GITHUB_TOKEN`: Fine-grained token بصلاحية `Contents: Read and write` لهذا المستودع فقط.
	- `GITHUB_REPOSITORY`: مثل `Fale7-Res/Fale7-Res`.
	- `GITHUB_BRANCH`: `main`.
4. فعّل GitHub auto-deploy من إعدادات المشروع في Vercel.

لا تضع `GITHUB_TOKEN` داخل GitHub أو ملفات المشروع. يجب أن يبقى داخل Environment Variables في Vercel.

مجلد `Learn this appearence` موجود كمرجع بصري فقط ولم يتم استخدامه ككود للتطبيق الجديد.
