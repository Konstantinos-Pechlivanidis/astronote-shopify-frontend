import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import GlassCard from '../../components/ui/GlassCard';
import GlassButton from '../../components/ui/GlassButton';
import GlassInput from '../../components/ui/GlassInput';
import GlassTextarea from '../../components/ui/GlassTextarea';
import GlassSelectCustom from '../../components/ui/GlassSelectCustom';
import BackButton from '../../components/ui/BackButton';
import PageHeader from '../../components/ui/PageHeader';
import LoadingSpinner from '../../components/ui/LoadingSpinner';
import Icon from '../../components/ui/Icon';
import { useAutomations, useCreateAutomation, useUpdateAutomation } from '../../services/queries';
import { useToastContext } from '../../contexts/ToastContext';
import { transformAutomationFromAPI } from '../../utils/apiAdapters';
import SEO from '../../components/SEO';

export default function AutomationForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = !!id;
  const toast = useToastContext();

  const { data: automationsData } = useAutomations();
  const createAutomation = useCreateAutomation();
  const updateAutomation = useUpdateAutomation();

  const automations = Array.isArray(automationsData) 
    ? automationsData 
    : automationsData?.automations || [];
  const existingAutomation = isEditMode 
    ? automations.find((a) => a.id === id) 
    : null;

  const [formData, setFormData] = useState({
    name: '',
    trigger: 'order_placed',
    triggerConditions: {},
    message: '',
    status: 'draft',
  });

  const [errors, setErrors] = useState({});
  const [isPlaceholderMenuOpen, setIsPlaceholderMenuOpen] = useState(false);
  
  // Close placeholder menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isPlaceholderMenuOpen && !event.target.closest('.placeholder-menu-container')) {
        setIsPlaceholderMenuOpen(false);
      }
    };
    if (isPlaceholderMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isPlaceholderMenuOpen]);

  useEffect(() => {
    if (isEditMode && existingAutomation) {
      // Use adapter to ensure consistent format
      const normalized = transformAutomationFromAPI(existingAutomation);
      setFormData({
        name: normalized.name || '',
        trigger: normalized.trigger || 'order_placed',
        triggerConditions: normalized.triggerConditions || {},
        message: normalized.message || '',
        status: normalized.status || 'draft',
      });
    }
  }, [isEditMode, existingAutomation]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Prevent selecting disabled/coming soon triggers
    const selectedOption = triggerOptions.find(opt => opt.value === value);
    if (selectedOption?.disabled) {
      return; // Don't allow selection of disabled options
    }
    
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Automation name is required';
    }
    
    if (!formData.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      if (isEditMode) {
        await updateAutomation.mutateAsync({ id, ...formData });
        toast.success('Automation updated successfully');
      } else {
        await createAutomation.mutateAsync(formData);
        toast.success('Automation created successfully');
      }
      navigate('/shopify/app/automations');
    } catch (error) {
      toast.error(error?.message || `Failed to ${isEditMode ? 'update' : 'create'} automation`);
    }
  };

  const triggerOptions = [
    { value: 'welcome', label: 'Welcome Message' },
    { value: 'order_placed', label: 'Order Placed' },
    { value: 'order_fulfilled', label: 'Order Fulfilled' },
    { value: 'birthday', label: 'Birthday' },
    { value: 'abandoned_cart', label: 'Abandoned Cart', note: 'Coming soon', disabled: true },
    { value: 'customer_inactive', label: 'Customer Re-engagement', note: 'Coming soon', disabled: true },
  ];

  if (isEditMode && !existingAutomation) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      <SEO
        title={isEditMode ? 'Edit Automation' : 'Create Automation - Astronote SMS Marketing'}
        description="Create or edit an SMS automation workflow"
        path={isEditMode ? `/shopify/app/automations/${id}` : '/shopify/app/automations/new'}
      />
      <div className="min-h-screen pt-4 sm:pt-6 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-8 bg-neutral-bg-base w-full max-w-full">
        <div className="max-w-[1400px] mx-auto w-full">
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center gap-3 mb-3 sm:mb-4">
              <BackButton to="/shopify/app/automations" label="Back" />
            </div>
            <PageHeader
              title={isEditMode ? 'Edit Automation' : 'Create Automation'}
              subtitle={
                isEditMode 
                  ? 'Update your automation workflow'
                  : 'Set up an automated SMS workflow for your store'
              }
            />
          </div>

          <GlassCard className="p-4 sm:p-6">
            <div className="space-y-4 sm:space-y-6">
              <GlassInput
                label="Automation Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                placeholder="Order Confirmation Automation"
                required
              />

              <div>
                <GlassSelectCustom
                  label="Trigger"
                  name="trigger"
                  value={formData.trigger}
                  onChange={handleChange}
                  options={triggerOptions.map(opt => ({ 
                    value: opt.value, 
                    label: opt.label,
                    disabled: opt.disabled 
                  }))}
                />
                {triggerOptions.find(opt => opt.value === formData.trigger)?.note && (
                  <p className="text-xs text-primary mt-2 flex items-center gap-1">
                    <Icon name="info" size="xs" />
                    {triggerOptions.find(opt => opt.value === formData.trigger).note}
                  </p>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-neutral-text-primary">
                    Message
                    <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative placeholder-menu-container">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsPlaceholderMenuOpen(!isPlaceholderMenuOpen);
                      }}
                      className="px-3 py-1.5 text-sm rounded-lg bg-neutral-surface-secondary border border-neutral-border/60 hover:border-neutral-border hover:bg-neutral-surface-primary transition-colors flex items-center gap-1.5 text-primary hover:text-neutral-text-primary"
                    >
                      <span>+</span>
                      <span>Insert variable</span>
                    </button>
                    {isPlaceholderMenuOpen && (
                      <div className="absolute right-0 top-full mt-1 z-50 w-48 rounded-xl bg-neutral-surface-primary backdrop-blur-[24px] border border-neutral-border/60 shadow-lg overflow-hidden">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const textarea = document.getElementById('automation-message');
                            const start = textarea.selectionStart || formData.message.length;
                            const end = textarea.selectionEnd || formData.message.length;
                            const placeholder = '{{first_name}}';
                            const newMessage = 
                              formData.message.substring(0, start) + 
                              placeholder + 
                              formData.message.substring(end);
                            setFormData(prev => ({ ...prev, message: newMessage }));
                            setIsPlaceholderMenuOpen(false);
                            setTimeout(() => {
                              textarea.focus();
                              const newPosition = start + placeholder.length;
                              textarea.setSelectionRange(newPosition, newPosition);
                            }, 10);
                          }}
                          className="w-full px-4 py-3 text-left text-sm text-neutral-text-primary hover:bg-neutral-surface-secondary transition-colors border-b border-neutral-border/30"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs bg-neutral-surface-secondary/80 text-neutral-text-primary px-2 py-1 rounded">{'{{first_name}}'}</span>
                            <span>First Name</span>
                          </div>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const textarea = document.getElementById('automation-message');
                            const start = textarea.selectionStart || formData.message.length;
                            const end = textarea.selectionEnd || formData.message.length;
                            const placeholder = '{{last_name}}';
                            const newMessage = 
                              formData.message.substring(0, start) + 
                              placeholder + 
                              formData.message.substring(end);
                            setFormData(prev => ({ ...prev, message: newMessage }));
                            setIsPlaceholderMenuOpen(false);
                            setTimeout(() => {
                              textarea.focus();
                              const newPosition = start + placeholder.length;
                              textarea.setSelectionRange(newPosition, newPosition);
                            }, 10);
                          }}
                          className="w-full px-4 py-3 text-left text-sm text-neutral-text-primary hover:bg-neutral-surface-secondary transition-colors"
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs bg-neutral-surface-secondary/80 text-neutral-text-primary px-2 py-1 rounded">{'{{last_name}}'}</span>
                            <span>Last Name</span>
                          </div>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <GlassTextarea
                  id="automation-message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  error={errors.message}
                  rows={6}
                  placeholder="Type your SMS message here... Use {{first_name}} and {{last_name}} for personalization."
                  required
                />
              </div>

              <GlassSelectCustom
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={[
                  { value: 'draft', label: 'Draft' },
                  { value: 'active', label: 'Active' },
                  { value: 'paused', label: 'Paused' },
                ]}
              />

              <div className="flex gap-4 pt-4">
                <GlassButton
                  variant="ghost"
                  size="lg"
                  onClick={() => navigate('/shopify/app/automations')}
                  className="flex-1"
                >
                  Cancel
                </GlassButton>
                <GlassButton
                  variant="primary"
                  size="lg"
                  onClick={handleSave}
                  disabled={updateAutomation.isPending}
                  className="flex-1"
                >
                  {updateAutomation.isPending ? (
                    <span className="flex items-center gap-2">
                      <LoadingSpinner size="sm" />
                      Saving...
                    </span>
                  ) : (
                    isEditMode ? 'Update Automation' : 'Create Automation'
                  )}
                </GlassButton>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </>
  );
}

