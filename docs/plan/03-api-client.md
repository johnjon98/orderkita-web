# Phase 03 — API Client

## Goal
A typed, centralized API client that all hooks and components use. No raw `fetch` or `axios` calls outside of `lib/api/`.

## Files to Create

### `src/lib/api/base.ts`
The foundation. Handles:
- Base URL from `NEXT_PUBLIC_API_URL`
- Attaches `Authorization: Bearer <token>` header automatically
- Unwraps `{ data: T }` response shape
- Throws typed `ApiError` on error responses
- Refreshes access token on 401 using refresh token (silent refresh)

```ts
// Key exports:
export const apiClient = {
  get<T>(url: string, params?: Record<string, string>): Promise<T>
  post<T>(url: string, body?: unknown): Promise<T>
  patch<T>(url: string, body?: unknown): Promise<T>
  delete<T>(url: string): Promise<T>
}
```

### `src/lib/api/auth.ts`
```ts
login(email, password)         → AuthTokens
register(payload)              → { user: User; tokens: AuthTokens }
refresh(refreshToken)          → AuthTokens
logout(refreshToken)           → void
createCustomerSession(slug)    → { session_id: string }
requestPasswordReset(email)    → void
confirmPasswordReset(payload)  → void
```

### `src/lib/api/menus.ts`
```ts
getPublicMenu(slug)            → PublicMenu
listCategories(params?)        → PaginatedResponse<Category>
createCategory(payload)        → Category
updateCategory(id, payload)    → Category
deleteCategory(id)             → void
listMenuItems(params?)         → PaginatedResponse<MenuItem>
getMenuItem(id)                → MenuItem
createMenuItem(payload)        → MenuItem
updateMenuItem(id, payload)    → MenuItem
deleteMenuItem(id)             → void
uploadMenuItemImage(id, file)  → { image_url: string }
createModifierGroup(payload)   → ModifierGroup
updateModifierGroup(id, p)     → ModifierGroup
deleteModifierGroup(id)        → void
createModifier(payload)        → Modifier
updateModifier(id, payload)    → Modifier
deleteModifier(id)             → void
```

### `src/lib/api/orders.ts`
```ts
placeOrder(slug, payload)      → Order
getOrderStatus(id)             → { status: OrderStatus }
listOrders(params?)            → PaginatedResponse<Order>
getOrder(id)                   → Order
transitionOrder(id, payload)   → Order
```

### `src/lib/api/merchants.ts`
```ts
getMerchantPublic(slug)        → Merchant
getMerchantMe()                → Merchant
updateMerchantMe(payload)      → Merchant
getMerchantSettings()          → MerchantSettings
updateMerchantSettings(p)      → MerchantSettings
listStores()                   → Store[]
createStore(payload)           → Store
updateStore(id, payload)       → Store
deleteStore(id)                → void
listStaff()                    → User[]
inviteStaff(payload)           → User
```

### `src/lib/api/kitchen.ts`
```ts
listKitchenOrders()            → Order[]
```

## Done When
- Every API call in the app goes through one of these modules
- All functions are fully typed (input + output)
- Token refresh is handled transparently in `base.ts`
- No `any` types
