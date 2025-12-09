import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import GlassButton from '../ui/GlassButton';
import Icon from '../ui/Icon';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 16);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMobileMenuOpen && !event.target.closest('nav')) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('click', handleClickOutside);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const navLinks = [
    { path: '/shopify/features', label: 'Features', icon: 'target' },
    { path: '/shopify/pricing', label: 'Pricing', icon: 'sms' },
    { path: '/shopify/how-it-works', label: 'How It Works', icon: 'automation' },
    { path: '/shopify/contact', label: 'Contact', icon: 'segment' },
  ];

  const landingUrl = 'https://astronote-landing.onrender.com';

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-out ${
          isScrolled
            ? 'bg-surface-dark/95 backdrop-blur-[30px] shadow-glass-lg border-b border-glass-border/50'
            : 'bg-surface-dark/80 backdrop-blur-[20px] border-b border-glass-border/30'
        }`}
        style={{ height: '72px' }}
      >
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Logo */}
          <Link 
            to="/shopify" 
            className="flex items-center gap-3 group transition-transform hover:scale-105 z-50"
            aria-label="Astronote Home"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <img 
              src="/Logo/astronote-logo.png" 
              alt="Astronote Logo" 
              className="w-10 h-10 rounded-xl object-contain"
              onError={(e) => { e.target.style.display = 'none'; }}
            />
            <span className="text-xl font-bold text-primary-light tracking-tight">Astronote</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-1">
            <a
              href={landingUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 text-primary-light/90 hover:text-ice-accent hover:bg-ice-accent/5"
            >
              Home
            </a>
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive(link.path)
                    ? 'text-ice-accent bg-ice-accent/10 shadow-glow-ice'
                    : 'text-primary-light/90 hover:text-ice-accent hover:bg-ice-accent/5'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            <GlassButton 
              variant="ghost" 
              size="sm" 
              as={Link} 
              to="/shopify/login"
              className="text-primary-light/90 hover:text-ice-accent transition-colors"
            >
              Log in
            </GlassButton>
            <GlassButton 
              variant="primary" 
              size="sm" 
              as={Link} 
              to="/shopify/install"
              className="bg-gradient-to-r from-ice-accent to-ice-dark hover:from-ice-light hover:to-ice-accent shadow-glow-ice hover:shadow-glow-ice-lg transition-all"
            >
              Install on Shopify
            </GlassButton>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 rounded-lg text-primary-light hover:bg-glass-border/20 transition-colors z-50 relative"
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-primary-dark/80 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />
          
          {/* Mobile Menu */}
          <div 
            className={`fixed top-[72px] left-0 right-0 z-40 bg-surface-dark/98 backdrop-blur-[30px] border-b border-glass-border/50 shadow-glass-lg transition-all duration-300 ease-out lg:hidden ${
              isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
            }`}
          >
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-4">
              {/* Navigation Links */}
              <a
                href={landingUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-primary-light/90 hover:text-ice-accent hover:bg-ice-accent/5"
              >
                <Icon 
                  name="home" 
                  size="md" 
                  variant="default"
                />
                <span className="text-base font-medium">
                  Home
                </span>
              </a>
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                    isActive(link.path)
                      ? 'bg-ice-accent/10 text-ice-accent'
                      : 'text-primary-light/90 hover:text-ice-accent hover:bg-ice-accent/5'
                  }`}
                >
                  <Icon 
                    name={link.icon} 
                    size="md" 
                    variant={isActive(link.path) ? 'ice' : 'default'}
                  />
                  <span className={`text-base font-medium ${isActive(link.path) ? 'font-semibold' : ''}`}>
                    {link.label}
                  </span>
                </Link>
              ))}

              {/* Actions */}
              <div className="pt-4 border-t border-glass-border/30 space-y-3">
                <GlassButton
                  variant="ghost"
                  size="md"
                  className="w-full justify-start text-primary-light/90 hover:text-ice-accent transition-colors"
                  as={Link}
                  to="/shopify/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Log in
                </GlassButton>
                <GlassButton
                  variant="primary"
                  size="md"
                  className="w-full justify-center bg-gradient-to-r from-ice-accent to-ice-dark hover:from-ice-light hover:to-ice-accent shadow-glow-ice hover:shadow-glow-ice-lg transition-all"
                  as={Link}
                  to="/shopify/install"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Install on Shopify
                </GlassButton>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}
