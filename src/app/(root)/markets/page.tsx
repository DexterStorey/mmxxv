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
		include: {
			author: {
				select: { email: true, id: true }
			},
			upvoters: {
				select: { userId: true }
			},
			downvoters: {
				select: { userId: true }
			},
			comments: {
				include: {
					author: {
						select: { email: true, id: true }
					},
					replies: {
						include: {
							author: {
								select: { email: true, id: true }
							}
						}
					}
				}
			}
		}
	})

	const sortedMarkets = markets.sort((a, b) => {
		const aNetVotes = a.upvotes - a.downvotes
		const bNetVotes = b.upvotes - b.downvotes
		if (aNetVotes !== bNetVotes) {
			return bNetVotes - aNetVotes
		}
		return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime() // Then by date asc
	})

	const marketsWithReplies: MarketWithVotesAndComments[] = sortedMarkets.map(market => ({
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
					<div className="card-header">
						<h1 className="title" style={{ margin: 0, borderBottom: 'none', fontFamily: 'inherit' }}>
							Markets
						</h1>
						<CreateMarketForm marketCount={marketCount} />
					</div>
					<div className="overflow-x-auto">
						<MarketsTable markets={marketsWithReplies} />
					</div>
				</div>
			</div>
		</>
	)
}
