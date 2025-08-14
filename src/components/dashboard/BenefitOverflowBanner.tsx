import React from 'react';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaGift, FaRocket } from 'react-icons/fa';

export const BenefitOverflowBanner: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 2, ease: "easeOut" }}
      className="mb-8"
    >
      <div className="relative overflow-hidden bg-gradient-to-r from-green-500 via-green-600 to-green-700 text-white p-8 rounded-2xl shadow-2xl border-l-4 border-green-400">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full -translate-y-16 translate-x-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white rounded-full translate-y-12 -translate-x-12"></div>
        </div>
        
        <div className="relative z-10 flex items-start gap-6">
          <motion.div 
            initial={{ rotate: -10, scale: 0.8 }}
            animate={{ rotate: 0, scale: 1 }}
            transition={{ duration: 1.5, delay: 0.5, ease: "easeOut" }}
            className="flex-shrink-0"
          >
            <div className="relative">
              <FaCheckCircle className="w-12 h-12 text-green-100" />
              <motion.div
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                className="absolute inset-0 w-12 h-12 bg-green-400 rounded-full opacity-20"
              />
            </div>
          </motion.div>
          
          <div className="flex-1">
            <motion.h3 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.5, delay: 0.8, ease: "easeOut" }}
              className="text-2xl font-bold mb-3 flex items-center gap-3"
            >
              🎉 Congratulations! You've Reached the 300% Profit Cap!
              <FaGift className="text-yellow-300 animate-bounce" />
            </motion.h3>
            
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1.5, delay: 1.1, ease: "easeOut" }}
              className="text-green-50 leading-relaxed text-lg mb-4"
            >
              You've successfully earned 300% of your total staked amount! Your current staking packages have been completed. 
              To continue earning daily rewards and grow your portfolio, you can purchase new staking packages.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.5, delay: 1.4, ease: "easeOut" }}
              className="flex flex-wrap gap-3"
            >
              <div
                className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 cursor-pointer"
              >
                <FaRocket className="text-yellow-300" />
                <span className="font-semibold">Explore New Packages</span>
              </div>
              
              <div
                className="flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 cursor-pointer"
              >
                <FaGift className="text-green-300" />
                <span className="font-semibold">View Rewards</span>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Floating Elements */}
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 3, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
          className="absolute top-4 right-8 text-4xl"
        >
          🚀
        </motion.div>
        
        <motion.div
          animate={{ 
            y: [0, 10, 0],
            rotate: [0, -5, 0]
          }}
          transition={{ 
            duration: 4, 
            repeat: Infinity, 
            ease: "easeInOut",
            delay: 1
          }}
          className="absolute bottom-4 right-16 text-3xl"
        >
          💎
        </motion.div>
      </div>
    </motion.div>
  );
}; 