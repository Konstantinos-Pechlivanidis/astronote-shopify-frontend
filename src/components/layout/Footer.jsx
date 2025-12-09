import { Link } from 'react-router-dom';

export default function Footer() {
  const footerLinks = {
    product: [
      { path: '/shopify/features', label: 'Features' },
      { path: '/shopify/pricing', label: 'Pricing' },
      { path: '/shopify/how-it-works', label: 'How It Works' },
    ],
    company: [
      { path: '/shopify/contact', label: 'Contact' },
    ],
    legal: [
      { path: '/shopify/privacy', label: 'Privacy Policy' },
      { path: '/shopify/terms', label: 'Terms of Service' },
      { path: '/shopify/gdpr', label: 'GDPR Policy' },
    ],
  };

  return (
    <footer className="border-t border-glass-border bg-surface-dark/50 backdrop-blur-[20px]">
      <div className="max-w-[1200px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-ice-accent flex items-center justify-center">
                <span className="text-primary-dark font-bold text-lg">A</span>
              </div>
              <span className="text-h3 font-semibold text-primary-light">Astronote</span>
            </div>
            <p className="text-sm text-border-subtle leading-relaxed">
              SMS Marketing for Shopify. Grow your store with SMS marketing that converts.
            </p>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold text-primary-light mb-4 uppercase tracking-wider">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-border-subtle hover:text-ice-accent transition-colors inline-flex items-center gap-2 group"
                  >
                    {link.label}
                    <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold text-primary-light mb-4 uppercase tracking-wider">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-border-subtle hover:text-ice-accent transition-colors inline-flex items-center gap-2 group"
                  >
                    {link.label}
                    <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold text-primary-light mb-4 uppercase tracking-wider">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-border-subtle hover:text-ice-accent transition-colors inline-flex items-center gap-2 group"
                  >
                    {link.label}
                    <svg className="w-3 h-3 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright & GDPR Warning */}
        <div className="pt-8 border-t border-glass-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-4">
            <p className="text-sm text-border-subtle text-center md:text-left">
              © {new Date().getFullYear()} Astronote. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-border-subtle">
              <span className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-ice-accent" />
                Built with ❤️ for Shopify stores
              </span>
            </div>
          </div>
          <div className="text-center text-xs text-border-subtle/80 space-y-1">
            <p>
              <strong>Important:</strong> You are solely responsible for GDPR compliance and adherence to our terms of service.
            </p>
            <p>
              Failure to comply with GDPR regulations or our application's terms results in <strong>full liability on your part.</strong>
            </p>
            <p className="mt-2">
              Please review our <Link to="/shopify/gdpr" className="text-ice-accent hover:underline">GDPR Policy</Link>, <Link to="/shopify/terms" className="text-ice-accent hover:underline">Terms of Service</Link>, and <Link to="/shopify/privacy" className="text-ice-accent hover:underline">Privacy Policy</Link> for complete details.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
