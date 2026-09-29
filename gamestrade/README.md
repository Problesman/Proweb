# GameTrade Hub

เว็บซื้อขายบัญชีเกมที่ใช้ **Django และ Python เป็นหลัก** ตามรูปแบบโปรเจกต์ `django69_1` และ `library_htmx_proj`: มี `manage.py`, โฟลเดอร์ project สำหรับ settings/URL, โฟลเดอร์ app สำหรับ model/view/form/template และ static files แยกต่างหาก

## โครงสร้างโฟลเดอร์

```text
gamestrade/
├── manage.py                    # คำสั่งจัดการ Django
├── gametrade_project/           # settings, URL หลัก, ASGI, WSGI
├── gametrade_app/               # แอปหลักของระบบซื้อขาย
│   ├── apps.py                  # AppConfig
│   ├── models.py                # User, GameCategory, GamePost, Order, ChatRoom, ChatMessage
│   ├── forms.py                 # ฟอร์มสมัครสมาชิก เข้าสู่ระบบ ลงขาย และสั่งซื้อ
│   ├── views.py                 # หน้าเว็บ การค้นหา แบ่งหน้า และสิทธิ์ผู้ใช้
│   ├── urls.py                  # URL ของแอป
│   ├── admin.py                 # จัดการข้อมูลผ่าน Django Admin
│   ├── consumers.py             # WebSocket chat
│   ├── routing.py               # เส้นทาง WebSocket
│   ├── migrations/              # ประวัติโครงสร้างฐานข้อมูล
│   └── templates/               # หน้า HTML ของแอป
│       ├── index.html           # ตลาดและตัวกรอง
│       ├── login.html           # เข้าสู่ระบบและสมัครสมาชิก
│       ├── post_detail.html     # รายละเอียดประกาศ
│       ├── create_post.html     # เพิ่ม/แก้ไขประกาศ
│       ├── checkout.html        # สั่งซื้อ
│       ├── chat_room.html       # ห้องสนทนา
│       ├── admin_dashboard.html # แผงแอดมิน
│       └── partials/post_list.html # รายการและ pagination สำหรับ HTMX
├── templates/base.html          # layout กลาง ทุกหน้า extends ไฟล์นี้
├── static/
│   ├── css/site.css             # CSS เสริมจาก Tailwind
│   ├── js/site.js               # JavaScript เสริม
│   └── images/                  # รูปภาพที่เก็บในโปรเจกต์
├── db.sqlite3                  # ฐานข้อมูลสำหรับพัฒนา
├── setup_db.py                 # เตรียมข้อมูลเริ่มต้น
├── requirements.txt           # แพ็กเกจ Python
└── legacy_frontend/           # ต้นฉบับ React/Vite เดิม เก็บไว้อ้างอิง
```

## หน้าที่ของแต่ละเทคโนโลยี

| เทคโนโลยี | การใช้งาน |
| --- | --- |
| Django / Python | URL, model, form, view, template, authentication และการแบ่งหน้า |
| Tailwind CSS | รูปลักษณ์และ responsive layout ใน template |
| JavaScript / Alpine.js | พฤติกรรมเล็ก ๆ บนหน้าเว็บ เช่น เมนูมือถือและสถานะตัวกรอง |
| HTMX | ส่งคำค้นหาและเปลี่ยนหน้ารายการโดยอัปเดตเฉพาะส่วน `#listing-results` |

## Model และความสัมพันธ์

- `User` สืบทอด `AbstractUser` และเพิ่ม role, status, avatar และเบอร์โทร (`AUTH_USER_MODEL` ตั้งใน settings)
- `GameCategory` มีประกาศ `GamePost` ได้หลายรายการ
- `GamePost` เป็นประกาศของผู้ขายหนึ่งคน อยู่ในหมวดเกมหนึ่งหมวด
- `Order` เชื่อมผู้ซื้อกับประกาศและเก็บสถานะการสั่งซื้อ
- `ChatRoom` เชื่อมผู้ใช้กับประกาศที่เกี่ยวข้อง และมี `ChatMessage` หลายข้อความ

## Template, Pagination และ HTMX

ทุกหน้าใช้ `{% extends "base.html" %}` เพื่อแชร์ navigation, asset และ footer. หน้า `index.html` เรียก `{% include "partials/post_list.html" %}` สำหรับรายการสินค้า. ใน `views.index` จะค้นหา/กรอง/เรียงข้อมูลก่อนส่งเข้า `Paginator(posts, 12)` และใช้ `page_obj` สร้างลิงก์ก่อนหน้า/ถัดไป โดยคง query string ของตัวกรองไว้. ฟอร์มค้นหาและลิงก์แบ่งหน้าใช้ HTMX เพื่อแทนที่ `#listing-results`; ลิงก์และฟอร์มยังทำงานแบบ GET ปกติเมื่อ JavaScript ใช้ไม่ได้.

## User Authentication

`LoginForm` และ `RegisterForm` อยู่ใน `forms.py`; `login_view`, `register_view`, `logout_view` อยู่ใน `views.py`. Django session ดูแลสถานะการเข้าสู่ระบบ. หน้าเพิ่มประกาศ สั่งซื้อ แชท และแผงแอดมินใช้ `@login_required` รวมกับการตรวจสิทธิ์เฉพาะหน้า. เส้นทางหลังล็อกอินรับเฉพาะ URL ในโฮสต์เดียวกัน.

## เริ่มใช้งาน

ต้องมี Python และ pip จากนั้นรันในโฟลเดอร์ `gamestrade`:

```powershell
python -m pip install -r requirements.txt
python manage.py migrate
python setup_db.py
python manage.py runserver
```

เปิด `http://127.0.0.1:8000/` สำหรับหน้าเว็บ และ `/admin/` สำหรับ Django Admin. `setup_db.py` ใช้สำหรับเตรียมหมวดหมู่และข้อมูลตัวอย่าง; สามารถข้ามได้หากต้องการฐานข้อมูลว่าง. Tailwind CSS, Alpine.js และ HTMX โหลดผ่าน CDN จึงต้องเชื่อมต่ออินเทอร์เน็ตขณะเปิดหน้าเว็บ.

## บัญชีและการลงขาย

สมาชิกเข้าสู่ระบบที่ `/login/` และแอดมินที่ `/admin-login/` ระบบใช้การแฮชรหัสผ่านของ Django สำหรับทั้งสองประเภท และตรวจ `role` เพื่อแยกสิทธิ์ หากต้องการให้ `setup_db.py` สร้างบัญชีแอดมิน ให้ตั้งตัวแปร `GAMETRADE_ADMIN_PASSWORD` เป็นรหัสผ่านที่ต้องการก่อนเรียกสคริปต์ (บัญชี admin ที่มีอยู่จะไม่ถูกเปลี่ยนรหัสผ่าน)

หน้าลงขายรับรูปภาพจากเครื่องและเก็บใน `media/posts/` หลังเปลี่ยนโครงสร้างฐานข้อมูลให้รัน `python manage.py migrate` ก่อนใช้งานจริง สมาชิกและแอดมินสามารถเปิดกล่องแชทมุมขวาล่างได้ แอดมินเลือกห้องของสมาชิกแล้วตอบกลับ ข้อความจะอัปเดตทุก 4 วินาทีขณะเปิดกล่องแชท

ผู้ซื้อกด “ติดต่อแอดมินเพื่อซื้อ” จากหน้าประกาศเพื่อเปิดห้องแชทซื้อขายเฉพาะประกาศ ห้องนี้จะแสดงรายการที่กำลังซื้อและปุ่มแนบสลิป แอดมินเห็นห้องซื้อขายในรายการแชทมุมขวาล่าง ส่วนผู้ซื้อเปิดห้องเดิมได้จากรายการ “แชทซื้อขาย” ในกล่องแชทของตน

หน้าเว็บใช้โทนพื้นขาวกับสีม่วง–ชมพู–แดง และมีปุ่มสลับ Light/Dark ในแถบนำทาง สถานะธีมเก็บไว้ในเบราว์เซอร์ ไอคอนที่แสดงบนเว็บใช้ SVG จาก `templates/partials/icon_symbols.html`

แอดมินกด “แชทผู้ขาย” ในรายการคำสั่งซื้อเพื่อเปิดห้องส่วนตัวกับผู้ขาย เมื่ออนุมัติคำสั่งซื้อ ระบบเปิดห้องผู้ขายและส่งข้อความให้ติดต่อเรื่องส่งมอบไอดีและบัญชีรับเงิน ผู้ขายจะเห็นห้องนี้ในกล่องแชทมุมขวาล่าง ข้อมูลในห้องผู้ขายเข้าถึงได้เฉพาะผู้ขายรายนั้นกับแอดมิน การโอนเงินให้ผู้ขายยังทำด้วยตนเองนอกระบบ

## ข้อมูลใน Git

รีโปนี้เก็บไฟล์ฐานข้อมูล `db.sqlite3` ตามที่เจ้าของโปรเจกต์ต้องการ จึงมีข้อมูลผู้ใช้และ session อยู่ในไฟล์นี้ ส่วนไฟล์อัปโหลดใน `media/` และ Python cache ไม่รวมอยู่ในรีโป ตั้งค่า `DJANGO_SECRET_KEY` ผ่าน environment เมื่อเผยแพร่เว็บจริง
