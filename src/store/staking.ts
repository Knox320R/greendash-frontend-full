import { createSlice } from '@reduxjs/toolkit';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { 
    StakingPackage, 
    Staking, 
    CreateStakingForm, 
    ClaimRewardsForm, 
    UnlockStakingForm,
    StakingCalculation,
    StakingStats,
    StakingPackagesResponse,
    StakingPackageResponse,
    CreateStakingResponse,
    StakingDetailsResponse,
    ClaimRewardsResponse,
    UnlockStakingResponse,
    StakingCalculationResponse
} from '@/types/staking';
import { AppDispatch } from './index';

// Initial state
interface StakingState {
    packages: StakingPackage[];
    userStakings: Staking[];
    selectedPackage: StakingPackage | null;
    selectedStaking: Staking | null;
    calculation: StakingCalculation | null;
    stats: StakingStats | null;
    isLoading: boolean;
    error: string | null;
}

const initialState: StakingState = {
    packages: [],
    userStakings: [],
    selectedPackage: null,
    selectedStaking: null,
    calculation: null,
    stats: null,
    isLoading: false,
    error: null,
};

// Staking slice
const stakingSlice = createSlice({
    name: 'staking',
    initialState,
    reducers: {
        setPackages: (state, action) => {
            state.packages =[...action.payload];
        },
        setUserStakings: (state, action) => {
            
            state.userStakings = action.payload;
        },
        setSelectedPackage: (state, action) => {
            state.selectedPackage = action.payload;
        },
        setSelectedStaking: (state, action) => {
            state.selectedStaking = action.payload;
        },
        setCalculation: (state, action) => {
            state.calculation = action.payload;
        },
        setStats: (state, action) => {
            state.stats = action.payload;
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        clearError: (state) => {
            state.error = null;
        },
        addStaking: (state, action) => {
            state.userStakings.unshift(action.payload);
        },
        updateStaking: (state, action) => {
            const index = state.userStakings.findIndex(s => s.id === action.payload.id);
            if (index !== -1) {
                state.userStakings[index] = action.payload;
            }
        },
        updatePackage: (state, action) => {
            const index = state.packages.findIndex(p => p.id === action.payload.id);
            if (index !== -1) {
                state.packages[index] = action.payload;
            }
        },
    },
});

export const {
    setPackages,
    setUserStakings,
    setSelectedPackage,
    setSelectedStaking,
    setCalculation,
    setStats,
    setLoading,
    setError,
    clearError,
    addStaking,
    updateStaking,
    updatePackage,
} = stakingSlice.actions;

// API functions
export const stakingApi = {
    // Get all staking packages
    getStakingPackages: () => async (dispatch: AppDispatch) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            
            const response = await api.get<StakingPackagesResponse>('/staking/packages');
            
            
            if (response.success) {
                dispatch(setPackages(response.data.packages));
                dispatch(setLoading(false));
                return response.data.packages;
            } else {
                throw new Error('Failed to fetch staking packages');
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch staking packages';
            dispatch(setError(errorMessage));
            dispatch(setLoading(false));
            toast.error(errorMessage);
        }
    },

    // Get specific staking package
    getStakingPackage: (id: number) => async (dispatch: AppDispatch) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            
            const response = await api.get<StakingPackageResponse>(`/staking/packages/${id}`);
            
            if (response.success) {
                dispatch(setSelectedPackage(response.data.package));
                dispatch(setLoading(false));
                return response.data.package;
            } else {
                throw new Error('Failed to fetch staking package');
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch staking package';
            dispatch(setError(errorMessage));
            dispatch(setLoading(false));
            toast.error(errorMessage);
        }
    },

    // Calculate staking rewards
    calculateRewards: (packageId: number, amount: number) => async (dispatch: AppDispatch) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            
            const response = await api.get<StakingCalculationResponse>('/staking/calculate-rewards', {
                params: { package_id: packageId, amount }
            });
            
            if (response.success) {
                dispatch(setCalculation(response.data));
                dispatch(setLoading(false));
                return response.data;
            } else {
                throw new Error('Failed to calculate rewards');
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to calculate rewards';
            dispatch(setError(errorMessage));
            dispatch(setLoading(false));
            toast.error(errorMessage);
        }
    },

    // Create new staking
    createStaking: (stakingData: CreateStakingForm) => async (dispatch: AppDispatch) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            
            const response = await api.post<CreateStakingResponse>('/staking/create', stakingData);
            
            if (response.success) {
                // Add the new staking to the list
                const newStaking: Staking = {
                    id: response.data.staking.id,
                    user_id: 0, // Will be set by backend
                    package_id: stakingData.package_id,
                    stake_amount: response.data.staking.stake_amount,
                    daily_yield_percentage: response.data.package.daily_yield_percentage,
                    daily_reward_amount: response.data.staking.daily_reward_amount,
                    total_rewards_earned: '0',
                    total_rewards_claimed: '0',
                    start_date: response.data.staking.start_date,
                    end_date: new Date().toISOString(),
                    unlock_date: response.data.staking.unlock_date,
                    status: response.data.staking.status as any,
                    is_locked: true,
                    lock_period_days: 365,
                    days_elapsed: 0,
                    days_remaining: 365,
                    completion_percentage: '0',
                    payment_method: 'usdt_bep20',
                    payment_amount: (stakingData.payment_amount).toString(),
                    payment_currency: 'USDT',
                    is_approved: false,
                    referral_bonus_paid: '0',
                    network_bonus_paid: '0',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                };
                
                dispatch(addStaking(newStaking));
                dispatch(setLoading(false));
                toast.success(response.message || 'Staking created successfully!');
                return response.data;
            } else {
                throw new Error(response.message || 'Failed to create staking');
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to create staking';
            dispatch(setError(errorMessage));
            dispatch(setLoading(false));
            toast.error(errorMessage);
        }
    },

    // Get staking details
    getStakingDetails: (id: number) => async (dispatch: AppDispatch) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            
            const response = await api.get<StakingDetailsResponse>(`/staking/details/${id}`);
            
            if (response.success) {
                dispatch(setSelectedStaking(response.data.staking));
                dispatch(setLoading(false));
                return response.data.staking;
            } else {
                throw new Error('Failed to fetch staking details');
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch staking details';
            dispatch(setError(errorMessage));
            dispatch(setLoading(false));
            toast.error(errorMessage);
        }
    },

    // Claim rewards
    claimRewards: (stakingId: number) => async (dispatch: AppDispatch) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            
            const response = await api.post<ClaimRewardsResponse>(`/staking/claim-rewards/${stakingId}`, {});
            
            if (response.success) {
                // Update the staking in the list
                dispatch(updateStaking({
                    id: stakingId,
                    // total_rewards_claimed: response.data.claimed_amount,
                } as Staking));
                
                dispatch(setLoading(false));
                toast.success(response.message || 'Rewards claimed successfully!');
                return response.data;
            } else {
                throw new Error(response.message || 'Failed to claim rewards');
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to claim rewards';
            dispatch(setError(errorMessage));
            dispatch(setLoading(false));
            toast.error(errorMessage);
        }
    },

    // Unlock staking
    unlockStaking: (stakingId: number) => async (dispatch: AppDispatch) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            
            const response = await api.post<UnlockStakingResponse>(`/staking/unlock/${stakingId}`, {});
            
            if (response.success) {
                // Update the staking in the list
                dispatch(updateStaking({
                    id: stakingId,
                    status: 'completed',
                    is_locked: false,
                } as Staking));
                
                dispatch(setLoading(false));
                toast.success(response.message || 'Staking unlocked successfully!');
                return response.data;
            } else {
                throw new Error(response.message || 'Failed to unlock staking');
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to unlock staking';
            dispatch(setError(errorMessage));
            dispatch(setLoading(false));
            toast.error(errorMessage);
        }
    },
};

export default stakingSlice.reducer; 