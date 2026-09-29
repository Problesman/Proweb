import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { GamePost, PostStatus } from '../types';
import { 
  X, 
  Upload, 
  Sparkles, 
  CheckCircle2, 
  ShieldAlert, 
  Layers, 
  DollarSign, 
  FileText, 
  CheckSquare, 
  Radio, 
  Calendar,
  Image as ImageIcon
} from 'lucide-react';

export const SellPostModal: React.FC = () => {
  const { 
    currentUser, 
    categories, 
    addPost, 
    updatePost, 
    editingPost, 
    setEditingPost, 
    isSellModalOpen, 
    setIsSellModalOpen 
  } = useApp();

  // Form states with all required component types:
  // 1. TextField
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [server, setServer] = useState('APAC (Thailand)');
  const [rank, setRank] = useState('');
  const [skinsCount, setSkinsCount] = useState('50');

  // 2. DropdownList (Select)
  const [categoryId, setCategoryId] = useState<number>(1);

  // 3. TextArea
  const [description, setDescription] = useState('');
  const [credentialsNote, setCredentialsNote] = useState('');

  // 4. RadioButton
  const [status, setStatus] = useState<PostStatus>('Available');

  // 5. CheckBox
  const [originalEmail, setOriginalEmail] = useState(true);
  const [battlePass, setBattlePass] = useState(true);
  const [secondaryVerification, setSecondaryVerification] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);

  // 6. DatetimePicker
  const [availableDate, setAvailableDate] = useState(new Date().toISOString().substring(0, 16));

  // 7. FileBrowse
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80');

  // Populate form if editing
  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title);
      setPrice(editingPost.price.toString());
      setCategoryId(editingPost.category_id);
      setDescription(editingPost.description);
      setStatus(editingPost.status);
      setImageUrl(editingPost.image);
      setServer(editingPost.server || 'APAC (Thailand)');
      setRank(editingPost.rank || '');
      setSkinsCount((editingPost.skins_count || 50).toString());
      setOriginalEmail(editingPost.original_email ?? true);
      setBattlePass(editingPost.battle_pass ?? true);
      setSecondaryVerification(editingPost.secondary_verification ?? true);
      setCredentialsNote(editingPost.game_credentials_note || '');
    } else {
      // Default reset
      setTitle('');
      setPrice('');
      setCategoryId(categories[0]?.category_id || 1);
      setDescription('');
      setStatus('Available');
      setImageUrl('https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80');
      setRank('');
      setCredentialsNote('');
    }
  }, [editingPost, categories]);

  if (!isSellModalOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !price) {
      alert('กรุณากรอกชื่อโพสต์และราคาให้ครบถ้วน');
      return;
    }
    if (!agreeTerms) {
      alert('กรุณายอมรับเงื่อนไขการซื้อขายผ่านคนกลาง');
      return;
    }

    if (editingPost) {
      updatePost(editingPost.post_id, {
        title,
        price: Number(price),
        category_id: Number(categoryId),
        description,
        status,
        image: imageUrl,
        server,
        rank,
        skins_count: Number(skinsCount) || 0,
        original_email: originalEmail,
        battle_pass: battlePass,
        secondary_verification: secondaryVerification,
        game_credentials_note: credentialsNote
      });
    } else {
      addPost({
        title,
        price: Number(price),
        category_id: Number(categoryId),
        description: description || 'ไอดีเกมสภาพดี พร้อมโอนย้ายเมลแท้ 100%',
        image: imageUrl,
        seller_id: currentUser ? currentUser.user_id : 2,
        server,
        rank: rank || 'Standard Rank',
        level: 100,
        skins_count: Number(skinsCount) || 10,
        original_email: originalEmail,
        battle_pass: battlePass,
        secondary_verification: secondaryVerification,
        game_credentials_note: credentialsNote
      });
    }

    setIsSellModalOpen(false);
    setEditingPost(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="relative w-full max-w-2xl bg-[#0c1322] border border-cyan-800/60 rounded-2xl shadow-2xl p-6 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-2 py-0.5 rounded font-bold border border-cyan-500/40">
              Form 7 Components Compliant
            </span>
            <h3 className="text-lg font-bold text-white mt-1">
              {editingPost ? '✏️ แก้ไขโพสต์ขายไอดีเกม' : '🎮 ลงประกาศขายไอดีเกมใหม่ (Create Game Post)'}
            </h3>
          </div>
          <button
            onClick={() => {
              setIsSellModalOpen(false);
              setEditingPost(null);
            }}
            className="w-8 h-8 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center border border-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 max-h-[75vh] overflow-y-auto pr-1">
          
          {/* 1. Component 1: DropdownList */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              1. หมวดหมู่เกม (DropdownList Component) <span className="text-rose-400">*</span>
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            >
              {categories.map(c => (
                <option key={c.category_id} value={c.category_id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* 2. Component 2: TextField (Title & Price) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                2. หัวข้อประกาศ (TextField Component) <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="เช่น VALORANT - RADIANCE RANK, RARE SKINS"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1">
                <DollarSign className="w-3.5 h-3.5 text-emerald-400" /> ราคาขาย (THB) <span className="text-rose-400">*</span>
              </label>
              <input
                type="number"
                required
                min={1}
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="15000"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-cyan-400 font-bold placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Additional TextFields: Server, Rank, Skins */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">เซิร์ฟเวอร์</label>
              <input
                type="text"
                value={server}
                onChange={(e) => setServer(e.target.value)}
                placeholder="APAC / TH"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">ระดับแรงค์ (Rank)</label>
              <input
                type="text"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                placeholder="Radiance / Master"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white"
              />
            </div>
            <div>
              <label className="block text-[11px] text-slate-400 mb-1">จำนวนสกิน</label>
              <input
                type="number"
                value={skinsCount}
                onChange={(e) => setSkinsCount(e.target.value)}
                placeholder="140"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs text-white"
              />
            </div>
          </div>

          {/* 3. Component 3: TextArea */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-cyan-400" />
              3. รายละเอียดบัญชีไอดีเกม (TextArea Component)
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="ระบุสกินเด่น, ข้อมูลประวัติการเล่น, ประวัติการเติมเงิน, ความสะอาดของไอดี..."
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Secret Credentials for Escrow handover */}
          <div>
            <label className="block text-[11px] font-medium text-amber-400 mb-1">
              🔒 ข้อมูลไอดี/รหัสผ่านสำหรับส่งมอบผ่าน Admin คนกลาง (ไม่เปิดเผยสู่สาธารณะ)
            </label>
            <input
              type="text"
              value={credentialsNote}
              onChange={(e) => setCredentialsNote(e.target.value)}
              placeholder="เช่น ID: player1 / Pass: secretpass (แอดมินคนกลางจะเป็นผู้ตรวจสอบก่อนโอน)"
              className="w-full bg-slate-950 border border-amber-900/60 rounded-xl px-3 py-1.5 text-xs text-slate-200 placeholder-slate-600"
            />
          </div>

          {/* 4. Component 4: RadioButton (Status) */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-cyan-400" />
              4. สถานะการขาย (RadioButton Component)
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Available', 'Pending', 'Sold'] as const).map((st) => (
                <label
                  key={st}
                  className={`flex items-center gap-2 p-2.5 rounded-xl border text-xs cursor-pointer transition-all ${
                    status === st
                      ? 'bg-cyan-950/40 border-cyan-500/60 text-cyan-300'
                      : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  <input
                    type="radio"
                    name="postStatus"
                    value={st}
                    checked={status === st}
                    onChange={() => setStatus(st)}
                    className="accent-cyan-400"
                  />
                  <span className="font-medium">
                    {st === 'Available' && 'พร้อมขาย'}
                    {st === 'Pending' && 'กำลังดำเนินการ'}
                    {st === 'Sold' && 'ขายแล้ว'}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* 5. Component 5: CheckBox */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-cyan-400" />
              5. ข้อมูลการยืนยัน (CheckBox Component)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 bg-slate-900/50 p-3 rounded-xl border border-slate-800">
              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={originalEmail}
                  onChange={(e) => setOriginalEmail(e.target.checked)}
                  className="accent-cyan-400 w-4 h-4 rounded"
                />
                <span>มีอีเมลแท้ส่งมอบ (Original Email)</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={battlePass}
                  onChange={(e) => setBattlePass(e.target.checked)}
                  className="accent-cyan-400 w-4 h-4 rounded"
                />
                <span>ซื้อ Battle Pass ประจำซีซั่น</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={secondaryVerification}
                  onChange={(e) => setSecondaryVerification(e.target.checked)}
                  className="accent-cyan-400 w-4 h-4 rounded"
                />
                <span>ผู้ขายยินดีส่งบัตร ปชช. ให้แอดมินตรวจ</span>
              </label>

              <label className="flex items-center gap-2 text-xs text-cyan-300 cursor-pointer font-medium">
                <input
                  type="checkbox"
                  required
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="accent-cyan-400 w-4 h-4 rounded"
                />
                <span>ยินยอมขายผ่านคนกลาง GameTrade Hub</span>
              </label>
            </div>
          </div>

          {/* 6. Component 6: DatetimePicker */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              6. วันและเวลาพร้อมส่งมอบ (DatetimePicker Component)
            </label>
            <input
              type="datetime-local"
              value={availableDate}
              onChange={(e) => setAvailableDate(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* 7. Component 7: FileBrowse */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
              7. รูปภาพประกอบไอดีเกม (FileBrowse Component)
            </label>
            <div className="flex items-center gap-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-cyan-600 file:text-white hover:file:bg-cyan-500 cursor-pointer"
              />
            </div>
            {imageUrl && (
              <div className="mt-2 relative w-32 h-20 rounded-lg overflow-hidden border border-slate-700">
                <img src={imageUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          {/* Submit Actions */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setIsSellModalOpen(false);
                setEditingPost(null);
              }}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs font-medium"
            >
              ยกเลิก
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all"
            >
              {editingPost ? 'บันทึกการแก้ไข' : 'ยืนยันลงประกาศขาย'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
