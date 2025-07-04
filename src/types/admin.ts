// user states
export interface UserStats {
    total: number;
    active: number;
    verified: number;
    new_today: number;
}

// staking states
export interface StakingStats {
    total: number;
    active: number;
    total_staked: number;
    total_rewards_paid: number;
}

// financial states
export interface FinancialStats {
    total_invested: number;
    total_earned: number;
    total_withdrawn: number;
}

// transaction states
export interface TransactionStats {
    total: number;
    pending: number;
    completed: number;
}

// withdrawal states
export interface WithdrawalStats {
    pending: number;
    pending_amount: number;
}

// dashboard statistics
export interface DashboardStatistics {
    adminSettings: AdminSetting[];
    users: UserStats;
    staking: StakingStats;
    financial: FinancialStats;
    transactions: TransactionStats;
    withdrawals: WithdrawalStats;
    recent_activities: RecentActivities;
}

// recent users
export interface RecentUser {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    created_at: string;
    is_email_verified: boolean;
}

// recent stakings
export interface RecentStaking {
    id: number;
    start_date: string;
    end_date: string;
    last_reward_date: string | null;
    status: string;
    payment_amount: string;
    created_at: string;
    user: {
        email: string;
        first_name: string;
        last_name: string;
    };
    package: {
        name: string;
    };
}

// recent transactions
export interface RecentTransaction {
    id: number;
    transaction_type: string;
    amount: string;
    status: string;
    created_at: string;
    user: {
        email: string;
        first_name: string;
        last_name: string;
    };
}

// recent activities
export interface RecentActivities {
    users: RecentUser[];
    stakings: RecentStaking[];
    transactions: RecentTransaction[];
}

// admin settings
export interface AdminSetting {
    id: number;
    title: string;
    description?: string;
    value: string;
    updated_at: string;
}

// user list
export interface UserListResponse {
    users: UserItem[];
    pagination: Pagination;
}

export interface UserItem {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    wallet_address: string | null;
    total_invested: string;
    egd_balance: string;
    last_login: string;
    created_at: string;
}

// staking list
export interface StakingListResponse {
    stakings: StakingItem[];
    pagination: Pagination;
}

export interface StakingItem {
    id: number;
    user_id: number;
    package_id: number;
    stake_amount: string; // decimal as string
    start_date: string;   // ISO date string
    transaction_hash: string | null;
}

export interface Pagination {
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
}
