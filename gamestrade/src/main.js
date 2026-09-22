import Alpine from 'alpinejs';
import './index.css';

// Initial Users (สำหรับทดสอบระบบสิทธิ์ Member & Admin)
const initialUsers = [
  {
    user_id: 1,
    username: "Admin_Sarah",
    email: "sarah.admin@gametrade.com",
    role: "Admin",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80",
    phone: "081-999-8888",
    created_at: "2026-01-10"
  },
  {
    user_id: 2,
    username: "Natthanon_User",
    email: "natthanon68@gametrade.com",
    role: "Member",
    status: "Active",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80",
    phone: "089-114-6402",
    created_at: "2026-02-15"
  }
];

// หมวดหมู่เกมสำหรับเลือกตอนลงขายไอดี
const initialCategories = [
  {
    category_id: 1,
    name: "Valorant",
    logo: "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=120&h=120&q=80"
  },
  {
    category_id: 2,
    name: "ROV (Realm of Valor)",
    logo: "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=120&h=120&q=80"
  },
  {
    category_id: 3,
    name: "Genshin Impact",
    logo: "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=120&h=120&q=80"
  },
  {
    category_id: 4,
    name: "Free Fire",
    logo: "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=120&h=120&q=80"
  },
  {
    category_id: 5,
    name: "League of Legends",
    logo: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=120&h=120&q=80"
  },
  {
    category_id: 6,
    name: "EA FC Mobile",
    logo: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=120&h=120&q=80"
  }
];

// Alpine Store & Component
window.gameTradeApp = function() {
  return {
    // สถานะเริ่มต้นแบบสะอาด (Empty State - พร้อมให้ผู้ใช้เพิ่มข้อมูลเอง)
    users: initialUsers,
    currentUser: initialUsers[1], // Default: Natthanon_User (Member)
    categories: initialCategories,
    posts: [],       // เคลียร์ข้อมูลไอดีเกมออกทั้งหมด พร้อมรองรับการเพิ่มข้อมูลใหม่
    orders: [],      // เคลียร์รายการคำสั่งซื้อออก
    messages: [],    // เคลียร์ห้องแชทออก
    
    // Navigation Views: 'marketplace', 'admin-dashboard', 'my-profile', 'django-code'
    currentView: 'marketplace',
    adminTab: 'orders',
    profileTab: 'orders',
    djangoCodeFile: 'models',
    
    // Filters & Search
    searchQuery: '',
    selectedCategory: 'all',
    selectedStatus: 'all',
    priceMin: 0,
    priceMax: 100000,
    sortBy: 'latest',

    // Modal States
    selectedPost: null,
    isSellModalOpen: false,
    isOrderModalOpen: false,
    isChatOpen: false,
    isAuthModalOpen: false,
    authMode: 'login',

    // Notification Toast
    notification: null,

    // Sell Form Data (The 7 Input Components - พร้อมค่าเริ่มต้นที่กรอกสะดวกรวดเร็ว)
    isEditing: false,
    postForm: {
      post_id: null,
      title: '',
      category_id: 1,
      price: '',
      server: 'TH Server',
      rank: 'Diamond / Conqueror',
      level: 30,
      skins_count: 10,
      description: '',
      status: 'Available',
      original_email: true,
      battle_pass: false,
      secondary_verification: true,
      scheduled_delivery: new Date().toISOString().substring(0, 16),
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80',
      game_credentials_note: ''
    },

    // Order Form
    orderForm: {
      slip_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
      notes: ''
    },

    // Chat Message Form
    newChatMessage: '',
    newChatImage: '',

    // Escrow Status Step (1 to 4)
    escrowStep: 1,

    // Methods
    init() {
      // โหลดเฉพาะข้อมูลที่ผู้ใช้สร้างเองใหม่ หากไม่มีให้เป็น Array ว่าง
      try {
        const savedPosts = localStorage.getItem('gametrade_user_posts_v2');
        if (savedPosts) {
          const parsed = JSON.parse(savedPosts);
          if (Array.isArray(parsed)) {
            this.posts = parsed;
          }
        } else {
          // ล้างคีย์เดิม
          localStorage.removeItem('gametrade_posts');
          localStorage.removeItem('gametrade_orders');
        }

        const savedOrders = localStorage.getItem('gametrade_user_orders_v2');
        if (savedOrders) {
          const parsedOrders = JSON.parse(savedOrders);
          if (Array.isArray(parsedOrders)) {
            this.orders = parsedOrders;
          }
        }
      } catch (e) {
        console.warn('Storage init failed', e);
      }
    },

    showNotify(msg) {
      this.notification = msg;
      setTimeout(() => {
        if (this.notification === msg) this.notification = null;
      }, 4000);
    },

    saveData() {
      try {
        localStorage.setItem('gametrade_user_posts_v2', JSON.stringify(this.posts));
        localStorage.setItem('gametrade_user_orders_v2', JSON.stringify(this.orders));
      } catch (e) {
        console.error(e);
      }
    },

    // Switch Testing User Role
    switchUser(userId) {
      const u = this.users.find(x => x.user_id === Number(userId));
      if (u) {
        this.currentUser = u;
        this.showNotify(`สลับเป็นผู้ใช้: ${u.username} (${u.role})`);
        if (u.role !== 'Admin' && this.currentView === 'admin-dashboard') {
          this.currentView = 'marketplace';
        }
      }
    },

    // Filtered Posts
    filteredPosts() {
      if (!this.posts || this.posts.length === 0) return [];

      return this.posts.filter(p => {
        const matchCategory = this.selectedCategory === 'all' || p.category_id == this.selectedCategory;
        const matchStatus = this.selectedStatus === 'all' || p.status === this.selectedStatus;
        const matchPrice = p.price >= this.priceMin && p.price <= this.priceMax;
        const query = this.searchQuery ? this.searchQuery.toLowerCase().trim() : '';
        const seller = this.users.find(u => u.user_id === p.seller_id);
        const matchQuery = !query || 
          (p.title && p.title.toLowerCase().includes(query)) ||
          (p.description && p.description.toLowerCase().includes(query)) ||
          (p.rank && p.rank.toLowerCase().includes(query)) ||
          (seller && seller.username.toLowerCase().includes(query));

        return matchCategory && matchStatus && matchPrice && matchQuery;
      }).sort((a, b) => {
        if (this.sortBy === 'price_asc') return a.price - b.price;
        if (this.sortBy === 'price_desc') return b.price - a.price;
        return b.post_id - a.post_id;
      });
    },

    // Category Name Helper
    getCategory(id) {
      return this.categories.find(c => c.category_id === id) || { name: 'เกมทั่วไป', logo: '' };
    },

    getSeller(id) {
      return this.users.find(u => u.user_id === id) || { username: 'ผู้ใช้งาน', avatar: '' };
    },

    // Open Sell / Edit Modal
    openCreatePost() {
      if (this.currentUser.status === 'Banned') {
        this.showNotify('บัญชีของคุณถูกระงับการใช้งาน (Banned)');
        return;
      }
      this.isEditing = false;
      this.postForm = {
        post_id: null,
        title: '',
        category_id: this.categories[0]?.category_id || 1,
        price: '',
        server: 'TH Server',
        rank: '',
        level: 1,
        skins_count: 0,
        description: '',
        status: 'Available',
        original_email: true,
        battle_pass: false,
        secondary_verification: true,
        scheduled_delivery: new Date().toISOString().substring(0, 16),
        image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=900&q=80',
        game_credentials_note: ''
      };
      this.isSellModalOpen = true;
    },

    openEditPost(post) {
      this.isEditing = true;
      this.postForm = { ...post };
      this.isSellModalOpen = true;
    },

    // Submit Create / Edit Post (CRUD)
    submitPost() {
      if (!this.postForm.title || !this.postForm.price || !this.postForm.description) {
        alert('กรุณากรอกข้อมูลสำคัญให้ครบถ้วน: หัวข้อประกาศ, ราคา (THB), และรายละเอียดไอดี');
        return;
      }

      if (this.isEditing) {
        const idx = this.posts.findIndex(p => p.post_id === this.postForm.post_id);
        if (idx !== -1) {
          this.posts[idx] = { 
            ...this.postForm, 
            price: Number(this.postForm.price),
            category_id: Number(this.postForm.category_id)
          };
          this.showNotify(`แก้ไขข้อมูลไอดีเกม "${this.postForm.title}" สำเร็จ!`);
        }
      } else {
        const newPost = {
          ...this.postForm,
          post_id: Date.now(),
          price: Number(this.postForm.price),
          category_id: Number(this.postForm.category_id),
          seller_id: this.currentUser.user_id,
          created_at: new Date().toISOString().substring(0, 10)
        };
        this.posts.unshift(newPost);
        this.showNotify(`ลงขายไอดีเกม "${newPost.title}" สำเร็จเรียบร้อย!`);
      }
      this.saveData();
      this.isSellModalOpen = false;
    },

    deletePost(postId) {
      if (confirm('คุณแน่ใจหรือไม่ว่าต้องการลบโพสต์ไอดีเกมนี้?')) {
        this.posts = this.posts.filter(p => p.post_id !== postId);
        this.saveData();
        this.showNotify('ลบโพสต์ไอดีเกมสำเร็จ');
      }
    },

    // Order & Slip Upload
    openOrderModal(post) {
      this.selectedPost = post;
      this.orderForm.slip_url = 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80';
      this.orderForm.notes = '';
      this.isOrderModalOpen = true;
    },

    submitOrder() {
      if (!this.selectedPost) return;
      if (!this.orderForm.slip_url) {
        alert('กรุณาแนบรูปภาพหรือลิงก์สลิปโอนเงิน');
        return;
      }

      const newOrder = {
        order_id: Math.floor(1000 + Math.random() * 9000),
        amount: this.selectedPost.price,
        slip_image: this.orderForm.slip_url,
        status: 'Pending',
        notes: this.orderForm.notes || 'โอนผ่านบัญชีคนกลาง GameTrade Hub',
        buyer_id: this.currentUser.user_id,
        post_id: this.selectedPost.post_id,
        order_date: new Date().toLocaleString()
      };

      this.orders.unshift(newOrder);

      // Set post status to Pending
      const p = this.posts.find(x => x.post_id === this.selectedPost.post_id);
      if (p) p.status = 'Pending';

      // Push notification & chat message
      this.messages.push({
        message_id: Date.now(),
        sender_id: this.currentUser.user_id,
        sender_name: this.currentUser.username,
        sender_role: this.currentUser.role,
        text_content: `สวัสดีครับ สั่งซื้อไอดี ${this.selectedPost.title} และแนบสลิป ${newOrder.amount.toLocaleString()} THB เรียบร้อยครับ`,
        image_url: newOrder.slip_image,
        timestamp: new Date().toLocaleTimeString().substring(0, 5),
        is_system: false
      });

      this.saveData();
      this.isOrderModalOpen = false;
      this.selectedPost = null;
      this.isChatOpen = true;
      this.showNotify('ส่งคำสั่งซื้อและหลักฐานสลิปเข้าสู่ระบบคนกลางเรียบร้อย!');
    },

    // Send Real-time Chat
    sendChat() {
      if (!this.newChatMessage.trim() && !this.newChatImage.trim()) return;

      this.messages.push({
        message_id: Date.now(),
        sender_id: this.currentUser.user_id,
        sender_name: this.currentUser.username,
        sender_role: this.currentUser.role,
        text_content: this.newChatMessage,
        image_url: this.newChatImage,
        timestamp: new Date().toLocaleTimeString().substring(0, 5),
        is_system: false
      });

      this.newChatMessage = '';
      this.newChatImage = '';

      // Auto scroll chat
      this.$nextTick(() => {
        const box = document.getElementById('chat-window-scroll');
        if (box) box.scrollTop = box.scrollHeight;
      });
    },

    // Admin Controls
    advanceEscrowStep(step) {
      this.escrowStep = step;
      let text = '';
      if (step === 2) text = 'แอดมินคนกลาง: ยืนยันยอดเงินสลิปเรียบร้อย ถือเงินประกันในระบบ Escrow Hold';
      if (step === 3) text = 'แอดมินคนกลาง: ตรวจสอบเมลแท้และรหัสผ่านจากผู้ขายสำเร็จ ส่งมอบไอดีให้ผู้ซื้อตรวจสอบ';
      if (step === 4) text = 'แอดมินคนกลาง: ผู้ซื้อยืนยันรับไอดีเรียบร้อย! โอนเงินให้ผู้ขายและปิดการซื้อขายสมบูรณ์';

      this.messages.push({
        message_id: Date.now(),
        sender_id: 1,
        sender_name: 'Admin_Sarah',
        sender_role: 'Admin',
        text_content: text,
        image_url: '',
        timestamp: new Date().toLocaleTimeString().substring(0, 5),
        is_system: true
      });
      this.showNotify(text);
    },

    adminVerifyOrder(orderId, action) {
      const order = this.orders.find(o => o.order_id === orderId);
      if (!order) return;

      if (action === 'approve') {
        order.status = 'Completed';
        const post = this.posts.find(p => p.post_id === order.post_id);
        if (post) post.status = 'Sold';
        this.showNotify(`อนุมัติคำสั่งซื้อ #${orderId} และส่งมอบไอดีสำเร็จ`);
      } else {
        order.status = 'Cancelled';
        const post = this.posts.find(p => p.post_id === order.post_id);
        if (post) post.status = 'Available';
        this.showNotify(`ปฏิเสธคำสั่งซื้อ #${orderId}`);
      }
      this.saveData();
    },

    adminToggleBan(userId) {
      const u = this.users.find(x => x.user_id === userId);
      if (u) {
        u.status = u.status === 'Active' ? 'Banned' : 'Active';
        this.showNotify(`${u.status === 'Banned' ? 'ระงับบัญชี' : 'ปลดแบน'} ${u.username} สำเร็จ`);
      }
    }
  };
};

window.Alpine = Alpine;
Alpine.start();
