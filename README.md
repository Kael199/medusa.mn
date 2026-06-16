# 🎌 MangaVault — Манга унших платформ

Монгол хэрэглэгчдэд зориулсан бүрэн манга унших вэбсайт.  
QPay төлбөрийн системтэй, VIP гишүүнчлэлтэй, admin панелтэй.

---

## 🚀 Суулгах заавар (byl.mn VPS)

### 1. Сервер дээр Node.js суулгах
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo bash -
sudo apt-get install -y nodejs
npm install -g pm2
```

### 2. Файлуудыг сервер рүү оруулах
```bash
# FileZilla эсвэл git clone ашиглана
cd /var/www
# mangavault.zip задлаад хуулна
cd mangavault
npm install
```

### 3. .env файл үүсгэх
```bash
cp .env.example .env
nano .env
```

**.env файлд оруулах зүйлс:**
```
SESSION_SECRET=урт_нууц_үг_энд
SITE_URL=https://тансайт.mn
ADMIN_EMAIL=tuvshinbayr1145@gmail.com
ADMIN_PASSWORD=өөрийн_нууц_үг
QPAY_USERNAME=QPay-аас авсан
QPAY_PASSWORD=QPay-аас авсан
QPAY_INVOICE_CODE=QPay-аас авсан
```

### 4. Сервер асаах
```bash
pm2 start server.js --name mangavault
pm2 save && pm2 startup
```

### 5. Nginx тохируулах
```bash
sudo apt install nginx -y
sudo nano /etc/nginx/sites-available/mangavault
```

```nginx
server {
    listen 80;
    server_name тансайт.mn www.тансайт.mn;
    client_max_body_size 50M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/mangavault /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl restart nginx
```

### 6. SSL суулгах (QPay шаардана)
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d тансайт.mn -d www.тансайт.mn
```

---

## 🔑 Нэвтрэх

| Хэрэглэгч | Мэдээлэл |
|-----------|---------|
| Admin | .env дэх ADMIN_EMAIL / ADMIN_PASSWORD |

**Admin панел:** `https://тансайт.mn/admin.html`

---

## 💳 QPay холбох

1. [merchant.qpay.mn](https://merchant.qpay.mn) дээр бүртгүүлнэ
2. Баталгаажсаны дараа `username`, `password`, `invoice_code` авна
3. `.env` файлд оруулаад `pm2 restart mangavault`

---

## 📁 Бүтэц

```
mangavault/
├── server.js              ← Үндсэн сервер
├── .env.example           ← Тохиргооны жишээ
├── db/
│   └── db.js              ← JSON database
├── routes/
│   ├── auth.js            ← Нэвтрэх / бүртгэл
│   ├── manga.js           ← Манга CRUD
│   ├── chapters.js        ← Бүлэг + зураг upload
│   ├── users.js           ← Хэрэглэгч + VIP
│   ├── admin.js           ← Admin статистик
│   └── payment.js         ← QPay төлбөр
├── middleware/
│   └── auth.js            ← Session шалгалт
└── public/
    ├── index.html         ← Үндсэн сайт
    ├── admin.html         ← Admin панел
    ├── css/style.css
    ├── js/
    │   ├── app.js
    │   ├── admin.js
    │   └── api.js
    └── uploads/           ← Зурагнуудын хавтас
        ├── covers/
        └── chapters/
```

---

## 💰 VIP үнэ

| Төлөвлөгөө | Үнэ | Хямдрал |
|---|---|---|
| 1 сар | ₮6,900 | — |
| 3 сар | ₮17,900 | 13% |
| 1 жил | ₮59,900 | 28% |

---

## 🛠 PM2 командууд

```bash
pm2 status                    # Статус харах
pm2 logs mangavault           # Log харах
pm2 restart mangavault        # Дахин асаах
pm2 stop mangavault           # Зогсоох
```
