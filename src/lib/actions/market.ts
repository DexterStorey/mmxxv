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

export async function editMarket(data: {
	id: string
	title: string
	description: string
	resolutionCriteria: string
}) {
	const { user } = await getSession()

	// Check if user owns the market
	const market = await db.market.findUnique({
		where: { id: data.id },
		select: {
			authorId: true,
			title: true,
			description: true,
			resolutionCriteria: true
		}
	})

	if (!market) {
		throw new Error('Market not found')
	}

	if (market.authorId !== user.id) {
		throw new Error('You can only edit your own markets')
	}

	// Create edit history record
	await db.marketEdit.create({
		data: {
			marketId: data.id,
			editorId: user.id,
			previousTitle: market.title,
			previousDescription: market.description,
			previousResolutionCriteria: market.resolutionCriteria,
			newTitle: data.title,
			newDescription: data.description,
			newResolutionCriteria: data.resolutionCriteria
		}
	})

	const updatedMarket = await db.market.update({
		where: { id: data.id },
		data: {
			title: data.title,
			description: data.description,
			resolutionCriteria: data.resolutionCriteria
		}
	})

	revalidatePath('/markets')
	revalidatePath(`/markets/${data.id}`)
	return updatedMarket
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
	const session = await getSession()
	if (!session.user) throw new Error('Not authenticated')

	// Validate content
	if (!content || typeof content !== 'string' || content.trim().length === 0) {
		throw new Error('Comment content must be a non-empty string')
	}

	// Extract mentions from content
	const mentionedUserIds = extractMentions(content)
	const mentionedUsers =
		mentionedUserIds.length > 0
			? await db.user.findMany({
					where: {
						id: {
							in: mentionedUserIds
						}
					},
					select: {
						id: true
					}
				})
			: []

	// Create comment with mentions
	const commentData = {
		content: content.trim(),
		marketId,
		authorId: session.user.id,
		parentId: parentId || null
	}

	if (mentionedUsers.length > 0) {
		Object.assign(commentData, {
			mentions: {
				connect: mentionedUsers.map(user => ({ id: user.id }))
			}
		})
	}

	const comment = await db.comment.create({
		data: commentData
	})

	// Get the market and author for notification
	const market = await db.market.findUniqueOrThrow({
		where: { id: marketId }
	})

	const author = await db.user.findUniqueOrThrow({
		where: { id: session.user.id }
	})

	// Handle notifications
	await handleNewComment(comment, market, author)

	return comment.id
}

function extractMentions(content: string): string[] {
	const mentionRegex = /@\[([^:]+):([^\]]+)\]/g
	const matches = content.match(mentionRegex)
	return matches
		? matches
				.map(match => {
					const [, userId] = match.match(/@\[([^:]+):([^\]]+)\]/) || []
					return userId || ''
				})
				.filter(id => id !== '')
		: []
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
							email: true,
							username: true
						}
					},
					replies: {
						include: {
							author: {
								select: {
									id: true,
									email: true,
									username: true
								}
							}
						}
					}
				}
			},
			author: {
				select: {
					id: true,
					email: true,
					username: true
				}
			},
			edits: {
				orderBy: {
					createdAt: 'desc'
				},
				include: {
					editor: {
						select: {
							id: true,
							email: true,
							username: true
						}
					}
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
