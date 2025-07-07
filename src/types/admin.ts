export interface Pagenation {
  isMore: boolean
}
// User summary stats
export interface UserStats {
  total: number;
  active: number;
  verified: number;
  new_today: number;
}

// Staking summary stats
export interface StakingStats {
  total: number;
  active: number;
  total_staked: number;
  total_rewards_paid: number;
}

// Financial summary stats
export interface FinancialStats {
  total_invested: number;
  total_earned: number;
  total_withdrawn: number;
}

// Transaction summary stats
export interface TransactionStats {
  total: number;
  pending: number;
  completed: number;
}

// Withdrawals summary stats
export interface WithdrawalsStats {
  pending: number;
  pending_amount: number;
}

// Related user for staking/transaction
export interface RelatedUser {
  email: string;
  name: string;
}

// Related staking package for recent staking activity
export interface StakingPackage {
  name: string;
  stake_amount: string; // keep as string for precision display
}

// Full dashboard summary response
export interface AdminDashboardSummary {
  users?: UserStats;
  staking?: StakingStats;
  financial?: FinancialStats;
  transactions?: TransactionStats;
  withdrawals?: WithdrawalsStats;
}

// Recent user activity entry
interface RecentUser {
  id: number;
  email: string;
  name: string;
  created_at: string; // ISO date string
  is_email_verified: boolean;
  is_active: boolean;
}

export interface UserList {
  isMore: boolean;
  list: RecentUser[];
}

// Recent staking activity entry
interface RecentStaking {
  id: number;
  status: 'active' | 'completed' | string;
  created_at: string; // ISO date string
  user: RelatedUser;
  package: StakingPackage;
}

export interface StakingList {
  isMore: boolean;
  list: RecentStaking[];
}

// Recent transaction activity entry
interface RecentTransaction {
  id: number;
  type: 'staking' | 'withdrawal' | 'referral' | string;
  direction: 'in' | 'out' | string;
  amount: number;
  status: 'pending' | 'completed' | string;
  created_at: string; // ISO date string
  user: RelatedUser;
}

export interface TransactionList {
  isMore: boolean;
  list: RecentTransaction[];
}

export interface WithdrawalItem {
  id: number;
  amount: number;     // EGD amount
  status: "pending" | "approved" | "rejected" | "processing" | "completed";
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
  user: RelatedUser;
}

export interface WithdrawalList {
  isMore: boolean;
  list: WithdrawalItem[];
}