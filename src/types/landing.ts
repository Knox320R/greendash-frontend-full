import { AdminDashboardSummary, StakingList, TransactionList, UserList } from "./admin";

export interface UserData {
  id: number;
  email: string;
  name: string;
  referral_code: string;
  phone?: string;
  is_admin: boolean;
  egd_balance: number;
  withdrawals: number;
  created_at: string;
  wallet_address: string | null;
}

export interface UserBaseData {
  staking: StakingSummary;
  referrals: ReferralSummary;
  recent_transactions: Transaction[];
  upline_users: Upline[];
}


export interface UplineUser {
  id: number;
  name: string;
  email: string;
  egd_balance: string; // precise decimal as string
}

export interface Upline {
  level: number;
  user: UplineUser;
}

export interface StakingSummary {
  total_staked: number;
  total_rewards_earned: number;
  total_rewards_claimed: number;
  entire_stakings: number;
  stakings: Staking[];
}

export interface Staking {
  id: number;
  stake_amount: string; // comes as string from DB
  status: 'active' | 'completed' | string; // adjust if you have strict status
  start_date: string; // ISO date
  now: string; // ISO date
  package: StakingPackage;
}

export interface StakingPackage {
  id: number;
  name: string;
  daily_yield_percentage: number;
  lock_period_days: number;
}

export interface ReferralSummary {
  total_earn_from_affiliation: number;
  each_level_income: number[];
  each_level_affiliater_number: number[];
  network: ReferralNetwork[];
}

export interface ReferralNetwork {
  id: number;
  level: number;
  referred_user: ReferredUser;
  commission_income: number;
  sub_referrals: ReferralNetwork[];
}

export interface ReferredUser {
  id: number;
  name: string;
  email: string;
  egd_balance: string; // comes as string from DB
}

export interface Transaction {
  id: number;
  type: 'staking' | 'withdrawal' | 'referral' | string; // adjust to match your system
  direction: 'in' | 'out';
  amount: number;
  currency: string;
  status: 'completed' | 'pending' | string;
  notes: string;
  created_at: string; // ISO date
}


/** Admin setting row */
export interface AdminSetting {
  id: number;
  title: string;
  description: string;
  value: string;
  createdAt: string; // ISO Date string
  updatedAt: string; // ISO Date string
}

/** Staking package row */
export interface StakingPackage {
  id: number;
  name: string;
  description: string;
  stake_amount: string; // precise decimal as string
  daily_yield_percentage: number;
  lock_period_days: number;
  createdAt: string;
  updatedAt: string;
}

/** Rank plan row */
export interface RankPlan {
  id: number;
  rank: string;
  bonus_amount: string; // stored as string for precise decimal
  volume: string;       // stored as string for precise decimal
  equivalent: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Commission plan row */
export interface CommissionPlan {
  id: number;
  level: number;
  commission_percent: number;
  createdAt: string;
  updatedAt: string;
}

/** Total token allocation row */
export interface TotalToken {
  id: number;
  title: string;
  description: string;
  percent: number;
  createdAt: string;
  updatedAt: string;
}

/** Full settings payload structure */
export interface AdminData {
  admin_settings: AdminSetting[];
  staking_packages: StakingPackage[];
  rank_plans: RankPlan[];
  commission_plans: CommissionPlan[];
  total_tokens: TotalToken[];
  users: UserList;
  stakings: StakingList;
  transactions: TransactionList;
  enterprise?: AdminDashboardSummary;
}

