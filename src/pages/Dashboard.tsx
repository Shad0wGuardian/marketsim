import { useMemo, useState } from "react";
import { Link } from "react-router";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useMarket } from "@/hooks/use-market";
import { PriceChart } from "@/components/PriceChart";
import {
  AI_TRADERS,
  ASSETS,
  CATEGORY_META,
  CATEGORY_ORDER,
  formatPrice,
  type AssetCategory,
} from "@/lib/marketsim";
import { Loader2, Search, Star, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { Leaderboard } from "@/components/Leaderboard";

type Filter = AssetCategory | "all" | "favorites";
type Tab = "market" | "rank";

export default function Dashboard() {
  const { user } = useAuth();
  const market = useMarket(user?.name ?? "you");
  const { quotes, favorites, toggleFavorite, cash, holdings, holdingsValue, netWorth, assetMap } = market;

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [selected, setSelected] = useState("AAPL");
  const [tab, setTab] = useState<Tab>("market");

  const comments = useQuery(api.comments.listForSymbol, { symbol: selected });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return ASSETS.filter((a) => {
      if (filter === "favorites" && !favorites.includes(a.symbol)) return false;
      if (filter !== "all" && filter !== "favorites" && a.category !== filter) return false;
      if (!q) return true;
      return a.symbol.toLowerCase().includes(q) || a.name.toLowerCase().includes(q);
    });
  }, [search, filter, favorites]);

  const movers = useMemo(
    () =>
      [...quotes.values()]
        .sort((a, b) => Math.abs(b.changePct) - Math.abs(a.changePct))
        .slice(0, 6),
    [quotes],
  );

  const selectedAsset = assetMap.get(selected);
  const selectedQuote = quotes.get(selected);
  const selectedMeta = selectedAsset ? CATEGORY_META[selectedAsset.category] : null;

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground sm:px-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        {/* Header */}
        <header className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Paper trading playground</p>
            <h1 className="tracking-tight font-bold text-2xl">MarketSim</h1>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex rounded-lg border border-border/60 p-0.5">
              <button
                type="button"
                onClick={() => setTab("market")}
                className={cn(
                  "cursor-pointer rounded-md px-3 py-1 text-sm transition-colors",
                  tab === "market" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                Market
              </button>
              <button
                type="button"
                onClick={() => setTab("rank")}
                className={cn(
                  "flex cursor-pointer items-center gap-1.5 rounded-md px-3 py-1 text-sm transition-colors",
                  tab === "rank" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <Trophy className="size-3.5" /> Rank
              </button>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Cash</p>
              <p className="ms-mono text-lg">${formatPrice(cash)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Holdings</p>
              <p className="ms-mono text-lg">${formatPrice(holdingsValue)}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">Net worth</p>
              <p className="ms-mono text-lg font-semibold">${formatPrice(netWorth)}</p>
            </div>
          </div>
        </header>

        {tab === "rank" ? (
          <div className="mx-auto w-full max-w-2xl">
            <Leaderboard
              quotes={quotes}
              playerName={user?.name ?? ""}
              playerNetWorth={netWorth}
              selectedSymbol={selected}
              onSelectSymbol={(sym) => {
                setSelected(sym);
                setTab("market");
              }}
            />
          </div>
        ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
          {/* Left: chart + market list */}
          <section className="flex flex-col gap-6">
            <Card className="border-border/60 shadow-none">
              <CardHeader className="pb-2">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <CardTitle className="tracking-tight">
                    {selectedAsset ? `${selectedAsset.symbol} · ${selectedAsset.name}` : "—"}
                  </CardTitle>
                  {selectedMeta && (
                    <span className="text-xs text-muted-foreground">
                      {selectedMeta.emoji} {selectedMeta.label}
                    </span>
                  )}
                </div>
                {selectedQuote && (
                  <p className={cn("ms-mono text-xl", selectedQuote.changePct >= 0 ? "ms-up" : "ms-down")}>
                    ${formatPrice(selectedQuote.price)}{" "}
                    <span className="text-sm">
                      {selectedQuote.changePct >= 0 ? "+" : ""}
                      {selectedQuote.changePct.toFixed(2)}%
                    </span>
                  </p>
                )}
              </CardHeader>
              <CardContent>
                <PriceChart quote={selectedQuote} />
              </CardContent>
            </Card>

            {/* Top movers */}
            <Card className="border-border/60 shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Top movers</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-x-6 gap-y-1 sm:grid-cols-3">
                {movers.map((q) => (
                  <button
                    key={q.symbol}
                    type="button"
                    onClick={() => setSelected(q.symbol)}
                    className="flex cursor-pointer items-center justify-between border-b border-border/50 py-1 text-sm transition-colors hover:text-foreground"
                  >
                    <span className="font-medium">{q.symbol}</span>
                    <span className={cn("ms-mono text-xs", q.changePct >= 0 ? "ms-up" : "ms-down")}>
                      {q.changePct >= 0 ? "+" : ""}
                      {q.changePct.toFixed(2)}%
                    </span>
                  </button>
                ))}
              </CardContent>
            </Card>

            {/* Market list */}
            <Card className="border-border/60 shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Market {filtered.length > 0 && `(${filtered.length})`}</CardTitle>
                <div className="relative mt-2">
                  <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
                  <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search symbol or name…"
                    className="pl-9"
                  />
                </div>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {(["all", "favorites", ...CATEGORY_ORDER] as Filter[]).map((f) => (
                    <Button
                      key={f}
                      size="sm"
                      variant={filter === f ? "default" : "outline"}
                      className="cursor-pointer rounded-full px-3"
                      onClick={() => setFilter(f)}
                    >
                      {f === "favorites"
                        ? `★ ${favorites.length}`
                        : f === "all"
                          ? "All"
                          : `${CATEGORY_META[f as AssetCategory].emoji} ${CATEGORY_META[f as AssetCategory].label}`}
                    </Button>
                  ))}
                </div>
              </CardHeader>
              <CardContent className="max-h-[420px] overflow-y-auto">
                {filtered.length === 0 ? (
                  <p className="py-6 text-center text-sm text-muted-foreground">No assets match.</p>
                ) : (
                  filtered.map((a) => {
                    const q = quotes.get(a.symbol);
                    const chg = q?.changePct ?? 0;
                    const isFav = favorites.includes(a.symbol);
                    return (
                      <div
                        key={a.symbol}
                        className="flex cursor-pointer items-center gap-2 border-b border-border/40 py-2 last:border-b-0"
                        onClick={() => setSelected(a.symbol)}
                      >
                        <button
                          type="button"
                          aria-label={isFav ? "Unfavorite" : "Favorite"}
                          className="cursor-pointer p-0.5 text-muted-foreground transition-colors hover:text-foreground"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(a.symbol);
                          }}
                        >
                          <Star className={cn("size-4", isFav && "fill-foreground text-foreground")} />
                        </button>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">{a.symbol}</p>
                          <p className="truncate text-xs text-muted-foreground">{a.name}</p>
                        </div>
                        <span className="text-[10px] text-muted-foreground">
                          {CATEGORY_META[a.category].emoji}
                        </span>
                        <div className="w-24 text-right">
                          <p className="ms-mono text-sm">${formatPrice(q?.price ?? a.basePrice)}</p>
                          <p className={cn("ms-mono text-xs", chg >= 0 ? "ms-up" : "ms-down")}>
                            {chg >= 0 ? "+" : ""}
                            {chg.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </section>

          {/* Right: AI traders + comments */}
          <aside className="flex flex-col gap-6">
            <Card className="border-border/60 shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">AI traders</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {AI_TRADERS.map((t) => (
                  <div key={t.id} className="border-b border-border/40 pb-3 last:border-b-0 last:pb-0">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{t.emoji}</span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium">{t.name}</p>
                        <p className="truncate text-xs text-muted-foreground">{t.bio}</p>
                      </div>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Focus: {t.focus.join(", ")}
                    </p>
                    <p className="ms-mono mt-1 text-xs text-muted-foreground">
                      Holds:{" "}
                      {Object.entries(t.holdings)
                        .map(([s, qty]) => `${qty} ${s}`)
                        .join(" · ")}
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-border/60 shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Comments on {selected}</CardTitle>
              </CardHeader>
              <CardContent>
                {comments === undefined ? (
                  <div className="flex items-center gap-2 py-2 text-sm text-muted-foreground">
                    <Loader2 className="size-4 animate-spin" /> Loading…
                  </div>
                ) : comments.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No comments yet. Open {selected} to start the thread.
                  </p>
                ) : (
                  <div className="flex max-h-60 flex-col gap-2 overflow-y-auto">
                    {comments.map((c) => (
                      <div key={c._id} className="ms-fade-in border-b border-border/40 pb-2 last:border-b-0">
                        <p className="text-sm">{c.body}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">{c.author}</p>
                      </div>
                    ))}
                  </div>
                )}
                <Link
                  to={`/asset/${selected}`}
                  className="mt-3 inline-block text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
                >
                  Open {selected} detail →
                </Link>
              </CardContent>
            </Card>

            <Card className="border-border/60 shadow-none">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Your holdings</CardTitle>
              </CardHeader>
              <CardContent>
                {holdings.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No holdings yet — click an asset to trade.</p>
                ) : (
                  holdings.map((h) => {
                    const price = quotes.get(h.symbol)?.price ?? h.avgCost;
                    const pl = (price - h.avgCost) * h.qty;
                    return (
                      <div key={h.symbol} className="flex items-center justify-between border-b border-border/40 py-1.5 last:border-b-0">
                        <div>
                          <p className="text-sm font-medium">{h.symbol}</p>
                          <p className="text-xs text-muted-foreground">
                            {h.qty} @ avg ${formatPrice(h.avgCost)}
                          </p>
                        </div>
                        <p className={cn("ms-mono text-sm", pl >= 0 ? "ms-up" : "ms-down")}>
                          {pl >= 0 ? "+" : "−"}${formatPrice(Math.abs(pl))}
                        </p>
                      </div>
                    );
                  })
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
        )}
      </div>
    </main>
  );
}
