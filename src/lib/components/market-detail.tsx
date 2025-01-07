'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getSession } from '~/actions/auth'
import { deleteMarket } from '~/actions/market'
import { DeleteMarketModal } from './delete-market-modal'
import { EditMarketForm } from './edit-market-form'
import { MarketComments } from './market-comments'
import { MarketEditHistory } from './market-edit-history'
import type { MarketWithVotesAndComments } from './market-item'
import { MarketVotes } from './market-votes'

export function MarketDetail({
	market,
	highlightedCommentId
}: {
	market: MarketWithVotesAndComments & {
		edits: Array<{
			id: string
			createdAt: Date
			editor: {
				id: string
				username: string | null
				email: string
			}
			previousTitle: string
			previousDescription: string
			previousResolutionCriteria: string
			newTitle: string
			newDescription: string
			newResolutionCriteria: string
		}>
	}
	highlightedCommentId: string | undefined
}) {
	const router = useRouter()
	const [isDeleting, setIsDeleting] = useState(false)
	const [showDeleteModal, setShowDeleteModal] = useState(false)
	const [showEditModal, setShowEditModal] = useState(false)
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
				<div className="flex items-center justify-between">
					<h1 className="font-bold text-2xl">{market.title}</h1>
					{userId === market.author.id && (
						<div className="ml-auto flex gap-2">
							<button type="button" className="button" onClick={() => setShowEditModal(true)}>
								Edit
							</button>
							<button
								type="button"
								className="button button-danger"
								onClick={() => setShowDeleteModal(true)}
								disabled={isDeleting}
							>
								{isDeleting ? 'Deleting...' : 'Delete'}
							</button>
						</div>
					)}
				</div>
				<div className="market-meta">Created by {market.author.username || market.author.email}</div>

				<div className="section">
					<h2 className="section-title">Description</h2>
					<p className="section-content">{market.description}</p>
				</div>

				<div className="section">
					<h2 className="section-title">Resolution Criteria</h2>
					<p className="section-content">{market.resolutionCriteria}</p>
				</div>

				<MarketVotes market={market} />
				<MarketEditHistory edits={market.edits || []} />
				<MarketComments market={marketWithReplies} highlightedCommentId={highlightedCommentId} />
			</div>

			{showDeleteModal && (
				<DeleteMarketModal
					isOpen={showDeleteModal}
					onClose={() => setShowDeleteModal(false)}
					onDelete={handleDelete}
					isDeleting={isDeleting}
				/>
			)}
			{showEditModal && <EditMarketForm market={market} onClose={() => setShowEditModal(false)} />}
		</>
	)
}
