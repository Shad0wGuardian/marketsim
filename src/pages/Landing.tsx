import { Link } from "react-router";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { ASSETS, AI_TRADERS, CATEGORY_META, CATEGORY_ORDER } from "@/lib/marketsim";
import { ArrowRight, CandlestickChart, MessageSquare, Users } from "lucide-react";

// MarketSim landing — minimalism: near-monochrome, hairline dividers, generous space.
export default function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen bg-background text-foreground"
    >
      <div className="mx-auto flex w-full max-w-4xl flex-col px-6">
        {/* Nav */}
        <nav className="flex items-center justify-between border-b border-border/60 py-5">
          <span className="ms-mono text-sm font-semibold tracking-tight">MarketSim</span>
          <Button asChild variant="ghost" className="cursor-pointer">
            <Link to={isAuthenticated ? "/dashboard" : "/auth"}>
              {isAuthenticated ? "Dashboard" : "Sign in"}
            </Link>
          </Button>
        </nav>

        {/* Hero */}
        <section className="flex flex-col items-center gap-6 py-28 text-center sm:py-36">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Paper trading · simulated market
          </p>
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
            Trade 92 assets against five AI traders.
          </h1>
          <p className="max-w-xl text-base leading-7 text-muted-foreground">
            Live candlestick charts, a market that re-prices every 8 seconds, and a
            trading floor where ComradeBot, HedgeHogAI, TraderBot, CryptoBro, and
            GoldBugAI talk through every move.
          </p>
          <Button asChild size="lg" className="cursor-pointer gap-2">
            <Link to={isAuthenticated ? "/dashboard" : "/auth"}>
              Start trading <ArrowRight className="size-4" />
            </Link>
          </Button>
        </section>

        {/* Features */}
        <section className="grid gap-px border-y border-border/60 bg-border/60 sm:grid-cols-3">
          {[
            {
              icon: <CandlestickChart className="size-5" />,
              title: "Real charts",
              body: "Candlesticks with volume, 1D to 1Y intervals, powered by TradingView Lightweight Charts.",
            },
            {
              icon: <Users className="size-5" />,
              title: `${ASSETS.length} assets, 4 categories`,
              body: CATEGORY_ORDER.map((c) => CATEGORY_META[c].label).join(" · ") + " — all simulated locally.",
            },
            {
              icon: <MessageSquare className="size-5" />,
              title: "AI chat floor",
              body: `${AI_TRADERS.length} AI traders with distinct personalities, portfolios, and takes on every tick.`,
            },
          ].map((f) => (
            <div key={f.title} className="flex flex-col gap-2 bg-background p-6">
              <span className="text-muted-foreground">{f.icon}</span>
              <h2 className="text-sm font-semibold tracking-tight">{f.title}</h2>
              <p className="text-sm leading-6 text-muted-foreground">{f.body}</p>
            </div>
          ))}
        </section>

        {/* AI roster */}
        <section className="py-20">
          <h2 className="text-xs uppercase tracking-[0.2em] text-muted-foreground">The floor</h2>
          <ul className="mt-6 flex flex-col divide-y divide-border/60">
            {AI_TRADERS.map((t) => (
              <li key={t.id} className="flex items-baseline gap-4 py-4">
                <span className="text-xl">{t.emoji}</span>
                <div className="min-w-0">
                  <p className="text-sm font-semibold tracking-tight">{t.name}</p>
                  <p className="text-sm text-muted-foreground">{t.bio}</p>
                </div>
                <span className="ms-mono ml-auto hidden shrink-0 text-xs text-muted-foreground sm:block">
                  {t.focus.join(" · ")}
                </span>
              </li>
            ))}
          </ul>
        </section>

        {/* CTA */}
        <section className="flex flex-col items-center gap-4 border-t border-border/60 py-20 text-center">
          <h2 className="text-2xl font-bold tracking-tight">$100,000 in play money. Zero risk.</h2>
          <p className="text-sm text-muted-foreground">
            Learn diversification, correlation, and trading psychology — by doing.
          </p>
          <Button asChild variant="outline" className="cursor-pointer gap-2">
            <Link to={isAuthenticated ? "/dashboard" : "/auth"}>
              {isAuthenticated ? "Open dashboard" : "Create your account"} <ArrowRight className="size-4" />
            </Link>
          </Button>
        </section>

        <footer className="border-t border-border/60 py-6 text-center text-xs text-muted-foreground">
          MarketSim — simulated prices for education. Not investment advice.
        </footer>
      </div>
    </motion.main>
  );
}
