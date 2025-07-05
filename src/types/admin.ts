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
  
  // Recent user activity entry
  export interface RecentActivityUser {
    id: number;
    email: string;
    name: string;
    created_at: string; // ISO date string
    is_email_verified: boolean;
    is_active: boolean;
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
  
  // Recent staking activity entry
  export interface RecentActivityStaking {
    id: number;
    status: 'active' | 'completed' | string;
    created_at: string; // ISO date string
    user: RelatedUser;
    package: StakingPackage;
  }
  
  // Recent transaction activity entry
  export interface RecentActivityTransaction {
    id: number;
    type: 'staking' | 'withdrawal' | 'referral' | string;
    direction: 'in' | 'out' | string;
    amount: number;
    status: 'pending' | 'completed' | string;
    created_at: string; // ISO date string
    user: RelatedUser;
  }
  
  // Recent activities aggregation
  export interface RecentActivities {
    users: RecentActivityUser[];
    stakings: RecentActivityStaking[];
    transactions: RecentActivityTransaction[];
  }
  
  // Full dashboard summary response
  export interface AdminDashboardSummary {
    users?: UserStats;
    staking?: StakingStats;
    financial?: FinancialStats;
    transactions?: TransactionStats;
    withdrawals?: WithdrawalsStats;
    recent_activities?: RecentActivities;
  }
  