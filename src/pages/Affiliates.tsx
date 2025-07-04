import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  FaUsers, 
  FaShareAlt, 
  FaCopy, 
  FaCoins, 
  FaArrowUp,
  FaArrowDown,
  FaLink,
  FaCheckCircle,
  FaExclamationTriangle,
  FaQrcode,
  FaNetworkWired,
  FaChartLine,
  FaUserPlus,
  FaGift
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { formatNumber, formatDate } from '@/lib/utils';
import {
  ReferralTreeResponse,
  ReferralEntry,
  ReferralRewardsResponse,
  ReferralRewardTransaction,
} from '@/types/referral';

const Affiliates = () => {
  const { user } = useAuth();
  const [tree, setTree] = useState<ReferralTreeResponse | null>(null);
  const [rewards, setRewards] = useState<ReferralRewardTransaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [tab, setTab] = useState<'overview' | 'referrals' | 'earnings'>('overview');

  useEffect(() => {
    const fetchReferralData = async () => {
      try {
        setIsLoading(true);
        // Fetch referral tree
        const treeRes = await api.get<{ success: boolean; data?: ReferralTreeResponse }>('/referrals/referral-tree');
        if (treeRes.success && treeRes.data) {
          setTree(treeRes.data);
        } else {
          setTree(null);
        }
        // Fetch referral rewards
        const rewardsRes = await api.get<{ success: boolean; data?: ReferralRewardsResponse }>('/referrals/referral-rewards');
        if (
          rewardsRes.success &&
          rewardsRes.data &&
          rewardsRes.data.data &&
          Array.isArray(rewardsRes.data.data.transactions)
        ) {
          setRewards(rewardsRes.data.data.transactions);
        } else {
          setRewards([]);
        }
      } catch (error) {
        console.error('Failed to fetch referral data:', error);
        setTree(null);
        setRewards([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReferralData();
  }, []);

  const copyReferralLink = async () => {
    const referralLink = `${window.location.origin}/register?ref=${user?.referral_code}`;
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy referral link:', error);
    }
  };

  const copyReferralCode = async () => {
    try {
      await navigator.clipboard.writeText(user?.referral_code || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy referral code:', error);
    }
  };

  const getLevelColor = (level: number) => {
    const colors = [
      'bg-green-100 text-green-800',
      'bg-blue-100 text-blue-800',
      'bg-purple-100 text-purple-800',
      'bg-orange-100 text-orange-800',
      'bg-red-100 text-red-800'
    ];
    return colors[level - 1] || 'bg-gray-100 text-gray-800';
  };

  const getCommissionRate = (level: number) => {
    const rates = [5, 3, 2, 1, 0.5];
    return rates[level - 1] || 0;
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading referral data...</p>
        </div>
      </div>
    );
  }

  const overall = tree?.overall || { total_referrals: 0, total_invested: 0, total_earnings: 0 };
  const byLevel = tree?.by_level || {};
  const recentReferrals = tree?.recent_referrals || [];
  const safeRewards = Array.isArray(rewards) ? rewards : [];

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Affiliate Program</h1>
          <p className="text-gray-600 mt-2">
            Build your network and earn rewards up to 5 levels deep
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Referrals</CardTitle>
              <FaUsers className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overall?.total_referrals || 0}</div>
              <p className="text-xs text-muted-foreground">
                Across all levels
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
              <FaCoins className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{overall?.total_earnings || 0}</div>
              <p className="text-xs text-muted-foreground">
                Lifetime earnings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
              <FaNetworkWired className="h-4 w-4 text-purple-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {overall?.total_invested || 0}
              </div>
              <p className="text-xs text-muted-foreground">
                By your network
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Referral Code</CardTitle>
              <FaQrcode className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold font-mono">{user?.referral_code}</div>
              <p className="text-xs text-muted-foreground">
                Your unique code
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Referral Link Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FaShareAlt className="h-5 w-5 text-green-600" />
                Share Your Referral Link
              </CardTitle>
              <CardDescription>
                Invite friends and earn rewards when they join and stake
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={`${window.location.origin}/register?ref=${user?.referral_code}`}
                  readOnly
                  className="flex-1"
                />
                <Button onClick={copyReferralLink} variant="outline">
                  {copied ? (
                    <>
                      <FaCheckCircle className="mr-2 h-4 w-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <FaCopy className="mr-2 h-4 w-4" />
                      Copy Link
                    </>
                  )}
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <FaUserPlus className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-green-800">Level 1</h3>
                  <p className="text-sm text-green-600">5% Commission</p>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <FaUsers className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-blue-800">Level 2</h3>
                  <p className="text-sm text-blue-600">3% Commission</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <FaNetworkWired className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                  <h3 className="font-semibold text-purple-800">Level 3-5</h3>
                  <p className="text-sm text-purple-600">2%, 1%, 0.5%</p>
                </div>
              </div>
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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="referrals">My Referrals</TabsTrigger>
              <TabsTrigger value="earnings">Earnings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Commission Structure */}
                <Card>
                  <CardHeader>
                    <CardTitle>Commission Structure</CardTitle>
                    <CardDescription>Earn rewards from your network</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <div key={level} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <Badge className={getLevelColor(level)}>
                              Level {level}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {level === 1 ? 'Direct referrals' : `Level ${level - 1} referrals`}
                            </span>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-600">{getCommissionRate(level)}%</p>
                            <p className="text-xs text-muted-foreground">
                              {byLevel[level]?.total_earnings ? byLevel[level].total_earnings : '$0'}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Level Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>Network Breakdown</CardTitle>
                    <CardDescription>Your referral network by level</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[1, 2, 3, 4, 5].map((level) => {
                        const count = byLevel[level]?.count || 0;
                        const earnings = byLevel[level]?.total_earnings || 0;
                        return (
                          <div key={level} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <Badge className={getLevelColor(level)}>
                                Level {level}
                              </Badge>
                              <span className="text-sm">{count} users</span>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">{earnings}</p>
                              <p className="text-xs text-muted-foreground">
                                {getCommissionRate(level)}% commission
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="referrals" className="space-y-6">
              {recentReferrals.length > 0 ? (
                <div className="space-y-4">
                  {recentReferrals.map((referral) => (
                    <Card key={referral.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                              <FaUsers className="w-5 h-5 text-gray-600" />
                            </div>
                            <div>
                              <h3 className="font-semibold">
                                {referral.referred.first_name} {referral.referred.last_name}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {referral.referred.email}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getLevelColor(Number(referral.level))}>
                              Level {Number(referral.level)}
                            </Badge>
                            <p className="text-sm text-muted-foreground mt-1">
                              {formatDate(referral.joined_at)}
                            </p>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground">Commission Rate</p>
                            <p className="font-semibold">{referral.commission_rate}%</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Total Earned</p>
                            <p className="font-semibold text-green-600">
                              {parseFloat(referral.total_earned)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">User Investment</p>
                            <p className="font-semibold">
                              {parseFloat(referral.referred.total_invested)}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Status</p>
                            <Badge variant={referral.referred.is_email_verified ? "default" : "secondary"}>
                              {referral.referred.is_email_verified ? "Verified" : "Pending"}
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
                    <FaUsers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Referrals Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start sharing your referral link to build your network
                    </p>
                    <Button onClick={copyReferralLink}>
                      <FaShareAlt className="mr-2 h-4 w-4" />
                      Share Referral Link
                    </Button>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="earnings" className="space-y-6">
              {safeRewards.length > 0 ? (
                <div className="space-y-4">
                  {safeRewards.map((earning) => (
                    <Card key={earning.id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <FaGift className="h-5 w-5 text-green-600" />
                            <div>
                              <p className="font-medium">{earning.description}</p>
                              <p className="text-sm text-muted-foreground">
                                {formatDate(earning.createdAt)}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-600">
                              +{parseFloat(earning.amount)}
                            </p>
                            <Badge className={getLevelColor(Number(earning.metadata?.referral_level || 1))}>
                              Level {Number(earning.metadata?.referral_level || 1)}
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
                    <FaGift className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Earnings Yet</h3>
                    <p className="text-muted-foreground">
                      Your referral earnings will appear here
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

export default Affiliates;
