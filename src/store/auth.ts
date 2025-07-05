import { createSlice } from '@reduxjs/toolkit';
import { api } from '@/lib/api';
import { toast } from 'sonner';
import { LoginForm, RegisterForm, UpdateProfileForm, ResetPasswordForm, ConnectWalletForm, ChangePasswordForm } from '@/types/auth';
import { AppDispatch } from './index';
import { UserProfile } from '@/types/user';
import { UserBaseData, UserData } from '@/types/landing';

// Initial state
interface AppState {
    token: string;
    user: UserData;
    user_base_data: UserBaseData;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: boolean;
}

const initialState: AppState = {
    user: {
        id: 1,
        is_admin: false,
        email: "",
        referral_code: "",
        wallet_address: "",
        withdrawals: 0,
        egd_balance: 0,
    } as UserData,
    user_base_data: {} as UserBaseData, // placeholder, adjust as needed
    token: "",
    isAuthenticated: false,
    isLoading: false,
    error: false
};
// Auth slice
const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            const { token, user, user_base_data } = action.payload
            state.token = token;
            state.user_base_data = user_base_data;
            state.user = user;
            state.isAuthenticated = true;
        },
        setToken: (state, action) => {
            state.token = action.payload;
        },
        setAuthenticated: (state, action) => {
            state.isAuthenticated = action.payload;
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
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
        },
        updateUser: (state, action) => {
            state.user = { ...state.user, ...action.payload };
        },
    },
});

export const {
    setUser,
    setToken,
    setAuthenticated,
    setLoading,
    setError,
    clearError,
    logout,
    updateUser
} = authSlice.actions;

// API functions
export const authApi = {

    // Login user
    login: (credentials: LoginForm) => async (dispatch: AppDispatch) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());

            const response = await api.post<{ message: string, success: boolean, data: { token: string, user: UserData, user_base_data: UserBaseData } }>('/auth/login', credentials);
            dispatch(setLoading(false));

            if (response.success) {
                // Store token in localStorage
                localStorage.setItem('token', response.data.token);

                // Update state
                dispatch(setUser(response.data));

                toast.success(response.message || 'Login successful!');
                return { sucess: true }
            } else {
                return { success: false, msg: response['response']?.data?.message || "You should pass email verification!" };
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Login failed';
            dispatch(setError(errorMessage));
            dispatch(setLoading(false));
            toast.error(errorMessage);
        }
    },

    // Register user
    register: (userData: RegisterForm) => async (dispatch: AppDispatch) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());
            const response = await api.post<string>('/auth/register', userData);
            dispatch(setLoading(false));
            return response
        } catch (err: any) {
            console.log(err.data.response);

            const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
            dispatch(setError(errorMessage));
            dispatch(setLoading(false));
            toast.error(errorMessage);

        }
    },

    // Get current user
    getCurrentUser: () => async (dispatch: AppDispatch) => {
        try {
            dispatch(setLoading(true));

            // const response = await api.get<{ success: boolean; data: { user: UserProfile } }>('/auth/me');
            const response = await api.get<{ message: string, success: boolean, data: { token: string, user: UserData, user_base_data: UserBaseData } }>('/auth/me');
            dispatch(setLoading(false));

            if (response.success) {
                // Store token in localStorage
                localStorage.setItem('token', response.data.token);
                // Update state
                dispatch(setUser(response.data));
                toast.success(response.message || 'Login successful!');
                return { sucess: true }
            } else {
                return { success: false, msg: response['response']?.data?.message || "You should pass email verification!" };
            }
        } catch (err: any) {
            // If token is invalid, clear auth state
            localStorage.removeItem('token');
            dispatch(logout());
            dispatch(setLoading(false));

        }
    },

    // Update user profile
    updateProfile: (userData: UpdateProfileForm) => async (dispatch: AppDispatch) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());

            const response = await api.put<{ success: boolean; data: UserProfile; message: string }>('/users/profile', userData);
            dispatch(setLoading(false));

            if (response.success) {
                dispatch(setUser(response.data));
                toast.success(response.message || 'Profile updated successfully!');
                return response.data;
            } else {
                throw new Error(response.message || 'Failed to update profile');
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to update profile';
            dispatch(setError(errorMessage));
            dispatch(setLoading(false));
            toast.error(errorMessage);

        }
    },

    // Change password
    changePassword: (passwords: ChangePasswordForm) => async (dispatch: AppDispatch) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());

            const response = await api.put<{ success: boolean; message: string }>('/users/change-password', passwords);
            dispatch(setLoading(false));

            if (response.success) {
                toast.success(response.message || 'Password changed successfully!');
            } else {
                throw new Error(response.message || 'Failed to change password');
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to change password';
            dispatch(setError(errorMessage));
            dispatch(setLoading(false));
            toast.error(errorMessage);

        }
    },

    // Connect wallet
    connectWallet: (walletData: ConnectWalletForm) => async (dispatch: AppDispatch) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());

            const response = await api.post<{ success: boolean; data: UserProfile; message: string }>('/auth/connect-wallet', walletData);
            dispatch(setLoading(false));

            if (response.success) {
                dispatch(setUser(response.data));
                toast.success(response.message || 'Wallet connected successfully!');
                return response.data;
            } else {
                throw new Error(response.message || 'Failed to connect wallet');
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to connect wallet';
            dispatch(setError(errorMessage));
            dispatch(setLoading(false));
            toast.error(errorMessage);

        }
    },

    // Forgot password
    forgotPassword: (email: string) => async (dispatch: AppDispatch) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());

            const response = await api.post<{ success: boolean; message: string }>('/auth/forgot-password', { email });
            dispatch(setLoading(false));

            if (response.success) {
                toast.success(response.message || 'Password reset email sent!');
            } else {
                throw new Error(response.message || 'Failed to send reset email');
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to send reset email';
            dispatch(setError(errorMessage));
            dispatch(setLoading(false));
            toast.error(errorMessage);

        }
    },

    // Reset password
    resetPassword: (data: ResetPasswordForm) => async (dispatch: AppDispatch) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());

            const response = await api.post<{ success: boolean; message: string }>('/auth/reset-password', data);
            dispatch(setLoading(false));

            if (response.success) {
                toast.success(response.message || 'Password reset successfully!');
            } else {
                throw new Error(response.message || 'Failed to reset password');
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to reset password';
            dispatch(setError(errorMessage));
            dispatch(setLoading(false));
            toast.error(errorMessage);

        }
    },

    // Verify email
    verifyEmail: (token: string) => async (dispatch: AppDispatch) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());

            const response = await api.get<{ success: boolean; message: string }>(`/auth/verify-email/${token}`);
            dispatch(setLoading(false));

            if (response.success) {
                // Update user verification status
                dispatch(updateUser({ is_email_verified: true }));
                toast.success(response.message || 'Email verified successfully!');
            } else {
                throw new Error(response.message || 'Failed to verify email');
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to verify email';
            dispatch(setError(errorMessage));
            dispatch(setLoading(false));
            toast.error(errorMessage);

        }
    },

    // Resend verification email
    resendVerification: (email: string) => async (dispatch: AppDispatch) => {
        try {
            dispatch(setLoading(true));
            dispatch(clearError());

            const response = await api.post<{ success: boolean; message: string }>('/auth/resend-verification', { email });
            dispatch(setLoading(false));

            if (response.success) {
                toast.success(response.message || 'Verification email sent!');
            } else {
                throw new Error(response.message || 'Failed to send verification email');
            }
        } catch (err: any) {
            const errorMessage = err.response?.data?.message || err.message || 'Failed to send verification email';
            dispatch(setError(errorMessage));
            dispatch(setLoading(false));
            toast.error(errorMessage);

        }
    },

    // Logout user
    logout: () => async (dispatch: AppDispatch) => {
        try {
            await api.post('/auth/logout', {});
        } catch (err) {
            // Continue with logout even if API call fails
            console.log('Logout API call failed:', err);
        } finally {
            // Clear localStorage and state
            localStorage.removeItem('token');
            dispatch(logout());
            toast.success('Logged out successfully!');
        }
    },

    // Update user balance (for real-time updates)
    updateBalance: (balance: { egd_balance: number; usdt_balance: number; total_invested: number; total_earned: number }) => async (dispatch: AppDispatch) => {
        dispatch(updateUser(balance));
    },
};

export default authSlice.reducer; 