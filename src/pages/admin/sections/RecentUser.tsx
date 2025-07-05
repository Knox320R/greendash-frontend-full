import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FaUser } from 'react-icons/fa';
import { fetchPageData } from '@/store/admin';

const RecentUser: React.FC = () => {
  const { list, isMore } = useSelector((state: RootState) => state.adminData?.users || { list: [], isMore: true });
  const [limit, setLimit] = useState(10)

  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    if(isMore) dispatch(fetchPageData(limit, list.length, "users"))
  }, [])

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FaUser className="text-blue-600" />
          Recent Users
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-3 py-2 text-left font-semibold">Name</th>
                <th className="px-3 py-2 text-left font-semibold">Email</th>
                <th className="px-3 py-2 text-left font-semibold">Joined</th>
                <th className="px-3 py-2 text-left font-semibold">Email Verified</th>
                <th className="px-3 py-2 text-left font-semibold">Active</th>
              </tr>
            </thead>
            <tbody>
              {list.slice(0, 10).map((user) => (
                <tr key={user.id} className="border-b last:border-0">
                  <td className="px-3 py-2 whitespace-nowrap">{user.name}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{user.email}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{new Date(user.created_at).toLocaleString()}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {user.is_email_verified ? (
                      <span className="text-green-600 font-bold">Yes</span>
                    ) : (
                      <span className="text-gray-400">No</span>
                    )}
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {user.is_active ? (
                      <span className="text-green-600 font-bold">Yes</span>
                    ) : (
                      <span className="text-gray-400">No</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentUser; 