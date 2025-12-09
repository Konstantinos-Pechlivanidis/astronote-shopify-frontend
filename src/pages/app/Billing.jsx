import { useState, useEffect } from 'react';
import GlassCard from '../../components/ui/GlassCard';
import GlassButton from '../../components/ui/GlassButton';
import PageHeader from '../../components/ui/PageHeader';
import GlassTable, {
  GlassTableHeader,
  GlassTableBody,
  GlassTableRow,
  GlassTableHeaderCell,
  GlassTableCell,
} from '../../components/ui/GlassTable';
import Icon from '../../components/ui/Icon';
import LoadingState from '../../components/ui/LoadingState';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import ErrorState from '../../components/ui/ErrorState';
import StatusBadge from '../../components/ui/StatusBadge';
import EmptyState from '../../components/ui/EmptyState';
import GlassSelectCustom from '../../components/ui/GlassSelectCustom';
import GlassInput from '../../components/ui/GlassInput';
import { 
  useBillingBalance, 
  useBillingPackages, 
  useBillingHistory, 
  useCreatePurchase, 
  useSettings,
  useSubscriptionStatus,
  useSubscribe,
  useUpdateSubscription,
  useCancelSubscription,
  useCalculateTopup,
  useCreateTopup,
  useGetPortal,
} from '../../services/queries';
import { useToastContext } from '../../contexts/ToastContext';
import SEO from '../../components/SEO';
import { format } from 'date-fns';
import { FRONTEND_URL } from '../../utils/constants';

export default function Billing() {
  const toast = useToastContext();
  const [page, setPage] = useState(1);
  const [selectedCurrency, setSelectedCurrency] = useState('EUR');
  const [topupCredits, setTopupCredits] = useState('');
  const pageSize = 20;

  const { data: balanceData, isLoading: isLoadingBalance, error: balanceError } = useBillingBalance();
  const { data: settingsData } = useSettings();
  const { data: subscriptionData, isLoading: isLoadingSubscription } = useSubscriptionStatus();
  const { data: packagesData, isLoading: isLoadingPackages, error: packagesError, refetch: refetchPackages } = useBillingPackages(selectedCurrency);
  const { data: historyData, isLoading: isLoadingHistory, error: historyError } = useBillingHistory({
    page,
    pageSize,
  });
  const createPurchase = useCreatePurchase();
  const subscribe = useSubscribe();
  const updateSubscription = useUpdateSubscription();
  const cancelSubscription = useCancelSubscription();
  const createTopup = useCreateTopup();
  const getPortal = useGetPortal();
  
  // Calculate top-up price when credits are entered
  const { data: topupPriceData, isLoading: isLoadingTopupPrice } = useCalculateTopup(
    topupCredits ? parseInt(topupCredits) : null
  );

  // Normalize response data
  const balanceResponse = balanceData?.data || balanceData || {};
  const balance = balanceResponse.credits || balanceResponse.balance || 0;
  const settings = settingsData?.data || settingsData || {};
  // Get currency from settings first, then balance, then default to EUR
  const settingsCurrency = settings.currency || 'EUR';
  const balanceCurrency = balanceResponse.currency || settingsCurrency;
  const defaultCurrency = balanceCurrency || 'EUR';
  
  // Use selected currency if set, otherwise use default from settings/balance
  const currency = selectedCurrency || defaultCurrency;
  
  const subscriptionResponse = subscriptionData?.data || subscriptionData || {};
  const subscription = subscriptionResponse || {};
  const isSubscriptionActive = subscription.active === true;
  const subscriptionPlan = subscription.planType || null;
  
  const packagesResponse = packagesData?.data || packagesData || {};
  const packages = packagesResponse.packages || (Array.isArray(packagesResponse) ? packagesResponse : []);
  const subscriptionRequired = packagesResponse.subscriptionRequired === true;
  
  const historyResponse = historyData?.data || historyData || {};
  const history = historyResponse.transactions || historyResponse.items || [];
  const pagination = historyResponse.pagination || {};
  
  const topupPrice = topupPriceData?.data || topupPriceData || {};

  // Update selected currency when settings currency changes (immediately sync)
  useEffect(() => {
    if (settingsCurrency && settingsCurrency !== selectedCurrency) {
      // Only auto-update if user hasn't manually selected a different currency
      // But if settings change, we should update to match settings
      setSelectedCurrency(settingsCurrency);
    }
  }, [settingsCurrency, selectedCurrency]); // React to settings changes immediately

  // Refetch packages when currency changes
  useEffect(() => {
    if (selectedCurrency) {
      refetchPackages();
    }
  }, [selectedCurrency, refetchPackages]);

  // Handle URL params for success/cancel
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('success') === 'true') {
      toast.success('Payment completed successfully!');
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    } else if (params.get('canceled') === 'true') {
      toast.info('Payment was cancelled');
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [toast]);

  const handlePurchase = async (packageId) => {
    try {
      // Build success and cancel URLs based on frontend URL
      const successUrl = `${FRONTEND_URL}/shopify/app/billing/success?session_id={CHECKOUT_SESSION_ID}&type=credit_pack`;
      const cancelUrl = `${FRONTEND_URL}/shopify/app/billing/cancel`;
      
      const result = await createPurchase.mutateAsync({ 
        packageId,
        successUrl,
        cancelUrl,
        currency: selectedCurrency, // Include selected currency
      });
      
      // Redirect to Stripe checkout
      if (result?.data?.sessionUrl) {
        toast.success('Redirecting to payment...');
        window.location.href = result.data.sessionUrl;
      } else if (result?.data?.checkoutUrl) {
        toast.success('Redirecting to payment...');
        window.location.href = result.data.checkoutUrl;
      } else if (result?.sessionUrl) {
        toast.success('Redirecting to payment...');
        window.location.href = result.sessionUrl;
      } else if (result?.checkoutUrl) {
        toast.success('Redirecting to payment...');
        window.location.href = result.checkoutUrl;
      } else {
        toast.error('Failed to get checkout URL. Please try again.');
      }
    } catch (error) {
      // Enhanced error handling
      if (error?.code === 'SUBSCRIPTION_REQUIRED' || error?.response?.data?.code === 'SUBSCRIPTION_REQUIRED') {
        toast.error('An active subscription is required to purchase credit packs.');
      } else {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to initiate purchase';
        toast.error(errorMessage);
      }
    }
  };

  const handleSubscribe = async (planType) => {
    try {
      // Backend constructs URLs internally, no need to pass them
      const result = await subscribe.mutateAsync({ planType });
      
      if (result?.data?.checkoutUrl) {
        toast.success('Redirecting to payment...');
        window.location.href = result.data.checkoutUrl;
      } else if (result?.checkoutUrl) {
        toast.success('Redirecting to payment...');
        window.location.href = result.checkoutUrl;
      } else {
        toast.error('Failed to get checkout URL. Please try again.');
      }
    } catch (error) {
      // Enhanced error handling with specific error codes
      if (error?.code === 'ALREADY_SUBSCRIBED' || error?.response?.data?.code === 'ALREADY_SUBSCRIBED') {
        toast.error('You already have an active subscription. Please cancel your current subscription first.');
      } else if (error?.code === 'MISSING_PRICE_ID' || error?.response?.data?.code === 'MISSING_PRICE_ID') {
        toast.error('Payment configuration error. Please contact support.');
      } else if (error?.code === 'INVALID_PLAN_TYPE' || error?.response?.data?.code === 'INVALID_PLAN_TYPE') {
        toast.error('Invalid subscription plan selected.');
      } else {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to initiate subscription';
        toast.error(errorMessage);
      }
    }
  };

  const handleUpdateSubscription = async (planType) => {
    try {
      await updateSubscription.mutateAsync({ planType });
      toast.success(`Subscription updated to ${planType} plan successfully`);
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to update subscription';
      toast.error(errorMessage);
    }
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm('Are you sure you want to cancel your subscription? You will lose access to subscription benefits.')) {
      return;
    }
    
    try {
      await cancelSubscription.mutateAsync();
      toast.success('Subscription cancelled successfully');
      // Refetch subscription status to update UI
      window.location.reload();
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to cancel subscription';
      toast.error(errorMessage);
    }
  };

  const handleManageSubscription = async () => {
    try {
      const result = await getPortal.mutateAsync();
      const portalUrl = result?.data?.portalUrl || result?.portalUrl;
      
      if (portalUrl) {
        window.open(portalUrl, '_blank', 'noopener,noreferrer');
        toast.success('Opening customer portal...');
      } else {
        toast.error('Failed to get portal URL. Please try again.');
      }
    } catch (error) {
      if (error?.code === 'MISSING_CUSTOMER_ID' || error?.response?.data?.code === 'MISSING_CUSTOMER_ID') {
        toast.error('No payment account found. Please subscribe to a plan first.');
      } else {
        const errorMessage = error?.response?.data?.message || error?.message || 'Failed to open customer portal';
        toast.error(errorMessage);
      }
    }
  };

  const handleTopup = async () => {
    const credits = parseInt(topupCredits);
    if (!credits || credits <= 0) {
      toast.error('Please enter a valid number of credits');
      return;
    }

    if (credits > 1000000) {
      toast.error('Maximum 1,000,000 credits per purchase');
      return;
    }

    try {
      const successUrl = `${FRONTEND_URL}/shopify/app/billing/success?session_id={CHECKOUT_SESSION_ID}&type=credit_topup`;
      const cancelUrl = `${FRONTEND_URL}/shopify/app/billing/cancel`;
      
      const result = await createTopup.mutateAsync({
        credits,
        successUrl,
        cancelUrl,
      });
      
      if (result?.data?.checkoutUrl) {
        toast.success('Redirecting to payment...');
        window.location.href = result.data.checkoutUrl;
      } else if (result?.checkoutUrl) {
        toast.success('Redirecting to payment...');
        window.location.href = result.checkoutUrl;
      } else {
        toast.error('Failed to get checkout URL. Please try again.');
      }
    } catch (error) {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to initiate top-up';
      toast.error(errorMessage);
    }
  };

  // Only show full loading state on initial load (no cached data)
  const isInitialLoad = (isLoadingBalance && !balanceData) || (isLoadingPackages && !packagesData);
  const hasError = balanceError || packagesError || historyError;

  if (isInitialLoad) {
    return <LoadingState size="lg" message="Loading billing information..." />;
  }

  const isLowBalance = balance < 100;

  return (
    <>
      <SEO
        title="Billing - Astronote SMS Marketing"
        description="Manage your SMS credits and billing"
        path="/shopify/app/billing"
      />
      <div className="min-h-screen pt-4 sm:pt-6 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 bg-neutral-bg-base w-full max-w-full">
        <div className="max-w-[1400px] mx-auto w-full">
          {/* Header */}
          <PageHeader
            title="Billing"
            subtitle="Manage your SMS credits and purchase history"
          />

          {/* Error State */}
          {hasError && (
            <ErrorState
              title="Error Loading Billing Information"
              message={balanceError?.message || packagesError?.message || historyError?.message || 'Failed to load billing information. Please try refreshing the page.'}
              onAction={() => window.location.reload()}
              actionLabel="Refresh Page"
            />
          )}

          {!hasError && (
            <>
              {/* Current Balance */}
              <GlassCard 
                variant={isLowBalance ? 'default' : 'ice'} 
                className={`p-5 sm:p-6 mb-6 sm:mb-8 ${isLowBalance ? 'border-2 border-red-500/50 bg-red-500/10' : ''}`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2.5 rounded-xl bg-ice-soft/80">
                        <Icon name="billing" size="md" variant="ice" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-text-secondary uppercase tracking-wider">Current Balance</p>
                        <p className={`text-3xl sm:text-4xl font-bold mt-1 ${isLowBalance ? 'text-red-500' : 'text-ice-primary'}`}>
                          {balance.toLocaleString()} credits
                        </p>
                      </div>
                    </div>
                    {isLowBalance && (
                      <div className="flex items-center gap-2 mt-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                        <Icon name="error" size="sm" variant="default" className="text-red-500" />
                        <p className="text-sm text-red-500 font-medium">
                          Low balance. Consider purchasing more credits to continue sending messages.
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-xs text-neutral-text-secondary">Currency</p>
                      <p className="text-sm font-semibold text-neutral-text-primary">{currency}</p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Subscription Section */}
              <div className="mb-6 sm:mb-8 lg:mb-10">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="p-2.5 rounded-xl bg-ice-soft/80">
                    <Icon name="billing" size="md" variant="ice" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-neutral-text-primary">Subscription</h2>
                    <p className="text-sm text-neutral-text-secondary mt-1">Manage your subscription plan</p>
                  </div>
                </div>

                {isLoadingSubscription ? (
                  <div className="flex items-center justify-center py-12">
                    <LoadingSpinner size="lg" />
                  </div>
                ) : isSubscriptionActive ? (
                  <GlassCard className="p-5 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <StatusBadge status="active" />
                          <h3 className="text-lg font-semibold text-neutral-text-primary capitalize">
                            {subscriptionPlan} Plan
                          </h3>
                        </div>
                        <p className="text-sm text-neutral-text-secondary">
                          {subscriptionPlan === 'starter' 
                            ? '€40/month - 100 free credits per month'
                            : '€240/year - 500 free credits per year'}
                        </p>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <GlassButton
                          variant="primary"
                          size="md"
                          onClick={handleManageSubscription}
                          disabled={getPortal.isPending}
                          className="flex items-center gap-2"
                        >
                          <Icon name="settings" size="sm" variant="ice" />
                          Manage Subscription
                        </GlassButton>
                        {subscriptionPlan === 'starter' ? (
                          <GlassButton
                            variant="ghost"
                            size="md"
                            onClick={() => handleUpdateSubscription('pro')}
                            disabled={updateSubscription.isPending}
                          >
                            Upgrade to Pro
                          </GlassButton>
                        ) : (
                          <GlassButton
                            variant="ghost"
                            size="md"
                            onClick={() => handleUpdateSubscription('starter')}
                            disabled={updateSubscription.isPending}
                          >
                            Downgrade to Starter
                          </GlassButton>
                        )}
                        <GlassButton
                          variant="ghost"
                          size="md"
                          onClick={handleCancelSubscription}
                          disabled={cancelSubscription.isPending}
                          className="text-red-500 hover:text-red-600"
                        >
                          Cancel Subscription
                        </GlassButton>
                      </div>
                    </div>
                  </GlassCard>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <GlassCard className="p-5 sm:p-6">
                      <h3 className="text-lg font-semibold mb-2 text-neutral-text-primary">Starter Plan</h3>
                      <p className="text-2xl font-bold mb-2 text-neutral-text-primary">€40<span className="text-sm font-normal text-neutral-text-secondary">/month</span></p>
                      <ul className="space-y-2 mb-4 text-sm text-neutral-text-secondary">
                        <li className="flex items-center gap-2">
                          <Icon name="check" size="xs" variant="ice" />
                          <span>100 free credits per month</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Icon name="check" size="xs" variant="ice" />
                          <span>All features included</span>
                        </li>
                      </ul>
                      <GlassButton
                        variant="primary"
                        size="lg"
                        onClick={() => handleSubscribe('starter')}
                        disabled={subscribe.isPending}
                        className="w-full"
                      >
                        Subscribe to Starter
                      </GlassButton>
                    </GlassCard>
                    <GlassCard variant="fuchsia" className="p-5 sm:p-6 border-2 border-fuchsia-primary relative">
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-fuchsia-primary text-white">
                          Best Value
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-neutral-text-primary">Pro Plan</h3>
                      <p className="text-2xl font-bold mb-2 text-neutral-text-primary">€240<span className="text-sm font-normal text-neutral-text-secondary">/year</span></p>
                      <ul className="space-y-2 mb-4 text-sm text-neutral-text-secondary">
                        <li className="flex items-center gap-2">
                          <Icon name="check" size="xs" variant="ice" />
                          <span>500 free credits per year</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Icon name="check" size="xs" variant="ice" />
                          <span>All features included</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Icon name="check" size="xs" variant="ice" />
                          <span>Save 50% vs monthly</span>
                        </li>
                      </ul>
                      <GlassButton
                        variant="fuchsia"
                        size="lg"
                        onClick={() => handleSubscribe('pro')}
                        disabled={subscribe.isPending}
                        className="w-full"
                      >
                        Subscribe to Pro
                      </GlassButton>
                    </GlassCard>
                  </div>
                )}
              </div>

              {/* Credit Top-up Section */}
              <div className="mb-6 sm:mb-8 lg:mb-10">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="p-2.5 rounded-xl bg-ice-soft/80">
                    <Icon name="billing" size="md" variant="ice" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-neutral-text-primary">Credit Top-up</h2>
                    <p className="text-sm text-neutral-text-secondary mt-1">Purchase additional credits at €0.045 per credit (24% VAT included)</p>
                  </div>
                </div>

                <GlassCard className="p-5 sm:p-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <GlassInput
                        type="number"
                        min="1"
                        max="1000000"
                        label="Number of Credits"
                        value={topupCredits}
                        onChange={(e) => setTopupCredits(e.target.value)}
                        placeholder="Enter credits (e.g., 1000)"
                      />
                      {topupCredits && parseInt(topupCredits) > 0 && (
                        <p className="text-xs text-neutral-text-secondary mt-2">
                          Max 1,000,000 credits per purchase
                        </p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-text-primary mb-2">
                        Price Breakdown
                      </label>
                      {isLoadingTopupPrice ? (
                        <div className="flex items-center gap-2 py-3">
                          <LoadingSpinner size="sm" />
                          <span className="text-sm text-neutral-text-secondary">Calculating...</span>
                        </div>
                      ) : topupPrice.priceEurWithVat ? (
                        <div className="space-y-1 py-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-neutral-text-secondary">Base Price:</span>
                            <span className="text-neutral-text-primary">€{topupPrice.priceEur?.toFixed(2) || '0.00'}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-neutral-text-secondary">VAT (24%):</span>
                            <span className="text-neutral-text-primary">€{topupPrice.vatAmount?.toFixed(2) || '0.00'}</span>
                          </div>
                          <div className="flex justify-between text-base font-semibold pt-2 border-t border-neutral-border">
                            <span className="text-neutral-text-primary">Total:</span>
                            <span className="text-ice-primary">€{topupPrice.priceEurWithVat?.toFixed(2) || '0.00'}</span>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm text-neutral-text-secondary py-3">
                          Enter credits to see price
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-4">
                    <GlassButton
                      variant="primary"
                      size="lg"
                      onClick={handleTopup}
                      disabled={!topupCredits || parseInt(topupCredits) <= 0 || createTopup.isPending || isLoadingTopupPrice}
                      className="w-full sm:w-auto"
                    >
                      {createTopup.isPending ? (
                        <span className="flex items-center justify-center gap-2">
                          <LoadingSpinner size="sm" />
                          Processing...
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <Icon name="billing" size="sm" variant="ice" />
                          Purchase Credits
                        </span>
                      )}
                    </GlassButton>
                  </div>
                </GlassCard>
              </div>

              {/* Purchase Packages (Credit Packs) - Only if subscription active */}
              {isSubscriptionActive && (
                <div className="mb-6 sm:mb-8 lg:mb-10">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4 sm:mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2.5 rounded-xl bg-ice-soft/80">
                        <Icon name="billing" size="md" variant="ice" />
                      </div>
                      <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-neutral-text-primary">Credit Packs</h2>
                        <p className="text-sm text-neutral-text-secondary mt-1">Purchase credit packs at discounted rates (subscription required)</p>
                      </div>
                    </div>
                    <div className="w-full sm:w-auto sm:min-w-[200px]">
                      <GlassSelectCustom
                        label="Currency"
                        value={selectedCurrency}
                        onChange={(e) => setSelectedCurrency(e.target.value)}
                        options={[
                          { value: 'EUR', label: 'EUR (€)' },
                          { value: 'USD', label: 'USD ($)' },
                        ]}
                      />
                    </div>
                  </div>
                
                {isLoadingPackages ? (
                  <div className="flex items-center justify-center py-12">
                    <LoadingSpinner size="lg" />
                  </div>
                ) : packages.length === 0 ? (
                  <EmptyState
                    icon="billing"
                    title="No packages available"
                    message={subscriptionRequired ? "Credit packs require an active subscription. Please subscribe first." : "Credit packages are currently unavailable. Please try again later."}
                  />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                    {packages.map((pkg) => (
                      <GlassCard
                        key={pkg.id}
                        variant={pkg.popular ? 'fuchsia' : 'default'}
                        className={`p-5 sm:p-6 relative hover:shadow-glass-light-lg transition-all duration-200 flex flex-col ${
                          pkg.popular ? 'border-2 border-fuchsia-primary' : ''
                        }`}
                      >
                        {pkg.popular && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-fuchsia-primary text-white shadow-glow-fuchsia-light">
                              Most Popular
                            </span>
                          </div>
                        )}
                        
                        <div className="mb-4 flex-grow">
                          <h3 className="text-lg sm:text-xl font-semibold mb-2 text-neutral-text-primary">
                            {pkg.name}
                          </h3>
                          {pkg.description && (
                            <p className="text-xs text-neutral-text-secondary mb-3">
                              {pkg.description}
                            </p>
                          )}
                          <div className="flex items-baseline gap-2 mb-3">
                            <span className="text-2xl sm:text-3xl font-bold text-neutral-text-primary">
                              {pkg.price?.toFixed(2)} {pkg.currency || currency}
                            </span>
                            {pkg.originalPrice && (
                              <span className="text-sm text-neutral-text-secondary line-through">
                                {pkg.originalPrice} {pkg.currency || currency}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mb-4">
                            <Icon name="sms" size="sm" variant="ice" />
                            <p className="text-sm font-medium text-neutral-text-primary">
                              {pkg.credits?.toLocaleString() || 0} SMS credits
                            </p>
                          </div>
                          
                          {pkg.features && Array.isArray(pkg.features) && pkg.features.length > 0 && (
                            <ul className="space-y-2 mt-4">
                              {pkg.features.map((feature, idx) => (
                                <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-neutral-text-secondary">
                                  <Icon name="check" size="xs" variant="ice" className="flex-shrink-0 mt-0.5" />
                                  <span>{feature}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                        
                        <GlassButton
                          variant={pkg.popular ? 'fuchsia' : 'primary'}
                          size="lg"
                          onClick={() => handlePurchase(pkg.id)}
                          disabled={createPurchase.isPending}
                          className="w-full min-h-[44px] mt-auto"
                        >
                          {createPurchase.isPending ? (
                            <span className="flex items-center justify-center gap-2">
                              <LoadingSpinner size="sm" />
                              Processing...
                            </span>
                          ) : (
                            <span className="flex items-center justify-center gap-2">
                              <Icon name="billing" size="sm" variant="ice" />
                              Purchase
                            </span>
                          )}
                        </GlassButton>
                      </GlassCard>
                    ))}
                  </div>
                )}
                </div>
              )}

              {/* Info message if subscription required but not active */}
              {subscriptionRequired && !isSubscriptionActive && (
                <GlassCard variant="default" className="p-5 sm:p-6 mb-8 border-2 border-ice-primary/50">
                  <div className="flex items-start gap-3">
                    <Icon name="info" size="md" variant="ice" />
                    <div>
                      <h3 className="text-lg font-semibold text-neutral-text-primary mb-2">
                        Subscription Required
                      </h3>
                      <p className="text-sm text-neutral-text-secondary mb-4">
                        Credit packs are only available with an active subscription. Subscribe to a plan above to unlock discounted credit packs.
                      </p>
                    </div>
                  </div>
                </GlassCard>
              )}

              {/* Purchase History */}
              <div>
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <div className="p-2.5 rounded-xl bg-ice-soft/80">
                    <Icon name="chart" size="md" variant="ice" />
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-neutral-text-primary">Purchase History</h2>
                    <p className="text-sm text-neutral-text-secondary mt-1">View your credit purchase transactions</p>
                  </div>
                </div>
                
                {isLoadingHistory ? (
                  <div className="flex items-center justify-center py-12">
                    <LoadingSpinner size="lg" />
                  </div>
                ) : history.length === 0 ? (
                  <EmptyState
                    icon="billing"
                    title="No purchase history"
                    message="Your purchase history will appear here once you make your first credit purchase."
                  />
                ) : (
                  <>
                    <GlassCard className="p-0 overflow-hidden">
                      <div className="overflow-x-auto">
                        <GlassTable>
                          <GlassTableHeader>
                            <GlassTableRow>
                              <GlassTableHeaderCell>Date</GlassTableHeaderCell>
                              <GlassTableHeaderCell>Package</GlassTableHeaderCell>
                              <GlassTableHeaderCell>Credits</GlassTableHeaderCell>
                              <GlassTableHeaderCell>Amount</GlassTableHeaderCell>
                              <GlassTableHeaderCell>Status</GlassTableHeaderCell>
                            </GlassTableRow>
                          </GlassTableHeader>
                          <GlassTableBody>
                            {history.map((transaction) => {
                              const transactionAmount = transaction.amount !== undefined 
                                ? transaction.amount 
                                : transaction.price !== undefined 
                                  ? transaction.price 
                                  : 0;
                              const transactionCurrency = transaction.currency || currency;
                              const transactionCredits = transaction.credits || transaction.creditsAdded || transaction.package?.credits || 0;
                              const packageName = transaction.packageName || transaction.package?.name || transaction.packageType || 'N/A';
                              
                              return (
                                <GlassTableRow key={transaction.id}>
                                  <GlassTableCell>
                                    <span className="text-sm text-neutral-text-secondary">
                                      {transaction.createdAt
                                        ? format(new Date(transaction.createdAt), 'MMM d, yyyy')
                                        : '-'}
                                    </span>
                                  </GlassTableCell>
                                  <GlassTableCell>
                                    <span className="text-sm font-medium text-neutral-text-primary">
                                      {packageName}
                                    </span>
                                  </GlassTableCell>
                                  <GlassTableCell>
                                    <span className="text-sm font-medium text-neutral-text-primary">
                                      {transactionCredits.toLocaleString()}
                                    </span>
                                  </GlassTableCell>
                                  <GlassTableCell>
                                    <span className="text-sm font-medium text-neutral-text-primary">
                                      {transactionAmount.toFixed(2)} {transactionCurrency}
                                    </span>
                                  </GlassTableCell>
                                  <GlassTableCell>
                                    <StatusBadge status={transaction.status || 'completed'} />
                                  </GlassTableCell>
                                </GlassTableRow>
                              );
                            })}
                          </GlassTableBody>
                        </GlassTable>
                      </div>
                    </GlassCard>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                      <div className="mt-6 sm:mt-8">
                        <GlassCard className="p-4 sm:p-6">
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-sm text-neutral-text-secondary">
                              Page {pagination.page || page} of {pagination.totalPages}
                            </div>
                            <div className="flex items-center gap-2">
                              <GlassButton
                                variant="ghost"
                                size="md"
                                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                                disabled={!pagination.hasPrevPage || page === 1}
                                className="min-h-[44px] min-w-[44px]"
                                aria-label="Previous page"
                              >
                                <Icon name="arrowLeft" size="sm" variant="ice" />
                              </GlassButton>
                              <div className="flex items-center gap-1">
                                {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                                  let pageNum;
                                  if (pagination.totalPages <= 5) {
                                    pageNum = i + 1;
                                  } else if (page <= 3) {
                                    pageNum = i + 1;
                                  } else if (page >= pagination.totalPages - 2) {
                                    pageNum = pagination.totalPages - 4 + i;
                                  } else {
                                    pageNum = page - 2 + i;
                                  }
                                  
                                  return (
                                    <GlassButton
                                      key={pageNum}
                                      variant={page === pageNum ? 'primary' : 'ghost'}
                                      size="md"
                                      onClick={() => setPage(pageNum)}
                                      className="min-h-[44px] min-w-[44px]"
                                      aria-label={`Go to page ${pageNum}`}
                                      aria-current={page === pageNum ? 'page' : undefined}
                                    >
                                      {pageNum}
                                    </GlassButton>
                                  );
                                })}
                              </div>
                              <GlassButton
                                variant="ghost"
                                size="md"
                                onClick={() => setPage(prev => Math.min(pagination.totalPages, prev + 1))}
                                disabled={!pagination.hasNextPage || page === pagination.totalPages}
                                className="min-h-[44px] min-w-[44px]"
                                aria-label="Next page"
                              >
                                <Icon name="arrowRight" size="sm" variant="ice" />
                              </GlassButton>
                            </div>
                          </div>
                        </GlassCard>
                      </div>
                    )}
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}
