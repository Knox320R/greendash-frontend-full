import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { authApi } from '@/store/auth';
import { User } from '@/types/auth-1';
import { AdminSetting } from '@/types/dashboard';

export const useExchangeFlow = (user: User, adminSettings: AdminSetting[]) => {
  const dispatch = useDispatch<AppDispatch>();
  const [exchangeModalOpen, setExchangeModalOpen] = useState(false);
  const [exchangeAmount, setExchangeAmount] = useState(1000);
  const [exchangeError, setExchangeError] = useState('');

  const openExchangeModal = () => {
    setExchangeModalOpen(true);
    setExchangeError('');
  };

  const closeExchangeModal = () => {
    setExchangeModalOpen(false);
    setExchangeAmount(1000);
    setExchangeError('');
  };

  const handleExchange = (amount: number) => {
    if (!amount || isNaN(amount) || amount <= 0) {
      setExchangeError('Please enter a valid amount.');
      return;
    }
    if (amount > Number(user?.egd_balance || 0)) {
      setExchangeError('Amount exceeds available EGD balance.');
      return;
    }

    // Get min/max exchange limits from admin settings
    const minExchangeSetting = adminSettings.find(s => s.title === 'min_exchange');
    const maxExchangeSetting = adminSettings.find(s => s.title === 'max_exchange');
    const minExchange = minExchangeSetting ? Number(minExchangeSetting.value) : 1000;
    const maxExchange = maxExchangeSetting ? Number(maxExchangeSetting.value) : 100000;

    if (amount < minExchange) {
      setExchangeError(`Amount is below the minimum exchange amount (${minExchange}).`);
      return;
    }
    if (amount > maxExchange) {
      setExchangeError(`Amount exceeds the maximum exchange amount (${maxExchange}).`);
      return;
    }

    closeExchangeModal();
    dispatch(authApi.exchangeRequest(amount));
  };

  return {
    exchangeFlow: {
      exchangeModalOpen,
      exchangeAmount,
      exchangeError,
      openExchangeModal,
      closeExchangeModal,
      setExchangeAmount,
      setExchangeError
    },
    handleExchange
  };
}; 