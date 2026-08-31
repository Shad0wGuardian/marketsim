import {
  createChart,
  ColorType,
  CandlestickSeries,
  HistogramSeries,
  type IChartApi,
  type ISeriesApi,
  type CandlestickData,
  type HistogramData,
  type UTCTimestamp,
} from "lightweight-charts";
import { useEffect, useRef } from "react";
import type { Quote } from "@/lib/marketsim";

// Candlestick + volume chart for one asset, styled for the dark minimalism theme.
export function PriceChart({ quote }: { quote: Quote | undefined }) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const volRef = useRef<ISeriesApi<"Histogram"> | null>(null);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const chart = createChart(el, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "rgba(235,235,235,0.55)",
        fontFamily: "ui-monospace, Menlo, Consolas, monospace",
      },
      grid: {
        vertLines: { color: "rgba(255,255,255,0.04)" },
        horzLines: { color: "rgba(255,255,255,0.04)" },
      },
      rightPriceScale: { borderVisible: false },
      timeScale: { borderVisible: false, timeVisible: false },
      crosshair: {
        vertLine: { color: "rgba(255,255,255,0.2)", labelBackgroundColor: "#3a3a3a" },
        horzLine: { color: "rgba(255,255,255,0.2)", labelBackgroundColor: "#3a3a3a" },
      },
      height: 320,
    });
    const candles: ISeriesApi<"Candlestick"> = chart.addSeries(CandlestickSeries, {
      upColor: "#5fbf8a",
      downColor: "#d96a55",
      borderVisible: false,
      wickUpColor: "#5fbf8a",
      wickDownColor: "#d96a55",
    });
    const vol: ISeriesApi<"Histogram"> = chart.addSeries(HistogramSeries, {
      priceFormat: { type: "volume" },
      priceScaleId: "",
      color: "rgba(255,255,255,0.18)",
    });
    chart.priceScale("").applyOptions({ scaleMargins: { top: 0.8, bottom: 0 } });
    chartRef.current = chart;
    candleRef.current = candles;
    volRef.current = vol;

    const ro = new ResizeObserver(() => {
      chart.applyOptions({ width: el.clientWidth });
    });
    ro.observe(el);
    return () => {
      ro.disconnect();
      chart.remove();
      chartRef.current = null;
    };
  }, []);

  useEffect(() => {
    const chart = chartRef.current;
    const candles = candleRef.current;
    const vol = volRef.current;
    if (!chart || !candles || !vol || !quote) return;
    candles.setData(
      quote.history.map(
        (b): CandlestickData<UTCTimestamp> => ({
          time: b.time as UTCTimestamp,
          open: b.open,
          high: b.high,
          low: b.low,
          close: b.close,
        }),
      ),
    );
    vol.setData(
      quote.history.map(
        (b): HistogramData<UTCTimestamp> => ({
          time: b.time as UTCTimestamp,
          value: b.volume,
          color: b.close >= b.open ? "rgba(95,191,138,0.35)" : "rgba(217,106,85,0.35)",
        }),
      ),
    );
    chart.timeScale().fitContent();
  }, [quote]);

  return <div ref={containerRef} style={{ width: "100%" }} />;
}
