import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaWallet,
  FaShieldAlt,
  FaCog,
  FaEdit,
  FaSave,
  FaTimes,
  FaCheckCircle,
  FaExclamationTriangle,
  FaCopy,
  FaQrcode,
  FaHistory,
  FaKey,
  FaBell
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { formatCurrency, formatDate, truncateAddress } from '@/lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { UserBaseData, UserData } from '@/types/landing';
import { setUser, updateUser } from '@/store/auth';
import { toast } from 'react-toastify';

const Profile = () => {

  const user = useSelector((store: RootState) => store.auth.user) as UserData | null;
  const user_base_data = useSelector((store: RootState) => store.auth.user_base_data) as UserBaseData | null;

  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState<Partial<UserData>>({
    name: '',
    email: '',
    wallet_address: '',
  });
  const dispatch = useDispatch()
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    current_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        wallet_address: user.wallet_address || '',
      });
    }
  }, [user]);

  const handleInputChange = (field: keyof UserData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const response = await api.put<{ success: boolean; data: { user: UserData } }>('/users/profile', formData);
      if (response.success) {
        dispatch(setUser(response.data.user)); // Refresh user data
        setIsEditing(false);
        alert('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        wallet_address: user.wallet_address || '',
      });
    }
    setIsEditing(false);
  };

  const copyReferralCode = async () => {
    try {
      await navigator.clipboard.writeText(user?.referral_code || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy referral code:', error);
    }
  };

  const copyWalletAddress = async () => {
    try {
      await navigator.clipboard.writeText(user?.wallet_address || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy wallet address:', error);
    }
  };

  const handlePasswordInput = (field: string, value: string) => {
    setPasswordForm(prev => ({ ...prev, [field]: value }));
  };

  const handleChangePassword = async () => {
    if (!passwordForm.current_password || !passwordForm.new_password || !passwordForm.confirm_password) {
      toast.error('Please fill in all password fields.');
      return;
    }
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error('New passwords do not match.');
      return;
    }
    if (passwordForm.new_password.length < 3) {
      toast.error('New password must be at least 3 characters.');
      return;
    }
    setIsChangingPassword(true);
    try {
      const response = await api.put<{ success: boolean; message: string }>('/users/change-password', {
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password
      });
      if (response.success) {
        toast.success('Password changed successfully!');
        setShowChangePassword(false);
        setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
      } else {
        toast.error(response.message || 'Failed to change password.');
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to change password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your account information and preferences
          </p>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Profile Information */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <FaUser className="h-5 w-5 text-green-600" />
                          Personal Information
                        </span>
                        {!isEditing ? (
                          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                            <FaEdit className="mr-2 h-4 w-4" />
                            Edit
                          </Button>
                        ) : (
                          <div className="flex gap-2">
                            <Button size="sm" onClick={handleSave} disabled={isLoading}>
                              {isLoading ? (
                                <>
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                                  Saving...
                                </>
                              ) : (
                                <>
                                  <FaSave className="mr-2 h-4 w-4" />
                                  Save
                                </>
                              )}
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleCancel}>
                              <FaTimes className="mr-2 h-4 w-4" />
                              Cancel
                            </Button>
                          </div>
                        )}
                      </CardTitle>
                      <CardDescription>
                        Update your personal information and contact details
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Name</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            disabled
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="wallet_address">Wallet Address (BEP-20)</Label>
                        <Input
                          id="wallet_address"
                          value={formData.wallet_address || ''}
                          onChange={(e) => handleInputChange('wallet_address', e.target.value)}
                          disabled={!isEditing}
                          placeholder="0x..."
                        />
                        {formData.wallet_address && (
                          <p className="text-sm text-muted-foreground">
                            {truncateAddress(formData.wallet_address)}
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Account Summary */}
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FaUser className="h-5 w-5 text-blue-600" />
                        Account Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Member Since</span>
                        <span className="text-sm font-medium">{formatDate(user.created_at)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Invested</span>
                        <span className="text-sm font-medium text-pink-600">{user_base_data.staking.total_staked} EGD</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Earned</span>
                        <span className="text-sm font-medium text-blue-600">{user_base_data.staking.total_rewards_earned}<span className='ml-1 text-[#888] text-[12px]'>EGD</span></span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">EGD Balance</span>
                        <span className="text-sm font-medium text-green-600">{user.egd_balance}<span className='ml-1 text-[#888] text-[12px]'>EGD</span></span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Available withdrawals</span>
                        <span className="text-sm font-medium text-yellow-600">{user.withdrawals}<span className='ml-1 text-[#888] text-[12px]'>USDT</span></span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FaQrcode className="h-5 w-5 text-purple-600" />
                        Referral Code
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label>Your Referral Code</Label>
                        <div className="flex gap-2">
                          <Input
                            value={user.referral_code}
                            readOnly
                            className="font-mono"
                          />
                          <Button variant="outline" onClick={copyReferralCode}>
                            {copied ? (
                              <>
                                <FaCheckCircle className="mr-2 h-4 w-4" />
                                Copied!
                              </>
                            ) : (
                              <>
                                <FaCopy className="mr-2 h-4 w-4" />
                                Copy
                              </>
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="bg-green-50 p-3 rounded-lg">
                        <p className="text-sm text-green-800">
                          Share this code with friends to earn referral rewards!
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="security" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FaKey className="h-5 w-5 text-red-600" />
                      Password & Security
                    </CardTitle>
                    <CardDescription>
                      Manage your password and security settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!showChangePassword ? (
                      <Button variant="outline" className="w-full" onClick={() => setShowChangePassword(true)}>
                        <FaKey className="mr-2 h-4 w-4" />
                        Change Password
                      </Button>
                    ) : (
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="current_password">Current Password</Label>
                          <Input
                            id="current_password"
                            type="password"
                            value={passwordForm.current_password}
                            onChange={e => handlePasswordInput('current_password', e.target.value)}
                            disabled={isChangingPassword}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new_password">New Password</Label>
                          <Input
                            id="new_password"
                            type="password"
                            value={passwordForm.new_password}
                            onChange={e => handlePasswordInput('new_password', e.target.value)}
                            disabled={isChangingPassword}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm_password">Confirm New Password</Label>
                          <Input
                            id="confirm_password"
                            type="password"
                            value={passwordForm.confirm_password}
                            onChange={e => handlePasswordInput('confirm_password', e.target.value)}
                            disabled={isChangingPassword}
                          />
                        </div>
                        <div className="flex gap-2">
                          <Button onClick={handleChangePassword} disabled={isChangingPassword}>
                            {isChangingPassword ? 'Saving...' : 'Save Password'}
                          </Button>
                          <Button variant="outline" onClick={() => setShowChangePassword(false)} disabled={isChangingPassword}>
                            Cancel
                          </Button>
                        </div>
                      </div>
                    )}
                    <Button variant="outline" className="w-full mt-4" disabled>
                      <FaShieldAlt className="mr-2 h-4 w-4" />
                      Enable 2FA
                    </Button>
                    <Button variant="outline" className="w-full" disabled>
                      <FaHistory className="mr-2 h-4 w-4" />
                      Login History
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FaWallet className="h-5 w-5 text-orange-600" />
                      Wallet Security
                    </CardTitle>
                    <CardDescription>
                      Manage your wallet connection and security
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {user.wallet_address ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <FaCheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-medium">Wallet Connected</span>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm font-mono">{truncateAddress(user.wallet_address)}</p>
                        </div>
                        <Button variant="outline" onClick={copyWalletAddress} className="w-full">
                          {copied ? (
                            <>
                              <FaCheckCircle className="mr-2 h-4 w-4" />
                              Address Copied!
                            </>
                          ) : (
                            <>
                              <FaCopy className="mr-2 h-4 w-4" />
                              Copy Address
                            </>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <FaWallet className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">No wallet connected</p>
                        <Button variant="outline" className="mt-2">
                          Connect Wallet
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="preferences" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FaCog className="h-5 w-5 text-gray-600" />
                    Notification Preferences
                  </CardTitle>
                  <CardDescription>
                    Manage your notification settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-muted-foreground">Receive updates via email</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <FaBell className="mr-2 h-4 w-4" />
                      Configure
                    </Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Staking Alerts</p>
                      <p className="text-sm text-muted-foreground">Get notified about staking rewards</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <FaBell className="mr-2 h-4 w-4" />
                      Configure
                    </Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Referral Notifications</p>
                      <p className="text-sm text-muted-foreground">Get notified about new referrals</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <FaBell className="mr-2 h-4 w-4" />
                      Configure
                    </Button>
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

export default Profile; 