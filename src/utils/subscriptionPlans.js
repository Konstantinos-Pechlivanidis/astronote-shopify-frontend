/**
 * Subscription Plans Configuration
 * 
 * Hardcoded pricing details for subscription plans
 * This ensures consistency across all pages that display pricing
 */

export const SUBSCRIPTION_PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    price: 40,
    currency: 'EUR',
    billingPeriod: 'month',
    billingPeriodLabel: 'per month',
    freeCredits: 100,
    freeCreditsPeriod: 'month',
    description: 'Perfect for small businesses getting started with SMS marketing',
    popular: false,
    features: [
      '100 free SMS credits per month',
      'All features included',
      'Campaign builder',
      'Automation workflows',
      'Analytics dashboard',
      'Shopify integration',
      'Message templates',
      'Unlimited contacts',
      'Email support',
    ],
    limits: [
      'Credits roll over if unused',
      'Additional credits available for purchase',
      'Cancel anytime',
    ],
    notes: [
      'Free credits allocated monthly',
      'Credits never expire',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 240,
    currency: 'EUR',
    billingPeriod: 'year',
    billingPeriodLabel: 'per year',
    freeCredits: 500,
    freeCreditsPeriod: 'year',
    description: 'Best value for growing businesses with higher SMS volume needs',
    popular: true,
    features: [
      '500 free SMS credits per year',
      'All features included',
      'Campaign builder',
      'Automation workflows',
      'Analytics dashboard',
      'Shopify integration',
      'Message templates',
      'Unlimited contacts',
      'Priority email support',
      'Save 50% vs monthly billing',
    ],
    limits: [
      'Credits roll over if unused',
      'Additional credits available for purchase',
      'Cancel anytime',
    ],
    notes: [
      'Free credits allocated yearly',
      'Credits never expire',
      'Equivalent to €20/month (billed annually)',
    ],
  },
];

/**
 * Get plan by ID
 */
export function getPlanById(planId) {
  return SUBSCRIPTION_PLANS.find(plan => plan.id === planId);
}

/**
 * Get all plans
 */
export function getAllPlans() {
  return SUBSCRIPTION_PLANS;
}

/**
 * Get popular plan
 */
export function getPopularPlan() {
  return SUBSCRIPTION_PLANS.find(plan => plan.popular);
}

