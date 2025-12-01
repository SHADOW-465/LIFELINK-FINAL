import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Mutation to seed sample data (for development only)
export const seedSampleData = mutation({
  args: {},
  async handler(ctx) {
    // Add sample blood requests
    const sampleRequests = [
      {
        patientName: "Sarah Johnson",
        hospitalName: "City General Hospital",
        bloodType: "A+",
        unitsRequired: 2,
        isFulfilled: false,
        requesterClerkId: "sample_requester_1",
        createdAt: Date.now() - 3600000, // 1 hour ago
        updatedAt: Date.now() - 3600000,
      },
      {
        patientName: "Michael Chen",
        hospitalName: "Regional Medical Center",
        bloodType: "O-",
        unitsRequired: 1,
        isFulfilled: false,
        requesterClerkId: "sample_requester_2",
        createdAt: Date.now() - 7200000, // 2 hours ago
        updatedAt: Date.now() - 7200000,
      },
      {
        patientName: "Emily Rodriguez",
        hospitalName: "University Hospital",
        bloodType: "B+",
        unitsRequired: 3,
        isFulfilled: false,
        requesterClerkId: "sample_requester_3",
        createdAt: Date.now() - 1800000, // 30 minutes ago
        updatedAt: Date.now() - 1800000,
      },
      {
        patientName: "David Kim",
        hospitalName: "Metro Health Center",
        bloodType: "AB+",
        unitsRequired: 1,
        isFulfilled: false,
        requesterClerkId: "sample_requester_4",
        createdAt: Date.now() - 900000, // 15 minutes ago
        updatedAt: Date.now() - 900000,
      },
    ];

    for (const request of sampleRequests) {
      await ctx.db.insert("bloodRequests", request);
    }

    return { message: "Sample data seeded successfully" };
  },
});
