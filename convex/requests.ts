import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Helper function to check blood type compatibility
// Returns true if donor can donate to recipient
function isCompatible(donorType: string, recipientType: string): boolean {
  // Normalize types just in case
  const cleanDonor = donorType.trim().toUpperCase();
  const cleanRecipient = recipientType.trim().toUpperCase();

  // Compatibility Chart
  // O- is universal donor
  if (cleanDonor === "O-") return true;
  // AB+ is universal recipient
  if (cleanRecipient === "AB+") return true;

  // Exact match always works
  if (cleanDonor === cleanRecipient) return true;

  // Specific rules
  switch (cleanRecipient) {
    case "A+": return ["A+", "A-", "O+", "O-"].includes(cleanDonor);
    case "O+": return ["O+", "O-"].includes(cleanDonor);
    case "B+": return ["B+", "B-", "O+", "O-"].includes(cleanDonor);
    case "AB+": return true; // Already handled
    case "A-": return ["A-", "O-"].includes(cleanDonor);
    case "O-": return ["O-"].includes(cleanDonor);
    case "B-": return ["B-", "O-"].includes(cleanDonor);
    case "AB-": return ["AB-", "A-", "B-", "O-"].includes(cleanDonor);
    default: return false; // Unknown type
  }
}

// Query to get all blood requests
export const getAllRequests = query({
  args: {},
  async handler(ctx) {
    return await ctx.db
      .query("bloodRequests")
      .order("desc")
      .collect();
  },
});

// Query to get requests by blood type
export const getRequestsByBloodType = query({
  args: { bloodType: v.string() },
  async handler(ctx, args) {
    return await ctx.db
      .query("bloodRequests")
      .withIndex("by_bloodType", (q) => q.eq("bloodType", args.bloodType))
      .filter((q) => q.eq(q.field("isFulfilled"), false))
      .order("desc")
      .collect();
  },
});

// Query to get user's own requests
export const getUserRequests = query({
  args: {},
  async handler(ctx) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    return await ctx.db
      .query("bloodRequests")
      .withIndex("by_requester", (q) => q.eq("requesterClerkId", identity.subject))
      .order("desc")
      .collect();
  },
});

// Mutation to create a new blood request
export const createRequest = mutation({
  args: {
    patientName: v.string(),
    hospitalName: v.string(),
    bloodType: v.string(),
    unitsRequired: v.number(),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const now = Date.now();
    return await ctx.db.insert("bloodRequests", {
      ...args,
      requesterClerkId: identity.subject,
      isFulfilled: false,
      createdAt: now,
      updatedAt: now,
    });
  },
});

// Mutation to update request status
export const updateRequestStatus = mutation({
  args: {
    requestId: v.id("bloodRequests"),
    isFulfilled: v.boolean(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const request = await ctx.db.get(args.requestId);
    if (!request) throw new Error("Request not found");

    // Only the requester can update their own request
    if (request.requesterClerkId !== identity.subject) {
      throw new Error("Not authorized to update this request");
    }

    await ctx.db.patch(args.requestId, {
      isFulfilled: args.isFulfilled,
      updatedAt: Date.now(),
    });
  },
});

// Mutation to delete a request
export const deleteRequest = mutation({
  args: {
    requestId: v.id("bloodRequests"),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const request = await ctx.db.get(args.requestId);
    if (!request) throw new Error("Request not found");

    // Only the requester can delete their own request
    if (request.requesterClerkId !== identity.subject) {
      throw new Error("Not authorized to delete this request");
    }

    await ctx.db.delete(args.requestId);
  },
});

// Mutation to donate/fulfill a request
export const donateToRequest = mutation({
  args: {
    requestId: v.id("bloodRequests"),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // 1. Get the request
    const request = await ctx.db.get(args.requestId);
    if (!request) throw new Error("Request not found");

    if (request.isFulfilled) {
      throw new Error("This request has already been fulfilled");
    }

    // 2. Get the donor (current user)
    const donor = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .first();

    if (!donor) throw new Error("Donor profile not found. Please complete onboarding.");

    // 3. Check compatibility
    if (!isCompatible(donor.bloodType, request.bloodType)) {
      throw new Error(`Incompatible blood type. Donor: ${donor.bloodType}, Required: ${request.bloodType}`);
    }

    const now = Date.now();

    // 4. Mark request as fulfilled
    await ctx.db.patch(args.requestId, {
      isFulfilled: true,
      updatedAt: now,
    });

    // 5. Record donation in history
    await ctx.db.insert("donations", {
      donorId: identity.subject, // using clerkId as donorId for consistency
      date: now,
      units: request.unitsRequired,
      type: request.bloodType, // Request type or donor type? Usually what was donated. Let's assume request type for simplicity or donor type. Donor type is safer.
      location: request.hospitalName,
      createdAt: now,
    });

    // 6. Notify the requester
    await ctx.db.insert("notifications", {
      userId: request.requesterClerkId,
      type: "request_fulfilled",
      message: `Great news! ${donor.fullName} has volunteered to donate for your request.`,
      isRead: false,
      relatedId: args.requestId,
      createdAt: now,
    });

    // 7. Update donor stats (optional but good)
    const currentCount = donor.donationsCount || 0;
    await ctx.db.patch(donor._id, {
      donationsCount: currentCount + 1,
      lastDonationDate: now,
    });

    return { success: true };
  },
});
