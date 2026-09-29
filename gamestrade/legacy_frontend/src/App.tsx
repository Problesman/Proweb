import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Marketplace } from './components/Marketplace';
import { PostDetailModal } from './components/PostDetailModal';
import { SellPostModal } from './components/SellPostModal';
import { ChatModal } from './components/ChatModal';
import { AdminDashboard } from './components/AdminDashboard';
import { UserProfileModal } from './components/UserProfileModal';
import { AuthModal } from './components/AuthModal';
import { DjangoCodeModal } from './components/DjangoCodeModal';
import { MessageSquare, ShieldCheck, CheckCircle2, AlertCircle } from 'lucide-react';

const MainContent: React.FC = () => {
  const { 
    currentView, 
    selectedPost, 
    setSelectedPost, 
    isChatModalOpen, 
    setIsChatModalOpen, 
    notification 
  } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-[#0b0f17] text-slate-100 selection:bg-cyan-500 selection:text-black">
      
      {/* Toast Notification */}
      {notification && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/95 border border-cyan-500/50 text-cyan-200 px-4 py-2.5 rounded-xl shadow-2xl backdrop-blur-md text-xs font-semibold flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Main Top Navigation */}
      <Navbar />

      {/* Dynamic Views */}
      <main className="flex-1">
        {currentView === 'marketplace' && <Marketplace />}
        {currentView === 'admin-dashboard' && <AdminDashboard />}
        {currentView === 'my-profile' && <UserProfileModal />}
        {currentView === 'django-code' && <DjangoCodeModal />}
      </main>

      {/* Floating Middleman Chat Trigger on Bottom Right */}
      {!isChatModalOpen && (
        <button
          onClick={() => setIsChatModalOpen(true)}
          className="fixed bottom-6 right-6 z-40 px-4 py-3 bg-gradient-to-r from-cyan-500 via-teal-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 text-slate-950 font-bold text-xs sm:text-sm rounded-2xl shadow-xl shadow-cyan-500/25 flex items-center gap-2 hover:scale-105 transition-all group"
        >
          <div className="relative">
            <MessageSquare className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-950 ring-2 ring-emerald-400 animate-pulse"></span>
          </div>
          <span className="hidden sm:inline">ห้องแชทคนกลาง (Middleman Escrow)</span>
          <span className="sm:hidden">แชทคนกลาง</span>
        </button>
      )}

      {/* Modals */}
      <PostDetailModal post={selectedPost} onClose={() => setSelectedPost(null)} />
      <SellPostModal />
      <ChatModal />
      <AuthModal />

      {/* Footer matching project specifications */}
      <footer className="mt-auto border-t border-slate-900 bg-[#070b12] py-8 px-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-slate-400">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-slate-200">GameTrade Hub</span>
            <span>• โครงงานระบบซื้อขายไอดีเกม (Class Project Proposal)</span>
          </div>

          <div className="text-slate-400 text-[11px]">
            <span>ผู้จัดทำ: <strong>นายณัฐชนน สิงห์ศรี</strong> รหัสนักศึกษา <strong>68114640228</strong></span>
          </div>

          <div className="text-slate-500 text-[11px]">
            <span>Base: Django Python | Frontend: Tailwind CSS, JS & AlpineJS</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
