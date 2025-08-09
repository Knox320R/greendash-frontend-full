import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FaLock, FaChartLine, FaCalendarAlt, FaClock, FaCheckCircle, FaArrowUp, FaPlus, FaWallet, FaCalculator, FaCheck } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { formatNumber, formatDate } from '@/lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { StakingPackage } from '@/types/landing';
import { useWallet } from '@/hooks/WalletContext';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';
// import USDT_ABI from "@/lib/usdt_abi.json"; // Replace with your actual ABI/address
import { authApi } from '@/store/auth';
import { getStakingStats } from '@/lib/staking';
import { USDT_ADDRESS, USDT_ABI } from '@/lib/constants';

// Interface for pending staking transaction
interface PendingStaking {
  txHash: string;
  packageId: number;
  userId: number;
  packageName: string;
  amount: string;
  timestamp: number;
}

const Staking = () => {
  const { user, user_base_data } = useAuth();
  const staking_list = user_base_data?.recent_Stakings || [];
  const stakingStats = getStakingStats(staking_list);
  const stakingLoading = false;
  const adminData = useSelector((state: RootState) => state.adminData);
  const stakingPackages = adminData.staking_packages;
  const adminSettings = adminData.admin_settings;
  const tokenPrice = adminSettings.find(s => s.title === 'token_price')?.value || '0.01';
  const platformReceiver = adminSettings.find(s => s.title === 'platform_wallet_address')?.value || "0x000000000000000" // '0x0D80C0513D48579c38e45D60a39D93E7cF87273b';
  const [activeTab, setActiveTab] = useState('packages');
  const [isStaking, setIsStaking] = useState(false);
  const [pendingStaking, setPendingStaking] = useState<PendingStaking | null>(null);
  const { connectWallet, isConnected, isCorrectWallet } = useWallet();
  const [stakingFilter, setStakingFilter] = useState('all');
  const filteredStakings = stakingFilter === 'all'
    ? staking_list
    : staking_list.filter(s => s.status === stakingFilter);

  const dispatch = useDispatch<AppDispatch>();

  // Load pending staking from localStorage on component mount
  useEffect(() => {
    const savedPendingStaking = localStorage.getItem(`pendingStaking_${user.id}`);
    if (savedPendingStaking) {
      try {
        const parsed = JSON.parse(savedPendingStaking);
        // Check if the pending staking is not too old (24 hours)
        const isNotExpired = Date.now() - parsed.timestamp < 24 * 60 * 60 * 1000;
        if (isNotExpired) {
          setPendingStaking(parsed);
        } else {
          localStorage.removeItem(`pendingStaking_${user.id}`);
        }
      } catch (error) {
        localStorage.removeItem(`pendingStaking_${user.id}`);
      }
    }
  }, [user.id]);

  // Save pending staking to localStorage whenever it changes
  useEffect(() => {
    if (pendingStaking) {
      localStorage.setItem(`pendingStaking_${user.id}`, JSON.stringify(pendingStaking));
    } else {
      localStorage.removeItem(`pendingStaking_${user.id}`);
    }
  }, [pendingStaking, user.id]);

  const handleStartStaking = async (pkg: StakingPackage) => {
    try {
      setIsStaking(true);

      // Check if wallet is connected
      if (!isConnected) {
        toast.info('Please connect your wallet first');
        await connectWallet(user.wallet_address);
        return;
      }
      
      // Validate that the connected wallet matches the user's wallet address
      if (!isCorrectWallet(user.wallet_address)) {
        toast.error(`Please connect the correct wallet address: ${user.wallet_address.slice(0, 6)}...${user.wallet_address.slice(-4)}`);
        return;
      }

      const { ethereum } = window as any;
      const chainId = await ethereum.request({ method: 'eth_chainId' });
      if (chainId !== '0x38') { // 56 in decimal
        // toast.error('Please switch to Binance Smart Chain Mainnet');
        await ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x38' }]
        });
        // return;
      }
      
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await web3Provider.getSigner();

      const newToken = new ethers.Contract(USDT_ADDRESS, USDT_ABI, signer);
      
      // Calculate amount (use correct decimals)
      const decimals = 18//await newToken.decimals();
      console.log(decimals);
      const usdt_amount = parseFloat(pkg.stake_amount) * parseFloat(tokenPrice);
      console.log(usdt_amount);
      
      const amount = ethers.parseUnits(usdt_amount.toString(), decimals);
      // Send token to staking contract/platform
      const tx = await newToken.transfer(platformReceiver, amount);
      toast.warn('Waiting for transaction confirmation...');
      
      const receipt = await tx.wait();
      toast.success(usdt_amount + ' USDT sent to platform successfully!');
      console.log(receipt);

      // Store pending staking data instead of immediately calling API
      const pendingStakingData: PendingStaking = {
        txHash: receipt.hash,
        packageId: pkg.id,
        userId: user.id,
        packageName: pkg.name,
        amount: pkg.stake_amount,
        timestamp: Date.now()
      };

      setPendingStaking(pendingStakingData);
      toast.info('Transaction confirmed! Please click "Confirm Staking" to complete the process.');

    } catch (err: any) {
      console.log(err);
      
      toast.error('Staking failed.');
    } finally {
      setIsStaking(false);
    }
  };

  const handleConfirmStaking = async () => {
    if (!pendingStaking) return;
    console.log(pendingStaking);
    
    try {
      dispatch(authApi.stakingRequest(pendingStaking.txHash, pendingStaking.packageId, pendingStaking.userId));
      setPendingStaking(null);
      toast.success('Staking confirmed successfully!');
    } catch (error) {
      toast.error('Failed to confirm staking. Please try again.');
    }
  };

  const clearPendingStaking = () => {
    setPendingStaking(null);
    toast.info('Pending staking cleared.');
  };

  const calculateDailyReward = (amount: string, rate: number) => {
    return (parseFloat(amount) * rate) / 100;
  };
  const calculateTotalReward = (amount: string, rate: number, days: number) => {
    return (parseFloat(amount) * rate * days) / 100;
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

  const copyToClipboard = (text: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    }
  };

  const handleClaimRewards = (stakingId: number) => {
    toast.info('Claim rewards feature coming soon!');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Staking</h1>
          <div className="text-gray-600 mt-2 w-full gap-8 flex-wrap  justify-between flex">
            <span>  Lock your tokens and earn daily rewards </span>
          </div>
          {pendingStaking && (
            <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <FaClock className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">Pending Confirmation</span>
              </div>
              <div className="text-xs text-yellow-700 mb-3">
                <div>Package: {pendingStaking.packageName}</div>
                <div>Amount: {pendingStaking.amount} EGD</div>
                <div>TX: {pendingStaking.txHash.slice(0, 8)}...{pendingStaking.txHash.slice(-6)}</div>
              </div>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white text-xs"
                  onClick={handleConfirmStaking}
                >
                  <FaCheck className="w-3 h-3 mr-1" />
                  Confirm Staking
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-xs"
                  onClick={clearPendingStaking}
                >
                  Clear
                </Button>
              </div>
            </div>
          )}
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Your EGD Balance</CardTitle>
              <FaWallet className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{(user?.egd_balance).toFixed(2) || 0}</div>
              <p className="text-xs text-muted-foreground">Available for staking</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Stakings</CardTitle>
              <FaLock className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stakingStats.active_staking_number}</div>
              <p className="text-xs text-muted-foreground">
                Currently locked
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Staked</CardTitle>
              <FaArrowUp className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {formatNumber(stakingStats.total_staking_amount)} EGD
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
                {stakingPackages.map(pkg => (
                  <Card key={pkg.id} className="relative">
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        {pkg.name}
                        <Badge variant="default">Active</Badge>
                      </CardTitle>
                      <CardDescription>{pkg.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-10">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-muted-foreground">Daily Reward</p>
                          <p className="font-semibold text-green-600">{pkg.daily_yield_percentage}%</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Lock Period</p>
                          <p className="font-semibold">{pkg.lock_period_days} days</p>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <FaCalculator className="h-4 w-4 text-gray-600" />
                          <span className="text-sm font-medium">Stake Amount: {Number(pkg.stake_amount)} EGD</span>
                        </div>
                        <div className="flex items-center gap-2 mb-2">
                          <FaWallet className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-semibold text-blue-700">Required: {Number(pkg.stake_amount) * Number(tokenPrice)} USDT</span>
                        </div>
                        <div className="text-sm space-y-1">
                          <div className="flex justify-between">
                            <span>Daily Reward:</span>
                            <span className="font-medium">{formatNumber(calculateDailyReward(pkg.stake_amount, pkg.daily_yield_percentage))} EGD</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Reward:</span>
                            <span className="font-medium">{formatNumber(calculateTotalReward(pkg.stake_amount, pkg.daily_yield_percentage, pkg.lock_period_days))} EGD</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Unlock Date:</span>
                            <span className="font-medium">{formatDate(new Date(Date.now() + pkg.lock_period_days * 24 * 60 * 60 * 1000).toISOString())}</span>
                          </div>
                        </div>
                      </div>
                      <Button className="w-full" onClick={() => handleStartStaking(pkg)} disabled={isStaking}>
                        {isStaking ? (<><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>Staking...</>) : 'Stake'}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="my-stakings" className="space-y-6">
              {/* Filter Dropdown */}
              <div className="mb-4 flex items-center gap-2">
                <label htmlFor="staking-filter" className="text-sm font-medium">Filter:</label>
                <select id="staking-filter" className="border rounded px-2 py-1" value={stakingFilter} onChange={e => setStakingFilter(e.target.value)}>
                  <option value="all">All</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              {/* Staking Cards */}
              {stakingLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading your stakings...</p>
                </div>
              ) : filteredStakings.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredStakings.map(({ id, package: pkg, status, createdAt }) => (
                    <Card key={id}>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h3 className="font-semibold text-sm">{pkg?.name || 'Staking Package'}</h3>
                            <p className="text-xs text-muted-foreground">
                              Started {formatDate(createdAt)}
                            </p>
                          </div>
                          <Badge 
                            className={getStatusColor(status)}
                            variant={status === 'active' ? 'default' : 'secondary'}
                          >
                            {status === "free_staking" ? "active" : status}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <p className="text-xs text-muted-foreground">Staked</p>
                            <p className="font-semibold text-sm">{parseFloat(pkg.stake_amount)} EGD</p>
                          </div>
                          <div className="text-center p-2 bg-gray-50 rounded">
                            <p className="text-xs text-muted-foreground">Daily Yield</p>
                            <p className="font-semibold text-sm">{(parseFloat(pkg.stake_amount) * (pkg?.daily_yield_percentage / 100)).toFixed(2)} EGD</p>
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
