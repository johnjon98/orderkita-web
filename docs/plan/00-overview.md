# OrderKita Web — Implementation Plan Overview

## Phases

| # | Phase | Description |
|---|---|---|
| 01 | [Foundation](./01-foundation.md) | Scaffold, dependencies, project config |
| 02 | [Types](./02-types.md) | TypeScript types mirroring backend models |
| 03 | [API Client](./03-api-client.md) | Typed fetch wrapper + domain modules |
| 04 | [Utils & Hooks](./04-utils-hooks.md) | Utilities and custom React hooks |
| 05 | [UI Primitives](./05-ui-primitives.md) | shadcn/ui base components |
| 06 | [Common Components](./06-common-components.md) | Shared layout, feedback, data-display, forms |
| 07 | [Customer App](./07-customer-app.md) | Menu browsing, cart, order placement, status tracking |
| 08 | [Merchant Dashboard](./08-merchant-dashboard.md) | Order management, menu editor, staff, settings |
| 09 | [KDS](./09-kds.md) | Real-time kitchen display via WebSocket |
| 10 | [Pages & Layouts](./10-pages-layouts.md) | Route groups, layouts, providers, middleware |

## Build Order Rationale

Each phase depends on the one before it:
- Types are needed before the API client can be typed
- The API client is needed before hooks can call it
- Hooks and utils are needed before components can consume them
- `ui/` primitives are needed before `common/` components compose them
- `common/` is needed before app-specific components extend it
- All components are needed before pages wire them together

## Key Constraints

- All prices in **sen** (integers). `RM 1.00 = 100 sen`.
- All timestamps **UTC** from backend — always convert for display.
- Order state machine is strict — no skipping transitions.
- JWT claims carry `role` and `merchant_id` — use these for route guards.
- WebSocket at `ws://<host>/ws/kitchen/{merchant_id}/` is **read-only**.
