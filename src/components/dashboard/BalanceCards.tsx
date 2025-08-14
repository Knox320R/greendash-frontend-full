import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  FaCoins, 
  FaArrowDown, 
  FaLock, 
  FaBolt, 
  FaCheckCircle,
  FaChartLine,
  FaWallet
} from 'react-icons/fa';
import { User } from '@/types/auth-1';
import { StakingStats, ExchangeFlow, WithdrawalFlow } from '@/types/dashboard';

interface BalanceCardsProps {
  user: User;
  stakingStats: StakingStats;
  onExchange: (amount: number) => void;
  onWithdraw: () => void;
  exchangeFlow: ExchangeFlow;
  withdrawalFlow: WithdrawalFlow;
}

export const BalanceCards: React.FC<BalanceCardsProps> = ({
  user,
  stakingStats,
  onExchange,
  onWithdraw,
  exchangeFlow,
  withdrawalFlow
}) => {
  const cards = [
    {
      icon: <FaCoins className="h-6 w-6 text-green-600" />,
      title: "EGD Balance",
      value: `${user?.egd_balance?.toFixed(2) || '0.00'} EGD`,
      subtitle: `≈ ${(Number(user?.egd_balance || 0) * 0.01).toLocaleString(undefined, { style: 'currency', currency: 'USD' })}`,
      action: (
        <Button 
          className="mt-3 w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300" 
          onClick={() => exchangeFlow.openExchangeModal()}
        >
          Convert to USDT
        </Button>
      ),
      color: "from-green-50 to-green-100 border-green-200",
      delay: 0.1
    },
    {
      icon: <FaArrowDown className="h-6 w-6 text-blue-600" />,
      title: "USDT Balance",
      value: `${user?.withdrawals?.toFixed(2) || '0.00'} USDT`,
      subtitle: "Total withdrawable amount",
      action: (
        <Button 
          className="mt-3 w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300" 
          onClick={onWithdraw}
        >
          Send Withdrawal Request
        </Button>
      ),
      color: "from-blue-50 to-blue-100 border-blue-200",
      delay: 0.2
    },
    {
      icon: <FaLock className="h-6 w-6 text-purple-600" />,
      title: "Total Staked",
      value: `${((stakingStats?.total_staking_amount || 0) * 0.01).toFixed(2)} USDT`,
      subtitle: `Across ${stakingStats?.total_staking_count || 0} stakings`,
      action: (
        <div className="flex gap-2 mt-3">
          <span className="flex items-center gap-1 text-green-700 font-semibold text-xs bg-green-100 rounded-full px-3 py-1">
            <FaBolt className="w-3 h-3 text-green-500" />
            Active: {stakingStats?.active_staking_number || 0}
          </span>
          <span className="flex items-center gap-1 text-blue-700 font-semibold text-xs bg-blue-100 rounded-full px-3 py-1">
            <FaCheckCircle className="w-3 h-3 text-blue-500" />
            Completed: {stakingStats?.completed_staking_number || 0}
          </span>
        </div>
      ),
      color: "from-purple-50 to-purple-100 border-purple-200",
      delay: 0.3
    },
    {
      icon: <FaBolt className="h-6 w-6 text-green-500" />,
      title: "Active Staking",
      value: `${((stakingStats?.active_staking_amount || 0) * 0.01).toFixed(2)} USDT`,
      subtitle: "Currently Staking Amount",
      action: (
        <div className="mt-3 p-2 bg-green-50 border border-green-200 rounded-lg">
          <div className="text-xs text-green-700 font-medium text-center">
            Daily Rewards Active
          </div>
        </div>
      ),
      color: "from-emerald-50 to-emerald-100 border-emerald-200",
      delay: 0.4
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
    >
      {cards.map((card, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ 
            duration: 1.5, 
            delay: card.delay, 
            ease: "easeOut" 
          }}

        >
          <Card className={`bg-gradient-to-br ${card.color} border-2 hover:border-green-300`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
              <CardTitle className="text-sm font-semibold text-gray-800">
                {card.title}
              </CardTitle>
              <div>
                {card.icon}
              </div>
            </CardHeader>
            <CardContent>
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1, delay: card.delay + 0.5 }}
                className="text-2xl font-bold text-gray-900 mb-2"
              >
                {card.value}
              </motion.div>
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: card.delay + 0.7 }}
                className="text-xs text-gray-600 mb-3"
              >
                {card.subtitle}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: card.delay + 0.9 }}
              >
                {card.action}
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}; 