# Phase 08 — Merchant Dashboard

## Goal
Auth-gated desktop-first dashboard for merchant owners and staff to manage orders, menu, staff, and settings.

## Route
`src/app/(merchant)/dashboard/`

## Sub-routes
```
/dashboard                    → redirect to /dashboard/orders
/dashboard/orders             → live order list
/dashboard/orders/[id]        → order detail
/dashboard/menu               → menu editor (categories + items)
/dashboard/menu/items/new     → create menu item
/dashboard/menu/items/[id]    → edit menu item
/dashboard/staff              → staff list + invite
/dashboard/settings           → store settings, SST, hours
```

## Access Control
- `merchant_owner`: full access
- `merchant_staff`: orders only (menu/staff/settings tabs hidden)

---

## Components (`src/components/merchant/`)

### `merchant/orders/`

#### `OrderTable.tsx`
Full order list with status filter tabs and pagination.
Props: `orders: Order[]`, `isLoading: boolean`, `onSelect: (order) => void`
- Tabs: All | Pending | Accepted | Preparing | Ready | Completed
- Columns: Order ID (short), Table, Items count, Total, Status, Time
- Rows are clickable → opens `OrderDetailPanel`
- Auto-refreshes every 30s via `useOrders`

#### `OrderCard.tsx`
Compact card view of a single order (alternative to table row on smaller screens).
Props: `order: Order`, `onClick: () => void`
- Shows: table number, item count, total, status badge, time ago

#### `OrderDetailPanel.tsx`
Right-side panel (Sheet) with full order detail.
Props: `order: Order | null`, `open: boolean`, `onClose: () => void`
- Line items with modifier details and prices
- Status history timeline using `status_logs`
- `TransitionButton` group at the bottom

#### `TransitionButton.tsx`
Renders the correct action buttons based on current order status.
Props: `order: Order`, `onTransition: (status: OrderStatus) => void`, `isLoading: boolean`
- `pending` → "Accept Order" + "Cancel"
- `accepted` → "Start Preparing" + "Cancel"
- `preparing` → "Mark Ready"
- `ready` → "Complete Order"
- `completed` / `cancelled` → no buttons

#### `OrderStatusFilter.tsx`
Tab bar to filter orders by status.
Props: `active: OrderStatus | 'all'`, `onChange`, `counts: Record<string, number>`

### `merchant/menu/`

#### `MenuItemTable.tsx`
Table of all menu items for a merchant with edit/delete actions.
Props: `items: MenuItem[]`, `isLoading: boolean`
- Columns: Image thumbnail, Name, Category, Price, Available toggle, Actions
- `Switch` for `is_available` — updates inline without navigating away
- Edit → navigates to `/dashboard/menu/items/[id]`
- Delete → confirmation dialog

#### `MenuItemForm.tsx`
Create/edit form for a menu item.
Props: `item?: MenuItem` (undefined = create mode), `categories: Category[]`, `onSuccess: () => void`
- Fields: name, description, category, price (in RM — converted to sen on submit), image upload, preparation time, is_available
- `ModifierGroupForm` embedded below for managing modifier groups

#### `CategoryList.tsx`
Draggable list of categories with add/edit/delete.
Props: `categories: Category[]`, `onReorder: (ids: UUID[]) => void`
- Inline edit of category name
- Delete with confirmation
- Add new category inline

#### `ModifierGroupForm.tsx`
Manage modifier groups and their modifiers for a menu item.
Props: `menuItemId: UUID`, `groups: ModifierGroup[]`
- Add/remove groups
- Per group: name, required toggle, min/max selects
- Per modifier: name, price (RM), available toggle

#### `ImageUploader.tsx`
Drag-and-drop image upload with preview.
Props: `currentUrl?: string`, `placeholder?: string`, `onUpload: (file: File) => void`, `isUploading: boolean`
- Shows blurred placeholder while uploading
- Previews uploaded image immediately
- Accepts JPG/PNG, warns on files > 5MB

### `merchant/staff/`

#### `StaffTable.tsx`
List of current merchant staff members.
Props: `staff: User[]`, `isLoading: boolean`, `onRemove: (userId) => void`
- Columns: Name, Email, Role, Joined, Actions
- Remove button with confirmation

#### `InviteStaffForm.tsx`
Form to invite a new staff member.
Props: `onSuccess: () => void`
- Fields: email, full name, role (staff or kitchen)
- On submit: `POST /api/v1/users/staff/invite/`

### `merchant/settings/`

#### `StoreSettingsForm.tsx`
Edit merchant business details.
Props: `merchant: Merchant`, `onSuccess: () => void`
- Fields: business name, address, city, state (dropdown), postcode, phone

#### `SSTToggle.tsx`
Enable/disable SST and set the rate.
Props: `enabled: boolean`, `rateBps: number`, `onChange: (enabled, rateBps) => void`
- Switch to toggle SST
- Number input for rate (shows as %, converts to basis points)
- Shows current effective rate: "6% SST" or "Disabled"

#### `OperatingHoursEditor.tsx`
Day-by-day operating hours editor.
Props: `hours: OperatingHours`, `onChange: (hours) => void`
- Toggle each day on/off
- Time pickers for open/close per active day

---

## Page Layout

Shared merchant layout (`src/app/(merchant)/dashboard/layout.tsx`):
- `AppSidebar` (desktop) with nav: Orders, Menu, Staff, Settings
- `AppHeader` with merchant name, user avatar, logout
- Mobile: `MobileNav` bottom tabs

## Done When
- Merchant owner can log in and see the dashboard
- Orders list updates every 30s and can be filtered by status
- Order transitions work and optimistically update the UI
- Menu items can be created, edited, deleted
- Image upload works (async, shows loading state)
- Staff invite sends and new staff appears in list
- SST toggle updates and persists
