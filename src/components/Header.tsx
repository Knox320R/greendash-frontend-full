import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { FaBars, FaUser, FaSignOutAlt, FaTimes, FaLeaf, FaCheckCircle, FaWallet } from 'react-icons/fa';
import { useAuth } from '@/hooks/useAuth';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { CardContent } from './ui/card';
import { useWallet } from '@/hooks/WalletContext';
import LanguageSwitcher from './LanguageSwitcher';
import { useTranslation } from 'react-i18next';

interface HeaderProps {
  scrollToSection?: (sectionId: string) => void;
}

const Header: React.FC<HeaderProps> = ({ scrollToSection }) => {
  const { t } = useTranslation('common');
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated, logout } = useAuth();
  const { connectWallet, disconnectWallet, isConnected } = useWallet()
  
  // Navigation items for landing page sections
  const sectionNavItems = [
    // { id: 1, label: 'Home', section: 'home', primary: true },
    { id: 2, label: t('header.navigation.staking'), section: 'staking', primary: false },
    { id: 3, label: t('header.navigation.benefits'), section: 'benefits', primary: false },
    { id: 4, label: t('header.navigation.opportunity'), section: 'opportunity', primary: false },
    { id: 5, label: t('header.navigation.tokens'), section: 'token', primary: false },
    { id: 6, label: t('header.navigation.ranks'), section: 'ranks', primary: false },
    { id: 7, label: t('header.navigation.roadmap'), section: 'roadmap', primary: false },
    { id: 8, label: t('header.navigation.testimonials'), section: 'testimonials', primary: false },
    { id: 9, label: t('header.navigation.contact'), section: 'contact', primary: false },
    { id: 10, label: t('header.navigation.join'), section: 'conclusion', primary: false },
  ];
  
  // Auth/page links
  const getAuthButtons = () => {
    if (isAuthenticated && user) {
      const buttons = [
        { id: 1, label: t('header.auth.dashboard'), to: '/dashboard' },
        { id: 2, label: t('header.auth.affiliates'), to: '/affiliates' },
        { id: 3, label: t('header.auth.staking'), to: '/staking' },
        { id: 4, label: t('header.auth.profile'), to: '/profile' },
      ];
      if (user.is_admin) {
        buttons.push({ id: 99, label: t('header.auth.admin'), to: '/admin' });
      }
      return buttons;
    } else {
      return [
        { id: 1, label: t('header.auth.login'), to: '/login' },
        { id: 2, label: t('header.auth.register'), to: '/register' },
      ];
    }
  };

  // Mobile menu state
  const [mobileOpen, setMobileOpen] = useState(false);

  // Add More dropdown state
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside or esc
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (moreRef.current && !moreRef.current.contains(e.target as Node)) setMoreOpen(false);
    };
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMoreOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  // Scroll to section helper
  const handleScroll = (section: string) => {
    setMobileOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(section);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(section);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    if (scrollToSection) scrollToSection(section);
  };

  // Logout handler
  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.log('Logout error:', err);
    }
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const authButtons = getAuthButtons();

  // In mobile drawer, group secondary items under a collapsible 'More' section
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);

  const isHomePage = location.pathname === '/';

  return (
    <nav className="fixed top-0 w-full bg-gradient-to-r from-green-600 via-green-500 to-green-400 shadow-xl z-50 border-b-4 border-green-700">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 relative justify-between">
          <div className="absolute cursor-pointer hover:shadow-xl top-[80px] right-0 z-10">
            {
              isConnected ?
                <FaWallet className="h-6 w-6 text-green-400 hover:text-green-600" onClick={() => disconnectWallet()} />
                :
                <FaWallet className="h-6 w-6 text-gray-400 hover:text-gray-600" onClick={() => connectWallet(user.wallet_address)} />
            }
          </div>
          {/* Logo */}
          <div
            className="text-2xl font-extrabold text-white tracking-wide drop-shadow-lg cursor-pointer flex items-center gap-2"
            onClick={() => { handleScroll('home'); }}
            aria-label={t('header.ui.greenDashHome')}
            tabIndex={0}
          >
            <FaLeaf className="w-7 h-7 text-white drop-shadow-lg" />
            GreenDash
          </div>

          {/* Desktop Navigation */}
          {isHomePage && (
            <div className="hidden md:flex items-center gap-2">
              {sectionNavItems.filter(item => item.primary).map((item) => (
                <a
                  key={item.id}
                  href={`#${item.section}`}
                  className="px-3 py-2 rounded-lg text-white font-semibold hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-green-200"
                  aria-label={item.label}
                >
                  {item.label}
                </a>
              ))}
              <div className="absolute left-[180px]" ref={moreRef}>
                <button
                  className="px-3 py-2 rounded-lg text-white font-semibold hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-green-200 flex items-center gap-1"
                  aria-haspopup="true"
                  aria-expanded={moreOpen}
                  onClick={() => setMoreOpen((v) => !v)}
                  onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setMoreOpen(v => !v); }}
                >
                  {t('header.ui.goTo')}
                  <span className="ml-1">▼</span>
                </button>
                {moreOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-50 py-2 border border-gray-200">
                    {sectionNavItems.filter(item => !item.primary).map((item) => (
                      <a
                        key={item.id}
                        href={`#${item.section}`}
                        className="block px-4 py-2 text-gray-700 hover:bg-green-50 rounded-md transition-colors"
                        tabIndex={0}
                        onClick={() => setMoreOpen(false)}
                      >
                        {item.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Auth/Page Links (Desktop) */}
          <div className="hidden md:flex items-center gap-2 ml-4">
            <LanguageSwitcher />
            {authButtons.map((btn) => (
              <Link
                key={btn.id}
                to={btn.to}
                className="px-3 py-2 rounded-lg text-white font-semibold hover:bg-yellow-400 hover:text-green-900 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-200"
              >
                {btn.label}
              </Link>
            ))}
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="ml-2 px-3 py-2 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-200 flex items-center gap-1"
              >
                <FaSignOutAlt className="w-4 h-4" /> {t('header.auth.logout')}
              </button>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex items-center justify-center w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white focus:outline-none focus:ring-2 focus:ring-green-200"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={t('header.ui.openMenu')}
          >
            {mobileOpen ? <FaTimes className="w-6 h-6" /> : <FaBars className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 bg-black/40 z-50" onClick={() => setMobileOpen(false)}>
          <div
            className="absolute top-0 left-0 w-4/5 max-w-xs h-full bg-gradient-to-br from-green-600 via-green-500 to-green-400 shadow-2xl p-6 flex flex-col gap-4"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center gap-2 mb-6">
              <FaLeaf className="w-7 h-7 text-white drop-shadow-lg" />
              <span className="text-2xl font-extrabold text-white">GreenDash</span>
            </div>
            {isHomePage && (
              <>
                {sectionNavItems.filter(item => item.primary).map((item) => (
                  <a
                    key={item.id}
                    href={`#${item.section}`}
                    className="w-full text-left px-4 py-3 rounded-lg text-white font-semibold hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-green-200"
                    aria-label={item.label}
                  >
                    {item.label}
                  </a>
                ))}
                <div>
                  <button
                    className="w-full text-left px-4 py-3 rounded-lg text-white font-semibold hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-green-200 flex items-center justify-between"
                    onClick={() => setMobileMoreOpen(v => !v)}
                    aria-expanded={mobileMoreOpen}
                    aria-controls="mobile-more-menu"
                  >
                    {t('header.ui.more')}
                    <span>{mobileMoreOpen ? '▲' : '▼'}</span>
                  </button>
                  {mobileMoreOpen && (
                    <div id="mobile-more-menu" className="pl-2 mt-1">
                      {sectionNavItems.filter(item => !item.primary).map((item) => (
                        <a
                          key={item.id}
                          href={`#${item.section}`}
                          className="block w-full text-left px-4 py-3 rounded-lg text-white font-semibold hover:bg-white/10 transition-colors focus:outline-none focus:ring-2 focus:ring-green-200"
                          aria-label={item.label}
                        >
                          {item.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
            <div className="border-t border-white/20 my-4" />
            <div className="px-4 py-2">
              <LanguageSwitcher />
            </div>
            {authButtons.map((btn) => (
              <Link
                key={btn.id}
                to={btn.to}
                className="block w-full text-left px-4 py-3 rounded-lg text-white font-semibold hover:bg-yellow-400 hover:text-green-900 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-200"
                onClick={() => setMobileOpen(false)}
              >
                {btn.label}
              </Link>
            ))}
            {isAuthenticated && (
              <button
                onClick={() => { setMobileOpen(false); handleLogout(); }}
                className="w-full text-left px-4 py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors focus:outline-none focus:ring-2 focus:ring-red-200 flex items-center gap-1 mt-2"
              >
                <FaSignOutAlt className="w-4 h-4" /> {t('header.auth.logout')}
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Header; 