// Admin Settings
export interface AdminSetting {
  id: number;
  title: string;
  description: string;
  value: string;
  createdAt: string;
  updatedAt: string;
}

// Staking Packages
export interface StakingPackage {
  id: number;
  name: string;
  description: string;
  stake_amount: string;
  daily_yield_percentage: number;
  lock_period_days: number;
  createdAt: string;
  updatedAt: string;
}

// Rank Plans
export interface RankPlan {
  id: number;
  rank: string;
  bonus_amount: string;
  volume: string;
  equivalent: string | null;
  createdAt: string;
  updatedAt: string;
}

// Commission Plans
export interface CommissionPlan {
  id: number;
  level: number;
  commission_percent: number;
  createdAt: string;
  updatedAt: string;
}

// Total Tokens
export interface TotalToken {
  id: number;
  title: string;
  description: string;
  amount: string;
  price: number | null;
  createdAt: string;
  updatedAt: string;
}

// Token Pools
export interface TokenPool {
  id: number;
  title: string;
  description: string;
  amount: string;
  createdAt: string;
  updatedAt: string;
}

// Root API Response
export interface PlatformDataResponse {
  success: boolean;
  data: {
    admin_settings: AdminSetting[];
    staking_packages: StakingPackage[];
    rank_plans: RankPlan[];
    commission_plans: CommissionPlan[];
    total_tokens: TotalToken[];
    token_pools: TokenPool[];
  };
}
