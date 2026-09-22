"""
GameTrade Hub - Django Views
Class Project Proposal: GameTrade Hub (ระบบซื้อขายไอดีเกม)
Author: นายณัฐชนน สิงห์ศรี รหัสนักศึกษา 68114640228
"""

from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.contrib import messages
from django.db.models import Q, Count, Sum
from django.db.utils import OperationalError
from django.core.management import call_command
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
                {"name": "Valorant", "logo": "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=120&h=120&q=80"},
                {"name": "ROV (Realm of Valor)", "logo": "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=120&h=120&q=80"},
                {"name": "Genshin Impact", "logo": "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=120&h=120&q=80"},
                {"name": "Free Fire", "logo": "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=120&h=120&q=80"},
                {"name": "League of Legends", "logo": "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=120&h=120&q=80"},
                {"name": "EA FC Mobile", "logo": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=120&h=120&q=80"},
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
            login(request, form.get_user())
            messages.success(request, f'ยินดีต้อนรับ {request.user.username}')
            next_url = request.GET.get('next') or 'index'
            return redirect(next_url)
    else:
        form = LoginForm()
    return render(request, 'login.html', {'form': form, 'mode': 'login'})


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
        posts = GamePost.objects.all().order_by('-created_at')
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

    context = {
        'categories': categories,
        'posts': posts,
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
    related_posts = GamePost.objects.filter(category=post.category, status='Available').exclude(post_id=post.post_id)[:3]
    return render(request, 'post_detail.html', {
        'post': post,
        'related_posts': related_posts
    })


# -------------------------------------------------------------
# 3. เพิ่มโพสต์ขายไอดีใหม่ (Create - Form 7 Components)
# -------------------------------------------------------------
@login_required
def create_post(request):
    if request.user.status == 'Banned':
        messages.error(request, 'บัญชีของคุณถูกระงับการใช้งาน ไม่สามารถลงขายได้')
        return redirect('index')

    if request.method == 'POST':
        form = GamePostForm(request.POST)
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
        form = GamePostForm(request.POST, instance=post)
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
def create_order(request, post_id):
    post = get_object_or_404(GamePost, post_id=post_id)
    if post.seller == request.user:
        messages.error(request, 'คุณไม่สามารถซื้อไอดีของตัวเองได้')
        return redirect('post_detail', post_id=post.post_id)

    if request.method == 'POST':
        form = OrderSlipForm(request.POST)
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
            room, _ = ChatRoom.objects.get_or_create(
                user=request.user,
                related_post=post,
                defaults={'title': f"คำสั่งซื้อ #{order.order_id} - {post.title}"}
            )
            ChatMessage.objects.create(
                room=room,
                sender=request.user,
                text_content=f"สวัสดีครับ ทำการสั่งซื้อไอดี {post.title} และแนบสลิปยอด {order.amount:,.2f} THB เรียบร้อยแล้วครับ",
                image_url=order.slip_image,
                is_system=False
            )

            messages.success(request, 'สั่งซื้อและส่งหลักฐานสลิปเข้าสู่ระบบคนกลางเรียบร้อย')
            return redirect('chat_room', room_id=room.room_id)
    else:
        form = OrderSlipForm()

    return render(request, 'checkout.html', {'post': post, 'form': form})


# -------------------------------------------------------------
# 7. ห้องแชทคนกลาง (Middleman Chat)
# -------------------------------------------------------------
@login_required
def chat_room(request, room_id):
    room = get_object_or_404(ChatRoom, room_id=room_id)
    chat_messages = room.messages.all().order_by('timestamp')
    order = Order.objects.filter(post=room.related_post, buyer=room.user).first() if room.related_post else None

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
        'order': order
    })


# -------------------------------------------------------------
# 8. ผู้ดูแลระบบ Admin Dashboard
# -------------------------------------------------------------
@login_required
def admin_dashboard(request):
    if request.user.role != 'Admin':
        messages.error(request, 'เฉพาะผู้ดูแลระบบ (Admin) เท่านั้นที่เข้าถึงหน้านี้ได้')
        return redirect('index')

    users_list = User.objects.all().order_by('-created_at')
    orders_list = Order.objects.all().order_by('-order_date')
    posts_list = GamePost.objects.all().order_by('-created_at')
    categories = GameCategory.objects.all()

    # Metrics
    total_users = users_list.count()
    total_posts = posts_list.count()
    pending_orders = orders_list.filter(status='Pending').count()
    completed_amount = orders_list.filter(status='Completed').aggregate(Sum('amount'))['amount__sum'] or 0

    return render(request, 'admin_dashboard.html', {
        'users_list': users_list,
        'orders_list': orders_list,
        'posts_list': posts_list,
        'categories': categories,
        'total_users': total_users,
        'total_posts': total_posts,
        'pending_orders': pending_orders,
        'completed_amount': completed_amount,
    })


# -------------------------------------------------------------
# 9. Admin Actions: Ban / Unban / Verify Slip
# -------------------------------------------------------------
@login_required
def admin_toggle_ban(request, user_id):
    if request.user.role != 'Admin':
        return JsonResponse({'error': 'Unauthorized'}, status=403)
    target_user = get_object_or_404(User, user_id=user_id)
    target_user.status = 'Banned' if target_user.status == 'Active' else 'Active'
    target_user.save()
    return redirect('admin_dashboard')

@login_required
def admin_verify_order(request, order_id, action):
    if request.user.role != 'Admin':
        return JsonResponse({'error': 'Unauthorized'}, status=403)
    order = get_object_or_404(Order, order_id=order_id)
    if action == 'approve':
        order.status = 'Completed'
        order.post.status = 'Sold'
        order.post.save()
        order.save()
        messages.success(request, f"อนุมัติสลิปคำสั่งซื้อ #{order_id} สำเร็จ")
    elif action == 'reject':
        order.status = 'Cancelled'
        order.post.status = 'Available'
        order.post.save()
        order.save()
        messages.warning(request, f"ปฏิเสธสลิปคำสั่งซื้อ #{order_id}")
    return redirect('admin_dashboard')
