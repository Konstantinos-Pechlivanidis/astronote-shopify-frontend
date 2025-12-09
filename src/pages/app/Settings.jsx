import { useState, useEffect, useMemo } from 'react';
import GlassCard from '../../components/ui/GlassCard';
import GlassButton from '../../components/ui/GlassButton';
import PageHeader from '../../components/ui/PageHeader';
import GlassInput from '../../components/ui/GlassInput';
import GlassSelectCustom from '../../components/ui/GlassSelectCustom';
import StatusBadge from '../../components/ui/StatusBadge';
import Icon from '../../components/ui/Icon';
import LoadingState from '../../components/ui/LoadingState';
import ErrorState from '../../components/ui/ErrorState';
import { useSettings, useAccountInfo, useUpdateSettings } from '../../services/queries';
import { useToastContext } from '../../contexts/ToastContext';
import { useStoreInfo } from '../../hooks/useStoreInfo';
import SEO from '../../components/SEO';
import { TOKEN_KEY } from '../../utils/constants';
import { format } from 'date-fns';

export default function Settings() {
  const toast = useToastContext();
  const storeInfo = useStoreInfo();
  const [activeTab, setActiveTab] = useState('general');
  const [formData, setFormData] = useState({
    senderId: '',
    timezone: 'UTC',
    currency: 'EUR',
  });

  const { data: settingsData, isLoading: isLoadingSettings, error: settingsError } = useSettings();
  const { data: accountData, isLoading: isLoadingAccount, error: accountError } = useAccountInfo();
  const updateSettings = useUpdateSettings();

  // Normalize response data
  const settings = useMemo(() => settingsData?.data || settingsData || {}, [settingsData]);
  const account = accountData?.data || accountData || {};

  useEffect(() => {
    if (settings) {
      setFormData({
        senderId: settings.senderId || '',
        timezone: settings.timezone || 'UTC',
        currency: settings.currency || 'EUR',
      });
    }
  }, [settings]);

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    
    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    // Validate senderId if provided
    if (formData.senderId && formData.senderId.trim()) {
      const senderId = formData.senderId.trim();
      // Check if it's E.164 format (phone number) or alphanumeric (sender name)
      const isE164 = /^\+[1-9]\d{1,14}$/.test(senderId);
      const isAlphanumeric = /^[a-zA-Z0-9]{3,11}$/.test(senderId);
      
      if (!isE164 && !isAlphanumeric) {
        newErrors.senderId = 'Sender ID must be either a valid E.164 phone number (e.g., +1234567890) or 3-11 alphanumeric characters';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) {
      return;
    }

    try {
      // Check if anything has changed
      const hasChanges = 
        formData.senderId !== (settings?.senderId || '') ||
        formData.timezone !== (settings?.timezone || 'UTC') ||
        formData.currency !== (settings?.currency || 'EUR');

      if (!hasChanges) {
        toast.info('No changes to save');
        return;
      }

      // Prepare update data
      const updateData = {};
      if (formData.senderId !== (settings?.senderId || '')) {
        updateData.senderId = formData.senderId;
      }
      if (formData.timezone !== (settings?.timezone || 'UTC')) {
        updateData.timezone = formData.timezone;
      }
      if (formData.currency !== (settings?.currency || 'EUR')) {
        updateData.currency = formData.currency;
      }

      await updateSettings.mutateAsync(updateData);
      toast.success('Settings saved successfully');
    } catch (error) {
      toast.error(error?.message || 'Failed to save settings');
    }
  };

  const tabs = [
    { id: 'general', label: 'General', icon: 'settings', description: 'Store preferences' },
    { id: 'sms', label: 'SMS Settings', icon: 'sms', description: 'Messaging configuration' },
    { id: 'integrations', label: 'Integrations', icon: 'integration', description: 'Third-party connections' },
    { id: 'account', label: 'Account', icon: 'personal', description: 'Account & usage' },
  ];

  // Loading state
  const isInitialLoad = (isLoadingSettings && !settingsData) || (isLoadingAccount && !accountData);
  const hasError = settingsError || accountError;

  if (isInitialLoad) {
    return <LoadingState size="lg" message="Loading settings..." />;
  }

  return (
    <>
      <SEO
        title="Settings - Astronote SMS Marketing"
        description="Manage your account and SMS settings"
        path="/shopify/app/settings"
      />
      <div className="min-h-screen pt-4 sm:pt-6 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 bg-neutral-bg-base w-full max-w-full">
        <div className="max-w-[1600px] mx-auto w-full">
          {/* Header */}
          <div className="mb-6 sm:mb-8 lg:mb-10">
            <PageHeader
              title="Settings"
              subtitle="Manage your account and SMS settings"
            />
          </div>

          {/* Error State */}
          {hasError && (
            <ErrorState
              title="Error Loading Settings"
              message={settingsError?.message || accountError?.message || 'Failed to load settings. Please try refreshing the page.'}
              onAction={() => window.location.reload()}
              actionLabel="Refresh Page"
            />
          )}

          {!hasError && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
              {/* Sidebar Navigation - Desktop */}
              <aside className="lg:col-span-3">
                <div className="hidden lg:block sticky top-6">
                  <GlassCard className="p-0 overflow-hidden shadow-xl border border-neutral-border/40">
                    <div className="p-4 sm:p-5 border-b border-neutral-border/40 bg-gradient-to-r from-ice-soft/30 to-transparent">
                      <h3 className="text-sm font-semibold text-neutral-text-primary uppercase tracking-wider">Settings</h3>
                    </div>
                    <nav className="p-2 space-y-1">
                      {tabs.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`w-full flex items-start gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${
                            activeTab === tab.id
                              ? 'bg-gradient-to-r from-ice-soft to-ice-primary/10 text-ice-primary shadow-md border border-ice-primary/20'
                              : 'text-neutral-text-primary hover:bg-neutral-surface-secondary hover:text-ice-primary'
                          }`}
                          aria-label={tab.label}
                          aria-current={activeTab === tab.id ? 'page' : undefined}
                        >
                          <Icon 
                            name={tab.icon} 
                            size="md" 
                            variant={activeTab === tab.id ? 'ice' : 'default'} 
                            className="mt-0.5 flex-shrink-0"
                          />
                          <div className="flex-1 min-w-0 text-left">
                            <div className="text-sm font-semibold">{tab.label}</div>
                            <div className={`text-xs mt-0.5 ${
                              activeTab === tab.id 
                                ? 'text-ice-primary/80' 
                                : 'text-neutral-text-primary/60 group-hover:text-neutral-text-primary/80'
                            }`}>
                              {tab.description}
                            </div>
                          </div>
                        </button>
                      ))}
                    </nav>
                  </GlassCard>
                </div>

                {/* Mobile Tabs */}
                <div className="lg:hidden mb-6">
                  <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {tabs.map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`
                          flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 min-h-[44px] shadow-sm
                          ${activeTab === tab.id
                            ? 'bg-ice-primary text-white shadow-glow-ice'
                            : 'bg-neutral-surface-secondary text-neutral-text-primary hover:bg-neutral-surface-primary hover:text-ice-primary'
                          }
                        `}
                        aria-label={`View ${tab.label} settings`}
                      >
                        <Icon name={tab.icon} size="sm" variant={activeTab === tab.id ? 'default' : 'default'} />
                        <span className="whitespace-nowrap">{tab.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </aside>

              {/* Main Content */}
              <main className="lg:col-span-9">
                {/* General Settings */}
                {activeTab === 'general' && (
                  <div className="space-y-6 animate-fade-in">
                    <GlassCard className="p-6 sm:p-8 lg:p-10 shadow-xl border border-neutral-border/40 hover:shadow-2xl transition-all duration-300">
                      {/* Section Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-neutral-border/40">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-2xl bg-gradient-to-br from-ice-soft/90 to-ice-primary/20 shadow-lg">
                            <Icon name="settings" size="lg" variant="ice" />
                          </div>
                          <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-text-primary mb-1">General Settings</h2>
                            <p className="text-sm sm:text-base text-primary">Configure your store preferences and defaults</p>
                          </div>
                        </div>
                      </div>

                      {/* Form Content */}
                      <div className="space-y-8">
                        {/* Sender ID Section */}
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-lg font-semibold text-neutral-text-primary mb-1">Sender Configuration</h3>
                            <p className="text-sm text-primary">Set your SMS sender ID or phone number</p>
                          </div>
                          <GlassInput
                            label="Sender ID / Name"
                            name="senderId"
                            value={formData.senderId}
                            onChange={handleChange}
                            onBlur={() => {
                              if (formData.senderId && formData.senderId.trim()) {
                                const senderId = formData.senderId.trim();
                                const isE164 = /^\+[1-9]\d{1,14}$/.test(senderId);
                                const isAlphanumeric = /^[a-zA-Z0-9]{3,11}$/.test(senderId);
                                if (!isE164 && !isAlphanumeric) {
                                  setErrors((prev) => ({
                                    ...prev,
                                    senderId: 'Sender ID must be either a valid E.164 phone number (e.g., +1234567890) or 3-11 alphanumeric characters',
                                  }));
                                } else {
                                  setErrors((prev) => ({ ...prev, senderId: '' }));
                                }
                              }
                            }}
                            placeholder="Your Store Name or +1234567890"
                            error={errors.senderId}
                            helperText="Use a phone number (E.164 format) or 3-11 character alphanumeric name"
                          />
                        </div>

                        {/* Timezone & Currency Section */}
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-lg font-semibold text-neutral-text-primary mb-1">Regional Settings</h3>
                            <p className="text-sm text-primary">Configure timezone and currency preferences</p>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <GlassSelectCustom
                              label="Default Timezone"
                              name="timezone"
                              value={formData.timezone}
                              onChange={handleChange}
                              options={[
                                { value: 'UTC', label: 'UTC' },
                                { value: 'America/New_York', label: 'Eastern Time' },
                                { value: 'America/Chicago', label: 'Central Time' },
                                { value: 'America/Denver', label: 'Mountain Time' },
                                { value: 'America/Los_Angeles', label: 'Pacific Time' },
                                { value: 'Europe/London', label: 'London' },
                                { value: 'Europe/Paris', label: 'Paris' },
                                { value: 'Europe/Athens', label: 'Athens' },
                                { value: 'Asia/Tokyo', label: 'Tokyo' },
                              ]}
                            />
                            <GlassSelectCustom
                              label="Currency"
                              name="currency"
                              value={formData.currency}
                              onChange={handleChange}
                              options={[
                                { value: 'EUR', label: 'EUR (€)' },
                                { value: 'USD', label: 'USD ($)' },
                              ]}
                            />
                          </div>
                        </div>

                        {/* Store Information Section */}
                        {storeInfo && (
                          <div className="space-y-4 pt-4 border-t border-neutral-border/40">
                            <div>
                              <h3 className="text-lg font-semibold text-neutral-text-primary mb-1">Store Information</h3>
                              <p className="text-sm text-primary">Your connected Shopify store details</p>
                            </div>
                            <GlassCard variant="ice" className="p-5 sm:p-6 border border-ice-primary/20 shadow-md">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                                <div className="space-y-1">
                                  <p className="text-xs font-medium text-primary uppercase tracking-wider">Store Name</p>
                                  <p className="text-base font-semibold text-neutral-text-primary break-words">
                                    {storeInfo.shopName || storeInfo.shopDomain || 'N/A'}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-xs font-medium text-primary uppercase tracking-wider">Domain</p>
                                  <p className="text-base font-semibold text-neutral-text-primary break-all">
                                    {storeInfo.shopDomain || 'N/A'}
                                  </p>
                                </div>
                              </div>
                            </GlassCard>
                          </div>
                        )}

                        {/* Save Button */}
                        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-neutral-border/40">
                          <GlassButton 
                            variant="primary" 
                            size="lg" 
                            onClick={handleSave}
                            disabled={updateSettings.isPending}
                            className="min-w-[180px] min-h-[48px] shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                          >
                            {updateSettings.isPending ? (
                              <span className="flex items-center gap-2">
                                <Icon name="check" size="sm" variant="ice" />
                                Saving...
                              </span>
                            ) : (
                              <span className="flex items-center gap-2">
                                <Icon name="check" size="sm" variant="ice" />
                                Save Changes
                              </span>
                            )}
                          </GlassButton>
                        </div>
                      </div>
                    </GlassCard>
                  </div>
                )}

                {/* SMS Settings */}
                {activeTab === 'sms' && (
                  <div className="space-y-6 animate-fade-in">
                    <GlassCard className="p-6 sm:p-8 lg:p-10 shadow-xl border border-neutral-border/40 hover:shadow-2xl transition-all duration-300">
                      {/* Section Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-neutral-border/40">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-2xl bg-gradient-to-br from-ice-soft/90 to-ice-primary/20 shadow-lg">
                            <Icon name="sms" size="lg" variant="ice" />
                          </div>
                          <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-text-primary mb-1">SMS Settings</h2>
                            <p className="text-sm sm:text-base text-primary">Configure your SMS messaging preferences</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <GlassCard variant="ice" className="p-5 sm:p-6 border border-ice-primary/20 shadow-md">
                          <div className="flex items-start gap-4">
                            <Icon name="info" size="lg" variant="ice" className="flex-shrink-0 mt-0.5" />
                            <div className="flex-1">
                              <h3 className="text-lg font-semibold text-neutral-text-primary mb-2">Sender Configuration</h3>
                              <p className="text-sm sm:text-base text-neutral-text-primary/90 leading-relaxed">
                                SMS settings are managed through the General tab. Use the Sender ID field to set your SMS sender number or name. 
                                This will be used for all campaigns and automations.
                              </p>
                            </div>
                          </div>
                        </GlassCard>

                        {settings.senderId && (
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-lg font-semibold text-neutral-text-primary mb-1">Current Sender ID</h3>
                              <p className="text-sm text-primary">Active sender identifier for your SMS messages</p>
                            </div>
                            <GlassCard className="p-5 sm:p-6 shadow-md">
                              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm font-medium text-primary mb-1">Sender ID</p>
                                  <p className="text-lg sm:text-xl font-bold text-neutral-text-primary break-all">
                                    {settings.senderId}
                                  </p>
                                </div>
                                <StatusBadge status="active" />
                              </div>
                            </GlassCard>
                          </div>
                        )}
                      </div>
                    </GlassCard>
                  </div>
                )}

                {/* Integrations */}
                {activeTab === 'integrations' && (
                  <div className="space-y-6 animate-fade-in">
                    <GlassCard className="p-6 sm:p-8 lg:p-10 shadow-xl border border-neutral-border/40 hover:shadow-2xl transition-all duration-300">
                      {/* Section Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-neutral-border/40">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-2xl bg-gradient-to-br from-ice-soft/90 to-ice-primary/20 shadow-lg">
                            <Icon name="integration" size="lg" variant="ice" />
                          </div>
                          <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-text-primary mb-1">Integrations</h2>
                            <p className="text-sm sm:text-base text-primary">Manage your third-party integrations</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        {/* Shopify Connection */}
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-lg font-semibold text-neutral-text-primary mb-1">Shopify Connection</h3>
                            <p className="text-sm text-primary">Your connected Shopify store</p>
                          </div>
                          <GlassCard className="p-5 sm:p-6 shadow-md">
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
                              <div className="flex items-center gap-4">
                                <div className="p-3 rounded-xl bg-neutral-surface-secondary shadow-sm">
                                  <Icon name="integration" size="lg" variant="ice" />
                                </div>
                                <div>
                                  <p className="text-lg sm:text-xl font-semibold text-neutral-text-primary">
                                    {storeInfo?.shopName || storeInfo?.shopDomain || 'Not connected'}
                                  </p>
                                  <p className="text-sm text-primary mt-0.5">
                                    {storeInfo ? 'Connected' : 'Not connected'}
                                  </p>
                                </div>
                              </div>
                              <StatusBadge status={storeInfo ? 'active' : 'pending'} />
                            </div>
                            {storeInfo?.shopDomain && (
                              <div className="pt-5 border-t border-neutral-border/40">
                                <p className="text-xs font-medium text-primary uppercase tracking-wider mb-3">Shop Domain</p>
                                <code className="block text-sm sm:text-base text-neutral-text-primary font-mono break-all bg-neutral-surface-secondary/80 px-4 py-3 rounded-lg border border-neutral-border/60">
                                  {storeInfo.shopDomain}
                                </code>
                              </div>
                            )}
                          </GlassCard>
                        </div>

                        {/* Webhook URL */}
                        <div className="space-y-4">
                          <div>
                            <h3 className="text-lg font-semibold text-neutral-text-primary mb-1">Webhook Configuration</h3>
                            <p className="text-sm text-primary">Configure webhooks for real-time updates</p>
                          </div>
                          <GlassCard className="p-5 sm:p-6 shadow-md">
                            <div className="space-y-4">
                              <div className="flex items-start gap-4">
                                <Icon name="webhook" size="lg" variant="ice" className="flex-shrink-0 mt-0.5" />
                                <div className="flex-1 min-w-0">
                                  <p className="text-sm text-primary mb-3">Use this URL in your Shopify webhook settings</p>
                                  <code className="block text-sm sm:text-base text-neutral-text-primary break-all font-mono bg-neutral-surface-secondary/80 px-4 py-3 rounded-lg border border-neutral-border/60">
                                    {window.location.origin}/webhooks/shopify
                                  </code>
                                </div>
                              </div>
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(`${window.location.origin}/webhooks/shopify`);
                                  toast.success('Webhook URL copied to clipboard');
                                }}
                                className="flex items-center gap-2 text-sm sm:text-base font-medium text-ice-primary hover:text-ice-primary/80 transition-colors px-3 py-2 rounded-lg hover:bg-ice-soft/20"
                              >
                                <Icon name="copy" size="sm" variant="ice" />
                                Copy URL
                              </button>
                            </div>
                          </GlassCard>
                        </div>
                      </div>
                    </GlassCard>
                  </div>
                )}

                {/* Account */}
                {activeTab === 'account' && (
                  <div className="space-y-6 animate-fade-in">
                    <GlassCard className="p-6 sm:p-8 lg:p-10 shadow-xl border border-neutral-border/40 hover:shadow-2xl transition-all duration-300">
                      {/* Section Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-neutral-border/40">
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-2xl bg-gradient-to-br from-ice-soft/90 to-ice-primary/20 shadow-lg">
                            <Icon name="personal" size="lg" variant="ice" />
                          </div>
                          <div>
                            <h2 className="text-2xl sm:text-3xl font-bold text-neutral-text-primary mb-1">Account Information</h2>
                            <p className="text-sm sm:text-base text-primary">View your account details and usage statistics</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-8">
                        {/* Account Details */}
                        {storeInfo && (
                          <div className="space-y-4">
                            <div>
                              <h3 className="text-lg font-semibold text-neutral-text-primary mb-1">Store Details</h3>
                              <p className="text-sm text-primary">Your account and store information</p>
                            </div>
                            <GlassCard className="p-5 sm:p-6 shadow-md">
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                                <div className="space-y-1">
                                  <p className="text-xs font-medium text-primary uppercase tracking-wider">Store Name</p>
                                  <p className="text-base font-semibold text-neutral-text-primary">
                                    {storeInfo.shopName || 'N/A'}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <p className="text-xs font-medium text-primary uppercase tracking-wider">Domain</p>
                                  <p className="text-base font-semibold text-neutral-text-primary break-all">
                                    {storeInfo.shopDomain || 'N/A'}
                                  </p>
                                </div>
                                {account?.account?.createdAt && (
                                  <div className="space-y-1">
                                    <p className="text-xs font-medium text-primary uppercase tracking-wider">Created</p>
                                    <p className="text-base font-semibold text-neutral-text-primary">
                                      {format(new Date(account.account.createdAt), 'MMM d, yyyy')}
                                    </p>
                                  </div>
                                )}
                                {settings?.credits !== undefined && (
                                  <div className="space-y-1">
                                    <p className="text-xs font-medium text-primary uppercase tracking-wider">Credits</p>
                                    <p className="text-base font-semibold text-ice-primary">
                                      {settings.credits?.toLocaleString() || 0}
                                    </p>
                                  </div>
                                )}
                              </div>
                            </GlassCard>
                          </div>
                        )}

                        {/* Usage Statistics */}
                        {account?.usage && (
                          <div className="space-y-4 pt-4 border-t border-neutral-border/40">
                            <div>
                              <h3 className="text-lg font-semibold text-neutral-text-primary mb-1">Usage Statistics</h3>
                              <p className="text-sm text-primary">Overview of your account activity</p>
                            </div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-5">
                              <GlassCard variant="ice" className="p-5 sm:p-6 shadow-md hover:shadow-lg transition-shadow">
                                <div className="flex items-center gap-2.5 mb-3">
                                  <Icon name="personal" size="md" variant="ice" />
                                  <p className="text-xs sm:text-sm font-medium text-primary">Contacts</p>
                                </div>
                                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-text-primary">
                                  {(account.usage.totalContacts || 0).toLocaleString()}
                                </p>
                              </GlassCard>
                              <GlassCard className="p-5 sm:p-6 shadow-md hover:shadow-lg transition-shadow">
                                <div className="flex items-center gap-2.5 mb-3">
                                  <Icon name="campaign" size="md" variant="ice" />
                                  <p className="text-xs sm:text-sm font-medium text-primary">Campaigns</p>
                                </div>
                                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-text-primary">
                                  {(account.usage.totalCampaigns || 0).toLocaleString()}
                                </p>
                              </GlassCard>
                              <GlassCard className="p-5 sm:p-6 shadow-md hover:shadow-lg transition-shadow">
                                <div className="flex items-center gap-2.5 mb-3">
                                  <Icon name="automation" size="md" variant="ice" />
                                  <p className="text-xs sm:text-sm font-medium text-primary">Automations</p>
                                </div>
                                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-text-primary">
                                  {(account.usage.totalAutomations || 0).toLocaleString()}
                                </p>
                              </GlassCard>
                              <GlassCard className="p-5 sm:p-6 shadow-md hover:shadow-lg transition-shadow">
                                <div className="flex items-center gap-2.5 mb-3">
                                  <Icon name="send" size="md" variant="ice" />
                                  <p className="text-xs sm:text-sm font-medium text-primary">Messages</p>
                                </div>
                                <p className="text-2xl sm:text-3xl lg:text-4xl font-bold text-neutral-text-primary">
                                  {(account.usage.totalMessages || 0).toLocaleString()}
                                </p>
                              </GlassCard>
                            </div>
                          </div>
                        )}

                        {/* API Token */}
                        <div className="space-y-4 pt-4 border-t border-neutral-border/40">
                          <div>
                            <h3 className="text-lg font-semibold text-neutral-text-primary mb-1">API Token</h3>
                            <p className="text-sm text-primary">Your secure API authentication token</p>
                          </div>
                          <GlassCard className="p-5 sm:p-6 shadow-md">
                            <div className="flex items-start gap-4">
                              <Icon name="settings" size="lg" variant="ice" className="flex-shrink-0 mt-0.5" />
                              <div className="flex-1 min-w-0">
                                <p className="text-sm text-primary mb-3">Your API token is stored securely</p>
                                <code className="block text-sm sm:text-base text-neutral-text-primary break-all font-mono bg-neutral-surface-secondary/80 px-4 py-3 rounded-lg border border-neutral-border/60">
                                  {localStorage.getItem(TOKEN_KEY) ? '••••••••••••••••' : 'No token'}
                                </code>
                              </div>
                            </div>
                          </GlassCard>
                        </div>
                      </div>
                    </GlassCard>
                  </div>
                )}
              </main>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
