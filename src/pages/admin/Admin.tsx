import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  FaUsers,
  FaClipboardList,
  FaCubes,
  FaSitemap,
  FaCommentDots,
  FaCog,
  FaHistory,
  FaChevronRight,
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import UserManagement from './sections/UserManagement';
import OrderManagement from './sections/OrderManagement';
import StakingPackages from './sections/StakingPackages';
import ReferralTree from './sections/ReferralTree';
import Testimonials from './sections/Testimonials';
import SystemSettings from './sections/SystemSettings';
import ActivityLogs from './sections/ActivityLogs';

const sections = [
  {
    key: 'users',
    label: 'User Management',
    icon: FaUsers,
  },
  {
    key: 'orders',
    label: 'Order Management',
    icon: FaClipboardList,
  },
  {
    key: 'staking',
    label: 'Staking Packages',
    icon: FaCubes,
  },
  {
    key: 'referral',
    label: 'Referral Tree Overview',
    icon: FaSitemap,
  },
  {
    key: 'testimonials',
    label: 'Testimonial Moderation',
    icon: FaCommentDots,
  },
  {
    key: 'settings',
    label: 'System Settings',
    icon: FaCog,
  },
  {
    key: 'activity',
    label: 'Activity Logs',
    icon: FaHistory,
  },
];

const sectionTitles: Record<string, string> = {
  users: 'User Management',
  orders: 'Order Management',
  staking: 'Staking Package Management',
  referral: 'Referral Tree Overview',
  testimonials: 'Testimonial Moderation',
  settings: 'System Settings',
  activity: 'Activity Logs',
};

const Admin: React.FC = () => {
  const [selected, setSelected] = useState('users');

  return (
    <div className="min-h-screen mt-[60px] flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r shadow-lg hidden md:flex flex-col">
        <div className="px-6 py-6 border-b">
          <h2 className="text-2xl font-bold text-green-700">Admin Dashboard</h2>
        </div>
        <nav className="flex-1 py-8">
          {sections.map((section) => (
            <Button
              key={section.key}
              variant={selected === section.key ? 'default' : 'ghost'}
              className={`w-full  flex items-center justify-start gap-3 px-6 py-3 rounded-none text-md font-medium transition-all ${selected === section.key ? 'bg-green-600 text-white' : 'text-gray-700 hover:bg-green-50'}`}
              onClick={() => setSelected(section.key)}
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
              {selected === 'users' && <UserManagement />}
              {selected === 'orders' && <OrderManagement />}
              {selected === 'staking' && <StakingPackages />}
              {selected === 'referral' && <ReferralTree />}
              {selected === 'testimonials' && <Testimonials />}
              {selected === 'settings' && <SystemSettings />}
              {selected === 'activity' && <ActivityLogs />}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Admin; 