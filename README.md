# 🍽️ Restaurant POS System — ระบบบริหารจัดการร้านอาหาร ณ จุดขาย

ระบบ Point of Sale (POS) สำหรับร้านอาหาร พัฒนาด้วย React + Express.js

## ✨ ฟีเจอร์หลัก

- **🔐 เข้าสู่ระบบด้วย PIN** — ปลอดภัยด้วย JWT + bcrypt
- **📊 Dashboard** — สรุปรายรับ-รายจ่าย พร้อมกราฟ กรองตามช่วงเวลา
- **🛒 POS หน้าร้าน** — เลือกเมนู, จัดการตะกร้า, ชำระเงิน, พิมพ์ใบเสร็จ
- **🪑 จัดการโต๊ะ** — แสดงสถานะ 30 โต๊ะ (ว่าง/ใช้งาน/จอง), จอง/ยกเลิก
- **📒 บัญชี** — บันทึกรายรับอัตโนมัติ, เพิ่มรายจ่าย, กรองรายงาน
- **👥 จัดการพนักงาน** — เพิ่ม/ลบ/เปลี่ยน PIN พนักงาน

## 🛠️ เทคโนโลยี

| ส่วน | เทคโนโลยี |
|---|---|
| Frontend | React 18, Vite, React Router v6, Axios, Recharts, Lucide Icons |
| Backend | Node.js, Express.js |
| Auth | JWT (JSON Web Token) + bcryptjs |
| Database | JSON File (Atomic Write) |

## 📦 การติดตั้ง

### ข้อกำหนดเบื้องต้น
- Node.js v18+ 
- npm v9+

### ขั้นตอน

1. **Clone หรือดาวน์โหลดโปรเจค**

2. **ติดตั้ง Dependencies — Server**
   ```bash
   cd server
   npm install
   ```

3. **ตั้งค่า Environment Variables (ไม่บังคับ)**
   แก้ไขไฟล์ `server/.env`:
   ```env
   JWT_SECRET=your-secret-key-here
   PORT=3001
   ```

4. **ติดตั้ง Dependencies — Client**
   ```bash
   cd client
   npm install
   ```

5. **รัน Server**
   ```bash
   cd server
   npm run dev
   ```
   Server จะรันที่ `http://localhost:3001`

6. **รัน Client** (เปิด terminal ใหม่)
   ```bash
   cd client
   npm run dev
   ```
   Client จะรันที่ `http://localhost:5173`

7. **เปิดเบราว์เซอร์** ไปที่ `http://localhost:5173`

## 🔑 ข้อมูลเข้าสู่ระบบเริ่มต้น

| ชื่อ | PIN |
|---|---|
| ผู้จัดการ | `1234` |

## 📁 โครงสร้างโปรเจค

```
POS/
├── client/                  # Frontend (React + Vite)
│   ├── src/
│   │   ├── components/      # Layout, Sidebar, ConfirmDialog
│   │   ├── context/         # AuthContext, ToastContext
│   │   ├── pages/           # Login, Dashboard, POS, Tables, Accounting
│   │   ├── services/        # Axios API instance
│   │   └── index.css        # Global styles
│   └── public/images/       # Logo + food images
├── server/                  # Backend (Express.js)
│   ├── routes/              # auth, tables, menu, orders, accounting
│   ├── middleware/           # JWT auth middleware
│   ├── db.js                # JSON database layer
│   └── .env                 # Environment variables
└── README.md
```

## 📝 หมายเหตุ

- VAT คำนวณที่อัตรา **7%** (มาตรฐานไทย)
- ฐานข้อมูลเก็บในไฟล์ `server/db/data.json` — ลบไฟล์นี้เพื่อ reset ข้อมูล
- ระบบรองรับการแสดงผลบน Desktop, Tablet และ Mobile
