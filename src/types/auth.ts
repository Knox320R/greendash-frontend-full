import { UserProfile } from "./user";

// User Management Types - Updated to match backend model

export interface AuthState {
    user: UserProfile | null;
    token: string | null;
    isAuthenticated: boolean;
    isLoading: boolean;
    error: string | null;
}

// Form Types - Updated to match backend expectations
export interface LoginForm {
    email: string;
    password: string;
}

export interface RegisterForm {
    email: string;
    password: string;
    name: string;
    phone?: string;
    referral_code?: string;
    wallet_address?: string;
}

export interface UpdateProfileForm {
    first_name?: string;
    last_name?: string;
    phone?: string;
    country?: string;
    city?: string;
    timezone?: string;
    language?: string;
    profile_image?: string;
}

// API Response Types - Updated to match backend responses
export interface LoginResponse {
    success: boolean;
    message: string;
    data: {
        user: UserProfile;
        token: string;
    };
}

export interface RegisterResponse {
    success: boolean;
    message: string;
    data: {
        user: UserProfile;
        token: string;
    };
}

export interface AuthResponse {
    success: boolean;
    message?: string;
    error?: string;
}

// Email verification types
export interface EmailVerificationResponse {
    success: boolean;
    message: string;
}

export interface ResendVerificationForm {
    email: string;
}

// Password reset types
export interface ForgotPasswordForm {
    email: string;
}

export interface ResetPasswordForm {
    token: string;
    password: string;
}

// Wallet connection types
export interface ConnectWalletForm {
    wallet_address: string;
}

// Password change types
export interface ChangePasswordForm {
    current_password: string;
    new_password: string;
}

// Dashboard types
export interface DashboardStats {
    total_staked: number;
    total_earned: number;
    active_stakings: number;
    total_referrals: number;
    referral_earnings: number;
    pending_withdrawals: number;
}

// Legacy types for backward compatibility
export interface RegistrationStep1 {
    email: string;
    password: string;
}

export interface RegistrationVerification {
    email: string;
    code: string;
    first_name?: string;
    last_name?: string;
    profile_image?: string;
    wallet_address?: string;
    referral_code?: string;
}
