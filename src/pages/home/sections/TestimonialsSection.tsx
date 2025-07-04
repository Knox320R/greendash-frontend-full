import React from 'react';
import { motion } from 'framer-motion';
import { FaArrowRight, FaPause, FaPlay } from 'react-icons/fa';
import { Button } from '@/components/ui/button';

const TestimonialsSection = ({ testimonials, isAutoPlaying, setIsAutoPlaying, currentSlide, setCurrentSlide, slidesPerView, goToSlide, nextSlide, prevSlide }: any) => {
  const dots = Array.from({ length: testimonials.length - slidesPerView + 1 }, (_, i) => i);
  return (
    <section className="py-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-50 via-white to-green-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-700 mb-8 bg-gradient-to-b from-gray-50 to-white">What Our Users Say</h2>
          <p className="text-xl text-gray-600">
            Read testimonials from GreenDash users who are making a difference.
          </p>
        </div>
        {/* Testimonials Carousel */}
        <div
          className="relative"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * (100 / slidesPerView)}%)` }}
            >
              {testimonials.map((testimonial: any, idx: number) => (
                <motion.div
                  key={testimonial.id}
                  initial={idx % 4 === 0 ? { opacity: 0, y: 30 } : idx % 4 === 1 ? { opacity: 0, x: 30 } : idx % 4 === 2 ? { opacity: 0, y: -30 } : { opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, y: 0, x: 0 }}
                  transition={{ duration: 0.7 + idx * 0.1, delay: 0.1 * idx, ease: 'easeOut' }}
                  viewport={{ once: true, amount: 0.3 }}
                  className="w-full md:w-1/2 lg:w-1/3 flex-shrink-0 px-4"
                >
                  <div className={`bg-gradient-to-br rounded-md p-6 h-full border`}>
                    <div className="flex items-center mb-4">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                          </svg>
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 italic mb-6">
                      "{testimonial.quote}"
                    </p>
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full overflow-hidden mr-4 border-2 border-white shadow-lg">
                        <img
                          src={testimonial.avatar}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{testimonial.name}</p>
                        <p className="text-gray-600 text-sm">{testimonial.role} • {testimonial.duration}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          {/* Navigation Arrows */}
          <button
            className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow z-10"
            onClick={prevSlide}
          >
            <FaArrowRight className="w-6 h-6 text-gray-600 rotate-180" />
          </button>
          <button
            className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-shadow z-10"
            onClick={nextSlide}
          >
            <FaArrowRight className="w-6 h-6 text-gray-600" />
          </button>
          {/* Auto-play Toggle */}
          <button
            className="absolute top-4 right-4 bg-white rounded-full p-2 shadow-lg hover:shadow-xl transition-shadow z-10"
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
          >
            {isAutoPlaying ? (
              <FaPause className="w-4 h-4 text-gray-600" />
            ) : (
              <FaPlay className="w-4 h-4 text-gray-600" />
            )}
          </button>
          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {dots.map((dot) => (
              <button
                key={dot}
                className={`w-3 h-3 rounded-full transition-colors ${dot === currentSlide ? 'bg-green-500' : 'bg-gray-300'}`}
                onClick={() => goToSlide(dot)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection; 