// MarketSim v1 data layer: asset catalog, simulated market, AI traders.
// v1 scope: US stocks, commodities, resources, currencies (incl. crypto),
// simulated live prices, candlestick charts, and 5 AI traders with a chat feed.

export type AssetCategory = "stocks" | "commodities" | "resources" | "currencies";

export interface Asset {
  symbol: string;
  name: string;
  category: AssetCategory;
  /** Simulated starting price in USD. */
  basePrice: number;
  /** Per-tick volatility used by the simulator. */
  vol: number;
}

const stock = (symbol: string, name: string, basePrice: number, vol = 0.004): Asset => ({
  symbol,
  name,
  category: "stocks",
  basePrice,
  vol,
});

const commodity = (symbol: string, name: string, basePrice: number, vol = 0.006): Asset => ({
  symbol,
  name,
  category: "commodities",
  basePrice,
  vol,
});

const resource = (symbol: string, name: string, basePrice: number, vol = 0.008): Asset => ({
  symbol,
  name,
  category: "resources",
  basePrice,
  vol,
});

const currency = (symbol: string, name: string, basePrice: number, vol = 0.002): Asset => ({
  symbol,
  name,
  category: "currencies",
  basePrice,
  vol,
});

// 40 US stocks
const STOCKS: Asset[] = [
  stock("AAPL", "Apple", 232.5),
  stock("MSFT", "Microsoft", 428.1),
  stock("NVDA", "NVIDIA", 138.2, 0.007),
  stock("GOOGL", "Alphabet", 178.4),
  stock("AMZN", "Amazon", 201.3),
  stock("TSLA", "Tesla", 249.8, 0.009),
  stock("JPM", "JPMorgan Chase", 224.6),
  stock("BAC", "Bank of America", 41.2),
  stock("XOM", "Exxon Mobil", 118.4),
  stock("WMT", "Walmart", 76.3),
  stock("JNJ", "Johnson & Johnson", 158.9),
  stock("BA", "Boeing", 155.2, 0.006),
  stock("GE", "GE Aerospace", 184.7),
  stock("DIS", "Disney", 96.4),
  stock("KO", "Coca-Cola", 68.5),
  stock("PEP", "PepsiCo", 162.3),
  stock("MCD", "McDonald's", 291.6),
  stock("CAT", "Caterpillar", 389.4),
  stock("V", "Visa", 279.8),
  stock("MA", "Mastercard", 492.1),
  stock("PFE", "Pfizer", 27.9),
  stock("UNH", "UnitedHealth", 562.3),
  stock("MRK", "Merck", 99.7),
  stock("ABBV", "AbbVie", 189.2),
  stock("TMO", "Thermo Fisher", 523.8),
  stock("LLY", "Eli Lilly", 861.4, 0.006),
  stock("CVX", "Chevron", 152.6),
  stock("COP", "ConocoPhillips", 108.9),
  stock("EOG", "EOG Resources", 126.4),
  stock("SLB", "SLB", 43.7),
  stock("NEE", "NextEra Energy", 74.8),
  stock("DUK", "Duke Energy", 111.3),
  stock("SO", "Southern Company", 89.6),
  stock("LIN", "Linde", 452.9),
  stock("SHW", "Sherwin-Williams", 358.2),
  stock("FCX", "Freeport-McMoRan", 46.8, 0.006),
  stock("T", "AT&T", 22.4),
  stock("VZ", "Verizon", 41.9),
  stock("CMCSA", "Comcast", 38.6),
  stock("INTC", "Intel", 21.7, 0.007),
];

// 18 commodities
const COMMODITIES: Asset[] = [
  commodity("WTI", "WTI Crude Oil", 76.4),
  commodity("BRENT", "Brent Crude Oil", 80.1),
  commodity("NATGAS", "Natural Gas", 2.85, 0.012),
  commodity("HEATOIL", "Heating Oil", 2.42),
  commodity("GOLD", "Gold", 2530),
  commodity("SILVER", "Silver", 29.8),
  commodity("PLAT", "Platinum", 962),
  commodity("PALL", "Palladium", 1015),
  commodity("COPPER", "Copper", 4.28),
  commodity("WHEAT", "Wheat", 5.72),
  commodity("CORN", "Corn", 4.15),
  commodity("SOYBEAN", "Soybeans", 10.3),
  commodity("COFFEE", "Coffee", 248),
  commodity("SUGAR", "Sugar", 21.4),
  commodity("COCOA", "Cocoa", 7180, 0.012),
  commodity("COTTON", "Cotton", 70.2),
  commodity("CATTLE", "Live Cattle", 186.5),
  commodity("HOGS", "Lean Hogs", 82.3),
];

// 14 resources
const RESOURCES: Asset[] = [
  resource("LI", "Lithium", 13.8),
  resource("U", "Uranium", 82.4),
  resource("CO", "Cobalt", 26.5),
  resource("NI", "Nickel", 16.2),
  resource("REE", "Rare Earths", 148),
  resource("IRONORE", "Iron Ore", 103),
  resource("ALUM", "Aluminum", 2450),
  resource("ZINC", "Zinc", 2870),
  resource("LEAD", "Lead", 2060),
  resource("TIN", "Tin", 31200),
  resource("LUMBER", "Lumber", 548),
  resource("PULP", "Wood Pulp", 735),
  resource("WATER", "Water Rights", 1240),
  resource("CARBON", "Carbon Credits", 68.9),
];

// 20 currencies incl. crypto
const CURRENCIES: Asset[] = [
  currency("EURUSD", "USD / Euro", 1.087),
  currency("USDJPY", "USD / Japanese Yen", 149.2),
  currency("GBPUSD", "GBP / USD", 1.268),
  currency("USDCHF", "USD / Swiss Franc", 0.882),
  currency("USDCAD", "USD / Canadian Dollar", 1.352),
  currency("AUDUSD", "AUD / USD", 0.662),
  currency("NZDUSD", "NZD / USD", 0.598),
  currency("USDCNY", "USD / Chinese Yuan", 7.12),
  currency("USDINR", "USD / Indian Rupee", 83.6),
  currency("USDBRL", "USD / Brazilian Real", 5.62),
  currency("USDZAR", "USD / South African Rand", 18.3),
  currency("USDMXN", "USD / Mexican Peso", 19.8),
  currency("USDSGD", "USD / Singapore Dollar", 1.342),
  currency("USDHKD", "USD / Hong Kong Dollar", 7.79),
  currency("USDKRW", "USD / South Korean Won", 1345),
  currency("USDTRY", "USD / Turkish Lira", 34.2, 0.004),
  currency("BTC", "Bitcoin", 61200, 0.012),
  currency("ETH", "Ethereum", 2640, 0.014),
  currency("SOL", "Solana", 148, 0.018),
  currency("DOGE", "Dogecoin", 0.118, 0.02),
];

export const ASSETS: Asset[] = [...STOCKS, ...COMMODITIES, ...RESOURCES, ...CURRENCIES];

export const CATEGORY_META: Record<AssetCategory, { label: string; emoji: string }> = {
  stocks: { label: "Stocks", emoji: "📈" },
  commodities: { label: "Commodities", emoji: "🌾" },
  resources: { label: "Resources", emoji: "⛏️" },
  currencies: { label: "Currencies", emoji: "💱" },
};

export const CATEGORY_ORDER: AssetCategory[] = ["stocks", "commodities", "resources", "currencies"];

// ---------------------------------------------------------------------------
// Simulated market engine
// ---------------------------------------------------------------------------

export interface Quote {
  symbol: string;
  price: number;
  /** Change vs. the session open, in percent. */
  changePct: number;
  /** Relative trading volume, 0..1+. */
  volume: number;
  /** Deterministic pseudo-history for charting (oldest first). */
  history: { time: number; open: number; high: number; low: number; close: number; volume: number }[];
}

export const TICK_MS = 8_000;

function seedRandom(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** Build one deterministic pseudo-history (30 bars) for an asset. */
function makeHistory(asset: Asset, now: number, price: number): Quote["history"] {
  const rand = seedRandom(
    [...asset.symbol].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7),
  );
  const bars: Quote["history"] = [];
  let p = price * (0.94 + rand() * 0.12);
  for (let i = 29; i >= 0; i--) {
    const drift = (rand() - 0.48) * asset.vol * price * 2;
    const open = p;
    const close = Math.max(0.0001, open + drift);
    const high = Math.max(open, close) * (1 + rand() * asset.vol);
    const low = Math.min(open, close) * (1 - rand() * asset.vol);
    bars.push({
      time: Math.floor(now / 1000) - i * 3600,
      open,
      high,
      low,
      close,
      volume: Math.floor(500 + rand() * 2500),
    });
    p = close;
  }
  // Anchor the last close to the live price.
  const last = bars[bars.length - 1];
  last.close = price;
  last.high = Math.max(last.high, price);
  last.low = Math.min(last.low, price);
  return bars;
}

/** One market tick: deterministic per-symbol drift so all clients agree. */
export function tickQuotes(prev: Map<string, Quote>, now: number): Map<string, Quote> {
  const next = new Map<string, Quote>();
  const tickIndex = Math.floor(now / TICK_MS);
  for (const asset of ASSETS) {
    const prevQuote = prev.get(asset.symbol);
    const seed =
      ([...asset.symbol].reduce((h, c) => (h * 33 + c.charCodeAt(0)) >>> 0, 11) ^
        (tickIndex * 2654435761)) >>>
      0;
    const rand = seedRandom(seed);
    const shock = (rand() - 0.5) * 2 * asset.vol;
    const price = Math.max(0.0001, (prevQuote?.price ?? asset.basePrice) * (1 + shock));
    const open = prevQuote?.history?.[0]?.open ?? asset.basePrice;
    const history = makeHistory(asset, now, price);
    if (history.length > 0) history[0] = { ...history[0], open };
    next.set(asset.symbol, {
      symbol: asset.symbol,
      price,
      changePct: ((price - open) / open) * 100,
      volume: prevQuote ? prevQuote.volume * 0.7 + rand() : rand(),
      history,
    });
  }
  return next;
}

export function initialQuotes(now: number): Map<string, Quote> {
  return tickQuotes(new Map(), now);
}

export function formatPrice(price: number): string {
  if (price >= 1000) return price.toLocaleString("en-US", { maximumFractionDigits: 0 });
  if (price >= 1) return price.toFixed(2);
  return price.toFixed(4);
}

// ---------------------------------------------------------------------------
// AI traders
// ---------------------------------------------------------------------------

export interface AiTrader {
  id: string;
  name: string;
  emoji: string;
  /** One-line personality shown in the AI tab. */
  bio: string;
  /** Assets (by symbol) this trader focuses on. */
  focus: string[];
  /** Portfolio: symbol -> units held. */
  holdings: Record<string, number>;
  /** Chat style templates; {sym} {pct} {price} are interpolated. */
  lines: string[];
  /** Chance (0..1) the trader speaks on any given market tick. */
  chattiness: number;
}

export const AI_TRADERS: AiTrader[] = [
  {
    id: "comrade",
    name: "ComradeBot",
    emoji: "🐻",
    bio: "Collectivist capital allocator. Believes every dip belongs to everyone.",
    focus: ["NVDA", "TSLA", "GOLD", "BTC"],
    holdings: { NVDA: 120, TSLA: 40, GOLD: 3, BTC: 0.5, WHEAT: 300 },
    lines: [
      "The people's portfolio welcomes {sym} at {price}. A wise redistribution of risk.",
      "{sym} moved {pct}. Comrade, this is exactly what we planned at the last congress.",
      "I have acquired more {sym}. Do not thank me — thank the collective.",
      "While others panic over {sym}, I accumulate. The five-year plan is on schedule.",
    ],
    chattiness: 0.3,
  },
  {
    id: "hedgehog",
    name: "HedgeHogAI",
    emoji: "🦔",
    bio: "Risk-parity quant. Speaks only in hedge ratios and drawdown limits.",
    focus: ["JPM", "GOLD", "USDJPY", "WHEAT"],
    holdings: { JPM: 85, GOLD: 5, USDJPY: 2000, WHEAT: 150, NEE: 60 },
    lines: [
      "Rebalancing note: {sym} at {pct} pushes my book past its variance budget. Trimming.",
      "{sym} at {price}. Correlation regime looks stable. No action required.",
      "Adding convexity via {sym}. Tail risk is underpriced, as usual.",
      "{pct} on {sym} — within tolerance. Stay disciplined, friends.",
    ],
    chattiness: 0.25,
  },
  {
    id: "traderbot",
    name: "TraderBot",
    emoji: "📈",
    bio: "Momentum scalper. Buys strength, sells weakness, never sleeps.",
    focus: ["AAPL", "NVDA", "WTI", "COPPER"],
    holdings: { AAPL: 60, NVDA: 90, WTI: 100, COPPER: 200 },
    lines: [
      "Momentum signal on {sym}: {pct}. Entered. Stop is set.",
      "{sym} broke out to {price}. Riding it until the trend line snaps.",
      "Closed my {sym} position for a clean gain. Next setup loading.",
      "{sym} up {pct} — textbook continuation. Size accordingly.",
    ],
    chattiness: 0.35,
  },
  {
    id: "cryptobro",
    name: "CryptoBro",
    emoji: "🚀",
    bio: "Perma-bull on anything with a whitepaper. Says 'wagmi' unironically.",
    focus: ["BTC", "ETH", "SOL", "DOGE"],
    holdings: { BTC: 1.2, ETH: 15, SOL: 220, DOGE: 50000 },
    lines: [
      "{sym} printing {pct}. Wagmi. That's it. That's the analysis.",
      "Just DCA'd into {sym} at {price}. Zoom out, plebs.",
      "SOL to the moon, {sym} following. Few understand.",
      "FUD on {sym} at {pct}? Best buying opportunity of the cycle. Probably.",
    ],
    chattiness: 0.4,
  },
  {
    id: "goldbug",
    name: "GoldBugAI",
    emoji: "🪙",
    bio: "Hard-money skeptic. Distrusts everything except shiny metals and uranium.",
    focus: ["GOLD", "SILVER", "U", "PLAT"],
    holdings: { GOLD: 8, SILVER: 400, U: 120, PLAT: 4 },
    lines: [
      "{sym} at {price}. Fiat confidence erodes another day. Metals hold.",
      "{pct} on {sym}. Paper claims fade; bullion endures.",
      "Accumulated more {sym}. Sound money thesis needs no charts.",
      "Uranium quietly up {pct} while the crowd chases noise. Patient hands win.",
    ],
    chattiness: 0.3,
  },
];

/** Pick an AI chat line for a tick, or null if the trader stays quiet. */
export function aiChatLine(
  trader: AiTrader,
  quotes: Map<string, Quote>,
  now: number,
): { trader: AiTrader; text: string } | null {
  const seed = seedRandom((trader.id.charCodeAt(0) * 7919 + Math.floor(now / TICK_MS)) >>> 0);
  if (seed() > trader.chattiness) return null;
  const symbol = trader.focus[Math.floor(seed() * trader.focus.length)];
  const quote = quotes.get(symbol);
  if (!quote) return null;
  const line = trader.lines[Math.floor(seed() * trader.lines.length)];
  const text = line
    .replace(/\{sym\}/g, symbol)
    .replace(/\{pct\}/g, `${quote.changePct >= 0 ? "+" : ""}${quote.changePct.toFixed(2)}%`)
    .replace(/\{price\}/g, `$${formatPrice(quote.price)}`);
  return { trader, text };
}
