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
				className="vote-button"
				onClick={() => upvoteMarket(market.id)}
				disabled={!user}
			>
				<div className={`vote-up ${hasUpvoted ? 'active' : ''}`}>
					<span className="vote-count">↑ {market.upvotes}</span>
					<span className="vote-label">Upvotes</span>
				</div>
			</button>
			<button
				type="button"
				className="vote-button"
				onClick={() => downvoteMarket(market.id)}
				disabled={!user}
			>
				<div className={`vote-down ${hasDownvoted ? 'active' : ''}`}>
					<span className="vote-count">↓ {market.downvotes}</span>
					<span className="vote-label">Downvotes</span>
				</div>
			</button>
		</div>
	)
}
