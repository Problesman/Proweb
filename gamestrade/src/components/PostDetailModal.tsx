import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GamePost } from '../types';
import { 
  X, 
  ShieldCheck, 
  MessageSquare, 
  ShoppingCart, 
  Star, 
  UserCheck, 
  CheckCircle2, 
  Server, 
  Award, 
  Calendar, 
  Mail, 
  Lock, 
  Clock, 
  Upload,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PostDetailModalProps {
  post: GamePost | null;
  onClose: () => void;
}

export const PostDetailModal: React.FC<PostDetailModalProps> = ({ post, onClose }) => {
  const { 
    currentUser, 
    users, 
    categories, 
    startOrOpenChatForPost, 
    createOrder, 
    setIsAuthModalOpen, 
    setAuthModalMode 
  } = useApp();

  const [isOrdering, setIsOrdering] = useState(false);
  const [slipImage, setSlipImage] = useState<string>('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80');
  const [orderNotes, setOrderNotes] = useState('');
  const [isSubmittingOrder, setIsSubmittingOrder] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  if (!post) return null;

  const seller = users.find(u => u.user_id === post.seller_id);
  const category = categories.find(c => c.category_id === post.category_id);

  const handleOrderSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setAuthModalMode('login');
      setIsAuthModalOpen(true);
      return;
    }

    setIsSubmittingOrder(true);
    setTimeout(() => {
      createOrder(post.post_id, post.price, slipImage, orderNotes);
      setIsSubmittingOrder(false);
      setOrderSuccess(true);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 }
      });
      setTimeout(() => {
        setOrderSuccess(false);
        setIsOrdering(false);
        // open chat with admin
        startOrOpenChatForPost(post.post_id);
      }, 1500);
    }, 800);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSlipImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="relative w-full max-w-4xl bg-[#0c1322] border border-cyan-900/60 rounded-2xl shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white flex items-center justify-center border border-slate-700 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header & Image matching screenshot page 4 */}
        <div className="relative aspect-[21/9] sm:aspect-[21/8] bg-slate-900 overflow-hidden">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c1322] via-[#0c1322]/50 to-transparent"></div>
          
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between">
            <div>
              <span className="px-2.5 py-1 rounded bg-cyan-500/20 text-cyan-300 text-xs font-bold border border-cyan-500/40">
                {category?.name || 'Game'}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white mt-1.5 drop-shadow">
                {post.title}
              </h2>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">ราคาจำหน่าย</p>
              <p className="text-2xl sm:text-3xl font-black text-cyan-400">
                {post.price.toLocaleString()} <span className="text-sm font-semibold text-slate-300">THB</span>
              </p>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: Account Details (2 cols) */}
          <div className="lg:col-span-2 space-y-5">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-2">
                รายละเอียดบัญชีไอดีเกม (Account Details)
              </h4>
              <p className="text-sm text-slate-300 leading-relaxed bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                {post.description}
              </p>
            </div>

            {/* Specs Grid matching proposal screenshot */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Server className="w-3.5 h-3.5 text-cyan-400" /> เซิร์ฟเวอร์ (Location)
                </p>
                <p className="text-xs font-bold text-slate-200 mt-1">{post.server || 'APAC / Thailand'}</p>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-cyan-400" /> ระดับแรงค์ (Rank)
                </p>
                <p className="text-xs font-bold text-slate-200 mt-1">{post.rank || 'Radiance'}</p>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-cyan-400" /> เลเวล / กิจกรรม
                </p>
                <p className="text-xs font-bold text-slate-200 mt-1">Level {post.level || 285}</p>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-emerald-400" /> สถานะอีเมลแท้
                </p>
                <p className="text-xs font-bold text-emerald-400 mt-1">
                  {post.original_email ? 'เมลแท้ ย้ายได้ 100%' : 'เมลเปลี่ยนแล้ว'}
                </p>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400" /> Battle Pass
                </p>
                <p className="text-xs font-bold text-slate-200 mt-1">
                  {post.battle_pass ? 'มีประวัติซื้อครบ' : 'ไม่มี'}
                </p>
              </div>

              <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                <p className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Lock className="w-3.5 h-3.5 text-cyan-400" /> ยืนยันบัตรประชาชน
                </p>
                <p className="text-xs font-bold text-cyan-300 mt-1">
                  {post.secondary_verification ? 'Verified ID' : 'Unverified'}
                </p>
              </div>
            </div>

            {/* Escrow Guarantee Box */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-950/40 via-cyan-950/30 to-slate-900 border border-emerald-500/40 flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
              <div className="text-xs">
                <h5 className="font-bold text-emerald-300">การันตีความปลอดภัยโดยระบบคนกลาง (Safe Middleman)</h5>
                <p className="text-slate-300 mt-0.5 leading-relaxed">
                  ผู้ซื้อชำระเงินเข้าสู่ระบบ Escrow บัญชีกลาง แอดมินทำการตรวจสอบไอดีกับผู้ขาย ดึงข้อมูลและโอนกรรมสิทธิ์ให้ผู้ซื้ออย่างโปร่งใส ป้องกันการดึงไอดีกลับ 100%
                </p>
              </div>
            </div>

            {/* Inline Order / Slip Form when triggered */}
            {isOrdering && (
              <form onSubmit={handleOrderSubmit} className="p-4 bg-slate-900/90 rounded-xl border border-cyan-500/40 space-y-3">
                <h5 className="text-xs font-bold text-cyan-300 flex items-center gap-2">
                  <Upload className="w-4 h-4" /> สั่งซื้อและแนบสลิปการโอนเงิน (Order & Attach Transfer Slip)
                </h5>

                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>ยอดที่ต้องชำระ:</span>
                    <span className="font-bold text-cyan-400">{post.price.toLocaleString()} THB</span>
                  </div>
                  <div className="flex justify-between text-slate-400 mt-1">
                    <span>บัญชีคนกลาง GameTrade Escrow:</span>
                    <span>ธ.กสิกรไทย 098-X-XXXXX-X (นายคนกลาง GameTrade)</span>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    อัปโหลดสลิปโอนเงิน (FileBrowse Component)
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="w-full text-xs text-slate-400 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-cyan-600 file:text-white hover:file:bg-cyan-500"
                  />
                  {slipImage && (
                    <div className="mt-2 flex items-center gap-3">
                      <img src={slipImage} alt="Slip preview" className="w-16 h-20 object-cover rounded border border-slate-700" />
                      <span className="text-[11px] text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> แนบสลิปพร้อมตรวจสอบแล้ว
                      </span>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    หมายเหตุเพิ่มเติมถึงแอดมิน (TextArea Component)
                  </label>
                  <textarea
                    rows={2}
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    placeholder="เช่น โอนเวลา 14:02 จากบัญชีชื่อ ณัฐชนน..."
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-xs text-white placeholder-slate-500"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    disabled={isSubmittingOrder}
                    className="flex-1 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition-colors"
                  >
                    {isSubmittingOrder ? 'กำลังส่งข้อมูล...' : 'ยืนยันสั่งซื้อและส่งตรวจสลิป'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOrdering(false)}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs"
                  >
                    ยกเลิก
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Right Column: Seller Profile & CTA Buttons */}
          <div className="space-y-4">
            
            {/* Seller Info Card matching page 4 mockup */}
            <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Seller info (ข้อมูลผู้ขาย)
              </h4>
              
              <div className="flex items-center gap-3">
                <img
                  src={seller?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=80'}
                  alt={seller?.username}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-cyan-500/40"
                />
                <div>
                  <p className="font-bold text-sm text-slate-100 flex items-center gap-1.5">
                    {seller?.username || 'Verified Seller'}
                    <span className="text-[10px] bg-emerald-950/80 text-emerald-400 px-1.5 py-0.2 rounded border border-emerald-700/60">
                      Verified
                    </span>
                  </p>
                  <div className="flex items-center gap-1 text-amber-400 text-xs mt-0.5">
                    <Star className="w-3 h-3 fill-amber-400" />
                    <Star className="w-3 h-3 fill-amber-400" />
                    <Star className="w-3 h-3 fill-amber-400" />
                    <Star className="w-3 h-3 fill-amber-400" />
                    <Star className="w-3 h-3 fill-amber-400" />
                    <span className="text-[11px] text-slate-400 ml-1">5.0 (42 รีวิว)</span>
                  </div>
                </div>
              </div>

              <div className="text-[11px] text-slate-400 space-y-1 pt-2 border-t border-slate-800">
                <p>สมาชิกตั้งแต่: 20 มกราคม 2021</p>
                <p>ประวัติการขาย: 18 รายการ (สำเร็จ 100%)</p>
                <p>ออนไลน์ล่าสุด: 16 นาทีที่แล้ว</p>
              </div>
            </div>

            {/* Action Buttons matching page 4 mockup */}
            <div className="space-y-2">
              <button
                onClick={() => {
                  onClose();
                  startOrOpenChatForPost(post.post_id);
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 hover:from-emerald-500 hover:to-cyan-500 text-white font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                ติดต่อแอดมินเพื่อซื้อขาย (Chat Middleman)
              </button>

              <button
                onClick={() => setIsOrdering(true)}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-800/40 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <ShoppingCart className="w-4 h-4 text-cyan-400" />
                สั่งซื้อ & แนบหลักฐานสลิปทันที
              </button>
            </div>

            {/* Security Note */}
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 space-y-1">
              <p className="font-semibold text-slate-300">เงื่อนไขการส่งมอบไอดี:</p>
              <p>• ห้ามติดต่อโอนเงินตรงกับผู้ขายโดยไม่ผ่านแอดมิน</p>
              <p>• ผู้ซื้อมีเวลา 24 ชม. ตรวจสอบข้อมูลก่อนเงินถูกปล่อย</p>
            </div>

          </div>

        </div>

        {/* Footer info */}
        <div className="bg-[#090e18] px-6 py-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
          <span>Post ID: #{post.post_id}</span>
          <span>ลงขายเมื่อ: {post.created_at}</span>
        </div>
      </div>
    </div>
  );
};
