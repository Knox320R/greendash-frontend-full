import { createSlice } from '@reduxjs/toolkit';
import { AdminData, UserData } from '@/types/landing';
import { DashboardResponse } from '@/types/adminDashboard';
import { api } from '@/lib/api';
import { AppDispatch } from './index';
import { setLoading } from './auth';
import { toast } from 'sonner';
import { WithdrawalItem } from '@/types/admin';
import { AdminUserData } from '@/types/admin-user';

const initialState: AdminData = {
    admin_settings: [],
    commission_plans: [],
    rank_plans: [],
    staking_packages: [],
    total_tokens: [],
    token_pools: [],
    users: {
        isMore: true,
        list: []
    },
    stakings: {
        isMore: true,
        list: []
    },
    transactions: {
        isMore: true,
        list: []
    },
    withdrawals: {
        isMore: true,
        list: []
    },
    enterprise: {},
    selectedTab: 'dashboard',
    dashboardData: null,
    dashboardLoading: false
};

// Auth slice
const adminSlice = createSlice({
    name: 'admin settings',
    initialState,
    reducers: {
        setEnterprise: (state, action) => {
            state.enterprise = action.payload
        },
        setAdminSettings: (state, action) => {
            return { ...state, ...action.payload }
        },
        createAdminSetting: (state, action) => {
            const { table_name, data } = action.payload
            state[table_name].push(data)
        },
        concatPageDataSlice: (state, action) => {
            const { table_name, list, isMore } = action.payload
            if (!(['users', 'stakings', 'transactions', 'withdrawals'].includes(table_name))) return;
            state[table_name].list = state[table_name].list.concat(list)
            state[table_name].isMore = isMore
        },
        updatePageDataSlice: (state, action) => {
            const { table_name, data } = action.payload
            if (!(['users', 'stakings', 'transactions', 'withdrawals'].includes(table_name))) return;
            state[table_name].list = state[table_name].list.map(item => item.id === data.id ? data : item)
        },
        setSelectedTab: (state, action) => {
            state.selectedTab = action.payload
        },
        updateAdminSetting: (state, action) => {
            const { table_name, data } = action.payload
            state[table_name] = state[table_name].map(item => item.id === data.id ? data : item)
        },
        deleteAdminSetting: (state, action) => {
            const { table_name, id } = action.payload
            state[table_name] = state[table_name].filter(item => item.id !== id)
        },
        setDashboardData: (state, action) => {
            state.dashboardData = action.payload
            state.dashboardLoading = false
        },
        setDashboardLoading: (state, action) => {
            state.dashboardLoading = action.payload
        },
        clearDashboardData: (state) => {
            state.dashboardData = null
        },
        cancelAdminStaking: (state, action) => {
            const stake_id = action.payload
            console.log(stake_id);
            state.stakings.list = state.stakings.list.filter(item => item.id !== stake_id)
            state.users.list = state.users.list.map(user =>
                user.stakings.find(item => item.id === stake_id)
                    ? { ...user, stakings: user.stakings.filter(it => it.id !== stake_id) }
                    : user
            )
        }
    },
});

export const {
    setAdminSettings,
    createAdminSetting,
    updateAdminSetting,
    deleteAdminSetting,
    concatPageDataSlice,
    setEnterprise,
    updatePageDataSlice,
    setSelectedTab,
    setDashboardData,
    setDashboardLoading,
    clearDashboardData,
    cancelAdminStaking
} = adminSlice.actions;

export const updateUserActive = (is_email_verified: boolean, is_active: boolean, data: AdminUserData) => async (dispatch: AppDispatch) => {
    try {
        dispatch(setLoading(true))
        const res = await api.put<{ success: boolean, message: string }>('/admin/users/' + data.id, { is_active, is_email_verified })
        if (res.success) dispatch(updatePageDataSlice({ table_name: 'users', data }))
        else throw "failed to update user info"
    } catch (e) {
        console.log(e);
        toast.error("failed to update user info")
    } finally {
        dispatch(setLoading(false))
    }
}

export const fetchPageData = (limit: number, offset: number, table_name: string) => async (dispatch: AppDispatch) => {
    try {
        dispatch(setLoading(true))
        const res = await api.post<{ success: boolean, list: [], isMore: boolean }>('/admin/pagenation', { limit, offset, table_name })
        if (res.success) dispatch(concatPageDataSlice({ table_name, list: res.list, isMore: res.isMore }))
        else throw { message: "failed to fetch table data" }
    } catch (e) {
        console.log(e);
        toast.error(e.message)
    } finally {
        dispatch(setLoading(false))
    }
}

export const getMainSettings = () => async (dispatch: AppDispatch) => {
    try {
        dispatch(setLoading(true))
        const res = await api.get<{ success: boolean, data: AdminData }>('/auth/landing', { withCredentials: true })
        if (res.success) dispatch(setAdminSettings(res.data))
        else throw { message: "failed to get admin data" }
    } catch (e) {
        console.log(e);
        toast.error(e.message)
    } finally {
        dispatch(setLoading(false))
    }
}

export const getAdminData = () => async (dispatch: AppDispatch) => {
    try {
        dispatch(setLoading(true))
        const res = await api.get<{ success: boolean, data: any }>('/admin/main')
        if (res.success) dispatch(setEnterprise(res.data))
        else throw { message: "failed to get admin data" }
    } catch (e) {
        console.log(e);
        toast.error(e.message)
    } finally {
        dispatch(setLoading(false))
    }
}

export const createAdminSettingApi = (data: any) => async (dispatch: AppDispatch) => {
    try {
        dispatch(setLoading(true))
        const res = await api.post<{ success: boolean, message: string, newRow: any }>('/admin/main', data)
        if (res.success) dispatch(createAdminSetting({ table_name: data.table_name, data: res.newRow }))
        else throw { message: "failed to create new admin data" }
    } catch (e) {
        console.log(e);
        toast.error(e.message)
    } finally {
        dispatch(setLoading(false))
    }
}

export const updateAdminSettingApi = (data: any) => async (dispatch: AppDispatch) => {
    try {
        dispatch(setLoading(true))
        const res = await api.put<{ success: boolean }>('/admin/main', data)
        if (res.success) dispatch(updateAdminSetting(data))
        else throw { message: "failed to update admin data" }
    } catch (e) {
        console.log(e);
        toast.error(e.message)
    } finally {
        dispatch(setLoading(false))
    }
}

export const approveWithdrawal = (data: WithdrawalItem) => async (dispatch: AppDispatch) => {
    try {
        dispatch(setLoading(true))
        const res = await api.post<{ success: boolean, message: string }>('/admin/approve', { id: data.id })
        if (res.success) dispatch(updatePageDataSlice({ table_name: "withdrawals", data: { ...data, status: 'approved' } }))
        else throw { message: "failed to delete admin data" }
    } catch (e) {
        console.log(e);
        toast.error(e.message)
    } finally {
        dispatch(setLoading(false))
    }
}

export const rejectWithdrawal = (data: WithdrawalItem) => async (dispatch: AppDispatch) => {
    try {
        dispatch(setLoading(true))
        const res = await api.post<{ success: boolean }>('/admin/reject', { id: data.id })
        if (res.success) dispatch(updatePageDataSlice({ table_name: "withdrawals", data: { ...data, status: 'rejected' } }))
        else throw { message: "failed to delete admin data" }
    } catch (e) {
        console.log(e);
        toast.error(e.message)
    } finally {
        dispatch(setLoading(false))
    }
}

export const deleteAdminSettingApi = (table_name: string, id: number) => async (dispatch: AppDispatch) => {
    try {
        dispatch(setLoading(true))
        const res = await api.delete<{ success: boolean }>('/admin/main/' + table_name + '/' + id)
        if (res.success) dispatch(deleteAdminSetting({ table_name, id }))
        else throw { message: "failed to delete admin data" }
    } catch (e) {
        console.log(e);
        toast.error(e.message)
    } finally {
        dispatch(setLoading(false))
    }
}

export const fetchDailyFinancialData = (start_date: string, end_date: string) => async (dispatch: AppDispatch) => {
    try {
        dispatch(setDashboardLoading(true))
        const res = await api.post<DashboardResponse>('/admin/daily-financial', { start_date, end_date })
        if (res.success) {
            dispatch(setDashboardData(res.data))
        } else {
            throw { message: "Failed to fetch daily financial data" }
        }
    } catch (e) {
        console.log(e);
        toast.error(e.message || "Failed to fetch daily financial data")
        dispatch(setDashboardLoading(false))
    }
}

export const clearDashboardDataAction = () => async (dispatch: AppDispatch) => {
    dispatch(clearDashboardData())
}

export const universalCashback = () => async (dispatch: AppDispatch) => {
    try {
        const res = await api.post('/users/universal-cashback', {})
        console.log(res);

    } catch (e) {
        console.log(e);

    }
}

export const adminForceStake = (user_id: number, package_id: number) => async (dispatch: AppDispatch) => {
    try {
        dispatch(setLoading(true));
        const res = await api.post<{ success: boolean, message: string }>('/admin/force-staking', { user_id, package_id });
        if (res.success) {
            toast.success(res.message || 'Staking successful!');
        } else {
            throw new Error(res.message || 'Failed to force stake');
        }
    } catch (e: any) {
        toast.error(e.message || 'Failed to force stake');
        throw e;
    } finally {
        dispatch(setLoading(false));
    }
}

export const adminCancelStaking = (staking_id: number, user_id: number) => async (dispatch: AppDispatch) => {
    try {
        dispatch(setLoading(true));
        const res = await api.post<{ success: boolean, message: string }>('/admin/cancel-staking', { staking_id });
        if (res.success) {
            dispatch(cancelAdminStaking(staking_id))
            toast.success(res.message || 'Staking cancelled successfully!');
            // Optionally, you could refresh the stakings list here
        } else {
            throw new Error(res.message || 'Failed to cancel staking');
        }
    } catch (e: any) {
        toast.error(e.message || 'Failed to cancel staking');
        throw e;
    } finally {
        dispatch(setLoading(false));
    }
}


export default adminSlice.reducer; 