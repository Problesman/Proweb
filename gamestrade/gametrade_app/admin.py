"""
Django Admin Configuration for GameTrade Hub
Class Project: GameTrade Hub
Author: นายณัฐชนน สิงห์ศรี 68114640228
"""

from django.contrib import admin
from .models import User, GameCategory, GamePost, Order, ChatRoom, ChatMessage

@admin.register(User)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('user_id', 'username', 'email', 'role', 'status', 'phone', 'created_at')
    list_filter = ('role', 'status')
    search_fields = ('username', 'email', 'phone')
    actions = ['ban_users', 'unban_users']

    def ban_users(self, request, queryset):
        count = queryset.update(status='Banned')
        self.message_user(request, f"ระงับการใช้งาน {count} บัญชีสำเร็จ (Banned)")
    ban_users.short_description = "ระงับบัญชีผู้ใช้ (Ban User)"

    def unban_users(self, request, queryset):
        count = queryset.update(status='Active')
        self.message_user(request, f"ปลดระงับการใช้งาน {count} บัญชีสำเร็จ (Active)")
    unban_users.short_description = "ปลดระงับบัญชีผู้ใช้ (Unban User)"


@admin.register(GameCategory)
class GameCategoryAdmin(admin.ModelAdmin):
    list_display = ('category_id', 'name', 'logo')
    search_fields = ('name',)


@admin.register(GamePost)
class GamePostAdmin(admin.ModelAdmin):
    list_display = ('post_id', 'title', 'price', 'category', 'seller', 'status', 'server', 'rank', 'created_at')
    list_filter = ('status', 'category')
    search_fields = ('title', 'description', 'seller__username')


@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_id', 'buyer', 'post', 'amount', 'status', 'order_date')
    list_filter = ('status',)
    actions = ['mark_completed', 'mark_cancelled']

    def mark_completed(self, request, queryset):
        for order in queryset:
            order.status = 'Completed'
            order.post.status = 'Sold'
            order.post.save()
            order.save()
        self.message_user(request, "ยืนยันคำสั่งซื้อและส่งมอบไอดีสำเร็จ")
    mark_completed.short_description = "อนุมัติสลิปและโอนสิทธิ์สำเร็จ (Approve Slip)"

    def mark_cancelled(self, request, queryset):
        for order in queryset:
            order.status = 'Cancelled'
            order.post.status = 'Available'
            order.post.save()
            order.save()
        self.message_user(request, "ปฏิเสธสลิปและยกเลิกคำสั่งซื้อ")
    mark_cancelled.short_description = "ปฏิเสธสลิป / ยกเลิกออเดอร์ (Reject Slip)"


@admin.register(ChatRoom)
class ChatRoomAdmin(admin.ModelAdmin):
    list_display = ('room_id', 'user', 'title', 'related_post', 'created_at')


@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    list_display = ('message_id', 'room', 'sender', 'text_content', 'timestamp', 'is_read', 'is_system')
    list_filter = ('is_system', 'is_read')
