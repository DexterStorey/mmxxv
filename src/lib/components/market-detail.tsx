'use client'

import { MarketComments } from './market-comments'
import type { MarketWithVotesAndComments } from './market-item'
import { MarketVotes } from './market-votes'

export function MarketDetail({ market }: { market: MarketWithVotesAndComments }) {
	// Transform the market data to include empty replies arrays if they don't exist
	const marketWithReplies = {
		...market,
		comments: market.comments.map(comment => ({
			...comment,
			replies: comment.replies || []
		}))
	}

	return (
		<div className="card">
			<h1 className="title">{market.title}</h1>
			<div className="market-meta">Created by {market.author.email}</div>

			<div className="section">
				<h2 className="section-title">Description</h2>
				<p className="section-content">{market.description}</p>
			</div>

			<div className="section">
				<h2 className="section-title">Resolution Criteria</h2>
				<p className="section-content">{market.resolutionCriteria}</p>
			</div>

			<MarketVotes market={market} />
			<MarketComments market={marketWithReplies} />
		</div>
	)
}
