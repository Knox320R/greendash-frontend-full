import { useEffect } from 'react';
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
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency, formatNumber, formatDate } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { setLoading } from '@/store/auth';
import { useDispatch } from 'react-redux';
import { addDays, format as formatDateFns, differenceInDays, parseISO } from 'date-fns';
import { format } from 'date-fns';
import { Mail, Phone, Calendar, Users, ArrowLeftRight, UserPlus } from 'lucide-react';

const packageColorMap: Record<string, string> = {
  'Daily Ride': '#22c55e', // green
  'Weekly Pass': '#3b82f6', // blue
  'Economy Car': '#a78bfa', // purple
  'Business Fleet': '#f59e42', // orange
  'Personal EV': '#eab308', // yellow
  'Luxury Fleet': '#f43f5e', // red
  'Corporate Mobility Hub': '#06b6d4', // cyan
};

const ReferralTree = ({ nodes, level = 0 }) => (
  <ul className={`pl-${level * 4} border-l-2 border-gray-300 ml-2`}>
    {nodes.map(node => (
      <li key={node.id} className="relative mb-4">
        <div className={`flex items-center gap-2 py-1 px-2 rounded ${level === 0 ? 'bg-blue-50' : 'bg-green-50'}`}>
          <FaUserFriends className="text-blue-500" />
          <span className="font-semibold">{node.referred_user.name}</span>
          <span className="text-xs text-gray-500">(Level {node.level})</span>
          <span className="ml-2 text-green-600">{node.commission_income} EGD</span>
        </div>
        {node.sub_referrals && node.sub_referrals.length > 0 && (
          <ReferralTree nodes={node.sub_referrals} level={level + 1} />
        )}
      </li>
    ))}
  </ul>
);

const Dashboard = () => {
  const { user, user_base_data, isLoading } = useAuth();
  const nav = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(!user_base_data));
  }, [user_base_data]);

  // Compute stats from user_base_data
  const egdBalance = user?.egd_balance || 0;
  const withdrawals = user?.withdrawals || 0;
  const referralCode = user?.referral_code || '';
  const walletAddress = user?.wallet_address || '';
  const isAdmin = user?.is_admin;
  const name = user?.name || '';
  const email = user?.email || '';
  const phone = user?.phone || '';
  const createdAt = user?.created_at || '';
  const parentLeg = user?.parent_leg || '';
  const leftVolume = user?.left_volune ?? 0;
  const rightVolume = user?.right_volume ?? 0;
  const referredBy = user?.referred_by;

  // Staking summary
  const stakingSummary = user_base_data?.staking;
  const totalStakingCount = stakingSummary?.entire_stakings || 0;
  const totalStaked = stakingSummary?.total_staked || 0;
  const totalRewardsEarned = stakingSummary?.total_rewards_earned || 0;
  const totalRewardsClaimed = stakingSummary?.total_rewards_claimed || 0;
  const entireStakings = stakingSummary?.entire_stakings || 0;
  const stakings = stakingSummary?.stakings || [];

  // Referral summary
  const referralSummary = user_base_data?.referrals;
  const totalEarnFromAffiliation = referralSummary?.total_earn_from_affiliation || 0;
  const eachLevelIncome = referralSummary?.each_level_income || [];
  const eachLevelAffiliaterNumber = referralSummary?.each_level_affiliater_number || [];
  const referralNetwork = referralSummary?.network || [];

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

  // Calculate active staking amount
  const activeStakingAmount = stakings
    .filter((s) => s.status === 'active')
    .reduce((sum, s) => sum + parseFloat(s.stake_amount), 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
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
              <div className="text-2xl font-bold">{egdBalance} EGD</div>
              <p className="text-xs text-muted-foreground">
                ≈ {(Number(egdBalance) * 0.01).toLocaleString(undefined, { style: 'currency', currency: 'USD' })}
              </p>
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
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Staked</CardTitle>
              <FaLock className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStaked} EGD</div>
              <p className="text-xs text-muted-foreground">
                Across {entireStakings} stakings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Staking Amount</CardTitle>
              <FaBolt className="h-4 w-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{activeStakingAmount} EGD</div>
              <p className="text-xs text-muted-foreground">
                Currently Staking Amount
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Referral Earnings</CardTitle>
              <FaUsers className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEarnFromAffiliation} EGD</div>
              <p className="text-xs text-muted-foreground">
                From your network
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
                      <Badge variant={walletAddress ? "default" : "secondary"}>
                        {walletAddress ? "Connected" : "Not Connected"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Referral Code</span>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {referralCode}
                      </code>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm font-medium">Admin</span>
                      <Badge variant={isAdmin ? "default" : "secondary"}>
                        {isAdmin ? "Yes" : "No"}
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
                        <span className="ml-auto text-gray-900">{createdAt ? format(new Date(createdAt), 'yyyy-MM-dd') : '-'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ArrowLeftRight className="w-4 h-4 text-orange-500" />
                        <span className="font-medium text-gray-600">Parent Leg:</span>
                        <span className="ml-auto text-gray-900 capitalize">{parentLeg}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span className="font-medium text-gray-600">Left Volume:</span>
                        <span className="ml-auto text-gray-900">{leftVolume}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-pink-600" />
                        <span className="font-medium text-gray-600">Right Volume:</span>
                        <span className="ml-auto text-gray-900">{rightVolume}</span>
                      </div>
                      <div className="flex items-center gap-2 md:col-span-2">
                        <UserPlus className="w-4 h-4 text-gray-500" />
                        <span className="font-medium text-gray-600">Referred By:</span>
                        <span className="ml-auto text-gray-900">{referredBy ?? '-'}</span>
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
                      <span className="font-semibold">{totalStakingCount} times</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total Staked</span>
                      <span className="font-semibold">{totalStaked} EGD</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total Rewards Earned</span>
                      <span className="font-semibold">{totalRewardsEarned} EGD</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Total Rewards Claimed</span>
                      <span className="font-semibold">{totalRewardsClaimed} EGD</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Staking Tab */}
            <TabsContent value="staking" className="space-y-6">
              {stakings.length > 0 ? (
                <div className="space-y-4">
                  {stakings.map((staking) => {
                    const startDate = parseISO(staking.start_date);
                    const nowDate = parseISO(staking.now);
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
                                Started {formatDate(staking.start_date)}
                              </p>
                            </div>
                            <Badge variant={staking.status === 'active' ? 'default' : 'secondary'}>
                              {staking.status}
                            </Badge>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Staked Amount</p>
                              <p className="font-semibold">{parseFloat(staking.stake_amount)} EGD</p>
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
                    <span className="font-semibold">Total Referral Earnings: </span>
                    <span className='text-[30px] m-3 text-green-600 font-bold'> {totalEarnFromAffiliation} </span>
                    EGD
                  </div>
                  <div className="mb-4 w-full">
                    <span className="font-semibold">Each Level Income: </span>
                    <div className="flex flex-wrap gap-3 mt-2 w-full justify-between">
                      {eachLevelIncome.map((income, idx) => (
                        <div key={idx} className="bg-white shadow rounded-lg px-4 py-2 flex-1 flex flex-col items-center min-w-[120px] border border-gray-200">
                          <span className="text-xs font-bold text-gray-500 mb-1">Level {idx + 1}</span>
                          <span className="text-lg font-bold text-green-600">{income} EGD</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="mb-4">
                    <span className="font-semibold">Each Level Affiliater Number: </span>
                    <div className="flex flex-wrap gap-3 mt-2 mt-2 w-full justify-between">
                      {eachLevelAffiliaterNumber.map((num, idx) => (
                        <div key={idx} className="bg-white shadow rounded-lg px-4 py-2 flex-1 flex flex-col items-center min-w-[120px] border border-gray-200">
                          <span className="text-xs font-bold text-gray-500 mb-1">Level {idx + 1}</span>
                          <span className="text-lg font-bold text-blue-600">{num}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <span className="font-semibold">Network:</span>
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
                            {getStatusIcon(activity.status)}
                            <div>
                              <p className="font-medium">{activity.type.charAt(0).toUpperCase() + activity.type.slice(1)} - {activity.notes}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(activity.created_at)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              {activity.direction === 'in' ? '-' : '+'}{formatNumber(activity.amount)} {activity.currency}
                            </p>
                            <Badge className={getStatusColor(activity.status)}>
                              {activity.status}
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
    </div>
  );
};

export default Dashboard;
