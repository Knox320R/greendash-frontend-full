import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { FaChartLine, FaCoins, FaBullseye, FaLock } from 'react-icons/fa';
import { Staking_progress } from '@/types/progress';
import { formatNumber } from '@/lib/utils';

interface StakingProgressProps {
  stakingProgress: Staking_progress;
  className?: string;
}

const StakingProgress: React.FC<StakingProgressProps> = ({ stakingProgress, className = '' }) => {
  const {
    progress_rate,
    current_earned,
    target_amount,
    current_staking_package_amount,
    has_active_staking,
    current_staking_package_name
  } = stakingProgress;

  if (!has_active_staking) {
    return (
      <Card className={`${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <FaChartLine className="text-blue-500" />
            Staking Progress
          </CardTitle>
          <CardDescription>
            No active staking package found
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-gray-500">
            <FaLock className="mx-auto text-4xl mb-2 text-gray-300" />
            <p>Start staking to see your progress</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <FaChartLine className="text-blue-500" />
          Staking Progress
        </CardTitle>
        <CardDescription>
          Track your staking journey and earnings
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Progress</span>
            <span className="font-semibold text-blue-600">{progress_rate.toFixed(1)}%</span>
          </div>
          <Progress value={progress_rate} className="h-3" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-1">
              <FaCoins className="text-yellow-500 text-sm" />
              <span className="text-xs text-gray-600">Current Earned</span>
            </div>
            <div className="font-bold text-lg text-blue-600">
              {formatNumber(current_earned)}
            </div>
            <div className="text-xs text-gray-500">USDT</div>
          </div>

          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="flex items-center justify-center gap-2 mb-1">
              <FaBullseye className="text-green-500 text-sm" />
              <span className="text-xs text-gray-600">Target Amount</span>
            </div>
            <div className="font-bold text-lg text-green-600">
              {formatNumber(target_amount)}
            </div>
            <div className="text-xs text-gray-500">USDT</div>
          </div>
        </div>

        {/* Package Info */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Package Name:</span>
              <Badge variant="outline" className="text-xs font-medium">
                {current_staking_package_name || 'Unknown Package'}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Package Amount:</span>
              <Badge variant="secondary" className="text-xs">
                {formatNumber(current_staking_package_amount)} USDT
              </Badge>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex justify-center">
          <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
            Active Staking
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
};

export default StakingProgress; 