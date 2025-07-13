import { Staking } from '@/types/auth-1';

export function getStakingStats(stakings: Staking[]) {
    let total_staking_amount = 0;
    let active_staking_amount = 0;
    let completed_staking_amount = 0;
    let active_staking_number = 0;
    let completed_staking_number = 0;
    let earned_from_completed = 0;
    let earned_from_active = 0;
    let earning_claimed_from_active = 0;

    // Array of unlock dates and progress for each staking
    const staking_progress: { id: number; unlock_date: string | null; progress_percentage: number }[] = [];

    const today = new Date();

    for (const s of stakings) {
        const amount = s.package ? parseFloat(s.package.stake_amount) : 0;
        const dailyYield = s.package ? s.package.daily_yield_percentage : 0;
        total_staking_amount += amount;
        if (s.status === 'active') {
            active_staking_amount += amount;
            active_staking_number++;
            const startDate = s.createdAt ? new Date(s.createdAt) : null;
            const nowDate = new Date();
            let daysActive = 0;
            if (startDate && !isNaN(startDate.getTime())) {
                daysActive = Math.max(0, Math.floor((nowDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)));
            }
            
            earned_from_active += (amount * dailyYield * daysActive) / 100;
            earning_claimed_from_active += (amount * dailyYield * 365) / 100; // if 365 is the full period
        }
        if (s.status === 'completed') {
            completed_staking_amount += amount;
            completed_staking_number++;
            earned_from_completed += (amount * dailyYield * 365) / 100;
        }

        // Calculate unlock_date and progress_percentage for this staking
        let unlock_date: string | null = null;
        let progress_percentage = 0;
        if (s.createdAt && s.package?.lock_period_days) {
            const start = new Date(s.createdAt);
            const unlock = new Date(start);
            unlock.setDate(start.getDate() + s.package.lock_period_days);
            unlock_date = unlock.toISOString();

            const daysElapsed = Math.max(0, Math.floor((today.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)));
            progress_percentage = Math.min(100, Math.max(0, (daysElapsed / s.package.lock_period_days) * 100));
        }
        staking_progress.push({ id: s.id, unlock_date, progress_percentage });
    }

    return {
        total_staking_amount,
        active_staking_amount,
        completed_staking_amount,
        active_staking_number,
        completed_staking_number,
        earned_from_completed,
        earned_from_active,
        earning_claimed_from_active,
        staking_progress, // Array of {id, unlock_date, progress_percentage}
    };
}

export function getUnlockDate(staking: Staking): string | null {
    if (!staking.createdAt || !staking.package?.lock_period_days) return null;
    const start = new Date(staking.createdAt);
    const unlock = new Date(start);
    unlock.setDate(start.getDate() + staking.package.lock_period_days);
    return unlock.toISOString();
}