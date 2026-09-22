import { User, GameCategory, GamePost, Order, ChatRoom, ChatMessage } from '../types';

export const initialUsers: User[] = [
  {
    user_id: 1,
    username: 'Admin_Sarah',
    email: 'sarah.middleman@gametrade.com',
    password: 'adminpassword123',
    role: 'Admin',
    status: 'Active',
    created_at: '2025-01-10 09:00:00',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&h=200&q=80',
    rating: 5.0,
    phone: '089-111-2233'
  },
  {
    user_id: 2,
    username: 'WolfLord_Pro',
    email: 'wolflord@gmail.com',
    password: 'password123',
    role: 'Member',
    status: 'Active',
    created_at: '2025-02-15 14:30:00',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&h=200&q=80',
    rating: 4.9,
    phone: '081-998-7766'
  },
  {
    user_id: 3,
    username: 'Natthanon_Buyer',
    email: 'natthanon.sing@student.ac.th',
    password: 'password123',
    role: 'Member',
    status: 'Active',
    created_at: '2025-03-01 11:20:00',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=200&h=200&q=80',
    rating: 4.8,
    phone: '095-443-8821'
  },
  {
    user_id: 4,
    username: 'ShadowScammer99',
    email: 'scammer@fake.io',
    password: 'password123',
    role: 'Member',
    status: 'Banned',
    created_at: '2025-03-05 18:45:00',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&h=200&q=80',
    rating: 1.2,
    phone: '061-000-9999'
  }
];

export const initialCategories: GameCategory[] = [
  {
    category_id: 1,
    name: 'Valorant',
    logo: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=120&h=120&q=80'
  },
  {
    category_id: 2,
    name: 'ROV',
    logo: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=120&h=120&q=80'
  },
  {
    category_id: 3,
    name: 'Genshin Impact',
    logo: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=120&h=120&q=80'
  },
  {
    category_id: 4,
    name: 'Free Fire',
    logo: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=120&h=120&q=80'
  },
  {
    category_id: 5,
    name: 'League of Legends',
    logo: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=120&h=120&q=80'
  },
  {
    category_id: 6,
    name: 'FC Mobile',
    logo: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=120&h=120&q=80'
  }
];

export const initialPosts: GamePost[] = [
  {
    post_id: 1,
    title: 'VALORANT - RADIANCE RANK, RARE SKINS & FULL ACCESS',
    description: 'ไอดีหลักเล่นเองตั้งแต่ Closed Beta อีเมลแท้ย้ายได้ 100% มี Vandal Champions 2021, Kuronami, Prime, Reaver ปลดล็อคครบทุกตัวละคร แรงค์ปัจจุบัน Radiance 540RR ไม่เคยโดนแบน พร้อมส่งมอบผ่านคนกลางแอดมินเท่านั้น',
    price: 15000,
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=800&q=80',
    status: 'Available',
    seller_id: 2,
    category_id: 1,
    created_at: '2026-09-20 10:15:00',
    server: 'APAC (Thailand)',
    rank: 'Radiance (Peak 620RR)',
    level: 285,
    skins_count: 142,
    original_email: true,
    battle_pass: true,
    secondary_verification: true,
    game_credentials_note: 'Riot ID: WolfLord#TH1 | Password: EncryptedInEscrow | First Email: Attached'
  },
  {
    post_id: 2,
    title: 'ROV - CONQUEROR RANK, MAJOR SKINS COLLECTION',
    description: 'ไอดี ROV ครบทุกฮีโร่ สกินแรร์ Dimension Breaker Nakroth, Violet, Murad มีสกินระดับ SS/Legend รวมกว่า 250 สกิน รูน 90 ครบทุกสาย ชนะ 68% ประวัติขาวสะอาด ไม่เคยดัดแปลงเกม',
    price: 10000,
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=800&q=80',
    status: 'Available',
    seller_id: 2,
    category_id: 2,
    created_at: '2026-09-20 14:40:00',
    server: 'TH Garena',
    rank: 'Supreme Conqueror 78 Stars',
    level: 30,
    skins_count: 265,
    original_email: true,
    battle_pass: true,
    secondary_verification: true,
    game_credentials_note: 'Garena ID: rov_pro_master | Phone unlinked | Safe Escrow'
  },
  {
    post_id: 3,
    title: 'GENSHIN IMPACT - C6 ARLECCHINO + SIGNATURE WEAPON',
    description: 'AR60 ไอดีเซิร์ฟ Asia แบกอบไฟแรงสุด C6 R1 Arlecchino, C2 Furina, C2 Nahida, C1 Neuvillette แมพฟาร์ม 100% ครบ พรีโมเจมเหลือ 12,000+ การันตีตัวต่อไป ไม่มีประวัติคืนเงินหรือโกง',
    price: 9000,
    image: 'https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=800&q=80',
    status: 'Available',
    seller_id: 2,
    category_id: 3,
    created_at: '2026-09-21 08:30:00',
    server: 'Asia',
    rank: 'AR 60 (Adventure Rank)',
    level: 60,
    skins_count: 45,
    original_email: true,
    battle_pass: true,
    secondary_verification: true,
    game_credentials_note: 'Hoyoverse Username Clean | Email changeable immediately'
  },
  {
    post_id: 4,
    title: 'FREE FIRE - MASTER RANK, ELITE PASS SEASON 1-8',
    description: 'ไอดี Free Fire ยุคบุกเบิก สกินฮิปฮอป ซากุระ ครบ มีชุดทอง ชุดไดโนเสาร์ ปืนอัปเกรดเลเวล 7 เต็ม 6 กระบอก แรงค์ Master สายยิงคม 100% พร้อมให้แอดมินคนกลางเข้าเช็คของในคลังได้ทันที',
    price: 5000,
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80',
    status: 'Pending',
    seller_id: 2,
    category_id: 4,
    created_at: '2026-09-21 12:00:00',
    server: 'TH Server',
    rank: 'Master (Grandmaster Peak)',
    level: 79,
    skins_count: 310,
    original_email: false,
    battle_pass: true,
    secondary_verification: true,
    game_credentials_note: 'VK / Facebook Bind ready for transfer'
  },
  {
    post_id: 5,
    title: 'LEAGUE OF LEGEND - CHALLENGER RANK, RARE SKINS & PRESTIGE',
    description: 'ไอดี LOL เซิร์ฟไทย/SEA แรงค์ Challenger 720LP มีสกิน Prestige มากกว่า 28 สกิน สกิน Ultimate ครบ และประวัติการแข่งในระดับทัวร์นาเมนต์ แชมเปี้ยนครบทุกตัว หายากเหมาะสำหรับนักสะสม',
    price: 8000,
    image: 'https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=800&q=80',
    status: 'Available',
    seller_id: 2,
    category_id: 5,
    created_at: '2026-09-21 16:20:00',
    server: 'SEA / TH',
    rank: 'Challenger',
    level: 412,
    skins_count: 420,
    original_email: true,
    battle_pass: true,
    secondary_verification: true,
    game_credentials_note: 'Riot Client SEA account, clean records'
  },
  {
    post_id: 6,
    title: 'FC MOBILE - OVR 102 PRIME ICONS SQUAD',
    description: 'ทีมรวมดาวตำนาน R9 Ronaldo, Zidane, Maldini, Gullit อัปเกรดระดับม่วงและแดงครบทั้ง 11 ตัวจริง Coin เหลือ 85 ล้าน สกิลบูสต์เลเวล 15+ เล่น H2H ไต่แชมเปี้ยนสบาย',
    price: 4200,
    image: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
    status: 'Sold',
    seller_id: 2,
    category_id: 6,
    created_at: '2026-09-19 11:00:00',
    server: 'Global / Asia',
    rank: 'FC Champion I',
    level: 68,
    skins_count: 85,
    original_email: true,
    battle_pass: true,
    secondary_verification: false,
    game_credentials_note: 'EA Account with verified Google link'
  }
];

export const initialOrders: Order[] = [
  {
    order_id: 101,
    amount: 5000,
    slip_image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
    status: 'Pending',
    buyer_id: 3,
    post_id: 4,
    order_date: '2026-09-21 13:40:00',
    notes: 'โอนผ่านพร้อมเพย์ ยอด 5,000 บาท แอดมินช่วยตรวจสลิปให้ด้วยครับ'
  },
  {
    order_id: 100,
    amount: 4200,
    slip_image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
    status: 'Completed',
    buyer_id: 3,
    post_id: 6,
    order_date: '2026-09-19 15:10:00',
    notes: 'ทำรายการเรียบร้อย แอดมินส่งมอบไอดีให้แล้ว ยืนยันสำเร็จ'
  }
];

export const initialChatRooms: ChatRoom[] = [
  {
    room_id: 12345,
    user_id: 3,
    created_at: '2026-09-21 13:45:00',
    title: 'Chat ID: 12345 - Middleman Transaction (Valorant Radiance)',
    related_post_id: 1,
    status: 'open'
  }
];

export const initialChatMessages: ChatMessage[] = [
  {
    message_id: 1,
    text_content: 'สวัสดีครับ สนใจซื้อไอดี Valorant Radiance ครับ ขอดำเนินการผ่านคนกลางแอดมินครับ',
    timestamp: '2026-09-21 13:46:10',
    is_read: true,
    room_id: 12345,
    sender_id: 3
  },
  {
    message_id: 2,
    text_content: 'สวัสดีครับคุณ Natthanon แอดมิน Sarah ประจำห้องแชทคนกลาง ยินดีให้บริการครับ กรุณาโอนเงินเข้าบัญชีกลาง GameTrade Hub Escrow แล้วแนบสลิปมาในแชทนี้ได้เลยครับ',
    timestamp: '2026-09-21 13:47:05',
    is_read: true,
    room_id: 12345,
    sender_id: 1
  },
  {
    message_id: 3,
    text_content: 'ผมแนบสลิปยอดเงินมัดจำคนกลาง 15,000 บาท เรียบร้อยแล้วครับ รบกวนแอดมินตรวจสอบครับ',
    image_url: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=400&q=80',
    timestamp: '2026-09-21 13:50:22',
    is_read: true,
    room_id: 12345,
    sender_id: 3
  },
  {
    message_id: 4,
    text_content: 'แอดมิน Sarah ตรวจสอบยอดเงินเข้าระบบคนกลางเรียบร้อยแล้ว กำลังดึงข้อมูลบัญชีและตรวจสอบเมลแท้จากผู้ขายครับ...',
    timestamp: '2026-09-21 13:52:00',
    is_read: false,
    room_id: 12345,
    sender_id: 1,
    is_system: true,
    system_action_type: 'payment_verified'
  }
];
