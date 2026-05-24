# Dragons of Mugloar — Architecture Overview

## What is this project?

A single-page Vue 3 web application built on top of the [Dragons of Mugloar](https://dragonsofmugloar.com) public REST API. The player manages a dragon-for-hire business: pick up quests, earn gold and score, spend gold in the shop to restore lives, and survive until 1000 points to win.

---

## Tech Stack

| Layer | Choice | Why |
|---|---|---|
| Framework | **Vue 3** (Composition API) | Reactive UI with fine-grained control; `<script setup>` keeps components concise |
| State | **Pinia** | Official Vue store; setup-store style mirrors Composition API conventions; no boilerplate mutations |
| Routing | **Vue Router 4** | Official router; nested routes + navigation guards handle game-state gating cleanly |
| UI components | **shadcn-vue** | Copy-owned components (not a black-box npm package); fully customisable; built on reka-ui primitives |
| Styling | **Tailwind CSS v4** | Utility-first; v4 uses `@import "tailwindcss"` and `@theme` blocks instead of a config file |
| HTTP | **Native `fetch`** | The API is simple (6 endpoints, no auth); no need for Axios or a query library |
| Icons | **Lucide Vue** | Consistent icon set; tree-shakeable |
| Toasts | **vue-sonner** | shadcn-vue's recommended toast solution; zero-config, good defaults. Calls go directly to `toast.success()` / `toast.error()` from `vue-sonner` — no wrapper composable |
| Tests | **Vitest + @vue/test-utils + happy-dom** | Native Vite integration; fast; no separate Jest config |
| Language | **TypeScript** with `erasableSyntaxOnly: true` | No `enum` or `namespace` — only type-level syntax that erases at compile time |

---

## Folder Structure

```
src/
├── api/            # Thin fetch wrappers, one file per domain
│   ├── client.ts   # Base URL, error normalisation, JSON parsing
│   ├── game.ts     # startGame(), getReputation()
│   ├── messages.ts # getMessages(), solveMessage()
│   └── shop.ts     # getShop(), buyItem()
├── lib/
│   └── decrypt.ts  # base64 / rot13 decoding for encrypted quest ads
├── router/
│   └── index.ts    # Routes + beforeEnter guards
├── stores/         # Pinia stores, one per domain
│   ├── game.ts     # Source of truth for all player stats
│   ├── messages.ts # Quest ads + solve flow
│   ├── shop.ts     # Shop items + buy flow
│   └── reputation.ts
├── types/          # Shared TypeScript interfaces (no enums)
├── components/
│   ├── game/       # Domain components (AdCard, StatBar, ShopItemCard, …)
│   ├── layout/     # AppHeader, GameNav
│   └── ui/         # shadcn-vue generated components — do not edit manually
└── views/          # Route-level page components
```

---

## Key Design Decisions

### 1. Pinia setup stores (not options stores)
The setup-store style (`defineStore('id', () => { ... })`) mirrors how `<script setup>` works in components — same mental model, no separate `state()`/`actions()`/`getters()` blocks. The `game` store is the single source of truth for player stats; other stores call into it via `useGameStore()` rather than duplicating state.

### 2. Native fetch instead of Axios
All six API endpoints follow the same pattern (JSON in, JSON out, no auth headers). A single 20-line `apiRequest()` wrapper in `src/api/client.ts` handles the base URL, `Content-Type` header, and error normalisation. Adding Axios would be a dependency with no benefit at this scale.

### 3. Navigation guards for game-state gating
`/game/*` routes use a `beforeEnter` guard that redirects to `/` when no game is active. A user who pastes `/game/messages` into a fresh tab is always landed safely, without needing to check game state inside every component.

### 4. Encrypted quest ads decoded client-side
The API occasionally returns ads with `encrypted: 1` (base64) or `encrypted: 2` (rot13). Rather than filtering these out, we decode them client-side with a scramble animation in `AdCard.vue` — the player clicks "Decode" and watches the ciphertext resolve into readable text. The `adId` is also encoded and must be decoded before being sent to the solve API.

Implementation: `src/lib/decrypt.ts` — pure functions, no dependencies.

### 5. shadcn-vue "copy-owned" components
Unlike a traditional component library installed as a black-box npm package, shadcn-vue copies source files into `src/components/ui/`. This means full control over markup and styles, but also means those files should not be edited manually — regenerate via CLI to get updates. Custom components live in `src/components/game/` and `src/components/layout/`.

### 6. Tailwind CSS v4 + oklch color tokens
v4 moves configuration out of `tailwind.config.js` and into CSS. Theme tokens are declared in `src/style.css` via `@theme inline { }` and map to native CSS custom properties. All color tokens use the oklch color space — perceptually uniform, meaning equal numeric changes in lightness produce visually equal results regardless of hue.

### 7. TypeScript `erasableSyntaxOnly`
Set in `tsconfig.app.json`. Disallows `enum`, `namespace`, and parameter properties — constructs that require runtime transformation rather than pure type erasure. Keeps the TypeScript output predictable and compatible with modern tooling.

---

## Data Flow

```
User action (e.g. click Solve)
  → AdCard emits 'solve'
  → AdList calls messagesStore.solveAd(adId, router)
  → API: POST /:gameId/solve/:adId
  → gameStore.applyStats(result)   ← updates lives / gold / score / turn
  → gameStore.checkPhase(router)   ← navigates to /game-over if won or dead
  → messagesStore.fetchAds()       ← refreshes quest list
  → SolveResultBanner shows result
```

---

## Testing Strategy

Tests cover the pure logic layer (API client, stores, decrypt utility). Component rendering is not tested. The components are thin wrappers over
store state and shadcn-vue primitives, so the unit tests above cover the
logic that matters most.

| File | What's tested |
|---|---|
| `src/lib/decrypt.test.ts` | base64 and rot13 decoding, edge cases |
| `src/api/client.test.ts` | fetch wrapper: success, non-ok response, network error |
| `src/stores/game.test.ts` | start, applyStats, checkPhase (win/lose/playing), reset |
| `src/stores/messages.test.ts` | fetchAds, solveAd (success/failure/game-over nav), clearResult |
| `src/stores/shop.test.ts` | fetchItems, buy (success/failure) |
| `src/stores/reputation.test.ts` | fetch (success/failure/no-game guard) |
