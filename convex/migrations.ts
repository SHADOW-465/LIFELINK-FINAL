import { mutation } from "./_generated/server";

export const migrateUserData = mutation({
    args: {},
    handler: async (ctx) => {
        const users = await ctx.db.query("users").collect();
        for (const user of users) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const updates: any = {};

            // Fix clerkId from identity
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (!user.clerkId && (user as any).identity) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                updates.clerkId = (user as any).identity;
            }

            // Fix fullName from name
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            if (!user.fullName && (user as any).name) {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
