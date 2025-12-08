import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import GlassCard from '../../components/ui/GlassCard';
import GlassButton from '../../components/ui/GlassButton';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Icon from '../../components/ui/Icon';
import { useVerifySubscriptionSession, useSubscriptionStatus, useBillingBalance } from '../../services/queries';
import { useToastContext } from '../../contexts/ToastContext';
import SEO from '../../components/SEO';

export default function BillingSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const toast = useToastContext();
  const [isVerifying, setIsVerifying] = useState(false);
  const sessionId = searchParams.get('session_id');
  const paymentType = searchParams.get('type') || 'unknown';
  const verifySession = useVerifySubscriptionSession();
  const { data: subscriptionData, refetch: refetchSubscription } = useSubscriptionStatus();
  const { refetch: refetchBalance } = useBillingBalance();

  useEffect(() => {
    // If session_id is present and it's a subscription, verify it
    if (sessionId && !isVerifying && paymentType === 'subscription') {
      setIsVerifying(true);
      verifySession.mutate(
        { sessionId },
        {
          onSuccess: () => {
            refetchSubscription();
            refetchBalance();
            toast.success('Payment verified successfully!');
          },
          onError: (error) => {
            // Don't show error - webhook will handle the verification in the background
            // Silently handle verification errors as they're not critical
            console.warn('Subscription verification failed:', error);
          },
          onSettled: () => {
            setIsVerifying(false);
          },
        },
      );
    } else if (sessionId && paymentType !== 'subscription') {
      // For top-up and pack purchases, just refresh balance after a delay
      // Webhook will process the payment
      setTimeout(() => {
        refetchBalance();
        toast.success('Payment processed! Credits will be added shortly.');
      }, 2000);
    }
  }, [sessionId, paymentType, isVerifying, verifySession, refetchSubscription, refetchBalance, toast]);

  const subscription = subscriptionData?.data || subscriptionData || {};

  // Determine success message based on payment type
  const getSuccessMessage = () => {
    switch (paymentType) {
      case 'subscription':
        return {
          title: 'Subscription Activated!',
          message: 'Your subscription has been activated successfully. Free credits have been allocated to your account.',
        };
      case 'credit_topup':
        return {
          title: 'Credits Added!',
          message: 'Your credit top-up has been processed successfully. Credits have been added to your account.',
        };
      case 'credit_pack':
        return {
          title: 'Purchase Complete!',
          message: 'Your credit pack purchase has been completed successfully. Credits have been added to your account.',
        };
      default:
        return {
          title: 'Payment Successful!',
          message: 'Your payment has been processed successfully. Credits have been added to your account.',
        };
    }
  };

  const successInfo = getSuccessMessage();

  return (
    <>
      <SEO
        title="Payment Successful - Astronote SMS Marketing"
        description="Your payment was processed successfully"
        path="/shopify/app/billing/success"
      />
      <div className="min-h-screen pt-4 sm:pt-6 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 bg-neutral-bg-base w-full max-w-full">
        <div className="max-w-[800px] mx-auto w-full">
          <PageHeader
            title="Payment Successful"
            subtitle="Your payment has been processed successfully"
          />

          <GlassCard className="p-8 sm:p-10 text-center">
            <div className="flex flex-col items-center gap-6">
              <div className="p-4 rounded-full bg-green-500/20">
                <Icon name="check" size="xl" variant="ice" className="text-green-500" />
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-neutral-text-primary mb-2">
                  {successInfo.title}
                </h2>
                <p className="text-base text-neutral-text-secondary">
                  {successInfo.message}
                </p>
              </div>

              {isVerifying && paymentType === 'subscription' && (
                <div className="flex items-center gap-3 text-sm text-neutral-text-secondary">
                  <LoadingSpinner size="sm" />
                  <span>Verifying subscription...</span>
                </div>
              )}

              {paymentType === 'subscription' && subscription.active && (
                <GlassCard variant="ice" className="p-4 w-full">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon name="billing" size="md" variant="ice" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-neutral-text-primary">
                        Subscription Active
                      </p>
                      <p className="text-xs text-neutral-text-secondary capitalize">
                        {subscription.planType} Plan
                      </p>
                    </div>
                  </div>
                </GlassCard>
              )}

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <GlassButton
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/shopify/app/billing')}
                  className="w-full sm:w-auto"
                >
                  View Billing
                </GlassButton>
                <GlassButton
                  variant="ghost"
                  size="lg"
                  onClick={() => navigate('/shopify/app/dashboard')}
                  className="w-full sm:w-auto"
                >
                  Go to Dashboard
                </GlassButton>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </>
  );
}

