import React from 'react';
import { FaCoins, FaChartLine, FaGift, FaSeedling, FaUsers, FaExchangeAlt, FaVoteYea, FaTrophy, FaMoneyBillWave, FaNetworkWired, FaGlobeAmericas, FaBolt, FaUserPlus } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { TotalToken, AdminSetting } from '@/types/landing';
import { useTranslation } from 'react-i18next';

const TokenSection = ({ 
  totalTokens, 
  adminSettings, 
  openTokenDialog, 
  setOpenTokenDialog, 
  handleBuyGreenClick, 
  handleBuyToken 
}: TokenSectionProps) => {
  const { t } = useTranslation('home');
  
  const tokenUtilities = [
    {
      icon: FaCoins,
      title: t('token.tokenUtilities.stakeAndEarn.title'),
      desc: t('token.tokenUtilities.stakeAndEarn.description')
    },
    {
      icon: FaVoteYea,
      title: t('token.tokenUtilities.governance.title'),
      desc: t('token.tokenUtilities.governance.description')
    },
    {
      icon: FaExchangeAlt,
      title: t('token.tokenUtilities.trade.title'),
      desc: t('token.tokenUtilities.trade.description')
    },
    {
      icon: FaSeedling,
      title: t('token.tokenUtilities.supportGreenProjects.title'),
      desc: t('token.tokenUtilities.supportGreenProjects.description')
    },
  ];

  const cashbackTypes = [
    {
      icon: FaMoneyBillWave,
      title: t('token.cashback.directCashback.title'),
      desc: t('token.cashback.directCashback.description')
    },
    {
      icon: FaNetworkWired,
      title: t('token.cashback.networkCashback.title'),
      desc: t('token.cashback.networkCashback.description')
    },
    {
      icon: FaGlobeAmericas,
      title: t('token.cashback.universalCashback.title'),
      desc: t('token.cashback.universalCashback.description')
    },
    {
      icon: FaBolt,
      title: t('token.cashback.performanceCashback.title'),
      desc: t('token.cashback.performanceCashback.description')
    },
    {
      icon: FaUserPlus,
      title: t('token.cashback.viralCashback.title'),
      desc: t('token.cashback.viralCashback.description')
    },
  ];

  // Helper function to format token amounts
  const formatTokenAmount = (amount: string) => {
    const num = parseFloat(amount);
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toLocaleString();
  };

  // Handle undefined or empty arrays
  const safeTotalTokens = totalTokens || [];
  const safeAdminSettings = adminSettings || [];

  // Calculate total supply for percentage calculation
  const totalSupply = safeTotalTokens.reduce((sum: number, token: TotalToken) => sum + parseFloat(token.amount), 0);

  const tokenIconMap: Record<string, React.ElementType> = {
    'seed_sale': FaSeedling,
    'private_sale': FaGift,
    'public_sale': FaCoins,
    'airdrop': FaVoteYea,
    'liquidity': FaExchangeAlt,
    'development': FaChartLine,
    'marketing_expansion': FaChartLine,
    'team_audits': FaUsers,
    'staking_reserves': FaTrophy,
    'others': FaUsers,
  };

  const colorPalette = [
    '#22c55e', // green
    '#3b82f6', // blue
    '#a78bfa', // purple
    '#f59e42', // orange
    '#f43f5e', // red
    '#06b6d4', // cyan
    '#eab308', // yellow
    '#6366f1', // indigo
    '#f472b6', // pink
    '#64748b', // slate
  ];

  const tokenomicsData = safeTotalTokens.map((token, idx) => {
    const amount = parseFloat(token.amount);
    const percentage = totalSupply > 0 ? (amount / totalSupply) * 100 : 0;
    
    return {
      name: token.title.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()),
      value: percentage, // Use percentage for pie chart
      color: colorPalette[idx % colorPalette.length],
      icon: tokenIconMap[token.title] ? tokenIconMap[token.title] : FaCoins,
      amount: token.amount, // Keep original string for display
      formattedAmount: formatTokenAmount(token.amount), // Formatted for display
      price: token.price, // Include price information
      percentage: percentage.toFixed(1), // Percentage for display
    };
  });

  // Show loading state if no data is available
  if (safeTotalTokens.length === 0) {
    return (
      <section className="py-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-50 via-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
            <p className="text-gray-600">{t('token.loading')}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <div className="inline-flex items-center justify-center mb-4">
            <FaCoins className="w-12 h-12 text-green-500 mr-2" />
            <span className="text-4xl font-extrabold text-green-700 tracking-tight">GREEN</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-700 mb-8">{t('token.title')}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('token.subtitle')}
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-6 text-gray-700 text-sm">
            <span className="bg-green-100 text-green-700 px-4 py-2 rounded-md font-semibold">{t('token.tokenDetails.symbol')}</span>
            <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-md font-semibold">{t('token.tokenDetails.totalSupply')}</span>
            <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-md font-semibold">{t('token.tokenDetails.decimals')}</span>
            {safeAdminSettings.length > 0 && (
              <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-md font-semibold">
                {safeAdminSettings.find(setting => setting.title === 'token_price')?.value 
                  ? t('token.tokenDetails.price')
                  : t('token.priceTBD')
                }
              </span>
            )}
          </div>
        </motion.div>
        {/* Cashback Types Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.3 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-green-700 mb-6 text-center">{t('token.cashback.title')}</h3>
          <div className="flex flex-col gap-8 mx-auto w-full">
            {cashbackTypes.map((cb, idx) => (
              <motion.div
                key={cb.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.7, delay: 0.1 * idx, ease: 'easeOut' }}
                viewport={{ once: true, amount: 0.3 }}
                className={`relative  w-full bg-white/60 backdrop-blur-lg rounded-2xl p-8 flex items-center text-center shadow-xl border-2 transition-all duration-300 hover:scale-110
                  ${[
                    'border-green-300',
                    'border-blue-300',
                    'border-purple-300',
                    'border-yellow-300',
                    'border-pink-300',
                  ][idx % 5]}
                `}
                style={{ boxShadow: `0 8px 32px 0 rgba(34,197,94,0.10), 0 1.5px 8px 0 rgba(59,130,246,0.08)` }}
              >
                {/* Badge for Most Popular */}
                {idx === 0 && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-green-400 via-green-500 to-green-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg uppercase tracking-wider z-10 animate-pulse">
                    {t('token.cashback.mostPopular')}
                  </span>
                )}
                <div className={`w-[130px]  flex items-center justify-center w-20 h-20 rounded-full mb-4 shadow-lg bg-gradient-to-br transition-all duration-500 ease-in-out
                  ${[
                    'from-green-100 via-green-200 to-green-50',
                    'from-blue-100 via-blue-200 to-blue-50',
                    'from-purple-100 via-purple-200 to-purple-50',
                    'from-yellow-100 via-yellow-200 to-yellow-50',
                    'from-pink-100 via-pink-200 to-pink-50',
                  ][idx % 5]}
                `}>
                  <cb.icon className="w-10 h-10 text-green-500 drop-shadow-xl" />
                </div>
                <h4 className="font-extrabold text-gray-900 mb-2 text-xl tracking-tight drop-shadow-sm">
                  {cb.title}
                </h4>
                <p className="text-gray-700 text-base font-medium leading-relaxed drop-shadow-xs">
                  {cb.desc}
                </p>
              </motion.div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <span className="inline-block bg-green-100 text-green-700 font-semibold px-4 py-2 rounded-md shadow-sm mb-2">
              {t('token.cashback.note')}
            </span>
          </div>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* Tokenomics Pie Chart */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="bg-white rounded-md shadow-lg p-8 flex flex-col items-center"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">{t('token.tokenomics.title')}</h3>
            <div className="w-full flex flex-col md:flex-row items-center gap-8">
              <div style={{ width: 220, height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={tokenomicsData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={90}
                      innerRadius={50}
                      paddingAngle={2}
                      label={({ name }) => name}
                    >
                      {tokenomicsData.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex-1 space-y-2">
                {tokenomicsData.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-sm">
                    <span>{item.icon && <item.icon className="inline-block mr-2" style={{ color: item.color }} />}</span>
                    <span className="font-semibold" style={{ color: item.color }}>{item.name}</span>
                    <div className="ml-auto text-right">
                      <div className="font-bold text-gray-700">{item.formattedAmount}</div>
                      <div className="text-xs text-gray-500">{item.percentage}%</div>
                      {item.price && (
                        <div className="text-xs text-gray-400">${item.price.toFixed(2)}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
          {/* Token Utilities */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">{t('token.tokenUtilities.title')}</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {tokenUtilities.map((util, idx) => (
                <div key={idx} className="bg-white rounded-md shadow-md p-6 flex flex-col items-center text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2">
                  <util.icon className="w-8 h-8 mb-3 text-green-500" />
                  <h4 className="font-semibold text-gray-900 mb-1">{util.title}</h4>
                  <p className="text-gray-600 text-sm">{util.desc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        
        {/* Call to Action Section */}
        {/* <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 shadow-xl">
            <h3 className="text-2xl font-bold text-white mb-4">{t('token.cta.title')}</h3>
            <p className="text-green-100 mb-6 max-w-2xl mx-auto">
              {t('token.cta.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleBuyGreenClick}
                className="bg-white text-green-600 font-bold py-3 px-8 rounded-lg hover:bg-green-50 transition-colors duration-300 shadow-lg"
              >
                {t('token.cta.buyTokens')}
              </button>
              <button
                onClick={() => handleBuyToken('green')}
                className="bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-lg hover:bg-white hover:text-green-600 transition-colors duration-300"
              >
                {t('token.cta.learnMore')}
              </button>
            </div>
          </div>
        </motion.div> */}
      </div>
    </section>
  );
};

interface TokenSectionProps {
  totalTokens?: TotalToken[];
  adminSettings?: AdminSetting[];
  openTokenDialog: boolean;
  setOpenTokenDialog: (open: boolean) => void;
  handleBuyGreenClick: () => void;
  handleBuyToken: (tokenType: string) => void;
}

export default TokenSection; 