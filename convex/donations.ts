import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getUserHistory = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("donations")
            .withIndex("by_donor", (q) => q.eq("donorId", args.userId))
            .order("desc")
            .collect();
    },
});

export const logDonation = mutation({
    args: {
        donorId: v.string(),
        units: v.number(),
        type: v.string(),
        location: v.string(),
    },
    handler: async (ctx, args) => {
        const now = Date.now();
        await ctx.db.insert("donations", {
            donorId: args.donorId,
            date: now,
            units: args.units,
            type: args.type,
            location: args.location,
            createdAt: now,
        });

        // Update user stats
        const user = await ctx.db
            .query("users")
            .withIndex("by_clerkId", (q) => q.eq("clerkId", args.donorId))
            .first();

        if (user) {
            const currentCount = user.donationsCount || 0;
            const newCount = currentCount + 1;
            const badges = user.badges || [];

            // Gamification Logic
            if (newCount === 1 && !badges.includes("First Blood")) badges.push("First Blood");
            if (newCount === 5 && !badges.includes("Committed Donor")) badges.push("Committed Donor");
            if (newCount === 10 && !badges.includes("Dedicated Donor")) badges.push("Dedicated Donor");

            // Calculate eligibility (e.g., 90 days for whole blood)
            const eligibilityDate = now + (90 * 24 * 60 * 60 * 1000);

            await ctx.db.patch(user._id, {
                donationsCount: newCount,
                lastDonationDate: now,
                badges: badges,
                isEligible: false,
                eligibilityDate: eligibilityDate
            });
        }
    },
});
