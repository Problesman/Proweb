import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Code2, Copy, Check, FileCode, Server, Database, MessageSquare } from 'lucide-react';

export const DjangoCodeModal: React.FC = () => {
  const { setCurrentView } = useApp();
  const [activeFile, setActiveFile] = useState<'models' | 'admin' | 'views' | 'urls' | 'consumers' | 'alpine'>('models');
  const [copied, setCopied] = useState(false);

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const djangoFiles = {
    models: `# ==============================================================
# GameTrade Hub - Django Models (models.py)
# โครงงานวิชา: GameTrade Hub (ระบบซื้อขายไอดีเกม)
# ผู้วิจัย/จัดทำ: นายณัฐชนน สิงห์ศรี รหัสนักศึกษา 68114640228
# ==============================================================

from django.db import models
from django.contrib.auth.models import AbstractUser

# 1. Custom User Model
class User(AbstractUser):
    ROLE_CHOICES = (
        ('Member', 'Member'),
        ('Admin', 'Admin'),
    )
    STATUS_CHOICES = (
        ('Active', 'Active'),
        ('Banned', 'Banned'),
    )
    
    user_id = models.AutoField(primary_key=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='Member')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Active')
    avatar = models.URLField(blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.username} ({self.role})"


# 2. GameCategory Model (หมวดหมู่เกม)
class GameCategory(models.Model):
    category_id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=100, unique=True, verbose_name="ชื่อเกม")
    logo = models.URLField(verbose_name="รูปภาพโลโก้")

    def __str__(self):
        return self.name


# 3. GamePost Model (โพสต์ขายไอดีเกม - CRUD)
class GamePost(models.Model):
    STATUS_CHOICES = (
        ('Available', 'พร้อมขาย (Available)'),
        ('Pending', 'กำลังดำเนินการ (Pending)'),
        ('Sold', 'ขายแล้ว (Sold)'),
    )

    post_id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=255, verbose_name="หัวข้อโพสต์")
    description = models.TextField(verbose_name="รายละเอียดบัญชีเกม")
    price = models.DecimalField(max_digits=10, decimal_places=2, verbose_name="ราคา")
    image = models.URLField(verbose_name="รูปภาพประกอบ")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Available')
    
    server = models.CharField(max_length=50, blank=True, null=True)
    rank = models.CharField(max_length=50, blank=True, null=True)
    level = models.IntegerField(default=1)
    skins_count = models.IntegerField(default=0)
    original_email = models.BooleanField(default=True)
    battle_pass = models.BooleanField(default=False)
    secondary_verification = models.BooleanField(default=False)
    
    # ข้อมูลไอดีสำหรับส่งมอบผ่านคนกลาง
    game_credentials_note = models.CharField(max_length=255, blank=True, null=True)

    seller = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    category = models.ForeignKey(GameCategory, on_delete=models.CASCADE, related_name='posts')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.title} - {self.price} THB"


# 4. Order Model (การสั่งซื้อและแนบสลิป)
class Order(models.Model):
    STATUS_CHOICES = (
        ('Pending', 'รอดำเนินการ (Pending)'),
        ('Completed', 'สำเร็จ (Completed)'),
        ('Cancelled', 'ยกเลิก (Cancelled)'),
    )

    order_id = models.AutoField(primary_key=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    slip_image = models.URLField(verbose_name="ไฟล์สลิปการโอน")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='Pending')
    notes = models.TextField(blank=True, null=True)
    
    buyer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='orders')
    post = models.ForeignKey(GamePost, on_delete=models.CASCADE, related_name='orders')
    order_date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.order_id} - {self.buyer.username} ({self.status})"


# 5. ChatRoom Model (ห้องแชทระหว่าง Member และ Admin Middleman)
class ChatRoom(models.Model):
    room_id = models.AutoField(primary_key=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chat_rooms')
    title = models.CharField(max_length=200, blank=True, null=True)
    related_post = models.ForeignKey(GamePost, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Room #{self.room_id} - {self.user.username}"


# 6. ChatMessage Model (ข้อความในห้องแชทแบบ Real-time)
class ChatMessage(models.Model):
    message_id = models.AutoField(primary_key=True)
    text_content = models.TextField(blank=True, null=True)
    image_url = models.URLField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)
    is_system = models.BooleanField(default=False)
    
    room = models.ForeignKey(ChatRoom, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')

    def __str__(self):
        return f"Message #{self.message_id} from {self.sender.username}"
`,

    admin: `# ==============================================================
# GameTrade Hub - Django Admin (admin.py)
# ปรับแต่งหน้า Admin Dashboard ตาม Requirement ข้อ 6
# ==============================================================

from django.contrib import admin
from .models import User, GameCategory, GamePost, Order, ChatRoom, ChatMessage

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'username', 'email', 'role', 'status', 'created_at')
    list_filter = ('role', 'status')
    search_fields = ('username', 'email')
    actions = ['ban_users', 'unban_users']

    def ban_users(self, request, queryset):
        queryset.update(status='Banned')
    ban_users.short_description = "ระงับบัญชีผู้ใช้ที่เลือก (Ban)"

    def unban_users(self, request, queryset):
        queryset.update(status='Active')
    unban_users.short_description = "ปลดแบนบัญชีผู้ใช้ที่เลือก (Unban)"


@admin.register(GameCategory)
class GameCategoryAdmin(admin.ModelAdmin):
    list_display = ('category_id', 'name', 'logo')
    search_fields = ('name',)


@admin.register(GamePost)
class GamePostAdmin(admin.ModelAdmin):
    list_display = ('post_id', 'title', 'price', 'category', 'seller', 'status', 'created_at')
    list_filter = ('status', 'category')
    search_fields = ('title', 'description')


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_id', 'buyer', 'post', 'amount', 'status', 'order_date')
    list_filter = ('status',)
    actions = ['approve_order']

    def approve_order(self, request, queryset):
        queryset.update(status='Completed')
    approve_order.short_description = "อนุมัติสลิปและโอนสิทธิ์สำเร็จ (Approve)"


@admin.register(ChatRoom)
class ChatRoomAdmin(admin.ModelAdmin):
    list_display = ('room_id', 'user', 'title', 'created_at')


@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ('message_id', 'room', 'sender', 'timestamp', 'is_read')
`,

    views: `# ==============================================================
# GameTrade Hub - Django Views & API (views.py)
# รองรับทั้ง Template Rendering (Tailwind+AlpineJS) และ REST API
# ==============================================================

from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from .models import GamePost, GameCategory, Order, ChatRoom, ChatMessage

def index(request):
    """หน้าแรก Marketplace แสดงรายการไอดีเกมและตัวกรอง"""
    categories = GameCategory.objects.all()
    posts = GamePost.objects.filter(status='Available').order_by('-created_at')
    return render(request, 'gametrade/index.html', {
        'categories': categories,
        'posts': posts
    })

def post_detail(request, post_id):
    """หน้าแสดงรายละเอียดไอดีเกมแบบละเอียด"""
    post = get_object_or_404(GamePost, post_id=post_id)
    return render(request, 'gametrade/post_detail.html', {'post': post})

@login_required
def create_post(request):
    """สร้างประกาศขายไอดีใหม่ (รองรับ 7 components)"""
    if request.method == 'POST':
        category = get_object_or_404(GameCategory, category_id=request.POST.get('category'))
        new_post = GamePost.objects.create(
            title=request.POST.get('title'),
            price=request.POST.get('price'),
            category=category,
            description=request.POST.get('description'),
            image=request.POST.get('image'),
            seller=request.user,
            server=request.POST.get('server'),
            rank=request.POST.get('rank'),
            original_email=request.POST.get('original_email') == 'on',
            battle_pass=request.POST.get('battle_pass') == 'on',
            game_credentials_note=request.POST.get('credentials')
        )
        return redirect('post_detail', post_id=new_post.post_id)
    return render(request, 'gametrade/create_post.html')

@login_required
def create_order_with_slip(request, post_id):
    """สั่งซื้อและแนบสลิปผ่านระบบคนกลาง"""
    post = get_object_or_404(GamePost, post_id=post_id)
    if request.method == 'POST':
        order = Order.objects.create(
            amount=post.price,
            slip_image=request.POST.get('slip_image'),
            buyer=request.user,
            post=post,
            status='Pending'
        )
        post.status = 'Pending'
        post.save()
        return redirect('my_orders')
    return render(request, 'gametrade/checkout.html', {'post': post})
`,

    consumers: `# ==============================================================
# GameTrade Hub - Django Channels WebSocket Consumer (consumers.py)
# รองรับ Real-time Chat ระหว่าง Member และ Admin Middleman
# ==============================================================

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import ChatRoom, ChatMessage, User

class MiddlemanChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'chat_{self.room_id}'

        # เข้าร่วม Group ห้องแชท
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        message = data.get('message', '')
        image_url = data.get('image_url', '')
        sender_id = data.get('sender_id')

        # บันทึกลงฐานข้อมูล Database
        saved_msg = await self.save_message(self.room_id, sender_id, message, image_url)

        # กระจายข้อความแบบ Real-time ไปยังทุกคนในห้อง
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'image_url': image_url,
                'sender_id': sender_id,
                'timestamp': str(saved_msg.timestamp)
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps(event))

    @database_sync_to_async
    def save_message(self, room_id, sender_id, text, image_url):
        room = ChatRoom.objects.get(room_id=room_id)
        sender = User.objects.get(user_id=sender_id)
        return ChatMessage.objects.create(
            room=room,
            sender=sender,
            text_content=text,
            image_url=image_url
        )
`,

    urls: `# ==============================================================
# GameTrade Hub - URL Configuration (urls.py)
# ==============================================================

from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('post/<int:post_id>/', views.post_detail, name='post_detail'),
    path('post/new/', views.create_post, name='create_post'),
    path('order/<int:post_id>/', views.create_order_with_slip, name='create_order'),
    path('chat/<int:room_id>/', views.chat_room, name='chat_room'),
    path('admin-dashboard/', views.admin_dashboard, name='admin_dashboard'),
]
`,

    alpine: `<!-- ==============================================================
     GameTrade Hub - AlpineJS + Tailwind CSS Frontend Components
     ภาษาเสริมตามโจทย์: Tailwind CSS, JS & AlpineJS
     ============================================================== -->

<!-- ตัวอย่าง: Search & Filter Component ด้วย AlpineJS -->
<div x-data="{
    search: '',
    category: 'all',
    priceMin: 0,
    priceMax: 50000,
    sort: 'latest',
    posts: [],
    filterPosts() {
        return this.posts.filter(p => {
            return (this.category === 'all' || p.category_id == this.category) &&
                   (p.price >= this.priceMin && p.price <= this.priceMax) &&
                   (p.title.toLowerCase().includes(this.search.toLowerCase()));
        });
    }
}" class="max-w-7xl mx-auto px-4 py-6">

    <!-- Search Input Bar Styled with Tailwind CSS -->
    <div class="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-xl p-3 shadow-lg">
        <input 
            type="text" 
            x-model="search" 
            placeholder="ค้นหาไอดีเกม, สกิน, แรงค์..."
            class="flex-1 bg-transparent text-white text-sm outline-none px-2"
        />
        <select x-model="category" class="bg-slate-800 text-slate-300 text-xs rounded-lg px-3 py-1.5 border border-slate-700">
            <option value="all">ทุกเกม</option>
            <option value="1">Valorant</option>
            <option value="2">ROV</option>
            <option value="3">Genshin Impact</option>
        </select>
    </div>

    <!-- Live Middleman Real-time Chat Component with AlpineJS & WebSockets -->
    <div x-data="{
        messages: [],
        newMessage: '',
        ws: null,
        init() {
            this.ws = new WebSocket('ws://' + window.location.host + '/ws/chat/12345/');
            this.ws.onmessage = (e) => {
                const data = JSON.parse(e.data);
                this.messages.push(data);
            };
        },
        sendMessage() {
            if (!this.newMessage.trim()) return;
            this.ws.send(JSON.stringify({ message: this.newMessage }));
            this.newMessage = '';
        }
    }" class="mt-6 bg-[#0f172a] rounded-2xl p-4 border border-cyan-800/40">
        <div class="h-64 overflow-y-auto space-y-2 p-2">
            <template x-for="msg in messages" :key="msg.timestamp">
                <div class="p-2.5 rounded-xl bg-slate-800 text-xs text-white" x-text="msg.message"></div>
            </template>
        </div>
        <div class="flex gap-2 mt-3">
            <input type="text" x-model="newMessage" @keydown.enter="sendMessage()" placeholder="พิมพ์ข้อความคนกลาง..." class="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white" />
            <button @click="sendMessage()" class="px-4 py-2 bg-cyan-400 text-black font-bold text-xs rounded-xl">ส่ง</button>
        </div>
    </div>
</div>
`
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Header */}
      <div className="bg-[#0f172a] rounded-2xl border border-amber-900/40 p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/40 flex items-center gap-1">
              <Server className="w-3 h-3" /> Python Django + Tailwind + AlpineJS Architecture
            </span>
            <span className="text-xs text-slate-400">สำหรับ Class Project Proposal</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1">
            GameTrade Hub - โครงสร้างซอร์สโค้ดภาษา Django Python & AlpineJS
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            สร้างตามข้อกำหนดของโครงงาน 6 Models, CRUD, WebSocket Channels, และ Tailwind Form 7 components ครบถ้วน
          </p>
        </div>

        <button
          onClick={() => copyCode(djangoFiles[activeFile])}
          className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md shadow-amber-500/20 transition-all shrink-0"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-950" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'คัดลอกโค้ดสำเร็จ!' : `คัดลอกไฟล์ ${activeFile}.py`}</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveFile('models')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeFile === 'models'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Database className="w-4 h-4" />
          models.py (6 Database Models)
        </button>

        <button
          onClick={() => setActiveFile('admin')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeFile === 'admin'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          <FileCode className="w-4 h-4" />
          admin.py (Dashboard & Moderation)
        </button>

        <button
          onClick={() => setActiveFile('views')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeFile === 'views'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Server className="w-4 h-4" />
          views.py (Marketplace & CRUD)
        </button>

        <button
          onClick={() => setActiveFile('consumers')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeFile === 'consumers'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          consumers.py (Channels WebSocket Chat)
        </button>

        <button
          onClick={() => setActiveFile('urls')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeFile === 'urls'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
              : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Code2 className="w-4 h-4" />
          urls.py (Routing)
        </button>

        <button
          onClick={() => setActiveFile('alpine')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeFile === 'alpine'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
              : 'text-slate-400 hover:bg-slate-800'
          }`}
        >
          <Code2 className="w-4 h-4 text-cyan-400" />
          AlpineJS + Tailwind (HTML Snippets)
        </button>
      </div>

      {/* Code Display Area */}
      <div className="bg-[#090d16] rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
        <div className="bg-slate-900/90 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="font-mono text-cyan-400">
            {activeFile === 'alpine' ? 'templates/gametrade/index.html' : `gametrade_app/${activeFile}.py`}
          </span>
          <span>{activeFile === 'alpine' ? 'HTML + Alpine.js + Tailwind' : 'Python 3.11 / Django 5.x'}</span>
        </div>
        <pre className="p-4 sm:p-6 overflow-x-auto text-xs sm:text-sm font-mono text-slate-200 leading-relaxed max-h-[600px]">
          <code>{djangoFiles[activeFile]}</code>
        </pre>
      </div>
    </div>
  );
};
