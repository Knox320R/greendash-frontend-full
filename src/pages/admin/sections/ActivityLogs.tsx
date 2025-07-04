import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { activitiesApi, Activity } from '@/store/activities';
import { usersApi, User } from '@/store/users';

const ActivityLogs: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const activities = useSelector((state: RootState) => state.activities.list) as Activity[];
  const activitiesLoading = useSelector((state: RootState) => state.activities.isLoading);
  const users = useSelector((state: RootState) => state.users.list) as User[];

  useEffect(() => {
    dispatch(activitiesApi.get());
    if (users.length === 0) dispatch(usersApi.get());
  }, [dispatch, users.length]);

  const userMap = users.reduce((acc, user) => {
    acc[user.id] = user;
    return acc;
  }, {} as Record<number, User>);

  return (
    <div className="w-full flex justify-center">
      <div className="bg-white rounded shadow p-6 w-[90%] min-w-[900px]">
        <div className="mb-4 text-lg font-semibold text-green-700">Activity Logs</div>
        {activitiesLoading ? (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-600"></div>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-gray-500 text-center py-8">No activities found.</div>
        ) : (
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-2 border">User</th>
                <th className="p-2 border">Action</th>
                <th className="p-2 border">Details</th>
                <th className="p-2 border">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {activities.map((activity) => (
                <tr key={activity.id} className="border-b hover:bg-gray-50">
                  <td className="p-2 border text-sm">
                    {userMap[activity.user_id]?.name || 'N/A'}
                  </td>
                  <td className="p-2 border">{activity.action}</td>
                  <td className="p-2 border text-xs">
                    {activity.details && (
                      <pre className="bg-gray-50 p-2 rounded whitespace-pre-wrap break-all">
                        {JSON.stringify(activity.details, null, 2)}
                      </pre>
                    )}
                  </td>
                  <td className="p-2 border text-center text-xs">
                    {new Date(activity.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default ActivityLogs; 