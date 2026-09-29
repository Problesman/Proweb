import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  User, 
  ShoppingBag, 
  Layers, 
  Key, 
  Edit3, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  Plus
} from 'lucide-react';

export const UserProfileModal: React.FC = () => {
  const { 
    currentUser, 
    updateUserProfile, 
    posts, 
    orders, 
    categories, 
    deletePost, 
    setEditingPost, 
    setIsSellModalOpen,
    setCurrentView
  } = useApp();

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'posts' | 'security'>('orders');

  // Edit profile state
  const [username, setUsername] = useState(currentUser?.username || '');
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [avatar, setAvatar] = useState(currentUser?.avatar || '');

  // Password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12 text-center text-slate-400">
        <p>กรุณาเข้าสู่ระบบเพื่อดูโปรไฟล์และประวัติการสั่งซื้อ</p>
        <button
          onClick={() => setCurrentView('marketplace')}
          className="mt-4 px-4 py-2 bg-cyan-600 text-slate-950 font-bold rounded-lg text-xs"
        >
          กลับหน้าหลัก
        </button>
      </div>
    );
  }

  // Filter user's posts & orders
  const myPosts = posts.filter(p => p.seller_id === currentUser.user_id);
  const myOrders = orders.filter(o => o.buyer_id === currentUser.user_id);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile(currentUser.user_id, {
      username,
      email,
      phone,
      avatar
    });
  };

  const handlePasswordSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('รหัสผ่านใหม่ไม่ตรงกัน');
      return;
    }
    if (newPassword.length < 6) {
      alert('รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร');
      return;
    }
    updateUserProfile(currentUser.user_id, { password: newPassword });
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    alert('เปลี่ยนรหัสผ่านสำเร็จ');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Profile Header Card */}
      <div className="bg-[#0f172a] rounded-2xl border border-slate-800 p-6 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.username}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-cyan-500/50 shadow-lg"
          />
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white">{currentUser.username}</h2>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                currentUser.role === 'Admin' ? 'bg-purple-900/60 text-purple-300 border border-purple-700' : 'bg-cyan-950 text-cyan-300 border border-cyan-800'
              }`}>
                {currentUser.role}
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                {currentUser.status}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">{currentUser.email} • สมาชิกตั้งแต่ {currentUser.created_at.substring(0, 10)}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setEditingPost(null);
              setIsSellModalOpen(true);
            }}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" /> ลงขายไอดีใหม่
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-2">
        <button
          onClick={() => setActiveTab('orders')}
          className={`pb-3 px-4 text-xs font-bold transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          ประวัติการสั่งซื้อ (My Orders) ({myOrders.length})
        </button>

        <button
          onClick={() => setActiveTab('posts')}
          className={`pb-3 px-4 text-xs font-bold transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'posts'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          ประวัติการลงขาย (My Listings) ({myPosts.length})
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`pb-3 px-4 text-xs font-bold transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'profile'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <User className="w-4 h-4" />
          แก้ไขโปรไฟล์
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`pb-3 px-4 text-xs font-bold transition-colors border-b-2 flex items-center gap-2 ${
            activeTab === 'security'
              ? 'border-cyan-400 text-cyan-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Key className="w-4 h-4" />
          ความปลอดภัยและรหัสผ่าน
        </button>
      </div>

      {/* ORDERS TAB */}
      {activeTab === 'orders' && (
        <div className="bg-[#0f172a] rounded-xl border border-slate-800 p-5 shadow-lg">
          <h3 className="text-sm font-bold text-white mb-4">รายการคำสั่งซื้อไอดีเกมของฉัน</h3>
          {myOrders.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">ยังไม่มีประวัติการสั่งซื้อ</p>
          ) : (
            <div className="space-y-3">
              {myOrders.map(order => {
                const post = posts.find(p => p.post_id === order.post_id);

                return (
                  <div key={order.order_id} className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img src={post?.image || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=120&q=80'} alt="" className="w-14 h-14 rounded-lg object-cover" />
                      <div>
                        <span className="font-bold text-sm text-white">{post?.title || `Order #${order.order_id}`}</span>
                        <p className="text-xs text-cyan-400 font-bold mt-0.5">{order.amount.toLocaleString()} THB</p>
                        <p className="text-[11px] text-slate-400">สั่งซื้อเมื่อ: {order.order_date}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                        order.status === 'Completed' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                        order.status === 'Pending' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                        'bg-rose-950 text-rose-400 border border-rose-800'
                      }`}>
                        {order.status === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5" />}
                        {order.status === 'Pending' && <Clock className="w-3.5 h-3.5" />}
                        สถานะ: {order.status}
                      </span>

                      {order.slip_image && (
                        <a
                          href={order.slip_image}
                          target="_blank"
                          rel="noreferrer"
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs flex items-center gap-1 border border-slate-700"
                        >
                          <Eye className="w-3 h-3" /> ดูสลิป
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MY LISTINGS TAB */}
      {activeTab === 'posts' && (
        <div className="bg-[#0f172a] rounded-xl border border-slate-800 p-5 shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white">รายการไอดีเกมที่ฉันลงขาย</h3>
            <button
              onClick={() => {
                setEditingPost(null);
                setIsSellModalOpen(true);
              }}
              className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> ลงขายเพิ่ม
            </button>
          </div>

          {myPosts.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">คุณยังไม่ได้ลงขายไอดีเกม</p>
          ) : (
            <div className="space-y-3">
              {myPosts.map(post => (
                <div key={post.post_id} className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={post.image} alt={post.title} className="w-14 h-14 rounded-lg object-cover" />
                    <div>
                      <h4 className="font-bold text-sm text-white">{post.title}</h4>
                      <p className="text-xs text-cyan-400 font-bold mt-0.5">{post.price.toLocaleString()} THB</p>
                      <p className="text-[11px] text-slate-400">ลงขายเมื่อ: {post.created_at}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                      post.status === 'Available' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                      post.status === 'Pending' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                      'bg-rose-950 text-rose-400 border border-rose-800'
                    }`}>
                      {post.status}
                    </span>

                    <button
                      onClick={() => {
                        setEditingPost(post);
                        setIsSellModalOpen(true);
                      }}
                      className="p-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded border border-slate-700"
                      title="แก้ไขโพสต์"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => deletePost(post.post_id)}
                      className="p-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded border border-rose-800"
                      title="ลบโพสต์"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* EDIT PROFILE TAB */}
      {activeTab === 'profile' && (
        <form onSubmit={handleProfileSave} className="bg-[#0f172a] rounded-xl border border-slate-800 p-6 shadow-lg max-w-xl space-y-4">
          <h3 className="text-sm font-bold text-white mb-2">แก้ไขข้อมูลส่วนตัว</h3>

          <div>
            <label className="text-xs text-slate-300 block mb-1">ชื่อผู้ใช้งาน (Username)</label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1">อีเมล (Email)</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1">เบอร์โทรศัพท์ (Phone)</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="08X-XXX-XXXX"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1">URL รูปภาพประจำตัว (Avatar)</label>
            <input
              type="url"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs"
          >
            บันทึกการเปลี่ยนแปลง
          </button>
        </form>
      )}

      {/* SECURITY / PASSWORD TAB */}
      {activeTab === 'security' && (
        <form onSubmit={handlePasswordSave} className="bg-[#0f172a] rounded-xl border border-slate-800 p-6 shadow-lg max-w-xl space-y-4">
          <h3 className="text-sm font-bold text-white mb-2">เปลี่ยนรหัสผ่าน (Change Password)</h3>

          <div>
            <label className="text-xs text-slate-300 block mb-1">รหัสผ่านปัจจุบัน</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1">รหัสผ่านใหม่</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
            />
          </div>

          <div>
            <label className="text-xs text-slate-300 block mb-1">ยืนยันรหัสผ่านใหม่</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-xs text-white"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-lg text-xs"
          >
            อัปเดตรหัสผ่าน
          </button>
        </form>
      )}

    </div>
  );
};
