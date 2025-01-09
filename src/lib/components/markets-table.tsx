import type { MarketCategory } from '@prisma/client'
import React, { Suspense } from 'react'
import { db } from '~/db'
import type { MarketWithVotesAndComments } from '~/types/market'
import { MarketsTableClient } from './markets-table.client'

export const MarketsTable = ({
	search,
	category,
	limit = 50
}: {
	search?: string | undefined
	category?: MarketCategory | undefined
	limit?: number
}) => {
	return (
		<Suspense fallback={<div className="container">Loading...</div>}>
			<MarketsTableServer search={search} category={category} limit={limit} />
		</Suspense>
	)
}

export const MarketsTableServer = async ({
	search,
	category,
	limit = 50
}: {
	search?: string | undefined
	category?: MarketCategory | undefined
	limit?: number | undefined
}) => {
	const markets = await db.market.findMany({
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
				updatedAt: 'asc'
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
					},
					reactions: {
						select: {
							type: true,
							authorId: true
						}
					},
					replies: {
						orderBy: { createdAt: 'desc' },
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

	const marketsWithReplies: MarketWithVotesAndComments[] = markets.map(market => ({
		...market,
		comments: market.comments.map(comment => ({
			...comment,
			replies: comment.replies.map(reply => ({
				...reply,
				replies: []
			}))
		}))
	}))

	return <MarketsTableClient markets={marketsWithReplies} />
}
