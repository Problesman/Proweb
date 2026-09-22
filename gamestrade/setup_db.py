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
        {"name": "Valorant", "logo": "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=120&h=120&q=80"},
        {"name": "ROV (Realm of Valor)", "logo": "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=120&h=120&q=80"},
        {"name": "Genshin Impact", "logo": "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=120&h=120&q=80"},
        {"name": "Free Fire", "logo": "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=120&h=120&q=80"},
        {"name": "League of Legends", "logo": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=120&h=120&q=80"},
        {"name": "EA FC Mobile", "logo": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=120&h=120&q=80"},
    ]

    for cat in categories_data:
        obj, created = GameCategory.objects.get_or_create(name=cat["name"], defaults={"logo": cat["logo"]})
        if created:
            print(f"  + เพิ่มหมวดหมู่: {cat['name']}")

    print("[OK] Game categories ready")

    print("\n[3/3] ตรวจสอบบัญชีผู้ดูแลระบบ (Admin Superuser)...")
    if not User.objects.filter(username='admin').exists():
        admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@gametrade.com',
            password='adminpassword123',
            role='Admin'
        )
        print("  + สร้าง Superuser: admin (รหัสผ่าน: adminpassword123)")
    else:
        print("  [OK] admin user already exists")

    print("\n==================================================")
    print("Ready. Start with: python manage.py runserver")
    print("==================================================")

if __name__ == '__main__':
    setup()
