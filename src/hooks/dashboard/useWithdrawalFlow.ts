import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { authApi, setLoading } from '@/store/auth';
import { toast } from 'react-toastify';
import { ethers } from 'ethers';
import USDT_ABI from '@/lib/usdt_abi.json';
import { USDT_ADDRESS } from '@/lib/constants';
import { User } from '@/types/auth-1';
import { UserBaseData } from '@/types/auth-1';
import { AdminSetting } from '@/types/dashboard';

export const useWithdrawalFlow = (user: User, adminSettings: AdminSetting[], user_base_data: UserBaseData) => {
  const dispatch = useDispatch<AppDispatch>();
  const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawError, setWithdrawError] = useState('');

  const openWithdrawModal = () => {
    setWithdrawModalOpen(true);
    setWithdrawError('');
  };

  const closeWithdrawModal = () => {
    setWithdrawModalOpen(false);
    setWithdrawAmount('');
    setWithdrawError('');
  };

  const handleWithdrawal = async (index: number) => {
    try {
      dispatch(setLoading(true));

      // Get the specific withdrawal by ID
      const approvedWithdrawal = user_base_data.recent_withdrawals[index];

      // Validate withdrawal data
      if (!approvedWithdrawal.amount || approvedWithdrawal.amount <= 0) {
        toast.error('Invalid withdrawal amount');
        return;
      }

      // Get platform wallet address and withdrawal fee percentage from admin settings
      const platform_wallet_address = adminSettings.find(item => item.title === "platform_wallet_address")?.value;
      const withdrawal_fee_percentage = adminSettings.find(item => item.title === "platform_fee")?.value || "10";

      if (!platform_wallet_address) {
        toast.error('Platform wallet address not configured');
        return;
      }

      // Calculate the net amount (after platform fee deduction)
      const feePercentage = parseFloat(withdrawal_fee_percentage);
      const originalAmount = approvedWithdrawal.amount;
      const feeAmount = (originalAmount * feePercentage) / 100;
      const netAmount = originalAmount - feeAmount;

      // Setup Web3 provider and contract
      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await web3Provider.getSigner();
      const usdtContract = new ethers.Contract(USDT_ADDRESS, USDT_ABI, signer);

      // Get token decimals and calculate net amount with proper decimals
      const decimals = await usdtContract.decimals();
      const netAmountWei = ethers.parseUnits(netAmount.toFixed(8), decimals);

      // Show transaction pending message with fee breakdown
      toast.info(`Processing withdrawal of ${netAmount.toFixed(2)} USDT (${originalAmount} - ${feeAmount.toFixed(2)} platform fee) from platform wallet...`);

      // Execute the transfer from platform wallet to user's wallet
      const tx = await usdtContract.transferFrom(platform_wallet_address, user.wallet_address, netAmountWei);

      // Wait for transaction confirmation
      toast.warn('Waiting for transaction confirmation...');
      const receipt = await tx.wait();

      // Check if transaction was successful
      if (receipt.status === 1) {
        toast.success(`Successfully received ${netAmount.toFixed(2)} USDT in your wallet! (${feeAmount.toFixed(2)} platform fee deducted)`);
        // Close the notification after successful withdrawal
        // Note: You'll need to implement confirmUpdateWithdrawal or similar function
        // confirmUpdateWithdrawal(approvedWithdrawal.id, index);
      } else {
        throw new Error('Transaction failed');
      }

    } catch (error: unknown) {
      console.error('Withdrawal error:', error);

      // Provide specific error messages
      if (error && typeof error === 'object' && 'code' in error) {
        const errorCode = (error as { code: string }).code;
        if (errorCode === 'INSUFFICIENT_FUNDS') {
          toast.error('Platform has insufficient USDT balance for withdrawal');
        } else if (errorCode === 'USER_REJECTED') {
          toast.error('Transaction was rejected by user');
        } else {
          toast.error(`Failed to process withdrawal: ${errorCode}`);
        }
      } else if (error && typeof error === 'object' && 'message' in error) {
        const errorMessage = (error as { message: string }).message;
        if (errorMessage.includes('allowance')) {
          toast.error('Withdrawal not approved yet. Please wait for admin approval.');
        } else if (errorMessage.includes('network')) {
          toast.error('Network error. Please check your connection');
        } else {
          toast.error(`Failed to process withdrawal: ${errorMessage}`);
        }
      } else {
        toast.error('Failed to process withdrawal: Unknown error');
      }
    } finally {
      dispatch(setLoading(false));
    }
  };

  return {
    withdrawalFlow: {
      withdrawModalOpen,
      withdrawAmount,
      withdrawError,
      openWithdrawModal,
      closeWithdrawModal,
      setWithdrawAmount,
      setWithdrawError
    },
    handleWithdrawal
  };
}; 