import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Send, 
  Image as ImageIcon, 
  Paperclip, 
  ShieldCheck, 
  CreditCard, 
  Key, 
  CheckCircle2, 
  AlertCircle, 
  UserCheck,
  Sparkles,
  Lock
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const ChatModal: React.FC = () => {
  const { 
    currentUser, 
    users, 
    chatRooms, 
    chatMessages, 
    activeChatRoomId, 
    setActiveChatRoomId,
    isChatModalOpen, 
    setIsChatModalOpen,
    sendMessage,
    adminEscrowAction,
    posts
  } = useApp();

  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showAttachmentMenu, setShowAttachmentMenu] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Active room
  const activeRoom = chatRooms.find(r => r.room_id === activeChatRoomId) || chatRooms[0];
  const relatedPost = activeRoom?.related_post_id ? posts.find(p => p.post_id === activeRoom.related_post_id) : null;
  const roomMessages = chatMessages.filter(m => m.room_id === activeRoom?.room_id);

  const adminUser = users.find(u => u.role === 'Admin') || users[0];

  // Scroll to bottom on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [roomMessages.length, isChatModalOpen]);

  if (!isChatModalOpen || !activeRoom) return null;

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !selectedImage) return;

    sendMessage(activeRoom.room_id, inputText.trim(), selectedImage || undefined);
    setInputText('');
    setSelectedImage(null);
    setShowAttachmentMenu(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const sendQuickSlip = () => {
    sendMessage(
      activeRoom.room_id, 
      'แนบสลิปการโอนเงินเข้าบัญชีคนกลาง GameTrade Escrow ยอด ' + (relatedPost ? `${relatedPost.price.toLocaleString()} THB` : 'ค่าไอดี'),
      'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=500&q=80'
    );
    setShowAttachmentMenu(false);
  };

  const sendQuickCredentials = () => {
    sendMessage(
      activeRoom.room_id, 
      'ส่งมอบข้อมูลไอดีสำหรับตรวจสอบ: Riot ID: ' + (relatedPost?.title.substring(0, 15) || 'GamerPro') + ' | Password: [เข้ารหัสในระบบคนกลาง]',
      undefined
    );
    setShowAttachmentMenu(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md">
      <div 
        className="relative w-full max-w-4xl h-[90vh] max-h-[750px] bg-[#0b101c] border border-cyan-800/60 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Chat Window Top Bar matching page 5 screenshot */}
        <div className="px-5 py-3.5 bg-[#0f172a] border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 to-teal-400 p-[1.5px]">
              <div className="w-full h-full bg-[#0d1424] rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm text-white">
                  {activeRoom.title || `Chat ID: ${activeRoom.room_id} - Middleman Transaction`}
                </h3>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-600/40 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  LIVE MIDDLEMAN
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                <span>เจ้าหน้าที่คนกลาง: <strong className="text-cyan-300">{adminUser.username}</strong></span>
                <span>•</span>
                <span>ความปลอดภัย: <strong className="text-emerald-400">Escrow Protected</strong></span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Room Selector if multiple rooms exist */}
            {chatRooms.length > 1 && (
              <select
                value={activeRoom.room_id}
                onChange={(e) => setActiveChatRoomId(Number(e.target.value))}
                className="bg-slate-900 border border-slate-700 text-slate-300 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none"
              >
                {chatRooms.map(r => (
                  <option key={r.room_id} value={r.room_id}>
                    ห้อง #{r.room_id}
                  </option>
                ))}
              </select>
            )}

            <button
              onClick={() => setIsChatModalOpen(false)}
              className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center border border-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Post details pill if linked */}
        {relatedPost && (
          <div className="bg-slate-900/90 px-5 py-2 border-b border-slate-800/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 truncate">
              <span className="text-slate-400">ไอดีที่ทำรายการ:</span>
              <span className="font-semibold text-white truncate max-w-sm">{relatedPost.title}</span>
              <span className="text-cyan-400 font-bold">({relatedPost.price.toLocaleString()} THB)</span>
            </div>
            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
              relatedPost.status === 'Available' ? 'bg-emerald-950 text-emerald-400 border border-emerald-600/40' :
              relatedPost.status === 'Pending' ? 'bg-amber-950 text-amber-400 border border-amber-600/40' :
              'bg-rose-950 text-rose-400 border border-rose-600/40'
            }`}>
              สถานะ: {relatedPost.status}
            </span>
          </div>
        )}

        {/* Escrow Steps Progress Bar */}
        <div className="bg-[#090e18] px-5 py-2 border-b border-slate-800/60 flex items-center justify-around text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5 text-cyan-400 font-medium">
            <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500 flex items-center justify-center text-[9px] font-bold">1</span>
            <span>ผู้ซื้อโอนเงินเข้าคนกลาง</span>
          </div>
          <span className="text-slate-600">→</span>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-300 border border-slate-600 flex items-center justify-center text-[9px] font-bold">2</span>
            <span>แอดมินเช็คสลิป & ไอดี</span>
          </div>
          <span className="text-slate-600">→</span>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-300 border border-slate-600 flex items-center justify-center text-[9px] font-bold">3</span>
            <span>ส่งมอบไอดีให้ผู้ซื้อ</span>
          </div>
          <span className="text-slate-600">→</span>
          <div className="flex items-center gap-1.5 text-slate-300">
            <span className="w-4 h-4 rounded-full bg-slate-800 text-slate-300 border border-slate-600 flex items-center justify-center text-[9px] font-bold">4</span>
            <span>โอนเงินให้ผู้ขาย</span>
          </div>
        </div>

        {/* Admin Middleman Controls Toolbar (Only active if current user is Admin or for demo testing) */}
        {currentUser?.role === 'Admin' && (
          <div className="bg-purple-950/30 px-5 py-2 border-b border-purple-800/40 flex flex-wrap items-center gap-2 text-xs">
            <span className="font-bold text-purple-300 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" /> แผงควบคุมคนกลาง (Admin Escrow Actions):
            </span>
            <button
              onClick={() => adminEscrowAction(activeRoom.room_id, 'payment_verified')}
              className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold rounded-lg text-[11px] transition-colors"
            >
              1. ยืนยันสลิปเงินเข้า
            </button>
            <button
              onClick={() => adminEscrowAction(activeRoom.room_id, 'escrow_hold')}
              className="px-2.5 py-1 bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold rounded-lg text-[11px] transition-colors"
            >
              2. ตรวจสอบเมลแท้ผู้ขาย
            </button>
            <button
              onClick={() => adminEscrowAction(activeRoom.room_id, 'credentials_delivered')}
              className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-[11px] transition-colors"
            >
              3. ส่งมอบไอดีให้ผู้ซื้อ
            </button>
            <button
              onClick={() => {
                adminEscrowAction(activeRoom.room_id, 'trade_completed');
                confetti({ particleCount: 100, spread: 70 });
              }}
              className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-lg text-[11px] transition-colors"
            >
              4. ปิดเคส & โอนเงินผู้ขาย
            </button>
          </div>
        )}

        {/* Message Area matching screenshot page 5 */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-radial from-[#0d1424] to-[#080d17]">
          {roomMessages.map(msg => {
            const sender = users.find(u => u.user_id === msg.sender_id);
            const isMe = currentUser?.user_id === msg.sender_id;
            const isAdmin = sender?.role === 'Admin' || msg.is_system;

            return (
              <div
                key={msg.message_id}
                className={`flex gap-3 ${isMe ? 'justify-end' : 'justify-start'}`}
              >
                {!isMe && (
                  <img
                    src={sender?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80'}
                    alt={sender?.username}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-cyan-500/30 shrink-0 self-end"
                  />
                )}

                <div className={`max-w-[75%] sm:max-w-[65%] space-y-1`}>
                  {/* Sender Name & Role */}
                  <div className={`flex items-center gap-1.5 text-[11px] text-slate-400 ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <span className="font-semibold text-slate-300">
                      {isMe ? 'คุณ (' + currentUser.username + ')' : (sender?.username || 'Admin Sarah')}
                    </span>
                    {isAdmin && (
                      <span className="bg-purple-900/60 text-purple-300 px-1.5 py-0.2 rounded text-[9px] font-bold border border-purple-700/50">
                        ADMIN
                      </span>
                    )}
                    <span className="text-[10px] text-slate-500">{msg.timestamp.substring(11, 16)}</span>
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-md ${
                      msg.is_system
                        ? 'bg-gradient-to-r from-cyan-950/90 to-slate-900 border border-cyan-500/50 text-cyan-200'
                        : isMe
                        ? 'bg-cyan-600 text-slate-950 font-medium rounded-br-none shadow-cyan-600/20'
                        : 'bg-slate-800/90 text-slate-100 rounded-bl-none border border-slate-700/60'
                    }`}
                  >
                    {/* Attached image if present */}
                    {msg.image_url && (
                      <div className="mb-2 rounded-xl overflow-hidden border border-black/20">
                        <img 
                          src={msg.image_url} 
                          alt="Attachment" 
                          className="w-full max-h-64 object-cover" 
                        />
                      </div>
                    )}
                    <p className="whitespace-pre-wrap">{msg.text_content}</p>
                  </div>
                </div>

                {isMe && (
                  <img
                    src={currentUser?.avatar || 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=80&q=80'}
                    alt={currentUser?.username}
                    className="w-8 h-8 rounded-full object-cover ring-1 ring-cyan-500/30 shrink-0 self-end"
                  />
                )}
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Selected Image preview before send */}
        {selectedImage && (
          <div className="bg-slate-900 px-4 py-2 border-t border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src={selectedImage} alt="Upload preview" className="w-12 h-12 object-cover rounded-lg border border-slate-700" />
              <span className="text-xs text-cyan-300">รูปภาพพร้อมส่ง (สลิป/หลักฐาน)</span>
            </div>
            <button
              onClick={() => setSelectedImage(null)}
              className="text-xs text-rose-400 hover:text-rose-300"
            >
              ลบรูป
            </button>
          </div>
        )}

        {/* Quick Attachment Options matching screenshot page 5 */}
        {showAttachmentMenu && (
          <div className="bg-[#0f172a] px-4 py-2.5 border-t border-slate-800 flex flex-wrap gap-2 text-xs">
            <label className="cursor-pointer px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg flex items-center gap-1.5 border border-slate-700 transition-colors">
              <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>Send Image</span>
              <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
            </label>
            <button
              onClick={sendQuickSlip}
              className="px-3 py-1.5 bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 rounded-lg flex items-center gap-1.5 border border-emerald-700/60 transition-colors"
            >
              <CreditCard className="w-3.5 h-3.5 text-emerald-400" />
              <span>Send Payment Slip (แนบสลิปจำลอง)</span>
            </button>
            <button
              onClick={sendQuickCredentials}
              className="px-3 py-1.5 bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 rounded-lg flex items-center gap-1.5 border border-amber-700/60 transition-colors"
            >
              <Key className="w-3.5 h-3.5 text-amber-400" />
              <span>Send Game ID (ส่งมอบรหัส)</span>
            </button>
          </div>
        )}

        {/* Input Bar matching page 5 screenshot */}
        <form onSubmit={handleSend} className="p-3 bg-[#0d1424] border-t border-slate-800 flex items-center gap-2">
          
          <button
            type="button"
            onClick={() => setShowAttachmentMenu(!showAttachmentMenu)}
            className={`p-2.5 rounded-xl border transition-colors ${
              showAttachmentMenu
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
            title="แนบรูปภาพหรือสลิป"
          >
            <Paperclip className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type a message (พิมพ์ข้อความถึงแอดมินหรือคู่ค้า)..."
            className="flex-1 bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />

          <button
            type="submit"
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-cyan-500/20 transition-all"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </form>

        {/* Bottom Banner */}
        <div className="bg-[#080d17] py-1.5 px-4 text-center border-t border-slate-900 text-[10px] text-slate-500 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-cyan-500" />
          <span>Safe & Secure Middleman Service • ประวัติการสนทนาถูกบันทึกในระบบเพื่อความโปร่งใส</span>
        </div>
      </div>
    </div>
  );
};
