# Phase 01 — Foundation

## Goal
Scaffold the Next.js 15 project with all dependencies installed and base config in place.

## Steps

### 1. Scaffold Next.js 15 app
```bash
npx create-next-app@latest . \
  --typescript \
  --tailwind \
  --app \
  --src-dir \
  --import-alias "@/*" \
  --no-eslint
```

### 2. Install core dependencies
```bash
npm install \
  @tanstack/react-query \
  react-hook-form \
  zod \
  @hookform/resolvers \
  zustand \
  axios \
  clsx \
  tailwind-merge \
  class-variance-authority \
  lucide-react \
  date-fns
```

### 3. Install shadcn/ui
```bash
npx shadcn@latest init
```
Choose: Default style, Neutral base color, CSS variables enabled.

### 4. Install shadcn/ui components (all at once)
```bash
npx shadcn@latest add \
  button input label badge card dialog drawer \
  dropdown-menu sheet tabs table form select \
  separator skeleton toast sonner avatar \
  alert progress scroll-area command popover \
  tooltip switch checkbox radio-group
```

### 5. Configure `tailwind.config.ts`
- Dark mode: `class`
- Extend colors for brand palette (primary, merchant accent, kitchen accent)

### 6. Set up path aliases in `tsconfig.json`
Verify `@/*` maps to `./src/*`.

### 7. Create base folder structure
```
src/
├── app/
│   ├── (customer)/
│   ├── (merchant)/
│   └── (kitchen)/
├── components/
│   ├── ui/
│   ├── common/
│   │   ├── layout/
│   │   ├── feedback/
│   │   ├── data-display/
│   │   └── forms/
│   ├── customer/
│   │   ├── menu/
│   │   ├── cart/
│   │   └── order/
│   ├── merchant/
│   │   ├── orders/
│   │   ├── menu/
│   │   ├── staff/
│   │   └── settings/
│   └── kitchen/
│       ├── ticket/
│       └── board/
├── hooks/
├── lib/
│   ├── api/
│   └── utils/
├── stores/
└── types/
```

### 8. Environment variables
Create `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000
```

## Done When
- `npm run dev` starts without errors
- All shadcn/ui components are importable
- Folder structure is in place
- `.env.local` is configured
