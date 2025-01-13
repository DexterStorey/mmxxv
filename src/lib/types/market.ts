import type { Comment, CommentReaction, Market, User } from '@prisma/client'

export type CommentWithAuthorAndReactions = Comment & {
	author: Pick<User, 'id' | 'email' | 'username'>
	reactions: Pick<CommentReaction, 'type' | 'authorId'>[]
}

export type CommentWithReplies = CommentWithAuthorAndReactions & {
	replies: CommentWithReplies[]
}

export type MarketWithVotesAndComments = Market & {
	upvoters: { userId: string }[]
	downvoters: { userId: string }[]
	comments: CommentWithReplies[]
	author: { email: string; id: string; username: string | null }
	edits: Array<{
		id: string
		createdAt: Date
		editor: {
			id: string
			username: string | null
			email: string
		}
		previousTitle: string
		previousDescription: string
		previousResolutionCriteria: string
		newTitle: string
		newDescription: string
		newResolutionCriteria: string
	}>
}

export type MarketFromAction = {
	id: string
	title: string
	description: string
	resolutionCriteria: string
	categories: string[]
	createdAt: Date
	updatedAt: Date
	authorId: string
	upvotes: number
	downvotes: number
	author: {
		id: string
		email: string
		username: string | null
	}
	upvoters: {
		userId: string
	}[]
	downvoters: {
		userId: string
	}[]
	comments: Array<{
		id: string
		content: string
		createdAt: Date
		authorId: string
		marketId: string
		parentId: string | null
		author: {
			id: string
			email: string
			username: string | null
		}
	}>
	edits: Array<{
		id: string
		createdAt: Date
		editor: {
			id: string
			email: string
			username: string | null
		}
		previousTitle: string
		previousDescription: string
		previousResolutionCriteria: string
		newTitle: string
		newDescription: string
		newResolutionCriteria: string
	}>
}
