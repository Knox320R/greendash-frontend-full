import { Transaction } from '@/types/auth-1';

export function getTransactionSums(transactions: Transaction[]) {
  const result: Record<string, number> = {};

  for (const tx of transactions) {
    if (!result[tx.type]) result[tx.type] = 0;
    result[tx.type] += tx.amount;
  }

  return {
    staked_amount: result['staking'] || 0,
    withdrawal_amount: result['withdrawal'] || 0,
    purchase_amount: result['purchase'] || 0,
    daily_reward_amount: result['daily_reward'] || 0,
    unilevel_commission_amount: result['unilevel_commission'] || 0,
    universal_cashback_amount: result['universal_cashback'] || 0,
    weak_leg_bonus_amount: result['weak_leg_bonus'] || 0,
    admin_adjustment_amount: result['admin_adjustment'] || 0,
    // Optionally, include the raw map:
    by_type: result,
  };
}