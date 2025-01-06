import type { Comment, Market } from '@prisma/client'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MarketItem } from '~/components/market-item'
import type { MarketWithVotesAndComments } from '~/components/market-item'
import Nav from '~/components/nav'
import { db } from '~/db'

type PageProps = {
	params: Promise<{ id: string }>
}

type RawMarket = Market & {
	comments: (Comment & {
		author: { id: string; email: string }
		replies: (Comment & {
			author: { id: string; email: string }
		})[]
	})[]
	author: { id: string; email: string }
	upvoters: { userId: string }[]
	downvoters: { userId: string }[]
}

function transformMarket(market: RawMarket): MarketWithVotesAndComments {
	return {
		...market,
		comments: market.comments.map(comment => ({
			...comment,
			replies: comment.replies.map(reply => ({
				...reply,
				replies: []
			}))
		}))
	}
}

export default async function UserProfilePage({ params }: PageProps) {
	const { id } = await params

	const user = await db.user.findUnique({
		where: { id },
		include: {
			markets: {
				include: {
					author: { select: { email: true, id: true } },
					upvoters: { select: { userId: true } },
					downvoters: { select: { userId: true } },
					comments: {
						include: {
							author: { select: { email: true, id: true } },
							replies: {
								include: {
									author: { select: { email: true, id: true } }
								}
							}
						}
					}
				},
				orderBy: { createdAt: 'desc' }
			},
			upvotedMarkets: {
				include: {
					market: {
						include: {
							author: { select: { email: true, id: true } },
							upvoters: { select: { userId: true } },
							downvoters: { select: { userId: true } },
							comments: {
								include: {
									author: { select: { email: true, id: true } },
									replies: {
										include: {
											author: { select: { email: true, id: true } }
										}
									}
								}
							}
						}
					}
				}
			},
			downvotedMarkets: {
				include: {
					market: {
						include: {
							author: { select: { email: true, id: true } },
							upvoters: { select: { userId: true } },
							downvoters: { select: { userId: true } },
							comments: {
								include: {
									author: { select: { email: true, id: true } },
									replies: {
										include: {
											author: { select: { email: true, id: true } }
										}
									}
								}
							}
						}
					}
				}
			},
			comments: {
				include: {
					market: {
						include: {
							author: { select: { email: true, id: true } }
						}
					}
				},
				orderBy: { createdAt: 'desc' }
			}
		}
	})

	if (!user) {
		notFound()
	}

	// Transform the markets to include proper reply structure
	const transformedMarkets = user.markets.map(transformMarket)
	const transformedUpvotedMarkets = user.upvotedMarkets.map(({ market }) => transformMarket(market))
	const transformedDownvotedMarkets = user.downvotedMarkets.map(({ market }) =>
		transformMarket(market)
	)

	return (
		<>
			<Nav />
			<div className="container">
				<div className="card">
					<div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
						<h1 className="title" style={{ margin: 0 }}>
							{user.email}
						</h1>
						<div
							style={{
								fontSize: '2rem',
								fontWeight: 600,
								color: 'var(--success)',
								marginLeft: 'auto'
							}}
						>
							{user.points} points
						</div>
					</div>

					<div className="section">
						<h2 className="section-title">Created Markets</h2>
						<table className="table">
							<thead>
								<tr>
									<th>Title</th>
									<th>Description</th>
									<th>Author</th>
									<th>Votes</th>
									<th>Comments</th>
								</tr>
							</thead>
							<tbody>
								{transformedMarkets.map(market => (
									<MarketItem key={market.id} market={market} />
								))}
							</tbody>
						</table>
					</div>

					<div className="section">
						<h2 className="section-title">Voting Activity</h2>
						<div className="section">
							<h3 className="subtitle">Upvoted Markets</h3>
							<table className="table">
								<thead>
									<tr>
										<th>Title</th>
										<th>Description</th>
										<th>Author</th>
										<th>Votes</th>
										<th>Comments</th>
									</tr>
								</thead>
								<tbody>
									{transformedUpvotedMarkets.map(market => (
										<MarketItem key={market.id} market={market} />
									))}
								</tbody>
							</table>
						</div>

						<div className="section">
							<h3 className="subtitle">Downvoted Markets</h3>
							<table className="table">
								<thead>
									<tr>
										<th>Title</th>
										<th>Description</th>
										<th>Author</th>
										<th>Votes</th>
										<th>Comments</th>
									</tr>
								</thead>
								<tbody>
									{transformedDownvotedMarkets.map(market => (
										<MarketItem key={market.id} market={market} />
									))}
								</tbody>
							</table>
						</div>
					</div>

					<div className="section">
						<h2 className="section-title">Recent Comments</h2>
						<div className="comments-list">
							{user.comments.map(comment => (
								<div key={comment.id} className="comment">
									<Link href={`/markets/${comment.market.id}`} className="nav-link">
										{comment.market.title}
									</Link>
									<p className="section-content">{comment.content}</p>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
