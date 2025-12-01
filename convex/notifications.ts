import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const get = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("notifications")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .order("desc")
            .collect();
    },
});

export const markAsRead = mutation({
    args: { notificationId: v.id("notifications") },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.notificationId, { isRead: true });
    },
});

export const markAllAsRead = mutation({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        const notifications = await ctx.db
            .query("notifications")
            .withIndex("by_user", (q) => q.eq("userId", args.userId))
            .filter((q) => q.eq(q.field("isRead"), false))
            .collect();

        for (const notification of notifications) {
            await ctx.db.patch(notification._id, { isRead: true });
        }
    },
});

export const create = mutation({
    args: {
        userId: v.string(),
        type: v.string(),
        message: v.string(),
        relatedId: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("notifications", {
            userId: args.userId,
            type: args.type,
            message: args.message,
            isRead: false,
            relatedId: args.relatedId,
            createdAt: Date.now(),
        });
    },
});
