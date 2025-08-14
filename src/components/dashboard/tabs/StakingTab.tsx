import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FaChartLine, FaLock, FaBolt, FaCheckCircle } from 'react-icons/fa';
import { User } from '@/types/auth-1';
import { StakingStats, Staking, TokenInfo } from '@/types/dashboard';
import { formatDate } from '@/lib/utils';

interface StakingTabProps {
  stakingSummary: Staking[];
  stakingStats: StakingStats;
  totalTokens: TokenInfo[];
  user: User;
}

export const StakingTab: React.FC<StakingTabProps> = ({
  stakingSummary,
  stakingStats,
  totalTokens,
  user
}) => {
  if (!stakingSummary?.length) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      >
        <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200">
          <CardContent className="p-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
            >
              <FaChartLine className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-700 mb-3">No Stakings Yet</h3>
              <p className="text-gray-600 mb-6 text-lg">
                Start your first staking to earn daily rewards and grow your portfolio
              </p>
              <motion.button
                              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-full font-semibold text-lg hover:from-green-600 hover:to-green-700"
              >
                Start Staking Now
              </motion.button>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 300% Profit Cap Progress */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
      >
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-blue-800">
              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">300%</span>
              </div>
              300% Profit Cap Progress
            </CardTitle>
            <CardDescription>Overall progress toward maximum profit cap</CardDescription>
          </CardHeader>
          <CardContent>
            {(() => {
              // Get package price from admin settings (seed_sale)
              const seedSaleToken = totalTokens.find(s => s.title === 'seed_sale');
              const packagePrice = seedSaleToken?.price || 0.01;
              
              // Calculate total profit progress toward 300% cap
              const totalProfit = Number(user?.egd_balance || 0) + (Number(user?.withdrawals || 0) / packagePrice);
              
              // Calculate target profit using only ACTIVE staking packages (300% of active staked amount)
              const activeStakingAmount = stakingSummary
                .filter(staking => staking.status === 'active' || staking.status === 'free_staking')
                .reduce((total, staking) => total + parseFloat(staking.package.stake_amount), 0);
              const targetProfit = activeStakingAmount * 3; // 300% of active stakings only
              const profitPercent = targetProfit > 0 ? Math.min((totalProfit / targetProfit) * 100, 100) : 0;
              
              return (
                <>
                  {/* 300% Cap Status */}
                  {user?.benefit_overflow && (
                    <motion.div 
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 1, delay: 0.5 }}
                      className="mb-6 p-4 bg-green-50 border-2 border-green-200 rounded-xl text-center"
                    >
                      <span className="text-green-700 text-lg font-bold flex items-center justify-center gap-2">
                        🎯 300% Cap Reached - Staking Complete!
                        <FaCheckCircle className="text-green-500 text-xl" />
                      </span>
                    </motion.div>
                  )}
                  
                  {/* Progress Bar */}
                  <div className="mb-6">
                    <div className="flex items-center justify-between text-sm font-medium text-gray-600 mb-3">
                      <span>0%</span>
                      <span className="text-2xl font-bold text-blue-600">{profitPercent.toFixed(1)}%</span>
                      <span>300% Cap</span>
                    </div>
                    <div className="relative h-8 rounded-full bg-gray-200 overflow-hidden mb-4">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${profitPercent}%` }}
                        transition={{ duration: 2, delay: 0.8, ease: "easeOut" }}
                        className="absolute top-0 left-0 h-8 rounded-full bg-gradient-to-r from-blue-500 via-green-500 to-green-600"
                      />
                      {/* Current progress marker */}
                      <motion.div
                        initial={{ left: 0 }}
                        animate={{ left: `${profitPercent}%` }}
                        transition={{ duration: 2, delay: 0.8, ease: "easeOut" }}
                        className="absolute top-0 h-8 w-2 bg-blue-600 rounded-full shadow-lg"
                      />
                    </div>
                  </div>
                  
                  {/* Profit Details */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 1, delay: 1.2 }}
                      className="p-4 bg-white border-2 border-blue-200 rounded-xl shadow-sm"
                    >
                      <div className="text-blue-600 mb-2 font-medium">Current Profit</div>
                      <div className="font-bold text-2xl text-blue-800">{(totalProfit * packagePrice).toFixed(2)} USDT</div>
                    </motion.div>
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 1, delay: 1.4 }}
                      className="p-4 bg-white border-2 border-green-200 rounded-xl shadow-sm"
                    >
                      <div className="text-green-600 mb-2 font-medium">Target (300%)</div>
                      <div className="font-bold text-2xl text-green-800">{(targetProfit * packagePrice).toFixed(2)} USDT</div>
                    </motion.div>
                  </div>
                  
                  {/* Breakdown */}
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1.6 }}
                    className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl"
                  >
                    <div className="text-blue-700 mb-3 font-semibold text-center">Profit Breakdown</div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                      <div className="text-center p-2 bg-white rounded-lg border border-blue-100">
                        <div className="text-blue-600 font-medium">EGD Balance</div>
                        <div className="font-bold text-blue-800">{Number(user?.egd_balance || 0).toFixed(2)} EGD</div>
                      </div>
                      <div className="text-center p-2 bg-white rounded-lg border border-blue-100">
                        <div className="text-blue-600 font-medium">USDT Commissions</div>
                        <div className="font-bold text-blue-800">{Number(user?.withdrawals || 0).toFixed(2)} USDT</div>
                      </div>
                      <div className="text-center p-2 bg-white rounded-lg border border-blue-100">
                        <div className="text-blue-600 font-medium">USDT in EGD</div>
                        <div className="font-bold text-blue-800">{(Number(user?.withdrawals || 0) / packagePrice).toFixed(2)} EGD</div>
                      </div>
                    </div>
                  </motion.div>
                </>
              );
            })()}
          </CardContent>
        </Card>
      </motion.div>
      

    </div>
  );
}; 