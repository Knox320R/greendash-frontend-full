import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FaUserFriends, FaCopy, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { User, UserBaseData, ReferralNode, UplineUserEntry } from '@/types/auth-1';

// ReferralTree component for visual tree structure
const ReferralTree: React.FC<{ nodes: ReferralNode[]; level?: number }> = ({ nodes, level = 0 }) => (
  <div className="flex flex-col items-center">
    <div className="flex flex-row gap-6 items-start w-full">
      {nodes.map((node, idx) => (
        <div key={node.referredUser.id} className="flex flex-col items-center relative">
          {/* Parent node card */}
          <div className={`rounded-lg shadow-md px-4 py-2 bg-white border border-gray-200 flex flex-col items-center transition-transform hover:scale-105 hover:shadow-lg min-w-[160px]`}>
            <FaUserFriends className="text-blue-500 mb-1" />
            <span className="font-semibold text-gray-800">{node.referredUser.name}</span>
            <span className="text-xs text-gray-500">{node.referredUser.email}</span>
            <span className="text-xs text-gray-400">Level {level + 1}</span>
          </div>
          {/* Connector to children */}
          {node.sub_referrals && node.sub_referrals.length > 0 && (
            <>
              <div className="w-0.5 h-4 bg-gray-300"></div>
              <div className="flex flex-row items-center justify-center w-full">
                {/* Horizontal connector above children */}
                <div className="h-0.5 bg-gray-300" style={{ width: `${node.sub_referrals.length * 160}px` }}></div>
              </div>
              <ReferralTree nodes={node.sub_referrals} level={level + 1} />
            </>
          )}
        </div>
      ))}
    </div>
  </div>
);

// Helper to flatten the referral network and group by level
function flattenReferralNetwork(nodes: ReferralNode[], level = 1, result: any[] = []) {
  nodes.forEach(node => {
    result.push({ ...node.referredUser, level });
    if (Array.isArray(node.sub_referrals) && node.sub_referrals.length > 0) {
      flattenReferralNetwork(node.sub_referrals, level + 1, result);
    }
  });
  return result;
}

const Affiliates: React.FC = () => {
  const { user, user_base_data } = useAuth();
  const referralNetwork: ReferralNode[] = user_base_data?.referral_network || [];
  const uplineUsers: UplineUserEntry[] = user_base_data?.upline_users || [];
  const [copied, setCopied] = React.useState(false);
  const referralLink = `${window.location.origin}/register?ref=${user?.referral_code}`;
  const copyReferralLink = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // ignore
    }
  };

  // Calculate users per level
  const allReferrals = flattenReferralNetwork(referralNetwork);
  
  const referralsByLevel = allReferrals.reduce((acc: Record<number, any[]>, user) => {
    acc[user.level] = acc[user.level] || [];
    acc[user.level].push(user);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Affiliate Program</h1>
          <p className="text-gray-600 mt-2">
            Build your network and earn rewards.
          </p>
        </motion.div>

        {/* Referral Code and Link */}
        <Card>
          <CardHeader>
            <CardTitle>Referral Code</CardTitle>
            <CardDescription>Your unique code and invite link</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold font-mono mb-4">{user?.referral_code}</div>
            <div className="flex gap-2 items-center">
              <Input value={referralLink} readOnly className="flex-1" />
              <Button onClick={copyReferralLink} variant="outline">
                {copied ? (
                  <>
                    <FaCheckCircle className="mr-2 h-4 w-4 text-green-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <FaCopy className="mr-2 h-4 w-4" />
                    Copy Link
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Upline Users */}
        {uplineUsers.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Your Upline Users</CardTitle>
              <CardDescription>See your sponsor lineage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3 mt-2">
                {uplineUsers.map((upline) => (
                  <div key={upline.uplineUser.id} className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 flex flex-col items-center min-w-[120px]">
                    <span className="text-xs font-bold text-gray-500 mb-1">Level {upline.level}</span>
                    <span className="font-semibold">{upline.uplineUser.name}</span>
                    <span className="text-xs text-gray-400">{upline.uplineUser.email}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Referral Network Tree */}
        <Card>
          <CardHeader>
            <CardTitle>Referral Network Tree</CardTitle>
            <CardDescription>Visualize your direct and indirect referrals</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Level summary flex row */}
            {Object.keys(referralsByLevel).length > 0 && (
              <div className="flex flex-wrap gap-4 mb-6">
                {Object.entries(referralsByLevel).map(([level, users]) => (
                  <div
                    key={level}
                    className="flex flex-col items-center justify-center bg-gradient-to-r from-green-100 to-blue-100 rounded-lg px-5 py-3 shadow border border-green-200 min-w-[100px]"
                  >
                    <span className="text-xs font-semibold text-green-700 mb-1">Level {level}</span>
                    <span className="text-2xl font-bold text-blue-700">{(users as any[]).length}</span>
                    <span className="text-xs text-gray-500">users</span>
                  </div>
                ))}
              </div>
            )}
            <div className="overflow-x-auto w-full pb-2">
              {referralNetwork.length > 0 ? (
                <ReferralTree nodes={referralNetwork} />
              ) : (
                <div className="text-center text-gray-400">No referral network yet.</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Affiliates;
