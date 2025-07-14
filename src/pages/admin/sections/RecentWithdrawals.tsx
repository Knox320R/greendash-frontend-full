import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { FaMoneyBillWave, FaCheck, FaTimes, FaWallet, FaCheckCircle, FaClock } from 'react-icons/fa';
import { approveWithdrawal, fetchPageData, rejectWithdrawal } from '@/store/admin';
import { WithdrawalItem } from '@/types/admin';
import { useWallet } from '@/hooks/WalletContext';
import { toast } from 'react-toastify';
import { setLoading } from '@/store/auth';
import { ethers } from 'ethers';
import USDT_ABI from '@/lib/usdt_abi.json';
import { USDT_ADDRESS } from '@/lib/constants';

const RecentWithdrawals: React.FC = () => {
  const { list, isMore } = useSelector((state: RootState) => state.adminData?.withdrawals || { list: [], isMore: true });
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [rejectModal, setRejectModal] = useState<WithdrawalItem | null>(null);
  const { connectWallet, isConnected, walletAddress } = useWallet();
  const adminSettings = useSelector((store: RootState) => store.adminData.admin_settings);
  const platform_wallet_address = adminSettings?.find(item => item.title === "platform_wallet_address")?.value || "0x0000000000000000000000000000000000000000";
  const withdrawal_fee_percentage = adminSettings?.find(item => item.title === "withdrawal_fee_percentage")?.value || "10"; // Default 10%
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (isMore && list.length === 0) dispatch(fetchPageData(limit, list.length, "withdrawals"));
  }, []);

  const flatten = (obj: any) => {
    let result: any[] = [];
    for (const key in obj) {
      if (typeof obj[key] === 'object' && obj[key] !== null) {
        result = result.concat(flatten(obj[key]));
      } else {
        result.push(obj[key]);
      }
    }
    return result;
  };

  const filtered = list.filter(withdrawal =>
    flatten(withdrawal).some(val =>
      (val !== null && val !== undefined && val.toString().toLowerCase().includes(search.toLowerCase()))
    )
  );

  async function handleApprove(withdrawal: WithdrawalItem) {
    try {
      dispatch(setLoading(true))

      // Check if wallet is connected
      if (!isConnected) {
        toast.error('Please connect the platform wallet first');
        await connectWallet();
        return;
      }

      // Check if connected wallet is the platform wallet
      if (walletAddress?.toLowerCase() !== platform_wallet_address.toLowerCase()) {
        toast.error(`Please connect the platform wallet (${platform_wallet_address.slice(0, 6)}...${platform_wallet_address.slice(-4)}) instead of your personal wallet`);
        return;
      }

      const receiver = withdrawal?.user?.wallet_address || "0x0000000000000000000000000000000000000000";

      // Validate receiver address
      if (receiver === "0x0000000000000000000000000000000000000000") {
        toast.error('User wallet address is invalid');
        return;
      }

      const web3Provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await web3Provider.getSigner();
      const newToken = new ethers.Contract(USDT_ADDRESS, USDT_ABI, signer);

      // Calculate withdrawal fee and net amount
      const feePercentage = parseFloat(withdrawal_fee_percentage);
      const originalAmount = withdrawal.amount;
      const feeAmount = (originalAmount * feePercentage) / 100;
      const netAmount = originalAmount - feeAmount;

      // Calculate amounts with correct decimals
      const decimals = await newToken.decimals();
      const netAmountWei = ethers.parseUnits(netAmount.toFixed(6), decimals);

      // Show approval details before transaction
      toast.info(`Approving ${netAmount.toFixed(2)} USDT (${originalAmount} - ${feeAmount.toFixed(2)} fee) for user ${withdrawal.user?.name || 'Unknown'} (${receiver.slice(0, 6)}...${receiver.slice(-4)})`);

      // Request approval for token spending (net amount after fee)
      const tx = await newToken.approve(receiver, netAmountWei);
      toast.warn('Waiting for approval confirmation...');
      const receipt = await tx.wait();
      console.log('Approval receipt:', receipt);

      toast.success(`Successfully approved ${netAmount.toFixed(2)} USDT (${feeAmount.toFixed(2)} fee deducted) for ${withdrawal.user?.name || 'user'}!`);
      dispatch(approveWithdrawal(withdrawal))

    } catch (e) {
      console.log(e);
      if (e.code === 'USER_REJECTED') {
        toast.error("Transaction was rejected by user");
      } else if (e.message?.includes('insufficient funds')) {
        toast.error("Insufficient funds for gas fees");
      } else {
        toast.error("Failed to approve the withdrawal request");
      }
    } finally {
      dispatch(setLoading(false))
    }
  }
  function handleReject(withdrawal: WithdrawalItem) {
    dispatch(rejectWithdrawal(withdrawal))
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case 'completed':
        return <span className="text-green-600 font-bold">completed</span>;
      case 'rejected':
        return <span className="text-red-600 font-bold">rejected</span>;
      case 'failed':
        return <span className="text-gray-600 font-bold">failed</span>;
      case 'approved':
        return <span className="text-blue-600 font-bold">approved</span>;
      case 'processing':
        return <span className="text-yellow-600 font-bold">processing</span>;
      default:
        return <span className="text-gray-500 font-bold">{status}</span>;
    }
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FaMoneyBillWave className="text-green-600" />
          Recent Withdrawals
        </CardTitle>

        {/* Platform Wallet Connection Status */}
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FaWallet className="text-blue-600" />
              <span className="text-sm font-medium text-blue-900">Platform Wallet Status:</span>
            </div>
            <div className="flex items-center gap-2">
              {isConnected ? (
                walletAddress?.toLowerCase() === platform_wallet_address.toLowerCase() ? (
                  <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                    <FaCheckCircle className="w-4 h-4" />
                    Platform Wallet Connected
                  </span>
                ) : (
                  <span className="text-red-600 text-sm font-medium flex items-center gap-1">
                    <FaTimes className="w-4 h-4" />
                    Wrong Wallet Connected
                  </span>
                )
              ) : (
                <span className="text-yellow-600 text-sm font-medium flex items-center gap-1">
                  <FaClock className="w-4 h-4" />
                  No Wallet Connected
                </span>
              )}
            </div>
          </div>
          <div className="mt-2 text-xs text-blue-700">
            Required: {platform_wallet_address.slice(0, 6)}...{platform_wallet_address.slice(-4)}
            {!isConnected && (
              <Button
                size="sm"
                variant="outline"
                className="ml-2 h-6 text-xs"
                onClick={() => connectWallet(platform_wallet_address)}
              >
                Connect Wallet
              </Button>
            )}
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-2 mt-4">
          <input
            type="text"
            placeholder="Search by any field..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full mt-4 px-3 py-2 border rounded focus:outline-none focus:ring focus:border-green-400 text-sm"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto w-full">
          <table className="min-w-full w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-3 py-2 text-left font-semibold">User</th>
                <th className="px-3 py-2 text-left font-semibold">Requested Amount</th>
                <th className="px-3 py-2 text-left font-semibold">Fee ({withdrawal_fee_percentage}%)</th>
                <th className="px-3 py-2 text-left font-semibold">Net Amount</th>
                <th className="px-3 py-2 text-left font-semibold">Status</th>
                <th className="px-3 py-2 text-left font-semibold">Actions</th>
                {/* <th className="px-3 py-2 text-left font-semibold">Created</th> */}
                <th className="px-3 py-2 text-left font-semibold">Updated</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((withdrawal) => {
                const feePercentage = parseFloat(withdrawal_fee_percentage);
                const originalAmount = withdrawal.amount;
                const feeAmount = (originalAmount * feePercentage) / 100;
                const netAmount = originalAmount - feeAmount;

                return (
                  <tr key={withdrawal.id} className="border-b last:border-0">
                    <td className="px-3 py-2 whitespace-nowrap">{withdrawal.user?.name || '-'}</td>
                    <td className="px-3 py-2 whitespace-nowrap font-medium">{originalAmount} USDT</td>
                    <td className="px-3 py-2 whitespace-nowrap text-red-600">-{feeAmount.toFixed(2)} USDT</td>
                    <td className="px-3 py-2 whitespace-nowrap font-bold text-green-600">{netAmount.toFixed(2)} USDT</td>
                    <td className="px-3 py-2 whitespace-nowrap">{getStatusBadge(withdrawal.status)}</td>
                    <td className="px-2 py-2 whitespace-nowrap">
                      {withdrawal.status === 'pending' ? (
                        <div className="flex gap-1">
                                                  <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white text-xs h-8 flex flex-col"
                          onClick={() => handleApprove(withdrawal)}
                          title={`Approve ${withdrawal.amount - (withdrawal.amount * parseFloat(withdrawal_fee_percentage) / 100)} USDT (${withdrawal.amount} - ${(withdrawal.amount * parseFloat(withdrawal_fee_percentage) / 100).toFixed(2)} fee)`}
                        >
                          <div className="flex items-center">
                            <FaCheck className="w-3 mr-1" /> {netAmount.toFixed(0)}
                          </div>
                          <span className="text-xs leading-none mt-[-10px]">Approve</span>
                        </Button>
                        <Button
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white text-xs h-8 flex flex-col"
                          onClick={() => setRejectModal(withdrawal)}
                        >
                          <FaTimes className="w-3" />
                          <span className="text-xs leading-none  mt-[-10px]">Reject</span>
                        </Button>
                        </div>
                      ) : null}
                    </td>
                    {/* <td className="px-3 py-2 whitespace-nowrap">{new Date(withdrawal.created_at).toLocaleString()}</td> */}
                    <td className="px-3 py-2 whitespace-nowrap">{new Date(withdrawal.updated_at).toLocaleString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
      <div className="flex justify-center items-center gap-4 pb-4">
        <select
          className="w-full md:w-32 px-3 py-2 border rounded focus:outline-none focus:ring focus:border-green-400 text-sm"
          value={limit}
          onChange={e => {
            const newLimit = parseInt(e.target.value, 10);
            setLimit(newLimit);
            if (isMore) dispatch(fetchPageData(newLimit, list.length, "withdrawals"));
          }}
        >
          {[10, 20, 50, 100].map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <button
          className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 transition"
          disabled={!isMore}
          onClick={() => dispatch(fetchPageData(limit, list.length, "withdrawals"))}
        >
          View More
        </button>
      </div>
      {/* Reject Confirmation Modal */}
      <Dialog open={!!rejectModal} onOpenChange={() => setRejectModal(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Rejection</DialogTitle>
          </DialogHeader>
          <div>Are you sure you want to reject withdrawal to {rejectModal?.user.name}?</div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectModal(null)}>Cancel</Button>
            <Button
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={() => {
                if (rejectModal) handleReject(rejectModal);
                setRejectModal(null);
              }}
            >
              Reject
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default RecentWithdrawals; 