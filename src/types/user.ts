export interface UserProfile {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
    phone: string;
    wallet_address: string;
    referral_code: string;
    referred_by: string | null;
    referral_level: number;
    egd_balance: string;
    usdt_balance: string;
    total_invested: string;
    total_earned: string;
    total_withdrawn: string;
    is_email_verified: boolean;
    email_verification_expires: string | null;
    reset_password_expires: string | null;
    is_active: boolean;
    is_admin: boolean;
    last_login: string;
    profile_image: string | null;
    country: string;
    city: string;
    timezone: string;
    language: string;
    two_factor_enabled: boolean;
    two_factor_secret: string | null;
    createdAt: string;
    updatedAt: string;
  }
  