import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Lock, Mail, User, ShieldCheck } from 'lucide-react';
import { UserRole } from '../types';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalMode, 
    setAuthModalMode,
    login, 
    registerUser, 
    resetUserPassword 
  } = useApp();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('Member');

  if (!isAuthModalOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = login(username || email);
    if (success) {
      setIsAuthModalOpen(false);
      setUsername('');
      setPassword('');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email || !password) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    const success = registerUser({
      username,
      email,
      password,
      role
    });
    if (success) {
      setIsAuthModalOpen(false);
      setUsername('');
      setEmail('');
      setPassword('');
    }
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      alert('กรุณากรอกอีเมล');
      return;
    }
    const success = resetUserPassword(email);
    if (success) {
      setAuthModalMode('login');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div 
        className="relative w-full max-w-md bg-[#0c1322] border border-cyan-800/60 rounded-2xl shadow-2xl p-6 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-2">
            <Lock className="w-6 h-6 text-cyan-400" />
          </div>
          <h3 className="text-lg font-bold text-white">
            {authModalMode === 'login' && 'เข้าสู่ระบบ GameTrade Hub'}
            {authModalMode === 'register' && 'สมัครสมาชิกใหม่'}
            {authModalMode === 'forgot_password' && 'รีเซ็ตรหัสผ่าน (Reset Password)'}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {authModalMode === 'login' && 'เข้าสู่ระบบเพื่อลงขายไอดีเกมหรือทำการสั่งซื้อ'}
            {authModalMode === 'register' && 'สร้างบัญชีผู้ซื้อ/ผู้ขาย หรือผู้ดูแลระบบ'}
            {authModalMode === 'forgot_password' && 'กรอกอีเมลของคุณเพื่อรับลิงก์ตั้งรหัสผ่านใหม่'}
          </p>
        </div>

        {/* LOGIN FORM */}
        {authModalMode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-3.5">
            <div>
              <label className="text-xs text-slate-300 block mb-1">ชื่อผู้ใช้หรืออีเมล</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="เช่น Natthanon_Buyer หรือ WolfLord_Pro"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs text-slate-300">รหัสผ่าน</label>
                <button
                  type="button"
                  onClick={() => setAuthModalMode('forgot_password')}
                  className="text-[11px] text-cyan-400 hover:underline"
                >
                  ลืมรหัสผ่าน?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs shadow-md transition-colors"
            >
              เข้าสู่ระบบ
            </button>

            <p className="text-center text-xs text-slate-400 pt-2">
              ยังไม่มีบัญชี?{' '}
              <button
                type="button"
                onClick={() => setAuthModalMode('register')}
                className="text-cyan-400 font-semibold hover:underline"
              >
                สมัครสมาชิก
              </button>
            </p>
          </form>
        )}

        {/* REGISTER FORM */}
        {authModalMode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div>
              <label className="text-xs text-slate-300 block mb-1">ชื่อผู้ใช้งาน (Username)</label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="เช่น ProPlayer_TH"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">อีเมล (Email)</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gametrade.com"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">รหัสผ่าน (Password)</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="อย่างน้อย 6 ตัวอักษร"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white"
              />
            </div>

            <div>
              <label className="text-xs text-slate-300 block mb-1">ประเภทสิทธิ์การใช้งาน (Role)</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white"
              >
                <option value="Member">Member (สมาชิกทั่วไป: ผู้ซื้อ & ผู้ขาย)</option>
                <option value="Admin">Admin (ผู้ดูแลระบบ & เจ้าหน้าที่คนกลาง Escrow)</option>
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs shadow-md transition-colors"
            >
              ยืนยันการสมัครสมาชิก
            </button>

            <p className="text-center text-xs text-slate-400 pt-2">
              มีบัญชีอยู่แล้ว?{' '}
              <button
                type="button"
                onClick={() => setAuthModalMode('login')}
                className="text-cyan-400 font-semibold hover:underline"
              >
                เข้าสู่ระบบ
              </button>
            </p>
          </form>
        )}

        {/* FORGOT PASSWORD FORM */}
        {authModalMode === 'forgot_password' && (
          <form onSubmit={handleResetPassword} className="space-y-3.5">
            <div>
              <label className="text-xs text-slate-300 block mb-1">อีเมลของคุณ</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="กรอกอีเมลที่ลงทะเบียนไว้"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2 text-xs text-white"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold text-xs shadow-md transition-colors"
            >
              ส่งลิงก์รีเซ็ตรหัสผ่าน
            </button>

            <p className="text-center text-xs text-slate-400 pt-2">
              <button
                type="button"
                onClick={() => setAuthModalMode('login')}
                className="text-cyan-400 font-semibold hover:underline"
              >
                ← กลับสู่หน้าเข้าสู่ระบบ
              </button>
            </p>
          </form>
        )}

      </div>
    </div>
  );
};
