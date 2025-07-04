export interface UserData {
  id: number;
  email: string;
  name: string;
  referral_code: string;
  is_admin: boolean;
  egd_balance: number;
  withdrawals: number;
  wallet_address: string | null;
}

export interface UserBaseData {
  staking: StakingSummary;
  referrals: ReferralSummary;
  recent_transactions: Transaction[];
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

