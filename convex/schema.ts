import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  // Table to store user profile data, linked to Clerk
  users: defineTable({
    fullName: v.string(),
    email: v.string(),
    bloodType: v.string(),
    clerkId: v.string(), // The Clerk User ID
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    badges: v.optional(v.array(v.string())),
    donationsCount: v.optional(v.number()),
    lastDonationDate: v.optional(v.number()),
    medicalHistory: v.optional(v.any()), // Storing as object/any for flexibility
    isEligible: v.optional(v.boolean()),
    eligibilityDate: v.optional(v.number()),
  }).index("by_clerkId", ["clerkId"]), // Index for fast lookups by Clerk ID

  bloodRequests: defineTable({
    patientName: v.string(),
    hospitalName: v.string(),
    bloodType: v.string(),
    unitsRequired: v.number(),
    requesterClerkId: v.string(),
    isFulfilled: v.boolean(),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    createdAt: v.number(),
    updatedAt: v.number(),
  }).index("by_bloodType", ["bloodType"])
    .index("by_requester", ["requesterClerkId"])
    .index("by_fulfilled", ["isFulfilled"]),

  notifications: defineTable({
    userId: v.string(), // Clerk ID
    type: v.string(), // 'request', 'badge', 'message', 'system'
    message: v.string(),
    isRead: v.boolean(),
    relatedId: v.optional(v.string()), // ID of related request/badge/etc
    createdAt: v.number(),
  }).index("by_user", ["userId"]),

  conversations: defineTable({
    participants: v.array(v.string()), // Array of Clerk IDs
    lastMessageAt: v.number(),
  }).index("by_participant", ["participants"]), // Note: Convex doesn't support array indexing directly like this for "contains", usually need separate logic or separate table, but for simple 2-person chat we can query by filtering. Better: separate participant table or just scan for MVP.
  // For MVP efficient querying, we might need a separate table or just filter in code if scale is small. 
  // Let's keep it simple: we'll query all conversations and filter in function or use a dedicated mapping if needed. 
  // Actually, Convex supports `.filter` which is fine for MVP.

  messages: defineTable({
    conversationId: v.id("conversations"),
    senderId: v.string(),
    content: v.string(),
    type: v.string(), // 'text', 'image'
    createdAt: v.number(),
  }).index("by_conversation", ["conversationId"]),

  appointments: defineTable({
    donorId: v.string(),
    centerName: v.string(), // For MVP, just string. In real app, relation to centers table.
    date: v.number(),
    status: v.string(), // 'scheduled', 'completed', 'cancelled'
    type: v.string(), // 'whole_blood', 'platelets'
    createdAt: v.number(),
  }).index("by_donor", ["donorId"]),

  donations: defineTable({
    donorId: v.string(),
    date: v.number(),
    units: v.number(),
    type: v.string(),
    location: v.string(),
    certificateUrl: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_donor", ["donorId"]),
});
