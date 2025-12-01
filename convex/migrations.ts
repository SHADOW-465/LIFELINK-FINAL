import { mutation } from "./_generated/server";

export const migrateUserData = mutation({
    args: {},
    handler: async (ctx) => {
        const users = await ctx.db.query("users").collect();
        for (const user of users) {
            const updates: any = {};

            // Fix clerkId from identity
            if (!user.clerkId && (user as any).identity) {
                updates.clerkId = (user as any).identity;
            }

            // Fix fullName from name
            if (!user.fullName && (user as any).name) {
                updates.fullName = (user as any).name;
            }

            // Ensure email is present (if missing)
            if (!user.email) {
                updates.email = "";
            }

            if (Object.keys(updates).length > 0) {
                await ctx.db.patch(user._id, updates);
            }
        }
    },
});
