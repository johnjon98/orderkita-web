# Phase 07 — Customer App

## Goal
Public-facing mobile-first menu and ordering experience. Accessed via QR code scan at a table. No login required — uses anonymous session.

## Route
`src/app/(customer)/menu/[slug]/`

## User Flow
1. Customer scans QR code → lands on `/menu/<slug>`
2. Anonymous session created via `POST /api/v1/auth/customer/session/`
3. Menu loaded via `GET /api/v1/menu/<slug>/`
4. Customer browses categories, taps item → selects modifiers → adds to cart
5. Customer reviews cart → places order → sees order status tracker

---

## Components (`src/components/customer/`)

### `customer/menu/`

#### `CategoryNav.tsx`
Horizontal sticky scrollable tab bar for categories.
Props: `categories: Category[]`, `activeId: UUID`, `onSelect: (id) => void`
- Sticks to top on scroll
- Highlights active category
- Smooth scroll to category section

#### `MenuItemCard.tsx`
Menu item display card. Tappable to open detail.
Props: `item: MenuItem`, `onTap: (item) => void`
- Shows image (with blur placeholder while loading), name, description (truncated), price
- Greyed out + "Unavailable" overlay when `is_available: false`
- Badge showing modifier count if item has required modifiers

#### `MenuItemDrawer.tsx`
Bottom sheet (Sheet component) that opens when an item is tapped.
Props: `item: MenuItem | null`, `open: boolean`, `onClose: () => void`
- Scrollable content: full image, name, description, price
- Renders `ModifierSelector` for each modifier group
- Quantity selector
- "Add to cart" CTA (disabled until required modifiers selected)

#### `ModifierSelector.tsx`
Renders a single modifier group — radio (single select) or checkbox (multi-select).
Props: `group: ModifierGroup`, `selected: UUID[]`, `onChange: (ids: UUID[]) => void`
- Uses `RadioGroup` or `Checkbox` from shadcn/ui based on `max_select`
- Shows `+RM X.XX` price label on each modifier (hidden if `price_sen === 0`)
- Required groups show "(Required)" label
- Validation: "Add to cart" blocked until all required groups have selection

#### `MenuSection.tsx`
Full section for one category — heading + grid of `MenuItemCard`.
Props: `category: MenuCategory`, `id: string` (for scroll anchor)

### `customer/cart/`

#### `CartButton.tsx`
Floating action button showing item count + total. Fixed to bottom of screen.
Props: `itemCount: number`, `totalSen: number`, `onClick: () => void`
- Hidden when cart is empty
- Animates in when first item added

#### `CartDrawer.tsx`
Bottom sheet showing the full cart.
Props: `open: boolean`, `onClose: () => void`
- Lists all `CartItem` components
- Shows subtotal, SST (if applicable), total
- "Place Order" CTA → triggers order placement

#### `CartItem.tsx`
Single cart line item with modifier summary and quantity controls.
Props: `item: CartItem`, `onRemove: () => void`, `onQuantityChange: (qty) => void`
- Shows item name, selected modifiers as comma-separated list, line total
- +/- quantity controls, remove button

#### `CartSummary.tsx`
Price breakdown at the bottom of the cart.
Props: `subtotalSen: number`, `sstSen: number`, `totalSen: number`
- Uses `PriceDisplay` for all amounts
- Shows SST line only if `sstSen > 0`

### `customer/order/`

#### `OrderPlacedScreen.tsx`
Full-screen confirmation shown immediately after order is placed.
Props: `order: Order`, `onTrackOrder: () => void`
- Shows order ID (short), table number, items summary
- "Track your order" button

#### `OrderStatusTracker.tsx`
Live order status display. Polls `GET /orders/<id>/status/` every 5s.
Props: `orderId: UUID`
- Step indicator: Pending → Accepted → Preparing → Ready
- Each step shows timestamp when it was reached (from `status_logs`)
- "Your order is ready!" celebratory state when status = `ready`
- If `cancelled`, shows reason and apologetic message
- Uses `useOrderStatus` hook internally

#### `OrderNoteInput.tsx`
Optional text input for order notes at checkout.
Props: `value: string`, `onChange: (v: string) => void`

---

## Page: `src/app/(customer)/menu/[slug]/page.tsx`

```
Layout:
- Top: merchant name/logo (from menu data)
- Sticky: CategoryNav
- Body: scroll through MenuSection per category
- Fixed bottom: CartButton (when cart has items)
```

State managed by:
- `useMenu(slug)` — menu data
- `useCart()` — cart items
- Local state for open drawer + selected item

## Done When
- Customer can browse full menu, select modifiers, add to cart
- Cart persists if page is refreshed (Zustand persist)
- Customer can place order and see status tracker update in real time
- Unavailable items are non-interactive
- Mobile viewport (375px) renders without horizontal scroll
