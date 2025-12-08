/**
 * Payment Verification Utilities
 * 
 * Helper functions for verifying and handling different payment types
 */

/**
 * Extract payment type from URL search params
 * @returns {string|null} Payment type or null if not found
 */
export function getPaymentTypeFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('type') || null;
}

/**
 * Extract session ID from URL search params
 * @returns {string|null} Session ID or null if not found
 */
export function getSessionIdFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('session_id') || null;
}

/**
 * Determine payment type from session metadata or URL
 * @param {string} sessionId - Stripe session ID
 * @param {string} urlType - Payment type from URL params
 * @returns {string} Payment type
 */
export function determinePaymentType(sessionId, urlType) {
  // First priority: URL parameter
  if (urlType) {
    return urlType;
  }
  
  // Fallback: Try to determine from session ID prefix
  // This is a fallback - ideally we should get this from session metadata
  if (sessionId) {
    // Stripe session IDs start with 'cs_'
    // We can't determine type from ID alone, so return 'unknown'
    return 'unknown';
  }
  
  return 'unknown';
}

/**
 * Get success message based on payment type
 * @param {string} paymentType - Type of payment (subscription, credit_topup, credit_pack)
 * @returns {Object} Success message object with title and message
 */
export function getSuccessMessage(paymentType) {
  const messages = {
    subscription: {
      title: 'Subscription Activated!',
      message: 'Your subscription has been activated successfully. Free credits have been allocated to your account.',
    },
    credit_topup: {
      title: 'Credits Added!',
      message: 'Your credit top-up has been processed successfully. Credits have been added to your account.',
    },
    credit_pack: {
      title: 'Purchase Complete!',
      message: 'Your credit pack purchase has been completed successfully. Credits have been added to your account.',
    },
    default: {
      title: 'Payment Successful!',
      message: 'Your payment has been processed successfully. Credits have been added to your account.',
    },
  };
  
  return messages[paymentType] || messages.default;
}

/**
 * Check if payment type requires verification
 * @param {string} paymentType - Type of payment
 * @returns {boolean} True if verification is recommended
 */
export function requiresVerification(paymentType) {
  // Subscriptions should be verified to ensure activation
  // Top-ups and packs are handled by webhooks, verification is optional
  return paymentType === 'subscription';
}

