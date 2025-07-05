import { createSlice } from '@reduxjs/toolkit';
import { AdminData } from '@/types/landing';
import { api } from '@/lib/api';
import { AppDispatch } from './index';
import { setLoading } from './auth';
import { toast } from 'sonner';

// Initial state
const initialState: AdminData = {
    admin_settings: [],
    commission_plans: [],
    rank_plans: [],
    staking_packages: [],
    total_tokens: [],
    enterprise: {}
};

// Auth slice
const adminSlice = createSlice({
    name: 'admin settings',
    initialState,
    reducers: {
        setAdminSettings: (state, action) => {
            return { enterprise: {}, ...action.payload};
        },
        setEnterprise: (state, action) => {
            state.enterprise = action.payload
        },
        createAdminSetting: (state, action) => {
            const { field_name, data } = action.payload
            state[field_name].push(data)
        },
        updateAdminSetting: (state, action) => {
            const { field_name, data } = action.payload
            state[field_name] = state[field_name].map(item => item.id === data.id? data: item)
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
    setEnterprise
} = adminSlice.actions;

export const getMainSettings = () => async (dispatch: AppDispatch) => {
    try {
        dispatch(setLoading(true))
        const res = await api.get<{ success: boolean, data: AdminData }>('/auth/landing')
        if(res.success) dispatch(setAdminSettings(res.data))
        else throw { message: "failed to get admin data" }
    } catch(e) {
        console.log(e);
        toast.error(e.message)
    } finally {
        dispatch(setLoading(false))
    }
}

export const getAdminData = () => async (dispatch: AppDispatch) => {
    try {
        dispatch(setLoading(true))
        const res = await api.get<{ success: boolean, data: any }>('/admin')
        if(res.success) dispatch(setEnterprise(res.data))
        else throw { message: "failed to get admin data" }
    } catch(e) {
        console.log(e);
        toast.error(e.message)
    } finally {
        dispatch(setLoading(false))
    }
}

export const createAdminSettingApi = (data: any) => async (dispatch: AppDispatch) => {
    try {
        dispatch(setLoading(true))
        const res = await api.post<{ success: boolean }>('/admin', data)
        if(res.success) dispatch(createAdminSetting(data))
        else throw { message: "failed to create new admin data" }
    } catch(e) {
        console.log(e);
        toast.error(e.message)
    } finally {
        dispatch(setLoading(false))
    }
}

export const updateAdminSettingApi = (data: any) => async (dispatch: AppDispatch) => {
    try {
        dispatch(setLoading(true))
        const res = await api.put<{ success: boolean }>('/admin', data)
        if(res.success) dispatch(updateAdminSetting(data))
        else throw { message: "failed to update admin data" }
    } catch(e) {
        console.log(e);
        toast.error(e.message)
    } finally {
        dispatch(setLoading(false))
    }
}

export const deleteAdminSettingApi = (data: any) => async (dispatch: AppDispatch) => {
    try {
        dispatch(setLoading(true))
        const res = await api.delete<{ success: boolean }>('/admin', data)
        if(res.success) dispatch(deleteAdminSetting(data))
        else throw { message: "failed to delete admin data" }
    } catch(e) {
        console.log(e);
        toast.error(e.message)
    } finally {
        dispatch(setLoading(false))
    }
}

export default adminSlice.reducer; 