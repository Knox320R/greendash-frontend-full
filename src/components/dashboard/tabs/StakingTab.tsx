import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FaChartLine, FaLock, FaBolt, FaCheckCircle } from 'react-icons/fa';
import { User } from '@/types/auth-1';
import { StakingStats, Staking, TokenInfo } from '@/types/dashboard';
import { formatDate } from '@/lib/utils';
import StakingProgress from '@/components/StakingProgress';
import { useAuth } from '@/hooks/useAuth';

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
  const { staking_progress } = useAuth();

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
      {/* Staking Progress */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
      >
        <StakingProgress stakingProgress={staking_progress} />
      </motion.div>
    </div>
  );
}; 