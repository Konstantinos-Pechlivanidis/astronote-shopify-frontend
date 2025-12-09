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
        <div className="max-w-[1600px] mx-auto w-full">
          {/* Header */}
          <div className="mb-6 sm:mb-8 lg:mb-10">
            <PageHeader
              title="Automations"
              subtitle="Set up automated SMS workflows for your store"
              actionLabel="Create Automation"
              actionIcon="automation"
              actionTo="/shopify/app/automations/new"
            />
          </div>

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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-6 sm:mb-8 lg:mb-10">
              <GlassCard 
                variant="ice" 
                className="p-5 sm:p-6 lg:p-7 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group border border-neutral-border/40"
              >
                <div className="flex items-start justify-between mb-4 sm:mb-5">
                  <div className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-br from-ice-soft/90 to-ice-primary/20 group-hover:from-ice-primary/30 group-hover:to-ice-soft transition-all duration-300 shadow-lg">
                    <Icon name="automation" size="lg" variant="ice" />
                  </div>
                </div>
                <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-ice-primary mb-2 leading-tight">
                  {stats.total || automations.length}
                </p>
                <p className="text-xs sm:text-sm font-semibold text-primary uppercase tracking-wider">Total Automations</p>
              </GlassCard>
              <GlassCard 
                className="p-5 sm:p-6 lg:p-7 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group border border-neutral-border/40"
              >
                <div className="flex items-start justify-between mb-4 sm:mb-5">
                  <div className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-br from-ice-soft/90 to-ice-primary/20 group-hover:from-ice-primary/30 group-hover:to-ice-soft transition-all duration-300 shadow-lg">
                    <Icon name="send" size="lg" variant="ice" />
                  </div>
                </div>
                <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-text-primary mb-2 leading-tight">
                  {stats.messagesSent || 0}
                </p>
                <p className="text-xs sm:text-sm font-semibold text-primary uppercase tracking-wider">Messages Sent</p>
              </GlassCard>
              <GlassCard 
                className="p-5 sm:p-6 lg:p-7 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group sm:col-span-2 lg:col-span-1 border border-neutral-border/40"
              >
                <div className="flex items-start justify-between mb-4 sm:mb-5">
                  <div className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-br from-ice-soft/90 to-ice-primary/20 group-hover:from-ice-primary/30 group-hover:to-ice-soft transition-all duration-300 shadow-lg">
                    <Icon name="check" size="lg" variant="ice" />
                  </div>
                </div>
                <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-text-primary mb-2 leading-tight">
                  {stats.successRate ? `${stats.successRate.toFixed(1)}%` : '0%'}
                </p>
                <p className="text-xs sm:text-sm font-semibold text-primary uppercase tracking-wider">Success Rate</p>
              </GlassCard>
            </div>
          )}

          {/* Filter */}
          {!hasError && (
            <GlassCard className="p-5 sm:p-6 lg:p-8 mb-6 sm:mb-8 lg:mb-10 shadow-xl border border-neutral-border/40">
              <div className="space-y-5 sm:space-y-6">
                <div className="flex items-center gap-3 mb-4 sm:mb-5">
                  <div className="p-2.5 rounded-xl bg-gradient-to-br from-ice-soft/90 to-ice-primary/20">
                    <Icon name="filter" size="md" variant="ice" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-neutral-text-primary">Filter by Status</h3>
                </div>
                <div className="flex flex-wrap gap-3 sm:gap-4">
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
                      'px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center gap-2 min-h-[48px] shadow-md hover:shadow-lg',
                      statusFilter === option.value
                        ? 'bg-ice-primary text-white shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]'
                        : 'bg-neutral-surface-secondary text-neutral-text-primary border border-neutral-border/60 hover:border-ice-primary/50 hover:text-ice-primary hover:bg-neutral-surface-primary'
                    )}
                  >
                    <Icon name={option.icon} size="sm" />
                    <span>{option.label}</span>
                  </button>
                ))}
                </div>
              </div>
            </GlassCard>
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
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 sm:gap-6 lg:gap-8">
            {filteredAutomations.map((automation) => {
              const comingSoon = isComingSoon(automation);
              return (
              <GlassCard 
                key={automation.id} 
                className="p-6 sm:p-7 lg:p-8 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] relative group border border-neutral-border/40"
              >
                {comingSoon && (
                  <div className="absolute top-4 right-4 z-10">
                    <GlassBadge variant="default" className="text-xs font-semibold">
                      Coming Soon
                    </GlassBadge>
                  </div>
                )}
                
                {/* Header */}
                <div className="flex items-start justify-between mb-5 sm:mb-6 pr-20">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl sm:text-2xl font-bold mb-3 text-neutral-text-primary line-clamp-2 group-hover:text-ice-primary transition-colors">
                      {automation.name}
                    </h3>
                    <StatusBadge status={automation.status} />
                  </div>
                </div>
                
                {/* Content */}
                <div className="space-y-4 mb-6">
                  {automation.trigger && (
                    <div className="flex items-start gap-2">
                      <Icon name="automation" size="sm" className="text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-primary mb-1 uppercase tracking-wider">Trigger</p>
                        <p className="text-sm text-neutral-text-primary font-medium break-words">{automation.trigger}</p>
                      </div>
                    </div>
                  )}
                  {automation.message && (
                    <div className="flex items-start gap-2">
                      <Icon name="sms" size="sm" className="text-primary mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold text-primary mb-1 uppercase tracking-wider">Message</p>
                        <p className="text-sm text-neutral-text-primary line-clamp-3 break-words">
                          {automation.message}
                        </p>
                      </div>
                    </div>
                  )}
                  {automation.messagesSent !== undefined && (
                    <div className="flex items-center gap-2 pt-2 border-t border-neutral-border/40">
                      <Icon name="send" size="sm" className="text-primary flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-xs font-semibold text-primary mb-1 uppercase tracking-wider">Messages Sent</p>
                        <p className="text-base font-bold text-neutral-text-primary">{automation.messagesSent || 0}</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-5 border-t border-neutral-border/40">
                  <button
                    onClick={() => !comingSoon && navigate(`/shopify/app/automations/${automation.id}`)}
                    disabled={comingSoon}
                    className={clsx(
                      'flex-1 px-4 py-3 text-sm rounded-xl border transition-all duration-200 font-semibold focus-ring min-h-[48px] flex items-center justify-center gap-2 shadow-md hover:shadow-lg',
                      comingSoon 
                        ? 'opacity-50 cursor-not-allowed bg-neutral-surface-secondary border-neutral-border text-primary' 
                        : 'bg-neutral-surface-secondary border-neutral-border/60 text-neutral-text-primary hover:border-ice-primary hover:text-ice-primary hover:bg-ice-soft/20 hover:scale-[1.02] active:scale-[0.98]'
                    )}
                    aria-label="View automation"
                    aria-disabled={comingSoon}
                  >
                    <Icon name="view" size="sm" variant="ice" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => !comingSoon && handleToggleStatus(automation.id, automation.status)}
                    disabled={comingSoon}
                    className={clsx(
                      'flex-1 px-4 py-3 text-sm rounded-xl border transition-all duration-200 font-semibold focus-ring min-h-[48px] flex items-center justify-center gap-2 shadow-md hover:shadow-lg',
                      comingSoon 
                        ? 'opacity-50 cursor-not-allowed bg-neutral-surface-secondary border-neutral-border text-primary' 
                        : 'bg-neutral-surface-secondary border-neutral-border/60 text-neutral-text-primary hover:border-ice-primary hover:text-ice-primary hover:bg-ice-soft/20 hover:scale-[1.02] active:scale-[0.98]'
                    )}
                    aria-label={automation.status === 'active' ? 'Pause automation' : 'Activate automation'}
                    aria-disabled={comingSoon}
                  >
                    <Icon name={automation.status === 'active' ? 'pause' : 'play'} size="sm" variant="ice" />
                    <span>{automation.status === 'active' ? 'Pause' : 'Activate'}</span>
                  </button>
                  <button
                    onClick={() => !comingSoon && handleDeleteClick(automation.id, automation.name)}
                    disabled={comingSoon}
                    className={clsx(
                      'px-4 py-3 text-sm rounded-xl border transition-all duration-200 focus-ring min-w-[48px] min-h-[48px] flex items-center justify-center shadow-md hover:shadow-lg',
                      comingSoon 
                        ? 'opacity-50 cursor-not-allowed border-neutral-border text-primary bg-neutral-surface-secondary' 
                        : 'border-red-200 bg-red-50/50 text-red-500 hover:border-red-500 hover:bg-red-100 hover:scale-[1.02] active:scale-[0.98]'
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

