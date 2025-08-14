import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export const useDashboardData = () => {
  const adminSettings = useSelector((state: RootState) => state.adminData.admin_settings);
  const totalTokens = useSelector((state: RootState) => state.adminData.total_tokens);

  return {
    adminSettings,
    totalTokens
  };
}; 