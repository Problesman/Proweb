import os
import sys
import django

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")

# Set Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'gametrade_project.settings')
django.setup()

from django.core.management import call_command
from gametrade_app.models import GameCategory, User

def setup():
    print("==================================================")
    print("GameTrade Hub - Database Setup (Clean & Ready)")
    print("==================================================")
    
    print("\n[1/3] กำลังเตรียมโครงสร้างตารางฐานข้อมูล (Migrations)...")
    try:
        call_command('makemigrations', 'gametrade_app')
    except Exception as e:
        print(f"makemigrations note: {e}")
        
    call_command('migrate')
    print("[OK] SQLite tables are ready")

    print("\n[2/3] กำลังเตรียมหมวดหมู่เกมสำหรับเลือกลงขาย...")
    categories_data = [
        {"name": "Valorant", "logo": "images/categories/valorant.png"},
        {"name": "ROV (Realm of Valor)", "logo": "images/categories/rov.png"},
        {"name": "League of Legends", "logo": "images/categories/lol.png"},
        {"name": "Roblox", "logo": "images/categories/roblox.png"},
        {"name": "Apex Legends", "logo": "images/categories/apex.png"},
    ]

    for cat in categories_data:
        obj, created = GameCategory.objects.get_or_create(name=cat["name"], defaults={"logo": cat["logo"]})
        if created:
            print(f"  + เพิ่มหมวดหมู่: {cat['name']}")

    print("[OK] Game categories ready")

    print("\n[3/3] ตรวจสอบบัญชีแอดมิน (Admin Superuser)...")
    if not User.objects.filter(username='admin').exists():
        admin_password = os.environ.get('GAMETRADE_ADMIN_PASSWORD')
        if admin_password:
            User.objects.create_superuser(
                username='admin',
                email='admin@gametrade.com',
                password=admin_password,
                role='Admin'
            )
            print("  + สร้าง Superuser: admin")
        else:
            print("  ! ตั้งค่า GAMETRADE_ADMIN_PASSWORD แล้วรัน setup_db.py อีกครั้งเพื่อสร้าง admin")
    else:
        print("  [OK] admin user already exists")

    print("\n==================================================")
    print("Ready. Start with: python manage.py runserver")
    print("==================================================")

if __name__ == '__main__':
    setup()
