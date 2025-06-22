import { ConvexError, v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ✅ Create Conversation
export const createConversation = mutation({
	args: {
		participants: v.array(v.id("users")),
		isGroup: v.boolean(),
		groupName: v.optional(v.string()),
		groupImage: v.optional(v.id("_storage")),
		admin: v.optional(v.id("users")),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new ConvexError("Unauthorized");

		// ✅ Ensure consistent participant comparison
		const sortedParticipants = [...args.participants].sort();

		const existingConversation = await ctx.db
			.query("conversations")
			.filter((q) => q.eq(q.field("participants"), sortedParticipants))
			.first();

		if (existingConversation) {
			return existingConversation._id;
		}

		let groupImage;

		if (args.groupImage) {
			groupImage = (await ctx.storage.getUrl(args.groupImage)) as string;
		}

		const conversationId = await ctx.db.insert("conversations", {
			participants: sortedParticipants,
			isGroup: args.isGroup,
			groupName: args.groupName,
			groupImage,
			admin: args.admin,
		});

		return conversationId;
	},
});

// ✅ Get My Conversations
export const getMyConversations = query({
	args: {},
	handler: async (ctx) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) return []; // ✅ Prevent crash if not signed in

		const user = await ctx.db
			.query("users")
			.withIndex("by_tokenIdentifier", (q) =>
				q.eq("tokenIdentifier", identity.tokenIdentifier)
			)
			.unique();

		if (!user) return []; // ✅ Avoid throwing error on missing user

		const conversations = await ctx.db.query("conversations").collect();

		const myConversations = conversations.filter((c) =>
			c.participants.includes(user._id)
		);

		const conversationsWithDetails = await Promise.all(
			myConversations.map(async (conversation) => {
				let userDetails = {};

				if (!conversation.isGroup) {
					const otherUserId = conversation.participants.find(
						(id) => id !== user._id
					);
					const userProfile = await ctx.db
						.query("users")
						.filter((q) => q.eq(q.field("_id"), otherUserId))
						.take(1);

					userDetails = userProfile[0];
				}

				const lastMessage = await ctx.db
					.query("messages")
					.filter((q) => q.eq(q.field("conversation"), conversation._id))
					.order("desc")
					.take(1);

				return {
					...userDetails,
					...conversation,
					lastMessage: lastMessage[0] || null,
				};
			})
		);

		return conversationsWithDetails;
	},
});

// ✅ Kick User From Conversation
export const kickUser = mutation({
	args: {
		conversationId: v.id("conversations"),
		userId: v.id("users"),
	},
	handler: async (ctx, args) => {
		const identity = await ctx.auth.getUserIdentity();
		if (!identity) throw new ConvexError("Unauthorized");

		const conversation = await ctx.db
			.query("conversations")
			.filter((q) => q.eq(q.field("_id"), args.conversationId))
			.unique();

		if (!conversation) throw new ConvexError("Conversation not found");

		// Optional: Check if current user is admin
		// const user = await ctx.db
		// 	.query("users")
		// 	.withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", identity.tokenIdentifier))
		// 	.unique();
		// if (conversation.admin !== user?._id) throw new ConvexError("Only admin can kick users");

		await ctx.db.patch(args.conversationId, {
			participants: conversation.participants.filter((id) => id !== args.userId),
		});
	},
});

// ✅ Upload URL Generator
export const generateUploadUrl = mutation(async (ctx) => {
	return await ctx.storage.generateUploadUrl();
});
