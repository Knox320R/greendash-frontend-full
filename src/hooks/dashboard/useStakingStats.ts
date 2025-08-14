import { useMemo } from 'react';
import { getStakingStats } from '@/lib/staking';
import { UserBaseData } from '@/types/auth-1';
import { StakingStats, Staking } from '@/types/dashboard';

export const useStakingStats = (user_base_data: UserBaseData) => {
  const stakingSummary = useMemo(() => user_base_data?.recent_stakings ? user_base_data.recent_stakings : [], user_base_data?.recent_stakings);
  
  const stakingStats = useMemo(() => {
    return getStakingStats(stakingSummary);
  }, [stakingSummary]);

  return {
    stakingStats,
    stakingSummary
  };
}; 