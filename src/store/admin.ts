import { createSlice } from '@reduxjs/toolkit';
import { AdminData } from '@/types/landing';
import { api } from '@/lib/api';
import { AppDispatch } from '.';

// Initial state
const initialState: AdminData = {
    admin_settings: [],
    commission_plans: [],
    rank_plans: [],
    staking_packages: [],
    total_tokens: []
};

// Auth slice
const adminSlice = createSlice({
    name: 'admin settings',
    initialState,
    reducers: {
        setAdminSettings: (state, action) => {
            return action.payload;
        },
    },
});

export const {
    setAdminSettings
} = adminSlice.actions;

export const getLandingData = () => async (dispatch: AppDispatch) => {
    const res = await api.get<{ success: boolean, data: AdminData }>('/auth/landing')
    if(res.success) {
        dispatch(setAdminSettings(res.data))
    }
}

export default adminSlice.reducer; 