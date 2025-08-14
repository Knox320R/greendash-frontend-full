import { useMemo } from 'react';
import { UserBaseData } from '@/types/auth-1';
import { ReferralNode, ReferralStats } from '@/types/dashboard';

export const useReferralNetwork = (user_base_data: UserBaseData) => {
  const referralNetwork = useMemo(() => user_base_data?.referral_network || [], [user_base_data?.referral_network]);
  
  const referralStats = useMemo(() => {
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

    return {
      allReferrals,
      totalReferralCount,
      referralsByLevel
    };
  }, [referralNetwork]);

  return {
    referralNetwork,
    referralStats
  };
}; 