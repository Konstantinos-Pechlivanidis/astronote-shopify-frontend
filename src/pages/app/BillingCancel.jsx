import { useNavigate, useSearchParams } from 'react-router-dom';
import GlassCard from '../../components/ui/GlassCard';
import GlassButton from '../../components/ui/GlassButton';
import PageHeader from '../../components/ui/PageHeader';
import Icon from '../../components/ui/Icon';
import SEO from '../../components/SEO';

export default function BillingCancel() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const paymentType = searchParams.get('type') || 'unknown';

  // Determine cancel message based on payment type
  const getCancelMessage = () => {
    switch (paymentType) {
      case 'subscription':
        return {
          title: 'Subscription Cancelled',
          message: 'Your subscription setup was cancelled and no charges were made. You can subscribe anytime from the billing page.',
          helpText: 'To activate your subscription and start receiving free credits, please complete the payment process.',
        };
      case 'credit_topup':
        return {
          title: 'Top-up Cancelled',
          message: 'Your credit top-up was cancelled and no charges were made. You can try again anytime.',
          helpText: 'Your current credits remain unchanged. You can purchase more credits when needed.',
        };
      case 'credit_pack':
        return {
          title: 'Purchase Cancelled',
          message: 'Your credit pack purchase was cancelled and no charges were made. You can try again anytime.',
          helpText: 'Your current credits remain unchanged. You can purchase credit packs when needed.',
        };
      default:
        return {
          title: 'Payment Cancelled',
          message: 'Your payment was cancelled and no charges were made. You can try again anytime.',
          helpText: 'No changes were made to your account. You can complete your purchase when ready.',
        };
    }
  };

  const cancelInfo = getCancelMessage();

  return (
    <>
      <SEO
        title="Payment Cancelled - Astronote SMS Marketing"
        description="Your payment was cancelled"
        path="/shopify/app/billing/cancel"
      />
      <div className="min-h-screen pt-4 sm:pt-6 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 bg-neutral-bg-base w-full max-w-full">
        <div className="max-w-[800px] mx-auto w-full">
          <PageHeader
            title="Payment Cancelled"
            subtitle="Your payment was not processed"
          />

          <GlassCard className="p-6 sm:p-8 lg:p-10 text-center">
            <div className="flex flex-col items-center gap-6">
              <div className="p-4 rounded-full bg-yellow-500/20">
                <Icon name="error" size="xl" variant="ice" className="text-yellow-500" />
              </div>

              <div className="w-full">
                <h2 className="text-2xl sm:text-3xl font-bold text-neutral-text-primary mb-3">
                  {cancelInfo.title}
                </h2>
                <p className="text-base text-primary-light mb-4">
                  {cancelInfo.message}
                </p>
                {cancelInfo.helpText && (
                  <p className="text-sm text-primary-light opacity-80">
                    {cancelInfo.helpText}
                  </p>
                )}
              </div>

              <GlassCard variant="ice" className="p-4 sm:p-5 w-full text-left">
                <div className="flex items-start gap-3">
                  <Icon name="info" size="sm" variant="ice" className="text-ice-accent mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-neutral-text-primary mb-1">
                      Need Help?
                    </p>
                    <p className="text-xs text-primary-light">
                      If you experienced any issues during checkout or have questions about our pricing, please contact our support team.
                    </p>
                  </div>
                </div>
              </GlassCard>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <GlassButton
                  variant="primary"
                  size="lg"
                  onClick={() => navigate('/shopify/app/billing')}
                  className="w-full sm:w-auto"
                >
                  Back to Billing
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

