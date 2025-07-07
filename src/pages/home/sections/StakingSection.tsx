import { motion } from 'framer-motion';
import { FaAward, FaBicycle, FaCar, FaUserTie, FaCrown, FaBuilding, FaRocket } from 'react-icons/fa';
import type { StakingPackage, AdminSetting } from '@/types/landing';

interface StakingSectionProps {
  stakingPackages: StakingPackage[];
  adminSettings: AdminSetting[];
}

const packageIconMap: Record<string, React.ElementType> = {
  'Daily Ride': FaBicycle,
  'Weekly Pass': FaAward,
  'Economy Car': FaCar,
  'Business Fleet': FaBuilding,
  'Personal EV': FaUserTie,
  'Luxury Fleet': FaCrown,
  'Corporate Mobility Hub': FaRocket,
};

const StakingSection: React.FC<StakingSectionProps> = ({ stakingPackages, adminSettings }) => {
  const token_price = parseFloat((adminSettings?.find(item => item.title === "token_price"))?.value) || 0.01

  return (
    <section className="py-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <motion.h2
            className="text-3xl font-bold text-gray-700 mb-4"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.3 }}
          >
            Choose Your Staking Package
          </motion.h2>
          <motion.p
            className="text-lg text-gray-500 max-w-2xl mx-auto"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.3 }}
          >
            Select a package that fits your goals and start earning daily rewards. It's simple, secure, and rewarding.
          </motion.p>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.3 }}
          className="mb-10 max-w-5xl mx-auto"
        >
          <h3 className="text-2xl font-bold text-green-700 mb-8 text-center">Investment Packages</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {stakingPackages.map((pkg, idx) => (
              <motion.div
                key={pkg.id}
                className="bg-white rounded-xl shadow-lg p-8 flex flex-col items-center text-center border border-green-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                initial={idx % 4 === 0 ? { opacity: 0, y: 30 } : idx % 4 === 1 ? { opacity: 0, x: 30 } : idx % 4 === 2 ? { opacity: 0, y: -30 } : { opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, y: 0, x: 0 }}
                transition={{ duration: 0.7 + idx * 0.1, delay: 0.2 + 0.1 * idx, ease: 'easeOut' }}
                viewport={{ once: true, amount: 0.3 }}
              >
                <div className="flex items-center justify-center mb-4">
                  {(() => {
                    const Icon = packageIconMap[pkg.name] || FaAward;
                    return <Icon className="w-8 h-8 text-green-400 mr-2" />;
                  })()}
                  <span className="text-xl font-bold text-gray-700">{pkg.name}</span>
                </div>
                <div className="mb-2 text-gray-500 text-[12px] text-center">{pkg.description}</div>
                <div className="mb-2">
                  <span className="block text-gray-500 text-sm">EGD</span>
                  <span className="text-lg font-semibold text-green-700">{parseFloat(pkg.stake_amount).toLocaleString()}</span>
                </div>
                <div className="mb-2">
                  <span className="block text-gray-500 text-sm">USDT</span>
                  <span className="text-lg font-semibold text-yellow-700">{(parseFloat(pkg.stake_amount) * token_price).toLocaleString()}</span>
                </div>
                <div className="mb-4">
                  <span className="block text-gray-500 text-sm">Daily Return in EGD</span>
                  <span className="text-lg font-bold text-green-600">{pkg.daily_yield_percentage}%</span>
                </div>
                  <span className="block text-gray-500 text-[12px]">Total Earning</span>
                <div className="mb-4 text-[14px] flex justify-between w-full">
                  <span className="font-bold text-green-600">{pkg.daily_yield_percentage * parseFloat(pkg.stake_amount) / 100 * pkg.lock_period_days} EGD</span>
                  <span className="font-bold text-yellow-600">{pkg.daily_yield_percentage * parseFloat(pkg.stake_amount) / 100 * pkg.lock_period_days * token_price} USDT</span>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="mt-8 flex flex-col items-center">
            <span className="inline-block bg-green-100 text-green-700 font-semibold px-4 py-2 rounded-md shadow-sm mb-2">
              Initial Token EGD launch price: <span className="font-bold">${adminSettings.find(s => s.title === 'token_price')?.value || '0.01'}</span>
            </span>
            <span className="text-xs text-gray-500 mt-1">⚠️ Investment package earnings are paid in EGD tokens. All Cashback earnings are paid in USDT.</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
};

export default StakingSection; 