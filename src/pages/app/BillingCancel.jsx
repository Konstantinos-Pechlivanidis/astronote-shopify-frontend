import { useNavigate } from 'react-router-dom';
import GlassCard from '../../components/ui/GlassCard';
import GlassButton from '../../components/ui/GlassButton';
import PageHeader from '../../components/ui/PageHeader';
import Icon from '../../components/ui/Icon';
import SEO from '../../components/SEO';

export default function BillingCancel() {
  const navigate = useNavigate();

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

          <GlassCard className="p-8 sm:p-10 text-center">
            <div className="flex flex-col items-center gap-6">
              <div className="p-4 rounded-full bg-yellow-500/20">
                <Icon name="error" size="xl" variant="ice" className="text-yellow-500" />
              </div>

              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-neutral-text-primary mb-2">
                  Payment Cancelled
                </h2>
                <p className="text-base text-neutral-text-secondary">
                  Your payment was cancelled and no charges were made. You can try again anytime.
                </p>
              </div>

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

