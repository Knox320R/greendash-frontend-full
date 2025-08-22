import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FaSignInAlt, FaLock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { api } from '@/lib/api';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { setLoading } from '@/store/auth';

const ResetPassword = () => {
  const { t } = useTranslation('auth');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoadingState] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Extract token from query params
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!password || !confirmPassword) {
      setError(t('fillAllFields'));
      return;
    }
    if (password !== confirmPassword) {
      setError(t('passwordsDoNotMatch'));
      return;
    }
    if (!token) {
      setError(t('invalidToken'));
      return;
    }
    setLoadingState(true);
    dispatch(setLoading(true));
    try {
      // Adjust API call as per your backend
      await api.post('/auth/reset-password', { token, password });
      toast.success(t('passwordResetSuccess'));
      navigate('/login');
    } catch (err: any) {
      setError(err?.response?.data?.message || t('resetPasswordFailed'));
    } finally {
      setLoadingState(false);
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-100 to-green-300">
      <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center gap-2 text-2xl font-bold">
              <FaLock className="text-green-600" /> {t('resetPasswordTitle')}
            </CardTitle>
            <CardDescription>{t('resetPasswordSubtitle')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="password" className="block mb-1 font-medium">{t('newPassword')}</label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder={t('newPasswordPlaceholder')}
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label htmlFor="confirmPassword" className="block mb-1 font-medium">{t('confirmNewPassword')}</label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder={t('confirmNewPasswordPlaceholder')}
                  required
                  disabled={loading}
                />
              </div>
              {error && <div className="text-red-600 text-sm font-medium">{error}</div>}
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? t('resettingButton') : t('resetPasswordButton')}
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              <Link to="/login" className="text-green-700 hover:underline flex items-center justify-center gap-1">
                <FaSignInAlt /> {t('backToLogin')}
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
