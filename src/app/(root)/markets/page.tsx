import { getSession } from '~/actions/auth'
import { CreateMarketForm } from '~/components/create-market-form'
import type { MarketWithVotesAndComments } from '~/components/market-item'
import { MarketsTable } from '~/components/markets-table'
import Nav from '~/components/nav'
import { db } from '~/db'

export default async function MarketsPage() {
	const { user } = await getSession()

	const marketCount = await db.market.count({
		where: {
			authorId: user.id
		}
	})

	const markets = await db.market.findMany({
		orderBy: [
			{
				upvotes: 'desc'
			},
			{
				downvotes: 'asc'
			},
			{
				createdAt: 'asc'
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

	return (
		<>
			<Nav />
			<div className="container">
				<div className="card">
					<div
						className="card-header"
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'flex-start',
							gap: '2rem',
							padding: '1rem'
						}}
					>
						<div>
							<h1 className="title" style={{ margin: 0, marginBottom: '0.5rem', fontFamily: 'inherit' }}>
								Market Proposals
							</h1>
							<p className="description" style={{ margin: 0, color: 'var(--muted)' }}>
								Market Proposals are due on January 20. Submit markets and vote on which ones you want to
								see in the game!
							</p>
						</div>
						<CreateMarketForm marketCount={marketCount} buttonText="Propose Market" />
					</div>
					<div className="overflow-x-auto">
						<MarketsTable markets={marketsWithReplies} />
					</div>
				</div>
			</div>
		</>
	)
}
