import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Get all conversations for the current user
export const getConversations = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    // Find conversations where the user is a participant
    // Since we can't easily query arrays with 'contains' in simple queries without defining it in schema index properly or using filter,
    // we'll filter for now. For production, efficient indexing is needed.
    // However, we defined `by_participant` in schema which is an array index.
    // Convex allows checking if array contains a value using equality on the field if it's indexed?
    // Actually, `withIndex("by_participant", q => q.eq("participants", identity.subject))` won't work directly for "contains".
    // We usually need to filter.

    // Let's grab all and filter for MVP or use a separate table `userConversations`.
    // For small scale, filtering is okay.

    const allConversations = await ctx.db.query("conversations").collect();

    const userConversations = allConversations.filter(c =>
      c.participants.includes(identity.subject)
    );

    // Enrich with other participant details
    const conversationsWithDetails = await Promise.all(userConversations.map(async (conv) => {
      const otherUserId = conv.participants.find(p => p !== identity.subject);
      const otherUser = await ctx.db
        .query("users")
        .withIndex("by_clerkId", q => q.eq("clerkId", otherUserId || ""))
        .first();

      return {
        ...conv,
        otherUser: otherUser ? { fullName: otherUser.fullName, avatar: "" } : { fullName: "Unknown User", avatar: "" }
      };
    }));

    return conversationsWithDetails.sort((a, b) => b.lastMessageAt - a.lastMessageAt);
  },
});

// Get messages for a specific conversation
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

// Create or get a conversation with another user
export const createOrGetConversation = mutation({
  args: { otherUserId: v.string() },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    // Check if conversation already exists
    const allConversations = await ctx.db.query("conversations").collect();
    const existing = allConversations.find(c =>
      c.participants.includes(identity.subject) && c.participants.includes(args.otherUserId)
    );

    if (existing) {
      return existing._id;
    }

    // Create new
    const now = Date.now();
    const newId = await ctx.db.insert("conversations", {
      participants: [identity.subject, args.otherUserId],
      lastMessageAt: now,
    });

    return newId;
  },
});

// Send a message
export const sendMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    content: v.string(),
    type: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Not authenticated");

    const now = Date.now();

    await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      senderId: identity.subject,
      content: args.content,
      type: args.type,
      createdAt: now,
    });

    // Update conversation timestamp
    await ctx.db.patch(args.conversationId, {
      lastMessageAt: now,
    });
  },
});
