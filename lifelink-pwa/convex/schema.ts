import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Table to store user profile data, linked to Clerk
  users: defineTable({
    fullName: v.string(),
    email: v.string(),
    bloodType: v.string(),
    clerkId: v.string(), // The Clerk User ID
  }).index("by_clerkId", ["clerkId"]), // Index for fast lookups by Clerk ID

  bloodRequests: defineTable({
    patientName: v.string(),
    hospitalName: v.string(),
    bloodType: v.string(),
    unitsRequired: v.number(),
    isFulfilled: v.boolean(),
    requesterClerkId: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_bloodType", ["bloodType"])
    .index("by_requester", ["requesterClerkId"])
    .index("by_fulfilled", ["isFulfilled"]),
});
