import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Users, DollarSign, Globe } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const MarketOpportunitySection: React.FC = () => {
  const { t } = useTranslation('home');
  
  const opportunities = [
    {
      icon: <TrendingUp className="h-8 w-8 text-green-500" />,
      title: t('marketOpportunity.opportunities.growingDefi.title'),
      description: t('marketOpportunity.opportunities.growingDefi.description'),
      stats: t('marketOpportunity.opportunities.growingDefi.stats'),
      trend: t('marketOpportunity.opportunities.growingDefi.trend'),
      color: "bg-green-50 border-green-200"
    },
    {
      icon: <Users className="h-8 w-8 text-blue-500" />,
      title: t('marketOpportunity.opportunities.massAdoption.title'),
      description: t('marketOpportunity.opportunities.massAdoption.description'),
      stats: t('marketOpportunity.opportunities.massAdoption.stats'),
      trend: t('marketOpportunity.opportunities.massAdoption.trend'),
      color: "bg-blue-50 border-blue-200"
    },
    {
      icon: <DollarSign className="h-8 w-8 text-yellow-500" />,
      title: t('marketOpportunity.opportunities.institutionalInvestment.title'),
      description: t('marketOpportunity.opportunities.institutionalInvestment.description'),
      stats: t('marketOpportunity.opportunities.institutionalInvestment.stats'),
      trend: t('marketOpportunity.opportunities.institutionalInvestment.trend'),
      color: "bg-yellow-50 border-yellow-200"
    },
    {
      icon: <Globe className="h-8 w-8 text-purple-500" />,
      title: t('marketOpportunity.opportunities.globalAccessibility.title'),
      description: t('marketOpportunity.opportunities.globalAccessibility.description'),
      stats: t('marketOpportunity.opportunities.globalAccessibility.stats'),
      trend: t('marketOpportunity.opportunities.globalAccessibility.trend'),
      color: "bg-purple-50 border-purple-200"
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {t('marketOpportunity.title')}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            {t('marketOpportunity.subtitle')}
          </p>
        </div>

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {opportunities.map((opportunity, index) => (
            <Card key={index} className={`${opportunity.color} border-2 hover:shadow-lg transition-all duration-300 hover:-translate-y-1`}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  {opportunity.icon}
                  <Badge variant="secondary" className="text-xs">
                    {opportunity.trend}
                  </Badge>
                </div>
                <CardTitle className="text-lg font-semibold text-gray-900">
                  {opportunity.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm mb-4">
                  {opportunity.description}
                </p>
                <div className="text-sm font-medium text-gray-900">
                  {opportunity.stats}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Market Statistics */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            {t('marketOpportunity.marketStatistics.title')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">{t('marketOpportunity.marketStatistics.totalCryptoMarketCap.value')}</div>
              <div className="text-gray-600">{t('marketOpportunity.marketStatistics.totalCryptoMarketCap.label')}</div>
              <div className="text-sm text-green-600 font-medium">{t('marketOpportunity.marketStatistics.totalCryptoMarketCap.trend')}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{t('marketOpportunity.marketStatistics.defiTotalValueLocked.value')}</div>
              <div className="text-gray-600">{t('marketOpportunity.marketStatistics.defiTotalValueLocked.label')}</div>
              <div className="text-sm text-blue-600 font-medium">{t('marketOpportunity.marketStatistics.defiTotalValueLocked.trend')}</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">{t('marketOpportunity.marketStatistics.globalCryptoUsers.value')}</div>
              <div className="text-gray-600">{t('marketOpportunity.marketStatistics.globalCryptoUsers.label')}</div>
              <div className="text-sm text-purple-600 font-medium">{t('marketOpportunity.marketStatistics.globalCryptoUsers.trend')}</div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl p-8 text-white">
            <h3 className="text-3xl font-bold mb-4">
              {t('marketOpportunity.cta.title')}
            </h3>
            <p className="text-xl mb-6 opacity-90">
              {t('marketOpportunity.cta.subtitle')}
            </p>
            <button className="bg-white text-green-600 px-8 py-3 rounded-full font-semibold hover:bg-gray-100 transition-colors duration-300">
              {t('marketOpportunity.cta.button')}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketOpportunitySection; 