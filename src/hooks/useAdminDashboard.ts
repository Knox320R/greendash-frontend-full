import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { fetchDailyFinancialData, clearDashboardDataAction } from '@/store/admin';
import { getDateRangeForPeriod } from '@/lib/utils';
import { DashboardData } from '@/types/adminDashboard';

export const useAdminDashboard = () => {
  const dispatch = useDispatch();
  const { dashboardData, dashboardLoading } = useSelector((state: RootState) => state.adminData);

  const fetchDashboardData = async (start_date: string, end_date: string) => {
    await dispatch(fetchDailyFinancialData(start_date, end_date) as any);
  };

  const fetchDataForPeriod = async (period: 'today' | 'week' | 'month' | 'custom') => {
    const dateRange = getDateRangeForPeriod(period);
    await fetchDashboardData(dateRange.start_date, dateRange.end_date);
  };

  const clearData = () => {
    dispatch(clearDashboardDataAction() as any);
  };

  const getSummaryStats = () => {
    if (!dashboardData) return null;
    
    const { summary, transactions, withdrawals, stakings } = dashboardData;
    
    // Calculate financial totals
    const totalTransactionAmount = transactions.reduce((sum, tx) => sum + tx.amount, 0);
    const totalWithdrawalAmount = withdrawals.reduce((sum, wd) => sum + wd.amount, 0);
    const totalStakingAmount = stakings.reduce((sum, staking) => {
      const stakeAmount = parseFloat(staking.package.stake_amount);
      return sum + stakeAmount;
    }, 0);

    return {
      ...summary,
      total_transaction_amount: totalTransactionAmount,
      total_withdrawal_amount: totalWithdrawalAmount,
      total_staking_amount: totalStakingAmount,
      net_flow: totalTransactionAmount - totalWithdrawalAmount
    };
  };

  const getTransactionsByType = () => {
    if (!dashboardData) return {};
    
    return dashboardData.transactions.reduce((acc, tx) => {
      acc[tx.type] = (acc[tx.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  const getWithdrawalsByStatus = () => {
    if (!dashboardData) return {};
    
    return dashboardData.withdrawals.reduce((acc, wd) => {
      acc[wd.status] = (acc[wd.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  };

  return {
    dashboardData,
    dashboardLoading,
    fetchDashboardData,
    fetchDataForPeriod,
    clearData,
    getSummaryStats,
    getTransactionsByType,
    getWithdrawalsByStatus
  };
}; 