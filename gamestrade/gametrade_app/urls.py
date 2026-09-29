"""
GameTrade Hub - App URLs
"""

from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('login/', views.login_view, name='login'),
    path('admin-login/', views.admin_login_view, name='admin_login'),
    path('register/', views.register_view, name='register'),
    path('logout/', views.logout_view, name='logout'),
    path('post/<int:post_id>/', views.post_detail, name='post_detail'),
    path('post/create/', views.create_post, name='create_post'),
    path('post/<int:post_id>/edit/', views.update_post, name='update_post'),
    path('post/<int:post_id>/delete/', views.delete_post, name='delete_post'),
    path('post/<int:post_id>/order/', views.create_order, name='create_order'),
    path('post/<int:post_id>/contact-admin/', views.start_purchase_chat, name='start_purchase_chat'),
    path('chat/<int:room_id>/', views.chat_room, name='chat_room'),
    path('support-chat/', views.support_chat, name='support_chat'),
    path('support-chat/admin/rooms/', views.admin_support_rooms, name='admin_support_rooms'),
    path('support-chat/purchases/', views.my_purchase_rooms, name='my_purchase_rooms'),
    path('support-chat/<int:room_id>/messages/', views.support_chat_messages, name='support_chat_messages'),
    path('support-chat/send/', views.support_chat_send, name='support_chat_send'),
    path('support-chat/<int:room_id>/send/', views.support_chat_send, name='support_chat_send_room'),
    path('admin-dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('admin-dashboard/ban/<int:user_id>/', views.admin_toggle_ban, name='admin_toggle_ban'),
    path('admin-dashboard/order/<int:order_id>/contact-seller/', views.admin_contact_seller, name='admin_contact_seller'),
    path('admin-dashboard/order/<int:order_id>/contact-buyer/', views.admin_contact_buyer, name='admin_contact_buyer'),
    path('admin-dashboard/order/<int:order_id>/<str:action>/', views.admin_verify_order, name='admin_verify_order'),
]
