import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { FaUser } from 'react-icons/fa';
import { fetchPageData, updateUserActive, adminForceStake } from '@/store/admin';
import { UserData } from '@/types/landing';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const RecentUser: React.FC = () => {
  const { list, isMore } = useSelector((state: RootState) => state.adminData?.users || { list: [], isMore: true });
  const [limit, setLimit] = useState(10)
  const [search, setSearch] = useState('');
  const stakingPackages = useSelector((state: RootState) => state.adminData?.staking_packages || []);
  const [stakeModalUser, setStakeModalUser] = useState<UserData | null>(null);
  const [selectedPackageId, setSelectedPackageId] = useState<number | null>(null);
  const [isStaking, setIsStaking] = useState(false);

  const dispatch = useDispatch<AppDispatch>()
  useEffect(() => {
    if (isMore && list.length === 0) dispatch(fetchPageData(limit, list.length, "users"))
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

  const filtered = list.filter(user =>
    flatten(user).some(val =>
      (val !== null && val !== undefined && val.toString().toLowerCase().includes(search.toLowerCase()))
    )
  );

  const handleToggleActive = (user: UserData) => {
    const newActiveState = !user.is_active;
    dispatch(updateUserActive(user.is_email_verified, !user.is_active, { ...user, is_active: newActiveState }));
  };
  const handleVerifyEmail = (user: UserData) => {
    dispatch(updateUserActive(true, user.is_active, { ...user, is_email_verified: true }));
  };

  const handleForceStake = async (user_id: number) => {

    if(!window.confirm('Are you sure to offer tokens for free ?')) return
    console.log(user_id, selectedPackageId);
    
    if (!stakeModalUser || !selectedPackageId) return;
    setIsStaking(true);
    try {
      // Dispatch the new adminForceStake action (to be implemented)
      await dispatch<any>(adminForceStake(user_id, selectedPackageId));
      setStakeModalUser(null);
      setSelectedPackageId(null);
    } catch (e) {
      // error feedback handled in action
    } finally {
      setIsStaking(false);
    }
  };

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FaUser className="text-blue-600" />
          Recent Users
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
        <div className="overflow-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-3 py-2 text-left font-semibold">Name</th>
                <th className="px-3 py-2 text-left font-semibold">Email</th>
                <th className="px-3 py-2 text-left font-semibold">Joined</th>
                <th className="px-3 py-2 text-left font-semibold">Email Verified</th>
                <th className="px-3 py-2 text-left font-semibold">Active</th>
                <th className="px-3 py-2 text-left font-semibold">Stake</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user: UserData) => (
                <tr key={user.id} className="border-b last:border-0">
                  <td className="px-3 py-2 whitespace-nowrap">{user.name}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{user.email}</td>
                  <td className="px-3 py-2 whitespace-nowrap">{new Date(user.created_at).toLocaleString()}</td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {
                      user.is_email_verified ?
                        <span> Yes </span>
                        :
                        <button
                          onClick={() => handleVerifyEmail(user)}
                          className={`px-3 py-1 rounded text-xs font-medium transition-colors bg-blue-100 text-blue-800 hover:bg-blue-200`}
                        >
                          Verify
                        </button>
                    }
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleActive(user)}
                      className={`px-3 py-1 rounded text-xs font-medium transition-colors ${user.is_active
                        ? 'bg-green-100 text-green-800 hover:bg-green-200'
                        : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                    >
                      {user.is_active ? 'Active' : 'Inactive'}
                    </button>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="sm" variant="outline" onClick={() => { setStakeModalUser(user); setSelectedPackageId(null); }}>Stake</Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Stake for {user.name}</DialogTitle>
                        </DialogHeader>
                        <div className="my-4">
                          <div className="mb-4 p-2 bg-gray-50 rounded border text-sm">
                            <div><span className="font-semibold">User:</span> {user.name}</div>
                            <div><span className="font-semibold">Email:</span> {user.email}</div>
                          </div>
                          <label className="block mb-2 text-sm font-medium">Select Staking Package</label>
                          <select
                            className="w-full px-3 py-2 border rounded focus:outline-none focus:ring focus:border-green-400 text-sm"
                            value={selectedPackageId ?? ''}
                            onChange={e => setSelectedPackageId(Number(e.target.value))}
                          >
                            <option value="" disabled>Select a package</option>
                            {stakingPackages.map(pkg => (
                              <option key={pkg.id} value={pkg.id}>
                                {pkg.name} - {parseInt(pkg.stake_amount)} EGD, {pkg.daily_yield_percentage}% for {pkg.lock_period_days}d
                              </option>
                            ))}
                          </select>
                        </div>
                        <DialogFooter>
                          <Button onClick={() => handleForceStake(user.id)} disabled={!selectedPackageId || isStaking} className="bg-green-600 hover:bg-green-700 text-white">
                            {isStaking ? 'Staking...' : 'Confirm Stake'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
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
            if (isMore) dispatch(fetchPageData(newLimit, list.length, "users"));
          }}
        >
          {[10, 20, 50, 100].map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <button
          className="mt-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 transition"
          disabled={!isMore}
          onClick={() => dispatch(fetchPageData(limit, list.length, "users"))}
        >
          View More
        </button>
      </div>
    </Card>
  );
};

export default RecentUser;