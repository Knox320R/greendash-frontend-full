export interface Staking_progress {
    progress_rate: number;
    current_earned: number;
    target_amount: number;
    current_staking_package_amount: number;
    has_active_staking: boolean;
    current_staking_package_name: string;
}