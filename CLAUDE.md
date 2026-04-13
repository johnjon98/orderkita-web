# OrderKita Web — Claude Guidelines

## Project Overview

Frontend web app for OrderKita — a QR-based food ordering system for the Malaysian market.
Consumes the Django REST Framework backend at `order-kita/`.

Three apps in one codebase:
- **Customer Menu** — public, mobile-first, QR scan entry point
- **Merchant Dashboard** — auth-gated, order & menu management
- **KDS (Kitchen Display System)** — auth-gated, real-time WebSocket board for kitchen staff

---

## Stack

| Layer | Choice |
|---|---|
| Framework | Next.js 15 (React, App Router, TypeScript) |
| Styling | Tailwind CSS |
| Components | shadcn/ui (Radix UI primitives) |
| Server state | TanStack Query (`@tanstack/react-query`) |
| Forms | React Hook Form + Zod |
| Global state | Zustand |
| WebSocket | Native browser WebSocket (KDS only) |

---

## Folder Structure

```
src/
├── app/
│   ├── (customer)/
│   │   └── menu/[slug]/        ← customer menu (public, mobile-first)
│   ├── (merchant)/
│   │   └── dashboard/          ← merchant dashboard (auth-gated)
│   └── (kitchen)/
│       └── kitchen/            ← KDS (auth-gated, WebSocket)
├── components/
│   ├── ui/                     ← shadcn/ui primitives (Button, Input, Badge, Card, Dialog…)
│   ├── common/                 ← shared across 2+ apps (see rule below)
│   │   ├── layout/
│   │   ├── feedback/
│   │   ├── data-display/
│   │   └── forms/
│   ├── customer/               ← customer menu only
│   │   ├── menu/
│   │   ├── cart/
│   │   └── order/
│   ├── merchant/               ← merchant dashboard only
│   │   ├── orders/
│   │   ├── menu/
│   │   ├── staff/
│   │   └── settings/
│   └── kitchen/                ← KDS only
│       ├── ticket/
│       └── board/
├── hooks/                      ← useCart, useOrders, useKitchenSocket, useAuth, useMenu
├── lib/
│   ├── api/                    ← typed API client (base.ts + domain modules)
│   └── utils/                  ← currency.ts, datetime.ts, cn.ts
├── stores/                     ← Zustand stores (auth, cart, kitchen)
└── types/                      ← TypeScript types mirroring backend models
```

---

## Rule: The `common/` Promotion Rule

> **If a component is used by more than one app folder (`customer/`, `merchant/`, `kitchen/`), it must live in `common/`. No exceptions.**

### How to apply this rule

1. **Starting out** — build the component in whichever app folder needs it first.
2. **Second usage detected** — before copy-pasting, stop. Move the component to the appropriate `common/` subfolder, update both import paths, then use it from there.
3. **Refactoring existing code** — if you notice a component duplicated across app folders, consolidate it into `common/` as part of that PR.

### `common/` subfolders

| Folder | What goes here |
|---|---|
| `common/layout/` | Headers, sidebars, page wrappers, nav — shared shell UI |
| `common/feedback/` | LoadingSpinner, EmptyState, ErrorState, Toast — shared UX states |
| `common/data-display/` | StatusBadge, PriceDisplay, TimestampLabel — business-aware display components |
| `common/forms/` | FormField, FormSection, SubmitButton — shared form scaffolding |

### The distinction between `ui/` and `common/`

- `ui/` — raw primitives with **no business logic** (a Button is just a button)
- `common/` — knows about the **business domain** (a StatusBadge knows what `preparing` means) but is not specific to one app
- `customer/`, `merchant/`, `kitchen/` — fully app-specific, single owner

---

## Backend Notes

- All prices are in **sen** (integers). `100 sen = RM 1.00`. Never use floats.
- Use `formatPrice(sen)` from `lib/utils/currency.ts` for all price display.
- All timestamps are **UTC** from the backend. Convert to local time in the UI.
- API base: `/api/v1/`
- Auth: JWT. Tokens carry `user_id`, `role`, `merchant_id` claims.
- WebSocket: `ws://<host>/ws/kitchen/{merchant_id}/` — read-only event stream.

### API response shapes

```ts
// Success (detail)
{ data: T }

// Success (list)
{ data: T[], meta: { page, page_size, total_count, total_pages } }

// Error
{ error: { code: string, message: string } }
```

### Order statuses (state machine — no skipping steps)

```
pending → accepted → preparing → ready → completed
                ↘ cancelled (from any active state)
```

---

## Roles

| Role | Access |
|---|---|
| `customer` | Customer menu only (anonymous session) |
| `merchant_owner` | Full merchant dashboard |
| `merchant_staff` | Order management in dashboard |
| `kitchen_staff` | KDS only |
