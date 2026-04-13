# Phase 10 — Pages, Layouts & Providers

## Goal
Wire all components together into working pages with proper layouts, route protection, and global providers.

---

## Global Providers (`src/app/layout.tsx`)

Root layout wraps everything with:
```tsx
<QueryClientProvider client={queryClient}>   // TanStack Query
  <Toaster />                                // Sonner toast notifications
  {children}
</QueryClientProvider>
```

---

## Route Groups & Layouts

### Customer Layout (`src/app/(customer)/layout.tsx`)
- Minimal layout — no header chrome
- No auth required
- Loads customer session from `sessionStorage` (not auth store)

### Merchant Layout (`src/app/(merchant)/layout.tsx`)
- Auth guard: redirect to `/login` if no valid token or wrong role
- Roles allowed: `merchant_owner`, `merchant_staff`
- Desktop: `AppSidebar` + `AppHeader`
- Mobile: `AppHeader` + `MobileNav`

### Kitchen Layout (`src/app/(kitchen)/layout.tsx`)
- Auth guard: redirect to `/login` if no valid token or wrong role
- Roles allowed: `kitchen_staff`
- Minimal: `AppHeader` with `ConnectionStatus` only
- Forces dark mode class on `<html>`
- On mount: request wake lock to prevent screen sleep

---

## Pages

### `/menu/[slug]` — Customer Menu
File: `src/app/(customer)/menu/[slug]/page.tsx`
```
- Calls useMenu(slug) on mount
- Creates anonymous session on first load
- Renders: CategoryNav + MenuSection list + CartButton
- Opens: MenuItemDrawer on item tap
- Opens: CartDrawer on CartButton tap
- After order placed: shows OrderPlacedScreen → OrderStatusTracker
```

### `/dashboard` → redirect to `/dashboard/orders`
File: `src/app/(merchant)/dashboard/page.tsx`

### `/dashboard/orders` — Order List
File: `src/app/(merchant)/dashboard/orders/page.tsx`
```
- Renders OrderTable
- Opens OrderDetailPanel on row click
- Polls every 30s
```

### `/dashboard/orders/[id]` — Order Detail
File: `src/app/(merchant)/dashboard/orders/[id]/page.tsx`
```
- Full-page order detail (fallback for mobile where panel doesn't fit)
- Same content as OrderDetailPanel
```

### `/dashboard/menu` — Menu Editor
File: `src/app/(merchant)/dashboard/menu/page.tsx`
```
- Two-column layout: CategoryList (left) + MenuItemTable (right, filtered by active category)
- "New Item" button → navigates to /dashboard/menu/items/new
```

### `/dashboard/menu/items/new` — Create Menu Item
File: `src/app/(merchant)/dashboard/menu/items/new/page.tsx`
```
- Renders MenuItemForm in create mode
- On success: redirect to /dashboard/menu
```

### `/dashboard/menu/items/[id]` — Edit Menu Item
File: `src/app/(merchant)/dashboard/menu/items/[id]/page.tsx`
```
- Fetches item by ID
- Renders MenuItemForm in edit mode
- On success: redirect to /dashboard/menu
```

### `/dashboard/staff` — Staff Management
File: `src/app/(merchant)/dashboard/staff/page.tsx`
```
- Renders StaffTable + InviteStaffForm (in a Sheet)
- Owner only — redirect merchant_staff away
```

### `/dashboard/settings` — Settings
File: `src/app/(merchant)/dashboard/settings/page.tsx`
```
- Tabs: Business Info | SST | Operating Hours | Stores
- Each tab renders its respective form component
- Owner only
```

### `/kitchen` — KDS Board
File: `src/app/(kitchen)/kitchen/page.tsx`
```
- Calls useKitchenSocket(merchantId) on mount
- Renders KitchenBoard
- Shows ConnectionStatus in header
```

### `/login` — Login Page
File: `src/app/login/page.tsx`
```
- Email + password form
- On success: decodes JWT role → redirects to correct app
  - merchant_owner / merchant_staff → /dashboard
  - kitchen_staff → /kitchen
  - Others → error message
```

---

## Middleware (`src/middleware.ts`)

```
/dashboard/* → requires valid JWT with role: merchant_owner | merchant_staff
/kitchen/*   → requires valid JWT with role: kitchen_staff
/menu/*      → public, no auth required
/login       → redirect to dashboard if already authenticated
```

Token read from `localStorage` (client-side) via a thin server-compatible check.

---

## Error Handling Strategy

- Network errors → `ErrorState` component with retry
- 401 Unauthorized → clear tokens → redirect to `/login`
- 403 Forbidden → show `ErrorState` ("You don't have access to this")
- 404 Not Found → Next.js `not-found.tsx` per route group
- Unhandled render errors → `ErrorBoundary` wrapper

---

## Done When
- All three apps accessible at correct routes
- Auth redirects work correctly for all roles
- Login routes to the right app based on role
- Merchant layout shows sidebar on desktop, bottom nav on mobile
- Kitchen forces dark mode
- Global toast notifications work across all apps
- 404 and error pages render correctly
