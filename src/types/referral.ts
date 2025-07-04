//all referral tree
export interface ReferralTreeResponse {
      overall: OverallStats;
      by_level: Record<string, LevelStats>;
      recent_referrals: ReferralEntry[];
  }
  
  export interface OverallStats {
    total_referrals: number;
    total_invested: number;
    total_earnings: number;
  }
  
  export interface LevelStats {
    count: number;
    total_invested: number;
    total_earnings: number;
    referrals: ReferralEntry[];
  }
  
  export interface ReferralEntry {
    id: number;
    referrer_id: number;
    referred_id: number;
    level: number;
    is_active: boolean;
    total_earned: string; //decimal
    total_invested: string;  //decimal
    total_staked: string;  //decimal
    direct_cashback_paid: string;  //decimal
    network_cashback_paid: string;  //decimal
    last_activity: string; // ISO string
    joined_at: string;
    first_investment_at: string | null;
    first_staking_at: string | null;
    referral_path: string;
    commission_rate: string;  //decimal
    is_qualified: boolean;
    qualification_date: string | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
    referred: ReferredUser;
  }
  
  export interface ReferredUser {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    created_at: string;
    egd_balance: string;  //decimal
    total_invested: string;  //decimal
    is_email_verified: boolean;
  }
  
  //referrals according to the level
  export interface ReferralListResponse {
    referrals: ReferralEntry[];
    level: number;
    statistics: ReferralStatistics;
    pagination: PaginationInfo;
  }
  
  export interface ReferralStatistics {
    total_referrals: number;
    total_invested: number;
    total_earnings: number;
  }
  
  export interface PaginationInfo {
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
  }
  
  export interface ReferralEntry {
    id: number;
    referrer_id: number;
    referred_id: number;
    level: number;
    is_active: boolean;
    total_earned: string;  //decimal
    total_invested: string;  //decimal
    total_staked: string;   //decimal
    direct_cashback_paid: string;  //decimal
    network_cashback_paid: string;  //decimal
    last_activity: string; // ISO date
    joined_at: string;
    first_investment_at: string | null;
    first_staking_at: string | null;
    referral_path: string;
    commission_rate: string;  //decimal
    is_qualified: boolean;
    qualification_date: string | null;
    notes: string | null;
    createdAt: string;
    updatedAt: string;
    referred: ReferredUser;
  }
  
  export interface ReferredUser {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    created_at: string;
    egd_balance: string;  //decimal
    total_invested: string;  //decimal
    is_email_verified: boolean;
  }
  
//referral rewards
export interface ReferralRewardsResponse {
    data: {
      transactions: ReferralRewardTransaction[];
      pagination: PaginationInfo;
    };
  }
  
  export interface ReferralRewardTransaction {
    id: number;
    user_id: number;
    transaction_type: string; // e.g., "referral_bonus"
    amount: string;  //decimal
    currency: string;
    status: string; // e.g., "completed"
    description: string;
    reference_id: string;
    reference_type: string; // e.g., "referral", "cashback"
    wallet_address: string | null;
    transaction_hash: string | null;
    block_number: string | null;
    gas_used: string | null;  //decimal
    gas_price: string | null;  //decimal
    network_fee: string | null;  //decimal
    platform_fee: string | null;  //decimal
    exchange_rate: string;  //decimal
    balance_before: string;  //decimal
    balance_after: string;  //decimal
    metadata: ReferralTransactionMetadata;
    processed_by: string | null;
    processed_at: string | null;
    notes: string | null;
    is_manual: boolean;
    ip_address: string;
    user_agent: string;
    createdAt: string;
    updatedAt: string;
  }
  
  export type ReferralTransactionMetadata =
    | ReferralBonusMetadata
    | CashbackRewardMetadata;
  
  export interface ReferralBonusMetadata {
    referral_id: number;
    referral_level: number;
    staking_amount: number;
    commission_rate: number;
  }
  
  export interface CashbackRewardMetadata {
    source_user: number;
    cashback_type: string; // e.g., "daily"
    referral_level: number;
  }
  
  export interface PaginationInfo {
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
  }