"""
GameTrade Hub - App URLs
"""

from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('login/', views.login_view, name='login'),
    path('register/', views.register_view, name='register'),
    path('logout/', views.logout_view, name='logout'),
    path('post/<int:post_id>/', views.post_detail, name='post_detail'),
    path('post/create/', views.create_post, name='create_post'),
    path('post/<int:post_id>/edit/', views.update_post, name='update_post'),
    path('post/<int:post_id>/delete/', views.delete_post, name='delete_post'),
    path('post/<int:post_id>/order/', views.create_order, name='create_order'),
    path('chat/<int:room_id>/', views.chat_room, name='chat_room'),
    path('admin-dashboard/', views.admin_dashboard, name='admin_dashboard'),
    path('admin-dashboard/ban/<int:user_id>/', views.admin_toggle_ban, name='admin_toggle_ban'),
    path('admin-dashboard/order/<int:order_id>/<str:action>/', views.admin_verify_order, name='admin_verify_order'),
]
