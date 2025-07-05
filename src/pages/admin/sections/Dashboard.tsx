import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  FaChartLine,
  FaUsers,
  FaCoins,
  FaDatabase,
  FaCog,
  FaEye,
  FaEdit,
} from 'react-icons/fa';

const Dashboard: React.FC = () => {
  const enterprise = useSelector((state: RootState) => state.adminData.enterprise);
  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Enterprise Dashboard</h2>
        <p className="text-gray-600">Overview of enterprise data and system statistics</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <FaUsers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enterprise?.users?.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              Active users in the system
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staked</CardTitle>
            <FaCoins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enterprise?.staking?.total_staked || 0} USDT</div>
            <p className="text-xs text-muted-foreground">
              Total amount staked across all users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Stakings</CardTitle>
            <FaDatabase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{enterprise?.staking?.active || 0}</div>
            <p className="text-xs text-muted-foreground">
              Currently active staking contracts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Status</CardTitle>
            <FaCog className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">Online</div>
            <p className="text-xs text-muted-foreground">
              All systems operational
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Enterprise Data Display */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FaChartLine className="h-5 w-5 text-green-600" />
              Enterprise Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {enterprise && Object.keys(enterprise).length > 0 ? (
                <div className="space-y-3">
                  {enterprise.users && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <h4 className="font-semibold text-blue-800 mb-2">Users</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Total:</span>
                          <span>{enterprise.users.total}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Active:</span>
                          <span>{enterprise.users.active}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Verified:</span>
                          <span>{enterprise.users.verified}</span>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {enterprise.staking && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h4 className="font-semibold text-green-800 mb-2">Staking</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Total Staked:</span>
                          <span>{enterprise.staking.total_staked} USDT</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Active:</span>
                          <span>{enterprise.staking.active}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Rewards Paid:</span>
                          <span>{enterprise.staking.total_rewards_paid} USDT</span>
                        </div>
                      </div>
                    </div>
                  )}

                  {enterprise.financial && (
                    <div className="p-3 bg-purple-50 rounded-lg">
                      <h4 className="font-semibold text-purple-800 mb-2">Financial</h4>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Total Invested:</span>
                          <span>{enterprise.financial.total_invested} USDT</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Earned:</span>
                          <span>{enterprise.financial.total_earned} USDT</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Total Withdrawn:</span>
                          <span>{enterprise.financial.total_withdrawn} USDT</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <FaDatabase className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No enterprise data available</p>
                  <p className="text-sm">Enterprise data will appear here when loaded</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FaEye className="h-5 w-5 text-blue-600" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <FaChartLine className="mr-2 h-4 w-4" />
                View Analytics
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <FaUsers className="mr-2 h-4 w-4" />
                User Management
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <FaCoins className="mr-2 h-4 w-4" />
                Staking Overview
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <FaEdit className="mr-2 h-4 w-4" />
                System Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard; 