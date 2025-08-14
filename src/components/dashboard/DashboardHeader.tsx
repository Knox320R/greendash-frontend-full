import React from 'react';
import { motion } from 'framer-motion';
import { User } from '@/types/auth-1';

interface DashboardHeaderProps {
  user: User;
}

export const DashboardHeader: React.FC<DashboardHeaderProps> = ({ user }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="mb-8"
    >
      <motion.h1 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, delay: 0.3, ease: "easeOut" }}
        className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-600 via-green-700 to-green-800 bg-clip-text text-transparent"
      >
        Welcome back, {user?.name || 'User'}! 🚀
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 2, delay: 0.6, ease: "easeOut" }}
        className="text-xl text-gray-600 mt-3 font-medium"
      >
        Here's your GreenDash overview - Your gateway to sustainable mobility and rewards
      </motion.p>
      
      {/* User Status Indicators */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.5, delay: 0.9, ease: "easeOut" }}
        className="flex flex-wrap gap-4 mt-6"
      >
        <motion.div 
          
          className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-4 py-2 cursor-pointer"
        >
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-green-700">Active User</span>
        </motion.div>
        
        {user?.is_admin && (
          <motion.div 

            className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-full px-4 py-2 cursor-pointer"
          >
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium text-blue-700">Admin Access</span>
          </motion.div>
        )}
        
        {user?.benefit_overflow && (
          <motion.div 

            className="flex items-center gap-2 bg-purple-50 border border-purple-200 rounded-full px-4 py-2 cursor-pointer"
          >
            <div className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"></div>
            <span className="text-sm font-medium text-purple-700">300% Cap Reached</span>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}; 