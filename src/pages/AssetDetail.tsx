import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PriceChart } from "@/components/PriceChart";
import { useAuth } from "@/hooks/use-auth";
import { useMarket } from "@/hooks/use-market";
import { CATEGORY_META, formatPrice } from "@/lib/marketsim";
import { ArrowLeft, Send, Star } from "lucide-react";
import { toast } from "sonner";

export default function AssetDetail() {
  const { symbol = "" } = useParams();
  const sym = symbol.toUpperCase();
  const navigate = useNavigate();
  const { user } = useAuth();
  const market = useMarket(user?.name ?? "you");
  const { quotes, assetMap, favorites, toggleFavorite, cash, holdings, buy, sell } = market;

  const asset = assetMap.get(sym);
  const quote = quotes.get(sym);
  const comments = useQuery(api.comments.listForSymbol, { symbol: sym });
  const addComment = useMutation(api.comments.add);

  const [qty, setQty] = useState("1");
  const [msg, setMsg] = useState("");
  const commentsRef = useRef<HTMLDivElement | null>(null);

  const holding = holdings.find((h) => h.symbol === sym);
  const qtyNum = Math.max(0, Number(qty) || 0);
  const cost = quote ? quote.price * qtyNum : 0;

  const aiTraders = useMemo(() => [], []);

  useEffect(() => {
    if (commentsRef.current && comments) {
      commentsRef.current.scrollTop = 0;
    }
  }, [comments]);

  if (!asset) {
    return (
      <main className="min-h-screen bg-background px-6 py-16 text-foreground">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-muted-foreground">Unknown symbol "{sym}".</p>
          <Button variant="outline" className="mt-6" onClick={() => navigate("/dashboard")}>
            Back to market
          </Button>
        </div>
      </main>
    );
  }

  const meta = CATEGORY_META[asset.category];
  const isFav = favorites.includes(sym);
  const change = quote?.changePct ?? 0;
  const up = change >= 0;

  const handleBuy = () => {
    if (qtyNum <= 0) return;
    if (cost > cash) {
      toast.error("Not enough cash for that order.");
      return;
    }
    if (buy(sym, qtyNum)) toast.success(`Bought ${qtyNum} ${sym} @ $${formatPrice(quote!.price)}`);
  };

  const handleSell = () => {
    if (qtyNum <= 0) return;
    if (!holding || holding.qty < qtyNum) {
      toast.error(`You only hold ${holding?.qty ?? 0} ${sym}.`);
      return;
    }
    if (sell(sym, qtyNum)) toast.success(`Sold ${qtyNum} ${sym} @ $${formatPrice(quote!.price)}`);
  };

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = msg.trim();
    if (!text) return;
    setMsg("");
    try {
      await addComment({ symbol: sym, author: user?.name ?? "you", body: text });
    } catch {
      toast.error("Could not post the comment.");
    }
  };

  return (
    <main className="min-h-screen bg-background px-4 py-8 text-foreground sm:px-6">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="flex items-center justify-between">
          <Link
            to="/dashboard"
            className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> Market
          </Link>
          <button
            type="button"
            aria-label={isFav ? "Remove from watchlist" : "Add to watchlist"}
            className="rounded p-1 text-muted-foreground transition-colors hover:text-foreground"
            onClick={() => toggleFavorite(sym)}
          >
            <Star className={`size-5 ${isFav ? "fill-foreground text-foreground" : ""}`} />
          </button>
        </header>

        <section>
          <p className="text-sm text-muted-foreground">
            {meta.emoji} {meta.label}
          </p>
          <div className="mt-1 flex flex-wrap items-baseline gap-4">
            <h1 className="text-3xl font-bold tracking-tight">
              {asset.symbol}
              <span className="ml-3 text-lg font-normal text-muted-foreground">{asset.name}</span>
            </h1>
            <p className={`ms-mono text-2xl ${up ? "ms-up" : "ms-down"}`}>
              ${formatPrice(quote?.price ?? asset.basePrice)}{" "}
              <span className="text-sm">
                {up ? "+" : ""}
                {change.toFixed(2)}%
              </span>
            </p>
          </div>
        </section>

        <section className="rounded-lg border border-border/60 bg-card p-4">
          <PriceChart quote={quote} />
        </section>

        <section className="rounded-lg border border-border/60 bg-card p-4">
          <div className="flex flex-wrap items-end gap-3">
            <label className="flex flex-col gap-1 text-sm text-muted-foreground">
              Quantity
              <Input
                type="number"
                min="0"
                step="any"
                value={qty}
                onChange={(e) => setQty(e.target.value)}
                className="ms-mono w-32"
              />
            </label>
            <p className="ms-mono pb-2 text-sm text-muted-foreground">
              order value ≈ ${formatPrice(cost)}
            </p>
            <div className="ml-auto flex gap-2 pb-1">
              <Button size="sm" onClick={handleBuy} disabled={qtyNum <= 0}>
                Buy
              </Button>
              <Button size="sm" variant="outline" onClick={handleSell} disabled={qtyNum <= 0}>
                Sell
              </Button>
            </div>
          </div>
          <p className="ms-mono mt-3 text-xs text-muted-foreground">
            cash ${formatPrice(cash)}
            {holding ? ` · holding ${holding.qty} ${sym} @ avg $${formatPrice(holding.avgCost)}` : ""}
          </p>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-medium text-muted-foreground">
            Comments {comments ? `(${comments.length})` : ""}
          </h2>
          <form onSubmit={handleComment} className="flex gap-2">
            <Input
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder={`Comment on ${sym}…`}
              maxLength={500}
            />
            <Button type="submit" size="icon" variant="outline" disabled={!msg.trim()}>
              <Send className="size-4" />
            </Button>
          </form>
          <div ref={commentsRef} className="flex max-h-80 flex-col gap-2 overflow-y-auto">
            {comments === undefined ? (
              <p className="text-sm text-muted-foreground">Loading…</p>
            ) : comments.length === 0 ? (
              <p className="text-sm text-muted-foreground">No comments yet. Start the thread.</p>
            ) : (
              comments.map((c) => (
                <div key={c._id} className="ms-fade-in rounded border border-border/60 bg-card px-3 py-2">
                  <p className="text-sm">{c.body}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{c.author}</p>
                </div>
              ))
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
