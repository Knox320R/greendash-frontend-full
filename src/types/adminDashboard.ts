export interface Period {
    start_date: string;
    end_date: string;
  }
  
  export interface User {
    email: string;
    name: string;
  }
  
  export interface Transaction {
    id: number;
    user_id: number;
    type: 'staking' | 'daily_reward' | 'withdrawal' | 'weak_leg_bonus' | 'purchase' | 'universal_cashback' | 'unilevel_commission' | 'admin_adjustment' ;
    amount: number;
    created_at: string;
    user: User;
  }
  
  export interface Withdrawal {
    id: number;
    user_id: number;
    amount: number;
    status: 'pending' | 'approved' | 'completed' | 'rejected';
    createdAt: string;
    updatedAt: string;
    user: User;
  }
  
  export interface StakingPackageDetails {
    name: string;
    stake_amount: string;
    daily_yield_percentage: number;
  }
  
  export interface Staking {
    id: number;
    user_id: number;
    package_id: number;
    status: 'active' | 'inactive' | string;
    createdAt: string;
    updatedAt: string;
    user: User;
    package: StakingPackageDetails;
  }
  
  export interface Summary {
    total_transactions: number;
    total_withdrawals: number;
    total_stakings: number;
  }
  
  export interface DashboardData {
    period: Period;
    transactions: Transaction[];
    withdrawals: Withdrawal[];
    stakings: Staking[];
    summary: Summary;
  }
  
  export interface DashboardResponse {
    success: boolean;
    data: DashboardData;
  }
  