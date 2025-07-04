import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { USDT_ABI, USDT_ADDRESS } from '@/lib/usdt_abi';
import {
  FaLock,
  FaUnlock,
  FaChartLine,
  FaCoins,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaExclamationTriangle,
  FaArrowUp,
  FaArrowDown,
  FaPlus,
  FaWallet,
  FaCalculator,
  FaInfoCircle
} from 'react-icons/fa';
import { motion, number } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useStaking } from '@/hooks/useStaking';
import { api } from '@/lib/api';
import { formatCurrency, formatNumber, formatDate } from '@/lib/utils';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { StakingPackage } from '@/types/staking';
import { useWallet } from '@/hooks/WalletContext';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';

interface UserStaking {
  id: number;
  user_id: number;
  package_id: number;
  package?: StakingPackage;
  stake_amount: number;
  daily_reward_amount: number;
  total_rewards_earned: number;
  start_date: string;
  unlock_date: string;
  status: string;
  completion_percentage: number;
  days_remaining: number;
  created_at: string;
}


const Staking = () => {
  const { user } = useAuth();
  const { getStakingPackages, getUserStakings, userStakings, isLoading: stakingLoading } = useStaking();
  const packages = useSelector((store: RootState) => store.staking.packages)
  const token_price = useSelector((store: RootState) => store.admin)?.find(item => item.title === "token_price")?.value
  const PLATFORM_RECEIVER = useSelector((store: RootState) => store.admin)?.find(item => item.title === "platform_address")?.value
  const EGD_ADDRESS = useSelector((store: RootState) => store.admin)?.find(item => item.title === "egd_token_address")?.value
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState<StakingPackage | null>(null);
  const [stakeAmount, setStakeAmount] = useState('');
  const [isStaking, setIsStaking] = useState(false);
  const [showStakeDialog, setShowStakeDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('packages');
  const { connectWallet, isConnected } = useWallet();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);

        // Fetch user stakings
        await getStakingPackages();
        await getUserStakings();
      } catch (error) {
        console.error('Failed to fetch staking data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleStartStaking = async () => {
    if (!isConnected) {
      await connectWallet();
      return;
    }
    if (!selectedPackage || !stakeAmount) return;

    try {
      setIsStaking(true);
      // 1. Connect to wallet and USDT contract
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await web3Provider.getSigner();
      const usdt = new ethers.Contract(USDT_ADDRESS, USDT_ABI, signer);
      const decimals = await usdt.decimals();
      const amount = ethers.parseUnits(calculateUSDT_amount(token_price, stakeAmount).toString(), decimals);
      // 2. Send USDT transfer
      const tx = await usdt.transfer(PLATFORM_RECEIVER, amount);
      toast.warn('Waiting for USDT transaction confirmation...');
      const receipt = await tx.wait();
      toast.success('USDT payment sent!');
      // 3. Send staking request to backend with tx hash
      const response = await api.post<{ success: boolean; data: UserStaking }>(
        '/staking/create',
        {
          package_id: selectedPackage.id,
          stake_amount: stakeAmount,
          payment_tx_hash: 'receipt.hash'
        }
      );

      if (response.success) {
        setShowStakeDialog(false);
        setStakeAmount('');
        setSelectedPackage(null);

        // Refresh user stakings
        await getUserStakings();

        alert('Staking started successfully!');
      }
    } catch (err: any) {
      toast.error(err?.message || 'USDT payment or staking failed.');
    } finally {
      setIsStaking(false);
    }
  };

  const calculateDailyReward = (amount: string, rate: string) => {
    return (parseFloat(amount) * parseFloat(rate)) / 100;
  };

  const calculateUSDT_amount = (amount: string, rate: string) => {
    return Number(amount) * Number(rate);
  };

  const calculateTotalReward = (amount: string, rate: string, days: number) => {
    return (parseFloat(amount) * parseFloat(rate) * days) / 100;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading staking data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Staking</h1>
          <p className="text-gray-600 mt-2">
            Lock your tokens and earn daily rewards
          </p>
        </motion.div>

        {/* Balance Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available USDT</CardTitle>
              <FaWallet className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user?.usdt_balance || 0}</div>
              <p className="text-xs text-muted-foreground">
                Available for staking
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Stakings</CardTitle>
              <FaLock className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStakings.length}</div>
              <p className="text-xs text-muted-foreground">
                Currently locked
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
              <FaArrowUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(userStakings.reduce((sum, staking) => sum + parseFloat(staking.total_rewards_earned), 0))} EGD
              </div>
              <p className="text-xs text-muted-foreground">
                From all stakings
              </p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="packages">Staking Packages</TabsTrigger>
              <TabsTrigger value="my-stakings">My Stakings</TabsTrigger>
            </TabsList>

            <TabsContent value="packages" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {packages.length > 0 && packages.map((pkg) => (
                  <Card key={pkg.id} className="relative">
                    {!pkg.is_active && (
                      <div className="absolute inset-0 bg-gray-900 bg-opacity-50 rounded-lg flex items-center justify-center z-10">
                        <Badge variant="secondary">Coming Soon</Badge>
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {pkg.name}
                        <Badge variant={pkg.is_active ? "default" : "secondary"}>
                          {pkg.is_active ? "Active" : "Inactive"}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{pkg.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Daily Reward</p>
                          <p className="font-semibold text-green-600">{Number(pkg.daily_yield_percentage)}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Lock Period</p>
                          <p className="font-semibold">{pkg.lock_period_days} days</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Min Amount</p>
                          <p className="font-semibold">{parseFloat(pkg.min_stake_amount)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Max Amount</p>
                          <p className="font-semibold">{parseFloat(pkg.max_stake_amount)}</p>
                        </div>
                      </div>

                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <FaCalculator className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-medium">Example {parseFloat(pkg.min_stake_amount)} EGD</span>
                        </div>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span>Daily Reward:</span>
                            <span className="font-medium">
                              {formatNumber(calculateDailyReward(pkg.min_stake_amount, pkg.daily_yield_percentage))} EGD
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Reward:</span>
                            <span className="font-medium">
                              {formatNumber(calculateTotalReward(pkg.min_stake_amount, pkg.daily_yield_percentage, pkg.lock_period_days))} EGD
                            </span>
                          </div>
                        </div>
                      </div>

                      <Dialog open={showStakeDialog && selectedPackage?.id === pkg.id} onOpenChange={setShowStakeDialog}>
                        <DialogTrigger asChild>
                          <Button
                            className="w-full"
                            onClick={() => setSelectedPackage(pkg)}
                            disabled={!pkg.is_active}
                          >
                            <FaPlus className="mr-2 h-4 w-4" />
                            Start Staking
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Start Staking - {pkg.name}</DialogTitle>
                            <DialogDescription>
                              Lock your USDT for {pkg.lock_period_days} days and earn {pkg.daily_yield_percentage}% daily rewards
                            </DialogDescription>
                          </DialogHeader>

                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="amount">Stake Amount (USDT): {calculateUSDT_amount(token_price, stakeAmount)}</Label>
                              <Input
                                id="amount"
                                type="number"
                                placeholder={`Enter amount between ${parseFloat(pkg.min_stake_amount)} - ${parseFloat(pkg.max_stake_amount)}`}
                                value={stakeAmount}
                                onChange={(e) => setStakeAmount(e.target.value)}
                                min={pkg.min_stake_amount}
                                max={pkg.max_stake_amount}
                              />
                            </div>

                            {stakeAmount && (
                              <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                                <h4 className="font-medium">Reward Calculation</h4>
                                <div className="space-y-2 text-sm">
                                  <div className="flex justify-between">
                                    <span>Daily Reward:</span>
                                    <span className="font-medium">
                                      {formatNumber(calculateDailyReward(stakeAmount, pkg.daily_yield_percentage))} EGD
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Total Reward:</span>
                                    <span className="font-medium">
                                      {formatNumber(calculateTotalReward(stakeAmount, pkg.daily_yield_percentage, pkg.lock_period_days))} EGD
                                    </span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Unlock Date:</span>
                                    <span className="font-medium">
                                      {formatDate(new Date(Date.now() + pkg.lock_period_days * 24 * 60 * 60 * 1000).toISOString())}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            )}

                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                              <div className="flex items-start gap-2">
                                <FaInfoCircle className="h-4 w-4 text-yellow-600 mt-0.5" />
                                <div className="text-sm text-yellow-800">
                                  <p className="font-medium">Important:</p>
                                  <ul className="mt-1 space-y-1">
                                    <li>• Your tokens will be locked for {pkg.lock_period_days} days</li>
                                    <li>• Daily rewards are paid in EGD tokens</li>
                                    <li>• Early withdrawal is not possible</li>
                                    <li>• Rewards are automatically calculated and credited</li>
                                  </ul>
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-3">
                              <Button
                                onClick={handleStartStaking}
                                disabled={isStaking || !stakeAmount}
                                className="flex-1"
                              >
                                {isStaking ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Starting...
                                  </>
                                ) : (
                                  'Confirm Staking'
                                )}
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => setShowStakeDialog(false)}
                                disabled={isStaking}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="my-stakings" className="space-y-6">
              {stakingLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading your stakings...</p>
                </div>
              ) : userStakings.length > 0 ? (
                <div className="space-y-6">
                  {userStakings.map((staking) => (
                    <Card key={staking.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-semibold">{staking.package?.name || 'Staking Package'}</h3>
                            <p className="text-sm text-muted-foreground">
                              Started {formatDate(staking.start_date)}
                            </p>
                          </div>
                          <Badge className={getStatusColor(staking.status)}>
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
                            <p className="font-semibold text-green-600">{parseFloat(staking.total_rewards_earned)} EGD</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground">Progress</p>
                            <p className="font-semibold">{parseFloat(staking.completion_percentage).toFixed(1)}%</p>
                          </div>
                        </div>

                        <Progress value={parseFloat(staking.completion_percentage)} className="mb-4" />

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <FaCalendarAlt className="h-4 w-4 text-gray-500" />
                            <span>Unlock Date: {formatDate(staking.unlock_date)}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaClock className="h-4 w-4 text-gray-500" />
                            <span>{staking.days_remaining} days remaining</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <FaChartLine className="h-4 w-4 text-gray-500" />
                            <span>Daily Rate: {staking.package?.daily_yield_percentage}%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <FaLock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No Active Stakings</h3>
                    <p className="text-muted-foreground mb-4">
                      Start your first staking to earn daily rewards
                    </p>
                    <Button onClick={() => setActiveTab('packages')}>
                      <FaPlus className="mr-2 h-4 w-4" />
                      View Packages
                    </Button>
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

export default Staking;
