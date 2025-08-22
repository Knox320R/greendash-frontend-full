import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { useTranslation } from 'react-i18next';

const ConclusionSection = () => {
  const { t } = useTranslation('home');
  const isAuthenticated = useSelector((store: RootState) => store.auth.isAuthenticated)
  const nav = useNavigate()
  return (
    <section className="py-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-50 via-white to-green-50 flex flex-col items-center justify-center text-center">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <motion.h2
          className="text-3xl font-bold text-gray-700 mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.3 }}
        >
          {t('conclusion.title')}
        </motion.h2>
        <motion.p
          className="text-lg text-gray-500 mb-8 max-w-xl mx-auto"
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.3 }}
        >
          {t('conclusion.subtitle')}
        </motion.p>
        <motion.div
          onClick={() => isAuthenticated? nav('/dashboard'): nav('/login')}
          className="inline-block px-8 py-4 rounded-full bg-green-500 text-white font-bold text-lg shadow hover:bg-green-600 transition-all"
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: 'easeOut' }}
          viewport={{ once: true, amount: 0.3 }}
        >
          {t('conclusion.button')}
        </motion.div>
      </div>
    </section>
  );
};

export default ConclusionSection; 