import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { FaMoneyBillWave, FaCheck, FaTimes } from 'react-icons/fa';
import { approveWithdrawal, fetchPageData, rejectWithdrawal } from '@/store/admin';
import { WithdrawalItem } from '@/types/admin';

const RecentWithdrawals: React.FC = () => {
  const { list, isMore } = useSelector((state: RootState) => state.adminData?.withdrawals || { list: [], isMore: true });
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState('');
  const [rejectModal, setRejectModal] = useState<WithdrawalItem | null>(null);
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

  function handleApprove(withdrawal: WithdrawalItem) {
    dispatch(approveWithdrawal(withdrawal))
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
                <th className="px-3 py-2 text-left font-semibold">Amount</th>
                <th className="px-3 py-2 text-left font-semibold">Status</th>
                <th className="px-3 py-2 text-left font-semibold">Created</th>
                <th className="px-3 py-2 text-left font-semibold">Updated</th>
                <th className="px-3 py-2 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((withdrawal) => (
                <tr key={withdrawal.id} className="border-b last:border-0">
                  <td className="px-3 py-2 whitespace-nowrap">{withdrawal.user?.name || '-'}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{withdrawal.amount}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{getStatusBadge(withdrawal.status)}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{new Date(withdrawal.created_at).toLocaleString()}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{new Date(withdrawal.updated_at).toLocaleString()}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {withdrawal.status === 'pending' ? (
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white"
                          onClick={() => handleApprove(withdrawal)}
                        >
                          <FaCheck className="w-3 h-3 mr-1" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          className="bg-red-600 hover:bg-red-700 text-white"
                          onClick={() => setRejectModal(withdrawal)}
                        >
                          <FaTimes className="w-3 h-3 mr-1" /> Reject
                        </Button>
                      </div>
                    ) : null}
                  </td>
                </tr>
              ))}
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
          <div>Are you sure you want to reject withdrawal #{rejectModal?.id}?</div>
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