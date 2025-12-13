/**
 * Prisma Schema Type Definitions for Frontend
 * 
 * These types match the Prisma schema enums and models from the backend.
 * Use these constants instead of string literals for type safety and consistency.
 * 
 * @example
 * import { CampaignStatus, ScheduleType } from '../types/prisma';
 * 
 * if (campaign.status === CampaignStatus.sending) { ... }
 */

// ============================================================================
// ENUMS - Match Prisma schema enums exactly
// ============================================================================

/**
 * Campaign Status Enum
 */
export const CampaignStatus = {
  draft: 'draft',
  scheduled: 'scheduled',
  sending: 'sending',
  sent: 'sent',
  failed: 'failed',
  cancelled: 'cancelled',
};

/**
 * Schedule Type Enum
 */
export const ScheduleType = {
  immediate: 'immediate',
  scheduled: 'scheduled',
  recurring: 'recurring',
};

/**
 * SMS Consent Enum
 */
export const SmsConsent = {
  opted_in: 'opted_in',
  opted_out: 'opted_out',
  unknown: 'unknown',
};

/**
 * Message Direction Enum
 */
export const MessageDirection = {
  outbound: 'outbound',
  inbound: 'inbound',
};

/**
 * Message Status Enum
 */
export const MessageStatus = {
  queued: 'queued',
  sent: 'sent',
  delivered: 'delivered',
  failed: 'failed',
  received: 'received',
};

/**
 * Transaction Type Enum
 */
export const TransactionType = {
  purchase: 'purchase',
  debit: 'debit',
  credit: 'credit',
  refund: 'refund',
  adjustment: 'adjustment',
};

/**
 * Subscription Plan Type Enum
 */
export const SubscriptionPlanType = {
  starter: 'starter',
  pro: 'pro',
};

/**
 * Subscription Status Enum
 */
export const SubscriptionStatus = {
  active: 'active',
  inactive: 'inactive',
  cancelled: 'cancelled',
};

/**
 * Credit Transaction Type Enum
 */
export const CreditTxnType = {
  credit: 'credit',
  debit: 'debit',
  refund: 'refund',
};

/**
 * Automation Trigger Enum
 */
export const AutomationTrigger = {
  welcome: 'welcome',
  abandoned_cart: 'abandoned_cart',
  order_confirmation: 'order_confirmation',
  shipping_update: 'shipping_update',
  delivery_confirmation: 'delivery_confirmation',
  review_request: 'review_request',
  reorder_reminder: 'reorder_reminder',
  birthday: 'birthday',
  customer_inactive: 'customer_inactive',
  cart_abandoned: 'cart_abandoned',
  order_placed: 'order_placed',
  order_fulfilled: 'order_fulfilled',
};

/**
 * Payment Status Enum
 */
export const PaymentStatus = {
  pending: 'pending',
  paid: 'paid',
  failed: 'failed',
  refunded: 'refunded',
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get all enum values as an array
 * @param {Object} enumObject - The enum object (e.g., CampaignStatus)
 * @returns {Array<string>} Array of enum values
 */
export function getEnumValues(enumObject) {
  return Object.values(enumObject);
}

/**
 * Check if a value is a valid enum value
 * @param {Object} enumObject - The enum object (e.g., CampaignStatus)
 * @param {string} value - The value to check
 * @returns {boolean} True if value is a valid enum value
 */
export function isValidEnumValue(enumObject, value) {
  return Object.values(enumObject).includes(value);
}

/**
 * Get enum key from value
 * @param {Object} enumObject - The enum object (e.g., CampaignStatus)
 * @param {string} value - The enum value
 * @returns {string|null} The enum key or null if not found
 */
export function getEnumKey(enumObject, value) {
  const entry = Object.entries(enumObject).find(([_, v]) => v === value);
  return entry ? entry[0] : null;
}

// ============================================================================
// TYPE DEFINITIONS (JSDoc for IDE support)
// ============================================================================

/**
 * @typedef {Object} Campaign
 * @property {string} id
 * @property {string} shopId
 * @property {string} name
 * @property {string} message
 * @property {string} audience
 * @property {string|null} discountId
 * @property {string|null} scheduleAt
 * @property {number|null} recurringDays
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {keyof typeof ScheduleType} scheduleType
 * @property {keyof typeof CampaignStatus} status
 */

/**
 * @typedef {Object} Contact
 * @property {string} id
 * @property {string} shopId
 * @property {string|null} firstName
 * @property {string|null} lastName
 * @property {string} phoneE164
 * @property {string|null} email
 * @property {string|null} gender
 * @property {string|null} birthDate
 * @property {string[]} tags
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {keyof typeof SmsConsent} smsConsent
 */

/**
 * @typedef {Object} CampaignMetrics
 * @property {string} id
 * @property {string} campaignId
 * @property {number} totalSent
 * @property {number} totalDelivered
 * @property {number} totalFailed
 * @property {number} totalProcessed
 * @property {number} totalClicked
 */

/**
 * @typedef {Object} MessageLog
 * @property {string} id
 * @property {string} shopId
 * @property {string} phoneE164
 * @property {string} provider
 * @property {string|null} providerMsgId
 * @property {Object|null} payload
 * @property {string|null} error
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {string|null} campaignId
 * @property {keyof typeof MessageDirection} direction
 * @property {keyof typeof MessageStatus|null} status
 * @property {string|null} deliveryStatus
 * @property {string|null} senderNumber
 */

/**
 * @typedef {Object} Subscription
 * @property {boolean} active
 * @property {keyof typeof SubscriptionPlanType|null} planType
 * @property {keyof typeof SubscriptionStatus} status
 * @property {string|null} stripeCustomerId
 * @property {string|null} stripeSubscriptionId
 * @property {string|null} lastFreeCreditsAllocatedAt
 */

/**
 * @typedef {Object} Purchase
 * @property {string} id
 * @property {string} shopId
 * @property {string} packageId
 * @property {number} units
 * @property {number} priceCents
 * @property {keyof typeof PaymentStatus} status
 * @property {string} createdAt
 * @property {string} updatedAt
 * @property {string|null} stripeSessionId
 * @property {string|null} stripePaymentIntentId
 * @property {string|null} stripeCustomerId
 * @property {string|null} stripePriceId
 * @property {string|null} currency
 */
