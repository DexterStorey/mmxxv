'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getSession } from '~/actions/auth'
import { deleteMarket } from '~/actions/market'
import { DeleteMarketModal } from './delete-market-modal'
import { MarketComments } from './market-comments'
import type { MarketWithVotesAndComments } from './market-item'
import { MarketVotes } from './market-votes'

export function MarketDetail({
	market,
	highlightedCommentId
}: {
	market: MarketWithVotesAndComments
	highlightedCommentId: string | undefined
}) {
	const router = useRouter()
	const [isDeleting, setIsDeleting] = useState(false)
	const [showDeleteModal, setShowDeleteModal] = useState(false)
	const [userId, setUserId] = useState<string | null>(null)

	useEffect(() => {
		getSession().then(session => setUserId(session.user.id))
	}, [])

	const handleDelete = async () => {
		try {
			setIsDeleting(true)
			await deleteMarket(market.id)
			router.push('/markets')
		} catch (error) {
			alert(error instanceof Error ? error.message : 'Failed to delete market')
			setIsDeleting(false)
		}
	}

	// Transform the market data to include empty replies arrays if they don't exist
	const marketWithReplies = {
		...market,
		comments: market.comments.map(comment => ({
			...comment,
			replies: comment.replies || []
		}))
	}

	return (
		<>
			<div className="card">
				<div className="card-header">
					<h1 className="title">{market.title}</h1>
					{userId === market.authorId && (
						<button
							type="button"
							onClick={() => setShowDeleteModal(true)}
							className="button button-danger"
						>
							<span>×</span>
							Delete Market
						</button>
					)}
				</div>
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
				<MarketComments market={marketWithReplies} highlightedCommentId={highlightedCommentId} />
			</div>

			<DeleteMarketModal
				isOpen={showDeleteModal}
				onClose={() => setShowDeleteModal(false)}
				onDelete={handleDelete}
				isDeleting={isDeleting}
			/>
		</>
	)
}
