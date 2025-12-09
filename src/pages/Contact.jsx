import { useState } from 'react';
import GlassCard from '../components/ui/GlassCard';
import GlassButton from '../components/ui/GlassButton';
import Icon from '../components/ui/Icon';
import SEO from '../components/SEO';
import { API_URL, FRONTEND_URL } from '../utils/constants';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic validation
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all required fields.');
      return;
    }

    // Simulate form submission
    try {
      const response = await fetch(`${API_URL}/public/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setSubmitted(true);
      setFormData({ name: '', email: '', company: '', message: '' });
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const localBusinessData = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: 'Astronote',
    description: 'SMS Marketing for Shopify stores',
    url: FRONTEND_URL,
    email: 'support@astronote.com',
    areaServed: 'Worldwide',
    serviceType: 'SMS Marketing Software',
  };

  const breadcrumbData = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: FRONTEND_URL,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Contact',
        item: `${FRONTEND_URL}/shopify/contact`,
      },
    ],
  };

  return (
    <>
      <SEO
        title="Contact Us - Get Help Growing Your Store | Astronote"
        description="Have questions? We're here to help. Reach out to our team and we'll get back to you as soon as possible. Free setup assistance available."
        path="/shopify/contact"
        keywords="contact Astronote, SMS marketing support, Shopify SMS help"
        jsonLd={[localBusinessData, breadcrumbData]}
      />
      <div className="min-h-screen bg-bg-dark text-primary-light">
        {/* Hero Section */}
        <section className="relative pt-36 pb-24 px-4 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-bg-dark via-surface-dark to-bg-dark">
            <div className="absolute top-20 right-20 w-96 h-96 bg-ice-accent/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-zoom-fuchsia/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          </div>

          <div className="relative max-w-[1200px] mx-auto text-center">
            <h1 className="text-hero md:text-7xl font-bold mb-6 leading-tight">
              We're Here to <span className="text-ice-accent">Help You Succeed</span>
            </h1>
            <p className="text-xl md:text-2xl text-border-subtle max-w-3xl mx-auto mb-4 leading-relaxed">
              <strong className="text-primary-light">Have questions? We're here to help.</strong> 
              Reach out to our team and we'll get back to you as soon as possible. 
              <strong className="text-primary-light"> Our support team is available to help you grow your store with SMS marketing.</strong>
            </p>
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-border-subtle">
              <div className="flex items-center gap-2">
                <Icon name="check" size="sm" variant="ice" />
                <span>24/7 support</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="check" size="sm" variant="ice" />
                <span>Average response: 2 hours</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="check" size="sm" variant="ice" />
                <span>Free setup assistance</span>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form Section */}
        <section className="py-20 px-4 lg:px-8">
          <div className="max-w-[1200px] mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Contact Info */}
              <div className="lg:col-span-1 space-y-6">
                <GlassCard variant="ice" className="p-6">
                  <div className="mb-4">
                    <h2 className="text-h2 font-bold mb-2">Contact Information</h2>
                    <p className="text-sm text-border-subtle">
                      Reach out to us through any of these channels.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-ice-accent/20 flex-shrink-0">
                        <Icon name="sms" size="md" variant="ice" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-primary-light mb-1">
                          Email
                        </div>
                        <a
                          href="mailto:support@astronote.com"
                          className="text-sm text-ice-accent hover:underline"
                        >
                          support@astronote.com
                        </a>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-ice-accent/20 flex-shrink-0">
                        <Icon name="clock" size="md" variant="ice" />
                      </div>
                      <div>
                        <div className="text-sm font-semibold text-primary-light mb-1">
                          Support
                        </div>
                        <div className="text-sm text-border-subtle">
                          Available Monday - Friday, 9 AM - 6 PM EST
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </div>

              {/* Contact Form */}
              <div className="lg:col-span-2">
                <GlassCard variant="ice" className="p-8">
                  <div className="mb-6">
                    <h2 className="text-h2 font-bold mb-2">Send us a Message</h2>
                    <p className="text-sm text-border-subtle">
                      Fill out the form below and we'll get back to you within 24 hours.
                    </p>
                  </div>
                  {submitted ? (
                    <div className="p-8 bg-ice-accent/20 border border-ice-accent/30 rounded-lg text-center">
                      <div className="flex justify-center mb-4">
                        <div className="p-3 rounded-full bg-ice-accent/20">
                          <Icon name="check" size="xl" variant="ice" />
                        </div>
                      </div>
                      <h3 className="text-xl md:text-2xl font-bold mb-2">Message Sent!</h3>
                      <p className="text-sm md:text-base text-border-subtle">
                        We've received your message and will get back to you soon.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      {error && (
                        <div className="p-4 bg-zoom-fuchsia/20 border border-zoom-fuchsia/30 rounded-lg flex items-center gap-2">
                          <Icon name="error" size="md" variant="fuchsia" className="flex-shrink-0" />
                          <p className="text-sm text-zoom-fuchsia">{error}</p>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium mb-2">
                            Name <span className="text-zoom-fuchsia">*</span>
                          </label>
                          <input
                            id="name"
                            name="name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-surface-dark/50 border border-glass-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ice-accent/50 text-primary-light placeholder-border-subtle"
                            placeholder="Your name"
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium mb-2">
                            Email <span className="text-zoom-fuchsia">*</span>
                          </label>
                          <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-surface-dark/50 border border-glass-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ice-accent/50 text-primary-light placeholder-border-subtle"
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="company" className="block text-sm font-medium mb-2">
                          Company (Optional)
                        </label>
                        <input
                          id="company"
                          name="company"
                          type="text"
                          value={formData.company}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-surface-dark/50 border border-glass-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ice-accent/50 text-primary-light placeholder-border-subtle"
                          placeholder="Your company name"
                        />
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-medium mb-2">
                          Message <span className="text-zoom-fuchsia">*</span>
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          value={formData.message}
                          onChange={handleChange}
                          rows={6}
                          className="w-full px-4 py-3 bg-surface-dark/50 border border-glass-border rounded-lg focus:outline-none focus:ring-2 focus:ring-ice-accent/50 text-primary-light placeholder-border-subtle resize-none"
                          placeholder="Tell us how we can help..."
                        />
                      </div>

                      <GlassButton
                        type="submit"
                        variant="primary"
                        size="lg"
                        className="w-full sm:w-auto group"
                      >
                        <span className="flex items-center gap-2">
                          <Icon name="send" size="sm" variant="ice" />
                          Send Message
                        </span>
                      </GlassButton>
                    </form>
                  )}
                </GlassCard>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
