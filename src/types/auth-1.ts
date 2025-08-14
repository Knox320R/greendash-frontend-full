import { Staking_progress } from "./progress";

export interface LoginResponse {
    success: boolean;
    message: string;
    user: User;
    user_base_data: UserBaseData;
    token: string;
    staking_progress: Staking_progress;
  }
  
  export interface User {
    id: number;
    name: string;
    email: string;
    referral_code: string;
    is_admin: boolean;
    phone: string;
    wallet_address: string;
    egd_balance: number;
    withdrawals: number;
    referred_by: number;
    parent_leg: 'left' | 'right';
    left_volume: number;
    right_volume: number;
    rank_goal: number;
    benefit_overflow: boolean;
    created_at: string;
  }
  
  export interface UserBaseData {
    upline_users: UplineUserEntry[];
    referral_network: ReferralNode[];
    recent_staking: Staking;
    recent_transactions: Transaction[];
    recent_withdrawals: Withdrawal[];
  }
  
  export interface UplineUserEntry {
    level: number;
    uplineUser: UplineUser;
  }
  
  export interface UplineUser {
    id: number;
    name: string;
    email: string;
    parent_leg: 'left' | 'right';
    created_at: string;
  }
  
  export interface ReferralNode {
    level: number;
    referredUser: ReferredUser;
    sub_referrals: ReferralNode[];
  }
  
  export interface ReferredUser {
    id: number;
    name: string;
    email: string;
    created_at: string; // ISO timestamp
    parent_leg: 'left' | 'right';
  }
  
  export interface Staking {
    id: number;
    user_id: number;
    package_id: number;
    status: 'active' | 'completed' | "free_staking";
    createdAt: string;
    updatedAt: string;
    package: Package;
  }
  
  export interface Package {
    id: number;
    name: string;
    description: string;
    stake_amount: string;  // Decimal(20, 8)
    daily_yield_percentage: number;
    lock_period_days: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface Transaction {
    id: number;
    user_id: number;
    type: 'staking' | 'withdrawal' | 'purchase' | 'daily_reward' | 'unilevel_commission' | 'universal_cashback' | 'weak_leg_bonus' | 'admin_adjustment';
    amount: number;
    created_at: string;
  }
  
  export interface Withdrawal {
    id: number;
    user_id: number;
    amount: number;
    status: 'pending' | 'approved' | 'completed' | 'rejected';
    createdAt: string;
    updatedAt: string;
  }
  
  

  