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
  const [verificationError, setVerificationError] = useState(null);
  const [balanceUpdated, setBalanceUpdated] = useState(false);
  const sessionId = searchParams.get('session_id');
  const paymentType = searchParams.get('type') || 'unknown';
  const verifySession = useVerifySubscriptionSession();
  const { data: subscriptionData, refetch: refetchSubscription } = useSubscriptionStatus();
  const { data: balanceData, refetch: refetchBalance } = useBillingBalance();

  useEffect(() => {
    // If session_id is present and it's a subscription, verify it
    if (sessionId && !isVerifying && paymentType === 'subscription') {
      setIsVerifying(true);
      setVerificationError(null);
      verifySession.mutate(
        { sessionId },
        {
          onSuccess: () => {
            refetchSubscription();
            refetchBalance();
            setBalanceUpdated(true);
            toast.success('Payment verified successfully!');
          },
          onError: (error) => {
            // Show a warning but don't block the user - webhook will handle verification
            const errorMessage = error?.response?.data?.message || error?.message || 'Verification pending';
            setVerificationError(errorMessage);
            console.warn('Subscription verification failed:', error);
            // Still refetch to get latest status (webhook may have processed it)
            setTimeout(() => {
              refetchSubscription();
              refetchBalance();
            }, 2000);
          },
          onSettled: () => {
            setIsVerifying(false);
          },
        },
      );
    } else if (sessionId && paymentType !== 'subscription') {
      // For top-up and pack purchases, refresh balance after a delay
      // Webhook will process the payment
      setIsVerifying(true);
      setTimeout(() => {
        refetchBalance().then(() => {
          setBalanceUpdated(true);
          setIsVerifying(false);
          toast.success('Payment processed! Credits have been added to your account.');
        }).catch(() => {
          setIsVerifying(false);
          // Still show success - webhook will process it
          toast.success('Payment processed! Credits will be added shortly.');
        });
      }, 2000);
    } else if (!sessionId) {
      // No session ID - might be a direct visit or webhook already processed
      // Just show success message
      setBalanceUpdated(true);
    }
  }, [sessionId, paymentType, isVerifying, verifySession, refetchSubscription, refetchBalance, toast]);

  const subscription = subscriptionData?.data || subscriptionData || {};
  const balance = balanceData?.data?.balance || balanceData?.balance || 0;

  // Determine success message based on payment type
  const getSuccessMessage = () => {
    switch (paymentType) {
      case 'subscription':
        return {
          title: 'Subscription Activated!',
          message: 'Your subscription has been activated successfully. Free credits have been allocated to your account.',
          icon: 'billing',
        };
      case 'credit_topup':
        return {
          title: 'Credits Added!',
          message: 'Your credit top-up has been processed successfully. Credits have been added to your account.',
          icon: 'billing',
        };
      case 'credit_pack':
        return {
          title: 'Purchase Complete!',
          message: 'Your credit pack purchase has been completed successfully. Credits have been added to your account.',
          icon: 'billing',
        };
      default:
        return {
          title: 'Payment Successful!',
          message: 'Your payment has been processed successfully. Credits have been added to your account.',
          icon: 'check',
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
                <p className="text-base text-primary-light">
                  {successInfo.message}
                </p>
              </div>

              {isVerifying && (
                <div className="flex items-center gap-3 text-sm text-primary-light">
                  <LoadingSpinner size="sm" />
                  <span>
                    {paymentType === 'subscription' 
                      ? 'Verifying subscription...' 
                      : 'Processing payment...'}
                  </span>
                </div>
              )}

              {verificationError && (
                <GlassCard variant="ice" className="p-4 w-full border-yellow-500/30">
                  <div className="flex items-start gap-3">
                    <Icon name="error" size="sm" variant="ice" className="text-yellow-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-neutral-text-primary mb-1">
                        Verification Pending
                      </p>
                      <p className="text-xs text-primary-light">
                        Your payment is being processed. If your subscription doesn't activate within a few minutes, please contact support.
                      </p>
                    </div>
                  </div>
                </GlassCard>
              )}

              {paymentType === 'subscription' && subscription.active && !verificationError && (
                <GlassCard variant="ice" className="p-4 sm:p-6 w-full">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon name="billing" size="md" variant="ice" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-neutral-text-primary">
                        Subscription Active
                      </p>
                      <p className="text-xs text-primary-light capitalize">
                        {subscription.planType} Plan
                      </p>
                    </div>
                  </div>
                </GlassCard>
              )}

              {(paymentType === 'credit_topup' || paymentType === 'credit_pack') && balanceUpdated && (
                <GlassCard variant="ice" className="p-4 sm:p-6 w-full">
                  <div className="flex items-center gap-3">
                    <Icon name="billing" size="md" variant="ice" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-neutral-text-primary">
                        Current Balance
                      </p>
                      <p className="text-lg font-bold text-neutral-text-primary">
                        {balance.toLocaleString()} Credits
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

