import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import HeroSection from './sections/HeroSection';
import BenefitsSection from './sections/BenefitsSection';
import GrowthOpportunitySection from './sections/GrowthOpportunitySection';
import StakingSection from './sections/StakingSection';
import TokenSection from './sections/TokenSection';
import AffiliateRanksSection from './sections/AffiliateRanksSection';
import RoadmapSection from './sections/RoadmapSection';
import TestimonialsSection from './sections/TestimonialsSection';
import ConclusionSection from './sections/ConclusionSection';
import { useDispatch, useSelector } from 'react-redux';
import { getMainSettings } from '@/store/admin';
import type { RootState } from '@/store';
import type { AppDispatch } from '@/store';
import { authApi } from '@/store/auth';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

// TODO: Import and wire up Redux, hooks, and props as needed for each section

const Home: React.FC = () => {
  const { t } = useTranslation(['home', 'common']);
  // State for carousel and other interactive elements
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate()
  const [openTokenDialog, setOpenTokenDialog] = useState(false);

  // Testimonials carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const slidesPerView = 3;

  const adminData = useSelector((state: RootState) => state.adminData);

  // Translated testimonials data
  const testimonials = [
    {
      id: 1,
      quote: t('home:testimonials.testimonial1.quote'),
      name: t('home:testimonials.testimonial1.name'),
      role: t('home:testimonials.testimonial1.role'),
      duration: t('home:testimonials.testimonial1.duration'),
      avatar: "https://randomuser.me/api/portraits/women/44.jpg"
    },
    {
      id: 2,
      quote: t('home:testimonials.testimonial2.quote'),
      name: t('home:testimonials.testimonial2.name'),
      role: t('home:testimonials.testimonial2.role'),
      duration: t('home:testimonials.testimonial2.duration'),
      avatar: "https://randomuser.me/api/portraits/men/32.jpg"
    },
    {
      id: 3,
      quote: t('home:testimonials.testimonial3.quote'),
      name: t('home:testimonials.testimonial3.name'),
      role: t('home:testimonials.testimonial3.role'),
      duration: t('home:testimonials.testimonial3.duration'),
      avatar: "https://randomuser.me/api/portraits/women/68.jpg"
    },
    {
      id: 4,
      quote: t('home:testimonials.testimonial4.quote'),
      name: t('home:testimonials.testimonial4.name'),
      role: t('home:testimonials.testimonial4.role'),
      duration: t('home:testimonials.testimonial4.duration'),
      avatar: "https://randomuser.me/api/portraits/men/65.jpg"
    },
    {
      id: 5,
      quote: t('home:testimonials.testimonial5.quote'),
      name: t('home:testimonials.testimonial5.name'),
      role: t('home:testimonials.testimonial5.role'),
      duration: t('home:testimonials.testimonial5.duration'),
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
    if(!adminData?.admin_settings?.length) dispatch(getMainSettings());
  }, [adminData?.admin_settings?.length, dispatch])

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
          <HeroSection adminSettings={adminData?.admin_settings || []} />
        </div>
      </section>

      {/* Staking Section (move up, right after hero) */}
      <section id="staking" className="py-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-50 via-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <StakingSection stakingPackages={adminData?.staking_packages || []} adminSettings={adminData?.admin_settings || []}/>
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
            totalTokens={adminData?.total_tokens || []}
            adminSettings={adminData?.admin_settings || []}
          />
        </div>
      </section>

      {/* Affiliate Ranks Section */}
      <section id="ranks" className="py-20 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-green-50 via-white to-green-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AffiliateRanksSection rankPlans={adminData?.rank_plans || []} />
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
          {/* <ContactSection isAuthenticated={false} supportEmail={adminData.admin_settings.find(s => s.title === 'support_email')?.value} /> */}
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