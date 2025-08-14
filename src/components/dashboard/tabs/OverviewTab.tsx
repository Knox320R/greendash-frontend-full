import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FaWallet, FaEnvelope, FaPhone, FaCalendar, FaUsers, FaExchangeAlt, FaUserPlus } from 'react-icons/fa';
import { User } from '@/types/auth-1';
import { StakingStats, Staking } from '@/types/dashboard';
import { format as formatDateFns } from 'date-fns';

interface OverviewTabProps {
  user: User;
  stakingStats: StakingStats;
  stakingSummary: Staking[];
  isConnected: boolean;
}

export const OverviewTab: React.FC<OverviewTabProps> = ({
  user,
  stakingStats,
  stakingSummary,
  isConnected
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Account Status */}
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
      >
        <Card className="h-full bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200 hover:border-blue-300 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <FaWallet className="w-5 h-5" />
              Account Status
            </CardTitle>
            <CardDescription>Your account information and settings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100">
              <span className="text-sm font-medium text-gray-700">Wallet Connected</span>
              <Badge variant={isConnected ? "default" : "secondary"} className="bg-gradient-to-r from-green-500 to-green-600">
                {isConnected ? "Connected" : "Not Connected"}
              </Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100">
              <span className="text-sm font-medium text-gray-700">Referral Code</span>
              <code className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded font-mono">
                {user?.referral_code || 'N/A'}
              </code>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-white rounded-lg border border-blue-100">
              <span className="text-sm font-medium text-gray-700">Admin Access</span>
              <Badge variant={user?.is_admin ? "default" : "secondary"}>
                {user?.is_admin ? "Yes" : "No"}
              </Badge>
            </div>

            {/* Enhanced User Info Block */}
            <div className="bg-white border-2 border-blue-200 rounded-xl p-4 space-y-3">
              <h4 className="font-semibold text-blue-800 mb-3 text-center">User Information</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                  <FaEnvelope className="w-4 h-4 text-blue-500" />
                  <span className="font-medium text-blue-700 text-sm">Email:</span>
                  <span className="ml-auto text-blue-900 text-sm truncate">{user?.email}</span>
                </div>
                
                {user?.phone && (
                  <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                    <FaPhone className="w-4 h-4 text-green-500" />
                    <span className="font-medium text-green-700 text-sm">Phone:</span>
                    <span className="ml-auto text-green-900 text-sm">{user?.phone}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-lg">
                  <FaCalendar className="w-4 h-4 text-purple-500" />
                  <span className="font-medium text-purple-700 text-sm">Registered:</span>
                  <span className="ml-auto text-purple-900 text-sm">
                    {user?.created_at ? formatDateFns(new Date(user.created_at), 'yyyy-MM-dd') : '-'}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 p-2 bg-orange-50 rounded-lg">
                  <FaExchangeAlt className="w-4 h-4 text-orange-500" />
                  <span className="font-medium text-orange-700 text-sm">Parent Leg:</span>
                  <span className="ml-auto text-orange-900 text-sm capitalize">{user?.parent_leg}</span>
                </div>
                
                <div className="flex items-center gap-2 p-2 bg-blue-50 rounded-lg">
                  <FaUsers className="w-4 h-4 text-blue-600" />
                  <span className="font-medium text-blue-700 text-sm">Left Volume:</span>
                  <span className="ml-auto text-blue-900 text-sm">{user?.left_volume}</span>
                </div>
                
                <div className="flex items-center gap-2 p-2 bg-pink-50 rounded-lg">
                  <FaUsers className="w-4 h-4 text-pink-600" />
                  <span className="font-medium text-pink-700 text-sm">Right Volume:</span>
                  <span className="ml-auto text-pink-900 text-sm">{user?.right_volume}</span>
                </div>
                
                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg md:col-span-2">
                  <FaUserPlus className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-gray-700 text-sm">Referred By:</span>
                  <span className="ml-auto text-gray-900 text-sm">{user?.referred_by ?? '-'}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Staking and Rewards Summary */}
      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
      >
        <Card className="h-full bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 hover:border-green-300 transition-all duration-300">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-800">
              <div className="w-5 h-5 bg-green-500 rounded-full"></div>
              Staking & Rewards
            </CardTitle>
            <CardDescription>Your staking performance and earnings</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-green-200">
                <span className="text-sm font-medium text-gray-700">Total Staking Count</span>
                <span className="font-bold text-lg text-green-600">{stakingSummary?.length || 0} times</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-green-200">
                <span className="text-sm font-medium text-gray-700">Total Staked Amount</span>
                <span className="font-bold text-lg text-green-600">{stakingStats?.total_staking_amount || 0} EGD</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-green-200">
                <span className="text-sm font-medium text-gray-700">Total Rewards Claimed</span>
                <span className="font-bold text-lg text-yellow-600 bg-yellow-100 rounded-lg px-3 py-1">
                  {stakingStats?.earned_from_active?.toLocaleString() || 0} EGD
                </span>
              </div>
              
              <div className="p-4 bg-gradient-to-r from-green-100 to-blue-100 rounded-xl border border-green-300">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-700 mb-2">
                    {stakingStats?.active_staking_number || 0}
                  </div>
                  <div className="text-sm text-green-600">Active Staking Packages</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}; 