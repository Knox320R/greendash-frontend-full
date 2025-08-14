import React from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OverviewTab } from './tabs/OverviewTab';
import { StakingTab } from './tabs/StakingTab';
import { ReferralsTab } from './tabs/ReferralsTab';
import { ActivityTab } from './tabs/ActivityTab';
import { WithdrawalsTab } from './tabs/WithdrawalsTab';
import { User, UserBaseData } from '@/types/auth-1';
import { 
  StakingStats, 
  Staking, 
  ReferralNode, 
  ReferralStats, 
  AdminSetting, 
  TokenInfo, 
  WithdrawalFlow 
} from '@/types/dashboard';

interface DashboardTabsProps {
  user: User;
  user_base_data: UserBaseData;
  stakingStats: StakingStats;
  stakingSummary: Staking[];
  referralNetwork: ReferralNode[];
  referralStats: ReferralStats;
  adminSettings: AdminSetting[];
  totalTokens: TokenInfo[];
  withdrawalFlow: WithdrawalFlow;
  onWithdrawal: (index: number) => void;
  isConnected: boolean;
  isCorrectWallet: (address: string) => boolean;
  connectWallet: (address: string) => Promise<void>;
}

export const DashboardTabs: React.FC<DashboardTabsProps> = ({
  user,
  user_base_data,
  stakingStats,
  stakingSummary,
  referralNetwork,
  referralStats,
  adminSettings,
  totalTokens,
  withdrawalFlow,
  onWithdrawal,
  isConnected,
  isCorrectWallet,
  connectWallet
}) => {
  const tabs = [
    { value: "overview", label: "Overview", icon: "📊" },
    { value: "staking", label: "Staking", icon: "🔒" },
    { value: "referrals", label: "Referrals", icon: "👥" },
    { value: "activity", label: "Activity", icon: "📈" },
    { value: "withdrawals", label: "Withdrawals", icon: "💰" }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
    >
      <Tabs defaultValue="overview" className="space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, delay: 0.6, ease: "easeOut" }}
        >
          <TabsList className="grid w-full grid-cols-5 bg-gradient-to-r from-green-50 to-blue-50 border-2 border-green-200 p-1 rounded-xl">
            {tabs.map((tab, index) => (
              <motion.div
                key={tab.value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8 + index * 0.1, ease: "easeOut" }}
              >
                <TabsTrigger 
                  value={tab.value}
                  className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-blue-500 data-[state=active]:text-white data-[state=active]:shadow-lg"
                >
                  <span className="text-lg">{tab.icon}</span>
                  <span className="hidden md:inline">{tab.label}</span>
                </TabsTrigger>
              </motion.div>
            ))}
          </TabsList>
        </motion.div>

        {/* Tab Contents */}
        <TabsContent value="overview" className="space-y-6">
          <OverviewTab 
            user={user}
            stakingStats={stakingStats}
            stakingSummary={stakingSummary}
            isConnected={isConnected}
          />
        </TabsContent>

        <TabsContent value="staking" className="space-y-6">
          <StakingTab 
            stakingSummary={stakingSummary}
            stakingStats={stakingStats}
            totalTokens={totalTokens}
            user={user}
          />
        </TabsContent>

        <TabsContent value="referrals" className="space-y-6">
          <ReferralsTab 
            referralNetwork={referralNetwork}
            referralStats={referralStats}
          />
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <ActivityTab 
            recentTransactions={user_base_data?.recent_transactions || []}
          />
        </TabsContent>

        <TabsContent value="withdrawals" className="space-y-6">
          <WithdrawalsTab 
            withdrawals={user_base_data?.recent_withdrawals || []}
            adminSettings={adminSettings}
            onWithdrawal={onWithdrawal}
            isConnected={isConnected}
            isCorrectWallet={isCorrectWallet}
            connectWallet={connectWallet}
            user={user}
          />
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}; 