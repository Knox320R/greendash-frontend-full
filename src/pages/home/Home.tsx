import React, { useRef, useState, useEffect } from 'react';
import HeroSection from './sections/HeroSection';
import BenefitsSection from './sections/BenefitsSection';
import GrowthOpportunitySection from './sections/GrowthOpportunitySection';
import StakingSection from './sections/StakingSection';
import TokenSection from './sections/TokenSection';
import AffiliateRanksSection from './sections/AffiliateRanksSection';
import RoadmapSection from './sections/RoadmapSection';
import TestimonialsSection from './sections/TestimonialsSection';
import ContactSection from './sections/ContactSection';
import ConclusionSection from './sections/ConclusionSection';
import { useDispatch, useSelector } from 'react-redux';
import { getMainSettings } from '@/store/admin';
import type { RootState } from '@/store';
import type { AppDispatch } from '@/store';

// TODO: Import and wire up Redux, hooks, and props as needed for each section

const Home: React.FC = () => {
  // State for carousel and other interactive elements

  const dispatch = useDispatch<AppDispatch>();

  const [openTokenDialog, setOpenTokenDialog] = useState(false);

  // Testimonials carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const slidesPerView = 3;

  const adminData = useSelector((state: RootState) => state.adminData);

  // Mock testimonials data
  const testimonials = [
    {
      id: 1,
      quote: "GreenDash has completely transformed how I think about sustainable investing. The daily rewards are incredible!",
      name: "Sarah Johnson",
      role: "Environmental Consultant",
      duration: "6 months",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      id: 2,
      quote: "As a driver, I love earning more while contributing to a greener future. The platform is revolutionary.",
      name: "Michael Chen",
      role: "Electric Vehicle Driver",
      duration: "8 months",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 3,
      quote: "The profit-sharing model is genius. I'm earning from every transaction while supporting sustainability.",
      name: "Emma Rodriguez",
      role: "Tech Entrepreneur",
      duration: "1 year",
      avatar: "https://randomuser.me/api/portraits/women/68.jpg"
    },
    {
      id: 4,
      quote: "Finally, a platform that puts people and planet first. The returns are amazing too!",
      name: "David Kim",
      role: "Investment Advisor",
      duration: "4 months",
      avatar: "https://randomuser.me/api/portraits/men/65.jpg"
    },
    {
      id: 5,
      quote: "GreenDash proves that you can do good and do well. I'm proud to be part of this movement.",
      name: "Lisa Thompson",
      role: "Sustainability Expert",
      duration: "10 months",
      avatar: "https://randomuser.me/api/portraits/women/12.jpg"
    }
  ];

  // Testimonials carousel functions
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % (testimonials.length - slidesPerView + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + (testimonials.length - slidesPerView + 1)) % (testimonials.length - slidesPerView + 1));
  };

  const goToSlide = (slide: number) => {
    setCurrentSlide(slide);
  };

  useEffect(() => {
    dispatch(getMainSettings());
  }, [])

  // Auto-play effect
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, currentSlide]);

  // Handlers for token section
  const handleBuyGreenClick = () => {
    setOpenTokenDialog(true);
  };

  const handleBuyToken = (tokenType: string) => {
    console.log(`Buying ${tokenType} token`);
    setOpenTokenDialog(false);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section (staking-focused headline/CTA) */}
      <section id="home" className="py-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-50 via-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <HeroSection adminSettings={adminData.admin_settings} />
        </div>
      </section>

      {/* Staking Section (move up, right after hero) */}
      <section id="staking" className="py-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-50 via-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StakingSection stakingPackages={adminData.staking_packages} adminSettings={adminData.admin_settings} />
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-50 via-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <BenefitsSection />
        </div>
      </section>

      {/* Growth Opportunity Section */}
      <section id="opportunity" className="py-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-50 via-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <GrowthOpportunitySection />
        </div>
      </section>

      {/* Token Section */}
      <section id="token" className="py-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-50 via-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TokenSection
            openTokenDialog={openTokenDialog}
            setOpenTokenDialog={setOpenTokenDialog}
            handleBuyGreenClick={handleBuyGreenClick}
            handleBuyToken={handleBuyToken}
            totalTokens={adminData.total_tokens}
            adminSettings={adminData.admin_settings}
          />
        </div>
      </section>

      {/* Affiliate Ranks Section */}
      <section id="ranks" className="py-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-50 via-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AffiliateRanksSection rankPlans={adminData.rank_plans} />
        </div>
      </section>

      {/* Roadmap Section */}
      <section id="roadmap" className="py-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-50 via-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <RoadmapSection />
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-50 via-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <TestimonialsSection
            testimonials={testimonials}
            isAutoPlaying={isAutoPlaying}
            setIsAutoPlaying={setIsAutoPlaying}
            currentSlide={currentSlide}
            setCurrentSlide={setCurrentSlide}
            slidesPerView={slidesPerView}
            goToSlide={goToSlide}
            nextSlide={nextSlide}
            prevSlide={prevSlide}
          />
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-50 via-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ContactSection isAuthenticated={false} supportEmail={adminData.admin_settings.find(s => s.title === 'support_email')?.value} />
        </div>
      </section>

      {/* Conclusion Section */}
      <section id="conclusion" className="py-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-50 via-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ConclusionSection />
        </div>
      </section>
    </div>
  );
};

export default Home; 