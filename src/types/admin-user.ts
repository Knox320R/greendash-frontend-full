export interface Package {
    id: number;
    name: string;
    description: string;
    stake_amount: string;
    daily_yield_percentage: number;
    lock_period_days: number;
    createdAt: string; // ISO date string
    updatedAt: string; // ISO date string
  }
  
  export interface Staking {
    id: number;
    package_id: number;
    status: 'active' | 'completed' | 'cancelled' | 'paused' | 'free_staking';
    created_at: string; // ISO date string
    package: Package;
  }
  
  export interface AdminUserData {
    id: number;
    email: string;
    name: string;
    left_volume: string;
    right_volume: string;
    created_at: string; // ISO date string
    is_email_verified: boolean;
    is_active: boolean;
    stakings: Staking[];
  }  