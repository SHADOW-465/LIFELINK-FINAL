import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getConversations = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        // In a real app with many users, we'd want a more efficient index strategy
        // For MVP, we scan conversations where user is a participant
        const conversations = await ctx.db
            .query("conversations")
            .order("desc")
            .collect();

        return conversations.filter(c => c.participants.includes(args.userId));
    },
});

export const getMessages = query({
    args: { conversationId: v.id("conversations") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("messages")
            .withIndex("by_conversation", (q) => q.eq("conversationId", args.conversationId))
            .order("asc")
            .collect();
    },
});

export const createConversation = mutation({
    args: { participants: v.array(v.string()) },
    handler: async (ctx, args) => {
        // Check if conversation already exists
        const existing = await ctx.db
            .query("conversations")
            .collect();

        const found = existing.find(c =>
            c.participants.length === args.participants.length &&
            c.participants.every(p => args.participants.includes(p))
        );

        if (found) return found._id;

        return await ctx.db.insert("conversations", {
            participants: args.participants,
            lastMessageAt: Date.now(),
        });
    },
});

export const sendMessage = mutation({
    args: {
        conversationId: v.id("conversations"),
        senderId: v.string(),
        content: v.string(),
        type: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("messages", {
            conversationId: args.conversationId,
            senderId: args.senderId,
            content: args.content,
            type: args.type,
            createdAt: Date.now(),
        });

        await ctx.db.patch(args.conversationId, {
            lastMessageAt: Date.now(),
        });
    },
});
