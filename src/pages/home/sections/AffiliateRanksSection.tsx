import React from 'react';
import { motion } from 'framer-motion';
import { FaTrophy, FaMedal, FaCrown, FaGem, FaCar, FaGlobe } from 'react-icons/fa';
import type { RankPlan } from '@/types/landing';

interface AffiliateRanksSectionProps {
  rankPlans: RankPlan[];
}

const rankDisplayMap: Record<string, { icon: React.ElementType; color: string; bgColor: string; borderColor: string }> = {
  Bronze:    { icon: FaMedal,   color: 'bg-amber-500', bgColor: 'bg-amber-50', borderColor: 'border-amber-200' },
  Silver:    { icon: FaMedal,   color: 'bg-gray-400',  bgColor: 'bg-gray-50',  borderColor: 'border-gray-200' },
  Gold:      { icon: FaTrophy,  color: 'bg-yellow-500',bgColor: 'bg-yellow-50', borderColor: 'border-yellow-200' },
  Platinum:  { icon: FaCrown,   color: 'bg-blue-500',  bgColor: 'bg-blue-50',  borderColor: 'border-blue-200' },
  Diamond:   { icon: FaGem,     color: 'bg-cyan-500',  bgColor: 'bg-cyan-50',  borderColor: 'border-cyan-200' },
  Ruby:      { icon: FaGem,     color: 'bg-red-500',   bgColor: 'bg-red-50',   borderColor: 'border-red-200' },
  Emerald:   { icon: FaCar,     color: 'bg-green-500', bgColor: 'bg-green-50', borderColor: 'border-green-200' },
  Sapphire:  { icon: FaGem,     color: 'bg-blue-600',  bgColor: 'bg-blue-50',  borderColor: 'border-blue-200' },
  Titanium:  { icon: FaCrown,   color: 'bg-gray-700',  bgColor: 'bg-gray-50',  borderColor: 'border-gray-200' },
  Obsidian:  { icon: FaGem,     color: 'bg-black',     bgColor: 'bg-gray-100', borderColor: 'border-gray-400' },
};

const AffiliateRanksSection: React.FC<AffiliateRanksSectionProps> = ({ rankPlans }) => {
  return (
    <section className="py-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mb-16"
        >
          <div className="flex items-center justify-center mb-4">
            <FaTrophy className="w-10 h-10 text-purple-500 mr-3" />
            <h2 className="text-2xl font-bold text-gray-700 mb-8">Affiliate Ranks and Rewards</h2>
          </div>
          <p className="text-xl text-gray-500 max-w-3xl mx-auto">
            Earn ranks and rewards based on volume in your weaker leg to ensure sustainable, balanced growth.
          </p>
        </motion.div>

        {/* Ranks Grid */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          {rankPlans.map((rank, idx) => {
            const display = rankDisplayMap[rank.rank] || rankDisplayMap['Bronze'];
            return (
              <motion.div
                key={rank.rank}
                initial={idx % 4 === 0 ? { opacity: 0, y: 30 } : idx % 4 === 1 ? { opacity: 0, x: 30 } : idx % 4 === 2 ? { opacity: 0, y: -30 } : { opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, y: 0, x: 0 }}
                transition={{ duration: 0.7 + idx * 0.1, delay: 0.1 * idx, ease: 'easeOut' }}
                viewport={{ once: true, amount: 0.3 }}
                className={`${display.bgColor} ${display.borderColor} border-2 rounded-md p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className={`w-12 h-12 ${display.color} rounded-full flex items-center justify-center mr-3`}>
                      <display.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">{rank.rank}</h3>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="bg-white rounded-md p-3">
                    <div className="text-sm text-gray-500 mb-1">Volume Required (Weak Leg)</div>
                    <div className="text-lg font-bold text-gray-900">${parseFloat(rank.volume).toLocaleString()}</div>
                  </div>
                  
                  <div className="bg-white rounded-md p-3">
                    <div className="text-sm text-gray-500 mb-1">Reward</div>
                    <div className="text-lg font-bold text-green-600">{rank.equivalent ? rank.equivalent : `$${(parseFloat(rank.volume) * 0.05).toLocaleString()}`}</div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Additional Information */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto"
        >
          {/* How It Works */}
          <div className="bg-white rounded-md shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <FaGlobe className="w-6 h-6 text-green-500 mr-2" />
              How It Works
            </h3>
            <ul className="space-y-3 text-gray-500">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Volume is calculated based on your <strong>weaker leg</strong> to ensure balanced growth</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Ranks are achieved progressively as you reach volume milestones</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Rewards include cash bonuses or luxury items like electric vehicles</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span>Higher ranks unlock better rewards and additional benefits</span>
              </li>
            </ul>
          </div>

          {/* Benefits */}
          <div className="bg-white rounded-md shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <FaTrophy className="w-6 h-6 text-yellow-500 mr-2" />
              Benefits
            </h3>
            <ul className="space-y-3 text-gray-500">
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span><strong>Immediate rewards</strong> upon reaching rank requirements</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span><strong>Luxury items</strong> like electric vehicles from BYD</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span><strong>Travel rewards</strong> including international and luxury trips</span>
              </li>
              <li className="flex items-start">
                <span className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                <span><strong>Cash bonuses</strong> ranging from $500 to $100,000</span>
              </li>
            </ul>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          viewport={{ once: true, amount: 0.3 }}
          className="text-center mt-12"
        >
          <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-md p-8 text-white">
            <h3 className="text-2xl font-bold mb-4">Ready to Start Earning?</h3>
            <p className="text-lg mb-6 opacity-90">
              Join GreenDash today and start building your affiliate network to unlock these amazing rewards.
            </p>
            <a
              href="#staking"
              className="inline-block px-8 py-4 bg-white text-purple-600 font-bold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              Get Started Now
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AffiliateRanksSection; 