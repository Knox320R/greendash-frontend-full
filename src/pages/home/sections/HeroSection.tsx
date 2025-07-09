import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import type { AdminSetting } from '@/types/landing';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';

interface HeroSectionProps {
  scrollToSection?: (sectionId: string) => void;
  adminSettings?: AdminSetting[];
}

const HeroSection: React.FC<HeroSectionProps> = ({ scrollToSection, adminSettings }) => {
  const isAuthenticated = useSelector((store: RootState) => store.auth.isAuthenticated)
  const navigate = useNavigate()
  return (
    <section className="relative mt-[100px] flex flex-col justify-center items-center py-0">
      {/* Animated Gradient Background */}
      {/* <div className="absolute inset-0 z-0 animate-gradient-move bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-200 via-blue-100 to-purple-200 opacity-80 blur-2xl" /> */}
      {/* Soft Overlay for Depth */}
      {/* <div className="absolute inset-0 z-0 bg-white/40 backdrop-blur-sm" /> */}
      <div className="relative z-10 md:flex-row flex-col flex items-center justify-around w-full">
        <img src="10.png" alt="hero" className="rounded-[20px] border-[10px] border-white shadow-2xl mb-8 max-w-xs md:max-w-md lg:max-w-xl transition-transform duration-500 hover:scale-105" style={{ boxShadow: '0 0 160px 1px rgba(34,197,94,0.55), 0 8px 32px 0 rgba(0,0,0,0.10)' }} />
        <motion.div
          className="container mx-auto px-4 sm:px-6 lg:px-8 text-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.h1
            className="text-3xl md:text-5xl lg:text-6xl font-extrabold mb-8 leading-tight drop-shadow-xl "
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <span className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-600 bg-clip-text text-transparent animate-gradient-x drop-shadow-[0_4px_24px_rgba(34,197,94,0.25)]">
              The Future of Mobility
            </span>
            <br />
            <span className="text-gray-900 drop-shadow-lg">is Profit-Sharing</span>
          </motion.h1>
          <motion.p
            className="text-lg md:text-2xl text-gray-700 mb-10 max-w-3xl mx-auto font-medium drop-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            Join the revolution where every ride, every transaction, and every mile contributes to your wealth.
            <span className="text-green-600 font-bold"> Earn while the world moves.</span>
          </motion.p>
          {/* CTA Button */}
          <motion.div
            onClick={() => isAuthenticated? navigate('/dashboard'): navigate('/login')}
            className="inline-block px-8 py-4 rounded-full bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 text-white text-lg md:text-xl font-bold shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
          >
            Get Started
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
};

export default HeroSection; 