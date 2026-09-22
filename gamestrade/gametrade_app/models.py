"""
GameTrade Hub - Database Models (Django ORM)
Class Project Proposal: GameTrade Hub (ระบบซื้อขายไอดีเกม)
Author: นายณัฐชนน สิงห์ศรี รหัสนักศึกษา 68114640228
"""

from django.db import models
from django.contrib.auth.models import AbstractUser

# -------------------------------------------------------------
# Model 1: User (ผู้ใช้งาน)
# -------------------------------------------------------------
class User(AbstractUser):
    ROLE_CHOICES = (
        ('Member', 'Member (สมาชิกผู้ซื้อ/ผู้ขาย)'),
        ('Admin', 'Admin (ผู้ดูแลระบบ & คนกลาง Escrow)'),
    )
    STATUS_CHOICES = (
        ('Active', 'Active (ปกติ)'),
        ('Banned', 'Banned (ระงับการใช้งาน)'),
    )

    user_id = models.AutoField(primary_key=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='Member')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')
    avatar = models.URLField(max_length=500, blank=True, null=True, default='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80')
    phone = models.CharField(max_length=20, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.username} [{self.role}] - {self.status}"


# -------------------------------------------------------------
# Model 2: GameCategory (หมวดหมู่เกม)
# -------------------------------------------------------------
class GameCategory(models.Model):
    category_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True, verbose_name="ชื่อเกม")
    logo = models.URLField(max_length=500, verbose_name="รูปภาพโลโก้")

    class Meta:
        verbose_name_plural = "Game Categories"

    def __str__(self):
        return self.name


# -------------------------------------------------------------
# Model 3: GamePost (โพสต์ขายไอดีเกม)
# -------------------------------------------------------------
class GamePost(models.Model):
    STATUS_CHOICES = (
        ('Available', 'Available (พร้อมขาย)'),
        ('Pending', 'Pending (กำลังดำเนินการ/รอตรวจสลิป)'),
        ('Sold', 'Sold (ขายแล้ว)'),
    )

    post_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255, verbose_name="หัวข้อโพสต์")
    description = models.TextField(verbose_name="รายละเอียดบัญชีเกม")
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="ราคา (THB)")
    image = models.URLField(max_length=500, verbose_name="รูปภาพประกอบ")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Available')
    
    server = models.CharField(max_length=100, blank=True, null=True, verbose_name="เซิร์ฟเวอร์")
    rank = models.CharField(max_length=100, blank=True, null=True, verbose_name="ระดับแรงค์")
    level = models.IntegerField(default=1, verbose_name="เลเวล")
    skins_count = models.IntegerField(default=0, verbose_name="จำนวนสกิน")
    original_email = models.BooleanField(default=True, verbose_name="เมลแท้")
    battle_pass = models.BooleanField(default=False, verbose_name="Battle Pass")
    secondary_verification = models.BooleanField(default=False, verbose_name="ยินดีตรวจบัตร ปชช.")
    game_credentials_note = models.CharField(max_length=500, blank=True, null=True, verbose_name="ข้อมูลรหัสสำหรับคนกลาง")

    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts', verbose_name="ผู้ขาย")
    category = models.ForeignKey(GameCategory, on_delete=models.CASCADE, related_name='posts', verbose_name="หมวดหมู่เกม")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="วันที่ลงขาย")

    def __str__(self):
        return f"[{self.category.name}] {self.title} - {self.price} THB"


# -------------------------------------------------------------
# Model 4: Order (การสั่งซื้อและแนบสลิป)
# -------------------------------------------------------------
class Order(models.Model):
    STATUS_CHOICES = (
        ('Pending', 'Pending (รอดำเนินการตรวจสลิป)'),
        ('Completed', 'Completed (สำเร็จ/ส่งมอบไอดีแล้ว)'),
        ('Cancelled', 'Cancelled (ยกเลิก/สลิปไม่ถูกต้อง)'),
    )

    order_id = models.AutoField(primary_key=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="จำนวนเงิน")
    slip_image = models.URLField(max_length=500, verbose_name="ไฟล์สลิปการโอน")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    notes = models.TextField(blank=True, null=True, verbose_name="หมายเหตุ")
    
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders', verbose_name="ผู้ซื้อ")
    post = models.ForeignKey(GamePost, on_delete=models.CASCADE, related_name='orders', verbose_name="โพสต์ที่สั่งซื้อ")
    order_date = models.DateTimeField(auto_now_add=True, verbose_name="วันที่ทำรายการ")

    def __str__(self):
        return f"Order #{self.order_id} - {self.buyer.username} ({self.amount} THB)"


# -------------------------------------------------------------
# Model 5: ChatRoom (ห้องแชท)
# -------------------------------------------------------------
class ChatRoom(models.Model):
    room_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chat_rooms', verbose_name="ผู้ใช้งานที่เปิดแชท")
    title = models.CharField(max_length=255, blank=True, null=True, verbose_name="หัวข้อห้องแชท")
    related_post = models.ForeignKey(GamePost, on_delete=models.SET_NULL, null=True, blank=True, verbose_name="ไอดีเกมที่เกี่ยวข้อง")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="วันที่เปิดห้องแชท")

    def __str__(self):
        return f"Room #{self.room_id} - {self.title or self.user.username}"


# -------------------------------------------------------------
# Model 6: ChatMessage (ข้อความในแชท)
# -------------------------------------------------------------
class ChatMessage(models.Model):
    message_id = models.AutoField(primary_key=True)
    text_content = models.TextField(blank=True, null=True, verbose_name="ข้อความ")
    image_url = models.URLField(max_length=500, blank=True, null=True, verbose_name="ไฟล์แนบ (รูปภาพ/สลิป)")
    timestamp = models.DateTimeField(auto_now_add=True, verbose_name="วันและเวลาที่ส่ง")
    is_read = models.BooleanField(default=False, verbose_name="สถานะการอ่าน")
    is_system = models.BooleanField(default=False, verbose_name="ข้อความจากระบบคนกลาง")

    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='messages', verbose_name="รหัสห้องแชท")
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages', verbose_name="ผู้ส่งข้อความ")

    def __str__(self):
        return f"Msg #{self.message_id} in Room #{self.room.room_id} by {self.sender.username}"
