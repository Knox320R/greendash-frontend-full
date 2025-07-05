import { createSlice } from '@reduxjs/toolkit';
import { AdminData } from '@/types/landing';
import { api } from '@/lib/api';
import { AppDispatch } from './index';
import { setLoading } from './auth';
import { toast } from 'sonner';

const initialState: AdminData = {
    admin_settings: [],
    commission_plans: [],
    rank_plans: [],
    staking_packages: [],
    total_tokens: [],
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
    enterprise: {}
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
            const { field_name, data } = action.payload
            state[field_name].push(data)
        },
        concatPageDataSlice: (state, action) => {
            const { table_name, list, isMore } = action.payload
            if (!(['users', 'stakings', 'transactions'].includes(table_name))) return;
            state[table_name].list = state[table_name].list.concat(list)
            state[table_name].isMore = isMore
        },
        updatePageDataSlice: (state, action) => {
            const { table_name, data } = action.payload
            if (!(['users', 'stakings', 'transactions'].includes(table_name))) return;
            state[table_name].list = state[table_name].list.map(item => item.id === data.id? data: item )
        },
        updateAdminSetting: (state, action) => {
            const { field_name, data } = action.payload
            state[field_name] = state[field_name].map(item => item.id === data.id ? data : item)
        },
        deleteAdminSetting: (state, action) => {
            const { field_name, data } = action.payload
            state[field_name] = state[field_name].filter(item => item.id !== data.id)
        },
    },
});

export const {
    setAdminSettings,
    createAdminSetting,
    updateAdminSetting,
    deleteAdminSetting,
    concatPageDataSlice,
    setEnterprise,
    updatePageDataSlice
} = adminSlice.actions;

export const updateUserActive = (is_active: boolean, data: any ) => async (dispatch: AppDispatch) => {
    try {
        dispatch(setLoading(true))
        const res = await api.put<{ success: boolean, message: string }>('/admin/users/' + data.id, { is_active })
        if(res.success) dispatch(updatePageDataSlice({ table_name: 'users', data}))
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
        const res = await api.get<{ success: boolean, data: AdminData }>('/auth/landing')
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
        const res = await api.post<{ success: boolean }>('/admin/main', data)
        if (res.success) dispatch(createAdminSetting(data))
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

export const deleteAdminSettingApi = (data: any) => async (dispatch: AppDispatch) => {
    try {
        dispatch(setLoading(true))
        const res = await api.delete<{ success: boolean }>('/admin/main', data)
        if (res.success) dispatch(deleteAdminSetting(data))
        else throw { message: "failed to delete admin data" }
    } catch (e) {
        console.log(e);
        toast.error(e.message)
    } finally {
        dispatch(setLoading(false))
    }
}

export default adminSlice.reducer; 