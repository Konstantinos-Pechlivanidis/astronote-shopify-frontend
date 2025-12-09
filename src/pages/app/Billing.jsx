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
        <div className="max-w-[1600px] mx-auto w-full">
          {/* Header */}
          <div className="mb-6 sm:mb-8 lg:mb-10">
            <PageHeader
              title="Billing"
              subtitle="Manage your SMS credits and purchase history"
            />
          </div>

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
            <div className="space-y-8 sm:space-y-10">
              {/* Current Balance */}
              <GlassCard 
                variant={isLowBalance ? 'default' : 'ice'} 
                className={`p-6 sm:p-8 lg:p-10 shadow-xl border border-neutral-border/40 hover:shadow-2xl transition-all duration-300 ${
                  isLowBalance ? 'border-2 border-red-500/50 bg-red-500/10' : ''
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="p-3 rounded-2xl bg-gradient-to-br from-ice-soft/90 to-ice-primary/20 shadow-lg">
                        <Icon name="billing" size="lg" variant="ice" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-primary uppercase tracking-wider mb-1">Current Balance</p>
                        <p className={`text-4xl sm:text-5xl lg:text-6xl font-bold ${isLowBalance ? 'text-red-500' : 'text-ice-primary'}`}>
                          {balance.toLocaleString()}
                        </p>
                        <p className="text-base sm:text-lg text-primary mt-1">SMS credits</p>
                      </div>
                    </div>
                    {isLowBalance && (
                      <div className="flex items-center gap-3 mt-4 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
                        <Icon name="error" size="md" variant="default" className="text-red-500 flex-shrink-0" />
                        <p className="text-sm sm:text-base text-red-500 font-medium">
                          Low balance. Consider purchasing more credits to continue sending messages.
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-neutral-surface-secondary/50 border border-neutral-border/40">
                    <div className="text-right">
                      <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1">Currency</p>
                      <p className="text-xl font-bold text-neutral-text-primary">{currency}</p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* Subscription Section */}
              <div className="space-y-6">
                <GlassCard className="p-6 sm:p-8 lg:p-10 shadow-xl border border-neutral-border/40 hover:shadow-2xl transition-all duration-300">
                  {/* Section Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-neutral-border/40">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-2xl bg-gradient-to-br from-ice-soft/90 to-ice-primary/20 shadow-lg">
                        <Icon name="billing" size="lg" variant="ice" />
                      </div>
                      <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-neutral-text-primary mb-1">Subscription</h2>
                        <p className="text-sm sm:text-base text-primary">Manage your subscription plan and benefits</p>
                      </div>
                    </div>
                  </div>

                  {isLoadingSubscription ? (
                    <div className="flex items-center justify-center py-16">
                      <LoadingSpinner size="lg" />
                    </div>
                  ) : isSubscriptionActive ? (
                    <div className="space-y-6">
                      <div className="p-5 sm:p-6 rounded-xl bg-gradient-to-r from-ice-soft/30 to-transparent border border-ice-primary/20">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3">
                              <StatusBadge status="active" />
                              <h3 className="text-xl sm:text-2xl font-bold text-neutral-text-primary capitalize">
                                {subscriptionPlan} Plan
                              </h3>
                            </div>
                            <p className="text-base text-primary">
                              {subscriptionPlan === 'starter' 
                                ? '€40/month - 100 free credits per month'
                                : '€240/year - 500 free credits per year'}
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-3">
                        <GlassButton
                          variant="primary"
                          size="lg"
                          onClick={handleManageSubscription}
                          disabled={getPortal.isPending}
                          className="flex items-center justify-center gap-2 min-h-[48px] shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                        >
                          <Icon name="settings" size="sm" variant="ice" />
                          Manage Subscription
                        </GlassButton>
                        {subscriptionPlan === 'starter' ? (
                          <GlassButton
                            variant="ghost"
                            size="lg"
                            onClick={() => handleUpdateSubscription('pro')}
                            disabled={updateSubscription.isPending}
                            className="min-h-[48px]"
                          >
                            Upgrade to Pro
                          </GlassButton>
                        ) : (
                          <GlassButton
                            variant="ghost"
                            size="lg"
                            onClick={() => handleUpdateSubscription('starter')}
                            disabled={updateSubscription.isPending}
                            className="min-h-[48px]"
                          >
                            Downgrade to Starter
                          </GlassButton>
                        )}
                        <GlassButton
                          variant="ghost"
                          size="lg"
                          onClick={handleCancelSubscription}
                          disabled={cancelSubscription.isPending}
                          className="text-red-500 hover:text-red-600 hover:bg-red-500/10 min-h-[48px]"
                        >
                          Cancel Subscription
                        </GlassButton>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
                      <GlassCard className="p-6 sm:p-8 hover:shadow-lg transition-all duration-200">
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-xl sm:text-2xl font-bold mb-2 text-neutral-text-primary">Starter Plan</h3>
                            <div className="flex items-baseline gap-2 mb-4">
                              <span className="text-3xl sm:text-4xl font-bold text-neutral-text-primary">€40</span>
                              <span className="text-base text-primary">/month</span>
                            </div>
                          </div>
                          <ul className="space-y-3 mb-6">
                            <li className="flex items-center gap-3">
                              <Icon name="check" size="sm" variant="ice" className="flex-shrink-0" />
                              <span className="text-sm sm:text-base text-primary">100 free credits per month</span>
                            </li>
                            <li className="flex items-center gap-3">
                              <Icon name="check" size="sm" variant="ice" className="flex-shrink-0" />
                              <span className="text-sm sm:text-base text-primary">All features included</span>
                            </li>
                          </ul>
                          <GlassButton
                            variant="primary"
                            size="lg"
                            onClick={() => handleSubscribe('starter')}
                            disabled={subscribe.isPending}
                            className="w-full min-h-[48px] shadow-md hover:shadow-lg transition-all duration-200"
                          >
                            Subscribe to Starter
                          </GlassButton>
                        </div>
                      </GlassCard>
                      <GlassCard variant="fuchsia" className="p-6 sm:p-8 border-2 border-fuchsia-primary relative hover:shadow-lg transition-all duration-200">
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                          <span className="px-4 py-1.5 text-xs font-bold rounded-full bg-fuchsia-primary text-white shadow-glow-fuchsia-light">
                            Best Value
                          </span>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-xl sm:text-2xl font-bold mb-2 text-neutral-text-primary">Pro Plan</h3>
                            <div className="flex items-baseline gap-2 mb-4">
                              <span className="text-3xl sm:text-4xl font-bold text-neutral-text-primary">€240</span>
                              <span className="text-base text-primary">/year</span>
                            </div>
                          </div>
                          <ul className="space-y-3 mb-6">
                            <li className="flex items-center gap-3">
                              <Icon name="check" size="sm" variant="ice" className="flex-shrink-0" />
                              <span className="text-sm sm:text-base text-primary">500 free credits per year</span>
                            </li>
                            <li className="flex items-center gap-3">
                              <Icon name="check" size="sm" variant="ice" className="flex-shrink-0" />
                              <span className="text-sm sm:text-base text-primary">All features included</span>
                            </li>
                            <li className="flex items-center gap-3">
                              <Icon name="check" size="sm" variant="ice" className="flex-shrink-0" />
                              <span className="text-sm sm:text-base text-primary">Save 50% vs monthly</span>
                            </li>
                          </ul>
                          <GlassButton
                            variant="fuchsia"
                            size="lg"
                            onClick={() => handleSubscribe('pro')}
                            disabled={subscribe.isPending}
                            className="w-full min-h-[48px] shadow-md hover:shadow-lg transition-all duration-200"
                          >
                            Subscribe to Pro
                          </GlassButton>
                        </div>
                      </GlassCard>
                    </div>
                  )}
                </GlassCard>
              </div>

              {/* Credit Top-up Section */}
              <div className="space-y-6">
                <GlassCard className="p-6 sm:p-8 lg:p-10 shadow-xl border border-neutral-border/40 hover:shadow-2xl transition-all duration-300">
                  {/* Section Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-neutral-border/40">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-2xl bg-gradient-to-br from-ice-soft/90 to-ice-primary/20 shadow-lg">
                        <Icon name="billing" size="lg" variant="ice" />
                      </div>
                      <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-neutral-text-primary mb-1">Credit Top-up</h2>
                        <p className="text-sm sm:text-base text-primary">Purchase additional credits at €0.045 per credit (24% VAT included)</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold text-neutral-text-primary mb-1">Purchase Credits</h3>
                          <p className="text-sm text-primary">Enter the number of credits you want to purchase</p>
                        </div>
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
                          <p className="text-xs text-primary">
                            Max 1,000,000 credits per purchase
                          </p>
                        )}
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-lg font-semibold text-neutral-text-primary mb-1">Price Breakdown</h3>
                          <p className="text-sm text-primary">Total cost including VAT</p>
                        </div>
                        {isLoadingTopupPrice ? (
                          <div className="flex items-center gap-3 p-6 rounded-xl bg-neutral-surface-secondary/50">
                            <LoadingSpinner size="sm" />
                            <span className="text-sm text-primary">Calculating...</span>
                          </div>
                        ) : topupPrice.priceEurWithVat ? (
                          <GlassCard variant="ice" className="p-5 sm:p-6 border border-ice-primary/20">
                            <div className="space-y-3">
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-primary">Base Price:</span>
                                <span className="text-neutral-text-primary font-semibold">€{topupPrice.priceEur?.toFixed(2) || '0.00'}</span>
                              </div>
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-primary">VAT (24%):</span>
                                <span className="text-neutral-text-primary font-semibold">€{topupPrice.vatAmount?.toFixed(2) || '0.00'}</span>
                              </div>
                              <div className="pt-3 border-t border-neutral-border/40">
                                <div className="flex justify-between items-center">
                                  <span className="text-base font-semibold text-neutral-text-primary">Total:</span>
                                  <span className="text-xl font-bold text-ice-primary">€{topupPrice.priceEurWithVat?.toFixed(2) || '0.00'}</span>
                                </div>
                              </div>
                            </div>
                          </GlassCard>
                        ) : (
                          <GlassCard className="p-6 rounded-xl bg-neutral-surface-secondary/50">
                            <p className="text-sm text-primary text-center">
                              Enter credits to see price
                            </p>
                          </GlassCard>
                        )}
                      </div>
                    </div>
                    <div className="pt-4 border-t border-neutral-border/40">
                      <GlassButton
                        variant="primary"
                        size="lg"
                        onClick={handleTopup}
                        disabled={!topupCredits || parseInt(topupCredits) <= 0 || createTopup.isPending || isLoadingTopupPrice}
                        className="min-w-[200px] min-h-[48px] shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
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
                  </div>
                </GlassCard>
              </div>

              {/* Purchase Packages (Credit Packs) - Only if subscription active */}
              {isSubscriptionActive && (
                <div className="space-y-6">
                  <GlassCard className="p-6 sm:p-8 lg:p-10 shadow-xl border border-neutral-border/40 hover:shadow-2xl transition-all duration-300">
                    {/* Section Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-neutral-border/40">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-2xl bg-gradient-to-br from-ice-soft/90 to-ice-primary/20 shadow-lg">
                          <Icon name="billing" size="lg" variant="ice" />
                        </div>
                        <div>
                          <h2 className="text-2xl sm:text-3xl font-bold text-neutral-text-primary mb-1">Credit Packs</h2>
                          <p className="text-sm sm:text-base text-primary">Purchase credit packs at discounted rates</p>
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
                      <div className="flex items-center justify-center py-16">
                        <LoadingSpinner size="lg" />
                      </div>
                    ) : packages.length === 0 ? (
                      <EmptyState
                        icon="billing"
                        title="No packages available"
                        message={subscriptionRequired ? "Credit packs require an active subscription. Please subscribe first." : "Credit packages are currently unavailable. Please try again later."}
                      />
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
                        {packages.map((pkg) => (
                          <GlassCard
                            key={pkg.id}
                            variant={pkg.popular ? 'fuchsia' : 'default'}
                            className={`p-5 sm:p-6 relative hover:shadow-xl transition-all duration-200 flex flex-col ${
                              pkg.popular ? 'border-2 border-fuchsia-primary shadow-lg' : 'shadow-md'
                            }`}
                          >
                            {pkg.popular && (
                              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                                <span className="px-3 py-1.5 text-xs font-bold rounded-full bg-fuchsia-primary text-white shadow-glow-fuchsia-light">
                                  Most Popular
                                </span>
                              </div>
                            )}
                            
                            <div className="mb-5 flex-grow space-y-4">
                              <div>
                                <h3 className="text-lg sm:text-xl font-bold mb-2 text-neutral-text-primary">
                                  {pkg.name}
                                </h3>
                                {pkg.description && (
                                  <p className="text-xs sm:text-sm text-primary mb-3">
                                    {pkg.description}
                                  </p>
                                )}
                              </div>
                              <div className="flex items-baseline gap-2 mb-3">
                                <span className="text-2xl sm:text-3xl font-bold text-neutral-text-primary">
                                  {pkg.price?.toFixed(2)} {pkg.currency || currency}
                                </span>
                                {pkg.originalPrice && (
                                  <span className="text-sm text-primary line-through">
                                    {pkg.originalPrice} {pkg.currency || currency}
                                  </span>
                                )}
                              </div>
                              <div className="flex items-center gap-2 mb-4">
                                <Icon name="sms" size="md" variant="ice" />
                                <p className="text-base font-semibold text-neutral-text-primary">
                                  {pkg.credits?.toLocaleString() || 0} SMS credits
                                </p>
                              </div>
                              
                              {pkg.features && Array.isArray(pkg.features) && pkg.features.length > 0 && (
                                <ul className="space-y-2.5 mt-4">
                                  {pkg.features.map((feature, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-primary">
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
                              className="w-full min-h-[48px] mt-auto shadow-md hover:shadow-lg transition-all duration-200"
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
                  </GlassCard>
                </div>
              )}

              {/* Info message if subscription required but not active */}
              {subscriptionRequired && !isSubscriptionActive && (
                <GlassCard variant="default" className="p-6 sm:p-8 border-2 border-ice-primary/50 shadow-lg">
                  <div className="flex items-start gap-4">
                    <Icon name="info" size="lg" variant="ice" className="flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-neutral-text-primary mb-2">
                        Subscription Required
                      </h3>
                      <p className="text-sm sm:text-base text-primary leading-relaxed">
                        Credit packs are only available with an active subscription. Subscribe to a plan above to unlock discounted credit packs.
                      </p>
                    </div>
                  </div>
                </GlassCard>
              )}

              {/* Purchase History */}
              <div className="space-y-6">
                <GlassCard className="p-6 sm:p-8 lg:p-10 shadow-xl border border-neutral-border/40 hover:shadow-2xl transition-all duration-300">
                  {/* Section Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-neutral-border/40">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-2xl bg-gradient-to-br from-ice-soft/90 to-ice-primary/20 shadow-lg">
                        <Icon name="chart" size="lg" variant="ice" />
                      </div>
                      <div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-neutral-text-primary mb-1">Purchase History</h2>
                        <p className="text-sm sm:text-base text-primary">View your credit purchase transactions</p>
                      </div>
                    </div>
                  </div>
                  
                  {isLoadingHistory ? (
                    <div className="flex items-center justify-center py-16">
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
                                    <span className="text-sm text-primary">
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

                      {/* Pagination */}
                      {pagination.totalPages > 1 && (
                        <div className="mt-6 sm:mt-8 pt-6 border-t border-neutral-border/40">
                          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="text-sm text-primary">
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
                        </div>
                      )}
                    </>
                  )}
                </GlassCard>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
