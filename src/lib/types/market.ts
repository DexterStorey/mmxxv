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
