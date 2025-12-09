import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import GlassCard from '../../components/ui/GlassCard';
import GlassButton from '../../components/ui/GlassButton';
import PageHeader from '../../components/ui/PageHeader';
import GlassInput from '../../components/ui/GlassInput';
import GlassSelectCustom from '../../components/ui/GlassSelectCustom';
import GlassPagination from '../../components/ui/GlassPagination';
import Icon from '../../components/ui/Icon';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import EmptyState from '../../components/ui/EmptyState';
import { useTemplates, useTemplateCategories, useTrackTemplateUsage } from '../../services/queries';
import SEO from '../../components/SEO';
import { format } from 'date-fns';

export default function Templates() {
  const navigate = useNavigate();
  const [categoryFilter, setCategoryFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Build query params
  const queryParams = useMemo(() => {
    const params = {
      limit: pageSize,
      offset: (currentPage - 1) * pageSize,
    };
    if (categoryFilter) {
      params.category = categoryFilter;
    }
    if (searchQuery) {
      params.search = searchQuery;
    }
    return params;
  }, [categoryFilter, searchQuery, currentPage]);

  const { data: templatesData, isLoading, error } = useTemplates(queryParams);
  const { data: categoriesData } = useTemplateCategories();
  const trackUsage = useTrackTemplateUsage();

  // Normalize response structure
  const responseData = templatesData?.data || templatesData || {};
  const templates = responseData.templates || responseData.items || [];
  const pagination = responseData.pagination || {};
  const categories = categoriesData?.data || categoriesData || [];

  // Reset to page 1 when filters change
  const handleCategoryChange = (value) => {
    setCategoryFilter(value);
    setCurrentPage(1);
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  const handleUseTemplate = async (template) => {
    try {
      // Track template usage
      if (template.id) {
        await trackUsage.mutateAsync(template.id);
      }
      
      // Navigate to campaign create with template pre-filled
      navigate('/shopify/app/campaigns/new', {
        state: {
          template: {
            message: template.content,
            name: template.title,
          },
        },
      });
    } catch (error) {
      // Error already handled by toast.error above
      // Still navigate even if tracking fails
      navigate('/shopify/app/campaigns/new', {
        state: {
          template: {
            message: template.content,
            name: template.title,
          },
        },
      });
    }
  };

  // Check if we have any data
  const hasData = templates && templates.length > 0;
  const isInitialLoad = isLoading && !templatesData;

  if (isInitialLoad) {
    return <LoadingState size="lg" message="Loading templates..." />;
  }

  return (
    <>
      <SEO
        title="Templates - Astronote SMS Marketing"
        description="Browse and use SMS message templates"
        path="/shopify/app/templates"
      />
      <div className="min-h-screen pt-4 sm:pt-6 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 bg-neutral-bg-base w-full max-w-full">
        <div className="max-w-[1600px] mx-auto w-full">
          {/* Header */}
          <div className="mb-6 sm:mb-8 lg:mb-10">
            <PageHeader
              title="Templates"
              subtitle="Browse and use pre-built SMS message templates"
            />
          </div>

          {/* Error State */}
          {error && (
            <ErrorState
              title="Error Loading Templates"
              message={error.message || 'Failed to load templates. Please try refreshing the page.'}
              onAction={() => window.location.reload()}
              actionLabel="Refresh Page"
            />
          )}

          {/* Filters */}
          {!error && (
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
                  label="Search Templates"
                  type="text"
                  placeholder="Search by name or content..."
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="w-full"
                />
                <GlassSelectCustom
                  label="Filter by Category"
                  value={categoryFilter}
                  onChange={(e) => handleCategoryChange(e.target.value)}
                  options={[
                    { value: '', label: 'All Categories' },
                    ...categories
                      .filter(cat => cat) // Filter out null/undefined
                      .map((cat) => ({
                        value: cat,
                        label: cat,
                      })),
                  ]}
                />
                </div>

                {/* Results Summary */}
                {pagination.total !== undefined && (
                  <div className="mt-5 pt-5 border-t border-neutral-border/40">
                    <p className="text-sm text-primary">
                      Showing {templates.length} of {pagination.total || 0} template{pagination.total !== 1 ? 's' : ''}
                      {(categoryFilter || searchQuery) && (
                        <span className="ml-2">
                          {categoryFilter && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ice-soft/60 border border-ice-primary/20 text-ice-primary text-xs font-semibold">
                              {categoryFilter}
                              <button
                                onClick={() => handleCategoryChange('')}
                                className="hover:text-ice-primary/80 focus:outline-none transition-colors"
                                aria-label="Remove category filter"
                              >
                                <Icon name="close" size="xs" />
                              </button>
                            </span>
                          )}
                          {searchQuery && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-ice-soft/60 border border-ice-primary/20 text-ice-primary text-xs font-semibold ml-2">
                              "{searchQuery}"
                              <button
                                onClick={() => handleSearchChange('')}
                                className="hover:text-ice-primary/80 focus:outline-none transition-colors"
                                aria-label="Clear search"
                              >
                                <Icon name="close" size="xs" />
                              </button>
                            </span>
                          )}
                        </span>
                      )}
                    </p>
                  </div>
                )}
              </div>
            </GlassCard>
          )}

          {/* Templates Grid */}
          {!error && !hasData && (
            <EmptyState
              icon="templates"
              title="No templates found"
              message={
                searchQuery || categoryFilter
                  ? 'Try adjusting your filters to find more templates.'
                  : 'No templates available at the moment.'
              }
            />
          )}

          {!error && hasData && (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 lg:gap-8 mb-6 sm:mb-8 lg:mb-10">
                {templates.map((template) => (
                  <GlassCard
                    key={template.id}
                    className="p-6 sm:p-7 lg:p-8 hover:shadow-xl transition-all duration-300 hover:scale-[1.02] flex flex-col border border-neutral-border/40 group"
                  >
                    {/* Preview Image */}
                    {template.previewImage && (
                      <div className="mb-5 rounded-xl overflow-hidden bg-neutral-surface-secondary shadow-lg">
                        <img
                          src={template.previewImage}
                          alt={template.title || 'Template preview'}
                          className="w-full h-36 sm:h-44 lg:h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            e.target.style.display = 'none';
                          }}
                        />
                      </div>
                    )}
                    
                    {/* Category Badge */}
                    {template.category && (
                      <div className="mb-4">
                        <span className="inline-block px-3 py-1.5 text-xs rounded-full bg-ice-soft/60 border border-ice-primary/20 text-ice-primary font-semibold">
                          {template.category}
                        </span>
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="text-xl sm:text-2xl font-bold mb-3 text-neutral-text-primary line-clamp-2 group-hover:text-ice-primary transition-colors">
                      {template.title}
                    </h3>

                    {/* Content Preview */}
                    <p className="text-sm sm:text-base text-primary line-clamp-3 mb-5 flex-grow leading-relaxed">
                      {template.content}
                    </p>

                    {/* Statistics */}
                    {(template.conversionRate || template.productViewsIncrease || template.clickThroughRate) && (
                      <div className="mb-5 p-4 rounded-xl bg-gradient-to-br from-ice-soft/40 to-ice-primary/10 border border-ice-primary/20">
                        <div className="flex items-center gap-2 mb-3">
                          <Icon name="analytics" size="sm" variant="ice" />
                          <h4 className="text-sm font-bold text-neutral-text-primary uppercase tracking-wider">Performance Stats</h4>
                        </div>
                        <div className="grid grid-cols-2 gap-3">
                          {template.conversionRate && (
                            <div className="flex flex-col">
                              <span className="text-xs text-primary mb-1">Conversion Rate</span>
                              <span className="text-lg font-bold text-ice-primary">{template.conversionRate.toFixed(1)}%</span>
                            </div>
                          )}
                          {template.productViewsIncrease && (
                            <div className="flex flex-col">
                              <span className="text-xs text-primary mb-1">Product Views</span>
                              <span className="text-lg font-bold text-ice-primary">+{template.productViewsIncrease.toFixed(1)}%</span>
                            </div>
                          )}
                          {template.clickThroughRate && (
                            <div className="flex flex-col">
                              <span className="text-xs text-primary mb-1">Click-Through</span>
                              <span className="text-lg font-bold text-ice-primary">{template.clickThroughRate.toFixed(1)}%</span>
                            </div>
                          )}
                          {template.averageOrderValue && (
                            <div className="flex flex-col">
                              <span className="text-xs text-primary mb-1">Avg Order Value</span>
                              <span className="text-lg font-bold text-ice-primary">+{template.averageOrderValue.toFixed(1)}%</span>
                            </div>
                          )}
                        </div>
                        {template.customerRetention && (
                          <div className="mt-3 pt-3 border-t border-ice-primary/20">
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-primary">Customer Retention</span>
                              <span className="text-base font-bold text-ice-primary">+{template.customerRetention.toFixed(1)}%</span>
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Tags */}
                    {template.tags && Array.isArray(template.tags) && template.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-5">
                        {template.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 text-xs rounded-full bg-neutral-surface-secondary/60 border border-neutral-border/40 text-primary font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                        {template.tags.length > 3 && (
                          <span className="px-3 py-1 text-xs text-primary font-medium">
                            +{template.tags.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                    
                    {/* Footer Info */}
                    <div className="flex items-center justify-between mb-5 pt-5 border-t border-neutral-border/40">
                      {template.useCount !== undefined && template.useCount > 0 && (
                        <div className="flex items-center gap-2 text-sm text-primary">
                          <Icon name="check" size="sm" variant="ice" />
                          <span className="font-medium">Used {template.useCount} time{template.useCount !== 1 ? 's' : ''}</span>
                        </div>
                      )}
                      {template.createdAt && (
                        <span className="text-sm text-primary">
                          {format(new Date(template.createdAt), 'MMM d, yyyy')}
                        </span>
                      )}
                    </div>

                    {/* Use Template Button */}
                    <GlassButton
                      variant="primary"
                      size="lg"
                      onClick={() => handleUseTemplate(template)}
                      className="w-full min-h-[48px] shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <span className="flex items-center justify-center gap-2">
                        <Icon name="campaign" size="sm" variant="ice" />
                        Use Template
                      </span>
                    </GlassButton>
                  </GlassCard>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-6 sm:mt-8">
                  <GlassCard className="p-5 sm:p-6 shadow-xl border border-neutral-border/40">
                    <GlassPagination
                      currentPage={pagination.page || currentPage}
                      totalPages={pagination.totalPages || 1}
                      onPageChange={(newPage) => {
                        setCurrentPage(newPage);
                        // Scroll to top smoothly
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      totalItems={pagination.total}
                      itemName="templates"
                      showInfo={true}
                    />
                  </GlassCard>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
