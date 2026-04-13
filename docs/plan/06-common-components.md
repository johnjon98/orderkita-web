# Phase 06 — Common Components

## Goal
Build all components shared across 2 or more of the three apps (customer, merchant, kitchen).
See `common/` promotion rule in `CLAUDE.md`.

## Location
`src/components/common/`

---

## `common/layout/`

### `AppHeader.tsx`
Top navigation bar. Used by merchant dashboard and KDS.
Props: `title`, `subtitle?`, `actions?` (slot for buttons), `user?`

### `AppSidebar.tsx`
Left sidebar navigation for merchant dashboard.
Props: `navItems: NavItem[]`, `activePath`

### `MobileNav.tsx`
Bottom tab navigation for mobile views (customer menu, possibly merchant mobile).
Props: `tabs: TabItem[]`, `activeTab`

### `PageWrapper.tsx`
Consistent page padding and max-width container.
Props: `children`, `className?`

### `SectionHeader.tsx`
Page section heading with optional subtitle and action button.
Props: `title`, `subtitle?`, `action?`

---

## `common/feedback/`

### `LoadingSpinner.tsx`
Centered spinner. Three sizes: `sm`, `md`, `lg`.
Props: `size?`, `className?`

### `LoadingPage.tsx`
Full-page loading state (used while auth is initialising).

### `EmptyState.tsx`
Illustration + message when a list is empty.
Props: `title`, `description?`, `action?` (e.g. "Create your first item" button)
Used in: order list (merchant), KDS board (no active orders), menu editor (no items)

### `ErrorState.tsx`
Error message + retry button.
Props: `title?`, `message`, `onRetry?`

### `ErrorBoundary.tsx`
React error boundary wrapper for catching render errors.

---

## `common/data-display/`

### `StatusBadge.tsx`
Renders an `OrderStatus` as a coloured badge.
```tsx
<StatusBadge status="preparing" />
// → purple badge "Preparing"
```
Props: `status: OrderStatus`, `size?: 'sm' | 'md'`
Uses status color tokens from `tailwind.config.ts`.

### `PriceDisplay.tsx`
Formats a sen value to RM display. Never accepts floats.
```tsx
<PriceDisplay sen={1250} />        // → "RM 12.50"
<PriceDisplay sen={0} label="Free" /> // → "Free"
```
Props: `sen: number`, `label?: string`, `className?`

### `TimestampLabel.tsx`
Displays a UTC timestamp as local time with tooltip showing full date.
```tsx
<TimestampLabel utc="2026-04-13T06:00:00Z" />
// → "2:00 PM" with tooltip "13 Apr 2026, 2:00 PM"
```
Props: `utc: string`, `format?: 'time' | 'date' | 'datetime' | 'relative'`

### `OrderStatusChip.tsx`
Compact inline status indicator (dot + label). More compact than StatusBadge.
Props: `status: OrderStatus`

---

## `common/forms/`

### `FormField.tsx`
Wraps React Hook Form's `FormField` + `FormItem` + `FormLabel` + `FormMessage` into one reusable block.
Props: `name`, `label`, `children` (the actual input), `description?`

### `FormSection.tsx`
Groups related form fields under a heading with a subtle border.
Props: `title`, `description?`, `children`

### `SubmitButton.tsx`
Submit button that shows loading state while form is submitting.
Props: `isLoading`, `label`, `loadingLabel?`

### `SearchInput.tsx`
Debounced search input with clear button.
Props: `value`, `onChange`, `placeholder?`, `debounceMs?` (default 300)

---

## Done When
- All components render without errors in isolation
- `StatusBadge` covers all 6 order statuses with correct colours
- `PriceDisplay` correctly formats `0`, `100`, `1050`, `10000`
- `EmptyState` and `ErrorState` accept all required props
- `FormField` integrates with React Hook Form without type errors
