# Shopify Frontend Payment Implementation Guide

## Overview

This document outlines the implementation of payment functionality in the Shopify frontend, based on the retail payment flow but adapted for Shopify backend characteristics.

**Version:** 1.0  
**Last Updated:** 2025-01-XX  
**Purpose:** Complete technical documentation for implementing subscription, credit top-up, and credit pack purchase flows in the Shopify frontend.

---

## Table of Contents

1. [Current State Analysis](#current-state-analysis)
2. [Required Changes](#required-changes)
3. [API Integration](#api-integration)
4. [Component Updates](#component-updates)
5. [Payment Flows](#payment-flows)
6. [Error Handling](#error-handling)
7. [Testing Checklist](#testing-checklist)

---

## Current State Analysis

### What Already Exists ✅

1. **Billing Page** (`src/pages/app/Billing.jsx`)
   - ✅ Subscription status display
   - ✅ Subscription plan selection (Starter/Pro)
   - ✅ Credit top-up form with price calculation
   - ✅ Credit packages display (subscription required)
   - ✅ Purchase history table
   - ✅ Balance display

2. **API Hooks** (`src/services/queries.js`)
   - ✅ `useSubscriptionStatus()` - Get subscription status
   - ✅ `useSubscribe()` - Create subscription checkout
   - ✅ `useUpdateSubscription()` - Update subscription plan
   - ✅ `useCancelSubscription()` - Cancel subscription
   - ✅ `useVerifySubscriptionSession()` - Verify subscription payment
   - ✅ `useBillingBalance()` - Get wallet balance
   - ✅ `useBillingPackages()` - Get credit packages
   - ✅ `useCreatePurchase()` - Purchase credit pack
   - ✅ `useCalculateTopup()` - Calculate top-up price
   - ✅ `useCreateTopup()` - Create top-up checkout
   - ✅ `useBillingHistory()` - Get transaction history

3. **Success/Cancel Pages**
   - ✅ `BillingSuccess.jsx` - Payment success page
   - ✅ `BillingCancel.jsx` - Payment cancel page

4. **API Service** (`src/services/api.js`)
   - ✅ Axios instance with auth interceptors
   - ✅ Shop domain header injection
   - ✅ Error handling

### What's Missing or Needs Update ❌

1. **Stripe Customer Portal**
   - ❌ Missing `useGetPortal()` hook
   - ❌ Missing portal button in Billing page
   - ❌ Backend endpoint exists: `GET /api/subscriptions/portal`

2. **Payment Verification**
   - ⚠️ `BillingSuccess.jsx` only verifies subscriptions
   - ❌ Should verify all payment types (subscription, top-up, pack)
   - ❌ Missing generic payment verification endpoint

3. **Error Handling**
   - ⚠️ Basic error handling exists
   - ❌ Missing specific error messages for payment failures
   - ❌ Missing retry mechanisms

4. **URL Handling**
   - ⚠️ Success/cancel URLs use `FRONTEND_URL` constant
   - ✅ Should match backend expectations (`/shopify/app/billing/success`)

5. **Subscription Management**
   - ⚠️ Missing "Manage Subscription" button (Stripe Portal)
   - ⚠️ Missing subscription renewal date display
   - ⚠️ Missing next billing date display

---

## Required Changes

### 1. Add Stripe Customer Portal Hook

**File:** `src/services/queries.js`

Add new hook:

```javascript
export const useGetPortal = () => {
  return useMutation({
    mutationFn: () => api.get('/subscriptions/portal'),
  });
};
```

### 2. Update Billing Page

**File:** `src/pages/app/Billing.jsx`

**Changes:**
1. Import `useGetPortal` hook
2. Add "Manage Subscription" button (opens Stripe Portal)
3. Display subscription renewal date (if available)
4. Improve error messages for payment failures
5. Add loading states for portal access

### 3. Update BillingSuccess Page

**File:** `src/pages/app/BillingSuccess.jsx`

**Changes:**
1. Handle all payment types (subscription, top-up, pack)
2. Verify payment based on session metadata
3. Show appropriate success message based on payment type
4. Auto-refresh balance after successful payment

### 4. Add Payment Verification Utility

**File:** `src/utils/paymentVerification.js` (new)

Create utility to verify different payment types.

### 5. Update API Constants

**File:** `src/utils/constants.js`

Ensure `FRONTEND_URL` is correctly set for success/cancel URLs.

---

## API Integration

### Subscription Endpoints

#### GET `/api/subscriptions/status`

**Hook:** `useSubscriptionStatus()`

**Response:**
```json
{
  "success": true,
  "data": {
    "active": true,
    "planType": "starter",
    "status": "active",
    "stripeCustomerId": "cus_xxx",
    "stripeSubscriptionId": "sub_xxx",
    "lastFreeCreditsAllocatedAt": "2025-01-01T00:00:00Z"
  }
}
```

#### POST `/api/subscriptions/subscribe`

**Hook:** `useSubscribe()`

**Request:**
```json
{
  "planType": "starter" | "pro"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "checkoutUrl": "https://checkout.stripe.com/...",
    "sessionId": "cs_xxx",
    "planType": "starter"
  }
}
```

**Implementation:**
- Redirect to `checkoutUrl` immediately
- Success URL: `${FRONTEND_URL}/shopify/app/billing/success?session_id={CHECKOUT_SESSION_ID}`
- Cancel URL: `${FRONTEND_URL}/shopify/app/billing/cancel`

#### POST `/api/subscriptions/update`

**Hook:** `useUpdateSubscription()`

**Request:**
```json
{
  "planType": "starter" | "pro"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "planType": "starter"
  },
  "message": "Subscription updated to starter plan successfully"
}
```

#### POST `/api/subscriptions/cancel`

**Hook:** `useCancelSubscription()`

**Response:**
```json
{
  "success": true,
  "data": {
    "cancelledAt": "2025-01-01T00:00:00Z"
  },
  "message": "Subscription cancelled successfully"
}
```

#### GET `/api/subscriptions/portal` ❌ Missing

**Hook:** `useGetPortal()` (needs to be added)

**Response:**
```json
{
  "success": true,
  "data": {
    "portalUrl": "https://billing.stripe.com/..."
  }
}
```

**Implementation:**
- Open `portalUrl` in new window/tab
- User can manage payment method, view invoices, cancel subscription

#### POST `/api/subscriptions/verify-session`

**Hook:** `useVerifySubscriptionSession()`

**Request:**
```json
{
  "sessionId": "cs_xxx"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "subscription": { ... },
    "creditsAllocated": 100
  },
  "message": "Subscription verified and activated"
}
```

### Billing Endpoints

#### GET `/api/billing/balance`

**Hook:** `useBillingBalance()`

**Response:**
```json
{
  "success": true,
  "data": {
    "credits": 500,
    "balance": 500,
    "currency": "EUR"
  }
}
```

#### GET `/api/billing/packages`

**Hook:** `useBillingPackages(currency)`

**Response:**
```json
{
  "success": true,
  "data": {
    "packages": [
      {
        "id": "package_1000",
        "name": "1,000 SMS Credits",
        "credits": 1000,
        "price": 29.99,
        "currency": "EUR"
      }
    ],
    "currency": "EUR",
    "subscriptionRequired": false
  }
}
```

**Note:** Returns empty array if subscription not active.

#### POST `/api/billing/purchase`

**Hook:** `useCreatePurchase()`

**Request:**
```json
{
  "packageId": "package_1000",
  "currency": "EUR",
  "successUrl": "https://.../shopify/app/billing/success?session_id={CHECKOUT_SESSION_ID}",
  "cancelUrl": "https://.../shopify/app/billing/cancel"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "sessionId": "cs_xxx",
    "sessionUrl": "https://checkout.stripe.com/...",
    "transactionId": "bt_xxx",
    "package": { ... }
  }
}
```

#### GET `/api/billing/topup/calculate`

**Hook:** `useCalculateTopup(credits)`

**Query Parameters:**
- `credits` (required): number

**Response:**
```json
{
  "success": true,
  "data": {
    "credits": 1000,
    "priceEur": 45.0,
    "vatAmount": 10.8,
    "priceEurWithVat": 55.8
  }
}
```

#### POST `/api/billing/topup`

**Hook:** `useCreateTopup()`

**Request:**
```json
{
  "credits": 1000,
  "successUrl": "https://.../shopify/app/billing/success?session_id={CHECKOUT_SESSION_ID}",
  "cancelUrl": "https://.../shopify/app/billing/cancel"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "checkoutUrl": "https://checkout.stripe.com/...",
    "sessionId": "cs_xxx",
    "credits": 1000,
    "priceEur": 55.8,
    "priceBreakdown": {
      "credits": 1000,
      "priceEur": 45.0,
      "vatAmount": 10.8,
      "priceEurWithVat": 55.8
    }
  }
}
```

#### GET `/api/billing/history`

**Hook:** `useBillingHistory(params)`

**Query Parameters:**
- `page` (default: 1)
- `pageSize` (default: 20)
- `type` (optional)
- `startDate` (optional)
- `endDate` (optional)

**Response:**
```json
{
  "success": true,
  "data": {
    "transactions": [...],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 50,
      "totalPages": 3,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}
```

---

## Component Updates

### 1. Billing.jsx Updates

**Location:** `src/pages/app/Billing.jsx`

**Changes:**

1. **Add Portal Hook:**
```javascript
import { useGetPortal } from '../../services/queries';

// In component:
const getPortal = useGetPortal();
```

2. **Add Manage Subscription Button:**
```javascript
{isSubscriptionActive && (
  <GlassButton
    variant="ghost"
    size="md"
    onClick={async () => {
      try {
        const result = await getPortal.mutateAsync();
        if (result?.data?.portalUrl || result?.portalUrl) {
          window.open(result.data?.portalUrl || result.portalUrl, '_blank', 'noopener,noreferrer');
        }
      } catch (error) {
        toast.error(error?.message || 'Failed to open customer portal');
      }
    }}
    disabled={getPortal.isPending}
  >
    <Icon name="settings" size="sm" variant="ice" />
    Manage Subscription
  </GlassButton>
)}
```

3. **Display Subscription Details:**
```javascript
{isSubscriptionActive && (
  <div className="text-sm text-neutral-text-secondary">
    <p>Next billing: {subscription.nextBillingDate || 'N/A'}</p>
    <p>Renewal date: {subscription.renewalDate || 'N/A'}</p>
  </div>
)}
```

4. **Improve Error Messages:**
```javascript
const handleSubscribe = async (planType) => {
  try {
    const result = await subscribe.mutateAsync({ planType });
    
    if (result?.data?.checkoutUrl) {
      toast.success('Redirecting to payment...');
      window.location.href = result.data.checkoutUrl;
    } else if (result?.checkoutUrl) {
      toast.success('Redirecting to payment...');
      window.location.href = result.checkoutUrl;
    } else {
      toast.error('Failed to get checkout URL. Please try again.');
    }
  } catch (error) {
    // Enhanced error handling
    if (error?.code === 'ALREADY_SUBSCRIBED') {
      toast.error('You already have an active subscription. Please cancel your current subscription first.');
    } else if (error?.code === 'MISSING_PRICE_ID') {
      toast.error('Payment configuration error. Please contact support.');
    } else {
      const errorMessage = error?.response?.data?.message || error?.message || 'Failed to initiate subscription';
      toast.error(errorMessage);
    }
  }
};
```

### 2. BillingSuccess.jsx Updates

**Location:** `src/pages/app/BillingSuccess.jsx`

**Changes:**

1. **Handle All Payment Types:**
```javascript
import { useBillingBalance } from '../../services/queries';

// In component:
const { refetch: refetchBalance } = useBillingBalance();

useEffect(() => {
  // Refetch balance after successful payment
  if (sessionId) {
    // Wait a bit for webhook to process
    setTimeout(() => {
      refetchBalance();
    }, 2000);
  }
}, [sessionId, refetchBalance]);
```

2. **Determine Payment Type:**
```javascript
// Check URL params or session metadata to determine payment type
const paymentType = searchParams.get('type') || 'unknown';

// Show appropriate message
{paymentType === 'subscription' && (
  <p>Your subscription has been activated successfully.</p>
)}
{paymentType === 'credit_topup' && (
  <p>Credits have been added to your account.</p>
)}
{paymentType === 'credit_pack' && (
  <p>Your credit pack purchase has been completed.</p>
)}
```

### 3. Add Payment Verification Utility

**File:** `src/utils/paymentVerification.js` (new)

```javascript
/**
 * Verify payment session based on type
 */
export async function verifyPayment(sessionId, paymentType) {
  // Implementation depends on backend verification endpoints
  // For now, rely on webhooks and manual refresh
  return { verified: true, type: paymentType };
}

/**
 * Extract payment type from session metadata
 */
export function getPaymentTypeFromUrl() {
  const params = new URLSearchParams(window.location.search);
  return params.get('type') || null;
}
```

---

## Payment Flows

### 1. Subscription Flow

```
User clicks "Subscribe" 
  → POST /api/subscriptions/subscribe
  → Redirect to Stripe Checkout
  → User completes payment
  → Stripe redirects to /shopify/app/billing/success?session_id=xxx
  → BillingSuccess page verifies session (optional)
  → Webhook processes subscription
  → Credits allocated
  → User sees success message
```

### 2. Credit Top-up Flow

```
User enters credits
  → GET /api/billing/topup/calculate?credits=1000 (shows price)
  → User clicks "Purchase Credits"
  → POST /api/billing/topup
  → Redirect to Stripe Checkout
  → User completes payment
  → Stripe redirects to /shopify/app/billing/success?session_id=xxx
  → Webhook processes top-up
  → Credits added to wallet
  → User sees success message
```

### 3. Credit Pack Purchase Flow

```
User views packages (subscription required)
  → GET /api/billing/packages?currency=EUR
  → User clicks "Purchase" on package
  → POST /api/billing/purchase
  → Redirect to Stripe Checkout
  → User completes payment
  → Stripe redirects to /shopify/app/billing/success?session_id=xxx
  → Webhook processes purchase
  → Credits added to wallet
  → Purchase status updated
  → User sees success message
```

### 4. Subscription Management Flow

```
User clicks "Manage Subscription"
  → GET /api/subscriptions/portal
  → Open Stripe Customer Portal in new tab
  → User can:
    - Update payment method
    - View invoices
    - Cancel subscription
    - Update billing address
```

---

## Error Handling

### Error Types

1. **Network Errors:**
   - Show: "Network error. Please check your connection and try again."
   - Action: Retry button

2. **Payment Errors:**
   - Show: Specific error message from backend
   - Action: Return to billing page

3. **Validation Errors:**
   - Show: Field-specific error messages
   - Action: Highlight invalid fields

4. **Subscription Errors:**
   - `ALREADY_SUBSCRIBED`: "You already have an active subscription."
   - `MISSING_PRICE_ID`: "Payment configuration error. Please contact support."
   - `INVALID_PLAN_TYPE`: "Invalid subscription plan selected."

### Error Display

```javascript
// In Billing.jsx
const handleError = (error, defaultMessage) => {
  if (error?.code === 'ALREADY_SUBSCRIBED') {
    toast.error('You already have an active subscription. Please cancel your current subscription first.');
  } else if (error?.code === 'MISSING_PRICE_ID') {
    toast.error('Payment configuration error. Please contact support.');
  } else if (error?.code === 'INVALID_PLAN_TYPE') {
    toast.error('Invalid subscription plan selected.');
  } else {
    const errorMessage = error?.response?.data?.message || error?.message || defaultMessage;
    toast.error(errorMessage);
  }
};
```

---

## Testing Checklist

### Subscription Flow
- [ ] User can view subscription plans
- [ ] User can subscribe to Starter plan
- [ ] User can subscribe to Pro plan
- [ ] User cannot subscribe if already subscribed
- [ ] Success page shows after subscription
- [ ] Credits are allocated after subscription
- [ ] Subscription status updates correctly

### Subscription Management
- [ ] User can view active subscription
- [ ] User can upgrade from Starter to Pro
- [ ] User can downgrade from Pro to Starter
- [ ] User can cancel subscription
- [ ] User can access Stripe Customer Portal
- [ ] Portal opens in new tab
- [ ] Portal allows payment method update

### Credit Top-up Flow
- [ ] User can calculate top-up price
- [ ] Price breakdown shows correctly (base + VAT)
- [ ] User can purchase top-up
- [ ] Success page shows after top-up
- [ ] Credits are added to wallet
- [ ] Balance updates correctly

### Credit Pack Purchase Flow
- [ ] Packages only visible with active subscription
- [ ] User can view available packages
- [ ] User can purchase credit pack
- [ ] Success page shows after purchase
- [ ] Credits are added to wallet
- [ ] Purchase appears in history

### Error Handling
- [ ] Network errors show appropriate message
- [ ] Payment errors show backend message
- [ ] Validation errors highlight fields
- [ ] Subscription errors show specific messages
- [ ] Retry mechanisms work correctly

### UI/UX
- [ ] Loading states show during API calls
- [ ] Disabled states prevent double-clicks
- [ ] Success messages are clear
- [ ] Error messages are helpful
- [ ] Mobile responsive
- [ ] Accessibility (keyboard navigation, screen readers)

---

## Implementation Steps

1. **Add Portal Hook** (`src/services/queries.js`)
   - Add `useGetPortal()` mutation hook

2. **Update Billing Page** (`src/pages/app/Billing.jsx`)
   - Import `useGetPortal`
   - Add "Manage Subscription" button
   - Improve error handling
   - Add subscription details display

3. **Update BillingSuccess Page** (`src/pages/app/BillingSuccess.jsx`)
   - Handle all payment types
   - Auto-refresh balance
   - Show appropriate success messages

4. **Add Payment Verification Utility** (`src/utils/paymentVerification.js`)
   - Create utility functions for payment verification

5. **Test All Flows**
   - Subscription flow
   - Top-up flow
   - Pack purchase flow
   - Portal access
   - Error handling

6. **Update Documentation**
   - Update API documentation
   - Update user guide

---

## Summary

The Shopify frontend already has most of the payment infrastructure in place. The main additions needed are:

1. **Stripe Customer Portal integration** - Allow users to manage subscriptions
2. **Enhanced error handling** - Better error messages and retry mechanisms
3. **Payment verification improvements** - Handle all payment types in success page
4. **Subscription details** - Show renewal dates and billing information

Once these changes are implemented, the frontend will have full feature parity with the retail frontend for payment processing, adapted for Shopify's multi-tenant architecture.

---

**Document Version:** 1.0  
**Last Updated:** 2025-01-XX  
**Maintained By:** Development Team

