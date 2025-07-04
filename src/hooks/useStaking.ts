import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { stakingApi } from '@/store/staking';
import { CreateStakingForm } from '@/types/staking';

export const useStaking = () => {
  const dispatch = useDispatch<AppDispatch>();
  const staking = useSelector((state: RootState) => state.staking);

  return {
    // State
    packages: staking.packages,
    userStakings: staking.userStakings,
    selectedPackage: staking.selectedPackage,
    selectedStaking: staking.selectedStaking,
    calculation: staking.calculation,
    stats: staking.stats,
    isLoading: staking.isLoading,
    error: staking.error,

    // Actions
    getStakingPackages: () => dispatch(stakingApi.getStakingPackages()),
    getStakingPackage: (id: number) => dispatch(stakingApi.getStakingPackage(id)),
    calculateRewards: (packageId: number, amount: number) => dispatch(stakingApi.calculateRewards(packageId, amount)),
    createStaking: (stakingData: CreateStakingForm) => dispatch(stakingApi.createStaking(stakingData)),
    getStakingDetails: (id: number) => dispatch(stakingApi.getStakingDetails(id)),
    claimRewards: (stakingId: number) => dispatch(stakingApi.claimRewards(stakingId)),
    unlockStaking: (stakingId: number) => dispatch(stakingApi.unlockStaking(stakingId))
  };
}; 