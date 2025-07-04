import React, { useState } from 'react';
import { FaTwitter, FaTelegramPlane, FaGithub, FaLinkedin, FaFacebook, FaInstagram, FaYoutube, FaDiscord } from 'react-icons/fa';
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '../components/ui/tooltip';

const socialLinks = [
  { name: 'Twitter', href: 'https://twitter.com/', icon: FaTwitter },
  { name: 'Telegram', href: 'https://t.me/', icon: FaTelegramPlane },
  { name: 'GitHub', href: 'https://github.com/', icon: FaGithub },
  { name: 'LinkedIn', href: 'https://linkedin.com/', icon: FaLinkedin },
  { name: 'Facebook', href: 'https://facebook.com/', icon: FaFacebook },
  { name: 'Instagram', href: 'https://instagram.com/', icon: FaInstagram },
  { name: 'YouTube', href: 'https://youtube.com/', icon: FaYoutube },
  { name: 'Discord', href: 'https://discord.com/', icon: FaDiscord },
];

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Newsletter submit handler (placeholder)
  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setEmail('');
  };

  return (
    <footer className="w-full bg-gradient-to-r from-green-600 to-green-400 text-white shadow-lg pt-12 pb-8 mt-24">
      <TooltipProvider>
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row md:items-start md:justify-between gap-10">
          {/* Left: Brand & Mission */}
          <div className="mb-8 md:mb-0 flex-1 min-w-[220px]">
            <div className="font-bold text-2xl mb-2 drop-shadow-sm flex items-center gap-2">
              <span className="inline-block w-3 h-3 bg-yellow-300 rounded-full mr-2"></span>
              GreenDash
            </div>
            <div className="text-sm opacity-90 mb-4 max-w-xs">
              Empowering sustainable urban mobility and rewarding every stakeholder. Join the movement for a greener, smarter future.
            </div>
            <div className="flex space-x-4 mt-2">
              {socialLinks.map(({ name, href, icon: Icon }) => (
                <Tooltip key={name}>
                  <TooltipTrigger asChild>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-yellow-200 transition-colors duration-200"
                      aria-label={name}
                    >
                      <Icon size={24} />
                    </a>
                  </TooltipTrigger>
                  <TooltipContent className="relative bg-white/80 text-green-700 font-semibold rounded-xl shadow-lg px-4 py-2 backdrop-blur-md border border-green-200">
                    <svg className="absolute left-1/2 -top-2.5 -translate-x-1/2" width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <polygon points="9,10 0,0 18,0" fill="white" fillOpacity="0.8" filter="drop-shadow(0 1px 2px rgba(0,0,0,0.08))" />
                    </svg>
                    {name}
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>
          </div>

          {/* Center: Newsletter Signup */}
          <div className="mb-8 md:mb-0 flex-1 min-w-[260px]">
            <div className="font-semibold text-lg mb-2">Subscribe to our Newsletter</div>
            <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleNewsletterSubmit}>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Your email address"
                className="px-4 py-2 rounded-lg border border-green-200 text-green-900 focus:ring-2 focus:ring-green-400 focus:outline-none shadow-sm flex-1 min-w-[160px]"
                aria-label="Email address"
              />
              <button
                type="submit"
                className="px-6 py-2 rounded-lg bg-yellow-300 text-green-900 font-bold hover:bg-yellow-400 transition-colors shadow-lg focus:outline-none focus:ring-2 focus:ring-yellow-200"
                disabled={submitted}
              >
                {submitted ? 'Subscribed!' : 'Subscribe'}
              </button>
            </form>
            <div className="text-xs text-white/80 mt-2">No spam. Unsubscribe anytime.</div>
          </div>

          {/* Right: Legal Links */}
          <div className="flex-1 min-w-[180px] flex flex-col items-start md:items-end">
            <div className="font-semibold text-lg mb-2">Legal</div>
            <div className="flex flex-col gap-2 mb-4">
              <a
                href="/privacy-policy"
                className="hover:underline hover:text-yellow-200 transition-colors text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
              <a
                href="/terms-of-service"
                className="hover:underline hover:text-yellow-200 transition-colors text-sm"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms of Service
              </a>
            </div>
            <div className="text-xs text-white/70">&copy; {new Date().getFullYear()} GreenDash. All rights reserved.</div>
          </div>
        </div>
      </TooltipProvider>
    </footer>
  );
};

export default Footer; 