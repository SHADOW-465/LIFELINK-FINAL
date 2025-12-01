import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getAvailableSlots = query({
    args: {},
    handler: async () => {
        // Mock data for MVP
        const today = new Date();
        const slots = [];
        for (let i = 1; i <= 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() + i);
            slots.push({
                date: date.getTime(),
                slots: ["10:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"]
            });
        }
        return slots;
    },
});

export const getUserAppointments = query({
    args: { userId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("appointments")
            .withIndex("by_donor", (q) => q.eq("donorId", args.userId))
            .order("desc")
            .collect();
    },
});

export const bookAppointment = mutation({
    args: {
        donorId: v.string(),
        centerName: v.string(),
        date: v.number(),
        type: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("appointments", {
            donorId: args.donorId,
            centerName: args.centerName,
            date: args.date,
            status: "scheduled",
            type: args.type,
            createdAt: Date.now(),
        });
    },
});

export const cancelAppointment = mutation({
    args: { appointmentId: v.id("appointments") },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.appointmentId, { status: "cancelled" });
    }
});
