import { User, UserBaseData } from './auth-1';

// Staking Types
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

export interface Staking {
  id: number;
  user_id: number;
  package_id: number;
  status: 'active' | 'completed' | 'free_staking';
  createdAt: string;
  updatedAt: string;
  package: StakingPackage;
}

export interface StakingStats {
  total_staking_amount: number;
  total_staking_count: number;
  active_staking_amount: number;
  active_staking_number: number;
  completed_staking_amount: number;
  completed_staking_number: number;
  earned_from_active: number;
}

// Referral Types
export interface ReferredUser {
  id: number;
  name: string;
  email: string;
  created_at: string;
  parent_leg: 'left' | 'right';
}

export interface ReferralNode {
  referredUser: ReferredUser;
  sub_referrals: ReferralNode[];
}

export interface ReferralStats {
  allReferrals: Array<ReferredUser & { level: number }>;
  totalReferralCount: number;
  referralsByLevel: Record<number, ReferredUser[]>;
}

// Transaction Types
export interface Transaction {
  id: number;
  user_id: number;
  type: 'staking' | 'withdrawal' | 'purchase' | 'daily_reward' | 'unilevel_commission' | 'universal_cashback' | 'weak_leg_bonus' | 'admin_adjustment';
  amount: number;
  created_at: string;
}

// Withdrawal Types
export interface Withdrawal {
  id: number;
  user_id: number;
  amount: number;
  status: 'pending' | 'approved' | 'completed' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

// Admin Settings Types
export interface AdminSetting {
  id: number;
  title: string;
  value: string;
  description: string;
}

export interface TokenInfo {
  id: number;
  title: string;
  price: number;
  description?: string;
}

// Exchange Flow Types
export interface ExchangeFlow {
  exchangeModalOpen: boolean;
  exchangeAmount: number;
  exchangeError: string;
  openExchangeModal: () => void;
  closeExchangeModal: () => void;
  setExchangeAmount: (amount: number) => void;
  setExchangeError: (error: string) => void;
}

// Withdrawal Flow Types
export interface WithdrawalFlow {
  withdrawModalOpen: boolean;
  withdrawAmount: string;
  withdrawError: string;
  openWithdrawModal: () => void;
  closeWithdrawModal: () => void;
  setWithdrawAmount: (amount: string) => void;
  setWithdrawError: (error: string) => void;
}

// Dashboard Props Types
export interface DashboardHeaderProps {
  user: User;
}

export interface BalanceCardsProps {
  user: User;
  stakingStats: StakingStats;
  onExchange: (amount: number) => void;
  onWithdraw: () => void;
  exchangeFlow: ExchangeFlow;
  withdrawalFlow: WithdrawalFlow;
}

export interface DashboardTabsProps {
  user: User;
  user_base_data: UserBaseData;
  stakingStats: StakingStats;
  stakingSummary: Staking[];
  referralNetwork: ReferralNode[];
  referralStats: ReferralStats;
  adminSettings: AdminSetting[];
  totalTokens: TokenInfo[];
  withdrawalFlow: WithdrawalFlow;
  onWithdrawal: (index: number) => void;
  isConnected: boolean;
  isCorrectWallet: (address: string) => boolean;
  connectWallet: (address: string) => Promise<void>;
}

export interface OverviewTabProps {
  user: User;
  stakingStats: StakingStats;
  stakingSummary: Staking[];
  isConnected: boolean;
}

export interface StakingTabProps {
  stakingSummary: Staking[];
  stakingStats: StakingStats;
  totalTokens: TokenInfo[];
  user: User;
}

export interface ReferralsTabProps {
  referralNetwork: ReferralNode[];
  referralStats: ReferralStats;
}

export interface ActivityTabProps {
  recentTransactions: Transaction[];
}

export interface WithdrawalsTabProps {
  withdrawals: Withdrawal[];
  adminSettings: AdminSetting[];
  onWithdrawal: (index: number) => void;
  isConnected: boolean;
  isCorrectWallet: (address: string) => boolean;
  connectWallet: (address: string) => Promise<void>;
  user: User;
} 