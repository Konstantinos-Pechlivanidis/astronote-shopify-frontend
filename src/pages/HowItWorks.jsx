import { Link } from 'react-router-dom';
import GlassCard from '../components/ui/GlassCard';
import GlassButton from '../components/ui/GlassButton';
import GlassBadge from '../components/ui/GlassBadge';
import Icon from '../components/ui/Icon';
import ImageLightbox from '../components/ui/ImageLightbox';
import IPhonePreviewWithDiscount from '../components/iphone/IPhonePreviewWithDiscount';
import ContactCaptureFeature from '../components/ContactCaptureFeature';
import SEO from '../components/SEO';
import { FRONTEND_URL } from '../utils/constants';

export default function HowItWorks() {
  const steps = [
    {
      number: '01',
      icon: 'connect',
      title: 'Install & Connect',
      description: 'Install Astronote from the Shopify App Store. Connect your store in one click—takes less than 2 minutes. Your customer data syncs automatically, so you can start sending campaigns immediately.',
      image: '/images/campaigns.png',
    },
    {
      number: '02',
      icon: 'campaign',
      title: 'Create Your First Campaign',
      description: 'Write your message, preview it on iPhone, add discount codes. See exactly how it will look to customers. Personalize with merge tags, schedule for optimal send times, and target specific segments.',
      image: '/images/create_campaign.png',
    },
    {
      number: '03',
      icon: 'send',
      title: 'Send & Track Revenue',
      description: 'Send immediately or schedule for later. Track opens, deliveries, and conversions in real-time. See exactly how much revenue each campaign generates and optimize for better results.',
      image: '/images/reports.png',
    },
    {
      number: '04',
      icon: 'workflow',
      title: 'Automate & Scale',
      description: 'Set up automated workflows that run 24/7. Welcome new customers automatically. Send birthday offers. Trigger messages based on orders or behavior. Set it once, let it run.',
      image: '/images/campaigns.png',
    },
  ];

  const automations = [
    {
      icon: 'sms',
      title: 'Welcome Message',
      description: 'Automatically send a welcome SMS when customers opt-in to receive messages.',
      trigger: 'Customer opt-in',
    },
    {
      icon: 'workflow',
      title: 'Abandoned Cart Recovery',
      description: 'Automatically send SMS when customers leave items in cart.',
      trigger: 'Cart abandoned for 1 hour',
      badge: 'Coming Soon',
    },
    {
      icon: 'sms',
      title: 'Order Confirmation',
      description: 'Send order confirmation with tracking information.',
      trigger: 'New order placed',
    },
    {
      icon: 'send',
      title: 'Order Fulfilled',
      description: 'Notify customers when their order is fulfilled with tracking information.',
      trigger: 'Order fulfilled',
    },
    {
      icon: 'personal',
      title: 'Birthday Messages',
      description: 'Send personalized birthday wishes with discount codes.',
      trigger: 'Customer birthday',
    },
    {
      icon: 'reengage',
      title: 'Customer Re-engagement',
      description: 'Send SMS to inactive customers to encourage them to return.',
      trigger: 'No orders in 90 days',
      badge: 'Coming Soon',
    },
  ];

  return (
    <>
      <SEO
        title="How It Works - Get Started in 4 Steps | Astronote for Shopify"
        description="Install in 2 minutes. Customer data syncs automatically. Create campaigns, send discount codes, track revenue. Start free trial—no credit card required."
        path="/shopify/how-it-works"
        keywords="how Astronote works, SMS setup, Shopify SMS integration, getting started"
        jsonLd={{
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
              name: 'How It Works',
              item: `${FRONTEND_URL}/shopify/how-it-works`,
            },
          ],
        }}
      />
      <div className="min-h-screen bg-bg-dark text-primary-light">
        {/* Hero Section */}
        <section className="relative pt-24 sm:pt-32 md:pt-36 pb-16 sm:pb-20 md:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-bg-dark via-surface-dark to-bg-dark">
            <div className="absolute top-10 sm:top-20 right-10 sm:right-20 w-64 h-64 sm:w-96 sm:h-96 bg-ice-accent/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-10 sm:bottom-20 left-10 sm:left-20 w-64 h-64 sm:w-96 sm:h-96 bg-zoom-fuchsia/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          </div>

          <div className="relative max-w-[1200px] mx-auto">
            <div className="text-center mb-12 sm:mb-16 px-4">
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
                Get Started in <span className="text-ice-accent">4 Simple Steps</span>
              </h1>
              <p className="text-lg sm:text-xl md:text-2xl text-border-subtle max-w-3xl mx-auto mb-3 sm:mb-4 leading-relaxed">
                <strong className="text-primary-light">From installation to your first campaign in minutes.</strong> 
                Your customer data syncs automatically. Create campaigns, send discount codes, track revenue. 
                <strong className="text-primary-light"> No technical knowledge required.</strong>
              </p>
              <div className="flex flex-wrap justify-center gap-6 mt-6 text-sm text-border-subtle">
                <div className="flex items-center gap-2">
                  <Icon name="check" size="sm" variant="ice" />
                  <span>Setup in under 2 minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="check" size="sm" variant="ice" />
                  <span>No technical knowledge needed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="check" size="sm" variant="ice" />
                  <span>Free 14-day trial</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Steps Section */}
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-[1400px] mx-auto">
            <div className="space-y-12 sm:space-y-16 md:space-y-20">
              {steps.map((step, index) => {
                const isEven = index % 2 === 0;
                
                return (
                  <div key={index}>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
                      {/* Image */}
                      <div className={isEven ? 'lg:order-1' : 'lg:order-2'}>
                        <div className="relative bg-surface-dark/50 backdrop-blur-md border border-glass-border rounded-2xl overflow-hidden p-6">
                          <div className="w-full h-80 md:h-96 bg-neutral-surface-primary/10 rounded-lg flex items-center justify-center overflow-hidden">
                            <ImageLightbox
                              imageSrc={step.image}
                              imageAlt={step.title}
                              className="w-full h-full"
                            >
                              <img
                                src={step.image}
                                alt={step.title}
                                className="w-full h-full object-contain cursor-pointer"
                                onError={(e) => {
                                  e.target.style.display = 'none';
                                }}
                              />
                            </ImageLightbox>
                          </div>
                        </div>
                      </div>

                      {/* Content */}
                      <div className={isEven ? 'lg:order-2' : 'lg:order-1'}>
                        <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                          <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-ice-accent/20">
                            {step.number}
                          </div>
                          <div className="p-2 sm:p-3 bg-ice-accent/20 rounded-lg">
                            <Icon name={step.icon} size="lg" variant="ice" />
                          </div>
                        </div>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">
                          {step.title}
                        </h2>
                        <p className="text-base sm:text-lg text-border-subtle leading-relaxed">
                          {step.description}
                        </p>
                      </div>
                    </div>

                    {/* Arrow between steps */}
                    {index < steps.length - 1 && (
                      <div className="flex justify-center my-8 sm:my-10 md:my-12">
                        <Icon name="arrowDown" size="lg" variant="ice" className="text-ice-accent/40" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Live Preview Section */}
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-surface-dark/30">
          <div className="max-w-[1200px] mx-auto">
            <GlassCard variant="dark" className="p-6 sm:p-8 md:p-10">
              <div className="text-center mb-6 sm:mb-8 px-4">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">See It In Action</h2>
                <p className="text-base sm:text-lg text-border-subtle max-w-2xl mx-auto">
                  Here's how your SMS campaigns will look to customers. Real-time preview with discount codes and unsubscribe links.
                </p>
              </div>
              <div className="flex justify-center px-4">
                <IPhonePreviewWithDiscount
                  message="Hi {{first_name}}! Get 20% off your next order with code {{discount_code}}. Shop now at yourstore.com\n\nReply STOP to unsubscribe"
                  discountCode="SUMMER20"
                  firstName="Sarah"
                  unsubscribeToken="demo-token-123"
                />
              </div>
            </GlassCard>
          </div>
        </section>

        {/* How We Capture Contacts Section */}
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-[1200px] mx-auto">
            <ContactCaptureFeature />
          </div>
        </section>

        {/* Automation Examples */}
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 bg-surface-dark/30">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-8 sm:mb-12 md:mb-16 px-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">Automation Examples</h2>
              <p className="text-base sm:text-lg text-border-subtle max-w-2xl mx-auto">
                <strong className="text-primary-light">Set up automated SMS flows that work 24/7.</strong> 
                Here are examples of workflows that drive revenue while you sleep.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {automations.map((automation, index) => (
                <GlassCard key={index} variant="ice" className="p-4 sm:p-6 relative group hover:scale-[1.02] transition-all duration-300">
                  {automation.badge && (
                    <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                      <GlassBadge variant="ice" className="text-xs">
                        {automation.badge}
                      </GlassBadge>
                    </div>
                  )}
                  <div className="flex items-start gap-3 sm:gap-4">
                    <div className="p-2 sm:p-3 rounded-xl bg-ice-accent/20 group-hover:bg-ice-accent/30 transition-colors flex-shrink-0">
                      <Icon name={automation.icon} size="lg" variant="ice" />
                    </div>
                    <div className="flex-1">
                      <div className="mb-1 sm:mb-2">
                        <span className="text-xs text-ice-accent font-medium">{automation.trigger}</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">{automation.title}</h3>
                      <p className="text-sm sm:text-base text-border-subtle">{automation.description}</p>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 sm:py-20 md:py-24 px-4 sm:px-6 bg-gradient-to-b from-surface-dark to-bg-dark relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-ice-accent/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 sm:w-96 sm:h-96 bg-zoom-fuchsia/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          </div>
          <div className="relative max-w-[800px] mx-auto text-center">
            <div className="bg-surface-dark/50 backdrop-blur-md border border-glass-border rounded-2xl p-8 sm:p-10 md:p-12">
              <div className="flex justify-center mb-4 sm:mb-6">
                <div className="p-3 sm:p-4 rounded-xl bg-ice-accent/20">
                  <Icon name="growth" size="xl" variant="ice" />
                </div>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 px-4">Stop Waiting. Start Growing.</h2>
              <p className="text-base sm:text-lg text-border-subtle mb-6 leading-relaxed max-w-2xl mx-auto px-4">
                <strong className="text-primary-light">Your customers are on their phones right now.</strong> 
                While you're sending emails that get ignored, your competitors are using SMS to drive sales. 
                <strong className="text-primary-light"> Start your free trial today—no credit card required.</strong>
              </p>
              <div className="mb-6 sm:mb-10 p-4 bg-ice-accent/10 border border-ice-accent/20 rounded-lg max-w-2xl mx-auto">
                <p className="text-sm text-border-subtle text-center">
                  <strong className="text-primary-light">Trusted by 10,000+ Shopify stores</strong> worldwide. 
                  <strong className="text-primary-light"> 98% open rates. Instant delivery. Better conversions.</strong>
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
                <GlassButton variant="primary" size="lg" as={Link} to="/shopify/install" className="group w-full sm:w-auto">
                  <span className="flex items-center justify-center gap-2">
                    Start Free Trial
                    <Icon name="arrowRight" size="sm" className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </GlassButton>
                <GlassButton variant="ghost" size="lg" as={Link} to="/shopify/login" className="w-full sm:w-auto">
                  Sign In
                </GlassButton>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
