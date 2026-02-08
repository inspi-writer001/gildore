import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  traitTypes: defineTable({
    name: v.string(),
    createdAt: v.number(),
  }).index("by_name", ["name"]),
});
