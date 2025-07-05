import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { FaUsers, FaCoins, FaLock, FaHistory, FaCog, FaEye, FaEdit, FaTrash, FaSave, FaPlus, FaExclamationTriangle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';
import { DashboardStatistics, RecentUser, RecentStaking, RecentTransaction, AdminSetting } from '@/types/admin';

const Admin = () => {
  const { user } = useAuth();
  const [dashboard, setDashboard] = useState<DashboardStatistics | null>(null);
  const [settings, setSettings] = useState<AdminSetting[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [settingsLoading, setSettingsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [settingsEdit, setSettingsEdit] = useState<{ [id: number]: AdminSetting | null }>({});
  const [newSetting, setNewSetting] = useState<Partial<AdminSetting>>({ title: '', value: '' });

  useEffect(() => {
    const fetchDashboard = async () => {
      setIsLoading(true);
      try {
        const res = await api.get<{ success: boolean; data: DashboardStatistics }>('/admin/stats');
        if (res.success) {
          setDashboard(res.data);
          setSettings(res.data.adminSettings)
        }
      } catch (e) {
        console.error('Failed to fetch dashboard:', e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  // CRUD for settings
  const handleSettingChange = (id: number, field: keyof AdminSetting, value: string) => {
    setSettingsEdit((prev) => ({ ...prev, [id]: { ...prev[id], [field]: value } }));
  };
  const handleEditSetting = (setting: AdminSetting) => {
    setSettingsEdit((prev) => ({ ...prev, [setting.id]: { ...setting } }));
  };
  const handleCancelEdit = (id: number) => {
    setSettingsEdit((prev) => ({ ...prev, [id]: null }));
  };
  const handleSaveSetting = async (id: number) => {
    const edited = settingsEdit[id];
    if (!edited) return;
    setSettingsLoading(true);
    try {
      const res = await api.put<{ success: boolean; data: AdminSetting }>(`/admin/settings/${id}`, edited);
      if (res.success) {
        setSettings((prev) => prev.map((s) => (s.id === id ? res.data : s)));
        setSettingsEdit((prev) => ({ ...prev, [id]: null }));
      }
    } catch (e) {
      alert('Failed to update setting.');
    } finally {
      setSettingsLoading(false);
    }
  };
  const handleDeleteSetting = async (id: number) => {
    if (!window.confirm('Delete this setting?')) return;
    setSettingsLoading(true);
    try {
      const res = await api.delete<{ success: boolean }>(`/admin/settings/${id}`);
      if (res.success) {
        setSettings((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (e) {
      alert('Failed to delete setting.');
    } finally {
      setSettingsLoading(false);
    }
  };
  const handleAddSetting = async () => {
    if (!newSetting.title || !newSetting.value) return;
    setSettingsLoading(true);
    try {
      const res = await api.post<{ success: boolean; data: AdminSetting }>(`/admin/settings`, newSetting);
      if (res.success) {
        setSettings((prev) => [...prev, res.data]);
        setNewSetting({ title: '', value: '' });
      }
    } catch (e) {
      alert('Failed to add setting.');
    } finally {
      setSettingsLoading(false);
    }
  };

  const filteredUsers = dashboard?.recent_activities.users.filter(user =>
    user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.last_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!user || !user.is_admin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FaExclamationTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Access Denied</h3>
          <p className="text-muted-foreground">
            You don't have permission to access the admin panel
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage users, stakings, transactions, and system settings</p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <FaUsers className="h-4 w-4 text-blue-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboard?.users.total || 0}</div>
              <p className="text-xs text-muted-foreground">{dashboard?.users.active || 0} active, {dashboard?.users.verified || 0} verified</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Staked</CardTitle>
              <FaLock className="h-4 w-4 text-green-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboard?.staking.total_staked || 0}</div>
              <p className="text-xs text-muted-foreground">{dashboard?.staking.active || 0} active, {dashboard?.staking.total_rewards_paid || 0} rewards paid</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Invested</CardTitle>
              <FaCoins className="h-4 w-4 text-orange-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(dashboard?.financial.total_invested || 0)}</div>
              <p className="text-xs text-muted-foreground">{formatCurrency(dashboard?.financial.total_earned || 0)} earned, {formatCurrency(dashboard?.financial.total_withdrawn || 0)} withdrawn</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Withdrawals</CardTitle>
              <FaExclamationTriangle className="h-4 w-4 text-red-600" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboard?.withdrawals.pending || 0}</div>
              <p className="text-xs text-muted-foreground">{formatCurrency(dashboard?.withdrawals.pending_amount || 0)} pending</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Tabs defaultValue="users" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="stakings">Staking Management</TabsTrigger>
              <TabsTrigger value="transactions">Transaction Management</TabsTrigger>
              <TabsTrigger value="settings">System Settings</TabsTrigger>
            </TabsList>

            {/* User Management */}
            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <FaUsers className="h-5 w-5 text-blue-600" />
                      User Management
                    </span>
                    <div className="flex gap-2">
                      <Input placeholder="Search users..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-64" />
                    </div>
                  </CardTitle>
                  <CardDescription>Manage user accounts</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">User</th>
                          <th className="text-left p-2">Email</th>
                          <th className="text-left p-2">Status</th>
                          <th className="text-left p-2">Joined</th>
                          <th className="text-left p-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="border-b hover:bg-gray-50">
                            <td className="p-2">
                              <div>
                                <p className="font-medium">{user.first_name} {user.last_name}</p>
                              </div>
                            </td>
                            <td className="p-2">{user.email}</td>
                            <td className="p-2">
                              <Badge variant={user.is_email_verified ? "default" : "secondary"}>{user.is_email_verified ? "Verified" : "Pending"}</Badge>
                            </td>
                            <td className="p-2">{formatDate(user.created_at)}</td>
                            <td className="p-2">
                              <div className="flex gap-1">
                                <Button size="sm" variant="outline"><FaEye className="h-3 w-3" /></Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Staking Management */}
            <TabsContent value="stakings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FaLock className="h-5 w-5 text-green-600" />
                    Staking Management
                  </CardTitle>
                  <CardDescription>Monitor and manage user stakings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">User</th>
                          <th className="text-left p-2">Package</th>
                          <th className="text-left p-2">Amount</th>
                          <th className="text-left p-2">Last Reward</th>
                          <th className="text-left p-2">Status</th>
                          <th className="text-left p-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboard?.recent_activities.stakings.map((staking) => (
                          <tr key={staking.id} className="border-b hover:bg-gray-50">
                            <td className="p-2">
                              <div>
                                <p className="font-medium">{staking.user.first_name} {staking.user.last_name}</p>
                                <p className="text-sm text-muted-foreground">{staking.user.email}</p>
                              </div>
                            </td>
                            <td className="p-2">{staking.package.name}</td>
                            <td className="p-2">{staking.payment_amount}</td>
                            <td className="p-2">{staking.last_reward_date || '-'}</td>
                            <td className="p-2">
                              <Badge className={getStatusColor(staking.status)}>{staking.status}</Badge>
                            </td>
                            <td className="p-2">
                              <div className="flex gap-1">
                                <Button size="sm" variant="outline"><FaEye className="h-3 w-3" /></Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Transaction Management */}
            <TabsContent value="transactions" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FaHistory className="h-5 w-5 text-gray-600" />
                    Transaction Management
                  </CardTitle>
                  <CardDescription>Review recent transactions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">User</th>
                          <th className="text-left p-2">Type</th>
                          <th className="text-left p-2">Amount</th>
                          <th className="text-left p-2">Status</th>
                          <th className="text-left p-2">Created</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dashboard?.recent_activities.transactions.map((tx) => (
                          <tr key={tx.id} className="border-b hover:bg-gray-50">
                            <td className="p-2">
                              <div>
                                <p className="font-medium">{tx.user.first_name} {tx.user.last_name}</p>
                                <p className="text-sm text-muted-foreground">{tx.user.email}</p>
                              </div>
                            </td>
                            <td className="p-2">{tx.transaction_type}</td>
                            <td className="p-2">{tx.amount}</td>
                            <td className="p-2">
                              <Badge className={getStatusColor(tx.status)}>{tx.status}</Badge>
                            </td>
                            <td className="p-2">{formatDate(tx.created_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* System Settings CRUD */}
            <TabsContent value="settings" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FaCog className="h-5 w-5 text-gray-600" />
                    System Settings
                  </CardTitle>
                  <CardDescription>Manage system-wide settings and parameters</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="mb-4">
                    <div className="flex gap-2 mb-2">
                      <Input placeholder="Title" value={newSetting.title} onChange={e => setNewSetting(s => ({ ...s, title: e.target.value }))} className="w-48" disabled={settingsLoading} />
                      <Input placeholder="Value" value={newSetting.value} onChange={e => setNewSetting(s => ({ ...s, value: e.target.value }))} className="w-48" disabled={settingsLoading} />
                      <Button onClick={handleAddSetting} disabled={settingsLoading}><FaPlus className="mr-2 h-4 w-4" /> Add</Button>
                    </div>
                    <table className="w-full">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left p-2">Title</th>
                          <th className="text-left p-2">Value</th>
                          <th className="text-left p-2">Description</th>
                          <th className="text-left p-2">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {settings.map(setting => (
                          <tr key={setting.id} className="border-b hover:bg-gray-50">
                            <td className="p-2">
                              {settingsEdit[setting.id] ? (
                                <Input value={settingsEdit[setting.id]?.title || ''} onChange={e => handleSettingChange(setting.id, 'title', e.target.value)} className="w-40" disabled={settingsLoading} />
                              ) : (
                                <span>{setting.title}</span>
                              )}
                            </td>
                            <td className="p-2">
                              {settingsEdit[setting.id] ? (
                                <Input value={settingsEdit[setting.id]?.value || ''} onChange={e => handleSettingChange(setting.id, 'value', e.target.value)} className="w-40" disabled={settingsLoading} />
                              ) : (
                                <span>{setting.value}</span>
                              )}
                            </td>
                            <td className="p-2">
                              {settingsEdit[setting.id] ? (
                                <Input value={settingsEdit[setting.id]?.description || ''} onChange={e => handleSettingChange(setting.id, 'description', e.target.value)} className="w-40" disabled={settingsLoading} />
                              ) : (
                                <span>{setting.description || '-'}</span>
                              )}
                            </td>
                            <td className="p-2">
                              <div className="flex gap-1">
                                {settingsEdit[setting.id] ? (
                                  <>
                                    <Button size="sm" variant="outline" onClick={() => handleSaveSetting(setting.id)} disabled={settingsLoading}><FaSave className="h-3 w-3" /></Button>
                                    <Button size="sm" variant="outline" onClick={() => handleCancelEdit(setting.id)} disabled={settingsLoading}><FaTrash className="h-3 w-3" /></Button>
                                  </>
                                ) : (
                                  <>
                                    <Button size="sm" variant="outline" onClick={() => handleEditSetting(setting)} disabled={settingsLoading}><FaEdit className="h-3 w-3" /></Button>
                                    <Button size="sm" variant="outline" onClick={() => handleDeleteSetting(setting.id)} disabled={settingsLoading}><FaTrash className="h-3 w-3" /></Button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default Admin; 