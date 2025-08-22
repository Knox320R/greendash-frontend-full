import React from 'react';
import { motion } from 'framer-motion';
import { FaRocket, FaChartLine, FaDollarSign, FaGlobe, FaCar, FaUsers, FaPercentage } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const GrowthOpportunitySection = () => {
  const { t } = useTranslation('home');
  
  return (
    <section className="py-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Growth Opportunity */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <FaRocket className="w-10 h-10 text-green-500 mr-3" />
            <h2 className="text-2xl font-bold text-gray-600 mb-8">{t('growthOpportunity.title')}</h2>
          </div>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-8">
            {t('growthOpportunity.subtitle')}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
            {[...Array(3)].map((_, idx) => (
              <motion.div
                key={idx}
                className="bg-white rounded-md shadow-lg p-6 text-center"
                initial={idx % 4 === 0 ? { opacity: 0, y: 30 } : idx % 4 === 1 ? { opacity: 0, x: 30 } : idx % 4 === 2 ? { opacity: 0, y: -30 } : { opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, y: 0, x: 0 }}
                transition={{ duration: 0.7 + idx * 0.1, delay: 0.1 * idx, ease: 'easeOut' }}
                viewport={{ once: true, amount: 0.3 }}
              >
                {idx === 0 && (
                  <>
                    <FaDollarSign className="w-12 h-12 text-green-500 mx-auto mb-4" />
                    <div className="text-3xl font-bold text-gray-600 mb-2">$170B</div>
                    <div className="text-gray-400 font-semibold">{t('growthOpportunity.marketCap')}</div>
                  </>
                )}
                {idx === 1 && (
                  <>
                    <FaCar className="w-12 h-12 text-blue-500 mx-auto mb-4" />
                    <div className="text-3xl font-bold text-gray-600 mb-2">35M</div>
                    <div className="text-gray-400 font-semibold">{t('growthOpportunity.ridesPerDay')}</div>
                  </>
                )}
                {idx === 2 && (
                  <>
                    <FaGlobe className="w-12 h-12 text-purple-500 mx-auto mb-4" />
                    <div className="text-3xl font-bold text-gray-600 mb-2">12B</div>
                    <div className="text-gray-400 font-semibold">{t('growthOpportunity.ridesPerYear')}</div>
                  </>
                )}
              </motion.div>
            ))}
          </div>
          
          <div className="bg-green-100 border border-green-200 rounded-md p-6 max-w-2xl mx-auto">
            <p className="text-lg font-semibold text-green-800">
              {t('growthOpportunity.marketCapture')}
            </p>
          </div>
        </motion.div>

        {/* Growth Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true, amount: 0.3 }}
          className="mb-16"
        >
          <h3 className="text-2xl font-bold text-gray-600 mb-8 text-center">{t('growthOpportunity.growthComparison.title')}</h3>
          
          <div className="bg-white rounded-md shadow-xl p-8 max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Uber Example */}
              <div className="bg-gray-50 rounded-md p-6">
                <div className="flex items-center mb-4">
                  <FaChartLine className="w-8 h-8 text-gray-600 mr-3" />
                  <h4 className="text-xl font-bold text-gray-600">{t('growthOpportunity.growthComparison.uberExample.title')}</h4>
                </div>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">{t('growthOpportunity.growthComparison.uberExample.initialInvestment')}</div>
                    <div className="text-lg font-bold text-gray-600">{t('growthOpportunity.growthComparison.uberExample.initialValue')}</div>
                    <div className="text-sm text-gray-600">{t('growthOpportunity.growthComparison.uberExample.tokenAmount')}</div>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">{t('growthOpportunity.growthComparison.uberExample.currentValue')}</div>
                    <div className="text-lg font-bold text-green-600">{t('growthOpportunity.growthComparison.uberExample.currentAmount')}</div>
                    <div className="text-sm text-gray-600">{t('growthOpportunity.growthComparison.uberExample.marketCap')}</div>
                  </div>
                  <div className="bg-green-100 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">{t('growthOpportunity.growthComparison.uberExample.totalReturn')}</div>
                    <div className="text-xl font-bold text-green-700">{t('growthOpportunity.growthComparison.uberExample.returnAmount')}</div>
                  </div>
                </div>
              </div>
              
              {/* GreenDash Advantage */}
              <div className="bg-green-50 rounded-md p-6">
                <div className="flex items-center mb-4">
                  <FaRocket className="w-8 h-8 text-green-600 mr-3" />
                  <h4 className="text-xl font-bold text-gray-600">{t('growthOpportunity.growthComparison.greenDashAdvantage.title')}</h4>
                </div>
                <div className="space-y-4">
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">{t('growthOpportunity.growthComparison.greenDashAdvantage.competitiveAdvantages')}</div>
                    <ul className="text-sm text-gray-700 space-y-1">
                      <li>• {t('growthOpportunity.growthComparison.greenDashAdvantage.advantage1')}</li>
                      <li>• {t('growthOpportunity.growthComparison.greenDashAdvantage.advantage2')}</li>
                      <li>• {t('growthOpportunity.growthComparison.greenDashAdvantage.advantage3')}</li>
                      <li>• {t('growthOpportunity.growthComparison.greenDashAdvantage.advantage4')}</li>
                    </ul>
                  </div>
                  <div className="bg-white rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">{t('growthOpportunity.growthComparison.greenDashAdvantage.initialTokenPrice')}</div>
                    <div className="text-lg font-bold text-green-600">{t('growthOpportunity.growthComparison.greenDashAdvantage.tokenPrice')}</div>
                    <div className="text-sm text-gray-600">{t('growthOpportunity.growthComparison.greenDashAdvantage.startingPoint')}</div>
                  </div>
                  <div className="bg-blue-100 rounded-lg p-4">
                    <div className="text-sm text-gray-600 mb-1">{t('growthOpportunity.growthComparison.greenDashAdvantage.growthPotential')}</div>
                    <div className="text-lg font-bold text-blue-700">{t('growthOpportunity.growthComparison.greenDashAdvantage.potential')}</div>
                    <div className="text-sm text-gray-600">{t('growthOpportunity.growthComparison.greenDashAdvantage.marketCapture')}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
              <p className="text-sm text-yellow-800 text-center">
                <strong>{t('growthOpportunity.growthComparison.disclaimer')}</strong>
              </p>
            </div>
          </div>
        </motion.div>

        {/* Why GreenDash is More Attractive */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center"
        >
          <h3 className="text-2xl font-bold text-gray-600 mb-6">{t('growthOpportunity.whyMoreAttractive.title')}</h3>
          <div className="bg-white rounded-md shadow-lg p-8 max-w-4xl mx-auto">
            <p className="text-lg text-gray-400 mb-6">
              <strong>{t('growthOpportunity.whyMoreAttractive.subtitle')}</strong>
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-4 bg-green-50 rounded-md">
                <FaUsers className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="font-semibold text-gray-500">{t('growthOpportunity.whyMoreAttractive.lowerFees')}</div>
              </div>
              <div className="text-center p-4 bg-blue-50 rounded-md">
                <FaDollarSign className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="font-semibold text-gray-500">{t('growthOpportunity.whyMoreAttractive.affordableFares')}</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-md">
                <FaPercentage className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                <div className="font-semibold text-gray-500">{t('growthOpportunity.whyMoreAttractive.profitSharing')}</div>
              </div>
            </div>
            <div className="bg-green-100 rounded-md p-6">
              <p className="text-lg font-semibold text-green-800">
                {t('growthOpportunity.whyMoreAttractive.conclusion')}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
 </section>
  );
};

export default GrowthOpportunitySection; 