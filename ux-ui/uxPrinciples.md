You are designing the UI/UX for "Astronote" — a multi-tenant SMS marketing app for Shopify stores.

TECH / OUTPUT
- Generate production-ready React + TypeScript UI (prefer Vite + React Router v6 style, not Next.js-specific APIs).
- Use shadcn/ui components + Tailwind CSS.
- Use TanStack Table patterns for large datasets (contacts/messages/campaigns).
- Include reusable components and page layouts (not only mockups): sidebar layout, topbar, tables, forms, dialogs, empty states, skeleton loaders, toast notifications.
- All strings in English (I will translate later).

BRAND / VISUAL STYLE (Light mode, professional)
- Clean, modern SaaS dashboard.
- Neutral grays for surfaces + cyan accent (Astronote identity). Use design tokens via CSS variables.
- Rounded-xl cards, soft shadows, high readability, dense-but-not-cluttered layouts for power users.
- Accessible contrast, keyboard-friendly components.
- Include compact + comfortable density toggle (e.g., table row density).

INFORMATION ARCHITECTURE (App Shell)
Create an App layout with:
- Left sidebar: Dashboard, Contacts, Lists/Segments, Campaigns, Automations, Templates, Discounts, Billing & Credits, Settings.
- Topbar: Store switcher (shop domain), current plan badge, credits balance, “Create Campaign” primary CTA, search input, user menu.

PAGES (create each as a React page component)
1) Dashboard
- KPI cards: Contacts, Credits balance, Messages sent (7d), Delivered %, Failed %, Revenue (estimated), CTR (from tracked links).
- Charts placeholders (simple): messages over time, delivery status breakdown, clicks over time.
- “Recent campaigns” table with status badges.

2) Contacts
- Data table: name, phone (E.164), country, subscribed, source, createdAt, lastMessageStatus.
- Filters: subscribed, country, source, date range.
- Contact detail drawer: profile, opt-in history, message history timeline.

3) Lists & Segments
- Lists CRUD + members count.
- Segment builder (MVP): rule cards (Subscribed only, Created last N days, Country equals, Source equals). Show live preview count.

4) Campaigns
- Campaign list table: name, status, audience, scheduledAt, sentAt, delivered%, cost credits, bulkId.
- “Create Campaign” wizard (multi-step dialog or page):
  Step A: Audience (list/segment/all, preview count)
  Step B: Message composer with:
    - Sender (default store name, editable)
    - Message textarea with placeholder insert menu: {First_Name}, {Last_Name}
    - Discount code insert (from Discounts page)
    - Live SMS preview card (phone mock)
    - Character count + estimated parts + estimated credits
    - Mandatory unsubscribe line preview (short link placeholder)
  Step C: Schedule/Send now + confirmation summary

5) Automations
- Automation cards for: Welcome, Abandoned Checkout (30min), Post-purchase.
- Each card: enable toggle, sender, message template, delay, last runs, delivered%, failed%.
- Edit automation modal: template editor + placeholder menu + test send UI.

6) Templates (global)
- Grid of template cards with example “smart metrics” displayed (Conversion Rate, CTR, AOV lift, etc).
- “Use template” action opens campaign wizard prefilled.

7) Discounts
- Discounts table: code, status, starts/ends, lastSyncedAt.
- “Sync from Shopify” button with loading state and success toast.

8) Billing & Credits
- Plan cards: Monthly (€40, 100 credits), Yearly (€240, 500 credits) + “Manage subscription”.
- Credits ledger table: date, type, amount, reference, note.
- Purchase credits module: quantity, price per credit (€0.045), total, CTA (disabled if no active subscription) + helper text.

9) Settings
- Store info (shop domain, default sender)
- Mitto settings form: trafficAccountId, API key (masked), “Test connection”
- Compliance settings: default unsubscribe text, link domain (optional)
- Webhooks status panel (placeholders)

COMPONENTS TO INCLUDE (reusable)
- StatusBadge (Draft/Scheduled/Sending/Completed/Failed + Delivered/Failed)
- CreditsPill
- PlaceholderInsertMenu
- SmsPreviewCard
- EmptyState & ErrorState components
- Skeletons for tables/cards

DATA / MOCKS
- Use typed mock data objects in each page for now (no backend calls).
- Make sure components accept props so I can wire real API later.

DELIVERABLE
- Return the full set of React components/pages for the app shell and all pages above.
- Keep file structure suggestions in comments at the top of each component (e.g., src/pages/Dashboard.tsx).
