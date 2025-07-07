import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FaExchangeAlt } from 'react-icons/fa';
import { fetchPageData } from '@/store/admin';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const RecentTransaction: React.FC = () => {
  const { list, isMore } = useSelector((state: RootState) => state.adminData?.transactions || { list: [], isMore: true });
  const [limit, setLimit] = useState(5)
  const [search, setSearch] = useState('');
  const [rejectModalTx, setRejectModalTx] = useState(null);

  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    if(isMore && list.length === 0) dispatch(fetchPageData(limit, list.length, "transactions"))
  }, [])

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

  const filtered = list.filter(tx =>
    flatten(tx).some(val =>
      (val !== null && val !== undefined && val.toString().toLowerCase().includes(search.toLowerCase()))
    )
  );

  function handleAgree(tx) {
    // TODO: Implement approve logic
    alert(`Agreed to transaction ${tx.id}`);
  }

  function handleReject(tx) {
    // TODO: Implement reject logic
    alert(`Rejected transaction ${tx.id}`);
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FaExchangeAlt className="text-purple-600" />
          Recent Transactions
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
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-3 py-2 text-left font-semibold">User</th>
                <th className="px-3 py-2 text-left font-semibold">Type</th>
                <th className="px-3 py-2 text-left font-semibold">Direction</th>
                <th className="px-3 py-2 text-left font-semibold">Amount</th>
                <th className="px-3 py-2 text-left font-semibold">Status</th>
                <th className="px-3 py-2 text-left font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 10).map((tx) => (
                <tr key={tx.id} className="border-b last:border-0">
                  <td className="px-3 py-2 whitespace-nowrap">{tx.user?.name || '-'}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{tx.type}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{tx.direction}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{tx.amount}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={
                      tx.status === 'completed'
                        ? 'text-green-600 font-bold'
                        : tx.status === 'pending'
                        ? 'text-yellow-600 font-bold'
                        : 'text-gray-400'
                    }>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">{new Date(tx.created_at).toLocaleString()}</td>
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
            if (isMore) dispatch(fetchPageData(newLimit, list.length, "transactions"));
          }}
        >
          {[10, 20, 50, 100].map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <button
          className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 transition"
          disabled={!isMore}
          onClick={() => dispatch(fetchPageData(limit, list.length, "transactions"))}
        >
          View More
        </button>
      </div>
      {rejectModalTx && (
        <Dialog open={!!rejectModalTx} onOpenChange={() => setRejectModalTx(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Rejection</DialogTitle>
            </DialogHeader>
            <div>Are you sure you want to reject transaction #{rejectModalTx.id}?</div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setRejectModalTx(null)}>Cancel</Button>
              <Button
                className="bg-red-600 hover:bg-red-700 text-white"
                onClick={() => {
                  handleReject(rejectModalTx);
                  setRejectModalTx(null);
                }}
              >
                Reject
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </Card>
  );
};

export default RecentTransaction; 