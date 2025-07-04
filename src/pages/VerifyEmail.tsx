import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { baseURL } from '@/lib/constants';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState('loading'); // 'loading' | 'success' | 'error'
    const [message, setMessage] = useState('');

    useEffect(() => {
        const token = searchParams.get('token');

        if (!token) {
            setStatus('error');
            setMessage('Verification token is missing.');
            return;
        }

        const verifyEmail = async () => {
            try {
                const response = await axios.get(`${baseURL}/auth/verify-email/` + token);

                if (response.data.success) {
                    setStatus('success');
                    setMessage('✅ Email verified successfully! You can now log in.');
                } else {
                    setStatus('error');
                    setMessage(response.data.message || '⚠️ Email verification failed. Token may be invalid or expired.');
                }
            } catch (error) {
                setStatus('error');
                const msg = error.response?.data?.message || 'Something went wrong.';
                setMessage(`❌ ${msg}`);
            }
        };

        verifyEmail();
    }, []);

    return (
        <div className='w-full h-[400px] p-10 mt-[200px] text-center'>
            {status === 'loading' && <p>Verifying email...</p>}
            {status === 'success' && <h2 style={{ color: 'green' }}>{message}</h2>}
            {status === 'error' && <h2 style={{ color: 'red' }}>{message}</h2>}
        </div>
    );
};

export default VerifyEmail;
