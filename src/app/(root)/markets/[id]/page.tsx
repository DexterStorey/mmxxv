import { notFound } from 'next/navigation'
import { MarketDetail } from '~/components/market-detail'
import type { MarketWithVotesAndComments } from '~/components/market-item'
import Nav from '~/components/nav'
import UserPill from '~/components/user-pill'
import { db } from '~/db'
import { formatDate } from '~/utils/date'

export default async function MarketPage({
	params,
	searchParams
}: {
	params: Promise<{ id: string }>
	searchParams: Promise<{ comment?: string }>
}) {
	const { id } = await params
	const { comment: commentId } = await searchParams

	const market = await db.market.findUnique({
		where: { id },
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
					replies: {
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

	if (!market) {
		notFound()
	}

	const marketWithReplies = {
		...market,
		comments: market.comments.map(comment => ({
			...comment,
			replies: comment.replies.map(reply => ({
				...reply,
				replies: []
			}))
		}))
	}

	return (
		<>
			<Nav />
			<div className="container">
				<MarketDetail market={marketWithReplies} highlightedCommentId={commentId} />
				<div className="market-meta">
					Posted by <UserPill {...market.author} /> on {formatDate(market.createdAt)}
				</div>
			</div>
		</>
	)
}
