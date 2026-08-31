import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { authTables } from "@convex-dev/auth/server";

export default defineSchema({
  ...authTables,

  // Comments on a single asset detail page.
  comments: defineTable({
    symbol: v.string(),
    author: v.string(),
    body: v.string(),
  }).index("by_symbol", ["symbol"]),

  // Global trading-floor chat feed.
  chat: defineTable({
    author: v.string(),
    kind: v.union(v.literal("player"), v.literal("ai"), v.literal("system")),
    text: v.string(),
    traderId: v.optional(v.string()),
  }),
});
