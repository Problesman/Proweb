"""
Django Channels WebSocket Consumer for Real-time Chat
Class Project: GameTrade Hub
"""

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import ChatRoom, ChatMessage, User

class MiddlemanChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_id = self.scope['url_route']['kwargs']['room_id']
        self.room_group_name = f'chat_{self.room_id}'

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
        message = data.get('message', '').strip()
        image_url = data.get('image_url', '').strip()
        sender_id = data.get('sender_id')

        if not message and not image_url:
            return

        saved_msg = await self.save_message(self.room_id, sender_id, message, image_url)

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message,
                'image_url': image_url,
                'sender_id': sender_id,
                'sender_name': saved_msg.sender.username,
                'sender_avatar': saved_msg.sender.avatar or '',
                'sender_role': saved_msg.sender.role,
                'timestamp': saved_msg.timestamp.strftime('%H:%M')
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
