import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../../components/ui/GlassCard';
import PageHeader from '../../components/ui/PageHeader';
import StatusBadge from '../../components/ui/StatusBadge';
import GlassBadge from '../../components/ui/GlassBadge';
import Icon from '../../components/ui/Icon';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import EmptyState from '../../components/ui/EmptyState';
import { useAutomations, useAutomationStats, useUpdateAutomation, useDeleteAutomation } from '../../services/queries';
import { useToastContext } from '../../contexts/ToastContext';
import { normalizeArrayResponse } from '../../utils/apiHelpers';
import SEO from '../../components/SEO';
import { clsx } from 'clsx';

export default function Automations() {
  const navigate = useNavigate();
  const toast = useToastContext();
  const [statusFilter, setStatusFilter] = useState('');
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: automationsData, isLoading, error } = useAutomations();
  const { data: stats, error: statsError } = useAutomationStats();
  const updateAutomation = useUpdateAutomation();
  const deleteAutomation = useDeleteAutomation();

  const automations = normalizeArrayResponse(automationsData, 'automations');

  const filteredAutomations = statusFilter
    ? automations.filter((a) => a.status === statusFilter)
    : automations;

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'active' ? 'paused' : 'active';
      await updateAutomation.mutateAsync({ id, status: newStatus });
      toast.success(`Automation ${newStatus === 'active' ? 'activated' : 'paused'}`);
    } catch (error) {
      toast.error(error?.message || 'Failed to update automation');
    }
  };

  const handleDeleteClick = (id, name) => {
    setDeleteTarget({ id, name });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteAutomation.mutateAsync(deleteTarget.id);
      toast.success('Automation deleted successfully');
      setDeleteTarget(null);
    } catch (error) {
      toast.error(error?.message || 'Failed to delete automation');
      setDeleteTarget(null);
    }
  };

  // Helper function to check if automation is coming soon
  const isComingSoon = (automation) => {
    const comingSoonTriggers = ['cart_abandoned', 'customer_inactive', 'abandoned_cart'];
    const trigger = automation.trigger || automation.triggerEvent;
    return comingSoonTriggers.includes(trigger);
  };

  // Only show full loading state on initial load (no cached data)
  // If we have cached data, show it immediately even if fetching
  const isInitialLoad = isLoading && !automationsData;

  if (isInitialLoad) {
    return <LoadingState size="lg" message="Loading automations..." />;
  }

  const hasError = error || statsError;

  return (
    <>
      <SEO
        title="Automations - Astronote SMS Marketing"
        description="Manage your SMS marketing automations"
        path="/shopify/app/automations"
      />
      <div className="min-h-screen pt-4 sm:pt-6 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 bg-neutral-bg-base w-full max-w-full">
        <div className="max-w-[1400px] mx-auto w-full">
          {/* Header */}
          <PageHeader
            title="Automations"
            subtitle="Set up automated SMS workflows for your store"
            actionLabel="Create Automation"
            actionIcon="automation"
            actionTo="/shopify/app/automations/new"
          />

          {/* Error State */}
          {hasError && (
            <ErrorState
              title="Error Loading Automations"
              message={error?.message || statsError?.message || 'Failed to load automations. Please try refreshing the page.'}
              onAction={() => window.location.reload()}
              actionLabel="Refresh Page"
            />
          )}

          {/* Stats */}
          {!hasError && stats && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 mb-6 sm:mb-8">
            <GlassCard 
              variant="ice" 
              className="p-5 sm:p-6 hover:shadow-glass-light-lg transition-all duration-300 hover:scale-[1.02] group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-ice-soft/90 to-ice-primary/20 group-hover:from-ice-primary/30 group-hover:to-ice-soft transition-all duration-300">
                  <Icon name="automation" size="md" variant="ice" />
                </div>
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-neutral-text-primary mb-2 leading-tight">
                {stats.total || automations.length}
              </p>
              <p className="text-xs sm:text-sm font-semibold text-primary-light uppercase tracking-wider">Total Automations</p>
            </GlassCard>
            <GlassCard 
              className="p-5 sm:p-6 hover:shadow-glass-light-lg transition-all duration-300 hover:scale-[1.02] group"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-ice-soft/90 to-ice-primary/20 group-hover:from-ice-primary/30 group-hover:to-ice-soft transition-all duration-300">
                  <Icon name="send" size="md" variant="ice" />
                </div>
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-neutral-text-primary mb-2 leading-tight">
                {stats.messagesSent || 0}
              </p>
              <p className="text-xs sm:text-sm font-semibold text-primary-light uppercase tracking-wider">Messages Sent</p>
            </GlassCard>
            <GlassCard 
              className="p-5 sm:p-6 hover:shadow-glass-light-lg transition-all duration-300 hover:scale-[1.02] group sm:col-span-2 lg:col-span-1"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-gradient-to-br from-ice-soft/90 to-ice-primary/20 group-hover:from-ice-primary/30 group-hover:to-ice-soft transition-all duration-300">
                  <Icon name="check" size="md" variant="ice" />
                </div>
              </div>
              <p className="text-3xl sm:text-4xl font-bold text-neutral-text-primary mb-2 leading-tight">
                {stats.successRate ? `${stats.successRate.toFixed(1)}%` : '0%'}
              </p>
              <p className="text-xs sm:text-sm font-semibold text-primary-light uppercase tracking-wider">Success Rate</p>
              </GlassCard>
            </div>
          )}

          {/* Filter */}
          {!hasError && (
            <div className="mb-6 sm:mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <h3 className="text-sm font-semibold text-primary-light uppercase tracking-wider">Filter by Status</h3>
              <div className="flex flex-wrap gap-2">
                {[
                  { value: '', label: 'All Statuses', icon: 'filter' },
                  { value: 'active', label: 'Active', icon: 'check' },
                  { value: 'paused', label: 'Paused', icon: 'pause' },
                  { value: 'draft', label: 'Draft', icon: 'edit' },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setStatusFilter(option.value)}
                    className={clsx(
                      'px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 min-h-[44px]',
                      statusFilter === option.value
                        ? 'bg-ice-primary text-white shadow-glass-light-md hover:shadow-glass-light-lg'
                        : 'bg-neutral-surface-secondary text-neutral-text-primary border border-neutral-border hover:border-ice-primary/50 hover:text-ice-primary'
                    )}
                  >
                    <Icon name={option.icon} size="sm" />
                    <span>{option.label}</span>
                  </button>
                ))}
                </div>
              </div>
            </div>
          )}

          {/* Automations Grid */}
          {!hasError && filteredAutomations.length === 0 ? (
          <EmptyState
            icon="automation"
            title="No automations found"
            message={statusFilter
              ? 'Try adjusting your filters'
              : 'Create your first automation to get started'}
            actionLabel={!statusFilter ? "Create Automation" : undefined}
            actionIcon={!statusFilter ? "automation" : undefined}
            actionTo={!statusFilter ? "/shopify/app/automations/new" : undefined}
          />
        ) : !hasError && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
            {filteredAutomations.map((automation) => {
              const comingSoon = isComingSoon(automation);
              return (
              <GlassCard 
                key={automation.id} 
                className="p-5 sm:p-6 hover:shadow-glass-light-lg transition-all duration-300 hover:scale-[1.02] relative group"
              >
                {comingSoon && (
                  <div className="absolute top-4 right-4 z-10">
                    <GlassBadge variant="default" className="text-xs font-semibold">
                      Coming Soon
                    </GlassBadge>
                  </div>
                )}
                
                {/* Header */}
                <div className="flex items-start justify-between mb-4 pr-20">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold mb-2.5 text-neutral-text-primary line-clamp-2 group-hover:text-ice-primary transition-colors">
                      {automation.name}
                    </h3>
                    <StatusBadge status={automation.status} />
                  </div>
                </div>
                
                {/* Content */}
                <div className="space-y-3 mb-5">
                  {automation.trigger && (
                    <div className="flex items-start gap-2">
                      <Icon name="automation" size="sm" className="text-primary-light mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-primary-light mb-1 uppercase tracking-wider">Trigger</p>
                        <p className="text-sm text-neutral-text-primary font-medium break-words">{automation.trigger}</p>
                      </div>
                    </div>
                  )}
                  {automation.message && (
                    <div className="flex items-start gap-2">
                      <Icon name="sms" size="sm" className="text-primary-light mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-primary-light mb-1 uppercase tracking-wider">Message</p>
                        <p className="text-sm text-neutral-text-primary line-clamp-3 break-words">
                          {automation.message}
                        </p>
                      </div>
                    </div>
                  )}
                  {automation.messagesSent !== undefined && (
                    <div className="flex items-center gap-2 pt-2 border-t border-neutral-border/40">
                      <Icon name="send" size="sm" className="text-primary-light flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-primary-light mb-1 uppercase tracking-wider">Messages Sent</p>
                        <p className="text-base font-bold text-neutral-text-primary">{automation.messagesSent || 0}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4 border-t border-neutral-border/60">
                  <button
                    onClick={() => !comingSoon && navigate(`/shopify/app/automations/${automation.id}`)}
                    disabled={comingSoon}
                    className={clsx(
                      'flex-1 px-4 py-2.5 text-sm rounded-lg border transition-all duration-200 font-medium focus-ring min-h-[44px] flex items-center justify-center gap-2',
                      comingSoon 
                        ? 'opacity-50 cursor-not-allowed bg-neutral-surface-secondary border-neutral-border text-primary-light' 
                        : 'bg-neutral-surface-secondary border-neutral-border text-neutral-text-primary hover:border-ice-primary hover:text-ice-primary hover:bg-ice-soft/20 hover:shadow-glass-light-md'
                    )}
                    aria-label="View automation"
                    aria-disabled={comingSoon}
                  >
                    <Icon name="eye" size="sm" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => !comingSoon && handleToggleStatus(automation.id, automation.status)}
                    disabled={comingSoon}
                    className={clsx(
                      'flex-1 px-4 py-2.5 text-sm rounded-lg border transition-all duration-200 font-medium focus-ring min-h-[44px] flex items-center justify-center gap-2',
                      comingSoon 
                        ? 'opacity-50 cursor-not-allowed bg-neutral-surface-secondary border-neutral-border text-primary-light' 
                        : 'bg-neutral-surface-secondary border-neutral-border text-neutral-text-primary hover:border-ice-primary hover:text-ice-primary hover:bg-ice-soft/20 hover:shadow-glass-light-md'
                    )}
                    aria-label={automation.status === 'active' ? 'Pause automation' : 'Activate automation'}
                    aria-disabled={comingSoon}
                  >
                    <Icon name={automation.status === 'active' ? 'pause' : 'play'} size="sm" />
                    <span>{automation.status === 'active' ? 'Pause' : 'Activate'}</span>
                  </button>
                  <button
                    onClick={() => !comingSoon && handleDeleteClick(automation.id, automation.name)}
                    disabled={comingSoon}
                    className={clsx(
                      'px-4 py-2.5 text-sm rounded-lg border transition-all duration-200 focus-ring min-w-[44px] min-h-[44px] flex items-center justify-center',
                      comingSoon 
                        ? 'opacity-50 cursor-not-allowed border-neutral-border text-primary-light bg-neutral-surface-secondary' 
                        : 'border-red-200 bg-red-50/50 text-red-500 hover:border-red-500 hover:bg-red-100 hover:shadow-glass-light-md'
                    )}
                    aria-label="Delete automation"
                    aria-disabled={comingSoon}
                  >
                    <Icon name="delete" size="sm" />
                  </button>
                </div>
              </GlassCard>
              );
              })}
            </div>
          )}
        </div>
      </div>
      
      <ConfirmDialog
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Automation"
        message={deleteTarget ? `Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.` : ''}
        confirmLabel="Delete"
        cancelLabel="Cancel"
        destructive={true}
      />
    </>
  );
}

