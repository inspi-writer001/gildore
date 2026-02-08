import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("traitTypes")
      .withIndex("by_name")
      .collect();
  },
});

export const create = mutation({
  args: { name: v.string() },
  handler: async (ctx, { name }) => {
    const normalized = name.trim().toLowerCase();
    if (!normalized) throw new Error("Trait type name cannot be empty");

    const existing = await ctx.db
      .query("traitTypes")
      .withIndex("by_name", (q) => q.eq("name", normalized))
      .first();

    if (existing) return existing._id;

    return await ctx.db.insert("traitTypes", {
      name: normalized,
      createdAt: Date.now(),
    });
  },
});
