import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { authApi } from '@/store/auth';
import { LoginForm, RegisterForm, UpdateProfileForm, ConnectWalletForm, ChangePasswordForm } from '@/types/auth';

export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const auth = useSelector((state: RootState) => state.auth);

  return {
    // State
    user: auth.user,
    token: auth.token,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    error: auth.error,
    user_base_data: auth.user_base_data,

    // Actions
    login: (credentials: LoginForm) => dispatch(authApi.login(credentials)),
    register: (userData: RegisterForm) => dispatch(authApi.register(userData)),
    getCurrentUser: () => dispatch(authApi.getCurrentUser()),
    updateProfile: (userData: UpdateProfileForm) => dispatch(authApi.updateProfile(userData)),
    changePassword: (passwords: ChangePasswordForm) => dispatch(authApi.changePassword(passwords)),
    connectWallet: (walletData: ConnectWalletForm) => dispatch(authApi.connectWallet(walletData)),
    logout: () => dispatch(authApi.logout()),
    forgotPassword: (email: string) => dispatch(authApi.forgotPassword(email)),
    resetPassword: (data: { token: string; password: string }) => dispatch(authApi.resetPassword(data)),
    verifyEmail: (token: string) => dispatch(authApi.verifyEmail(token)),
    resendVerification: (email: string) => dispatch(authApi.resendVerification(email)),
    updateBalance: (balance: { egd_balance: number; usdt_balance: number; total_invested: number; total_earned: number }) =>
      dispatch(authApi.updateBalance(balance)),
  };
}; 