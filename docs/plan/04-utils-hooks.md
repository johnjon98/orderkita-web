# Phase 04 — Utils & Hooks

## Goal
Utility functions and custom React hooks that components and pages consume. No business logic in components — it lives here.

---

## Utils (`src/lib/utils/`)

### `src/lib/utils/cn.ts`
Merges Tailwind classes safely (clsx + tailwind-merge).
```ts
export function cn(...inputs: ClassValue[]): string
```

### `src/lib/utils/currency.ts`
All price formatting. The only place sen→RM conversion happens.
```ts
export function formatPrice(sen: number): string          // "RM 12.50"
export function formatPriceCompact(sen: number): string   // "12.50"
export function senToRm(sen: number): number              // 12.5
export function rmToSen(rm: number): number               // 1250
```

### `src/lib/utils/datetime.ts`
UTC→local conversion and display formatting.
```ts
export function formatDateTime(utcString: string): string  // "13 Apr 2026, 2:30 PM"
export function formatTime(utcString: string): string      // "2:30 PM"
export function formatDate(utcString: string): string      // "13 Apr 2026"
export function timeAgo(utcString: string): string         // "3 minutes ago"
```

### `src/lib/utils/order.ts`
Order-specific display helpers.
```ts
export function getStatusLabel(status: OrderStatus): string
// "Pending" | "Accepted" | "Preparing" | "Ready" | "Completed" | "Cancelled"

export function getStatusColor(status: OrderStatus): string
// Tailwind color class for each status

export function getAllowedTransitions(status: OrderStatus): OrderStatus[]
// e.g. 'accepted' → ['preparing', 'cancelled']
```

---

## Hooks (`src/hooks/`)

### `src/hooks/useAuth.ts`
Reads JWT from storage, decodes claims, exposes user state.
```ts
const { user, role, merchantId, isAuthenticated, login, logout } = useAuth()
```

### `src/hooks/useCart.ts`
Wraps the Zustand cart store with computed values.
```ts
const {
  items,
  addItem,
  removeItem,
  updateQuantity,
  clearCart,
  totalSen,
  itemCount,
} = useCart()
```

### `src/hooks/useMenu.ts`
Fetches and caches public menu via TanStack Query.
```ts
const { menu, isLoading, error } = useMenu(slug)
```

### `src/hooks/useOrders.ts`
Merchant order list with filtering + polling.
```ts
const { orders, isLoading, refetch } = useOrders({ status?, page? })
```

### `src/hooks/useOrder.ts`
Single order detail.
```ts
const { order, isLoading, transition } = useOrder(orderId)
```

### `src/hooks/useOrderStatus.ts`
Customer-facing order status polling (every 5s until completed/cancelled).
```ts
const { status, isLoading } = useOrderStatus(orderId)
```

### `src/hooks/useKitchenSocket.ts`
Manages WebSocket connection to `ws://<host>/ws/kitchen/{merchantId}/`.
```ts
const { orders, connectionStatus } = useKitchenSocket(merchantId)

// connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error'
// orders: Order[] — kept in sync with real-time events
// Handles reconnection with exponential backoff
// Merges incoming order_event messages into local order list
```

### `src/hooks/useMerchant.ts`
Current merchant profile.
```ts
const { merchant, isLoading, update } = useMerchant()
```

---

## Stores (`src/stores/`)

### `src/stores/authStore.ts` (Zustand)
```ts
{
  accessToken: string | null
  refreshToken: string | null
  user: User | null
  setTokens(tokens: AuthTokens): void
  setUser(user: User): void
  clear(): void
}
```

### `src/stores/cartStore.ts` (Zustand)
```ts
{
  items: CartItem[]
  merchantSlug: string | null
  addItem(item: CartItem): void
  removeItem(menuItemId: UUID): void
  updateQuantity(menuItemId: UUID, qty: number): void
  clearCart(): void
}
```
- Persisted to `localStorage` via Zustand `persist` middleware
- Clears automatically when `merchantSlug` changes (new QR scan)

### `src/stores/kitchenStore.ts` (Zustand)
```ts
{
  orders: Order[]
  setOrders(orders: Order[]): void
  upsertOrder(order: Order): void    // insert or update by id
  removeOrder(orderId: UUID): void
}
```

## Done When
- All utils are tested with edge cases (e.g. `formatPrice(0)`, `formatPrice(150)`)
- All hooks are typed and return consistent `{ data, isLoading, error }` shapes
- Zustand stores are wired with correct TypeScript generics
