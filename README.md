# Polar Finance — Wealth Curator

Personal finance dashboard with AI-driven insights, portfolio analytics, spending breakdowns, and budget intelligence. Built with Expo Router targeting iOS, Android, and web.

## Quick Start

```bash
npm install
npx expo start        # dev server
npm run ios           # iOS simulator
npm run android       # Android emulator
npm run web           # web dev server

npm run lint          # expo lint
npx tsc --noEmit      # typecheck
```

## Project Structure

```
polar-finance/
├── app/                    # Expo Router file-based routes
│   ├── _layout.tsx         # Root Stack layout + ThemeProvider
│   ├── (tabs)/             # Tab group (Dashboard, Insights, Budgets)
│   │   ├── _layout.tsx     # Tab shell with sidebar, PageTracker
│   │   ├── index.tsx       # Dashboard
│   │   ├── insights.tsx    # Portfolio analytics
│   │   └── budgets.tsx     # Budget intelligence
│   ├── modal.tsx           # Modal presentation
│   └── api/                # Reserved for API routes
├── components/             # UI components
│   ├── budgets/            # Budget-specific cards
│   ├── dashboard/          # Dashboard widgets
│   ├── insights/           # Analytics components
│   ├── ui/                 # Reusable primitives (IconSymbol, Collapsible)
│   ├── parallax-scroll-view.tsx
│   ├── themed-text.tsx
│   └── themed-view.tsx
├── hooks/                  # Custom React hooks
├── constants/              # Theme tokens, mock data, search index
└── assets/                 # Images, fonts, icons
```

---

## Architecture Decisions

### File-Based Routing

Expo Router uses the filesystem as the URL graph. The root `Stack` wraps a tab group, enabling both modal presentations and tab navigation from a single tree:

```
Stack
└── Tabs (anchor: '(tabs)')
    ├── Dashboard (/)
    ├── Insights (/insights)
    └── Budgets (/budgets)
```

Deep linking to a specific tab requires `unstable_settings = { anchor: '(tabs)' }` in the root layout — without it, the tab group is not resolved as the navigation anchor for that route segment.

### Platform-Specific Extensions

Metro automatically resolves platform variants before the standard module lookup:

- `icon-symbol.tsx` — Material Icons (Android/web fallback)
- `icon-symbol.ios.tsx` — Native SF Symbols on iOS
- `use-color-scheme.ts` — React Native hook
- `use-color-scheme.web.ts` — SSR hydration guard for web

The `.web.tsx` variant handles Next.js-style static rendering where the color scheme is unknown at build time. On first client render, `hasHydrated` flips and the real system preference is returned.

### Web Static Output

`app.json` sets `web.output: "static"`, producing pre-rendered HTML at build time. Combined with the `<Head>` component (expo-router/head), each route gets its own `<title>` and `<meta>` tags for crawlability.

### React Compiler Disabled

The React Compiler experiment is off (`experiments.reactCompiler: false`). Instead, manual memoization is used where appropriate:

- `React.memo` on pure presentational components
- `useMemo` for derived data (filtered lists, formatted values)
- `useCallback` for stable event handler references
- Stable `ref` pattern in `useFetch` to hold fetch options without re-triggering effects

### Metro Alias

`metro.config.js` remaps `es-toolkit/compat/get` → `lodash/get` via a custom `resolveRequest` override, ensuring compatibility with libraries that expect the lodash API surface.

---

## Custom Hooks

### `useFetch<T>(url, options)`

General-purpose data fetching with automatic lifecycle management.

```typescript
const { data, isLoading, isError, refetch, abort } = useFetch<User[]>(
  "/api/users",
  {
    skip: !session,
    deps: [sessionId],
  },
);
```

**Features:**

- **Abort on unmount/url change** — `AbortController` cancels in-flight requests to prevent stale state updates
- **Status machine** — `idle | loading | success | error` with derived booleans
- **Skip** — conditionally disable the request without unmounting
- **Extra deps** — `deps` array triggers re-fetch when custom values change (beyond url)
- **Stable options** — `fetchOptionsRef` holds fetch config, avoiding re-effect-triggering from option object recreation

**Returns:**

- `data: T | null` — parsed JSON or text response
- `error: Error | null` — network/parse errors
- `isLoading`, `isError`, `isSuccess` — boolean status flags
- `refetch()` — manually increment the fetch index
- `abort()` — cancel the current request

---

### `useAnalytics()`

GA4 Measurement Protocol integration. Sends events via server-side POST to Google's `/mp/Collect` endpoint — no client-side gtag.js required.

```typescript
const { trackPageView, trackSearch, trackCTA } = useAnalytics();

trackPageView("/insights", "Insights");
trackSearch("portfolio", "/insights");
trackCTA("Execute Strategy", "AI Strategy Banner");
```

**Client ID:** Generated once via `useLocalStorage` and persisted in `localStorage` under `ga4_client_id`. On native, the hook gracefully no-ops (reads return empty string) — events still fire with an empty client ID rather than throwing.

**Events:**

| Event       | Params                         | Trigger                         |
| ----------- | ------------------------------ | ------------------------------- |
| `page_view` | `page_path`, `page_title`      | Route changes via `PageTracker` |
| `search`    | `search_term`, `search_target` | Search interactions             |
| `cta_click` | `cta_name`, `cta_location`     | Button/CTA presses              |

**Environment variables required:**

```env
EXPO_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
EXPO_PUBLIC_GA4_API_SECRET=xxxxxxxxxxxx
```

---

### `useDebounce<T>(value, delay)`

Delays exposing a value until input stabilizes for `delay` ms. Used on search/filter inputs to avoid excessive re-renders or API calls.

```typescript
const query = useDebounce(searchInput, 300);
```

---

### `useScrollTo`

Scrolls a `ScrollView` to a section on navigation. Used with `expo-router`'s `useLocalSearchParams` to support deep-link fragment scrolling (e.g., `/budgets?scrollTo=budget-velocity`).

```typescript
const { handleLayout } = useScrollTo({ scrollViewRef, scrollToParam: scrollTo, scrollNonce });

<View nativeID="budget-velocity" onLayout={handleLayout("budget-velocity")}>
```

**Mechanism:** `onLayout` measures each section's `y` offset relative to the ScrollView's content container. A `pendingScrollRef` handles the race condition where `scrollTo` param arrives before the target section has measured itself.

---

### `useThemeColor` / `useColorScheme`

Resolves color tokens based on the active color scheme (light/dark).

```typescript
const background = useThemeColor({}, "background");
const text = useThemeColor({ light: "#000", dark: "#fff" }, "text");
```

`useColorScheme` re-exports the React Native hook on native; on web, it adds a hydration guard to prevent flash of wrong theme during SSR.

---

### `useLocalStorage<T>(key, defaultValue)`

Persistent key-value storage backed by `localStorage` on web. Gracefully no-ops on native (returns `defaultValue`). Handles JSON serialization automatically.

```typescript
const { value, setValue, removeValue } = useLocalStorage<string>(
  "theme",
  "light",
);

// Persisted across sessions — survives page reload and browser restart
setValue("dark");
removeValue();
```

**Features:**

- **SSR-safe** — returns `defaultValue` on first render, hydrates the real stored value in `useEffect` (avoids hydration mismatch)
- **Generic type** — any serializable value (`string`, `number`, `object`, `array`)
- **JSON serialization** — objects are stored as JSON strings automatically
- **Graceful degradation** — on native (where `localStorage` is unavailable), reads always return `defaultValue` and writes silently no-op
- **Stable callbacks** — `setValue` and `removeValue` are `useCallback`-wrapped for stable reference

**Returns:**

- `value: T` — current stored value (or `defaultValue` before hydration)
- `setValue: (value: T) => void` — persist a new value
- `removeValue: () => void` — remove the key and reset to `defaultValue`

Under the hood, `useAnalytics` uses `useLocalStorage` to persist the GA4 client ID across sessions.

---

## Performance Optimizations

### Code Splitting

The **Budgets** screen uses `React.lazy` + `Suspense` to split components into separate chunks, reducing the initial bundle:

```typescript
const BudgetAlerts = lazy(() => import("@/components/budgets/budget-alerts"));
// ...
<Suspense fallback={null}>
  <BudgetAlerts />
</Suspense>
```

Only components below the tab group's initial route are lazy-loaded. The Dashboard and Insights tabs remain eagerly loaded since they are the primary entry points.

### Request Cancellation

`useFetch` uses `AbortController` to cancel in-flight requests. On url change, effect teardown calls `controller.abort()` — the catch block silently ignores `AbortError` to avoid spurious error state.

### Stable Ref Pattern

`fetchOptionsRef` holds fetch config across renders without re-triggering the effect:

```typescript
const fetchOptionsRef = useRef(fetchOptions);
fetchOptionsRef.current = fetchOptions;
```

The effect depends on `fetchIndex` (incremented by `refetch`) rather than the options object, preventing infinite loops when the same options are recreated each render.

### Font Loading Hold

`SplashScreen.preventAutoHideAsync()` holds the splash until both font families (DM Serif Display, Sora) are fully loaded. This prevents flash-of-unstyled-text on cold start.

### Off-Thread Animations

`react-native-reanimated` runs animations on the UI thread, keeping JS thread free during transitions. The Dashboard's `SpendingComposition` uses `FadeIn.duration(1000)` for staggered card entry.

### Optimized Image Loading

`expo-image` (`ImageBackground`) replaces `react-native`'s default `Image` component for better memory management and caching on all platforms.

---

## SEO Techniques

### Static Web Output

`app.json` configures `web.output: "static"`, which generates pre-rendered HTML files at build time. Each route becomes a static page, indexable by search crawlers without client-side JS execution.

### Head Component

Every route can export a `<Head>` component via expo-router's `Head` module. The root layout applies global tags:

```tsx
<Head>
  <title>Polar Finance — Wealth Curator</title>
  <meta
    name="description"
    content="Personal finance dashboard with AI-driven insights..."
  />
  <meta property="og:title" content="Polar Finance — Wealth Curator" />
  <meta property="og:description" content="..." />
  <meta property="og:type" content="website" />
  <meta name="theme-color" content="#0f1115" />
</Head>
```

### Semantic HTML + ARIA

All major sections include landmark roles and labels for accessibility and crawlers:

```tsx
<ThemedView style={styles.mainArea} role="main" aria-label="Main content">
  <View role="region" aria-label="Portfolio summary">
  <View role="region" aria-label="Budget velocity and category allocation">
```

### Native ID Anchoring

Section `nativeID` attributes serve as fragment identifiers for deep linking. The `useScrollTo` hook scrolls to sections by their measured layout offset, while also providing stable anchor strings that bots can reference.

### Typed Routes

`experiments.typedRoutes: true` in `app.json` enables auto-generated route type definitions. This ensures type-safe URL construction and prevents 404s from broken links — a structural SEO safeguard.

---

## GA4/GTM Integration

### Architecture

Events are sent via the **GA4 Measurement Protocol** (server-side) rather than the client-side gtag.js. This avoids blocking render and works uniformly across native (iOS/Android) and web without loading Google's tag script.

```
User Action → useAnalytics() → fetch POST → google-analytics.com/mp/Collect
```

### Configuration

Set two environment variables in `.env`:

```env
EXPO_PUBLIC_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
EXPO_PUBLIC_GA4_API_SECRET=xxxxxxxxxxxx
```

### Client ID

The `useLocalStorage` hook manages the GA4 client ID:

```typescript
const { value: clientId, setValue: setClientId } = useLocalStorage<string>(
  "ga4_client_id",
  "",
);

useEffect(() => {
  if (!clientId) setClientId(generateClientId());
}, [clientId, setClientId]);
```

On first load, a UUID-style ID is generated and persisted to `localStorage`. On native (where `localStorage` is unavailable), reads always return `""` — the ID is never persisted, but events still fire with an empty client ID rather than crashing. The same client ID persists across sessions within the same browser.

### Page Tracking

`PageTracker` is rendered once in the tab layout. It uses `usePathname()` to detect navigation and fires `page_view` with every route change:

```typescript
useEffect(() => {
  const titles: Record<string, string> = {
    "/": "Dashboard",
    "/insights": "Insights",
    "/budgets": "Budgets",
  };
  trackPageView(pathname, titles[pathname] ?? pathname);
}, [pathname, trackPageView]);
```

### Event Flow

1. **Page view** — automatically tracked on route change
2. **Search** — fired when user enters a search term: `trackSearch(term, targetPage)`
3. **CTA click** — fired on primary actions: `trackCTA(name, location)`

All events are fire-and-forget with silent error swallowing. Analytics never blocks or degrades UX if the GA endpoint is unreachable.

### Sending to GTM Instead

To route through Google Tag Manager instead of direct GA4 Measurement Protocol, add a GTM container ID to the `<Head>` as a custom data layer, or use `expo-web-browser` to open the GTM preview URL. The current implementation bypasses GTM's client-side tag firing and sends directly to GA4 — if GTM is the source of truth, replace the `sendGA4Event` function with a GTM Measurement Protocol wrapper using the same `gtag_id` parameter.

---

## Design System

### Color Tokens (Dark Mode)

| Token              | Hex       | Usage                        |
| ------------------ | --------- | ---------------------------- |
| `primary`          | `#0058be` | Actions, active states       |
| `success`          | `#10b981` | Positive deltas, cleared     |
| `error`            | `#ba1a1a` | Alerts, critical budget      |
| `warning`          | `#924700` | Tertiary/gold, warning state |
| `surfaceContainer` | `#334155` | Card backgrounds             |
| `background`       | `#0F172A` | Page background              |

### Typography

| Style        | Size / Line Height | Weight | Usage                    |
| ------------ | ------------------ | ------ | ------------------------ |
| `displayMD`  | 44px / 44px        | 700    | Hero numbers (net worth) |
| `headlineSM` | 24px / 32px        | 600    | Section titles           |
| `titleMD`    | 18px / 24px        | 600    | Card headers             |
| `bodyMD`     | 14px / 20px        | 400    | Body copy                |
| `labelSM`    | 11px / 14px        | 500    | Tags, status chips       |

### Status Badges

Pill chips use color-coded variants: `FIXED`, `CRITICAL`, `HEALTHY`, `OPTIMAL`, `CLEARED`, `PENDING`.

Budget progress bars: **green** (healthy <70%), **amber** (warning 70–89%), **red** (critical 90%+).
