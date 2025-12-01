import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

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
    if (!identity) throw new Error("Not authenticated");

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

// Mutation to help with a request (mark as fulfilled)
export const helpWithRequest = mutation({
  args: {
    requestId: v.id("bloodRequests"),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const request = await ctx.db.get(args.requestId);
    if (!request) throw new Error("Request not found");

    if (request.isFulfilled) {
      throw new Error("This request has already been fulfilled");
    }

    // Mark the request as fulfilled
    await ctx.db.patch(args.requestId, {
      isFulfilled: true,
      updatedAt: Date.now(),
    });

    return { success: true, message: "Thank you for helping! The requester has been notified." };
  },
});
