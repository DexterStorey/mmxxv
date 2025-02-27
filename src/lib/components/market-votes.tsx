'use client'

import { useSession } from '@rubriclab/auth'
import { Button, Section } from '@rubriclab/ui'
import { downvoteMarket, upvoteMarket } from '~/actions/market'
import type { MarketWithVotesAndComments } from '~/types/market'

export function MarketVotes({ market }: { market: MarketWithVotesAndComments }) {
	const { user } = useSession()
	const hasUpvoted = market.upvoters.some(u => u.userId === user?.id)
	const hasDownvoted = market.downvoters.some(u => u.userId === user?.id)

	return (
		<Section>
			<Button
				ROLE="success"
				className={`vote-button up ${hasUpvoted ? 'active' : ''}`}
				onClick={() => upvoteMarket(market.id)}
				disabled={!user}
			>
				<span className="vote-count">↑ {market.upvotes}</span>
				<span className="vote-label">Upvote</span>
			</Button>
			<Button
				ROLE="destructive"
				className={`vote-button down ${hasDownvoted ? 'active' : ''}`}
				onClick={() => downvoteMarket(market.id)}
				disabled={!user}
			>
				<span className="vote-count">↓ {market.downvotes}</span>
				<span className="vote-label">Downvote</span>
			</Button>
		</Section>
	)
}
