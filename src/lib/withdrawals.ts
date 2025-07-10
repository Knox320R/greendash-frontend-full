import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

export function getWithdrawalStats() {
    
    const withdrawals = useSelector((store: RootState) => store.auth.user_base_data?.recent_withdrawals) || []

    let pending_amount = 0;
    let completed_amount = 0;

    for (const w of withdrawals) {
        if (w.status === 'pending') {
            pending_amount += w.amount;
        }
        if (w.status === 'completed') {
            completed_amount += w.amount;
        }
    }

    return { pending_amount, completed_amount };
}
