'use server'

import type { MarketCategory } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { getSession } from '~/actions/auth'
import { MAX_MARKETS_PER_USER } from '~/constants'
import { db } from '~/db'
import { handleNewComment } from '~/services/notifications'
import type { MarketFromAction } from '~/types/market'
import { generateMarketCategories } from '~/utils/category-generation'
import { generateMarketImage } from '~/utils/image-generation'

export async function createMarket(data: {
	title: string
	description: string
	resolutionCriteria: string
}) {
	const { user } = await getSession()

	const marketCount = await db.market.count({
		where: {
			authorId: user.id
		}
	})

	if (marketCount >= MAX_MARKETS_PER_USER) {
		throw new Error(`You can only create up to ${MAX_MARKETS_PER_USER} markets`)
	}

	const [imageUrl, categories] = await Promise.all([
		generateMarketImage(data.title, data.description),
		generateMarketCategories(data.title, data.description)
	])

	const market = await db.market.create({
		data: {
			...data,
			imageUrl,
			categories,
			authorId: user.id
		}
	})

	revalidatePath('/markets')
	return { id: market.id }
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
					createdAt: 'asc'
				},
				include: {
					author: {
						select: {
							id: true,
							email: true,
							username: true
						}
					},
					reactions: {
						select: {
							type: true,
							authorId: true
						}
					},
					replies: {
						orderBy: {
							createdAt: 'asc'
						},
						include: {
							author: {
								select: {
									id: true,
									email: true,
									username: true
								}
							},
							reactions: {
								select: {
									type: true,
									authorId: true
								}
							},
							replies: {
								orderBy: {
									createdAt: 'asc'
								},
								include: {
									author: {
										select: {
											id: true,
											email: true,
											username: true
										}
									},
									reactions: {
										select: {
											type: true,
											authorId: true
										}
									},
									replies: {
										orderBy: {
											createdAt: 'asc'
										},
										include: {
											author: {
												select: {
													id: true,
													email: true,
													username: true
												}
											},
											reactions: {
												select: {
													type: true,
													authorId: true
												}
											},
											replies: {
												orderBy: {
													createdAt: 'asc'
												},
												include: {
													author: {
														select: {
															id: true,
															email: true,
															username: true
														}
													},
													reactions: {
														select: {
															type: true,
															authorId: true
														}
													}
												}
											}
										}
									}
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

	// Recursively build the comment tree with depth tracking
	const commentMap = new Map<string, CommentWithReplies>()
	const rootComments: CommentWithReplies[] = []

	// First pass: Create all comment objects
	for (const comment of market.comments) {
		commentMap.set(comment.id, { ...comment, replies: [] })
	}

	// Second pass: Build the tree structure
	for (const comment of market.comments) {
		const commentWithReplies = commentMap.get(comment.id)
		if (!commentWithReplies) continue

		if (comment.parentId) {
			const parent = commentMap.get(comment.parentId)
			if (parent) {
				parent.replies.push(commentWithReplies)
			}
		} else {
			rootComments.push(commentWithReplies)
		}
	}

	// Sort all replies by createdAt
	const sortReplies = (comments: CommentWithReplies[]) => {
		comments.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())
		for (const comment of comments) {
			if (comment.replies.length > 0) {
				sortReplies(comment.replies)
			}
		}
	}

	sortReplies(rootComments)

	return {
		...market,
		comments: rootComments
	}
}

export async function getMarkets({
	search,
	category,
	limit = 50
}: {
	search?: string | undefined
	category?: MarketCategory | undefined
	limit?: number
}): Promise<MarketFromAction[]> {
	return await db.market.findMany({
		where: {
			AND: [
				search
					? {
							OR: [
								{ title: { contains: search, mode: 'insensitive' } },
								{ description: { contains: search, mode: 'insensitive' } }
							]
						}
					: {},
				category ? { categories: { has: category } } : {}
			]
		},
		take: limit,
		orderBy: [
			{
				upvotes: 'desc'
			},
			{
				downvotes: 'asc'
			},
			{
				updatedAt: 'desc'
			}
		],
		include: {
			author: {
				select: {
					id: true,
					email: true,
					username: true
				}
			},
			upvoters: {
				select: { userId: true }
			},
			downvoters: {
				select: { userId: true }
			},
			comments: {
				orderBy: { createdAt: 'desc' },
				include: {
					author: {
						select: {
							id: true,
							email: true,
							username: true
						}
					}
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

export async function deleteComment(commentId: string) {
	const session = await getSession()
	if (!session.user) throw new Error('Not authenticated')

	// Check if comment exists and user is the author
	const comment = await db.comment.findUnique({
		where: { id: commentId },
		select: {
			authorId: true,
			marketId: true
		}
	})

	if (!comment) {
		throw new Error('Comment not found')
	}

	if (comment.authorId !== session.user.id) {
		throw new Error('Unauthorized')
	}

	await db.comment.delete({
		where: { id: commentId }
	})

	revalidatePath(`/markets/${comment.marketId}`)
	return comment.marketId
}

export async function regenerateMarketImage(marketId: string) {
	const { user } = await getSession()

	const market = await db.market.findUnique({
		where: { id: marketId },
		select: {
			authorId: true,
			title: true,
			description: true
		}
	})

	if (!market) {
		throw new Error('Market not found')
	}

	if (market.authorId !== user.id) {
		throw new Error('You can only regenerate images for your own markets')
	}

	const imageUrl = await generateMarketImage(market.title, market.description)

	if (!imageUrl) {
		throw new Error('Failed to generate new image')
	}

	await db.market.update({
		where: { id: marketId },
		data: { imageUrl }
	})

	revalidatePath(`/markets/${marketId}`)
}
