import { Link } from 'react-router-dom';
import GlassCard from '../components/ui/GlassCard';
import GlassButton from '../components/ui/GlassButton';
import Icon from '../components/ui/Icon';
import ImageLightbox from '../components/ui/ImageLightbox';
import SEO from '../components/SEO';
import { FRONTEND_URL } from '../utils/constants';

export default function Features() {
  const features = [
    {
      icon: 'campaign',
      title: 'Campaign Management',
      description: 'Create campaigns in minutes. Personalize with merge tags. Schedule for optimal send times. Track revenue from every message in real-time.',
      items: [
        'Create unlimited campaigns',
        'Schedule messages in advance',
        'Personalize with merge tags',
        'A/B test message variations',
        'Track open and click rates',
      ],
      image: '/images/create_campaign.png',
    },
    {
      icon: 'segment',
      title: 'Contact Management',
      description: 'Your customer data syncs automatically from Shopify. No manual work. Segment by behavior, purchase history, and preferences. Start sending campaigns immediately.',
      items: [
        'Automatic Shopify customer sync',
        'Import contacts from CSV',
        'Segment by tags and groups',
        'Track customer preferences',
        'Manage opt-ins and opt-outs',
        'Export contact lists',
      ],
      image: '/images/campaigns.png',
    },
    {
      icon: 'workflow',
      title: 'Automations',
      description: 'Set up workflows that run 24/7. Welcome new customers automatically. Send birthday offers. Trigger messages based on orders or behavior. Set it once, let it run.',
      items: [
        'Welcome series automation',
        'Birthday and anniversary triggers',
        'Abandoned cart recovery',
        'Re-engagement campaigns',
        'Custom workflow builder',
      ],
      image: '/images/automations.png',
    },
    {
      icon: 'analytics',
      title: 'Analytics & Reporting',
      description: 'See exactly how much revenue each campaign generates. Track opens, clicks, and conversions in real-time. Make decisions based on actual results.',
      items: [
        'Real-time campaign metrics',
        'Revenue tracking',
        'Customer engagement analytics',
        'Custom date range reports',
        'Export data to CSV',
      ],
      image: '/images/reports.png',
    },
    {
      icon: 'template',
      title: 'Template Library',
      description: 'Save time with pre-built templates optimized for conversion. Or create your own. All templates are GDPR-compliant and ready to use.',
      items: [
        'Pre-built template library',
        'Custom template creation',
        'Template categories',
        'Save favorite templates',
        'Template preview',
        'GDPR-compliant templates',
      ],
      image: '/images/campaigns.png',
    },
    {
      icon: 'integration',
      title: 'Shopify Integration',
      description: 'One-click connection. Customer data, orders, and products sync automatically. Manage everything from your Shopify admin—no platform switching.',
      items: [
        'One-click Shopify connection',
        'Automatic customer sync',
        'Order event webhooks',
        'Product data integration',
        'Real-time inventory updates',
      ],
      image: '/images/campaigns.png',
    },
  ];

  return (
    <>
      <SEO
        title="Features That Drive Revenue - SMS Marketing for Shopify | Astronote"
        description="Turn SMS into sales. Campaign management, automations, analytics, and Shopify integration. Track revenue from every message. Start free trial."
        path="/shopify/features"
        keywords="SMS features, text message features, campaign builder, automation, analytics"
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
              name: 'Features',
              item: `${FRONTEND_URL}/shopify/features`,
            },
          ],
        }}
      />
      <div className="min-h-screen bg-bg-dark text-primary-light">
        {/* Hero Section */}
        <section className="relative pt-36 pb-24 px-4 lg:px-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-bg-dark via-surface-dark to-bg-dark">
            <div className="absolute top-20 right-20 w-96 h-96 bg-ice-accent/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-20 left-20 w-96 h-96 bg-zoom-fuchsia/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          </div>

          <div className="relative max-w-[1200px] mx-auto">
            <div className="text-center mb-16">
              <h1 className="text-hero md:text-7xl font-bold mb-6 leading-tight">
                Features That <span className="text-ice-accent">Drive Revenue</span>
              </h1>
              <p className="text-xl md:text-2xl text-border-subtle max-w-3xl mx-auto mb-4 leading-relaxed">
                <strong className="text-primary-light">Everything you need to turn SMS into sales.</strong> 
                Create campaigns, automate workflows, track revenue—all built to help you grow your Shopify store. 
                <strong className="text-primary-light"> No fluff, just results.</strong>
              </p>
              <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-border-subtle">
                <div className="flex items-center gap-2">
                  <Icon name="check" size="sm" variant="ice" />
                  <span>14-day free trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="check" size="sm" variant="ice" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <Icon name="check" size="sm" variant="ice" />
                  <span>24/7 support</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 px-4 lg:px-8">
          <div className="max-w-[1400px] mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <GlassCard key={index} variant="ice" className="p-8 flex flex-col group hover:scale-[1.02] transition-all duration-300">
                  {/* Image */}
                  <div className="relative mb-6">
                    <ImageLightbox
                      imageSrc={feature.image}
                      imageAlt={feature.title}
                      className="w-full h-48 bg-neutral-surface-primary/10 rounded-lg overflow-hidden flex items-center justify-center"
                    >
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="w-full h-full object-contain cursor-pointer"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </ImageLightbox>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 bg-ice-accent/20 group-hover:bg-ice-accent/30 transition-colors rounded-lg flex-shrink-0">
                      <Icon name={feature.icon} size="lg" variant="ice" />
                    </div>
                    <h3 className="text-h2 font-bold text-primary-light">
                      {feature.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-body text-border-subtle mb-6 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Feature List */}
                  <ul className="space-y-2.5 flex-1">
                    {feature.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-2">
                        <Icon name="check" size="sm" variant="ice" className="flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-border-subtle">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 px-4 bg-gradient-to-b from-surface-dark to-bg-dark relative overflow-hidden">
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-ice-accent/10 rounded-full blur-3xl animate-float" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-zoom-fuchsia/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          </div>
          <div className="relative max-w-[800px] mx-auto text-center">
            <div className="bg-surface-dark/50 backdrop-blur-md border border-glass-border rounded-2xl p-10 md:p-12">
              <div className="flex justify-center mb-6">
                <div className="p-4 rounded-xl bg-ice-accent/20">
                  <Icon name="growth" size="xl" variant="ice" />
                </div>
              </div>
              <h2 className="text-h1 md:text-5xl font-bold mb-6">Stop Waiting. Start Growing.</h2>
              <p className="text-lg text-border-subtle mb-6 leading-relaxed max-w-2xl mx-auto">
                <strong className="text-primary-light">Your customers are on their phones right now.</strong> 
                While you're sending emails that get ignored, your competitors are using SMS to drive sales. 
                <strong className="text-primary-light"> Start your free trial today—no credit card required.</strong>
              </p>
              <div className="mb-10 p-4 bg-ice-accent/10 border border-ice-accent/20 rounded-lg">
                <p className="text-sm text-border-subtle text-center">
                  <strong className="text-primary-light">Join 10,000+ Shopify stores</strong> already using Astronote to turn SMS into revenue. 
                  <strong className="text-primary-light"> 98% open rates. Instant delivery. Better conversions.</strong>
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <GlassButton variant="primary" size="lg" as={Link} to="/shopify/install" className="group">
                  <span className="flex items-center gap-2">
                    Start Free Trial
                    <Icon name="arrowRight" size="sm" className="group-hover:translate-x-1 transition-transform" />
                  </span>
                </GlassButton>
                <GlassButton variant="ghost" size="lg" as={Link} to="/shopify/login">
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
