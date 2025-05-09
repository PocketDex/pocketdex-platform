# PocketDex Monorepo — Cursor Init Prompt

This workspace is a Turborepo monorepo for the PocketDex project — a companion platform for Pokémon TCG Pocket tournaments with shared web and mobile codebases.

---

## 🧱 Folder Structure

```
pocketdex/
├── apps/
│   ├── web/          # Vite + React (Landing + Dashboard)
│   └── mobile/       # Expo + React Native
├── packages/
│   ├── ui/           # Shared UI components
│   ├── utils/        # Shared logic
│   ├── hooks/        # Shared custom hooks
│   └── types/        # Shared TypeScript types
```

---

## ⚙️ Initial Setup

### 1. Create GitHub Repo

Create: `https://github.com/PocketDex/pocketdex`

Then clone into your local dev environment or Cursor:

```bash
git clone https://github.com/PocketDex/pocketdex.git
cd pocketdex
pnpm install
```

### 2. Run Apps

Start dev servers:

```bash
pnpm dev --filter=web
pnpm dev --filter=mobile
```

---

## 🚀 Vercel Deployment

- Project: `apps/web`
- Build Command: `pnpm build --filter=web`
- Output Directory: `apps/web/dist`
- Add `.env` to Vercel for Supabase keys

---

## 🧠 Notes

- Web = Vite + Tailwind + React
- Mobile = Expo (React Native)
- Shared logic via `react-native-web`
- Zustand + TanStack Query used across both
- Designed to support shared tournament experience + custom UI (Pokédex-style)