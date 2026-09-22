import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Users, 
  Layers, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  ShieldCheck, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  XCircle, 
  Eye, 
  Plus, 
  MessageSquare, 
  Search, 
  AlertTriangle,
  FileCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AdminDashboard: React.FC = () => {
  const { 
    currentUser, 
    users, 
    toggleUserBan,
    posts, 
    deletePost, 
    updatePostStatus, 
    categories, 
    addCategory, 
    deleteCategory, 
    orders, 
    updateOrderStatus,
    chatRooms,
    openChatRoom,
    setCurrentView
  } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'categories' | 'posts' | 'orders' | 'chats'>('overview');
  
  // New category form
  const [newCatName, setNewCatName] = useState('');
  const [newCatLogo, setNewCatLogo] = useState('');
  const [showAddCatModal, setShowAddCatModal] = useState(false);

  // Search in tables
  const [memberSearch, setMemberSearch] = useState('');
  const [postSearch, setPostSearch] = useState('');

  // Slip modal preview
  const [previewSlipUrl, setPreviewSlipUrl] = useState<string | null>(null);

  // Metrics calculations
  const totalPostsCount = posts.length;
  const soldPostsCount = posts.filter(p => p.status === 'Sold').length;
  const pendingOrdersCount = orders.filter(o => o.status === 'Pending').length;
  const totalVolumeTHB = orders.reduce((sum, o) => sum + (o.status === 'Completed' ? o.amount : 0), 0);

  // Chart data simulation (7-day trend)
  const chartDays = ['จันทร์', 'อังคาร', 'พุธ', 'พฤหัส', 'ศุกร์', 'เสาร์', 'อาทิตย์'];
  const chartListings = [12, 19, 15, 25, 32, 45, 38];
  const chartMax = Math.max(...chartListings);

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    addCategory({
      name: newCatName.trim(),
      logo: newCatLogo.trim() || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=120&h=120&q=80'
    });
    setNewCatName('');
    setNewCatLogo('');
    setShowAddCatModal(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Banner / Title matching screenshot page 5 */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-slate-800 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-500/40">
              Admin Portal
            </span>
            <span className="text-xs text-slate-400">ระบบจัดการสำหรับผู้ดูแลระบบและคนกลาง</span>
          </div>
          <h1 className="text-2xl font-black text-white mt-1 tracking-tight">
            ADMIN DASHBOARD - OVERVIEW
          </h1>
        </div>

        {/* Tab navigation pills */}
        <div className="flex flex-wrap gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'overview' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            ภาพรวม (Overview)
          </button>
          <button
            onClick={() => setActiveTab('members')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'members' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            สมาชิก ({users.length})
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'categories' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            หมวดหมู่เกม ({categories.length})
          </button>
          <button
            onClick={() => setActiveTab('posts')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'posts' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            โพสต์ขาย ({posts.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'orders' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            ออเดอร์/สลิป ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('chats')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              activeTab === 'chats' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            ห้องแชท ({chatRooms.length})
          </button>
        </div>
      </div>

      {/* OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* 4 Metric Cards matching screenshot page 5 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Card 1: Sessions Online */}
            <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-800 shadow-md relative overflow-hidden">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>SESSIONS ONLINE</span>
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></span>
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">1</span>
                <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/40">
                  ● LIVE USER
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">Active Middleman Escrow session</p>
            </div>

            {/* Card 2: New Users Today */}
            <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-800 shadow-md">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>NEW USERS TODAY</span>
                <Users className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">33</span>
                <span className="text-xs font-bold text-cyan-400 flex items-center">
                  ↑ +18%
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">สมาชิกในระบบทั้งหมด {users.length} คน</p>
            </div>

            {/* Card 3: Total Posts */}
            <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-800 shadow-md">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>TOTAL POSTS</span>
                <Layers className="w-4 h-4 text-purple-400" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">{totalPostsCount}</span>
                <span className="text-xs text-slate-400">
                  (ขายแล้ว {soldPostsCount})
                </span>
              </div>
              <div className="mt-2 text-[10px] text-slate-400 flex flex-wrap gap-2">
                <span>Valorant: {posts.filter(p => p.category_id === 1).length}</span>
                <span>ROV: {posts.filter(p => p.category_id === 2).length}</span>
                <span>Genshin: {posts.filter(p => p.category_id === 3).length}</span>
              </div>
            </div>

            {/* Card 4: Order Status */}
            <div className="bg-[#0f172a] p-4 rounded-xl border border-slate-800 shadow-md">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>ORDER STATUS</span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-3xl font-black text-amber-400">{pendingOrdersCount}</span>
                <span className="text-xs font-bold text-amber-300 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
                  Pending Verification
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-2">ยอดเงินคนกลางสะสม {totalVolumeTHB.toLocaleString()} THB</p>
            </div>

          </div>

          {/* Chart & Quick Activities Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Chart: Requirement 4 Extra / Creativity (สถิติการเติบโตของการลงขายไอดีเกม) */}
            <div className="lg:col-span-2 bg-[#0f172a] p-5 rounded-xl border border-slate-800 shadow-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-cyan-400" />
                    สถิติการเติบโตของการลงขายไอดีเกม (Growth Trends)
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">จำนวนไอดีเกมที่สมาชิกลงขายรายวันผ่านระบบ GameTrade Hub</p>
                </div>
                <span className="text-xs font-semibold text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-800/40">
                  7 วันล่าสุด
                </span>
              </div>

              {/* Bar Chart Visualization */}
              <div className="h-56 flex items-end justify-between gap-3 pt-6 pb-2 px-2 bg-slate-950/60 rounded-xl border border-slate-800/80">
                {chartDays.map((day, idx) => {
                  const val = chartListings[idx];
                  const heightPercent = Math.round((val / chartMax) * 100);

                  return (
                    <div key={day} className="flex-1 flex flex-col items-center gap-2 group">
                      <span className="text-[10px] font-bold text-cyan-300 opacity-0 group-hover:opacity-100 transition-opacity">
                        {val}
                      </span>
                      <div className="w-full max-w-[36px] bg-slate-800/80 rounded-t-lg overflow-hidden flex items-end h-36">
                        <div 
                          className="w-full bg-gradient-to-t from-cyan-600 via-teal-500 to-emerald-400 rounded-t-lg transition-all duration-700 group-hover:brightness-125"
                          style={{ height: `${heightPercent}%` }}
                        ></div>
                      </div>
                      <span className="text-[11px] text-slate-400">{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Middleman Activity matching page 5 screenshot */}
            <div className="bg-[#0f172a] p-5 rounded-xl border border-slate-800 shadow-lg flex flex-col justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  Recent Chat Activity
                </h3>
                <div className="space-y-3">
                  {chatRooms.slice(0, 3).map(room => (
                    <div 
                      key={room.room_id} 
                      onClick={() => openChatRoom(room.room_id)}
                      className="p-3 bg-slate-900 hover:bg-slate-850 rounded-xl border border-slate-800 cursor-pointer transition-colors"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-slate-200">ห้องแชท #{room.room_id}</span>
                        <span className="text-[10px] text-emerald-400 font-bold">ACTIVE</span>
                      </div>
                      <p className="text-[11px] text-slate-400 truncate mt-1">{room.title}</p>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setActiveTab('chats')}
                className="w-full mt-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded-lg text-xs font-semibold border border-slate-700 transition-colors"
              >
                ดูห้องแชททั้งหมด ({chatRooms.length})
              </button>
            </div>

          </div>

        </div>
      )}

      {/* MEMBERS TAB */}
      {activeTab === 'members' && (
        <div className="bg-[#0f172a] rounded-xl border border-slate-800 p-5 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white">จัดการสมาชิก (Member Management)</h3>
              <p className="text-xs text-slate-400">ตรวจสอบผู้ใช้งาน ค้นหา และระงับบัญชี (Ban/Unban)</p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={memberSearch}
                onChange={(e) => setMemberSearch(e.target.value)}
                placeholder="ค้นหาชื่อ, อีเมล..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3">User ID</th>
                  <th className="p-3">ผู้ใช้งาน</th>
                  <th className="p-3">อีเมล</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">สถานะบัญชี</th>
                  <th className="p-3">วันที่สมัคร</th>
                  <th className="p-3 text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {users.filter(u => 
                  u.username.toLowerCase().includes(memberSearch.toLowerCase()) || 
                  u.email.toLowerCase().includes(memberSearch.toLowerCase())
                ).map(u => (
                  <tr key={u.user_id} className="hover:bg-slate-900/50">
                    <td className="p-3 font-mono text-slate-400">#{u.user_id}</td>
                    <td className="p-3 flex items-center gap-2">
                      <img src={u.avatar} alt={u.username} className="w-6 h-6 rounded-full object-cover" />
                      <span className="font-semibold text-white">{u.username}</span>
                    </td>
                    <td className="p-3 text-slate-400">{u.email}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.role === 'Admin' ? 'bg-purple-900/70 text-purple-300 border border-purple-700' : 'bg-slate-800 text-slate-300'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        u.status === 'Active' 
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/40' 
                          : 'bg-rose-950 text-rose-400 border border-rose-800/40'
                      }`}>
                        {u.status}
                      </span>
                    </td>
                    <td className="p-3 text-slate-400">{u.created_at}</td>
                    <td className="p-3 text-right">
                      {u.role !== 'Admin' && (
                        <button
                          onClick={() => toggleUserBan(u.user_id)}
                          className={`px-2.5 py-1 rounded text-[11px] font-medium transition-colors ${
                            u.status === 'Active'
                              ? 'bg-rose-950/70 text-rose-300 hover:bg-rose-900 border border-rose-800/60'
                              : 'bg-emerald-950/70 text-emerald-300 hover:bg-emerald-900 border border-emerald-800/60'
                          }`}
                        >
                          {u.status === 'Active' ? 'ระงับบัญชี (Ban)' : 'ปลดแบน (Unban)'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CATEGORIES TAB */}
      {activeTab === 'categories' && (
        <div className="bg-[#0f172a] rounded-xl border border-slate-800 p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">จัดการหมวดหมู่เกม (Game Categories)</h3>
              <p className="text-xs text-slate-400">เพิ่ม ลบ หรือแก้ไขรายชื่อเกมที่เปิดให้บริการในตลาด</p>
            </div>
            <button
              onClick={() => setShowAddCatModal(true)}
              className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" /> เพิ่มเกมใหม่
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {categories.map(cat => {
              const count = posts.filter(p => p.category_id === cat.category_id).length;

              return (
                <div key={cat.category_id} className="p-4 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={cat.logo} alt={cat.name} className="w-10 h-10 rounded-lg object-cover ring-1 ring-cyan-500/40" />
                    <div>
                      <h4 className="font-bold text-sm text-white">{cat.name}</h4>
                      <p className="text-[11px] text-slate-400">{count} รายการลงขาย</p>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteCategory(cat.category_id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                    title="ลบหมวดหมู่นี้"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Add Category Modal */}
          {showAddCatModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80">
              <form onSubmit={handleAddCategorySubmit} className="bg-slate-900 p-5 rounded-xl border border-slate-700 w-full max-w-md space-y-4">
                <h4 className="text-sm font-bold text-white">เพิ่มหมวดหมู่เกมใหม่</h4>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">ชื่อเกม (Game Name)</label>
                  <input
                    type="text"
                    required
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="เช่น Apex Legends, Minecraft..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-300 block mb-1">URL รูปภาพโลโก้เกม</label>
                  <input
                    type="url"
                    value={newCatLogo}
                    onChange={(e) => setNewCatLogo(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-xs text-white"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddCatModal(false)}
                    className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg text-xs"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-cyan-500 text-slate-950 font-bold rounded-lg text-xs"
                  >
                    บันทึก
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* POSTS MODERATION TAB */}
      {activeTab === 'posts' && (
        <div className="bg-[#0f172a] rounded-xl border border-slate-800 p-5 shadow-lg space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-white">ตรวจสอบโพสต์ขาย (Post Moderation)</h3>
              <p className="text-xs text-slate-400">ลบโพสต์ที่ผิดกฎ หรือเปลี่ยนสถานะของโพสต์ในระบบ</p>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={postSearch}
                onChange={(e) => setPostSearch(e.target.value)}
                placeholder="ค้นหาโพสต์..."
                className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Post ID</th>
                  <th className="p-3">ภาพ</th>
                  <th className="p-3">ชื่อโพสต์</th>
                  <th className="p-3">ราคา</th>
                  <th className="p-3">สถานะ</th>
                  <th className="p-3">ผู้ขาย</th>
                  <th className="p-3 text-right">การจัดการ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {posts.filter(p => p.title.toLowerCase().includes(postSearch.toLowerCase())).map(p => {
                  const seller = users.find(u => u.user_id === p.seller_id);

                  return (
                    <tr key={p.post_id} className="hover:bg-slate-900/50">
                      <td className="p-3 font-mono text-slate-400">#{p.post_id}</td>
                      <td className="p-3">
                        <img src={p.image} alt={p.title} className="w-10 h-7 object-cover rounded" />
                      </td>
                      <td className="p-3 font-medium text-white max-w-xs truncate" title={p.title}>
                        {p.title}
                      </td>
                      <td className="p-3 font-bold text-cyan-400">{p.price.toLocaleString()} THB</td>
                      <td className="p-3">
                        <select
                          value={p.status}
                          onChange={(e) => updatePostStatus(p.post_id, e.target.value as any)}
                          className="bg-slate-900 border border-slate-700 text-xs rounded px-2 py-1 text-slate-200"
                        >
                          <option value="Available">Available</option>
                          <option value="Pending">Pending</option>
                          <option value="Sold">Sold</option>
                        </select>
                      </td>
                      <td className="p-3 text-slate-400">{seller?.username || 'Seller'}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => deletePost(p.post_id)}
                          className="p-1.5 bg-rose-950/50 hover:bg-rose-900 text-rose-300 rounded border border-rose-800/40 transition-colors"
                          title="ลบโพสต์นี้"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ORDERS & SLIP VERIFICATION TAB */}
      {activeTab === 'orders' && (
        <div className="bg-[#0f172a] rounded-xl border border-slate-800 p-5 shadow-lg space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">ตรวจสอบสลิปและคำสั่งซื้อ (Order & Slip Verification)</h3>
            <p className="text-xs text-slate-400">ตรวจสอบหลักฐานการโอนเงินของสมาชิกลงบัญชีคนกลาง Escrow</p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-900 text-slate-400 uppercase text-[10px]">
                <tr>
                  <th className="p-3">Order ID</th>
                  <th className="p-3">ไอดีเกมที่ซื้อ</th>
                  <th className="p-3">ยอดเงิน (THB)</th>
                  <th className="p-3">สลิปการโอน</th>
                  <th className="p-3">สถานะ</th>
                  <th className="p-3">วันที่โอน</th>
                  <th className="p-3 text-right">การอนุมัติ</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {orders.map(order => {
                  const post = posts.find(p => p.post_id === order.post_id);
                  const buyer = users.find(u => u.user_id === order.buyer_id);

                  return (
                    <tr key={order.order_id} className="hover:bg-slate-900/50">
                      <td className="p-3 font-mono text-slate-400">#{order.order_id}</td>
                      <td className="p-3 font-medium text-white max-w-xs truncate">
                        {post?.title || `Post #${order.post_id}`}
                      </td>
                      <td className="p-3 font-bold text-cyan-400">{order.amount.toLocaleString()} THB</td>
                      <td className="p-3">
                        <button
                          onClick={() => setPreviewSlipUrl(order.slip_image)}
                          className="flex items-center gap-1.5 px-2 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded border border-slate-700 text-[11px]"
                        >
                          <Eye className="w-3 h-3" /> ดูสลิป
                        </button>
                      </td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          order.status === 'Completed' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                          order.status === 'Pending' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                          'bg-rose-950 text-rose-400 border border-rose-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-3 text-slate-400">{order.order_date}</td>
                      <td className="p-3 text-right space-x-1.5">
                        {order.status === 'Pending' && (
                          <>
                            <button
                              onClick={() => {
                                updateOrderStatus(order.order_id, 'Completed');
                                confetti({ particleCount: 60, spread: 50 });
                              }}
                              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded text-[11px]"
                            >
                              อนุมัติสลิป & ส่งมอบ
                            </button>
                            <button
                              onClick={() => updateOrderStatus(order.order_id, 'Cancelled')}
                              className="px-2.5 py-1 bg-rose-950 hover:bg-rose-900 text-rose-300 rounded text-[11px] border border-rose-800"
                            >
                              ปฏิเสธ
                            </button>
                          </>
                        )}
                        {order.status !== 'Pending' && (
                          <span className="text-[11px] text-slate-500">ดำเนินรายการแล้ว</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Slip zoom modal */}
          {previewSlipUrl && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90" onClick={() => setPreviewSlipUrl(null)}>
              <div className="relative max-w-sm bg-slate-900 p-3 rounded-xl border border-slate-700" onClick={(e) => e.stopPropagation()}>
                <img src={previewSlipUrl} alt="Slip zoom" className="w-full rounded-lg" />
                <button
                  onClick={() => setPreviewSlipUrl(null)}
                  className="w-full mt-3 py-1.5 bg-slate-800 text-slate-300 rounded text-xs"
                >
                  ปิด
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* CHATS TAB */}
      {activeTab === 'chats' && (
        <div className="bg-[#0f172a] rounded-xl border border-slate-800 p-5 shadow-lg space-y-4">
          <div>
            <h3 className="text-base font-bold text-white">ระบบจัดการแชทคนกลาง (Admin Chat Inbox)</h3>
            <p className="text-xs text-slate-400">ห้องแชทระหว่างผู้ซื้อ ผู้ขาย และแอดมินคนกลางทั้งหมดในระบบ</p>
          </div>

          <div className="space-y-3">
            {chatRooms.map(room => {
              const user = users.find(u => u.user_id === room.user_id);
              const post = room.related_post_id ? posts.find(p => p.post_id === room.related_post_id) : null;

              return (
                <div
                  key={room.room_id}
                  className="p-4 bg-slate-900 rounded-xl border border-slate-800 hover:border-cyan-500/40 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-cyan-950 border border-cyan-700/60 flex items-center justify-center text-cyan-300 font-bold text-xs">
                      #{room.room_id.toString().substring(0, 3)}
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-white flex items-center gap-2">
                        {room.title}
                        <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.2 rounded border border-emerald-800 font-semibold">
                          OPEN
                        </span>
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        สมาชิก: <span className="text-slate-200">{user?.username}</span> • สร้างเมื่อ: {room.created_at}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => openChatRoom(room.room_id)}
                    className="px-4 py-2 bg-gradient-to-r from-cyan-600 to-teal-600 hover:from-cyan-500 hover:to-teal-500 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    ตอบกลับแชท
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

    </div>
  );
};
