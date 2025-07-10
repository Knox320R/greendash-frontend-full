export interface AdminSetting {
    id: number;
    title: string;
    description: string;
    value: string;
    createdAt: string;
    updatedAt: string;
  }
  
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
  
  export interface RankPlan {
    id: number;
    rank: string;
    bonus_amount: string;
    volume: string;
    equivalent: string | null;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface CommissionPlan {
    id: number;
    level: number;
    commission_percent: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface TotalToken {
    id: number;
    title: string;
    description: string;
    percent: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface PlatformData {
    admin_settings: AdminSetting[];
    staking_packages: StakingPackage[];
    rank_plans: RankPlan[];
    commission_plans: CommissionPlan[];
    total_tokens: TotalToken[];
  }
  