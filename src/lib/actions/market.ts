'use server'

import { revalidatePath } from 'next/cache'
import { getSession } from '~/actions/auth'
import { db } from '~/db'
import { handleNewComment } from '~/services/notifications'

const MAX_MARKETS_PER_USER = 10

export async function createMarket(data: {
	title: string
	description: string
	resolutionCriteria: string
}) {
	const { user } = await getSession()

	// Check if user has reached market limit
	const marketCount = await db.market.count({
		where: {
			authorId: user.id
		}
	})

	if (marketCount >= MAX_MARKETS_PER_USER) {
		throw new Error(`You can only create up to ${MAX_MARKETS_PER_USER} markets`)
	}

	const market = await db.market.create({
		data: {
			...data,
			authorId: user.id
		}
	})

	revalidatePath('/markets')
	return market
}

export async function upvoteMarket(marketId: string) {
	const { user } = await getSession()

	const existingDownvote = await db.marketDownvotes.findUnique({
		where: {
			marketId_userId: {
				marketId,
				userId: user.id
			}
		}
	})

	if (existingDownvote) {
		await db.marketDownvotes.delete({
			where: {
				marketId_userId: {
					marketId,
					userId: user.id
				}
			}
		})
		await db.market.update({
			where: { id: marketId },
			data: {
				downvotes: { decrement: 1 }
			}
		})
	}

	const existingUpvote = await db.marketUpvotes.findUnique({
		where: {
			marketId_userId: {
				marketId,
				userId: user.id
			}
		}
	})

	if (existingUpvote) {
		await db.marketUpvotes.delete({
			where: {
				marketId_userId: {
					marketId,
					userId: user.id
				}
			}
		})
		await db.market.update({
			where: { id: marketId },
			data: {
				upvotes: { decrement: 1 }
			}
		})
	} else {
		await db.marketUpvotes.create({
			data: {
				marketId,
				userId: user.id
			}
		})
		await db.market.update({
			where: { id: marketId },
			data: {
				upvotes: { increment: 1 }
			}
		})
	}

	revalidatePath('/markets')
	revalidatePath(`/markets/${marketId}`)
}

export async function downvoteMarket(marketId: string) {
	const { user } = await getSession()

	const existingUpvote = await db.marketUpvotes.findUnique({
		where: {
			marketId_userId: {
				marketId,
				userId: user.id
			}
		}
	})

	if (existingUpvote) {
		await db.marketUpvotes.delete({
			where: {
				marketId_userId: {
					marketId,
					userId: user.id
				}
			}
		})
		await db.market.update({
			where: { id: marketId },
			data: {
				upvotes: { decrement: 1 }
			}
		})
	}

	const existingDownvote = await db.marketDownvotes.findUnique({
		where: {
			marketId_userId: {
				marketId,
				userId: user.id
			}
		}
	})

	if (existingDownvote) {
		await db.marketDownvotes.delete({
			where: {
				marketId_userId: {
					marketId,
					userId: user.id
				}
			}
		})
		await db.market.update({
			where: { id: marketId },
			data: {
				downvotes: { decrement: 1 }
			}
		})
	} else {
		await db.marketDownvotes.create({
			data: {
				marketId,
				userId: user.id
			}
		})
		await db.market.update({
			where: { id: marketId },
			data: {
				downvotes: { increment: 1 }
			}
		})
	}

	revalidatePath('/markets')
	revalidatePath(`/markets/${marketId}`)
}

export async function addComment(marketId: string, content: string, parentId?: string | null) {
	const { user: sessionUser } = await getSession()

	if (!content || typeof content !== 'string' || content.trim().length === 0) {
		throw new Error('Comment content must be a non-empty string')
	}

	const [market, user] = await Promise.all([
		db.market.findUnique({
			where: { id: marketId }
		}),
		db.user.findUnique({
			where: { id: sessionUser.id }
		})
	])

	if (!market) {
		throw new Error('Market not found')
	}

	if (!user) {
		throw new Error('User not found')
	}

	const comment = await db.comment.create({
		data: {
			content: content.trim(),
			marketId,
			authorId: user.id,
			parentId: parentId || null
		}
	})

	await handleNewComment(comment, market, user)

	revalidatePath('/markets')
	revalidatePath(`/markets/${marketId}`)

	return comment.id
}

export async function getMarketById(marketId: string) {
	const market = await db.market.findUnique({
		where: { id: marketId },
		include: {
			upvoters: true,
			downvoters: true,
			comments: {
				orderBy: {
					createdAt: 'desc'
				},
				include: {
					author: {
						select: {
							id: true,
							email: true
						}
					}
				}
			},
			author: {
				select: {
					id: true,
					email: true
				}
			}
		}
	})

	if (!market) return null

	type CommentWithReplies = (typeof market.comments)[number] & {
		replies: CommentWithReplies[]
	}

	// Recursively build the comment tree
	const commentMap = new Map<string, CommentWithReplies>(
		market.comments.map(comment => [comment.id, { ...comment, replies: [] }])
	)
	const rootComments: CommentWithReplies[] = []

	for (const comment of market.comments) {
		if (comment.parentId) {
			const parent = commentMap.get(comment.parentId)
			const commentWithReplies = commentMap.get(comment.id)
			if (parent && commentWithReplies) {
				parent.replies.push(commentWithReplies)
			}
		} else {
			const commentWithReplies = commentMap.get(comment.id)
			if (commentWithReplies) {
				rootComments.push(commentWithReplies)
			}
		}
	}

	return {
		...market,
		comments: rootComments
	}
}

export async function deleteMarket(marketId: string) {
	const { user } = await getSession()

	// Check if market exists and user is the author
	const market = await db.market.findUnique({
		where: { id: marketId },
		select: { authorId: true }
	})

	if (!market) {
		throw new Error('Market not found')
	}

	if (market.authorId !== user.id) {
		throw new Error('Unauthorized')
	}

	await db.market.delete({
		where: { id: marketId }
	})

	revalidatePath('/markets')
	revalidatePath(`/markets/${marketId}`)
}
