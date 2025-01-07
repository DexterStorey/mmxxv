'use client'

import { useSession } from '@rubriclab/auth'
import { downvoteMarket, upvoteMarket } from '~/actions/market'
import type { MarketWithVotesAndComments } from './market-item'

export function MarketVotes({ market }: { market: MarketWithVotesAndComments }) {
	const { user } = useSession()
	const hasUpvoted = market.upvoters.some(u => u.userId === user?.id)
	const hasDownvoted = market.downvoters.some(u => u.userId === user?.id)

	return (
		<div className="votes-container">
			<button
				type="button"
				className={`vote-pill ${hasUpvoted ? 'active up' : ''}`}
				onClick={() => upvoteMarket(market.id)}
				disabled={!user}
			>
				↑{market.upvotes}
			</button>
			<button
				type="button"
				className={`vote-pill ${hasDownvoted ? 'active down' : ''}`}
				onClick={() => downvoteMarket(market.id)}
				disabled={!user}
			>
				↓{market.downvotes}
			</button>
		</div>
	)
}
