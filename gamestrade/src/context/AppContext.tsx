import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, GameCategory, GamePost, Order, ChatRoom, ChatMessage, PostStatus, OrderStatus, UserRole } from '../types';
import { initialUsers, initialCategories, initialPosts, initialOrders, initialChatRooms, initialChatMessages } from '../data/mockData';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  categories: GameCategory[];
  posts: GamePost[];
  orders: Order[];
  chatRooms: ChatRoom[];
  chatMessages: ChatMessage[];
  
  // Navigation & View
  currentView: 'marketplace' | 'admin-dashboard' | 'my-profile' | 'django-code';
  setCurrentView: (view: 'marketplace' | 'admin-dashboard' | 'my-profile' | 'django-code') => void;

  // Filter & Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategoryId: number | 'all';
  setSelectedCategoryId: (id: number | 'all') => void;
  priceRange: [number, number];
  setPriceRange: (range: [number, number]) => void;
  sortBy: 'latest' | 'price-asc' | 'price-desc';
  setSortBy: (sort: 'latest' | 'price-asc' | 'price-desc') => void;
  statusFilter: 'all' | 'Available' | 'Pending' | 'Sold';
  setStatusFilter: (status: 'all' | 'Available' | 'Pending' | 'Sold') => void;

  // Auth Operations
  login: (usernameOrEmail: string, role?: UserRole) => boolean;
  logout: () => void;
  switchUser: (userId: number) => void;
  registerUser: (newUser: Omit<User, 'user_id' | 'created_at' | 'status'>) => boolean;
  updateUserProfile: (userId: number, updates: Partial<User>) => void;
  resetUserPassword: (email: string) => boolean;
  toggleUserBan: (userId: number) => void;

  // Category Operations (Admin)
  addCategory: (category: Omit<GameCategory, 'category_id'>) => void;
  updateCategory: (categoryId: number, updates: Partial<GameCategory>) => void;
  deleteCategory: (categoryId: number) => void;

  // Post Operations (CRUD)
  addPost: (post: Omit<GamePost, 'post_id' | 'created_at' | 'status'>) => void;
  updatePost: (postId: number, updates: Partial<GamePost>) => void;
  deletePost: (postId: number) => void;
  updatePostStatus: (postId: number, status: PostStatus) => void;

  // Order Operations
  createOrder: (postId: number, amount: number, slipImage: string, notes?: string) => Order;
  updateOrderStatus: (orderId: number, status: OrderStatus) => void;

  // Chat Operations (Real-time Middleman)
  sendMessage: (roomId: number, text: string, imageUrl?: string, isSystem?: boolean) => void;
  startOrOpenChatForPost: (postId: number) => number;
  openChatRoom: (roomId: number) => void;
  adminEscrowAction: (roomId: number, actionType: 'payment_verified' | 'escrow_hold' | 'credentials_delivered' | 'trade_completed') => void;

  // Modals state
  selectedPost: GamePost | null;
  setSelectedPost: (post: GamePost | null) => void;
  isSellModalOpen: boolean;
  setIsSellModalOpen: (open: boolean) => void;
  editingPost: GamePost | null;
  setEditingPost: (post: GamePost | null) => void;
  isChatModalOpen: boolean;
  setIsChatModalOpen: (open: boolean) => void;
  activeChatRoomId: number;
  setActiveChatRoomId: (id: number) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register' | 'forgot_password';
  setAuthModalMode: (mode: 'login' | 'register' | 'forgot_password') => void;
  notification: string | null;
  setNotification: (msg: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistence initialization
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('gametrade_users');
    return saved ? JSON.parse(saved) : initialUsers;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedId = localStorage.getItem('gametrade_current_user_id');
    if (savedId) {
      const found = users.find(u => u.user_id === Number(savedId));
      if (found) return found;
    }
    // Default to Natthanon_Buyer (student member)
    return users.find(u => u.user_id === 3) || users[0];
  });

  const [categories, setCategories] = useState<GameCategory[]>(() => {
    const saved = localStorage.getItem('gametrade_categories');
    return saved ? JSON.parse(saved) : initialCategories;
  });

  const [posts, setPosts] = useState<GamePost[]>(() => {
    const saved = localStorage.getItem('gametrade_posts');
    return saved ? JSON.parse(saved) : initialPosts;
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = localStorage.getItem('gametrade_orders');
    return saved ? JSON.parse(saved) : initialOrders;
  });

  const [chatRooms, setChatRooms] = useState<ChatRoom[]>(() => {
    const saved = localStorage.getItem('gametrade_chat_rooms');
    return saved ? JSON.parse(saved) : initialChatRooms;
  });

  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('gametrade_chat_messages');
    return saved ? JSON.parse(saved) : initialChatMessages;
  });

  // Sync to LocalStorage
  useEffect(() => {
    localStorage.setItem('gametrade_users', JSON.stringify(users));
  }, [users]);
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('gametrade_current_user_id', currentUser.user_id.toString());
    } else {
      localStorage.removeItem('gametrade_current_user_id');
    }
  }, [currentUser]);
  useEffect(() => {
    localStorage.setItem('gametrade_categories', JSON.stringify(categories));
  }, [categories]);
  useEffect(() => {
    localStorage.setItem('gametrade_posts', JSON.stringify(posts));
  }, [posts]);
  useEffect(() => {
    localStorage.setItem('gametrade_orders', JSON.stringify(orders));
  }, [orders]);
  useEffect(() => {
    localStorage.setItem('gametrade_chat_rooms', JSON.stringify(chatRooms));
  }, [chatRooms]);
  useEffect(() => {
    localStorage.setItem('gametrade_chat_messages', JSON.stringify(chatMessages));
  }, [chatMessages]);

  // Views & filters
  const [currentView, setCurrentView] = useState<'marketplace' | 'admin-dashboard' | 'my-profile' | 'django-code'>('marketplace');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | 'all'>('all');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000]);
  const [sortBy, setSortBy] = useState<'latest' | 'price-asc' | 'price-desc'>('latest');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Available' | 'Pending' | 'Sold'>('all');

  // Modals
  const [selectedPost, setSelectedPost] = useState<GamePost | null>(null);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<GamePost | null>(null);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const [activeChatRoomId, setActiveChatRoomId] = useState<number>(12345);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot_password'>('login');
  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string | null) => {
    setNotification(msg);
    if (msg) {
      setTimeout(() => {
        setNotification(prev => (prev === msg ? null : prev));
      }, 4000);
    }
  };

  // Auth
  const login = (usernameOrEmail: string, role?: UserRole) => {
    const user = users.find(u => 
      (u.username.toLowerCase() === usernameOrEmail.toLowerCase() || 
       u.email.toLowerCase() === usernameOrEmail.toLowerCase()) &&
      (!role || u.role === role)
    );
    if (user) {
      if (user.status === 'Banned') {
        showNotification('บัญชีนี้ถูกระงับการใช้งานโดย Admin (Banned)');
        return false;
      }
      setCurrentUser(user);
      showNotification(`เข้าสู่ระบบสำเร็จ: ยินดีต้อนรับ ${user.username}`);
      return true;
    }
    showNotification('ไม่พบบัญชีผู้ใช้ หรือข้อมูลไม่ถูกต้อง');
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
    setCurrentView('marketplace');
    showNotification('ออกจากระบบเรียบร้อยแล้ว');
  };

  const switchUser = (userId: number) => {
    const user = users.find(u => u.user_id === userId);
    if (user) {
      setCurrentUser(user);
      showNotification(`สลับไปยังผู้ใช้งาน: ${user.username} (${user.role})`);
    }
  };

  const registerUser = (newUser: Omit<User, 'user_id' | 'created_at' | 'status'>) => {
    const existing = users.find(u => u.username.toLowerCase() === newUser.username.toLowerCase() || u.email.toLowerCase() === newUser.email.toLowerCase());
    if (existing) {
      showNotification('ชื่อผู้ใช้หรืออีเมลนี้มีอยู่ในระบบแล้ว');
      return false;
    }
    const created: User = {
      ...newUser,
      user_id: Date.now(),
      status: 'Active',
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      avatar: newUser.avatar || `https://images.unsplash.com/photo-${1535713875000 + Math.floor(Math.random()*1000)}?auto=format&fit=crop&w=200&h=200&q=80`,
      rating: 5.0
    };
    setUsers(prev => [...prev, created]);
    setCurrentUser(created);
    showNotification(`สมัครสมาชิกสำเร็จ! ยินดีต้อนรับคุณ ${created.username}`);
    return true;
  };

  const updateUserProfile = (userId: number, updates: Partial<User>) => {
    setUsers(prev => prev.map(u => u.user_id === userId ? { ...u, ...updates } : u));
    if (currentUser?.user_id === userId) {
      setCurrentUser(prev => prev ? { ...prev, ...updates } : null);
    }
    showNotification('อัปเดตข้อมูลโปรไฟล์เรียบร้อย');
  };

  const resetUserPassword = (email: string) => {
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      showNotification(`ส่งลิงก์รีเซ็ตรหัสผ่านไปยัง ${email} เรียบร้อยแล้ว`);
      return true;
    }
    showNotification('ไม่พบบัญชีที่ผูกกับอีเมลนี้');
    return false;
  };

  const toggleUserBan = (userId: number) => {
    setUsers(prev => prev.map(u => {
      if (u.user_id === userId) {
        const nextStatus: 'Active' | 'Banned' = u.status === 'Active' ? 'Banned' : 'Active';
        showNotification(`${nextStatus === 'Banned' ? 'ระงับการใช้งานบัญชี' : 'ปลดแบนบัญชี'} ${u.username} แล้ว`);
        return { ...u, status: nextStatus };
      }
      return u;
    }));
  };

  // Categories
  const addCategory = (cat: Omit<GameCategory, 'category_id'>) => {
    const newCat: GameCategory = {
      ...cat,
      category_id: Date.now()
    };
    setCategories(prev => [...prev, newCat]);
    showNotification(`เพิ่มหมวดหมู่เกม "${newCat.name}" สำเร็จ`);
  };

  const updateCategory = (categoryId: number, updates: Partial<GameCategory>) => {
    setCategories(prev => prev.map(c => c.category_id === categoryId ? { ...c, ...updates } : c));
    showNotification('อัปเดตหมวดหมู่เกมเรียบร้อย');
  };

  const deleteCategory = (categoryId: number) => {
    setCategories(prev => prev.filter(c => c.category_id !== categoryId));
    showNotification('ลบหมวดหมู่เกมเรียบร้อย');
  };

  // Posts
  const addPost = (post: Omit<GamePost, 'post_id' | 'created_at' | 'status'>) => {
    const newPost: GamePost = {
      ...post,
      post_id: Date.now(),
      status: 'Available',
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    setPosts(prev => [newPost, ...prev]);
    showNotification('ลงประกาศขายไอดีเกมเรียบร้อยแล้ว');
  };

  const updatePost = (postId: number, updates: Partial<GamePost>) => {
    setPosts(prev => prev.map(p => p.post_id === postId ? { ...p, ...updates } : p));
    showNotification('แก้ไขโพสต์ขายไอดีเกมเรียบร้อย');
  };

  const deletePost = (postId: number) => {
    setPosts(prev => prev.filter(p => p.post_id !== postId));
    showNotification('ลบโพสต์เรียบร้อยแล้ว');
  };

  const updatePostStatus = (postId: number, status: PostStatus) => {
    setPosts(prev => prev.map(p => p.post_id === postId ? { ...p, status } : p));
    showNotification(`เปลี่ยนสถานะโพสต์เป็น "${status}"`);
  };

  // Orders
  const createOrder = (postId: number, amount: number, slipImage: string, notes?: string) => {
    const newOrder: Order = {
      order_id: Date.now(),
      amount,
      slip_image: slipImage,
      status: 'Pending',
      buyer_id: currentUser ? currentUser.user_id : 3,
      post_id: postId,
      order_date: new Date().toISOString().replace('T', ' ').substring(0, 19),
      notes
    };
    setOrders(prev => [newOrder, ...prev]);
    // update post status to Pending to avoid duplicate orders
    updatePostStatus(postId, 'Pending');
    showNotification('ส่งคำสั่งซื้อและแนบสลิปเรียบร้อย! ส่งต่อให้ Admin คนกลางตรวจสอบ');
    return newOrder;
  };

  const updateOrderStatus = (orderId: number, status: OrderStatus) => {
    setOrders(prev => prev.map(o => {
      if (o.order_id === orderId) {
        if (status === 'Completed') {
          // Also set the post to Sold
          setPosts(pList => pList.map(p => p.post_id === o.post_id ? { ...p, status: 'Sold' } : p));
        } else if (status === 'Cancelled') {
          // Restore post to Available
          setPosts(pList => pList.map(p => p.post_id === o.post_id ? { ...p, status: 'Available' } : p));
        }
        return { ...o, status };
      }
      return o;
    }));
    showNotification(`อัปเดตสถานะออเดอร์เป็น "${status}" สำเร็จ`);
  };

  // Chat
  const sendMessage = (roomId: number, text: string, imageUrl?: string, isSystem = false) => {
    if (!currentUser && !isSystem) return;
    const newMsg: ChatMessage = {
      message_id: Date.now(),
      text_content: text,
      image_url: imageUrl,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      is_read: false,
      room_id: roomId,
      sender_id: isSystem ? 1 : currentUser!.user_id,
      is_system: isSystem
    };
    setChatMessages(prev => [...prev, newMsg]);

    // Simulated middleman admin auto-response if member talks to admin
    if (!isSystem && currentUser && currentUser.role === 'Member') {
      setTimeout(() => {
        let reply = '';
        if (text.toLowerCase().includes('สลิป') || imageUrl) {
          reply = 'แอดมิน Sarah ได้รับหลักฐาน/สลิปแล้วครับ กำลังทำการตรวจสอบความถูกต้องกับบัญชีธนาคารกลาง Escrow สักครู่ครับ';
        } else if (text.toLowerCase().includes('ไอดี') || text.toLowerCase().includes('รหัส')) {
          reply = 'สำหรับการรับมอบไอดี ทางแอดมินจะติดต่อผู้ขายเพื่อเช็คอีเมลแท้และเปลี่ยนเบอร์ผูกให้เรียบร้อยก่อนส่งมอบเพื่อความปลอดภัย 100% ครับ';
        } else {
          reply = 'แอดมิน Sarah ได้รับข้อความแล้วครับ มีเจ้าหน้าที่คอยดูแลการซื้อขายไอดีเกมตลอด 24 ชั่วโมงครับ มีข้อสงสัยเพิ่มเติมสอบถามได้เลยครับ';
        }
        const adminReply: ChatMessage = {
          message_id: Date.now() + 10,
          text_content: reply,
          timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
          is_read: true,
          room_id: roomId,
          sender_id: 1 // Admin
        };
        setChatMessages(msgs => [...msgs, adminReply]);
      }, 1200);
    }
  };

  const startOrOpenChatForPost = (postId: number): number => {
    const post = posts.find(p => p.post_id === postId);
    const existing = chatRooms.find(r => r.related_post_id === postId && (currentUser ? r.user_id === currentUser.user_id : true));
    if (existing) {
      setActiveChatRoomId(existing.room_id);
      setIsChatModalOpen(true);
      return existing.room_id;
    }
    const newRoomId = Math.floor(10000 + Math.random() * 90000);
    const newRoom: ChatRoom = {
      room_id: newRoomId,
      user_id: currentUser ? currentUser.user_id : 3,
      created_at: new Date().toISOString().replace('T', ' ').substring(0, 19),
      title: `Chat ID: ${newRoomId} - Middleman (${post ? post.title.substring(0, 25) + '...' : 'General'})`,
      related_post_id: postId,
      status: 'open'
    };
    setChatRooms(prev => [newRoom, ...prev]);

    // Initial greeting in room
    const initMessage: ChatMessage = {
      message_id: Date.now(),
      text_content: `ห้องแชทคนกลางเปิดบริการแล้วสำหรับการซื้อขายไอดี: "${post ? post.title : 'ไอดีเกม'}" มูลค่า ${post ? post.price.toLocaleString() : 0} THB\nระบบกำลังประสานงานระหว่างผู้ซื้อ, ผู้ขาย และแอดมินคนกลางอย่างปลอดภัย`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      is_read: true,
      room_id: newRoomId,
      sender_id: 1,
      is_system: true
    };
    setChatMessages(prev => [...prev, initMessage]);

    setActiveChatRoomId(newRoomId);
    setIsChatModalOpen(true);
    return newRoomId;
  };

  const openChatRoom = (roomId: number) => {
    setActiveChatRoomId(roomId);
    setIsChatModalOpen(true);
  };

  const adminEscrowAction = (roomId: number, actionType: 'payment_verified' | 'escrow_hold' | 'credentials_delivered' | 'trade_completed') => {
    const room = chatRooms.find(r => r.room_id === roomId);
    const post = room && room.related_post_id ? posts.find(p => p.post_id === room.related_post_id) : null;

    let text = '';
    if (actionType === 'payment_verified') {
      text = '✅ [Admin Escrow] แอดมินตรวจสอบยอดเงินโอนเข้าบัญชีคนกลาง GameTrade Hub ถูกต้องเรียบร้อย! ได้นำเงินเข้าสู่วงเงินคุ้มครองปลอดภัย';
      if (post) updatePostStatus(post.post_id, 'Pending');
    } else if (actionType === 'escrow_hold') {
      text = '🛡️ [Admin Escrow] ได้ทำการระงับและตรวจสอบความถูกต้องของไอดีเกมและอีเมลต้นทางจากผู้ขายเรียบร้อย ปลอดภัยไม่มีความเสี่ยง';
    } else if (actionType === 'credentials_delivered') {
      text = `🔑 [Admin Escrow] แอดมินได้ส่งมอบข้อมูลไอดีเกมและรหัสผ่านให้ผู้ซื้อเรียบร้อยแล้ว:\nข้อมูล: "${post?.game_credentials_note || 'Credentials Verified'}"\nกรุณาผู้ซื้อเข้าตรวจสอบไอดีและเปลี่ยนรหัสผ่านทันที`;
    } else if (actionType === 'trade_completed') {
      text = '🎉 [Admin Escrow] ธุรกรรมสำเร็จเรียบร้อย! ผู้ซื้อกดยืนยันได้รับไอดีถูกต้อง และระบบได้โอนเงินค่าไอดีให้ผู้ขายเรียบร้อย ขอบคุณที่ใช้บริการคนกลาง GameTrade Hub';
      if (post) updatePostStatus(post.post_id, 'Sold');
    }

    const actionMsg: ChatMessage = {
      message_id: Date.now(),
      text_content: text,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      is_read: true,
      room_id: roomId,
      sender_id: 1,
      is_system: true,
      system_action_type: actionType
    };
    setChatMessages(prev => [...prev, actionMsg]);
    showNotification(`ดำเนินการคนกลาง: ${text.substring(0, 40)}...`);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        categories,
        posts,
        orders,
        chatRooms,
        chatMessages,
        currentView,
        setCurrentView,
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
        login,
        logout,
        switchUser,
        registerUser,
        updateUserProfile,
        resetUserPassword,
        toggleUserBan,
        addCategory,
        updateCategory,
        deleteCategory,
        addPost,
        updatePost,
        deletePost,
        updatePostStatus,
        createOrder,
        updateOrderStatus,
        sendMessage,
        startOrOpenChatForPost,
        openChatRoom,
        adminEscrowAction,
        selectedPost,
        setSelectedPost,
        isSellModalOpen,
        setIsSellModalOpen,
        editingPost,
        setEditingPost,
        isChatModalOpen,
        setIsChatModalOpen,
        activeChatRoomId,
        setActiveChatRoomId,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        notification,
        setNotification: showNotification,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
