import { Link } from 'react-router-dom';
import GlassCard from '../components/ui/GlassCard';
import GlassButton from '../components/ui/GlassButton';
import GlassBadge from '../components/ui/GlassBadge';
import Icon from '../components/ui/Icon';
import SEO from '../components/SEO';
import { FRONTEND_URL } from '../utils/constants';
import { SUBSCRIPTION_PLANS } from '../utils/subscriptionPlans';

// Static pricing packages for public landing page
const STATIC_PACKAGES = [
  {
    id: 'package_1000',
    name: '1,000 SMS Credits',
    credits: 1000,
    price: 29.99,
    currency: 'EUR',
    description: 'Perfect for small businesses getting started',
    popular: false,
    features: ['1,000 SMS messages', 'No expiration', 'Priority support'],
  },
  {
    id: 'package_5000',
    name: '5,000 SMS Credits',
    credits: 5000,
    price: 129.99,
    currency: 'EUR',
    description: 'Great value for growing businesses',
    popular: true,
    features: ['5,000 SMS messages', 'No expiration', 'Priority support', '13% savings'],
  },
  {
    id: 'package_10000',
    name: '10,000 SMS Credits',
    credits: 10000,
    price: 229.99,
    currency: 'EUR',
    description: 'Best value for high-volume senders',
    popular: false,
    features: ['10,000 SMS messages', 'No expiration', 'Priority support', '23% savings'],
  },
  {
    id: 'package_25000',
    name: '25,000 SMS Credits',
    credits: 25000,
    price: 499.99,
    currency: 'EUR',
    description: 'Enterprise solution for maximum reach',
    popular: false,
    features: ['25,000 SMS messages', 'No expiration', 'Dedicated support', '33% savings'],
  },
];

export default function Pricing() {
  const roiStats = [
    {
      metric: '3x',
      label: 'Higher conversion than email',
    },
    {
      metric: '98%',
      label: 'SMS open rate',
    },
    {
      metric: '45s',
      label: 'Average response time',
    },
    {
      metric: '20%',
      label: 'Average revenue increase',
    },
  ];

  const serviceData = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: 'Astronote SMS Marketing',
    description: 'SMS marketing service for Shopify stores',
    provider: {
      '@type': 'Organization',
      name: 'Astronote',
    },
    areaServed: 'Worldwide',
    serviceType: 'SMS Marketing',
    offers: STATIC_PACKAGES.map(pkg => ({
      '@type': 'Offer',
      name: pkg.name,
      price: pkg.price,
      priceCurrency: pkg.currency,
      description: pkg.description,
    })),
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
        name: 'Pricing',
        item: `${FRONTEND_URL}/shopify/pricing`,
      },
    ],
  };

  return (
    <>
      <SEO
        title="Pricing That Scales - SMS Marketing for Shopify | Astronote"
        description="Start with a free trial. No credit card required. Choose a subscription plan or buy credits. Credits never expire. Pay only for what you use."
        path="/shopify/pricing"
        keywords="SMS pricing, text message pricing, Shopify SMS cost, SMS credits, subscription plans"
        jsonLd={[serviceData, breadcrumbData]}
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
              Pricing That <span className="text-ice-accent">Scales With You</span>
            </h1>
            <p className="text-xl md:text-2xl text-border-subtle max-w-3xl mx-auto mb-4 leading-relaxed">
              <strong className="text-primary-light">Start with a free trial. No credit card required.</strong> 
              Choose a subscription plan or buy credits as you go. Credits never expire. 
              <strong className="text-primary-light"> Pay only for what you use.</strong>
            </p>
            <div className="flex flex-wrap justify-center gap-6 mt-8 text-sm text-border-subtle">
              <div className="flex items-center gap-2">
                <Icon name="check" size="sm" variant="ice" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="check" size="sm" variant="ice" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="check" size="sm" variant="ice" />
                <span>All features included</span>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Plans */}
        <section className="py-20 px-4 lg:px-8">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-h2 md:text-4xl font-bold mb-4">Subscription Plans</h2>
              <p className="text-lg text-border-subtle max-w-2xl mx-auto">
                Choose a subscription plan to get free credits every billing cycle. All plans include full access to all features.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
              {SUBSCRIPTION_PLANS.map((plan) => (
                <GlassCard
                  key={plan.id}
                  variant={plan.popular ? 'fuchsia' : 'default'}
                  className={`relative ${plan.popular ? 'border-2 border-fuchsia-primary shadow-glow-fuchsia' : ''}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                      <GlassBadge variant="fuchsia">Best Value</GlassBadge>
                    </div>
                  )}
                  
                  <div className="p-6">
                    <div className="text-center mb-6">
                      <div className="flex justify-center mb-4">
                        <div className="p-3 rounded-xl bg-ice-accent/20">
                          <Icon name="sms" size="xl" variant={plan.popular ? 'fuchsia' : 'ice'} />
                        </div>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold mb-2 text-primary-light">{plan.name}</h3>
                      <div className="mb-2">
                        <span className="text-4xl md:text-5xl font-bold text-primary-light">
                          €{plan.price}
                        </span>
                        <span className="text-lg text-border-subtle ml-2">
                          /{plan.billingPeriod}
                        </span>
                      </div>
                      <p className="text-sm text-border-subtle mb-4">
                        {plan.freeCredits.toLocaleString()} SMS credits per {plan.billingPeriod === 'month' ? 'month' : 'year'}
                      </p>
                      {plan.billingPeriod === 'year' && (
                        <p className="text-xs text-ice-accent font-medium">
                          Only €{Math.round(plan.price / 12)}/month when billed annually
                        </p>
                      )}
                    </div>

                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <Icon name="check" size="sm" variant={plan.popular ? 'fuchsia' : 'ice'} className="mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-primary-light">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    {plan.notes && (
                      <div className="mb-6 pt-4 border-t border-neutral-border">
                        <p className="text-xs text-border-subtle">{plan.notes}</p>
                      </div>
                    )}

                    <GlassButton
                      variant={plan.popular ? 'fuchsia' : 'primary'}
                      size="lg"
                      className="w-full"
                      as={Link}
                      to="/shopify/install"
                    >
                      Get Started with {plan.name}
                    </GlassButton>
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* ROI Stats Section */}
        <section className="py-20 px-4 lg:px-8 bg-surface-dark/30">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-h2 md:text-4xl font-bold mb-4">The Numbers Don't Lie</h2>
              <p className="text-lg text-border-subtle max-w-2xl mx-auto">
                <strong className="text-primary-light">SMS delivers results that email can't match.</strong> 
                Here's what Shopify stores using Astronote achieve.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {roiStats.map((stat, index) => (
                <GlassCard key={index} variant="ice" className="p-6 text-center">
                  <div className="text-4xl md:text-5xl font-bold text-ice-accent mb-2">
                    {stat.metric}
                  </div>
                  <div className="text-sm text-border-subtle">
                    {stat.label}
                  </div>
                </GlassCard>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4 lg:px-8">
          <div className="max-w-[1200px] mx-auto">
            <h2 className="text-h2 md:text-4xl font-bold text-center mb-12">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6 max-w-3xl mx-auto">
              <GlassCard variant="dark" className="p-6">
                <h3 className="text-lg md:text-xl font-semibold mb-2">Can I change plans later?</h3>
                <p className="text-sm md:text-base text-border-subtle">
                  Yes, you can upgrade or downgrade your plan at any time. Plan changes take effect immediately. Free credits are allocated on each billing cycle renewal.
                </p>
              </GlassCard>

              <GlassCard variant="dark" className="p-6">
                <h3 className="text-lg md:text-xl font-semibold mb-2">What happens if I run out of credits?</h3>
                <p className="text-sm md:text-base text-border-subtle">
                  You can purchase additional credits at any time through credit top-ups or credit packages. Credits never expire and accumulate in your wallet. Each SMS message costs exactly 1 credit.
                </p>
              </GlassCard>

              <GlassCard variant="dark" className="p-6">
                <h3 className="text-lg md:text-xl font-semibold mb-2">Is there a setup fee?</h3>
                <p className="text-sm md:text-base text-border-subtle">
                  No, there are no setup fees or hidden costs. You only pay for your chosen subscription plan. Additional credits can be purchased as needed.
                </p>
              </GlassCard>

              <GlassCard variant="dark" className="p-6">
                <h3 className="text-lg md:text-xl font-semibold mb-2">Can I purchase additional credits?</h3>
                <p className="text-sm md:text-base text-border-subtle">
                  Yes! You can purchase credit top-ups (pay-as-you-go) at any time, or buy credit packages if you have an active subscription. Credit top-ups are available to all users, while credit packages require an active subscription.
                </p>
              </GlassCard>
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
              <div className="mb-10 p-4 bg-ice-accent/10 border border-ice-accent/20 rounded-lg max-w-2xl mx-auto">
                <p className="text-sm text-border-subtle text-center">
                  <strong className="text-primary-light">Join 10,000+ Shopify stores</strong> already using Astronote to turn SMS into revenue. 
                  <strong className="text-primary-light"> 98% open rates. Instant delivery. Better conversions.</strong>
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <GlassButton variant="primary" size="lg" as={Link} to="/shopify/install" className="group">
                  <span className="flex items-center gap-2">
                    Get Started
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
