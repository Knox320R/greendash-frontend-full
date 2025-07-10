import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FaWallet,
  FaChartLine,
  FaUsers,
  FaCoins,
  FaLock,
  FaArrowUp,
  FaArrowDown,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaUserShield,
  FaSitemap,
  FaUserFriends,
  FaBolt
} from 'react-icons/fa';
import { delay, motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency, formatNumber, formatDate } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { authApi, setLoading } from '@/store/auth';
import { useDispatch, useSelector } from 'react-redux';
import { addDays, format as formatDateFns, differenceInDays, parseISO } from 'date-fns';
import { format } from 'date-fns';
import { Mail, Phone, Calendar, Users, ArrowLeftRight, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { AppDispatch, RootState } from '@/store';
import { toast } from 'react-toastify';
import NotificationBanner from '@/components/NotificationBanner';
import { getStakingStats } from '@/lib/staking';

const packageColorMap: Record<string, string> = {
  'Daily Ride': '#22c55e', // green
  'Weekly Pass': '#3b82f6', // blue
  'Economy Car': '#a78bfa', // purple
  'Business Fleet': '#f59e42', // orange
  'Personal EV': '#eab308', // yellow
  'Luxury Fleet': '#f43f5e', // red
  'Corporate Mobility Hub': '#06b6d4', // cyan
};

// Update ReferralNode interface to match backend (id: number)
interface ReferralNode {
  referredUser: {
    id: number;
    name: string;
    email: string;
    created_at?: string;
    parent_leg?: 'left' | 'right';
  };
  sub_referrals: ReferralNode[];
}

const ReferralTree: React.FC<{ nodes: ReferralNode[]; level?: number }> = ({ nodes, level = 0 }) => (
  <ul className={`pl-${level * 4} border-l-2 border-gray-200 ml-2`}>
    {nodes.map((node) => (
      <li key={node.referredUser.id} className="relative mb-4">
        <div className={`flex items-center gap-2 py-1 px-2 rounded ${level === 0 ? 'bg-blue-50' : 'bg-green-50'}`}>
          <FaUserFriends className="text-blue-500" />
          <span className="font-semibold">{node.referredUser.name}</span>
          <span className="text-xs text-gray-500">(Level {level + 1})</span>
          <span className="ml-2 text-gray-400">{node.referredUser.email}</span>
        </div>
        {node.sub_referrals && node.sub_referrals.length > 0 && (
          <ReferralTree nodes={node.sub_referrals} level={level + 1} />
        )}
      </li>
    ))}
  </ul>
);

const Dashboard = () => {
  const { user, user_base_data, isLoading, confirmUpdateWithdrawal, isAuthenticated } = useAuth();
  const dispatch = useDispatch<AppDispatch>();
  const [exchangeModalOpen, setExchangeModalOpen] = useState(false);
  const [exchangeAmount, setExchangeAmount] = useState('');
  const [exchangeError, setExchangeError] = useState('');
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawError, setWithdrawError] = useState('');
  const adminSettings = useSelector((state: RootState) => state.adminData.admin_settings);
  const minWithdrawalSetting = adminSettings.find(s => s.title === 'min_withdrawal');
  const maxWithdrawalSetting = adminSettings.find(s => s.title === 'max_withdrawal');
  const minWithdrawal = minWithdrawalSetting ? Number(minWithdrawalSetting.value) : 0;
  const maxWithdrawal = maxWithdrawalSetting ? Number(maxWithdrawalSetting.value) : Number.POSITIVE_INFINITY;

  function sendExchangeRequest(amount: number) {
    dispatch(authApi.exchangeRequest(amount))
  }
  function sendWithdrawRequest(amount: number) {
    dispatch(authApi.withdrawRequest(amount))
  }

  const { id, name, email, referral_code, is_admin, phone, wallet_address, egd_balance, withdrawals, referred_by, parent_leg, left_volume, right_volume, rank_goal, created_at } = user

  // Staking summary
  const stakingSummary = user_base_data?.recent_Stakings || [];
  const stakingStats = getStakingStats(stakingSummary);
  const referralNetwork = user_base_data?.referral_network || [];

  function flattenReferralNetwork(nodes: ReferralNode[], level = 1, result: any[] = []) {
    nodes.forEach(node => {
      result.push({ ...node.referredUser, level });
      if (Array.isArray(node.sub_referrals) && node.sub_referrals.length > 0) {
        flattenReferralNetwork(node.sub_referrals, level + 1, result);
      }
    });
    return result;
  }
  const allReferrals = flattenReferralNetwork(referralNetwork);
  const totalReferralCount = allReferrals.length;
  const referralsByLevel = allReferrals.reduce((acc: Record<number, any[]>, user) => {
    acc[user.level] = acc[user.level] || [];
    acc[user.level].push(user);
    return acc;
  }, {});

  // Transactions
  const recentTransactions = user_base_data?.recent_transactions || [];

  // Helper for transaction status
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <FaCheckCircle className="text-green-500" />;
      case 'pending':
        return <FaClock className="text-yellow-500" />;
      case 'failed':
        return <FaExclamationTriangle className="text-red-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (isAuthenticated &&
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Welcome Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {name}!
          </h1>
          <p className="text-gray-600 mt-2">
            Here's your GreenDash overview
          </p>
        </motion.div>

        {/* Balance Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">EGD Balance</CardTitle>
              <FaCoins className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(egd_balance).toFixed(2)} EGD</div>
              <p className="text-xs text-muted-foreground">
                ≈ {(Number(egd_balance) * 0.01).toLocaleString(undefined, { style: 'currency', currency: 'USD' })}
              </p>
              <Button className="mt-3 w-full bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setExchangeModalOpen(true)}>
                Convert to USDT
              </Button>
              <Dialog open={exchangeModalOpen} onOpenChange={setExchangeModalOpen}>
                <DialogContent className="max-w-sm">
                  <DialogHeader>
                    <DialogTitle>Convert EGD to USDT</DialogTitle>
                  </DialogHeader>
                  <div className="mb-2">
                    <label htmlFor="exchange-amount" className="block text-sm font-medium text-gray-700 mb-1">Amount of EGD</label>
                    <Input
                      id="exchange-amount"
                      type="number"
                      min="0"
                      step="any"
                      value={exchangeAmount}
                      onChange={e => {
                        setExchangeAmount(e.target.value);
                        setExchangeError('');
                      }}
                      placeholder="Enter amount"
                      className="w-full"
                    />
                    {exchangeError && <div className="text-red-600 text-xs mt-1">{exchangeError}</div>}
                  </div>
                  <DialogFooter className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setExchangeModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                      onClick={() => {
                        const amount = Number(exchangeAmount);
                        if (!exchangeAmount || isNaN(amount) || amount <= 0) {
                          setExchangeError('Please enter a valid amount.');
                          return;
                        }
                        if (amount > Number(egd_balance)) {
                          setExchangeError('Amount exceeds available EGD balance.');
                          return;
                        }
                        setExchangeModalOpen(false);
                        sendExchangeRequest(amount);
                      }}
                    >
                      Exchange
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Withdrawals</CardTitle>
              <FaArrowDown className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{withdrawals} USDT</div>
              <p className="text-xs text-muted-foreground">
                Total withdrawn
              </p>
              <Button className="mt-3 w-full bg-green-600 hover:bg-green-700 text-white" onClick={() => setWithdrawModalOpen(true)}>
                Withdraw now
              </Button>
              <Dialog open={withdrawModalOpen} onOpenChange={setWithdrawModalOpen}>
                <DialogContent className="max-w-sm">
                  <DialogHeader>
                    <DialogTitle>Withdraw USDT</DialogTitle>
                  </DialogHeader>
                  <div className="mb-2">
                    <label htmlFor="withdraw-amount" className="block text-sm font-medium text-gray-700 mb-1">Amount of USDT</label>
                    <Input
                      id="withdraw-amount"
                      type="number"
                      min="0"
                      step="any"
                      value={withdrawAmount}
                      onChange={e => {
                        setWithdrawAmount(e.target.value);
                        setWithdrawError('');
                      }}
                      placeholder="Enter amount"
                      className="w-full"
                    />
                    {withdrawError && <div className="text-red-600 text-xs mt-1">{withdrawError}</div>}
                  </div>
                  <DialogFooter className="flex gap-2 justify-end">
                    <Button variant="outline" onClick={() => setWithdrawModalOpen(false)}>
                      Cancel
                    </Button>
                    <Button
                      className="bg-green-600 hover:bg-green-700 text-white"
                      onClick={() => {
                        const amount = Number(withdrawAmount);
                        if (!withdrawAmount || isNaN(amount) || amount <= 0) {
                          setWithdrawError('Please enter a valid amount.');
                          return;
                        }
                        if (amount > Number(withdrawals)) {
                          setWithdrawError('Amount exceeds available USDT balance.');
                          return;
                        }
                        if (amount < minWithdrawal) {
                          setWithdrawError(`Amount is below the minimum withdrawal amount (${minWithdrawal}).`);
                          return;
                        }
                        if (amount > maxWithdrawal) {
                          setWithdrawError(`Amount exceeds the maximum withdrawal amount (${maxWithdrawal}).`);
                          return;
                        }
                        setWithdrawModalOpen(false);
                        sendWithdrawRequest(amount);
                      }}
                    >
                      Withdraw
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Staked</CardTitle>
              <FaLock className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stakingStats.total_staking_amount} EGD</div>
              <p className="text-xs text-muted-foreground">
                Across {stakingSummary?.length || 0} stakings
              </p>
              <div className="flex gap-3 mt-2 bg-gray-50 border border-gray-200 rounded px-3 py-2 items-center">
                <span className="flex items-center gap-1 text-green-700 font-semibold text-xs">
                  <FaBolt className="w-4 h-4 text-green-500" />
                  <span className="bg-green-100 text-green-700 rounded-full px-2 py-0.5 font-bold ml-1">Active: {stakingStats.active_staking_number}</span>
                </span>
                <span className="flex items-center gap-1 text-blue-700 font-semibold text-xs">
                  <FaCheckCircle className="w-4 h-4 text-blue-500" />
                  <span className="bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 font-bold ml-1">Completed: {stakingStats.completed_staking_number}</span>
                </span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Staking Amount</CardTitle>
              <FaBolt className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{stakingStats.active_staking_amount} EGD</div>
              <p className="text-xs text-muted-foreground">
                Currently Staking Amount
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="staking">Staking</TabsTrigger>
              <TabsTrigger value="referrals">Referrals</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Account Status */}
                <Card>
                  <CardHeader>
                    <CardTitle>Account Status</CardTitle>
                    <CardDescription>Your account information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Wallet Connected</span>
                      <Badge variant={wallet_address ? "default" : "secondary"}>
                        {wallet_address ? "Connected" : "Not Connected"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Referral Code</span>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {referral_code}
                      </code>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium">Admin</span>
                      <Badge variant={is_admin ? "default" : "secondary"}>
                        {is_admin ? "Yes" : "No"}
                      </Badge>
                    </div>
                    {/* Enhanced User Info Block */}
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3">
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-blue-500" />
                        <span className="font-medium text-gray-600">Email:</span>
                        <span className="ml-auto text-gray-900">{email}</span>
                      </div>
                      {phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-green-500" />
                          <span className="font-medium text-gray-600">Phone:</span>
                          <span className="ml-auto text-gray-900">{phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-purple-500" />
                        <span className="font-medium text-gray-600">Registered:</span>
                        <span className="ml-auto text-gray-900">{created_at ? format(new Date(created_at), 'yyyy-MM-dd') : '-'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ArrowLeftRight className="w-4 h-4 text-orange-500" />
                        <span className="font-medium text-gray-600">Parent Leg:</span>
                        <span className="ml-auto text-gray-900 capitalize">{parent_leg}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-gray-600">Left Volume:</span>
                        <span className="ml-auto text-gray-900">{left_volume}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-pink-600" />
                        <span className="font-medium text-gray-600">Right Volume:</span>
                        <span className="ml-auto text-gray-900">{right_volume}</span>
                      </div>
                      <div className="flex items-center gap-2 md:col-span-2">
                        <UserPlus className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-600">Referred By:</span>
                        <span className="ml-auto text-gray-900">{referred_by ?? '-'}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                {/* Staking and Rewards Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Staking & Rewards</CardTitle>
                    <CardDescription>Your staking performance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total Count of Staking</span>
                      <span className="font-semibold">{stakingSummary?.length || 0} times</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total Staked</span>
                      <span className="font-semibold">{stakingStats.total_staking_amount} EGD</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total Rewards Claimed</span>
                      <span className="font-semibold text-yellow-700 bg-yellow-100 rounded px-2 py-1 mr-2" title="Total rewards you have claimed from active staking packages.">
                        {stakingStats.earned_from_active.toLocaleString()} EGD
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Staking Tab */}
            <TabsContent value="staking" className="space-y-6">
              {stakingSummary?.length > 0 ? (
                <div className="space-y-4">
                  {stakingSummary.map((staking) => {
                    const stakingProgress = stakingStats.staking_progress.find(p => p.id === staking.id);
                    const startDate = parseISO(staking.createdAt);
                    const nowDate = Date.now();
                    const lockDays = staking.package?.lock_period_days || 0;
                    const endDate = addDays(startDate, lockDays);
                    const totalPeriod = differenceInDays(endDate, startDate);
                    const elapsed = Math.min(differenceInDays(nowDate, startDate), totalPeriod);
                    const percent = totalPeriod > 0 ? (elapsed / totalPeriod) * 100 : 0;
                    const barColor = packageColorMap[staking.package?.name || ''] || '#22c55e';
                    return (
                      <Card key={staking.id}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h3 className="font-semibold">{staking.package?.name || 'Staking Package'}</h3>
                              <p className="text-sm text-muted-foreground">
                                Started {formatDate(staking.createdAt)}
                              </p>
                            </div>
                            <Badge variant={staking.status === 'active' ? 'default' : 'secondary'}>
                              {staking.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Staked Amount</p>
                              <p className="font-semibold">{parseFloat(staking.package.stake_amount)} EGD</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Daily Yield</p>
                              <p className="font-semibold">{staking.package?.daily_yield_percentage}%</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Lock Period</p>
                              <p className="font-semibold">{staking.package?.lock_period_days} days</p>
                            </div>
                            <div>
                              <p className="text-sm text-muted-foreground">Status</p>
                              <p className="font-semibold">{staking.status}</p>
                            </div>
                          </div>
                          {/* Progress Bar with Dates */}
                          <div className="mb-2 flex items-center justify-between text-xs font-medium text-gray-500">
                            <span>{formatDateFns(startDate, 'yyyy-MM-dd')}</span>
                            <span>{formatDateFns(endDate, 'yyyy-MM-dd')}</span>
                          </div>
                          <div className="relative h-4 rounded-full bg-gray-200 overflow-hidden mb-2">
                            <div
                              className="absolute top-0 left-0 h-4 rounded-full"
                              style={{ width: `${percent}%`, background: barColor, transition: 'width 0.5s' }}
                            ></div>
                            {/* Marker for today */}
                            <div
                              className="absolute top-0 h-4 w-1 bg-blue-600"
                              style={{ left: `${percent}%`, transition: 'left 0.5s' }}
                            ></div>
                          </div>
                          <div className="flex justify-between text-xs text-gray-400">
                            <span>Start</span>
                            <span>End</span>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <FaChartLine className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Stakings</h3>
                    <p className="text-muted-foreground mb-4">
                      Start your first staking to earn daily rewards
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Referrals Tab */}
            <TabsContent value="referrals" className="space-y-12 w-full">
              <Card>
                <CardHeader>
                  <CardTitle>Referral Network</CardTitle>
                  <CardDescription>Your direct and indirect referrals</CardDescription>
                </CardHeader>
                <CardContent className='w-full'>
                  <div className="mb-4">
                    <span className="font-semibold">Total Referral Count: </span>
                    <span className='text-[30px] m-3 text-green-600 font-bold'> {totalReferralCount} </span>
                    users
                  </div>
                  <div className="flex flex-wrap gap-4 mb-4">
                    {Object.entries(referralsByLevel).map(([level, users]) => (
                      <div
                        key={level}
                        className="flex items-center gap-2 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg px-4 py-2 shadow-sm border border-green-200"
                      >
                        <span className="font-semibold text-green-700 text-sm">
                          Level {level}:
                        </span>
                        <span className="inline-block bg-green-100 text-green-700 rounded-full px-3 py-1 text-xs font-bold">
                          {(users as any[]).length} users
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="overflow-x-auto mt-6">
                    <ReferralTree nodes={referralNetwork} />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Recent Activity Tab */}
            <TabsContent value="activity" className="space-y-6">
              {recentTransactions.length > 0 ? (
                <div className="space-y-4">
                  {recentTransactions.map((activity) => (
                    <Card key={activity.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(activity.type)}
                            <div>
                              <p className="font-medium">{activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(activity.created_at)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              +{formatNumber(activity.amount)} {['withdrawal', 'weak_leg_bonus', 'unilevel_commission'].includes(activity.type) ? 'USDT' : 'EGD'}
                            </p>
                            <Badge className={getStatusColor(activity.type)}>
                              {activity.type}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <FaChartLine className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Recent Activity</h3>
                    <p className="text-muted-foreground">
                      Your transaction history will appear here
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
      {user_base_data?.recent_withdrawals?.length > 0 && (
        <NotificationBanner
          notes={user_base_data.recent_withdrawals}
          onClose={() => confirmUpdateWithdrawal(user.id)}
        />
      )}
    </div>
  );
};

export default Dashboard;
