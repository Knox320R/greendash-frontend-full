import React, { useEffect, useState } from 'react';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { formatPercentage, getTransactionTypeLabel, getWithdrawalStatusColor } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  LineChart, 
  Line, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { Calendar, TrendingUp, TrendingDown, DollarSign, Activity } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export const FinancialAnalytics: React.FC = () => {
  const {
    dashboardData,
    dashboardLoading,
    fetchDashboardData,
    fetchDataForPeriod,
    getSummaryStats,
    getTransactionsByType,
    getWithdrawalsByStatus
  } = useAdminDashboard();

  const [selectedPeriod, setSelectedPeriod] = useState<'today' | 'week' | 'month' | 'custom'>('custom');
  const [customStartDate, setCustomStartDate] = useState('2024-07-30 04:30:28');
  const [customEndDate, setCustomEndDate] = useState('2025-07-31 04:30:28');
  const [customFetched, setCustomFetched] = useState(false);

  useEffect(() => {
    if (selectedPeriod === 'custom') {
      setCustomFetched(false); // reset fetch state when switching to custom
    } else {
      fetchDataForPeriod(selectedPeriod);
    }
    // eslint-disable-next-line
  }, [selectedPeriod]);

  useEffect(() => {
    fetchDashboardData(customStartDate, customEndDate);
    setCustomFetched(true);
  }, [])
  // Only fetch for custom when button is clicked
  const handleFetchCustom = () => {
    if (customStartDate && customEndDate) {
      fetchDashboardData(customStartDate, customEndDate);
      setCustomFetched(true);
    }
  };

  const summaryStats = getSummaryStats();
  const transactionsByType = getTransactionsByType();
  const withdrawalsByStatus = getWithdrawalsByStatus();

  // Prepare chart data
  const transactionTypeData = Object.entries(transactionsByType).map(([type, count]) => ({
    name: getTransactionTypeLabel(type),
    value: count,
    type
  }));

  const withdrawalStatusData = Object.entries(withdrawalsByStatus).map(([status, count]) => ({
    name: status.charAt(0).toUpperCase() + status.slice(1),
    value: count,
    status
  }));

  const dailyTransactionData = dashboardData?.transactions.reduce((acc, tx) => {
    const date = new Date(tx.created_at).toLocaleDateString();
    const existing = acc.find(item => item.date === date);
    if (existing) {
      existing.amount += tx.amount;
      existing.count += 1;
    } else {
      acc.push({ date, amount: tx.amount, count: 1 });
    }
    return acc;
  }, [] as Array<{ date: string; amount: number; count: number }>) || [];

  const dailyWithdrawalData = dashboardData?.withdrawals.reduce((acc, wd) => {
    const date = new Date(wd.createdAt).toLocaleDateString();
    const existing = acc.find(item => item.date === date);
    if (existing) {
      existing.amount += wd.amount;
      existing.count += 1;
    } else {
      acc.push({ date, amount: wd.amount, count: 1 });
    }
    return acc;
  }, [] as Array<{ date: string; amount: number; count: number }>) || [];

  if (dashboardLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-lg">Loading financial analytics...</div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header with Date Selection */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">Financial Analytics Dashboard</h2>
          {dashboardData && (
            <p className="text-gray-600">
              {new Date(dashboardData.period.start_date).toLocaleDateString()} - {new Date(dashboardData.period.end_date).toLocaleDateString()}
            </p>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <Select value={selectedPeriod} onValueChange={(value: any) => setSelectedPeriod(value)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="week">This Week</SelectItem>
              <SelectItem value="month">This Month</SelectItem>
              <SelectItem value="custom" defaultChecked>Custom Range</SelectItem>
            </SelectContent>
          </Select>

          {selectedPeriod === 'custom' && (
            <div className="flex flex-col gap-2">
              <div className="flex gap-2 items-center">
                <div className="flex flex-col gap-1">
                  <Label htmlFor="start-date" className="text-xs">Start Date</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={customStartDate}
                    onChange={(e) => setCustomStartDate(e.target.value)}
                    className="w-40"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <Label htmlFor="end-date" className="text-xs">End Date</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={customEndDate}
                    onChange={(e) => setCustomEndDate(e.target.value)}
                    className="w-40"
                  />
                </div>
              </div>
              <button
                className="mt-2 px-4 py-2 bg-green-600 text-white rounded disabled:opacity-50"
                disabled={!customStartDate || !customEndDate}
                onClick={handleFetchCustom}
              >
                Fetch
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      {summaryStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryStats.total_transactions}</div>
              <p className="text-xs text-muted-foreground">
                Amount: {(summaryStats.total_transaction_amount)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Withdrawals</CardTitle>
              <TrendingDown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryStats.total_withdrawals}</div>
              <p className="text-xs text-muted-foreground">
                Amount: {(summaryStats.total_withdrawal_amount)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Stakings</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summaryStats.total_stakings}</div>
              <p className="text-xs text-muted-foreground">
                Amount: {(summaryStats.total_staking_amount)}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Net Flow</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${summaryStats.net_flow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {(summaryStats.net_flow)}
              </div>
              <p className="text-xs text-muted-foreground">
                {summaryStats.net_flow >= 0 ? 'Positive' : 'Negative'} flow
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Charts Section */}
      {dashboardData && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Transaction Types Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Transaction Types Distribution</CardTitle>
              <CardDescription>Breakdown of transactions by type</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={transactionTypeData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {transactionTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Withdrawal Status Pie Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Withdrawal Status Distribution</CardTitle>
              <CardDescription>Breakdown of withdrawals by status</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={withdrawalStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {withdrawalStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Daily Transaction Amount Line Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Transaction Amounts</CardTitle>
              <CardDescription>Transaction amounts over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyTransactionData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => (value as number)} />
                  <Legend />
                  <Line type="monotone" dataKey="amount" stroke="#8884d8" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Daily Withdrawal Amount Line Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Daily Withdrawal Amounts</CardTitle>
              <CardDescription>Withdrawal amounts over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={dailyWithdrawalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip formatter={(value) => (value as number)} />
                  <Legend />
                  <Line type="monotone" dataKey="amount" stroke="#82ca9d" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Staking Graph - Full Width */}
      {dashboardData && (
        (() => {
          // Prepare daily staking data
          const dailyStakingData = dashboardData.stakings.reduce((acc, staking) => {
            const date = new Date(staking.createdAt).toLocaleDateString();
            const stakeAmount = parseFloat(staking.package.stake_amount);
            const existing = acc.find(item => item.date === date);
            if (existing) {
              existing.amount += stakeAmount;
              existing.count += 1;
            } else {
              acc.push({ date, amount: stakeAmount, count: 1 });
            }
            return acc;
          }, [] as Array<{ date: string; amount: number; count: number }>);

          // Sort by date ascending
          dailyStakingData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

          return (
            <div className="w-full my-6">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Staking Amounts</CardTitle>
                  <CardDescription>Staking amounts over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={350}>
                    <LineChart data={dailyStakingData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip formatter={(value) => (value as number)} />
                      <Legend />
                      <Line type="monotone" dataKey="amount" stroke="#00C49F" strokeWidth={2} name="Staked Amount" />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          );
        })()
      )}

      {/* Detailed Data Tabs */}
      {dashboardData && (
        <Tabs defaultValue="transactions" className="space-y-4">
          <TabsList>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="withdrawals">Withdrawals</TabsTrigger>
            <TabsTrigger value="stakings">Stakings</TabsTrigger>
          </TabsList>

          <TabsContent value="transactions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>All transactions in the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dashboardData.transactions.map((tx) => (
                      <TableRow key={tx.id}>
                        <TableCell>{tx.user.name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{getTransactionTypeLabel(tx.type)}</Badge>
                        </TableCell>
                        <TableCell>{(tx.amount)}</TableCell>
                        <TableCell>{new Date(tx.created_at).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="withdrawals" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Withdrawals</CardTitle>
                <CardDescription>All withdrawal requests in the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dashboardData.withdrawals.map((wd) => (
                      <TableRow key={wd.id}>
                        <TableCell>{wd.user.name}</TableCell>
                        <TableCell>{(wd.amount)}</TableCell>
                        <TableCell>
                          <Badge className={getWithdrawalStatusColor(wd.status)}>
                            {wd.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(wd.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stakings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Stakings</CardTitle>
                <CardDescription>All staking activities in the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>User</TableHead>
                      <TableHead>Package</TableHead>
                      <TableHead>Stake Amount</TableHead>
                      <TableHead>Daily Yield</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dashboardData.stakings.map((staking) => (
                      <TableRow key={staking.id}>
                        <TableCell>{staking.user.name}</TableCell>
                        <TableCell>{staking.package.name}</TableCell>
                        <TableCell>{(parseFloat(staking.package.stake_amount))}</TableCell>
                        <TableCell>{formatPercentage(staking.package.daily_yield_percentage)}</TableCell>
                        <TableCell>
                          <Badge variant={staking.status === 'active' ? 'default' : 'secondary'}>
                            {staking.status}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(staking.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}

      {!dashboardData && (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
          <p className="text-gray-600 mb-4">Select a date range to load financial analytics data.</p>
        </div>
      )}
    </div>
  );
}; 