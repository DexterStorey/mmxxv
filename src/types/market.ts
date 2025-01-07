import type { Comment, Market } from '@prisma/client'

export type CommentWithAuthor = Comment & {
	author: { email: string; id: string; username: string | null }
}

export type CommentWithReplies = CommentWithAuthor & {
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
