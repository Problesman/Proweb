"""Django forms for authentication, listings, and orders."""

from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from .models import User, GamePost, Order

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
        self.fields['password1'].widget.attrs.update({
            'class': _INPUT,
            'placeholder': 'รหัสผ่าน',
            'aria-describedby': 'password-requirements',
        })
        self.fields['password2'].widget.attrs.update({'class': _INPUT, 'placeholder': 'ยืนยันรหัสผ่าน'})

class GamePostForm(forms.ModelForm):
    class Meta:
        model = GamePost
        fields = ['title', 'category', 'price', 'rank', 'description', 'image']
        widgets = {
            'title': forms.TextInput(attrs={
                'class': _INPUT, 'placeholder': 'เช่น ไอดี Valorant แรงค์ Immortal'
            }),
            'price': forms.NumberInput(attrs={
                'class': _INPUT, 'placeholder': 'เช่น 4500', 'min': '0.01', 'step': '0.01',
                'aria-describedby': 'seller-fee-notice'
            }),
            'rank': forms.TextInput(attrs={
                'class': _INPUT, 'placeholder': 'เช่น Immortal 3'
            }),
            'category': forms.Select(attrs={
                'class': _INPUT
            }),
            'description': forms.Textarea(attrs={
                'rows': 5, 'class': _INPUT,
                'placeholder': 'ระบุรายละเอียดไอดี สกิน อาวุธ ประวัติการเล่น หรือของสะสม'
            }),
        }

    image = forms.ImageField(
        required=False,
        label='รูปภาพประกอบ',
        widget=forms.ClearableFileInput(attrs={
            'accept': 'image/*',
            'class': _INPUT,
        }),
    )

    def clean(self):
        cleaned = super().clean()
        if not cleaned.get('image') and not (self.instance and self.instance.pk and self.instance.image):
            self.add_error('image', 'กรุณาเลือกรูปภาพประกอบจากเครื่อง')
        return cleaned

    def clean_image(self):
        image = self.cleaned_data.get('image')
        if image and hasattr(image, 'size') and image.size > 5 * 1024 * 1024:
            raise forms.ValidationError('รูปภาพต้องมีขนาดไม่เกิน 5 MB')
        return image


class OrderSlipForm(forms.ModelForm):
    slip_image = forms.ImageField(
        label='เลือกรูปสลิปจากเครื่อง',
        widget=forms.ClearableFileInput(attrs={'accept': 'image/*', 'class': _INPUT}),
    )

    class Meta:
        model = Order
        fields = ['slip_image', 'notes']
        widgets = {
            'notes': forms.Textarea(attrs={
                'rows': 2,
                'class': _INPUT,
                'placeholder': 'หมายเหตุเพิ่มเติมถึงคนกลาง (เช่น โอนจากธนาคารกสิกรไทย เวลา 14:30)'
            })
        }

    def clean_slip_image(self):
        image = self.cleaned_data['slip_image']
        if image.size > 5 * 1024 * 1024:
            raise forms.ValidationError('รูปสลิปต้องมีขนาดไม่เกิน 5 MB')
        return image
