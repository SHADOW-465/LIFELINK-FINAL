import { internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Query to check if a user exists
export const getUser = internalQuery({
  args: { clerkId: v.string() },
  async handler(ctx, args) {
    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .unique();
  },
});

// Public query to get current user
export const getCurrentUser = query({
  args: {},
  async handler(ctx) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    return await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();
  },
});

// Mutation to create a new user profile
export const createUser = internalMutation({
  args: {
    clerkId: v.string(),
    fullName: v.string(),
    email: v.string(),
    bloodType: v.string(),
  },
  async handler(ctx, args) {
    await ctx.db.insert("users", args);
  },
});

// Public mutation to create/update user profile
export const createOrUpdateUser = mutation({
  args: {
    fullName: v.string(),
    email: v.string(),
    bloodType: v.string(),
  },
  async handler(ctx, args) {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", identity.subject))
      .unique();

    if (existingUser) {
      await ctx.db.patch(existingUser._id, {
        fullName: args.fullName,
        email: args.email,
        bloodType: args.bloodType,
      });
      return existingUser._id;
    } else {
      return await ctx.db.insert("users", {
        clerkId: identity.subject,
        fullName: args.fullName,
        email: args.email,
        bloodType: args.bloodType,
      });
    }
  },
});
