"""
GameTrade Hub - Django Views
Class Project Proposal: GameTrade Hub (ระบบซื้อขายไอดีเกม)
Author: นายณัฐชนน สิงห์ศรี รหัสนักศึกษา 68114640228
"""

from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse, Http404
from django.contrib import messages
from django.db.models import Q, Count, Sum
from django.db import transaction
from django.db.utils import OperationalError
from django.core.management import call_command
from django.core.paginator import Paginator
from django.utils.http import url_has_allowed_host_and_scheme
from django.views.decorators.http import require_POST, require_GET
from django.http import HttpResponseForbidden
import json
from decimal import Decimal, ROUND_HALF_UP
from urllib.parse import urlencode
from .models import User, GameCategory, GamePost, Order, ChatRoom, ChatMessage
from .forms import GamePostForm, OrderSlipForm, LoginForm, RegisterForm

def ensure_tables():
    """ระบบตรวจเช็กและสร้างตารางฐานข้อมูลอัตโนมัติหากยังไม่ได้ migrate ป้องกัน OperationalError"""
    try:
        list(GameCategory.objects.all()[:1])
    except OperationalError:
        try:
            call_command('makemigrations', 'gametrade_app')
            call_command('migrate')
            # Seed default categories
            default_categories = [
                {"name": "Valorant", "logo": "images/categories/valorant.png"},
                {"name": "ROV (Realm of Valor)", "logo": "images/categories/rov.png"},
                {"name": "League of Legends", "logo": "images/categories/lol.png"},
                {"name": "Roblox", "logo": "images/categories/roblox.png"},
                {"name": "Apex Legends", "logo": "images/categories/apex.png"},
            ]
            for cat in default_categories:
                GameCategory.objects.get_or_create(name=cat["name"], defaults={"logo": cat["logo"]})
        except Exception:
            pass

# -------------------------------------------------------------
# Auth: Login / Register / Logout
# -------------------------------------------------------------
def login_view(request):
    if request.user.is_authenticated:
        return redirect('index')
    if request.method == 'POST':
        form = LoginForm(request, data=request.POST)
        if form.is_valid():
            candidate = form.get_user()
            if candidate.role == 'Admin':
                form.add_error(None, 'บัญชีแอดมินกรุณาเข้าสู่ระบบผ่านหน้าแอดมิน')
            elif candidate.status != 'Active':
                form.add_error(None, 'บัญชีนี้ถูกระงับการใช้งาน')
            else:
                login(request, candidate)
                messages.success(request, f'ยินดีต้อนรับ {request.user.username}')
                next_url = request.POST.get('next') or request.GET.get('next')
                if next_url and url_has_allowed_host_and_scheme(next_url, allowed_hosts={request.get_host()}):
                    return redirect(next_url)
                return redirect('index')
    else:
        form = LoginForm()
    return render(request, 'login.html', {'form': form, 'mode': 'login'})


def admin_login_view(request):
    """Admin-only login entry; Django still performs password hashing and session auth."""
    if request.user.is_authenticated:
        if request.user.role == 'Admin':
            return redirect('admin_dashboard')
    if request.method == 'POST':
        form = LoginForm(request, data=request.POST)
        if form.is_valid():
            candidate = form.get_user()
            if candidate.role == 'Admin' and candidate.is_active and candidate.status == 'Active':
                login(request, candidate)
                return redirect('admin_dashboard')
            form.add_error(None, 'บัญชีนี้ไม่ได้รับสิทธิ์แอดมิน')
    else:
        form = LoginForm()
    return render(request, 'login.html', {'form': form, 'mode': 'login', 'admin_login': True})


def register_view(request):
    if request.user.is_authenticated:
        return redirect('index')
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, 'สมัครสมาชิกสำเร็จ')
            return redirect('index')
    else:
        form = RegisterForm()
    return render(request, 'login.html', {'form': form, 'mode': 'register'})


def logout_view(request):
    logout(request)
    messages.success(request, 'ออกจากระบบแล้ว')
    return redirect('index')


# -------------------------------------------------------------
# 1. หน้าแรก Marketplace (Search & Filter)
# -------------------------------------------------------------
def index(request):
    ensure_tables()
    try:
        categories = list(GameCategory.objects.all())
        posts = GamePost.objects.exclude(status='Sold').order_by('-created_at')
    except OperationalError:
        categories = []
        posts = []

    # Query Search & Filter
    if hasattr(posts, 'filter'):
        q = request.GET.get('q', '').strip()
        if q:
            posts = posts.filter(
                Q(title__icontains=q) | 
                Q(description__icontains=q) | 
                Q(rank__icontains=q) |
                Q(seller__username__icontains=q)
            )

        # Category Filter
        category_id = request.GET.get('category')
        if category_id and category_id != 'all':
            posts = posts.filter(category_id=category_id)

        # Price Range Filter
        min_price = request.GET.get('min_price')
        max_price = request.GET.get('max_price')
        if min_price:
            posts = posts.filter(price__gte=min_price)
        if max_price:
            posts = posts.filter(price__lte=max_price)

        # Status Filter
        status = request.GET.get('status')
        if status and status != 'all':
            posts = posts.filter(status=status)

        # Sorting
        sort = request.GET.get('sort', 'latest')
        if sort == 'price_low':
            posts = posts.order_by('price')
        elif sort == 'price_high':
            posts = posts.order_by('-price')
        else:
            posts = posts.order_by('-created_at')
    else:
        category_id = 'all'
        q = ''
        sort = 'latest'

    paginator = Paginator(posts, 12)
    page_obj = paginator.get_page(request.GET.get('page'))
    context = {
        'categories': categories,
        'posts': page_obj.object_list,
        'page_obj': page_obj,
        'is_paginated': page_obj.has_other_pages(),
        'query_string': urlencode({key: value for key, value in request.GET.items() if key != 'page'}),
        'selected_category': category_id,
        'search_query': q,
        'sort': sort,
    }
    return render(request, 'index.html', context)


# -------------------------------------------------------------
# 2. ดูรายละเอียดโพสต์ (Post Detail)
# -------------------------------------------------------------
def post_detail(request, post_id):
    post = get_object_or_404(GamePost, post_id=post_id)
    if post.status == 'Sold':
        can_view = request.user.is_authenticated and (
            request.user.role == 'Admin' or post.seller_id == request.user.pk
        )
        if not can_view and request.user.is_authenticated:
            can_view = Order.objects.filter(
                post=post, buyer=request.user, status='Completed'
            ).exists()
        if not can_view:
            raise Http404('ไม่พบโพสต์นี้')
    return render(request, 'post_detail.html', {'post': post})


# -------------------------------------------------------------
# 3. เพิ่มโพสต์ขายไอดีใหม่ (Create - Form 7 Components)
# -------------------------------------------------------------
@login_required
def create_post(request):
    if request.user.status == 'Banned' or not (request.user.role == 'Member' or request.user.role == 'Admin'):
        messages.error(request, 'บัญชีของคุณถูกระงับการใช้งาน ไม่สามารถลงขายได้')
        return redirect('index')

    if request.method == 'POST':
        form = GamePostForm(request.POST, request.FILES)
        if form.is_valid():
            new_post = form.save(commit=False)
            new_post.seller = request.user
            new_post.save()
            messages.success(request, f'ลงขายไอดี "{new_post.title}" สำเร็จ!')
            return redirect('post_detail', post_id=new_post.post_id)
    else:
        form = GamePostForm()

    return render(request, 'create_post.html', {'form': form, 'is_edit': False})


# -------------------------------------------------------------
# 4. แก้ไขโพสต์ (Update)
# -------------------------------------------------------------
@login_required
def update_post(request, post_id):
    post = get_object_or_404(GamePost, post_id=post_id)
    if post.seller != request.user and request.user.role != 'Admin':
        messages.error(request, 'คุณไม่มีสิทธิ์แก้ไขโพสต์นี้')
        return redirect('index')

    if request.method == 'POST':
        form = GamePostForm(request.POST, request.FILES, instance=post)
        if form.is_valid():
            form.save()
            messages.success(request, 'อัปเดตข้อมูลโพสต์สำเร็จ')
            return redirect('post_detail', post_id=post.post_id)
    else:
        form = GamePostForm(instance=post)

    return render(request, 'create_post.html', {'form': form, 'is_edit': True, 'post': post})


# -------------------------------------------------------------
# 5. ลบโพสต์ (Delete)
# -------------------------------------------------------------
@login_required
def delete_post(request, post_id):
    post = get_object_or_404(GamePost, post_id=post_id)
    if post.seller != request.user and request.user.role != 'Admin':
        messages.error(request, 'คุณไม่มีสิทธิ์ลบโพสต์นี้')
        return redirect('index')

    post.delete()
    messages.success(request, 'ลบโพสต์ไอดีเกมสำเร็จ')
    return redirect('index')


# -------------------------------------------------------------
# 6. สั่งซื้อและแนบสลิปผ่านคนกลาง (Order & Slip Upload)
# -------------------------------------------------------------
@login_required
@require_POST
def start_purchase_chat(request, post_id):
    post = get_object_or_404(GamePost, post_id=post_id)
    if request.user.status != 'Active' or request.user.role == 'Admin' or post.seller_id == request.user.pk:
        return HttpResponseForbidden()
    room = ChatRoom.objects.filter(user=request.user, related_post=post).first()
    if room:
        return redirect('chat_room', room_id=room.room_id)
    if post.status != 'Available':
        messages.error(request, 'ประกาศนี้ไม่พร้อมขายแล้ว')
        return redirect('post_detail', post_id=post.pk)
    room = ChatRoom.objects.create(user=request.user, related_post=post, title=f'ซื้อขายไอดี {post.title}')
    ChatMessage.objects.create(room=room, sender=request.user, text_content=f'สนใจซื้อไอดี {post.title} ราคา {post.price:,.2f} บาท')
    return redirect('chat_room', room_id=room.room_id)


@login_required
def create_order(request, post_id):
    post = get_object_or_404(GamePost, post_id=post_id)
    if post.seller == request.user or request.user.role == 'Admin' or request.user.status != 'Active':
        messages.error(request, 'คุณไม่สามารถซื้อไอดีของตัวเองได้')
        return redirect('post_detail', post_id=post.post_id)
    room = ChatRoom.objects.filter(user=request.user, related_post=post).first()
    if not room:
        messages.info(request, 'กรุณาติดต่อแอดมินผ่านแชทก่อนแนบสลิป')
        return redirect('post_detail', post_id=post.post_id)
    existing_order = Order.objects.filter(buyer=request.user, post=post).order_by('-order_date').first()
    if existing_order and existing_order.status in ('Pending', 'Completed'):
        return redirect('chat_room', room_id=room.room_id)
    if post.status != 'Available':
        messages.error(request, 'ประกาศนี้ไม่พร้อมขายแล้ว')
        return redirect('chat_room', room_id=room.room_id)

    if request.method == 'POST':
        form = OrderSlipForm(request.POST, request.FILES)
        if form.is_valid():
            order = form.save(commit=False)
            order.buyer = request.user
            order.post = post
            order.amount = post.price
            order.status = 'Pending'
            order.save()

            # ปรับสถานะโพสต์เป็น Pending
            post.status = 'Pending'
            post.save()

            # สร้างหรือผูกห้องแชทคนกลาง
            ChatMessage.objects.create(
                room=room,
                sender=request.user,
                text_content=f"สวัสดีครับ ทำการสั่งซื้อไอดี {post.title} และแนบสลิปยอด {order.amount:,.2f} THB เรียบร้อยแล้วครับ",
                image_url=order.display_slip_url,
                is_system=False
            )

            messages.success(request, 'สั่งซื้อและส่งหลักฐานสลิปเข้าสู่ระบบคนกลางเรียบร้อย')
            return redirect('chat_room', room_id=room.room_id)
    else:
        form = OrderSlipForm()

    return render(request, 'checkout.html', {'post': post, 'form': form, 'room': room})


# -------------------------------------------------------------
# 7. ห้องแชทคนกลาง (Middleman Chat)
# -------------------------------------------------------------
@login_required
def chat_room(request, room_id):
    room = get_object_or_404(ChatRoom, room_id=room_id)
    if request.user.status != 'Active' or (request.user.role != 'Admin' and request.user != room.user):
        return HttpResponseForbidden()
    chat_messages = room.messages.all().order_by('timestamp')
    seller_room = bool(room.related_post_id and room.user_id == room.related_post.seller_id)
    if room.related_post_id:
        orders = Order.objects.filter(post=room.related_post).order_by('-order_date')
        order = orders.first() if seller_room else orders.filter(buyer=room.user).first()
    else:
        order = None

    if request.method == 'POST':
        content = request.POST.get('text_content', '').strip()
        image_url = request.POST.get('image_url', '').strip()
        if content or image_url:
            ChatMessage.objects.create(
                room=room,
                sender=request.user,
                text_content=content,
                image_url=image_url
            )
            return redirect('chat_room', room_id=room.room_id)

    return render(request, 'chat_room.html', {
        'room': room,
        'chat_messages': chat_messages,
        'order': order,
        'seller_room': seller_room,
    })


# -------------------------------------------------------------
# 8. แอดมิน Admin Dashboard
# -------------------------------------------------------------
@login_required
def admin_dashboard(request):
    if request.user.role != 'Admin' or request.user.status != 'Active':
        messages.error(request, 'เฉพาะแอดมินเท่านั้นที่เข้าถึงหน้านี้ได้')
        return redirect('index')

    users_list = User.objects.all().order_by('-created_at')
    orders_list = Order.objects.all().order_by('-order_date')
    posts_list = GamePost.objects.all().order_by('-created_at')
    categories = GameCategory.objects.all()

    # Metrics
    total_users = users_list.count()
    total_posts = posts_list.count()
    pending_orders = orders_list.filter(status='Pending').count()
    completed_orders = orders_list.filter(status='Completed')
    completed_amount = completed_orders.aggregate(Sum('amount'))['amount__sum'] or Decimal('0.00')
    admin_fee_total = sum(
        (
            (amount * Decimal('0.03')).quantize(Decimal('0.01'), rounding=ROUND_HALF_UP)
            for amount in completed_orders.values_list('amount', flat=True)
        ),
        Decimal('0.00'),
    )

    return render(request, 'admin_dashboard.html', {
        'users_list': users_list,
        'orders_list': orders_list,
        'posts_list': posts_list,
        'categories': categories,
        'total_users': total_users,
        'total_posts': total_posts,
        'pending_orders': pending_orders,
        'completed_amount': completed_amount,
        'admin_fee_total': admin_fee_total,
    })


# -------------------------------------------------------------
# 9. Admin Actions: Ban / Unban / Verify Slip
# -------------------------------------------------------------
@login_required
def admin_toggle_ban(request, user_id):
    if request.user.role != 'Admin' or request.user.status != 'Active':
        return JsonResponse({'error': 'Unauthorized'}, status=403)
    target_user = get_object_or_404(User, user_id=user_id)
    target_user.status = 'Banned' if target_user.status == 'Active' else 'Active'
    target_user.save()
    return redirect('admin_dashboard')

def _seller_room_for(order):
    room, _ = ChatRoom.objects.get_or_create(
        user=order.post.seller,
        related_post=order.post,
        defaults={'title': f'ผู้ขายและแอดมิน: {order.post.title}'},
    )
    return room


@login_required
@require_POST
def admin_contact_seller(request, order_id):
    if request.user.role != 'Admin' or request.user.status != 'Active':
        return HttpResponseForbidden()
    order = get_object_or_404(Order.objects.select_related('post__seller'), order_id=order_id)
    room = _seller_room_for(order)
    if not room.messages.exists():
        ChatMessage.objects.create(
            room=room,
            sender=request.user,
            text_content=f'แอดมินติดต่อเรื่องไอดี {order.post.title} คำสั่งซื้อ #{order.order_id} กรุณาพูดคุยเรื่องการส่งมอบและบัญชีรับเงินในห้องนี้',
        )
    return redirect('chat_room', room_id=room.room_id)


@login_required
@require_POST
def admin_contact_buyer(request, order_id):
    if request.user.role != 'Admin' or request.user.status != 'Active':
        return HttpResponseForbidden()
    order = get_object_or_404(Order.objects.select_related('post', 'buyer'), order_id=order_id)
    room = ChatRoom.objects.filter(user=order.buyer, related_post=order.post).first()
    if room is None:
        room = ChatRoom.objects.create(
            user=order.buyer,
            related_post=order.post,
            title=f'ซื้อขายไอดี {order.post.title}',
        )
        ChatMessage.objects.create(
            room=room,
            sender=request.user,
            text_content=f'แอดมินติดต่อเรื่องคำสั่งซื้อ #{order.order_id} ของไอดี {order.post.title}',
        )
    return redirect('chat_room', room_id=room.room_id)


@login_required
@require_POST
@transaction.atomic
def admin_verify_order(request, order_id, action):
    if request.user.role != 'Admin' or request.user.status != 'Active':
        return JsonResponse({'error': 'Unauthorized'}, status=403)
    order = get_object_or_404(Order.objects.select_for_update().select_related('post__seller'), order_id=order_id)
    if action not in ('approve', 'reject'):
        return JsonResponse({'error': 'Invalid action'}, status=400)
    if order.status != 'Pending':
        messages.warning(request, 'คำสั่งซื้อนี้ดำเนินการแล้ว')
        return redirect('admin_dashboard')
    if action == 'approve':
        order.status = 'Completed'
        order.post.status = 'Sold'
        order.post.save()
        order.save()
        room = _seller_room_for(order)
        ChatMessage.objects.create(
            room=room,
            sender=request.user,
            text_content=f'คำสั่งซื้อ #{order_id} ได้รับการอนุมัติแล้ว กรุณาติดต่อแอดมินในห้องนี้เรื่องการส่งมอบไอดีและข้อมูลบัญชีสำหรับรับเงิน',
        )
        messages.success(request, f"อนุมัติคำสั่งซื้อ #{order_id} แล้ว กรุณาติดต่อผู้ขายในห้องแชทนี้เพื่อดำเนินการโอนเงิน")
        return redirect('chat_room', room_id=room.room_id)
    elif action == 'reject':
        order.status = 'Cancelled'
        order.post.status = 'Available'
        order.post.save()
        order.save()
        messages.warning(request, f"ปฏิเสธสลิปคำสั่งซื้อ #{order_id}")
    return redirect('admin_dashboard')


def _support_room_for(user):
    room, _ = ChatRoom.objects.get_or_create(user=user, related_post=None, defaults={'title': 'ติดต่อแอดมิน'})
    return room


@login_required
@require_GET
def support_chat(request):
    if request.user.status != 'Active':
        return HttpResponseForbidden()
    room = _support_room_for(request.user) if request.user.role != 'Admin' else None
    if request.user.role == 'Admin':
        return JsonResponse({'room_id': None, 'messages': []})
    return JsonResponse({'room_id': room.room_id, 'messages': [_serialize_support_message(m) for m in room.messages.select_related('sender').order_by('timestamp')]})


def _serialize_support_message(message):
    return {'id': message.message_id, 'sender_id': message.sender_id, 'sender_name': message.sender.username, 'text': message.text_content or '', 'image': message.image_url or '', 'time': message.timestamp.strftime('%H:%M')}


@login_required
@require_GET
def support_chat_messages(request, room_id):
    if request.user.status != 'Active':
        return HttpResponseForbidden()
    room = get_object_or_404(ChatRoom, room_id=room_id)
    if request.user.role != 'Admin' and room.user_id != request.user.user_id:
        return HttpResponseForbidden()
    return JsonResponse({'messages': [_serialize_support_message(m) for m in room.messages.select_related('sender').order_by('timestamp')]})


@login_required
@require_POST
def support_chat_send(request, room_id=None):
    if request.user.role == 'Admin':
        if room_id is None:
            return JsonResponse({'error': 'เลือกห้องสนทนาก่อน'}, status=400)
        room = get_object_or_404(ChatRoom, room_id=room_id)
    else:
        if room_id is None:
            room = _support_room_for(request.user)
        else:
            room = get_object_or_404(ChatRoom, room_id=room_id)
            if room.user_id != request.user.pk:
                return HttpResponseForbidden()
    if request.user.status != 'Active':
        return HttpResponseForbidden()
    try:
        text = json.loads(request.body or b'{}').get('text', '').strip()
    except (ValueError, AttributeError):
        return JsonResponse({'error': 'ข้อมูลไม่ถูกต้อง'}, status=400)
    if not text:
        return JsonResponse({'error': 'ข้อความว่าง'}, status=400)
    message = ChatMessage.objects.create(room=room, sender=request.user, text_content=text[:2000])
    return JsonResponse({'message': _serialize_support_message(message)})


@login_required
@require_GET
def admin_support_rooms(request):
    if request.user.role != 'Admin' or request.user.status != 'Active':
        return HttpResponseForbidden()
    rooms = ChatRoom.objects.select_related('user', 'related_post').order_by('-created_at')
    return JsonResponse({'rooms': [{'room_id': r.room_id, 'user': r.user.username, 'label': (f'{r.user.username} · ผู้ขาย {r.related_post.title}' if r.user_id == r.related_post.seller_id else f'{r.user.username} · ซื้อ {r.related_post.title}') if r.related_post else f'{r.user.username} · ติดต่อทั่วไป'} for r in rooms]})


@login_required
@require_GET
def my_purchase_rooms(request):
    if request.user.status != 'Active' or request.user.role == 'Admin':
        return HttpResponseForbidden()
    rooms = ChatRoom.objects.filter(user=request.user, related_post__isnull=False).select_related('related_post').order_by('-created_at')
    return JsonResponse({'rooms': [{'room_id': room.room_id, 'title': f'รับเงิน: {room.related_post.title}' if room.user_id == room.related_post.seller_id else f'ซื้อ: {room.related_post.title}'} for room in rooms]})
