import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  FaWallet,
  FaChartLine,
  FaUsers,
  FaCoins,
  FaLock,
  FaUnlock,
  FaArrowUp,
  FaArrowDown,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle
} from 'react-icons/fa';
import { motion, number } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useStaking } from '@/hooks/useStaking';
import { api } from '@/lib/api';
import { formatCurrency, formatNumber, formatDate } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { setLoading } from '@/store/auth';
import { useDispatch } from 'react-redux';

const Dashboard = () => {
  const { user, isAuthenticated, user_base_data, isLoading } = useAuth();
  const { userStakings, isLoading: stakingLoading } = useStaking();

  const nav = useNavigate()
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(setLoading(!user_base_data))
  }, [user_base_data]);

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
            Welcome back, {user?.first_name}!
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
              <div className="text-2xl font-bold">{(user?.egd_balance || 0)} EGD</div>
              <p className="text-xs text-muted-foreground">
                ≈ {(Number(user?.egd_balance || 0) * 0.01)} USD
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">USDT Balance</CardTitle>
              <FaWallet className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Number(user?.usdt_balance || 0)}</div>
              <p className="text-xs text-muted-foreground">
                Available for staking
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
              <FaChartLine className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Number(user?.total_invested || 0)}</div>
              <p className="text-xs text-muted-foreground">
                Lifetime investment
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
              <FaArrowUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Number(user?.total_earned || 0)}</div>
              <p className="text-xs text-muted-foreground">
                Lifetime earnings
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Stats Overview */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FaLock className="h-5 w-5 text-green-600" />
                  Active Stakings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.active_stakings}</div>
                <p className="text-sm text-muted-foreground">
                  Total staked: {formatCurrency(stats.total_staked)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FaUsers className="h-5 w-5 text-blue-600" />
                  Referral Network
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.total_referrals}</div>
                <p className="text-sm text-muted-foreground">
                  Earnings: {formatCurrency(stats.referral_earnings)}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FaArrowDown className="h-5 w-5 text-orange-600" />
                  Pending Withdrawals
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{stats.pending_withdrawals}</div>
                <p className="text-sm text-muted-foreground">
                  Awaiting approval
                </p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="staking">Staking</TabsTrigger>
              <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Manage your GreenDash account</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full" onClick={() => nav('/staking')}>
                      <FaChartLine className="mr-2 h-4 w-4" />
                      Start Staking
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => nav('/affiliates')}>
                      <FaUsers className="mr-2 h-4 w-4" />
                      View Referrals
                    </Button>
                    <Button variant="outline" className="w-full" onClick={() => nav('/profile')}>
                      <FaWallet className="mr-2 h-4 w-4" />
                      Update Profile
                    </Button>
                  </CardContent>
                </Card>

                {/* Account Status */}
                <Card>
                  <CardHeader>
                    <CardTitle>Account Status</CardTitle>
                    <CardDescription>Your account information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Email Verification</span>
                      <Badge variant={user?.is_email_verified ? "default" : "destructive"}>
                        {user?.is_email_verified ? "Verified" : "Pending"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Wallet Connected</span>
                      <Badge variant={user?.wallet_address ? "default" : "secondary"}>
                        {user?.wallet_address ? "Connected" : "Not Connected"}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Referral Code</span>
                      <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                        {user?.referral_code}
                      </code>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Member Since</span>
                      <span className="text-sm text-muted-foreground">
                        {(user?.createdAt || '')}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="staking" className="space-y-6">
              {stakingLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading staking data...</p>
                </div>
              ) : userStakings.length > 0 ? (
                <div className="space-y-4">
                  {userStakings.slice(0, 5).map((staking) => (
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
                            <p className="text-sm text-muted-foreground">Daily Reward</p>
                            <p className="font-semibold">{parseFloat(staking.daily_reward_amount)} EGD</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Total Earned</p>
                            <p className="font-semibold">{parseFloat(staking.total_rewards_earned)} EGD</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Progress</p>
                            <p className="font-semibold">{parseFloat(staking.completion_percentage).toFixed(1)}%</p>
                          </div>
                        </div>

                        <Progress value={parseFloat(staking.completion_percentage)} className="mb-4" />

                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>Unlock Date: {formatDate(staking.unlock_date)}</span>
                          <span>{staking.days_remaining} days remaining</span>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {userStakings.length > 5 && (
                    <div className="text-center">
                      <Button variant="outline" onClick={() => nav('/staking')}>
                        View All Stakings
                      </Button>
                    </div>
                  )}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <FaChartLine className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Active Stakings</h3>
                    <p className="text-muted-foreground mb-4">
                      Start your first staking to earn daily rewards
                    </p>
                    <Button onClick={() => nav('/staking')}>
                      Start Staking
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              {recentActivity.length > 0 ? (
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <Card key={activity.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(activity.status)}
                            <div>
                              <p className="font-medium">{activity.description}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(activity.created_at)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              {activity.amount > 0 ? '+' : ''}{formatNumber(activity.amount)} {activity.currency}
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
