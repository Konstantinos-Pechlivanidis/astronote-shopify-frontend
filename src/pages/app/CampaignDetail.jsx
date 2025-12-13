import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import GlassCard from '../../components/ui/GlassCard';
import GlassButton from '../../components/ui/GlassButton';
import PageHeader from '../../components/ui/PageHeader';
import BackButton from '../../components/ui/BackButton';
import StatusBadge from '../../components/ui/StatusBadge';
import Icon from '../../components/ui/Icon';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import {
  useCampaign,
  useDeleteCampaign,
  useEnqueueCampaign,
  useCampaignMetrics,
  useCampaignStatus,
  useCampaignFailedRecipients,
} from '../../services/queries';
import { useToastContext } from '../../contexts/ToastContext';
import SEO from '../../components/SEO';
import { format } from 'date-fns';
import { CampaignStatus } from '../../types/prisma';

export default function CampaignDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToastContext();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const { data: campaign, isLoading, error } = useCampaign(id);
  const { data: metrics } = useCampaignMetrics(id);
  const { data: statusData } = useCampaignStatus(id, {
    // Enable auto-refetch for live updates
    refetchInterval: 30 * 1000, // Refetch every 30 seconds
    enabled: campaign?.status === CampaignStatus.sending || campaign?.status === CampaignStatus.scheduled, // Only refetch if campaign is active
  }); // Phase 2.2: New status endpoint with queued, processed, etc.
  const { data: failedRecipientsData } = useCampaignFailedRecipients(id, {
    enabled: campaign?.status === CampaignStatus.sent || campaign?.status === CampaignStatus.failed || campaign?.status === CampaignStatus.sending,
  });
  const deleteCampaign = useDeleteCampaign();
  const enqueueCampaign = useEnqueueCampaign();

  const handleDelete = async () => {
    try {
      await deleteCampaign.mutateAsync(id);
      toast.success('Campaign deleted successfully');
      navigate('/shopify/app/campaigns');
    } catch (error) {
      toast.error(error?.message || 'Failed to delete campaign');
    }
  };

  const handleSend = async () => {
    // Prevent multiple clicks
    if (enqueueCampaign.isPending) {
      return;
    }
    
    // Prevent sending if campaign is not in valid state
    if (campaign?.status !== CampaignStatus.draft && campaign?.status !== CampaignStatus.scheduled) {
      toast.error('Campaign cannot be sent in its current state');
      return;
    }

    try {
      await enqueueCampaign.mutateAsync(id);
      toast.success('Campaign queued for sending');
    } catch (error) {
      toast.error(error?.message || 'Failed to send campaign');
    }
  };

  // Only show full loading state on initial load (no cached data)
  // If we have cached data, show it immediately even if fetching
  const isInitialLoad = isLoading && !campaign;

  if (isInitialLoad) {
    return <LoadingState size="lg" />;
  }

  if (error || !campaign) {
    return (
      <div className="min-h-screen pt-4 sm:pt-6 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 bg-neutral-bg-base w-full max-w-full">
        <div className="max-w-[1400px] mx-auto w-full">
          <ErrorState
            title="Campaign Not Found"
            message={error?.message || 'The campaign you are looking for does not exist.'}
            actionLabel="Back to Campaigns"
            onAction={() => navigate('/shopify/app/campaigns')}
          />
        </div>
      </div>
    );
  }

  const canEdit =
    campaign.status === CampaignStatus.draft ||
    campaign.status === CampaignStatus.scheduled;
  const canDelete =
    campaign.status === CampaignStatus.draft ||
    campaign.status === CampaignStatus.cancelled;
  const canSend =
    campaign.status === CampaignStatus.draft ||
    campaign.status === CampaignStatus.scheduled;

  return (
    <>
      <SEO
        title={`${campaign.name} - Campaign Details`}
        description="View campaign details and metrics"
        path={`/shopify/app/campaigns/${id}`}
      />
      <div className="min-h-screen pt-4 sm:pt-6 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 bg-neutral-bg-base w-full max-w-full">
        <div className="max-w-[1400px] mx-auto w-full">
          {/* Header */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <BackButton to="/shopify/app/campaigns" label="Back" />
            </div>
            <PageHeader
              title={campaign.name}
              subtitle={
                <div className="flex items-center gap-3 mt-2">
                  <StatusBadge status={campaign.status} />
                  {campaign.createdAt && (
                    <span className="text-sm text-primary">
                      Created {format(new Date(campaign.createdAt), 'MMM d, yyyy')}
                    </span>
                  )}
                </div>
              }
              action={
                <div className="flex gap-2">
                  {canSend && (
                    <GlassButton 
                      variant="primary" 
                      size="md" 
                      onClick={handleSend}
                      disabled={enqueueCampaign.isPending || campaign?.status !== CampaignStatus.draft && campaign?.status !== CampaignStatus.scheduled}
                    >
                      <span className="flex items-center gap-2">
                        <Icon name="send" size="sm" variant="ice" />
                        {enqueueCampaign.isPending ? 'Sending...' : 'Send Now'}
                      </span>
                    </GlassButton>
                  )}
                  {canEdit && (
                    <GlassButton
                      variant="ghost"
                      size="md"
                      as={Link}
                      to={`/shopify/app/campaigns/${id}/edit`}
                    >
                      <span className="flex items-center gap-2">
                        <Icon name="edit" size="sm" variant="ice" />
                        Edit
                      </span>
                    </GlassButton>
                  )}
                  {canDelete && (
                    <GlassButton variant="ghost" size="md" onClick={() => setShowDeleteDialog(true)}>
                      <span className="flex items-center gap-2">
                        <Icon name="delete" size="sm" className="text-red-500" />
                        Delete
                      </span>
                    </GlassButton>
                  )}
                </div>
              }
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Campaign Details */}
              <GlassCard className="p-4 sm:p-6">
                <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-neutral-text-primary">Campaign Details</h2>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-primary mb-1">Message</label>
                    <p className="text-neutral-text-primary mt-1 whitespace-pre-wrap">{campaign.message}</p>
                  </div>
                  {campaign.audience && (
                    <div>
                      <label className="text-sm font-medium text-primary mb-1">Audience</label>
                      <p className="text-neutral-text-primary mt-1">{campaign.audience}</p>
                    </div>
                  )}
                  {campaign.scheduleAt && (
                    <div>
                      <label className="text-sm font-medium text-primary mb-1">Scheduled For</label>
                      <p className="text-neutral-text-primary mt-1">
                        {format(new Date(campaign.scheduleAt), 'PPp')}
                      </p>
                    </div>
                  )}
                </div>
              </GlassCard>

              {/* Metrics - Phase 2.2: Use status endpoint for real-time metrics */}
              {(statusData || metrics) && (
                <GlassCard className="p-4 sm:p-6">
                  <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-neutral-text-primary">Performance Metrics</h2>
                  {statusData?.metrics ? (
                    // Phase 2.2: Use new status endpoint format
                    <>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-4">
                        <div>
                          <p className="text-xs font-medium text-primary mb-1 uppercase tracking-wider">Queued</p>
                          <p className="text-2xl font-bold text-neutral-text-primary">
                            {statusData.metrics.queued || 0}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-primary mb-1 uppercase tracking-wider">Sent</p>
                          <p className="text-2xl font-bold text-ice-primary">
                            {statusData.metrics.success || statusData.campaign?.sent || 0}
                          </p>
                          {statusData.campaign?.total > 0 && (
                            <p className="text-xs text-neutral-text-secondary mt-1">
                              {Math.round(((statusData.metrics.success || 0) / statusData.campaign.total) * 100)}%
                            </p>
                          )}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-primary mb-1 uppercase tracking-wider">Processed</p>
                          <p className="text-2xl font-bold text-neutral-text-primary">
                            {statusData.metrics.processed || 0}
                          </p>
                          <p className="text-xs text-neutral-text-secondary mt-1">Sent + Failed</p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-primary mb-1 uppercase tracking-wider">Failed</p>
                          <p className="text-2xl font-bold text-red-500">
                            {statusData.metrics.failed || statusData.campaign?.failed || 0}
                          </p>
                          {statusData.campaign?.total > 0 && (
                            <p className="text-xs text-red-500 mt-1">
                              {Math.round(((statusData.metrics.failed || 0) / statusData.campaign.total) * 100)}%
                            </p>
                          )}
                        </div>
                      </div>
                      {metrics?.sentPercentage !== undefined && (
                        <div className="pt-4 border-t border-neutral-border/40">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-neutral-text-primary">Success Rate</span>
                            <span className="text-sm font-bold text-ice-primary">{metrics.sentPercentage}%</span>
                          </div>
                          <div className="w-full bg-neutral-bg-soft rounded-full h-2">
                            <div
                              className="bg-ice-primary h-2 rounded-full transition-all duration-300"
                              style={{ width: `${metrics.sentPercentage}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    // Fallback to old metrics format
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                      <div>
                        <p className="text-xs font-medium text-primary mb-1 uppercase tracking-wider">Sent</p>
                        <p className="text-2xl font-bold text-neutral-text-primary">
                          {metrics?.sent || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-primary mb-1 uppercase tracking-wider">Delivered</p>
                        <p className="text-2xl font-bold text-ice-primary">
                          {metrics?.delivered || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-primary mb-1 uppercase tracking-wider">Failed</p>
                        <p className="text-2xl font-bold text-red-500">
                          {metrics?.failed || 0}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-primary mb-1 uppercase tracking-wider">Delivery Rate</p>
                        <p className="text-2xl font-bold text-ice-primary">
                          {metrics?.deliveryRate ? `${metrics.deliveryRate.toFixed(1)}%` : '0%'}
                        </p>
                      </div>
                    </div>
                  )}
                </GlassCard>
              )}

              {/* Failed Recipients */}
              {failedRecipientsData?.recipients && failedRecipientsData.recipients.length > 0 && (
                <GlassCard className="p-4 sm:p-6">
                  <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-neutral-text-primary">
                    Failed Recipients ({failedRecipientsData.failedCount})
                  </h2>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {failedRecipientsData.recipients.map((recipient) => (
                      <div
                        key={recipient.id}
                        className="p-3 bg-neutral-bg-soft rounded-lg border border-red-500/20"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-medium text-neutral-text-primary">
                              {recipient.contact?.firstName && recipient.contact?.lastName
                                ? `${recipient.contact.firstName} ${recipient.contact.lastName}`
                                : recipient.contact?.firstName || 'Unknown'}
                            </p>
                            <p className="text-sm text-neutral-text-secondary mt-1">
                              {recipient.phoneE164}
                            </p>
                            {recipient.contact?.email && (
                              <p className="text-xs text-neutral-text-secondary mt-1">
                                {recipient.contact.email}
                              </p>
                            )}
                            {recipient.error && (
                              <p className="text-xs text-red-500 mt-2">
                                Error: {recipient.error}
                              </p>
                            )}
                          </div>
                          {recipient.failedAt && (
                            <span className="text-xs text-neutral-text-secondary">
                              {format(new Date(recipient.failedAt), 'MMM d, HH:mm')}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-4 sm:space-y-6">
              {/* Quick Info */}
              <GlassCard variant="ice" className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-neutral-text-primary">Quick Info</h3>
                <div className="space-y-2 sm:space-y-3">
                  <div>
                    <p className="text-xs font-medium text-primary mb-1 uppercase tracking-wider">Recipients</p>
                    <p className="text-lg font-semibold text-neutral-text-primary">
                      {campaign.recipientCount || campaign.totalRecipients || 0}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-primary mb-1 uppercase tracking-wider">Status</p>
                    <StatusBadge status={campaign.status} />
                  </div>
                  {campaign.createdAt && (
                    <div>
                      <p className="text-xs font-medium text-primary mb-1 uppercase tracking-wider">Created</p>
                      <p className="text-sm text-neutral-text-primary">
                        {format(new Date(campaign.createdAt), 'MMM d, yyyy')}
                      </p>
                    </div>
                  )}
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
      
      <ConfirmDialog
        isOpen={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={handleDelete}
        title="Delete Campaign"
        message={`Are you sure you want to delete "${campaign?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        destructive={true}
      />
    </>
  );
}

