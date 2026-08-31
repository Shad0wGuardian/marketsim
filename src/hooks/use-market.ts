import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ASSETS,
  TICK_MS,
  initialQuotes,
  tickQuotes,
  type Asset,
  type Quote,
} from "@/lib/marketsim";

const FAV_KEY = "marketsim.favorites";
const CASH_KEY = "marketsim.cash";
const HOLD_KEY = "marketsim.holdings";
const START_CASH = 100_000;

function readJson<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable (private mode) — session-only then
  }
}

export interface Holding {
  symbol: string;
  qty: number;
  avgCost: number;
}

export function useMarket(userName: string) {
  const [quotes, setQuotes] = useState<Map<string, Quote>>(() => initialQuotes(Date.now()));
  const [favorites, setFavorites] = useState<string[]>(() => readJson(FAV_KEY, []));
  const [cash, setCash] = useState<number>(() => readJson(CASH_KEY, START_CASH));
  const [holdings, setHoldings] = useState<Holding[]>(() => readJson(HOLD_KEY, []));

  useEffect(() => {
    const id = setInterval(() => {
      setQuotes((prev) => tickQuotes(prev, Date.now()));
    }, TICK_MS);
    return () => clearInterval(id);
  }, []);

  useEffect(() => writeJson(FAV_KEY, favorites), [favorites]);
  useEffect(() => writeJson(CASH_KEY, cash), [cash]);
  useEffect(() => writeJson(HOLD_KEY, holdings), [holdings]);

  const toggleFavorite = useCallback((symbol: string) => {
    setFavorites((prev) =>
      prev.includes(symbol) ? prev.filter((s) => s !== symbol) : [...prev, symbol],
    );
  }, []);

  const buy = useCallback((symbol: string, qty: number) => {
    const price = quotes.get(symbol)?.price;
    if (!price || qty <= 0) return false;
    const cost = price * qty;
    setCash((c) => {
      if (c < cost) return c;
      setHoldings((h) => {
        const existing = h.find((x) => x.symbol === symbol);
        if (existing) {
          const newQty = existing.qty + qty;
          const newAvg = (existing.avgCost * existing.qty + cost) / newQty;
          return h.map((x) => (x.symbol === symbol ? { ...x, qty: newQty, avgCost: newAvg } : x));
        }
        return [...h, { symbol, qty, avgCost: price }];
      });
      return c - cost;
    });
    return true;
  }, [quotes]);

  const sell = useCallback((symbol: string, qty: number) => {
    const price = quotes.get(symbol)?.price;
    if (!price || qty <= 0) return false;
    let ok = false;
    setHoldings((h) => {
      const existing = h.find((x) => x.symbol === symbol);
      if (!existing || existing.qty < qty) return h;
      ok = true;
      const remaining = existing.qty - qty;
      return remaining <= 0
        ? h.filter((x) => x.symbol !== symbol)
        : h.map((x) => (x.symbol === symbol ? { ...x, qty: remaining } : x));
    });
    if (ok) setCash((c) => c + price * qty);
    return ok;
  }, [quotes]);

  const holdingsValue = useMemo(
    () =>
      holdings.reduce((sum, h) => {
        const price = quotes.get(h.symbol)?.price ?? h.avgCost;
        return sum + price * h.qty;
      }, 0),
    [holdings, quotes],
  );

  const netWorth = cash + holdingsValue;

  const assetMap = useMemo(() => {
    const m = new Map<string, Asset>();
    for (const a of ASSETS) m.set(a.symbol, a);
    return m;
  }, []);

  return {
    quotes,
    favorites,
    toggleFavorite,
    cash,
    holdings,
    holdingsValue,
    netWorth,
    buy,
    sell,
    assetMap,
    userName,
  };
}
