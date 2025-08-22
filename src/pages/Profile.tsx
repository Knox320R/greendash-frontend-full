import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import {
  FaUser,
  FaWallet,
  FaShieldAlt,
  FaCog,
  FaEdit,
  FaSave,
  FaTimes,
  FaCheckCircle,
  FaCopy,
  FaQrcode,
  FaHistory,
  FaKey,
  FaBell
} from 'react-icons/fa';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { formatDate, truncateAddress } from '@/lib/utils';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { UserData } from '@/types/landing';
import { updateUser } from '@/store/auth';
import { toast } from 'react-toastify';
import { User, UserBaseData } from '@/types/auth-1';
import { getStakingStats } from '@/lib/staking';

const Profile = () => {
  const { t } = useTranslation(['profile', 'common']);

  const user = useSelector((store: RootState) => store.auth.user) as User | null;
  const user_base_data = useSelector((store: RootState) => store.auth.user_base_data) as UserBaseData | null;
  const stakingStats = getStakingStats(user_base_data?.recent_stakings ? user_base_data.recent_stakings : []);

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
        dispatch(updateUser(formData)); // Refresh user data
        setIsEditing(false);
        alert(t('profile:alerts.profileUpdated'));
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
              alert(t('profile:alerts.profileUpdateFailed'));
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
      toast.error(t('profile:alerts.fillAllPasswordFields'));
      return;
    }
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error(t('profile:alerts.passwordsDoNotMatch'));
      return;
    }
    if (passwordForm.new_password.length < 3) {
      toast.error(t('profile:alerts.passwordTooShort'));
      return;
    }
    setIsChangingPassword(true);
    try {
      const response = await api.put<{ success: boolean; message: string }>('/users/change-password', {
        current_password: passwordForm.current_password,
        new_password: passwordForm.new_password
      });
      if (response.success) {
        toast.success(t('profile:alerts.passwordChanged'));
        setShowChangePassword(false);
        setPasswordForm({ current_password: '', new_password: '', confirm_password: '' });
      } else {
        toast.error(response.message || t('profile:alerts.passwordChangeFailed'));
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.message || t('profile:alerts.passwordChangeFailed'));
    } finally {
      setIsChangingPassword(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">{t('profile:loading')}</p>
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
          <h1 className="text-3xl font-bold text-gray-900">{t('profile:title')}</h1>
          <p className="text-gray-600 mt-2">
            {t('profile:subtitle')}
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
              <TabsTrigger value="profile">{t('profile:tabs.profile')}</TabsTrigger>
              <TabsTrigger value="security">{t('profile:tabs.security')}</TabsTrigger>
              <TabsTrigger value="preferences">{t('profile:tabs.preferences')}</TabsTrigger>
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
                          {t('profile:personalInformation.title')}
                        </span>
                        {!isEditing ? (
                          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                            <FaEdit className="mr-2 h-4 w-4" />
                            {t('profile:personalInformation.edit')}
                          </Button>
                        ) : (
                          <div className="flex gap-2">
                            <Button size="sm" onClick={handleSave} disabled={isLoading}>
                                                                {isLoading ? (
                                    <>
                                      <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-2"></div>
                                      {t('profile:personalInformation.saving')}
                                    </>
                                  ) : (
                                <>
                                  <FaSave className="mr-2 h-4 w-4" />
                                  {t('profile:personalInformation.save')}
                                </>
                              )}
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleCancel}>
                                                          <FaTimes className="mr-2 h-4 w-4" />
                            {t('profile:personalInformation.cancel')}
                            </Button>
                          </div>
                        )}
                      </CardTitle>
                      <CardDescription>
                        {t('profile:personalInformation.description')}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">{t('profile:personalInformation.name')}</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            disabled={!isEditing}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">{t('profile:personalInformation.emailAddress')}</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            disabled
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="wallet_address">{t('profile:personalInformation.walletAddress')}</Label>
                        <Input
                          id="wallet_address"
                          value={formData.wallet_address || ''}
                          onChange={(e) => handleInputChange('wallet_address', e.target.value)}
                          disabled={!isEditing}
                          placeholder={t('profile:personalInformation.placeholder.wallet')}
                        />
                        {formData.wallet_address && (
                          <p className="text-sm text-muted-foreground">
                            {truncateAddress(formData.wallet_address)}
                          </p>
                        )}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">{t('profile:personalInformation.phoneNumber')}</Label>
                        <Input
                          id="phone"
                          value={formData.phone || ''}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                          disabled={!isEditing}
                          placeholder={user.phone}
                        />
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
                        {t('profile:accountSummary.title')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{t('profile:accountSummary.memberSince')}</span>
                        <span className="text-sm font-medium">{formatDate(user.created_at)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{t('profile:accountSummary.totalInvested')}</span>
                        <span className="text-sm font-medium text-pink-600">{stakingStats.total_staking_amount} <span className='ml-1 text-[#888] text-[12px]'>EGD</span></span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{t('profile:accountSummary.totalEarned')}</span>
                        <span className="text-sm font-medium text-blue-600">{stakingStats.earned_from_active + stakingStats.earned_from_completed}<span className='ml-1 text-[#888] text-[12px]'>EGD</span></span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{t('profile:accountSummary.potentialFromActive')}</span>
                        <span className="text-sm font-medium text-green-600">{stakingStats.earning_claimed_from_active}<span className='ml-1 text-[#888] text-[12px]'>EGD</span></span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{t('profile:accountSummary.egdBalance')}</span>
                        <span className="text-sm font-medium text-green-600">{(user.egd_balance).toFixed(2)}<span className='ml-1 text-[#888] text-[12px]'>EGD</span></span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">{t('profile:accountSummary.availableWithdrawals')}</span>
                        <span className="text-sm font-medium text-yellow-600">{user.withdrawals}<span className='ml-1 text-[#888] text-[12px]'>USDT</span></span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <FaQrcode className="h-5 w-5 text-purple-600" />
                        {t('profile:referralCode.title')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                                              <div className="space-y-2">
                          <Label>{t('profile:referralCode.yourReferralCode')}</Label>
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
                                  {t('profile:referralCode.copied')}
                                </>
                              ) : (
                                <>
                                  <FaCopy className="mr-2 h-4 w-4" />
                                  {t('profile:referralCode.copy')}
                                </>
                              )}
                            </Button>
                          </div>
                        </div>

                                              <div className="bg-green-50 p-3 rounded-lg">
                          <p className="text-sm text-green-800">
                            {t('profile:referralCode.shareMessage')}
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
                      {t('profile:security.passwordSecurity.title')}
                    </CardTitle>
                    <CardDescription>
                      {t('profile:security.passwordSecurity.description')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {!showChangePassword ? (
                      <Button variant="outline" className="w-full" onClick={() => setShowChangePassword(true)}>
                        <FaKey className="mr-2 h-4 w-4" />
                        {t('profile:security.passwordSecurity.changePassword')}
                      </Button>
                    ) : (
                      <div className="space-y-3">
                        <div className="space-y-2">
                          <Label htmlFor="current_password">{t('profile:security.passwordSecurity.currentPassword')}</Label>
                          <Input
                            id="current_password"
                            type="password"
                            value={passwordForm.current_password}
                            onChange={e => handlePasswordInput('current_password', e.target.value)}
                            disabled={isChangingPassword}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="new_password">{t('profile:security.passwordSecurity.newPassword')}</Label>
                          <Input
                            id="new_password"
                            type="password"
                            value={passwordForm.new_password}
                            onChange={e => handlePasswordInput('new_password', e.target.value)}
                            disabled={isChangingPassword}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm_password">{t('profile:security.passwordSecurity.confirmNewPassword')}</Label>
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
                            {isChangingPassword ? t('profile:security.passwordSecurity.saving') : t('profile:security.passwordSecurity.savePassword')}
                          </Button>
                          <Button variant="outline" onClick={() => setShowChangePassword(false)} disabled={isChangingPassword}>
                            {t('profile:security.passwordSecurity.cancel')}
                          </Button>
                        </div>
                      </div>
                    )}
                    <Button variant="outline" className="w-full mt-4" disabled>
                      <FaShieldAlt className="mr-2 h-4 w-4" />
                      {t('profile:security.twoFactorAuth')}
                    </Button>
                    <Button variant="outline" className="w-full" disabled>
                      <FaHistory className="mr-2 h-4 w-4" />
                      {t('profile:security.loginHistory')}
                    </Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FaWallet className="h-5 w-5 text-orange-600" />
                      {t('profile:security.walletSecurity.title')}
                    </CardTitle>
                    <CardDescription>
                      {t('profile:security.walletSecurity.description')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {user.wallet_address ? (
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <FaCheckCircle className="h-4 w-4 text-green-500" />
                          <span className="text-sm font-medium">{t('profile:security.walletSecurity.walletConnected')}</span>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-lg">
                          <p className="text-sm font-mono">{truncateAddress(user.wallet_address)}</p>
                        </div>
                        <Button variant="outline" onClick={copyWalletAddress} className="w-full">
                          {copied ? (
                            <>
                              <FaCheckCircle className="mr-2 h-4 w-4" />
                              {t('profile:security.walletSecurity.addressCopied')}
                            </>
                          ) : (
                            <>
                              <FaCopy className="mr-2 h-4 w-4" />
                              {t('profile:security.walletSecurity.copyAddress')}
                            </>
                          )}
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <FaWallet className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-muted-foreground">{t('profile:security.walletSecurity.noWalletConnected')}</p>
                        <Button variant="outline" className="mt-2">
                          {t('profile:security.walletSecurity.connectWallet')}
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
                    {t('profile:preferences.title')}
                  </CardTitle>
                  <CardDescription>
                    {t('profile:preferences.description')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{t('profile:preferences.emailNotifications.title')}</p>
                      <p className="text-sm text-muted-foreground">{t('profile:preferences.emailNotifications.description')}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <FaBell className="mr-2 h-4 w-4" />
                      {t('profile:preferences.emailNotifications.configure')}
                    </Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{t('profile:preferences.stakingAlerts.title')}</p>
                      <p className="text-sm text-muted-foreground">{t('profile:preferences.stakingAlerts.description')}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <FaBell className="mr-2 h-4 w-4" />
                      {t('profile:preferences.stakingAlerts.configure')}
                    </Button>
                  </div>
                  <Separator />
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{t('profile:preferences.referralNotifications.title')}</p>
                      <p className="text-sm text-muted-foreground">{t('profile:preferences.referralNotifications.description')}</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <FaBell className="mr-2 h-4 w-4" />
                      {t('profile:preferences.referralNotifications.configure')}
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