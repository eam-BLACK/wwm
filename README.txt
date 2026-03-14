# Project Entropy - Landing Page

هاد البروجيه جاهز باش تفتحو وتبدل فيه بوحدك بسهولة.

## فين تبدل كل حاجة

### 1) النصوص
- حل ملف: `index.html`
- أي كلمة بغيتي تبدلها، بدلها مباشرة من نفس الملف

### 2) الفيديو اللي فالباكغراوند
- حط الفيديو ديالك داخل:
  `assets/`
- سميه:
  `hero-video.webm`
- أو بدل الاسم داخل `index.html` فهاد السطر:
  `<source src="assets/hero-video.webm" type="video/webm" />`

### 3) لوغو اللعبة
- اللوغو ديالك راه مضاف دابا هنا:
  `assets/project-entropy-logo.png`
- إلى بغيتي تبدلو، حط لوغو جديد بنفس الاسم

### 4) صور اللعبة الثلاثة
- دابا كاينين صور مؤقتة online
- فملف `index.html` قلب على:
  `<!-- REPLACE THIS IMAGE -->`
- بدل روابط الصور بروابط ديالك
- أو استعمل صور محلية من داخل `assets/`

مثال:
`<img src="assets/screenshot-1.jpg" alt="Game screenshot" />`

### 5) فيديو YouTube ديال Trailer
- فملف `index.html` قلب على:
  `https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0`
- بدلها بالرابط ديال embed ديالك

مثال:
إذا كان الفيديو:
`https://www.youtube.com/watch?v=abc123xyz`

دير:
`https://www.youtube.com/embed/abc123xyz?rel=0`

### 6) Reviews
- نفس الملف `index.html`
- قلب على section فيها:
  `Player Reviews`
- بدل الأسامي، stars، والآراء

## كيفاش تفتح الموقع
- غير دير double click على `index.html`
- أو فتحو بمتصفح Chrome

## المجلدات
- `index.html` = الصفحة الرئيسية
- `css/style.css` = الألوان والتصميم
- `js/script.js` = حركات بسيطة
- `assets/` = فيديو، لوغو، icons، صور

## ملاحظة
الملف اللي صنعت ليك هو ZIP وماشي RAR، حيث ZIP خدام مباشرة على أي جهاز تقريباً.
