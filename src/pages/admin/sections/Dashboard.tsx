import React, { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  FaChartLine,
  FaUsers,
  FaCoins,
  FaDatabase,
  FaCog,
  FaEye,
  FaEdit,
  FaGift,
  FaPiggyBank,
} from 'react-icons/fa';
import { setSelectedTab } from '@/store/admin';
import { universalCashback } from '@/store/admin';
import { toast } from 'react-toastify';
import { formatDistanceToNow, parseISO } from 'date-fns';

const Dashboard: React.FC = () => {
  const enterprise = useSelector((state: RootState) => state.adminData.enterprise);
  // Get transactions from both sources
  const adminTransactions = useSelector((state: RootState) => state.adminData.transactions.list);
  const userTransactions = useSelector((state: RootState) => state.auth.user_base_data?.recent_transactions);

  const transactions =
    (adminTransactions && adminTransactions.length > 0)
      ? adminTransactions
      : (userTransactions && userTransactions.length > 0)
        ? userTransactions
        : [];

  const tokenPools = useSelector((state: RootState) => state.adminData.token_pools);
  const dispatch = useDispatch()
  const [isDistributing, setIsDistributing] = useState(false);

  // Memoize lastCashback as before
  const lastCashback = useMemo(() => {
    if (!transactions.length) return null;
    return transactions
      .filter((tx: any) => tx.type === 'universal_cashback')
      .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0] || null;
  }, [transactions]);

  let lastCashbackText = 'Never distributed';
  if (lastCashback) {
    try {
      lastCashbackText = `Last distributed: ${formatDistanceToNow(new Date(lastCashback.created_at), { addSuffix: true })}`;
    } catch {
      lastCashbackText = `Last distributed: ${lastCashback.created_at}`;
    }
  }

  // Find the fee pool (by title or description containing 'fee')
  const feePool = tokenPools.find(
    (pool) => pool.title.toLowerCase().includes('fee') || pool.description.toLowerCase().includes('fee')
  );

  // Find the staking pool (by title or description containing 'staking')
  const stakingPool = tokenPools.find(
    (pool) => pool.title.toLowerCase().includes('staking') || pool.description.toLowerCase().includes('staking')
  );

  const handleUniversalCashback = async () => {
    setIsDistributing(true);
    try {
      await dispatch(universalCashback() as any);
      toast.success('Universal cashback distributed successfully!');
    } catch (e) {
      toast.error('Failed to distribute universal cashback.');
    } finally {
      setIsDistributing(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Enterprise Dashboard</h2>
        <p className="text-gray-600">Overview of enterprise data and system statistics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <FaUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enterprise?.users?.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              Active users in the system
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staked Amount</CardTitle>
            <FaCoins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold">
              {stakingPool ? `${parseFloat(stakingPool.amount).toFixed(2)} EGD` : 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">
              Total amount staked across the staking pool
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Stakers</CardTitle>
            <FaDatabase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enterprise?.staking?.active || 0}</div>
            <p className="text-xs text-muted-foreground">
              Currently active staking contracts
            </p>
          </CardContent>
        </Card>


        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fee Pool & Stats</CardTitle>
            <FaPiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold mb-1">
              Fee Pool: {feePool ? `${parseFloat(feePool.amount).toFixed(2)} EGD` : 'N/A'}
            </div>
            <div className="text-xs text-muted-foreground mb-1">
              Active Staking: {enterprise?.staking?.total_staked?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || 0} EGD
            </div>
            <div className="text-xs text-muted-foreground">
              Active Users: {enterprise?.users?.active || 0}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Enterprise Data Display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FaChartLine className="h-5 w-5 text-green-600" />
              Enterprise Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {enterprise && Object.keys(enterprise).length > 0 ? (
                <div className="space-y-3">
                  {enterprise.users && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Users</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Total:</span>
                          <span>{enterprise.users.total}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Active:</span>
                          <span>{enterprise.users.active}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Verified:</span>
                          <span>{enterprise.users.verified}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {enterprise.staking && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">Staking</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Total Active Staking Amount:</span>
                          <span>{enterprise.staking.total_staked} EGD</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Number of Active Staking:</span>
                          <span>{enterprise.staking.active}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Number of Total Staking:</span>
                          <span>{enterprise.staking.total}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Number of Admin Offered Staking:</span>
                          <span>{enterprise.staking.total_rewards_paid}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {enterprise.financial && (
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold text-purple-800 mb-2">Financial</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Total Investment by Stakers:</span>
                          <span>{enterprise.financial.total_invested} USDT</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Bonuses Given to Stakers:</span>
                          <span>{enterprise.financial.total_earned} USDT</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Amount Withdrawn by Stakers:</span>
                          <span>{enterprise.financial.total_withdrawn} USDT</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FaDatabase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No enterprise data available</p>
                  <p className="text-sm">Enterprise data will appear here when loaded</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FaEye className="h-5 w-5 text-blue-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button
                className="w-full justify-start bg-pink-600 hover:bg-pink-700 text-white shadow-lg mt-6 py-6 text-lg font-bold rounded-xl border-2 border-pink-300"
                style={{ minHeight: 72 }}
                onClick={handleUniversalCashback}
                disabled={isDistributing}
              >
                <div className="flex flex-col items-start w-full">
                  <span className="flex items-center">
                    <FaGift className="mr-3 h-10 w-10" />
                    {isDistributing ? 'Distributing Cashback...' : 'Distribute Universal Cashback'}
                  </span>
                  <span className="text-xs text-pink-100 mt-2">{lastCashbackText}</span>
                </div>
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => dispatch(setSelectedTab('withdrawal_list'))} >
                <FaChartLine className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
              <Button className="w-full justify-start" onClick={() => dispatch(setSelectedTab('user_list'))} variant="outline">
                <FaUsers className="mr-2 h-4 w-4" />
                User Management
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => dispatch(setSelectedTab('staking_list'))}>
                <FaCoins className="mr-2 h-4 w-4" />
                Staking Overview
              </Button>
              <Button className="w-full justify-start" onClick={() => dispatch(setSelectedTab('settings'))} variant="outline">
                <FaEdit className="mr-2 h-4 w-4" />
                System Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard; 