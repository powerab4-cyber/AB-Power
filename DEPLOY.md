# AB Power — دليل النشر (Deployment)

دليل خطوة بخطوة لنشر مشروع AB Power على أي خادم (VPS / Render / Railway / عقدة).

## المتطلبات

- Node.js >= 20
- MongoDB Atlas (أو أي MongoDB) — رابط `MONGO_URI`
- حساب ImageKit مع `PUBLIC_KEY` و`PRIVATE_KEY` و`URL_ENDPOINT`

## 1) إعداد المتغيرات البيئية (server/.env)

```env
PORT=5000
MONGO_URI=mongodb+srv://user:pass@cluster/abpower
IMAGEKIT_PUBLIC_KEY=public_xxxx
IMAGEKIT_PRIVATE_KEY=private_xxxx
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-endpoint
JWT_SECRET=نص_عشوائي_طويل_وسري
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=https://your-domain.com
TRUST_PROXY=1
```

> **مهم:** `CLIENT_ORIGIN` يجب أن يكون نطاقك الحقيقي — بدونها سيُرفض الطلب من المتصفح (CORS).
> `TRUST_PROXY` يجب أن يكون `1` فقط إذا كان الخادم خلف proxy/CDN (مثل Nginx أو Render). إذا لم يكن كذلك اجعله `0`.

## 2) بناء الواجهة الأمامية

```bash
cd client
npm ci
npm run build        # ينتج مجلد client/dist (يشمل تحسين الصور WebP)
```

## 3) تثبيت وتشغيل الخادم

```bash
cd ../server
npm ci
npm start            # node server.js  →  يستمع على PORT
```

الخادم يخدم API وواجهة `client/dist` معاً من نفس المنفذ.

> **لا تحذف مجلد `client/dist` ولا تغيّر بنية المجلدات** — الخادم يقرأ الواجهة من
> `server/src/../../client/dist` النسبي إلى `server/src`.

## 4) إبقاء الخادم حياً (Process Manager)

### مع systemd (Linux VPS)

```ini
[Unit]
Description=AB Power server
After=network.target

[Service]
WorkingDirectory=/path/to/ab-power/server
ExecStart=/usr/bin/node server.js
Restart=always
RestartSec=5
Environment=NODE_ENV=production

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable --now ab-power
```

### مع pm2

```bash
npm i -g pm2
cd server
pm2 start server.js --name ab-power
pm2 save
```

## 4) النشر على منصة سحابية (Render / Railway / Heroku)

المشروع جاهز للمنصات السحابية: يوجد `package.json` في الجذر و`Procfile`.

### المتغيرات البيئية — اضبطها في لوحة المنصة (كلها مطلوبة)

```env
PORT=5000
NODE_ENV=production
MONGO_URI=mongodb+srv://user:pass@cluster/abpower
IMAGEKIT_PUBLIC_KEY=public_xxxx
IMAGEKIT_PRIVATE_KEY=private_xxxx
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your-endpoint
JWT_SECRET=نص_عشوائي_طويل_وسري
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=https://your-app.onrender.com   # نطاقك الحقيقي
TRUST_PROXY=1
```

### Render
- Build Command: `npm run build`
- Start Command: `npm start`
- Health Check Path: `/api/health`

### Railway
- Build: `npm run build` — Start: `npm start`

### Heroku
- يسحب `Procfile` تلقائياً (`web: node server/server.js`).
- أضف Buildpack Node.js فقط، وسيُشتق script البناء من `engines` — إن لم يشتغل أضف:
  ```json
  "heroku-postbuild": "npm run build"
  ```
  داخل `scripts` في ملف `package.json` الجذري.

> ملاحظة: `CLIENT_ORIGIN` يجب أن يكون نطاق المنصة الحقيقي. لأن الخادم يخدم الواجهة بنفسه، طلبات المتصفح من نفس النطاق تعمل دائماً، لكن الإعداد مطلوب عند الوصول عبر نطاق منفصل.

## 5) نصائح أمان بعد النشر

- ضع المنفذ خلف Nginx/Caddy مع HTTPS (Let's Encrypt).
- فعّل `CLIENT_ORIGIN` بنطاقك ولا تترك `*`.
- غيّر `JWT_SECRET` لسر عشوائي طويل.
- لا ترفع ملف `.env` إلى أي مستودع (موجود في `.gitignore`).

## فحص سريع بعد التشغيل

- `GET /api/health` → `{"status":"ok","db":"connected",...}`
- فتح `https://your-domain.com/` يعرض المتجر (SPA).
- تسجيل دخول مشرف → لوحة التحكم `/dashboard`.
