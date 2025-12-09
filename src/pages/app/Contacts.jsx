import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import GlassSelectCustom from '../../components/ui/GlassSelectCustom';
import GlassInput from '../../components/ui/GlassInput';
import GlassPagination from '../../components/ui/GlassPagination';
import StatusBadge from '../../components/ui/StatusBadge';
import ImportContactsModal from '../../components/contacts/ImportContactsModal';
import ConfirmDialog from '../../components/ui/ConfirmDialog';
import Icon from '../../components/ui/Icon';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import { useContacts, useContactStats, useDeleteContact } from '../../services/queries';
import { useToastContext } from '../../contexts/ToastContext';
import SEO from '../../components/SEO';

export default function Contacts() {
  const navigate = useNavigate();
  const toast = useToastContext();
  const [page, setPage] = useState(1);
  const [consentFilter, setConsentFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const pageSize = 20;

  const { data, isLoading, error } = useContacts({
    page,
    pageSize,
    smsConsent: consentFilter || undefined,
    search: searchQuery || undefined,
  });

  const { data: stats } = useContactStats();
  const deleteContact = useDeleteContact();

  const contacts = data?.contacts || data?.items || [];
  const pagination = useMemo(() => {
    const pag = data?.pagination || {};
    // Ensure pagination has all required fields
    return {
      page: pag.page || page,
      pageSize: pag.pageSize || pageSize,
      total: pag.total || 0,
      totalPages: pag.totalPages || Math.ceil((pag.total || 0) / (pag.pageSize || pageSize)) || 1,
      hasNextPage: pag.hasNextPage !== undefined ? pag.hasNextPage : (pag.page || page) < (pag.totalPages || Math.ceil((pag.total || 0) / (pag.pageSize || pageSize)) || 1),
      hasPrevPage: pag.hasPrevPage !== undefined ? pag.hasPrevPage : (pag.page || page) > 1,
    };
  }, [data?.pagination, page, pageSize]);

  const handleDeleteClick = (id, name) => {
    setDeleteTarget({ id, name });
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;

    try {
      await deleteContact.mutateAsync(deleteTarget.id);
      toast.success('Contact deleted successfully');
      setDeleteTarget(null);
    } catch (error) {
      toast.error(error?.message || 'Failed to delete contact');
      setDeleteTarget(null);
    }
  };

  const statsCards = [
    {
      label: 'Total',
      value: stats?.total || pagination.total || 0,
      icon: 'segment',
      variant: 'default',
    },
    {
      label: 'Opted In',
      value: stats?.optedIn || contacts.filter((c) => (c.smsConsent || c.consentStatus) === 'opted_in').length,
      icon: 'check',
      variant: 'ice',
    },
    {
      label: 'Opted Out',
      value: stats?.optedOut || contacts.filter((c) => (c.smsConsent || c.consentStatus) === 'opted_out').length,
      icon: 'error',
      variant: 'default',
    },
  ];

  // Only show full loading state on initial load (no cached data)
  // If we have cached data, show it immediately even if fetching
  const isInitialLoad = isLoading && !data;

  if (isInitialLoad) {
    return <LoadingState size="lg" message="Loading contacts..." />;
  }

  return (
    <>
      <SEO
        title="Contacts - Astronote SMS Marketing"
        description="Manage your SMS marketing contacts"
        path="/shopify/app/contacts"
      />
      <div className="min-h-screen pt-4 sm:pt-6 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 bg-neutral-bg-base w-full max-w-full">
        <div className="max-w-[1600px] mx-auto w-full">
          {/* Header */}
          <div className="mb-6 sm:mb-8 lg:mb-10">
            <PageHeader
              title="Contacts"
              subtitle="Manage your SMS marketing contact list"
            >
            <div className="flex flex-col sm:flex-row gap-3 mt-4">
              <GlassButton
                variant="ghost"
                size="lg"
                onClick={() => setIsImportModalOpen(true)}
                className="w-full sm:w-auto"
              >
                <span className="flex items-center gap-2">
                  <Icon name="import" size="sm" variant="ice" />
                  Import Contacts
                </span>
              </GlassButton>
              <GlassButton
                variant="primary"
                size="lg"
                as={Link}
                to="/shopify/app/contacts/new"
                className="group w-full sm:w-auto"
              >
                <span className="flex items-center gap-2">
                  <Icon name="segment" size="sm" variant="ice" />
                  Add Contact
                  <Icon name="arrowRight" size="sm" className="group-hover:translate-x-1 transition-transform" />
                </span>
              </GlassButton>
            </div>
            </PageHeader>
          </div>

          {/* Error State */}
          {error && (
            <ErrorState
              title="Error Loading Contacts"
              message={error.message || 'Failed to load contacts. Please try refreshing the page.'}
              onAction={() => window.location.reload()}
              actionLabel="Refresh Page"
            />
          )}

          {/* Stats Cards */}
          {!error && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 lg:gap-6 mb-6 sm:mb-8 lg:mb-10">
                {statsCards.map((stat) => (
                  <GlassCard key={stat.label} variant={stat.variant} className="p-5 sm:p-6 lg:p-7 hover:shadow-xl transition-all duration-300 group border border-neutral-border/40">
                    <div className="flex items-center justify-between mb-4 sm:mb-5">
                      <div className="p-3 sm:p-3.5 rounded-2xl bg-gradient-to-br from-ice-soft/90 to-ice-primary/20 group-hover:from-ice-soft group-hover:to-ice-primary/30 transition-all duration-300 shadow-lg">
                        <Icon name={stat.icon} size="lg" variant="ice" />
                      </div>
                    </div>
                    <p className="text-3xl sm:text-4xl lg:text-5xl font-bold text-neutral-text-primary mb-2">
                      {stat.value.toLocaleString()}
                    </p>
                    <p className="text-xs sm:text-sm font-semibold text-primary uppercase tracking-wider">{stat.label}</p>
                  </GlassCard>
                ))}
              </div>

              {/* Filters and Search */}
              <GlassCard className="p-5 sm:p-6 lg:p-8 mb-6 sm:mb-8 lg:mb-10 shadow-xl border border-neutral-border/40">
                <div className="space-y-5 sm:space-y-6">
                  <div className="flex items-center gap-3 mb-4 sm:mb-5">
                    <div className="p-2.5 rounded-xl bg-gradient-to-br from-ice-soft/90 to-ice-primary/20">
                      <Icon name="filter" size="md" variant="ice" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-neutral-text-primary">Filters & Search</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
                  <GlassInput
                    label="Search Contacts"
                    type="text"
                    placeholder="Search by name, phone, or email..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setPage(1);
                    }}
                  />
                  <GlassSelectCustom
                    label="Filter by Consent Status"
                    value={consentFilter}
                    onChange={(e) => {
                      setConsentFilter(e.target.value);
                      setPage(1);
                    }}
                    options={[
                      { value: '', label: 'All Statuses' },
                      { value: 'opted_in', label: 'Opted In' },
                      { value: 'opted_out', label: 'Opted Out' },
                      { value: 'unknown', label: 'Unknown' },
                    ]}
                  />
                  </div>
                </div>
              </GlassCard>

              {/* Contacts Table */}
              {contacts.length === 0 ? (
              <EmptyState
                icon="segment"
                title="No contacts found"
                message={searchQuery || consentFilter
                  ? 'Try adjusting your filters'
                  : 'Import contacts or add your first contact to get started'}
                action={!searchQuery && !consentFilter ? (
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <GlassButton variant="ghost" size="lg" onClick={() => setIsImportModalOpen(true)}>
                      <span className="flex items-center gap-2">
                        <Icon name="import" size="sm" variant="ice" />
                        Import Contacts
                      </span>
                    </GlassButton>
                    <GlassButton variant="primary" size="lg" as={Link} to="/shopify/app/contacts/new" className="group">
                      <span className="flex items-center gap-2">
                        <Icon name="segment" size="sm" variant="ice" />
                        Add Contact
                        <Icon name="arrowRight" size="sm" className="group-hover:translate-x-1 transition-transform" />
                      </span>
                    </GlassButton>
                  </div>
                ) : undefined}
              />
            ) : (
              <>
                <GlassCard className="p-0 overflow-hidden shadow-xl border border-neutral-border/40">
                  <div className="p-4 sm:p-6 border-b border-neutral-border/40 bg-neutral-surface-secondary/30">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-neutral-text-primary">Contacts List</h3>
                        <p className="text-sm text-primary mt-1">
                          {pagination.total || contacts.length} {pagination.total === 1 ? 'contact' : 'contacts'} total
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <GlassTable>
                    <GlassTableHeader>
                      <GlassTableRow>
                        <GlassTableHeaderCell>Name</GlassTableHeaderCell>
                        <GlassTableHeaderCell className="hidden sm:table-cell">Phone</GlassTableHeaderCell>
                        <GlassTableHeaderCell className="hidden md:table-cell">Email</GlassTableHeaderCell>
                        <GlassTableHeaderCell className="hidden lg:table-cell">Tags</GlassTableHeaderCell>
                        <GlassTableHeaderCell>Status</GlassTableHeaderCell>
                        <GlassTableHeaderCell>Actions</GlassTableHeaderCell>
                      </GlassTableRow>
                    </GlassTableHeader>
                    <GlassTableBody>
                      {contacts.map((contact) => (
                        <GlassTableRow key={contact.id}>
                          <GlassTableCell>
                            <div className="flex flex-col">
                              <Link
                                to={`/shopify/app/contacts/${contact.id}`}
                                className="font-semibold text-ice-primary hover:underline transition-colors"
                              >
                                {contact.firstName && contact.lastName
                                  ? `${contact.firstName} ${contact.lastName}`
                                  : contact.firstName || contact.lastName || contact.name || 'Unnamed Contact'}
                              </Link>
                              <span className="text-xs text-primary sm:hidden mt-1">
                                {contact.phoneE164 || contact.phone || '-'}
                              </span>
                            </div>
                          </GlassTableCell>
                          <GlassTableCell className="hidden sm:table-cell">
                            <span className="text-neutral-text-primary font-medium text-sm">{contact.phoneE164 || contact.phone || '-'}</span>
                          </GlassTableCell>
                          <GlassTableCell className="hidden md:table-cell">
                            <span className="text-neutral-text-primary font-medium text-sm">{contact.email || '-'}</span>
                          </GlassTableCell>
                          <GlassTableCell className="hidden lg:table-cell">
                            <div className="flex flex-wrap gap-1">
                              {contact.tags && contact.tags.length > 0 ? (
                                contact.tags.slice(0, 2).map((tag, idx) => (
                                  <span
                                    key={idx}
                                    className="px-2 py-0.5 text-xs rounded-full bg-ice-soft/60 border border-ice-primary/20 text-ice-primary font-medium"
                                  >
                                    {tag}
                                  </span>
                                ))
                              ) : (
                                <span className="text-primary text-xs">-</span>
                              )}
                              {contact.tags && contact.tags.length > 2 && (
                                <span className="text-primary text-xs">+{contact.tags.length - 2}</span>
                              )}
                            </div>
                          </GlassTableCell>
                          <GlassTableCell>
                            <StatusBadge status={contact.smsConsent || contact.consentStatus} />
                          </GlassTableCell>
                          <GlassTableCell>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => navigate(`/shopify/app/contacts/${contact.id}`)}
                                className="p-2.5 rounded-lg hover:bg-neutral-surface-secondary transition-all duration-200 hover:scale-105 focus-ring min-w-[44px] min-h-[44px] flex items-center justify-center group"
                                aria-label="View contact"
                                title="View contact"
                              >
                                <Icon name="view" size="sm" variant="ice" className="group-hover:scale-110 transition-transform" />
                              </button>
                              <button
                                onClick={() => navigate(`/shopify/app/contacts/${contact.id}`, { state: { edit: true } })}
                                className="p-2.5 rounded-lg hover:bg-neutral-surface-secondary transition-all duration-200 hover:scale-105 focus-ring min-w-[44px] min-h-[44px] flex items-center justify-center group"
                                aria-label="Edit contact"
                                title="Edit contact"
                              >
                                <Icon name="edit" size="sm" variant="ice" className="group-hover:scale-110 transition-transform" />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(contact.id, contact.name || contact.firstName || contact.lastName || 'this contact')}
                                className="p-2.5 rounded-lg hover:bg-red-500/10 transition-all duration-200 hover:scale-105 focus-ring min-w-[44px] min-h-[44px] flex items-center justify-center group"
                                aria-label="Delete contact"
                                title="Delete contact"
                              >
                                <Icon name="delete" size="sm" className="text-red-500 group-hover:scale-110 transition-transform" />
                              </button>
                            </div>
                          </GlassTableCell>
                        </GlassTableRow>
                      ))}
                    </GlassTableBody>
                  </GlassTable>
                  </div>
                </GlassCard>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="mt-6 sm:mt-8">
                <GlassCard className="p-5 sm:p-6 shadow-xl border border-neutral-border/40">
                  <GlassPagination
                    currentPage={pagination.page || page}
                    totalPages={pagination.totalPages || 1}
                    onPageChange={(newPage) => {
                      setPage(newPage);
                      // Scroll to top smoothly
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    totalItems={pagination.total}
                    itemName="contacts"
                    showInfo={true}
                  />
                </GlassCard>
              </div>
            )}
            </>
          )}
            </>
          )}

          {/* Import Modal */}
          <ImportContactsModal
            isOpen={isImportModalOpen}
            onClose={() => setIsImportModalOpen(false)}
          />
          
          <ConfirmDialog
            isOpen={!!deleteTarget}
            onClose={() => setDeleteTarget(null)}
            onConfirm={handleDelete}
            title="Delete Contact"
            message={deleteTarget ? `Are you sure you want to delete "${deleteTarget.name}"? This action cannot be undone.` : ''}
            confirmLabel="Delete"
            cancelLabel="Cancel"
            destructive={true}
          />
        </div>
      </div>
    </>
  );
}

