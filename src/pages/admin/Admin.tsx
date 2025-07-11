import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  FaCog,
  FaCubes,
  FaTrophy,
  FaPercent,
  FaCoins,
  FaChevronRight,
  FaChartLine,
  FaUser,
  FaExchangeAlt,
  FaMoneyBillWave,
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import AdminSettings from '@/pages/admin/sections/AdminSettings';
import StakingPackages from '@/pages/admin/sections/StakingPackages';
import RankPlans from '@/pages/admin/sections/RankPlans';
import CommissionPlans from '@/pages/admin/sections/CommissionPlans';
import TotalTokens from '@/pages/admin/sections/TotalTokens';
import Dashboard from '@/pages/admin/sections/Dashboard';
import { getAdminData, setSelectedTab } from '@/store/admin';
import RecentUser from './sections/RecentUser';
import RecentStaking from './sections/RecentStaking';
import RecentTransaction from './sections/RecentTransaction';
import RecentWithdrawals from './sections/RecentWithdrawals';
import { FinancialAnalytics } from '@/pages/admin/sections/FinancialAnalytics';
import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const sections = [
  {
    key: 'dashboard',
    label: 'Dashboard',
    icon: FaChartLine,
  },
  {
    key: 'financial_analytics',
    label: 'Financial Analytics',
    icon: FaChartLine,
  },
  {
    key: 'settings',
    label: 'Admin Settings',
    icon: FaCog,
  },
  {
    key: 'staking',
    label: 'Staking Packages',
    icon: FaCubes,
  },
  {
    key: 'ranks',
    label: 'Rank Plans',
    icon: FaTrophy,
  },
  {
    key: 'commissions',
    label: 'Commission Plans',
    icon: FaPercent,
  },
  {
    key: 'user_list',
    label: 'Users',
    icon: FaUser,
  },
  {
    key: 'staking_list',
    label: 'Stakings',
    icon: FaCubes,
  },
  {
    key: 'transaction_list',
    label: 'Transactions',
    icon: FaExchangeAlt,
  },
  {
    key: 'withdrawal_list',
    label: 'Withdrawals',
    icon: FaMoneyBillWave,
  },
  {
    key: 'tokens',
    label: 'Total Tokens',
    icon: FaCoins,
  }
];

const sectionTitles: Record<string, string> = {
  dashboard: 'Enterprise Dashboard',
  financial_analytics: 'Financial Analytics Dashboard',
  user_list: 'Users',
  staking_list: 'Stakings',
  transaction_list: 'Transactions',
  settings: 'Admin Settings Management',
  staking: 'Staking Package Management',
  ranks: 'Rank Plan Management',
  commissions: 'Commission Plan Management',
  tokens: 'Total Token Management',
  withdrawal_list: 'Withdrawals',
};

const Admin: React.FC = () => {
  const adminData = useSelector((state: RootState) => state.adminData);
  const selected = useSelector((state: RootState) => state.adminData.selectedTab);
  const dispatch = useDispatch<AppDispatch>();
  
  useEffect(() => {
    if(!adminData?.enterprise?.users?.total) dispatch(getAdminData());
  }, [dispatch]);

  const handleTabChange = (tabKey: string) => {
    dispatch(setSelectedTab(tabKey));
  };

  return (
    <div className="min-h-screen mt-[60px] flex bg-gray-50">
      {/* Mobile Hamburger & Drawer */}
      <div className="md:hidden fixed top-2 left-2 z-50">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="w-6 h-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <div className="px-6 py-6 border-b">
              <h2 className="text-2xl font-bold text-green-700">Admin Dashboard</h2>
            </div>
            <nav className="flex-1 py-8 flex flex-col">
              {sections.map((section) => (
                <Button
                  key={section.key}
                  variant={selected === section.key ? 'default' : 'ghost'}
                  className={`w-full flex items-center justify-start gap-3 px-6 py-3 rounded-none text-md font-medium transition-all ${selected === section.key ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-green-50'}`}
                  onClick={() => handleTabChange(section.key)}
                >
                  <section.icon className="w-5 h-5" />
                  {section.label}
                  {selected === section.key && <FaChevronRight className="ml-auto w-4 h-4" />}
                </Button>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
      {/* Sidebar for md+ screens */}
      <aside className="w-64 bg-white border-r shadow-lg hidden md:flex flex-col">
        <div className="px-6 py-6 border-b">
          <h2 className="text-2xl font-bold text-green-700">Admin Dashboard</h2>
        </div>
        <nav className="flex-1 py-8">
          {sections.map((section) => (
            <Button
              key={section.key}
              variant={selected === section.key ? 'default' : 'ghost'}
              className={`w-full flex items-center justify-start gap-3 px-6 py-3 rounded-none text-md font-medium transition-all ${selected === section.key ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-green-50'}`}
              onClick={() => handleTabChange(section.key)}
            >
              <section.icon className="w-5 h-5" />
              {section.label}
              {selected === section.key && <FaChevronRight className="ml-auto w-4 h-4" />}
            </Button>
          ))}
        </nav>
      </aside>
      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6">
        <motion.div
          key={selected}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="w-full max-w-[1200px]"
        >
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {React.createElement(sections.find(s => s.key === selected)?.icon || FaCog, { className: 'w-6 h-6 text-green-600' })}
                {sectionTitles[selected]}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {selected === 'dashboard' && <Dashboard />}
              {selected === 'financial_analytics' && <FinancialAnalytics />}
              {selected === 'settings' && <AdminSettings data={adminData.admin_settings} />}
              {selected === 'staking' && <StakingPackages data={adminData.staking_packages} />}
              {selected === 'ranks' && <RankPlans data={adminData.rank_plans} />}
              {selected === 'commissions' && <CommissionPlans data={adminData.commission_plans} />}
              {selected === 'tokens' && <TotalTokens data={adminData.total_tokens} />}
              {selected === 'user_list' && <RecentUser/>}
              {selected === 'staking_list' && <RecentStaking/>}
              {selected === 'transaction_list' && <RecentTransaction/>}
              {selected === 'withdrawal_list' && <RecentWithdrawals/>}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Admin; 