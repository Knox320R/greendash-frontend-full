import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FaUserFriends, FaUsers, FaNetworkWired } from 'react-icons/fa';
import { ReferralNode, ReferralStats } from '@/types/dashboard';

interface ReferralsTabProps {
  referralNetwork: ReferralNode[];
  referralStats: ReferralStats;
}

export const ReferralsTab: React.FC<ReferralsTabProps> = ({
  referralNetwork,
  referralStats
}) => {
  const ReferralTree: React.FC<{ nodes: ReferralNode[]; level?: number }> = ({ nodes, level = 0 }) => (
    <ul className={`pl-${level * 4} border-l-2 border-gray-200 ml-2`}>
      {nodes.map((node) => (
        <li key={node.referredUser.id} className="relative mb-4">
          <div className={`flex items-center gap-2 py-2 px-3 rounded-lg ${
            level === 0 ? 'bg-blue-50 border border-blue-200' : 'bg-green-50 border border-green-200'
          }`}>
            <FaUserFriends className={`${level === 0 ? 'text-blue-500' : 'text-green-500'}`} />
            <span className="font-semibold">{node.referredUser.name}</span>
            <span className="text-xs text-gray-500">(Level {level + 1})</span>
            <span className="ml-2 text-gray-400">{node.referredUser.email}</span>
          </div>
          {node.sub_referrals && node.sub_referrals.length > 0 && (
            <ReferralTree nodes={node.sub_referrals} level={level + 1} />
          )}
        </li>
      ))}
    </ul>
  );

  function flattenReferralNetwork(nodes: ReferralNode[], level = 1, result: Array<ReferralNode['referredUser'] & { level: number }> = []) {
    nodes.forEach(node => {
      result.push({ ...node.referredUser, level });
      if (Array.isArray(node.sub_referrals) && node.sub_referrals.length > 0) {
        flattenReferralNetwork(node.sub_referrals, level + 1, result);
      }
    });
    return result;
  }

  const allReferrals = flattenReferralNetwork(referralNetwork);
  const totalReferralCount = allReferrals.length;
  const referralsByLevel = allReferrals.reduce((acc: Record<number, Array<ReferralNode['referredUser'] & { level: number }>>, user) => {
    acc[user.level] = acc[user.level] || [];
    acc[user.level].push(user);
    return acc;
  }, {});

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5, ease: "easeOut" }}
      className="space-y-6"
    >
      <Card className="bg-gradient-to-br from-green-50 to-blue-50 border-2 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-green-800">
            <FaNetworkWired className="w-6 h-6" />
            Referral Network
          </CardTitle>
          <CardDescription>Your direct and indirect referrals</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Total Referral Count */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-center p-6 bg-white rounded-xl border border-green-200 shadow-sm"
          >
            <div className="text-4xl font-bold text-green-600 mb-2">{totalReferralCount}</div>
            <div className="text-lg text-gray-600">Total Referrals</div>
          </motion.div>

          {/* Referrals by Level */}
          <div className="flex flex-wrap gap-4">
            {Object.entries(referralsByLevel).map(([level, users], index) => (
              <motion.div
                key={level}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                whileHover={{ scale: 1.05, boxShadow: "0 8px 25px rgba(34, 197, 94, 0.2)" }}
                className="flex items-center gap-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl px-4 py-3 shadow-sm border border-green-200 cursor-pointer"
              >
                <span className="font-semibold text-green-700 text-sm">
                  Level {level}:
                </span>
                <span className="inline-block bg-green-100 text-green-700 rounded-full px-3 py-1 text-xs font-bold">
                  {users.length} users
                </span>
              </motion.div>
            ))}
          </div>

          {/* Referral Tree */}
          <div className="overflow-x-auto mt-6">
            <ReferralTree nodes={referralNetwork} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}; 