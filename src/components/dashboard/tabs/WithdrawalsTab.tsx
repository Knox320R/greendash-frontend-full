import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FaMoneyBillWave, FaClock, FaCheckCircle, FaTimes, FaDownload } from 'react-icons/fa';
import { User } from '@/types/auth-1';
import { Withdrawal, AdminSetting } from '@/types/dashboard';
import { formatDate } from '@/lib/utils';

interface WithdrawalsTabProps {
  withdrawals: Withdrawal[];
  adminSettings: AdminSetting[];
  onWithdrawal: (index: number) => void;
  isConnected: boolean;
  isCorrectWallet: (address: string) => boolean;
  connectWallet: (address: string) => Promise<void>;
  user: User;
}

export const WithdrawalsTab: React.FC<WithdrawalsTabProps> = ({
  withdrawals,
  adminSettings,
  onWithdrawal,
  isConnected,
  isCorrectWallet,
  connectWallet,
  user
}) => {
  if (!withdrawals?.length) {
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
              <FaMoneyBillWave className="h-16 w-16 text-gray-400 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-gray-700 mb-3">No Withdrawal Requests</h3>
              <p className="text-gray-600 text-lg">
                You don't have any withdrawal requests at the moment
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
      className="space-y-6"
    >
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-blue-800">
            <FaMoneyBillWave className="w-6 h-6" />
            Withdrawal Requests
          </CardTitle>
          <CardDescription>
            You have {withdrawals.length} withdrawal request(s)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {withdrawals.map((withdrawal, idx) => {
            // Calculate fee information for display
            const withdrawal_fee_percentage = adminSettings.find(item => item.title === "withdrawal_fee_percentage")?.value || "10";
            const feePercentage = parseFloat(withdrawal_fee_percentage);
            const originalAmount = withdrawal.amount;
            const feeAmount = (originalAmount * feePercentage) / 100;
            const netAmount = originalAmount - feeAmount;

            const getStatusInfo = (status: string) => {
              switch (status) {
                case 'pending':
                  return {
                    icon: <FaClock className="text-yellow-500" />,
                    color: 'bg-yellow-100 text-yellow-800',
                    description: 'Your withdrawal request is being reviewed by our team.',
                    button: null
                  };
                case 'approved':
                  return {
                    icon: <FaCheckCircle className="text-green-500" />,
                    color: 'bg-green-100 text-green-800',
                    description: `Your withdrawal has been approved! You will receive ${netAmount.toFixed(2)} USDT (${feeAmount.toFixed(2)} platform fee deducted). Click below to receive your USDT.`,
                    button: (
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                        onClick={() => onWithdrawal(idx)}
                      >
                        <FaDownload className="w-3 h-3 mr-2" />
                        Receive {netAmount.toFixed(2)} USDT
                      </Button>
                    )
                  };
                case 'completed':
                  return {
                    icon: <FaCheckCircle className="text-blue-500" />,
                    color: 'bg-blue-100 text-blue-800',
                    description: 'Withdrawal completed successfully. Funds have been transferred to your wallet.',
                    button: null
                  };
                case 'rejected':
                  return {
                    icon: <FaTimes className="text-red-500" />,
                    color: 'bg-red-100 text-red-800',
                    description: 'Your withdrawal request was rejected. Please contact support for more information.',
                    button: null
                  };
                default:
                  return {
                    icon: <FaClock className="text-gray-500" />,
                    color: 'bg-gray-100 text-gray-800',
                    description: 'Processing your withdrawal request.',
                    button: null
                  };
              }
            };

            const statusInfo = getStatusInfo(withdrawal.status);

            return (
              <motion.div
                key={withdrawal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: idx * 0.1, ease: "easeOut" }}
                whileHover={{ 
                  scale: 1.01, 
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.1)"
                }}
                className="p-6 bg-white rounded-xl border-2 border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <motion.div
                      whileHover={{ rotate: 360, scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {statusInfo.icon}
                    </motion.div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        {withdrawal.amount} USDT
                      </p>
                      <p className="text-sm text-gray-500">
                        Requested {formatDate(withdrawal.createdAt)}
                      </p>
                      {/* Show fee breakdown for approved withdrawals */}
                      {withdrawal.status === 'approved' && (
                        <div className="mt-2 text-xs text-gray-600">
                          <div className="flex items-center gap-2">
                            <span>Platform Fee ({feePercentage}%):</span>
                            <span className="text-red-600">-{feeAmount.toFixed(2)} USDT</span>
                          </div>
                          <div className="flex items-center gap-2 font-semibold text-green-600">
                            <span>You'll Receive:</span>
                            <span>{netAmount.toFixed(2)} USDT</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge className={statusInfo.color}>
                    {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                  </Badge>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  {statusInfo.description}
                </p>

                {statusInfo.button && (
                  <div className="flex justify-end">
                    {statusInfo.button}
                  </div>
                )}
              </motion.div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
}; 