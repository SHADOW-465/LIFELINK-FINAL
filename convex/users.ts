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
    clerkId: v.string(),
    latitude: v.optional(v.number()),
    longitude: v.optional(v.number()),
    isVerified: v.optional(v.boolean()), // Passed from onboarding if completed
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    const badges = existingUser?.badges || [];
    if (args.isVerified && !badges.includes("Verified Donor")) {
      badges.push("Verified Donor");
    }

    if (existingUser) {
      await ctx.db.patch(existingUser._id, {
        fullName: args.fullName,
        email: args.email,
        bloodType: args.bloodType,
        latitude: args.latitude ?? existingUser.latitude,
        longitude: args.longitude ?? existingUser.longitude,
        badges: badges,
      });
      return existingUser._id;
    }

    const newUserId = await ctx.db.insert("users", {
      fullName: args.fullName,
      email: args.email,
      bloodType: args.bloodType,
      clerkId: args.clerkId,
      latitude: args.latitude,
      longitude: args.longitude,
      badges: badges,
      donationsCount: 0,
    });
    return newUserId;
  },
});

export const updateLocation = mutation({
  args: {
    clerkId: v.string(),
    latitude: v.number(),
    longitude: v.number(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      latitude: args.latitude,
      longitude: args.longitude,
    });
  },
});

export const incrementDonations = mutation({
  args: {
    clerkId: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const currentCount = user.donationsCount || 0;
    const newCount = currentCount + 1;
    const badges = user.badges || [];

    // Gamification Logic
    if (newCount === 1 && !badges.includes("First Blood")) badges.push("First Blood");
    if (newCount === 5 && !badges.includes("Committed Donor")) badges.push("Committed Donor");
    if (newCount === 10 && !badges.includes("Dedicated Donor")) badges.push("Dedicated Donor");

    await ctx.db.patch(user._id, {
      donationsCount: newCount,
      lastDonationDate: Date.now(),
      badges: badges,
    });
  },
});

export const updateProfile = mutation({
  args: {
    clerkId: v.string(),
    fullName: v.optional(v.string()),
    bloodType: v.optional(v.string()),
    medicalHistory: v.optional(v.any()),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_clerkId", (q) => q.eq("clerkId", args.clerkId))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    await ctx.db.patch(user._id, {
      fullName: args.fullName ?? user.fullName,
      bloodType: args.bloodType ?? user.bloodType,
      medicalHistory: args.medicalHistory ?? user.medicalHistory,
    });
  },
});
