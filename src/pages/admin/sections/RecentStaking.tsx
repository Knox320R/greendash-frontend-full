import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FaCoins } from 'react-icons/fa';
import { fetchPageData } from '@/store/admin';

const RecentStaking: React.FC = () => {
  const { list, isMore } = useSelector((state: RootState) => state.adminData?.stakings || { list: [], isMore: true });
  const [limit, setLimit] = useState(5)
  const [search, setSearch] = useState('');

  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    if (isMore && list.length === 0) dispatch(fetchPageData(limit, list.length, "stakings"))
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

  const filtered = list.filter(staking =>
    flatten(staking).some(val =>
      (val !== null && val !== undefined && val.toString().toLowerCase().includes(search.toLowerCase()))
    )
  );

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FaCoins className="text-green-600" />
          Recent Stakings
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
                <th className="px-3 py-2 text-left font-semibold">Package</th>
                <th className="px-3 py-2 text-left font-semibold">Amount</th>
                <th className="px-3 py-2 text-left font-semibold">Status</th>
                <th className="px-3 py-2 text-left font-semibold">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.slice(0, 10).map((staking) => (
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
        <div className="flex justify-center items-center gap-4 pb-4">
          <select
            className="w-full md:w-[200px] px-3 py-2 border rounded focus:outline-none focus:ring focus:border-green-400 text-sm"
            value={limit}
            onChange={e => {
              const newLimit = parseInt(e.target.value, 10);
              setLimit(newLimit);
              if (isMore) dispatch(fetchPageData(newLimit, list.length, "stakings"));
            }}
          >
            {[10, 20, 50, 100].map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
          <button
            className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 transition"
            disabled={!isMore}
            onClick={() => dispatch(fetchPageData(limit, list.length, "stakings"))}
          >
            View More
          </button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentStaking; 