import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AI_TRADERS,
  aiNetWorth,
  aiStartNetWorth,
  formatPrice,
  type Quote,
} from "@/lib/marketsim";
import { cn } from "@/lib/utils";

interface LeaderboardProps {
  quotes: Map<string, Quote>;
  playerName: string;
  playerNetWorth: number;
  /** Net worth at session start (default $100k) — the P&L baseline. */
  playerStartNetWorth?: number;
  selectedSymbol: string;
  onSelectSymbol: (symbol: string) => void;
}

const MEDALS = ["🥇", "🥈", "🥉"];

interface Row {
  id: string;
  name: string;
  emoji: string;
  badge: { text: string; className: string };
  netWorth: number;
  pl: number;
  focus: string[] | null;
  topHolding: string | null;
  isPlayer: boolean;
}

export function Leaderboard({
  quotes,
  playerName,
  playerNetWorth,
  playerStartNetWorth = 100_000,
  selectedSymbol,
  onSelectSymbol,
}: LeaderboardProps) {
  const rows = useMemo<Row[]>(() => {
    const aiRows: Row[] = AI_TRADERS.map((t) => {
      const netWorth = aiNetWorth(t, quotes);
      const start = aiStartNetWorth(t);
      const top = Object.entries(t.holdings).sort((a, b) => b[1] - a[1])[0];
      return {
        id: t.id,
        name: t.name,
        emoji: t.emoji,
        badge: { text: "AI", className: "text-amber-500/90" },
        netWorth,
        pl: netWorth - start,
        focus: t.focus,
        topHolding: top ? `${top[0]} ${top[1]}` : null,
        isPlayer: false,
      };
    });
    const player: Row = {
      id: "you",
      name: playerName || "You",
      emoji: "👤",
      badge: { text: "YOU", className: "text-foreground bg-secondary" },
      netWorth: playerNetWorth,
      pl: playerNetWorth - playerStartNetWorth,
      focus: null,
      topHolding: null,
      isPlayer: true,
    };
    return [...aiRows, player].sort((a, b) => b.netWorth - a.netWorth);
  }, [quotes, playerName, playerNetWorth, playerStartNetWorth]);

  return (
    <Card className="border-border/60 shadow-none">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm">Leaderboard</CardTitle>
        <p className="text-xs text-muted-foreground">
          Net worth = cash + holdings, live with the market.
        </p>
      </CardHeader>
      <CardContent>
        {rows.map((row, i) => {
          const up = row.pl >= 0;
          return (
            <div
              key={row.id}
              className={cn(
                "flex items-center gap-3 border-b border-border/40 py-2.5 last:border-b-0",
                row.isPlayer && "bg-secondary/40 -mx-2 rounded-md px-2",
              )}
            >
              <span className="w-7 shrink-0 text-center text-sm" title={`Rank #${i + 1}`}>
                {i < 3 ? MEDALS[i] : <span className="text-muted-foreground">{i + 1}</span>}
              </span>
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-2 text-sm font-medium">
                  <span>{row.emoji}</span>
                  <span className="truncate">{row.name}</span>
                  <span
                    className={cn(
                      "rounded-full border border-border/60 px-1.5 text-[9px] font-semibold tracking-wide",
                      row.badge.className,
                    )}
                  >
                    {row.badge.text}
                  </span>
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {row.isPlayer
                    ? "You · $100,000 start"
                    : row.focus
                      ? `${row.focus.slice(0, 3).join(" · ")}${row.topHolding ? ` · top: ${row.topHolding}` : ""}`
                      : ""}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="ms-mono text-sm">${formatPrice(row.netWorth)}</p>
                <p className={cn("ms-mono text-xs", up ? "ms-up" : "ms-down")}>
                  {up ? "+" : "−"}${formatPrice(Math.abs(row.pl))}
                </p>
              </div>
              {!row.isPlayer && row.focus && (
                <div className="hidden shrink-0 gap-1 sm:flex">
                  {row.focus.slice(0, 2).map((sym) => (
                    <button
                      key={sym}
                      type="button"
                      onClick={() => onSelectSymbol(sym)}
                      className={cn(
                        "ms-mono cursor-pointer rounded border px-1.5 py-0.5 text-[10px] transition-colors",
                        selectedSymbol === sym
                          ? "border-foreground/40 text-foreground"
                          : "border-border/60 text-muted-foreground hover:text-foreground",
                      )}
                    >
                      {sym}
                    </button>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
