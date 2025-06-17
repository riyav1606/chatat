import { defineSchema, defineTable } from "convex/server";
import {v} from "convex/values"

export default defineSchema({
    tasks: defineTable({
        text: v.string(),
        completed: v.boolean(),
    }),
    products: defineTable({
        name: v.string(),
        price: v.number(),
    }),
});
/*
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  messages: defineTable({
    body: v.string(),
    user: v.id("users"),
  }),
  users: defineTable({
    name: v.string(),
    tokenIdentifier: v.string(),
  }).index("by_token", ["tokenIdentifier"]),
});
*/