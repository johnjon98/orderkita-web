# Phase 09 — Kitchen Display System (KDS)

## Goal
Real-time kitchen display for kitchen staff. Shows active orders in a board view, updates instantly via WebSocket. Optimised for a wall-mounted tablet or monitor.

## Route
`src/app/(kitchen)/kitchen/`

## Access Control
- `kitchen_staff` only (redirect to login if not authenticated or wrong role)

## Data Sources
1. **Initial load**: `GET /api/v1/kitchen/orders/` — fetches pending/accepted/preparing/ready orders, oldest-first
2. **Real-time updates**: `ws://<host>/ws/kitchen/{merchant_id}/` — receives `order_event` messages on any state change
3. **Order transition**: `POST /api/v1/orders/<id>/transition/` — kitchen staff marks orders as ready or accepted

---

## Components (`src/components/kitchen/`)

### `kitchen/board/`

#### `KitchenBoard.tsx`
The main board layout. Displays orders in columns by status.
Props: none (reads from `useKitchenSocket` and `kitchenStore`)

Layout:
```
| Pending  | Accepted | Preparing | Ready |
|----------|----------|-----------|-------|
| Ticket   | Ticket   | Ticket    | Ticket|
| Ticket   | Ticket   |           |       |
```
- Each column is independently scrollable
- New tickets animate in (slide + fade)
- Tickets move between columns when status changes

#### `TicketColumn.tsx`
Single status column in the board.
Props: `status: OrderStatus`, `orders: Order[]`, `label: string`
- Column header with status label + count badge
- Scrollable list of `OrderTicket` components
- `EmptyState` variant ("No orders") when column is empty

#### `ConnectionStatus.tsx`
Top-right indicator showing WebSocket connection state.
Props: none (reads from `useKitchenSocket`)
- Green dot: "Live"
- Yellow dot: "Reconnecting..."
- Red dot: "Disconnected" + manual reconnect button
- Shown in `AppHeader` for kitchen layout

### `kitchen/ticket/`

#### `OrderTicket.tsx`
The main ticket card shown in the KDS board.
Props: `order: Order`, `onTransition: (status: OrderStatus) => void`, `isTransitioning: boolean`

Structure:
```
┌─────────────────────────┐
│ #A3B2  Table 5    14:30 │  ← order short ID, table, time
├─────────────────────────┤
│ 2x Nasi Lemak           │
│    + Extra Sambal       │
│    + Telur Goreng       │
│ 1x Teh Tarik            │
│    (no sugar)           │
├─────────────────────────┤
│ Note: Less spicy please │
├─────────────────────────┤
│  [Accept]  [Preparing]  │  ← context-sensitive action buttons
└─────────────────────────┘
```

- Age indicator: turns yellow after 5 min, red after 10 min
- Ticket border colour matches status colour token
- Large text for readability from a distance
- Action buttons only show valid next transitions

#### `TicketLineItem.tsx`
A single line item row within a ticket.
Props: `lineItem: OrderLineItem`
- Shows `{quantity}x {item_name}`
- Indented modifier list below (if any)

#### `TicketModifiers.tsx`
Renders the modifier list for a line item.
Props: `modifiers: SelectedModifier[]`
- Each modifier on its own line, indented with `+` prefix
- `+RM X.XX` shown only if `price_sen > 0`

#### `TicketAge.tsx`
Live-updating elapsed time indicator.
Props: `createdAt: string`
- Updates every minute
- Colour: grey < 5 min, amber 5–10 min, red > 10 min
- Shows "5m", "12m", "1h 3m" format

---

## WebSocket Protocol

Event received from `ws/kitchen/{merchant_id}/`:
```json
{
  "type": "order_event",
  "order": { ...full Order object... }
}
```

Handler logic in `useKitchenSocket`:
- If `order.status` is `pending/accepted/preparing/ready` → upsert into `kitchenStore`
- If `order.status` is `completed/cancelled` → remove from `kitchenStore`
- Reconnect with exponential backoff on disconnect (1s → 2s → 4s → max 30s)

---

## Kitchen Layout (`src/app/(kitchen)/kitchen/layout.tsx`)
- Minimal chrome: just `AppHeader` with merchant name + `ConnectionStatus`
- No sidebar — full width for the board
- Dark mode by default (easier on eyes in kitchen)
- Prevent screen sleep: `navigator.wakeLock.request('screen')` on mount

---

## Done When
- Kitchen board loads current active orders on first render
- New orders appear on board within 1s of being placed
- Status transitions via ticket buttons work and move ticket to correct column
- Tickets visually age (yellow → red) over time
- `ConnectionStatus` accurately reflects WebSocket state
- Board works on a 1024×768 tablet in landscape
