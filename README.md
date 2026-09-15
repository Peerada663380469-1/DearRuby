# 🍷 Dear Ruby — เว็บจองโต๊ะร้านอาหาร Fine Dining

เว็บแอปสำหรับร้าน/บาร์สไตล์ Mediterranean rooftop **"Dear Ruby"** — ลูกค้าดูเมนู จองโต๊ะ สั่งอาหารล่วงหน้า และชำระมัดจำได้ผ่านหน้าเว็บ
พัฒนาด้วย **React (Vite)** + **Express.js** + **Prisma / PostgreSQL**

> 🔗 ตัวอย่างที่ deploy จริง: https://dearruby.onrender.com

> 🧪 **หมายเหตุด้านวิจัย:** โปรเจกต์นี้ถูกใช้เป็น **IDOR testbed** ควบคู่กันด้วย จึงมีชั้น instrumentation อยู่ในเซิร์ฟเวอร์ (ground-truth logging, trace cookie, ownership middleware) และโครงสร้าง testbed (`docker-compose.yml`, `infra/`, `logs/`) — ดูรายละเอียดในหัวข้อ [IDOR Testbed](#-idor-testbed)

## ✨ ฟีเจอร์หลัก

- **🍽️ เมนู (Curated Selection)** — แสดงเมนูตามหมวด (Starters, Mains, Artisan Pizza, Desserts, Drinks, Premium Wines) พร้อมค้นหา, ป้าย Vegetarian / Spicy และราคา
- **📅 จองโต๊ะแบบหลายขั้นตอน** — เลือกจำนวนแขก → วันที่ → เวลา → โซน (Outdoor / Indoor)
- **🛒 สั่งอาหารล่วงหน้า (Pre-order)** — เพิ่มเมนูลงตะกร้า, ปรับจำนวน, สรุปยอดก่อนจอง
- **💳 หน้า Checkout + มัดจำ** — กรอกข้อมูลผู้จอง, วัตถุประสงค์, ข้อจำกัดด้านอาหาร พร้อมสรุปการจองและยอดมัดจำ
- **👤 บัญชีลูกค้า** — เข้าสู่ระบบ, Dashboard, ดูรายละเอียดการจอง, โปรไฟล์, ใบเสร็จ (Invoice)
- **🎉 Private Events** — ส่งคำขอจัดงานส่วนตัว (Event Inquiry)
- **🌐 รองรับหลายภาษา** — ผ่าน `LanguageContext`

## 🛠️ เทคโนโลยี

| ส่วน | เทคโนโลยี |
|---|---|
| Frontend | React 18, Vite, React Router v6, Axios |
| Backend | Node.js, Express.js |
| Database | PostgreSQL (ผ่าน **Prisma ORM**) |
| Auth / Session | `express-session` + `connect-pg-simple`, bcryptjs (PIN hash) |
| Security / Logging | Helmet, express-rate-limit, Morgan (NGINX format) |
| Deploy | Render |

## 📁 โครงสร้างโปรเจค

```
POS/
├── client/                       # Frontend (React + Vite)
│   └── src/
│       ├── components/           # Navbar, TopNav, Footer, ConfirmDialog
│       ├── context/              # LanguageContext, ToastContext
│       ├── pages/                # Reservation, Menu, BookingCheckout,
│       │                         #   Customer(Login/Dashboard/Profile),
│       │                         #   ReservationDetail, Invoice, Events, Story
│       ├── services/             # api.js (Axios instance)
│       └── data/                 # mockData.js
├── server/                       # Backend (Express + Prisma)
│   ├── routes/                   # auth, reservations, events, profile, menu
│   ├── middleware/               # ownership.js, groundTruth.js, customerAuth.js
│   ├── prisma/                   # schema.prisma, migrations, seed.js
│   ├── db.js                     # Prisma client
│   └── server.js                 # Express entrypoint
├── infra/                        # NGINX / Apache configs (IDOR testbed)
├── logs/                         # Access + ground-truth logs
├── docker-compose.yml            # Postgres + NGINX + Apache (testbed)
└── README.md
```

## 🗄️ Data Models (Prisma)

- **User** — `role`: `customer | manager`, ยืนยันตัวตนด้วย PIN (`pin_hash`)
- **Reservation** — ผูกกับ `userId`; เก็บวัน/เวลา/จำนวนแขก/โซน/รายการ pre-order (`preOrderJson`)/สถานะ
- **EventInquiry** — คำขอจัดงานส่วนตัว ผูกกับ `userId`
- **MenuItem** — เมนู: หมวด, ราคา, ป้าย spicy/vegetarian, สต็อก, สถานะพร้อมขาย

## 📦 การติดตั้งและรัน (Local)

### ข้อกำหนดเบื้องต้น
- Node.js v18+
- PostgreSQL (หรือใช้ผ่าน `docker-compose`)

### 1) Backend

```bash
cd server
npm install
```

ตั้งค่า `server/.env`:

```env
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/DBNAME
SESSION_SECRET=your-session-secret
PORT=3001
TESTBED=true       # true = ปิด rate limit (โหมดทดสอบ)
BEHIND_PROXY=true  # true เมื่อรันหลัง docker nginx/apache — ให้ proxy เป็นเจ้าของ access log
                   # (บน Render ที่ไม่มี proxy ให้เอาออก/ไม่ตั้ง เพื่อให้ Express เขียน log เอง)
```

รัน migration + seed แล้วเริ่มเซิร์ฟเวอร์:

```bash
npx prisma migrate deploy
node prisma/seed.js
npm run dev            # http://localhost:3001
```

### 2) Frontend

```bash
cd client
npm install
npm run dev            # http://localhost:5173
```

เปิดเบราว์เซอร์ที่ `http://localhost:5173`

## 🚀 Deploy (Render)

- `npm run build` (ใน `server`) จะติดตั้ง dependency ทั้ง server + client, build frontend และ `prisma generate`
- เมื่อเริ่มรัน `server.js` จะรัน `prisma migrate deploy` ให้อัตโนมัติ
- Endpoint สำหรับผู้ดูแล (ต้องมี `?key=...`):
  - `POST /api/admin/seed` — seed ข้อมูลเริ่มต้น
  - `POST /api/admin/seed-menu` — seed เมนู
  - `POST /api/admin/clear-db` — ล้าง users + reservations

## 🧪 IDOR Testbed

โปรเจกต์นี้ถูกใช้เป็นสนามทดสอบช่องโหว่ **IDOR (Insecure Direct Object Reference)** สำหรับงานวิจัย:

- **Instrumentation ในแอป** — `middleware/groundTruth.js` (บันทึก ground truth ลง `logs/ground_truth/app_ground_truth.csv`), trace cookie, และ log แบบ NGINX (`logs/nginx/idor_nginx.log`)
- **`middleware/ownership.js`** — `requireLogin` + `markGT` ใช้ในเส้นทาง reservations / events / profile
- **โครงสร้าง testbed** — `docker-compose.yml` (Postgres + NGINX :8080 + Apache :8081), `infra/`
- **Endpoint ดาวน์โหลด log** — `GET /api/logs/access`, `GET /api/logs/groundtruth`

> เส้นทางที่เกี่ยวข้องกับ IDOR เช่น `/customer/profile/:customerId`, `/customer/reservation/:id`, `/customer/invoice/:reservationId` — ใช้ทดสอบการเข้าถึงข้อมูลข้ามผู้ใช้

## 📝 หมายเหตุ

- ฐานข้อมูลใช้ **PostgreSQL ผ่าน Prisma** (ไม่ใช่ไฟล์ JSON)
- โหมด `TESTBED=true` จะปิด rate limiting เพื่อความสะดวกในการทดสอบ
