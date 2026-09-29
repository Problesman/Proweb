import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  Gamepad2, 
  PlusCircle, 
  MessageSquare, 
  User as UserIcon, 
  LayoutDashboard, 
  Code2, 
  LogOut, 
  ChevronDown, 
  Sparkles,
  Users
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { 
    currentUser, 
    users, 
    switchUser, 
    logout, 
    currentView, 
    setCurrentView, 
    setIsSellModalOpen, 
    setEditingPost,
    setIsChatModalOpen,
    setIsAuthModalOpen,
    setAuthModalMode,
    chatRooms
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isRoleSwitcherOpen, setIsRoleSwitcherOpen] = useState(false);

  const unreadMessagesCount = 1; // Visual badge for active middleman chat

  return (
    <header className="sticky top-0 z-40 bg-[#0c121e]/90 backdrop-blur-md border-b border-cyan-950/60 shadow-lg shadow-black/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => setCurrentView('marketplace')}>
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-teal-500 to-emerald-400 p-[1.5px] shadow-md shadow-cyan-500/20">
              <div className="w-full h-full bg-[#0b101b] rounded-[10px] flex items-center justify-center">
                <Gamepad2 className="w-6 h-6 text-cyan-400" />
              </div>
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-white flex items-center gap-1.5">
                GameTrade <span className="text-cyan-400 font-black">Hub</span>
              </span>
              <p className="text-[10px] text-slate-400 -mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" /> Middleman Escrow System
              </p>
            </div>
          </div>

          {/* Center Navigation */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <button
              onClick={() => setCurrentView('marketplace')}
              className={`px-3 py-2 rounded-lg transition-all ${
                currentView === 'marketplace'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              HOME
            </button>
            <button
              onClick={() => {
                setCurrentView('marketplace');
                const searchEl = document.getElementById('marketplace-search-input');
                searchEl?.focus();
              }}
              className="px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all"
            >
              SEARCH
            </button>
            <button
              onClick={() => {
                if (!currentUser) {
                  setAuthModalMode('login');
                  setIsAuthModalOpen(true);
                  return;
                }
                setEditingPost(null);
                setIsSellModalOpen(true);
              }}
              className="px-3.5 py-2 rounded-lg text-emerald-300 hover:text-emerald-200 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <PlusCircle className="w-4 h-4 text-emerald-400" />
              SELL
            </button>
            <button
              onClick={() => {
                if (chatRooms.length > 0) {
                  setIsChatModalOpen(true);
                } else {
                  setCurrentView('marketplace');
                }
              }}
              className="relative px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all flex items-center gap-1.5"
            >
              <MessageSquare className="w-4 h-4 text-cyan-400" />
              COMMUNITY & CHAT
              {unreadMessagesCount > 0 && (
                <span className="w-2 h-2 rounded-full bg-cyan-400 ring-4 ring-cyan-500/20 animate-pulse"></span>
              )}
            </button>

            {/* Admin Dashboard Tab */}
            <button
              onClick={() => setCurrentView('admin-dashboard')}
              className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                currentView === 'admin-dashboard'
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                  : 'text-slate-300 hover:text-purple-300 hover:bg-purple-950/30'
              }`}
            >
              <LayoutDashboard className="w-4 h-4 text-purple-400" />
              ADMIN DASHBOARD
            </button>

            {/* Django Project Architecture Inspector */}
            <button
              onClick={() => setCurrentView('django-code')}
              className={`px-3 py-2 rounded-lg transition-all flex items-center gap-1.5 ${
                currentView === 'django-code'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-slate-400 hover:text-amber-300 hover:bg-slate-800/40'
              }`}
              title="ดูโครงสร้างโค้ด Django Python Models & Architecture สำหรับโครงงาน"
            >
              <Code2 className="w-4 h-4 text-amber-400" />
              DJANGO CODE
            </button>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-3">
            
            {/* Quick Role Switcher Button (Crucial for testing all 3 roles!) */}
            <div className="relative">
              <button
                onClick={() => setIsRoleSwitcherOpen(!isRoleSwitcherOpen)}
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-800/80 hover:bg-slate-700/80 text-xs font-medium rounded-lg border border-slate-700 text-slate-300 transition-colors"
                title="สลับบทบาทผู้ใช้เพื่อทดสอบระบบ"
              >
                <Users className="w-3.5 h-3.5 text-cyan-400" />
                <span>สลับ User:</span>
                <span className="font-semibold text-cyan-300">{currentUser?.username || 'Guest'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {isRoleSwitcherOpen && (
                <div 
                  className="absolute right-0 mt-2 w-64 bg-[#101726] border border-slate-700 rounded-xl shadow-2xl p-2 z-50 text-xs"
                  onClick={() => setIsRoleSwitcherOpen(false)}
                >
                  <p className="px-2 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    สลับบทบาทเพื่อทดสอบ (Test Roles)
                  </p>
                  <div className="space-y-1 mt-1">
                    {users.map(u => (
                      <button
                        key={u.user_id}
                        onClick={() => switchUser(u.user_id)}
                        className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between transition-colors ${
                          currentUser?.user_id === u.user_id 
                            ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/30' 
                            : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <img src={u.avatar} alt={u.username} className="w-6 h-6 rounded-full object-cover" />
                          <div>
                            <p className="font-medium text-slate-200">{u.username}</p>
                            <p className="text-[10px] text-slate-400">{u.role} - {u.status}</p>
                          </div>
                        </div>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                          u.role === 'Admin' ? 'bg-purple-900/60 text-purple-300 border border-purple-700' : 'bg-slate-700 text-slate-300'
                        }`}>
                          {u.role}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* User Account Menu */}
            {currentUser ? (
              <div className="relative">
                <button
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-colors"
                >
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser.username} 
                    className="w-8 h-8 rounded-lg object-cover ring-1 ring-cyan-500/40"
                  />
                  <div className="hidden lg:block text-left text-xs pr-1">
                    <p className="font-semibold text-slate-200 leading-tight flex items-center gap-1">
                      {currentUser.username}
                      {currentUser.role === 'Admin' && (
                        <span className="text-[9px] bg-purple-500/20 text-purple-400 px-1 py-0.2 rounded font-bold">ADMIN</span>
                      )}
                    </p>
                    <p className="text-[10px] text-slate-400">{currentUser.role === 'Admin' ? 'Middleman Staff' : 'Verified Member'}</p>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {isUserMenuOpen && (
                  <div 
                    className="absolute right-0 mt-2 w-56 bg-[#101726] border border-slate-700 rounded-xl shadow-2xl p-1.5 z-50 text-xs"
                    onClick={() => setIsUserMenuOpen(false)}
                  >
                    <div className="px-3 py-2 border-b border-slate-800 mb-1">
                      <p className="font-semibold text-slate-200">{currentUser.username}</p>
                      <p className="text-[11px] text-slate-400 truncate">{currentUser.email}</p>
                    </div>

                    <button
                      onClick={() => setCurrentView('my-profile')}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-slate-300 flex items-center gap-2"
                    >
                      <UserIcon className="w-4 h-4 text-cyan-400" />
                      โปรไฟล์และประวัติสั่งซื้อ
                    </button>

                    <button
                      onClick={() => {
                        setEditingPost(null);
                        setIsSellModalOpen(true);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-emerald-400 flex items-center gap-2"
                    >
                      <PlusCircle className="w-4 h-4 text-emerald-400" />
                      ลงประกาศขายไอดีใหม่
                    </button>

                    {currentUser.role === 'Admin' && (
                      <button
                        onClick={() => setCurrentView('admin-dashboard')}
                        className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-800 text-purple-300 flex items-center gap-2"
                      >
                        <LayoutDashboard className="w-4 h-4 text-purple-400" />
                        Admin Dashboard
                      </button>
                    )}

                    <div className="border-t border-slate-800 my-1"></div>

                    <button
                      onClick={logout}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-rose-950/40 text-rose-400 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4 text-rose-400" />
                      ออกจากระบบ (Logout)
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setAuthModalMode('login');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
                >
                  เข้าสู่ระบบ
                </button>
                <button
                  onClick={() => {
                    setAuthModalMode('register');
                    setIsAuthModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 shadow-sm shadow-cyan-500/20 transition-colors"
                >
                  สมัครสมาชิก
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Escrow banner matching proposal screenshot pages 4 and 5 */}
      <div className="bg-gradient-to-r from-cyan-950/90 via-slate-900 to-cyan-950/90 border-t border-b border-cyan-800/30 py-1.5 px-4 text-center">
        <div className="flex items-center justify-center gap-2 text-xs text-cyan-300">
          <ShieldCheck className="w-4 h-4 text-emerald-400 inline" />
          <span className="font-semibold text-white">Safe & Secure Middleman Service</span>
          <span className="text-slate-400 hidden sm:inline">- Safe Gaming nature recounting out. ซื้อขายปลอดภัยผ่านระบบคนกลางและสลิปยืนยัน</span>
          <button 
            onClick={() => setIsChatModalOpen(true)}
            className="underline text-cyan-400 hover:text-cyan-200 ml-1 font-medium"
          >
            เปิดห้องแชทคนกลาง
          </button>
        </div>
      </div>
    </header>
  );
};
