import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { GamePost } from '../types';
import { 
  Search, 
  Filter, 
  Sparkles, 
  ShieldCheck, 
  ExternalLink, 
  Tag, 
  Layers, 
  CheckCircle2, 
  Clock, 
  CheckCheck,
  Flame,
  UserCheck,
  Gamepad2
} from 'lucide-react';

export const Marketplace: React.FC = () => {
  const { 
    posts, 
    categories, 
    users,
    searchQuery, 
    setSearchQuery, 
    selectedCategoryId, 
    setSelectedCategoryId,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    statusFilter,
    setStatusFilter,
    setSelectedPost,
    startOrOpenChatForPost
  } = useApp();

  const [minPriceInput, setMinPriceInput] = useState(priceRange[0].toString());
  const [maxPriceInput, setMaxPriceInput] = useState(priceRange[1].toString());

  // Filter posts
  const filteredPosts = posts.filter(post => {
    // Search keyword
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = post.title.toLowerCase().includes(q);
      const matchDesc = post.description.toLowerCase().includes(q);
      const matchRank = post.rank?.toLowerCase().includes(q) || false;
      const matchServer = post.server?.toLowerCase().includes(q) || false;
      const seller = users.find(u => u.user_id === post.seller_id);
      const matchSeller = seller?.username.toLowerCase().includes(q) || false;
      if (!matchTitle && !matchDesc && !matchRank && !matchServer && !matchSeller) {
        return false;
      }
    }

    // Category
    if (selectedCategoryId !== 'all' && post.category_id !== selectedCategoryId) {
      return false;
    }

    // Status
    if (statusFilter !== 'all' && post.status !== statusFilter) {
      return false;
    }

    // Price
    if (post.price < priceRange[0] || post.price > priceRange[1]) {
      return false;
    }

    return true;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  const handlePriceApply = () => {
    const min = Number(minPriceInput) || 0;
    const max = Number(maxPriceInput) || 100000;
    setPriceRange([min, max]);
  };

  const getCategoryName = (id: number) => {
    return categories.find(c => c.category_id === id)?.name || 'General';
  };

  const getSeller = (id: number) => {
    return users.find(u => u.user_id === id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Search Header Banner */}
      <div className="mb-6 relative rounded-2xl overflow-hidden bg-gradient-to-r from-[#0d1627] via-[#101b30] to-[#0c1524] border border-cyan-900/50 p-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-3">
            <Flame className="w-3.5 h-3.5 text-orange-400" />
            ระบบซื้อขายไอดีเกมอันดับ 1 มีคนกลางตรวจสอบ 100%
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            GAME ID MARKETPLACE
          </h1>
          <p className="text-sm text-slate-300 mt-1">
            ค้นหาไอดีเกมแท้ ปลอดภัย ไม่โดนดึงกลับ มีระบบตรวจสอบสลิปและโอนรหัสผ่านทีมงาน Admin Middleman
          </p>

          {/* Search bar */}
          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                id="marketplace-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ค้นหาชื่อไอดีเกม, แรงค์, สกิน, หรือชื่อผู้ขาย..."
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900/80 border border-slate-700/80 rounded-xl text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                >
                  ล้าง
                </button>
              )}
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-900/80 border border-slate-700/80 text-slate-200 text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-cyan-500"
            >
              <option value="latest">จัดเรียง: ลงขายล่าสุด</option>
              <option value="price-asc">จัดเรียง: ราคาต่ำ → สูง</option>
              <option value="price-desc">จัดเรียง: ราคาสูง → ต่ำ</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Sidebar Filter (matching page 4 mockup) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#0f172a]/80 backdrop-blur-sm rounded-xl border border-slate-800 p-5 shadow-lg">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Filter className="w-4 h-4 text-cyan-400" />
                Categories (หมวดหมู่เกม)
              </h3>
              {selectedCategoryId !== 'all' && (
                <button 
                  onClick={() => setSelectedCategoryId('all')}
                  className="text-xs text-cyan-400 hover:underline"
                >
                  ทั้งหมด
                </button>
              )}
            </div>

            {/* Category selection */}
            <div className="mt-3 space-y-1.5">
              <button
                onClick={() => setSelectedCategoryId('all')}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                  selectedCategoryId === 'all'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-300 hover:bg-slate-800/60'
                }`}
              >
                <span>ทุกเกม (All Games)</span>
                <span className="text-[11px] text-slate-400">({posts.length})</span>
              </button>

              {categories.map(cat => {
                const count = posts.filter(p => p.category_id === cat.category_id).length;
                const isSelected = selectedCategoryId === cat.category_id;
                return (
                  <button
                    key={cat.category_id}
                    onClick={() => setSelectedCategoryId(cat.category_id)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                        : 'text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <img src={cat.logo} alt={cat.name} className="w-4 h-4 rounded object-cover" />
                      <span>{cat.name}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">({count})</span>
                  </button>
                );
              })}
            </div>

            {/* Price Range Filter */}
            <div className="mt-6 pt-4 border-t border-slate-800">
              <h4 className="text-xs font-semibold text-slate-200 mb-2 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-cyan-400" />
                Price Range (ช่วงราคา THB)
              </h4>
              <div className="grid grid-cols-2 gap-2 mb-2">
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">ต่ำสุด</label>
                  <input
                    type="number"
                    value={minPriceInput}
                    onChange={(e) => setMinPriceInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-400 block mb-1">สูงสุด</label>
                  <input
                    type="number"
                    value={maxPriceInput}
                    onChange={(e) => setMaxPriceInput(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2.5 py-1 text-xs text-white"
                    placeholder="50000"
                  />
                </div>
              </div>
              <button
                onClick={handlePriceApply}
                className="w-full mt-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-cyan-800/50 rounded-lg py-1.5 text-xs font-medium transition-colors"
              >
                กรองราคา
              </button>
            </div>

            {/* Status Filter */}
            <div className="mt-6 pt-4 border-t border-slate-800">
              <h4 className="text-xs font-semibold text-slate-200 mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                สถานะการขาย (Status)
              </h4>
              <div className="space-y-1">
                {(['all', 'Available', 'Pending', 'Sold'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                      statusFilter === st
                        ? 'bg-slate-800 text-white font-medium border border-slate-700'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    <span>
                      {st === 'all' && 'ทั้งหมด (All)'}
                      {st === 'Available' && 'พร้อมขาย (Available)'}
                      {st === 'Pending' && 'กำลังดำเนินการ (Pending)'}
                      {st === 'Sold' && 'ขายแล้ว (Sold)'}
                    </span>
                    {st === 'Available' && <span className="w-2 h-2 rounded-full bg-emerald-400"></span>}
                    {st === 'Pending' && <span className="w-2 h-2 rounded-full bg-amber-400"></span>}
                    {st === 'Sold' && <span className="w-2 h-2 rounded-full bg-rose-500"></span>}
                  </button>
                ))}
              </div>
            </div>

            {/* Middleman Trust Seal Box */}
            <div className="mt-6 p-3 rounded-xl bg-gradient-to-b from-cyan-950/40 to-slate-900 border border-cyan-800/40">
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-semibold mb-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                ระบบคนกลางปลอดภัย 100%
              </div>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                เงินค่าไอดีจะถูกพักไว้ที่บัญชีกลาง Admin Escrow จนกว่าผู้ซื้อจะได้รหัสและเช็คไอดีถูกต้อง จึงจะโอนเงินให้ผู้ขาย
              </p>
            </div>
          </div>
        </div>

        {/* Right Card Grid (matching screenshot page 4) */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-semibold text-slate-200">ผลการค้นหา:</span>
              <span>พบ {filteredPosts.length} รายการ</span>
              {selectedCategoryId !== 'all' && (
                <span className="bg-slate-800 px-2 py-0.5 rounded text-cyan-400 border border-slate-700">
                  {getCategoryName(Number(selectedCategoryId))}
                </span>
              )}
            </div>
            <span className="text-xs text-slate-400">Card Grid View</span>
          </div>

          {filteredPosts.length === 0 ? (
            <div className="bg-[#0f172a]/60 rounded-2xl border border-slate-800 p-12 text-center">
              <Gamepad2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-base font-semibold text-slate-300">ไม่พบไอดีเกมตามเงื่อนไขที่ค้นหา</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                ลองปรับช่วงราคา ล้างคำค้นหา หรือเลือกหมวดหมู่อื่นเพื่อดูรายการไอดีเกมที่วางจำหน่าย
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategoryId('all');
                  setStatusFilter('all');
                  setPriceRange([0, 50000]);
                }}
                className="mt-4 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-cyan-400 text-xs font-medium rounded-lg border border-slate-700"
              >
                รีเซ็ตตัวกรองทั้งหมด
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {filteredPosts.map(post => {
                const seller = getSeller(post.seller_id);
                const categoryName = getCategoryName(post.category_id);

                return (
                  <div
                    key={post.post_id}
                    className="group bg-[#0e1626] rounded-xl border border-slate-800/80 hover:border-cyan-500/50 shadow-md hover:shadow-cyan-500/10 transition-all duration-300 flex flex-col overflow-hidden"
                  >
                    {/* Image thumbnail & status badge */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      
                      {/* Game category tag */}
                      <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-bold text-cyan-300 border border-cyan-500/30">
                        {categoryName}
                      </div>

                      {/* Status Tag */}
                      <div className="absolute top-2.5 right-2.5">
                        {post.status === 'Available' && (
                          <span className="bg-emerald-950/80 backdrop-blur-md text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/40 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                            AVAILABLE
                          </span>
                        )}
                        {post.status === 'Pending' && (
                          <span className="bg-amber-950/80 backdrop-blur-md text-amber-400 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-500/40 flex items-center gap-1">
                            <Clock className="w-2.5 h-2.5" />
                            PENDING
                          </span>
                        )}
                        {post.status === 'Sold' && (
                          <span className="bg-rose-950/80 backdrop-blur-md text-rose-400 text-[10px] font-bold px-2 py-0.5 rounded border border-rose-500/40 flex items-center gap-1">
                            <CheckCheck className="w-2.5 h-2.5" />
                            SOLD
                          </span>
                        )}
                      </div>

                      {/* Rank overlay if available */}
                      {post.rank && (
                        <div className="absolute bottom-2 left-2.5 bg-slate-950/80 backdrop-blur-sm text-[11px] text-slate-200 px-2 py-0.5 rounded border border-slate-700/60">
                          {post.rank}
                        </div>
                      )}
                    </div>

                    {/* Card Content */}
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        {/* Title */}
                        <h3 
                          onClick={() => setSelectedPost(post)}
                          className="font-bold text-sm text-slate-100 group-hover:text-cyan-400 transition-colors line-clamp-2 cursor-pointer"
                          title={post.title}
                        >
                          {post.title}
                        </h3>

                        {/* Specs badges */}
                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {post.server && (
                            <span className="text-[10px] bg-slate-800/80 text-slate-300 px-1.5 py-0.5 rounded border border-slate-700">
                              {post.server}
                            </span>
                          )}
                          {post.skins_count !== undefined && (
                            <span className="text-[10px] bg-slate-800/80 text-cyan-300 px-1.5 py-0.5 rounded border border-slate-700">
                              {post.skins_count} สกิน
                            </span>
                          )}
                          {post.original_email && (
                            <span className="text-[10px] bg-emerald-950/60 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-800/40">
                              เมลแท้
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                        {/* Price */}
                        <div>
                          <p className="text-[10px] text-slate-400 uppercase tracking-wider">ราคา</p>
                          <p className="text-base font-extrabold text-cyan-400">
                            {post.price.toLocaleString()} <span className="text-xs font-semibold text-slate-300">THB</span>
                          </p>
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => setSelectedPost(post)}
                            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 transition-colors"
                          >
                            ดูข้อมูล
                          </button>
                          
                          <button
                            onClick={() => {
                              setSelectedPost(post);
                              startOrOpenChatForPost(post.post_id);
                            }}
                            className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-sm shadow-cyan-500/30 transition-all flex items-center gap-1"
                            title="ติดต่อแอดมินคนกลางเพื่อทำการซื้อขาย"
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                            คนกลาง
                          </button>
                        </div>
                      </div>

                      {/* Seller info */}
                      <div className="mt-2.5 pt-2 border-t border-slate-800/40 flex items-center justify-between text-[11px] text-slate-400">
                        <div className="flex items-center gap-1.5">
                          <img 
                            src={seller?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=80&q=80'} 
                            alt={seller?.username} 
                            className="w-4 h-4 rounded-full object-cover"
                          />
                          <span className="text-slate-300 hover:text-white truncate max-w-[120px]">
                            {seller?.username || 'Verified Seller'}
                          </span>
                        </div>
                        <span className="text-[10px] text-emerald-400 flex items-center gap-0.5">
                          <UserCheck className="w-3 h-3" /> ผู้ขายยืนยันตัว
                        </span>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
