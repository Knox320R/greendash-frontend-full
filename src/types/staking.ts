import { AdminSetting } from "./admin";

// Staking Package Types
export interface StakingPackage {
    id: number;
    name: string;
    description: string;
    min_stake_amount: string;
    max_stake_amount: string;
    daily_yield_percentage: string;
    lock_period_days: number;
    is_active: boolean;
    sort_order: number;
    apy: string;
    is_available: boolean;
    created_at: string;
    updated_at: string;
}

// Staking Types
export interface Staking {
    id: number;
    user_id: number;
    package_id: number;
    stake_amount: string;
    daily_yield_percentage: string;
    daily_reward_amount: string;
    total_rewards_earned: string;
    total_rewards_claimed: string;
    start_date: string;
    end_date: string;
    unlock_date: string;
    last_reward_date?: string;
    next_reward_date?: string;
    status: 'active' | 'completed' | 'cancelled' | 'paused';
    is_locked: boolean;
    lock_period_days: number;
    days_elapsed: number;
    days_remaining: number;
    completion_percentage: string;
    transaction_hash?: string;
    payment_method: 'usdt_bep20' | 'egd_tokens';
    payment_amount: string;
    payment_currency: string;
    is_approved: boolean;
    approved_by?: number;
    approved_at?: string;
    notes?: string;
    referral_bonus_paid: string;
    network_bonus_paid: string;
    created_at: string;
    updated_at: string;
    // Relations
    package?: StakingPackage;
    user?: {
        id: number;
        email: string;
        first_name: string;
        last_name: string;
    };
}

// Staking Form Types
export interface CreateStakingForm {
    package_id: number;
    payment_amount: number;
    payment_method?: 'usdt_bep20' | 'egd_tokens';
}

export interface ClaimRewardsForm {
    staking_id: number;
}

export interface UnlockStakingForm {
    staking_id: number;
}

// Staking Calculation Types
export interface StakingCalculation {
    package_id: number;
    amount: number;
    daily_reward: number;
    total_reward: number;
    apy: number;
    lock_period_days: number;
}

// Staking Statistics
export interface StakingStats {
    total_stakings: number;
    active_stakings: number;
    total_staked_amount: number;
    total_rewards_earned: number;
    total_rewards_claimed: number;
    average_apy: number;
}

// API Response Types
export interface StakingPackagesResponse {
    success: boolean;
    data: {
        packages: StakingPackage[];
        admin_settings: AdminSetting[];
    };
}

export interface StakingPackageResponse {
    success: boolean;
    data: {
        package: StakingPackage;
    };
}

export interface CreateStakingResponse {
    success: boolean;
    message: string;
    data: {
        staking: {
            id: number;
            stake_amount: string;
            daily_reward_amount: string;
            start_date: string;
            unlock_date: string;
            status: string;
        };
        package: {
            name: string;
            daily_yield_percentage: string;
            apy: string;
        };
    };
}

export interface StakingDetailsResponse {
    success: boolean;
    data: {
        staking: Staking;
    };
}

export interface ClaimRewardsResponse {
    success: boolean;
    message: string;
    data: {
        claimed_amount: number;
        new_balance: number;
    };
}

export interface UnlockStakingResponse {
    success: boolean;
    message: string;
    data: {
        unlocked_amount: number;
        new_balance: number;
    };
}

export interface StakingCalculationResponse {
    success: boolean;
    data: StakingCalculation;
} 