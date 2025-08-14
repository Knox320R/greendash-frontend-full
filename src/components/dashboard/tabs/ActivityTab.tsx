import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FaChartLine, FaCheckCircle, FaClock, FaExclamationTriangle, FaMoneyBillWave } from 'react-icons/fa';
import { formatNumber, formatDate } from '@/lib/utils';
import { Transaction } from '@/types/dashboard';

interface ActivityTabProps {
  recentTransactions: Transaction[];
}

export const ActivityTab: React.FC<ActivityTabProps> = ({ recentTransactions }) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <FaCheckCircle className="text-green-500" />;
      case 'pending':
        return <FaClock className="text-yellow-500" />;
      case 'failed':
        return <FaExclamationTriangle className="text-red-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!recentTransactions?.length) {
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
              <h3 className="text-2xl font-bold text-gray-700 mb-3">No Recent Activity</h3>
              <p className="text-gray-600 text-lg">
                Your transaction history will appear here once you start using the platform
              </p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="space-y-4"
    >
      {recentTransactions.map((activity, index) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: index * 0.1, ease: "easeOut" }}
          whileHover={{ 
            scale: 1.02, 
            y: -2,
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)"
          }}
        >
          <Card className="border-2 border-gray-200 hover:border-green-300 transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.5 }}
                  >
                    {getStatusIcon(activity.type)}
                  </motion.div>
                  <div>
                    <p className="font-semibold text-lg text-gray-900 capitalize">
                      {activity.type.replace(/_/g, ' ')}
                    </p>
                    <p className="text-sm text-gray-500">
                      {formatDate(activity.created_at)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xl text-green-600">
                    +{formatNumber(activity.amount)} {
                      ['withdrawal', 'weak_leg_bonus', 'unilevel_commission'].includes(activity.type) 
                        ? 'USDT' 
                        : 'EGD'
                    }
                  </p>
                  <Badge className={`mt-2 ${getStatusColor(activity.type)}`}>
                    {activity.type.replace(/_/g, ' ')}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  );
}; 