import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight } from 'react-icons/fa';

interface Benefit {
  id: number;
  title: string;
  description: string;
  icon: React.ElementType;
  image: string;
}

const slidesPerView = 1;

const BenefitsSection = ({ benefits = [] }: { benefits?: Benefit[] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const totalSlides = benefits.length;
  const canShowArrows = totalSlides > slidesPerView;

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (idx: number) => {
    setCurrentSlide(idx);
  };

  useEffect(() => {
    if (!isAutoPlaying || totalSlides <= 1) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, currentSlide, totalSlides]);

  return (
    <section className="py-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <motion.h2
            className="text-2xl font-bold mb-8 text-gray-600 bg-gradient-to-b from-gray-50 to-white"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.3 }}
          >
            Why GreenDash?
          </motion.h2>
          <motion.p
            className="text-xl text-gray-500"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: 'easeOut' }}
            viewport={{ once: true, amount: 0.3 }}
          >
            Discover the advantages of joining our sustainable ecosystem.
          </motion.p>
        </div>
        {/* What is GreenDash? */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.3 }}
          className="mt-10 mb-8 max-w-3xl mx-auto text-center"
        >
          <h3 className="text-2xl font-bold mb-2 text-green-700">What is GreenDash?</h3>
          <p className="text-lg text-gray-400">
            eGreenDash is a platform that revolutionizes urban mobility. Our system is decentralized, where drivers earn more, passengers pay less, and we guarantee a positive environmental impact.
          </p>
        </motion.div>
        {/* Project Pillars */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true, amount: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-10"
        >
          <div className="bg-green-50 border border-green-200 rounded-md p-6 shadow-sm flex flex-col items-center">
            <span className="text-3xl font-bold text-green-700 mb-2">90%</span>
            <span className="text-lg font-semibold text-gray-800 mb-1">Drivers earn more</span>
            <span className="text-gray-500 text-center">Drivers keep 90% of the earnings from each ride.</span>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-md p-6 shadow-sm flex flex-col items-center">
            <span className="text-3xl font-bold text-green-700 mb-2">20% Cheaper</span>
            <span className="text-lg font-semibold text-gray-800 mb-1">Passengers pay less</span>
            <span className="text-gray-500 text-center">Ride costs are up to 20% cheaper for passengers.</span>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-md p-6 shadow-sm flex flex-col items-center">
            <span className="text-3xl font-bold text-green-700 mb-2">Sustainability</span>
            <span className="text-lg font-semibold text-gray-800 mb-1">Electric Cars Only</span>
            <span className="text-gray-500 text-center">Exclusive use of electric cars, reducing carbon emissions in urban transportation.</span>
          </div>
        </motion.div>
        {/* Direct Comparison Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          viewport={{ once: true, amount: 0.3 }}
          className="overflow-x-auto max-w-4xl mx-auto mb-12"
        >
          <h4 className="text-xl font-bold mb-3 text-green-700 text-center">Direct Comparison with Uber</h4>
          <table className="min-w-full bg-white border border-gray-200 rounded-md overflow-hidden shadow">
            <thead>
              <tr className="bg-green-100">
                <th className="py-2 px-4 text-left font-semibold text-gray-700">Criteria</th>
                <th className="py-2 px-4 text-center font-semibold text-green-700">eGreenDash</th>
                <th className="py-2 px-4 text-center font-semibold text-gray-700">Uber</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="py-2 px-4">Driver Fee</td>
                <td className="py-2 px-4 text-center">10%</td>
                <td className="py-2 px-4 text-center">20% to 30% (up to 3x more)</td>
              </tr>
              <tr className="border-t">
                <td className="py-2 px-4">Profit Sharing</td>
                <td className="py-2 px-4 text-center">Yes, for token holders</td>
                <td className="py-2 px-4 text-center">No</td>
              </tr>
              <tr className="border-t">
                <td className="py-2 px-4">Sustainability</td>
                <td className="py-2 px-4 text-center">Use of electric cars</td>
                <td className="py-2 px-4 text-center">No clear focus</td>
              </tr>
              <tr className="border-t">
                <td className="py-2 px-4">Governance</td>
                <td className="py-2 px-4 text-center">Decentralized</td>
                <td className="py-2 px-4 text-center">Centralized</td>
              </tr>
              <tr className="border-t">
                <td className="py-2 px-4">Passenger Cost</td>
                <td className="py-2 px-4 text-center">Up to 20% cheaper</td>
                <td className="py-2 px-4 text-center">High fares</td>
              </tr>
            </tbody>
          </table>
        </motion.div>
      </div>
      {/* Benefits Carousel */}
      <div
        className="overflow-hidden relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {Array.isArray(benefits) && benefits.map((benefit, index) => (
            <div className="flex-shrink-0 w-full pl-4" key={benefit.id} style={{ minWidth: '100%' }}>
              <div className="grid grid-cols-1 md:pl-10 md:grid-cols-2 gap-8 md:gap-16 items-center">
                <motion.div
                  className="py-8 text-center md:text-left md:order-2"
                  initial={index % 4 === 0 ? { opacity: 0, y: 30 } : index % 4 === 1 ? { opacity: 0, x: 30 } : index % 4 === 2 ? { opacity: 0, y: -30 } : { opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, y: 0, x: 0 }}
                  transition={{ duration: 0.8 + index * 0.1, delay: 0.2 + 0.1 * index, ease: 'easeOut' }}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  {benefit.icon && <benefit.icon className="w-12 h-12 text-green-500 mx-auto md:mx-0 mb-4" />}
                  <h3 className="text-4xl font-bold mb-4 text-gray-900">
                    {benefit.title}
                  </h3>
                  <p className="max-w-xl text-lg text-gray-500 mx-auto md:mx-0">
                    {benefit.description}
                  </p>
                </motion.div>
                <motion.div
                  className="h-80 rounded-md overflow-hidden border border-gray-200 bg-white md:order-1 shadow-deep p-2 m-4"
                  initial={index % 4 === 0 ? { opacity: 0, x: 100 } : index % 4 === 1 ? { opacity: 0, y: 100 } : index % 4 === 2 ? { opacity: 0, x: -100 } : { opacity: 0, y: -100 }}
                  whileInView={{ opacity: 1, x: 0, y: 0 }}
                  transition={{ duration: 0.8 + index * 0.1, delay: 0.2 + 0.1 * index, ease: 'easeOut' }}
                  viewport={{ once: true, amount: 0.3 }}
                >
                  <img src={benefit.image} alt={benefit.title} className="w-full h-full object-cover rounded-md" />
                </motion.div>
              </div>
            </div>
          ))}
        </div>
        {/* Navigation Arrows for Benefits Carousel */}
        {canShowArrows && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white border border-gray-200 shadow-lg hover:bg-green-50 text-green-600 rounded-full p-3 transition-all z-10"
              aria-label="Previous Benefit"
            >
              <FaArrowRight className="w-6 h-6 rotate-180" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white border border-gray-200 shadow-lg hover:bg-green-50 text-green-600 rounded-full p-3 transition-all z-10"
              aria-label="Next Benefit"
            >
              <FaArrowRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>
      <div className="flex justify-center mt-8 space-x-3">
        {benefits.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide ? 'bg-green-500 w-6' : 'bg-gray-600'}`}
            aria-label={`Go to benefit ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default BenefitsSection; 