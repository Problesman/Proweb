export type UserRole = 'Member' | 'Admin';
export type UserStatus = 'Active' | 'Banned';

export interface User {
  user_id: number;
  username: string;
  email: string;
  password?: string;
  role: UserRole;
  status: UserStatus;
  created_at: string;
  avatar?: string;
  rating?: number;
  phone?: string;
}

export interface GameCategory {
  category_id: number;
  name: string;
  logo: string;
}

export type PostStatus = 'Available' | 'Pending' | 'Sold';

export interface GamePost {
  post_id: number;
  title: string;
  description: string;
  price: number;
  image: string;
  status: PostStatus;
  seller_id: number;
  category_id: number;
  created_at: string;
  // Detailed metadata from UI mockups
  server?: string;
  rank?: string;
  level?: number;
  skins_count?: number;
  original_email?: boolean;
  battle_pass?: boolean;
  secondary_verification?: boolean;
  game_credentials_note?: string; // Stored securely for Admin escrow handover
}

export type OrderStatus = 'Pending' | 'Completed' | 'Cancelled';

export interface Order {
  order_id: number;
  amount: number;
  slip_image: string;
  status: OrderStatus;
  buyer_id: number;
  post_id: number;
  order_date: string;
  notes?: string;
}

export interface ChatRoom {
  room_id: number;
  user_id: number;
  created_at: string;
  title?: string;
  related_post_id?: number;
  status?: 'open' | 'closed';
}

export interface ChatMessage {
  message_id: number;
  text_content: string;
  image_url?: string;
  timestamp: string;
  is_read: boolean;
  room_id: number;
  sender_id: number;
  is_system?: boolean;
  system_action_type?: 'payment_verified' | 'escrow_hold' | 'credentials_delivered' | 'trade_completed';
}
