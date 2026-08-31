import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Comments on a single asset's detail page.

export const listForSymbol = query({
  args: { symbol: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("comments")
      .withIndex("by_symbol", (q) => q.eq("symbol", args.symbol))
      .order("desc")
      .take(100);
  },
});

export const add = mutation({
  args: {
    symbol: v.string(),
    author: v.string(),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    const body = args.body.trim().slice(0, 500);
    if (!body) return;
    await ctx.db.insert("comments", {
      symbol: args.symbol.toUpperCase(),
      author: args.author.slice(0, 40),
      body,
    });
  },
});
