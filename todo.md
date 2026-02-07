# Gildore Frontend - TODO

## External Wallet Connection (Priority)

The admin wallet (`EBnyhRYRQFgJiVEoCf2vuVGK57L4XtbZ46oJSVv5QQGA`) was not created through Privy's email OTP flow — it's a standard Solana keypair (likely from Phantom, Backpack, or a CLI wallet). Privy's embedded wallets are separate from external wallets, so the admin can't access their marketplace wallet through the current Privy-only auth.

### What needs to happen

1. **Add external wallet adapter support alongside Privy**
   - Install `@solana/wallet-adapter-wallets` (Phantom, Backpack, Solflare, etc.)
   - The wallet adapter libs (`@solana/wallet-adapter-base`, `@solana/wallet-adapter-react`) are already installed

2. **Create a `WalletAdapterProvider` wrapper**
   - Wrap the app with `ConnectionProvider` + `WalletProvider` from `@solana/wallet-adapter-react`
   - Configure with devnet endpoint and desired wallet list

3. **Update `useSolanaProvider.ts` to support both wallet sources**
   - Check if an external wallet is connected via `useWallet()` from wallet-adapter
   - Fall back to Privy embedded wallet via `useSolanaWallets()` if no external wallet
   - The Anchor `Provider`/`Program` creation stays the same — just the wallet source changes

4. **Add a "Connect Wallet" button to the dashboard header**
   - Use `useWalletModal()` or a custom modal to trigger wallet selection
   - Show connected wallet address (truncated) in the header
   - Allow switching between Privy embedded wallet and external wallet

5. **Auth flow options**
   - Option A: Keep Privy for regular users (email login), add a separate "Connect Wallet" button for admin/power users
   - Option B: Add wallet connection as an alternative login method in the auth page
   - Option A is simpler and doesn't disrupt the existing buyer flow

### Key files to modify

- `src/hooks/useSolanaProvider.ts` — dual wallet source logic
- `src/main.tsx` — add `WalletAdapterProvider`
- `src/components/layout/DashboardHeader.tsx` — connect wallet button
- Possibly `src/components/provider/PrivyProvider.tsx` — configure Privy to also link external wallets

### Notes

- Privy does support linking external wallets via `useConnectWallet()` — this might be the simplest path since it keeps everything in the Privy ecosystem
- Test that `signTransaction` from external wallets is compatible with Anchor's `AnchorProvider` (same concern as with Privy, but external wallets are generally more standard)

# Next implementation

Plan: External Wallet Connection (Privy-Native Approach) │
│ │
│ Context │
│ │
│ The admin wallet (EBnyhRYRQFgJiVEoCf2vuVGK57L4XtbZ46oJSVv5QQGA) is a standard Solana keypair created outside Privy. Currently, users must log in via email OTP before they can connect an external wallet. │
│ The admin can't access the marketplace without first creating a Privy email account. We need to allow direct wallet login (Phantom, Backpack, Solflare) as a first-class auth method. │
│ │
│ What's Already Done │
│ │
│ - useSolanaProvider.ts already prefers external wallets over Privy embedded wallets (line 23) │
│ - DashboardHeader.tsx already has a Connect Wallet / Switch button via Privy's connectWallet() │
│ - Privy config already lists ["detected_wallets", "phantom", "solflare", "backpack"] in walletList │
│ - No new packages needed │
│ │
│ Changes (3 files) │
│ │
│ 1. src/components/provider/PrivyProvider.tsx │
│ │
│ - Add "wallet" to the loginMethods array: ["google", "email", "wallet"] │
│ - This enables Privy's native wallet login flow alongside email/Google │
│ │
│ 2. src/pages/auth.tsx │
│ │
│ - Add a "Connect Wallet" button below the email form │
│ - Use Privy's useConnectWallet() hook to trigger wallet selection │
│ - Add an "or" divider between the email form and the wallet button │
│ - Keeps the existing email flow untouched for regular users │
│ │
│ 3. src/components/layout/DashboardHeader.tsx │
│ │
│ - Currently shows wallets[0] which may be the embedded wallet │
│ - Import and use useSolanaProvider() to show the preferred wallet address (external > embedded), consistent with how transactions work │
│ │
│ Verification │
│ │
│ - Run pnpm dev and navigate to /auth │
│ - Confirm the "Connect Wallet" button appears below the email form │
│ - Click it — Privy modal should show Phantom/Backpack/Solflare options │
│ - Connect an external wallet — should redirect to dashboard │
│ - Verify the dashboard header shows the external wallet address, not the embedded one │
│ - Test that marketplace transactions sign with the external wallet

╭────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────╮
│ Plan to implement                                                                                                                                                                                      │
│                                                                                                                                                                                                        │
│ Plan: Real-Time XAU/XAG Price Charts with Pyth Network                                                                                                                                                 │
│                                                                                                                                                                                                        │
│ Context                                                                                                                                                                                                │
│                                                                                                                                                                                                        │
│ The dashboard has an empty col-span-2 placeholder where charts should go, and the gold/silver AnalyticsCards show hardcoded prices (03.65/gram). We need real-time XAU (gold) and XAG (silver)       │
│ pricing from Pyth Network, displayed as charts with area and candlestick views, and live prices in the analytics cards.                                                                                │
│                                                                                                                                                                                                        │
│ New Package                                                                                                                                                                                            │
│                                                                                                                                                                                                        │
│ - recharts — for area and candlestick chart rendering                                                                                                                                                  │
│                                                                                                                                                                                                        │
│ Architecture                                                                                                                                                                                           │
│                                                                                                                                                                                                        │
│ Dashboard (calls usePythPrices once, passes data down)                                                                                                                                                 │
│   |                                                                                                                                                                                                    │
│   +-- AnalyticsCards (receives pythData prop)                                                                                                                                                          │
│   |     +-- AnalyticsCard type=default (unchanged, wallet balance)                                                                                                                                   │
│   |     +-- AnalyticsCard type=gold   (live XAU price/gram + % change)                                                                                                                               │
│   |     +-- AnalyticsCard type=silver (live XAG price/gram + % change)                                                                                                                               │
│   |                                                                                                                                                                                                    │
│   +-- PriceChart (receives pythData prop)                                                                                                                                                              │
│         +-- Metal tabs: XAU | XAG                                                                                                                                                                      │
│         +-- View toggle: Area | Candle                                                                                                                                                                 │
│         +-- Recharts AreaChart or ComposedChart with custom CandlestickBar                                                                                                                             │
│         +-- Pyth freshness indicator                                                                                                                                                                   │
│                                                                                                                                                                                                        │
│ Single usePythPrices() call at Dashboard level avoids duplicate history accumulation.                                                                                                                  │
│                                                                                                                                                                                                        │
│ New Files (6)                                                                                                                                                                                          │
│                                                                                                                                                                                                        │
│ 1. src/types/pyth.ts — Type definitions                                                                                                                                                                │
│                                                                                                                                                                                                        │
│ - PythHermesResponse, PythParsedFeed, PythPriceData — raw API types                                                                                                                                    │
│ - PriceTick — parsed price point (timestamp, pricePerOz, pricePerGram, confidence)                                                                                                                     │
│ - CandleData — OHLC candle (timestamp, open, high, low, close)                                                                                                                                         │
│ - MetalType — XAU | XAG                                                                                                                                                                            │
│                                                                                                                                                                                                        │
│ 2. src/lib/pyth.ts — Constants and pure utilities                                                                                                                                                      │
│                                                                                                                                                                                                        │
│ - PYTH_FEED_IDS — XAU: 0x765d2ba906dbc32ca17cc11f5310a89e9ee1f6420508c63861f2f8ba4ee34bb2, XAG: 0xf2fb02c32b055c805e7238d628e5e9dadef274376114eb1f012337cabe93871e                                     │
│ - TROY_OZ_TO_GRAMS = 31.1035                                                                                                                                                                           │
│ - MAX_HISTORY_LENGTH = 360 (1 hour at 10s intervals)                                                                                                                                                   │
│ - CANDLE_INTERVAL_MS = 60_000 (1-minute candles)                                                                                                                                                       │
│ - parsePythPrice(feed) -> PriceTick — converts raw Pyth response to usable price                                                                                                                       │
│ - aggregateCandles(ticks, existing) -> CandleData[] — groups ticks into 1-min OHLC candles                                                                                                             │
│ - buildPythPriceUrl(feedIds) -> string — constructs Hermes REST URL                                                                                                                                    │
│                                                                                                                                                                                                        │
│ 3. src/hooks/usePythPrices.ts — React Query polling hook                                                                                                                                               │
│                                                                                                                                                                                                        │
│ - Fetches both XAU and XAG in a single request via GET /v2/updates/price/latest?ids[]=...&ids[]=...                                                                                                    │
│ - Polls every 10 seconds (refetchInterval: 10_000)                                                                                                                                                     │
│ - Accumulates price history in useRef arrays (capped at 360 entries)                                                                                                                                   │
│ - Aggregates candle data on each new tick                                                                                                                                                              │
│ - Deduplicates by timestamp to avoid duplicate entries                                                                                                                                                 │
│ - Returns: { xau, xag, xauHistory, xagHistory, xauCandles, xagCandles, isLoading, isError }                                                                                                            │
│                                                                                                                                                                                                        │
│ 4. src/components/dashboard/charts/CandlestickBar.tsx — Custom Recharts candlestick shape                                                                                                              │
│                                                                                                                                                                                                        │
│ - SVG component rendering candle body (rect) + wicks (lines)                                                                                                                                           │
│ - Green (#22c55e) when close >= open, red (#ef4444) when close < open                                                                                                                                  │
│ - Used as shape prop on Recharts <Bar> inside <ComposedChart>                                                                                                                                          │
│                                                                                                                                                                                                        │
│ 5. src/components/dashboard/charts/PriceChart.tsx — Main chart component                                                                                                                               │
│                                                                                                                                                                                                        │
│ - Accepts pythData prop (output of usePythPrices)                                                                                                                                                      │
│ - Metal tabs (XAU/XAG) to switch datasets                                                                                                                                                              │
│ - View toggle (Area/Candle) to switch chart type                                                                                                                                                       │
│ - Current price header showing $/gram and $/oz                                                                                                                                                         │
│ - Area view: <AreaChart> with gradient fill, gold (#FBC052) or silver (#BDBDBD) accent                                                                                                                 │
│ - Candle view: <ComposedChart> with <Bar shape={<CandlestickBar />}>                                                                                                                                   │
│ - Pyth Network freshness indicator with green pulse dot                                                                                                                                                │
│ - Loading spinner when no data yet                                                                                                                                                                     │
│                                                                                                                                                                                                        │
│ 6. src/components/dashboard/charts/index.ts — Barrel export                                                                                                                                            │
│                                                                                                                                                                                                        │
│ Modified Files (3)                                                                                                                                                                                     │
│                                                                                                                                                                                                        │
│ 1. src/pages/dashboard/index.tsx                                                                                                                                                                       │
│                                                                                                                                                                                                        │
│ - Import usePythPrices and PriceChart                                                                                                                                                                  │
│ - Call usePythPrices() once at Dashboard level                                                                                                                                                         │
│ - Pass pythData to <AnalyticsCards> and <PriceChart>                                                                                                                                                   │
│ - Replace empty <div className=col-span-2 ...></div> with <PriceChart pythData={pythData} />                                                                                                         │
│                                                                                                                                                                                                        │
│ 2. src/components/dashboard/AnalyticsCards.tsx                                                                                                                                                         │
│                                                                                                                                                                                                        │
│ - Accept pythData prop                                                                                                                                                                                 │
│ - Compute previous price from history arrays (second-to-last tick) for % change                                                                                                                        │
│ - Pass livePrice and isPriceLoading to gold/silver <AnalyticsCard> instances                                                                                                                           │
│                                                                                                                                                                                                        │
│ 3. src/components/dashboard/AnalyticsCard.tsx                                                                                                                                                          │
│                                                                                                                                                                                                        │
│ - Add livePrice and isPriceLoading props to interface                                                                                                                                                  │
│ - Add TrendingUp to lucide-react imports                                                                                                                                                               │
│ - Replace hardcoded 03.65 and 0.4% with dynamic values from livePrice prop                                                                                                                           │
│ - Show TrendingUp (green) or TrendingDown (red) based on % change direction                                                                                                                            │
│ - Show loader spinner when isPriceLoading, -- when no data                                                                                                                                           │
│                                                                                                                                                                                                        │
│ Verification                                                                                                                                                                                           │
│                                                                                                                                                                                                        │
│ 1. Run pnpm add recharts && pnpm dev                                                                                                                                                                   │
│ 2. Navigate to dashboard — charts should appear in the previously empty area                                                                                                                           │
│ 3. Gold/silver analytics cards should show live Pyth prices instead of 03.65                                                                                                                         │
│ 4. Click XAU/XAG tabs — chart switches between gold and silver data                                                                                                                                    │
│ 5. Click Area/Candle toggle — chart view switches                                                                                                                                                      │
│ 6. Prices should update every ~10 seconds (green pulse dot confirms freshness)                                                                                                                         │
│ 7. After a few minutes, candlestick view should show multiple 1-minute candles                                                                                                                         │
╰──────────────────────────────────────────────────────────────────────────────────────
