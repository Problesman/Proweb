"""
Django Forms with Tailwind CSS styling
Requirement 2.2.1: แบบฟอร์มรับข้อมูล 5 รูปแบบขึ้นไป (TextField, RadioButton, TextArea, CheckBox, DropdownList, DatetimePicker, FileBrowse)
"""

from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .models import User, GamePost, GameCategory, Order

_INPUT = 'w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400'


class LoginForm(AuthenticationForm):
    username = forms.CharField(widget=forms.TextInput(attrs={
        'class': _INPUT,
        'placeholder': 'ชื่อผู้ใช้',
    }))
    password = forms.CharField(widget=forms.PasswordInput(attrs={
        'class': _INPUT,
        'placeholder': 'รหัสผ่าน',
    }))


class RegisterForm(UserCreationForm):
    email = forms.EmailField(required=True, widget=forms.EmailInput(attrs={
        'class': _INPUT,
        'placeholder': 'email@example.com',
    }))

    class Meta(UserCreationForm.Meta):
        model = User
        fields = ('username', 'email')
        widgets = {
            'username': forms.TextInput(attrs={'class': _INPUT, 'placeholder': 'ชื่อผู้ใช้'}),
        }

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['password1'].widget.attrs.update({'class': _INPUT, 'placeholder': 'รหัสผ่าน'})
        self.fields['password2'].widget.attrs.update({'class': _INPUT, 'placeholder': 'ยืนยันรหัสผ่าน'})

class GamePostForm(forms.ModelForm):
    # Component 6: DatetimePicker
    scheduled_delivery = forms.DateTimeField(
        required=False,
        widget=forms.DateTimeInput(attrs={
            'type': 'datetime-local',
            'class': 'w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400'
        }),
        label="เวลาที่พร้อมส่งมอบไอดี"
    )

    class Meta:
        model = GamePost
        fields = [
            'title', 'category', 'price', 'description', 'status',
            'server', 'rank', 'level', 'skins_count', 'original_email',
            'battle_pass', 'secondary_verification', 'image', 'game_credentials_note'
        ]
        # Custom Tailwind widgets matching the 7 input components
        widgets = {
            # Component 1: TextField
            'title': forms.TextInput(attrs={
                'class': 'w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400',
                'placeholder': 'เช่น [TH] Valorant Radiant Peak มีสกิน Reaver + Kuronami มีดแชมเปี้ยน'
            }),
            'price': forms.NumberInput(attrs={
                'class': 'w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400',
                'placeholder': 'เช่น 4500'
            }),
            'server': forms.TextInput(attrs={
                'class': 'w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400',
                'placeholder': 'เช่น Asia / Thailand'
            }),
            'rank': forms.TextInput(attrs={
                'class': 'w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400',
                'placeholder': 'เช่น Immortal 3 / Supreme'
            }),
            'level': forms.NumberInput(attrs={
                'class': 'w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400'
            }),
            'skins_count': forms.NumberInput(attrs={
                'class': 'w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400'
            }),
            
            # Component 2: DropdownList
            'category': forms.Select(attrs={
                'class': 'w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400'
            }),
            
            # Component 3: TextArea
            'description': forms.Textarea(attrs={
                'rows': 4,
                'class': 'w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400',
                'placeholder': 'ระบุรายละเอียดไอดี สกิน อาวุธ ประวัติการเล่น หรือของสะสม'
            }),
            'game_credentials_note': forms.TextInput(attrs={
                'class': 'w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400',
                'placeholder': 'ไอดี/รหัสผ่านที่จะมอบให้คนกลางตรวจสอบเมื่อมีคำสั่งซื้อ'
            }),

            # Component 4: RadioButton
            'status': forms.RadioSelect(attrs={
                'class': 'text-cyan-400 focus:ring-cyan-400 focus:ring-offset-slate-900'
            }),

            # Component 5: CheckBox
            'original_email': forms.CheckboxInput(attrs={
                'class': 'w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-400 focus:ring-cyan-400'
            }),
            'battle_pass': forms.CheckboxInput(attrs={
                'class': 'w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-400 focus:ring-cyan-400'
            }),
            'secondary_verification': forms.CheckboxInput(attrs={
                'class': 'w-4 h-4 rounded border-slate-700 bg-slate-900 text-cyan-400 focus:ring-cyan-400'
            }),

            # Component 7: FileBrowse / Image URL
            'image': forms.URLInput(attrs={
                'class': 'w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400',
                'placeholder': 'https://images.unsplash.com/...'
            }),
        }


class OrderSlipForm(forms.ModelForm):
    class Meta:
        model = Order
        fields = ['slip_image', 'notes']
        widgets = {
            'slip_image': forms.URLInput(attrs={
                'class': 'w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400',
                'placeholder': 'ลิงก์สลิปโอนเงิน หรือรูปถ่ายสลิป'
            }),
            'notes': forms.Textarea(attrs={
                'rows': 2,
                'class': 'w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-400',
                'placeholder': 'หมายเหตุเพิ่มเติมถึงคนกลาง (เช่น โอนจากธนาคารกสิกรไทย เวลา 14:30)'
            })
        }
