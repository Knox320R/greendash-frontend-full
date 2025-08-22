import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { baseURL } from '@/lib/constants';

const VerifyEmail = () => {
    const { t } = useTranslation('auth');
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
    const [message, setMessage] = useState('');
    const navigate = useNavigate()

    useEffect(() => {
        const token = searchParams.get('token');
        
        if (!token) {
            setStatus('error');
            setMessage(t('verificationTokenMissing'));
            return;
        }

        const verifyEmail = async () => {
            try {
                const response = await axios.get(`${baseURL}/auth/verify-email/` + token);

                if (response.data.success) {
                    setStatus('success');
                    setMessage(t('emailVerifiedSuccess'));
                    setTimeout(() => {
                        navigate('/')
                    }, 2000)
                } else {
                    setStatus('error');
                    setMessage(response.data.message || t('emailVerificationFailed'));
                }
            } catch (error) {
                setStatus('error');
                const msg = error.response?.data?.message || t('somethingWentWrong');
                setMessage(`❌ ${msg}`);
            }
        };

        verifyEmail();
    }, []);

    return (
        <div className='w-full h-[400px] p-10 mt-[200px] text-center'>
            {status === 'loading' && <p>{t('verifyingEmail')}</p>}
            {status === 'success' && <h2 style={{ color: 'green' }}>{message}</h2>}
            {status === 'error' && <h2 style={{ color: 'red' }}>{message}</h2>}
        </div>
    );
};

export default VerifyEmail;
