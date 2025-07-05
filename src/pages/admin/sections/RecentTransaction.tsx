import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FaExchangeAlt } from 'react-icons/fa';
import { fetchPageData } from '@/store/admin';

const RecentTransaction: React.FC = () => {
  const { list, isMore } = useSelector((state: RootState) => state.adminData?.transactions || { list: [], isMore: true });
  const [limit, setLimit] = useState(10)

  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    if(isMore) dispatch(fetchPageData(limit, list.length, "users"))
  }, [])

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FaExchangeAlt className="text-purple-600" />
          Recent Transactions
        </CardTitle>
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
              {list.slice(0, 10).map((tx) => (
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
    </Card>
  );
};

export default RecentTransaction; 