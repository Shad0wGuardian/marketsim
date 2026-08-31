import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// MarketSim v1: one global lobby chat. AI lines and player messages live here.

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("chat").order("desc").take(100);
  },
});

export const send = mutation({
  args: {
    author: v.string(),
    kind: v.union(v.literal("player"), v.literal("ai"), v.literal("system")),
    text: v.string(),
    traderId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const text = args.text.trim().slice(0, 500);
    if (!text) return;
    await ctx.db.insert("chat", {
      author: args.author.slice(0, 40),
      kind: args.kind,
      text,
      traderId: args.traderId,
    });
  },
});
