import { CreateMarketForm } from '~/components/create-market-form'
import { MarketItem } from '~/components/market-item'
import type { MarketWithVotesAndComments } from '~/components/market-item'
import Nav from '~/components/nav'
import { db } from '~/db'

export default async function MarketsPage() {
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
		},
		orderBy: {
			netVotes: 'desc'
		}
	})

	// Transform the data to include empty replies arrays for comments
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
					<div className="card-header">
						<h1 className="title" style={{ margin: 0, borderBottom: 'none', fontFamily: 'inherit' }}>
							Markets
						</h1>
						<CreateMarketForm />
					</div>

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
							{marketsWithReplies.map(market => (
								<MarketItem key={market.id} market={market} />
							))}
						</tbody>
					</table>
				</div>
			</div>
		</>
	)
}
