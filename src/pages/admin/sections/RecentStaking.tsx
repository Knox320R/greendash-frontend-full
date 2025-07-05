import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FaCoins } from 'react-icons/fa';
import { fetchPageData } from '@/store/admin';

const RecentStaking: React.FC = () => {

  const { list, isMore } = useSelector((state: RootState) => state.adminData?.stakings || { list: [], isMore: true });
  const [limit, setLimit] = useState(10)

  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    if(isMore) dispatch(fetchPageData(limit, list.length, "stakings"))
  }, [])

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FaCoins className="text-green-600" />
          Recent Stakings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-3 py-2 text-left font-semibold">User</th>
                <th className="px-3 py-2 text-left font-semibold">Package</th>
                <th className="px-3 py-2 text-left font-semibold">Amount</th>
                <th className="px-3 py-2 text-left font-semibold">Status</th>
                <th className="px-3 py-2 text-left font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {list.slice(0, 10).map((staking) => (
                <tr key={staking.id} className="border-b last:border-0">
                  <td className="px-3 py-2 whitespace-nowrap">{staking.user?.name || '-'}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{staking.package?.name || '-'}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{staking.package?.stake_amount || '-'}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <span className={
                      staking.status === 'active'
                        ? 'text-green-600 font-bold'
                        : staking.status === 'completed'
                        ? 'text-blue-600 font-bold'
                        : 'text-gray-400'
                    }>
                      {staking.status}
                    </span>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">{new Date(staking.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentStaking; 