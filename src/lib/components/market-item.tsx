'use client'

import type { Comment, Market } from '@prisma/client'
import { useSession } from '@rubriclab/auth'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { deleteMarket, downvoteMarket, upvoteMarket } from '~/actions/market'
import { formatDate, isNew } from '~/utils/date'
import UserPill from './user-pill'

export type CommentWithAuthor = Comment & {
	author: { email: string; id: string; username: string | null }
}

export type CommentWithReplies = CommentWithAuthor & {
	replies: CommentWithReplies[]
}

export type MarketWithVotesAndComments = Market & {
	upvoters: { userId: string }[]
	downvoters: { userId: string }[]
	comments: CommentWithReplies[]
	author: { email: string; id: string; username: string | null }
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

export function MarketItem({ market }: { market: MarketWithVotesAndComments }) {
	const { user } = useSession()
	const router = useRouter()
	const [isDeleting, setIsDeleting] = useState(false)
	const [showDeleteModal, setShowDeleteModal] = useState(false)
	const hasUpvoted = market.upvoters.some(u => u.userId === user?.id)
	const hasDownvoted = market.downvoters.some(u => u.userId === user?.id)
	const isOwner = user?.id === market.author.id

	const handleDelete = async () => {
		try {
			setIsDeleting(true)
			await deleteMarket(market.id)
			router.refresh()
		} catch (error) {
			alert(error instanceof Error ? error.message : 'Failed to delete market')
			setIsDeleting(false)
		}
	}

	const handleVote = async (
		e: React.MouseEvent | React.KeyboardEvent,
		action: () => Promise<void>
	) => {
		e.stopPropagation()
		await action()
	}

	const handleRowClick = () => {
		router.push(`/markets/${market.id}`)
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault()
			handleRowClick()
		}
	}

	return (
		<tr className="market-row">
			<td style={{ width: '35%' }}>
				<button
					onClick={handleRowClick}
					onKeyDown={handleKeyDown}
					className="market-button"
					type="button"
				>
					<div className="market-title-container">
						<span className="market-title">{market.title}</span>
						{isNew(market.createdAt) && <span className="badge-new">NEW</span>}
					</div>
					<div className="market-meta">{formatDate(market.createdAt)}</div>
				</button>
			</td>
			<td style={{ width: '30%' }}>
				<div className="market-meta" style={{ marginTop: 0 }}>
					{market.description}
				</div>
			</td>
			<td
				style={{ width: '15%' }}
				onClick={e => e.stopPropagation()}
				onKeyDown={e => e.stopPropagation()}
			>
				<UserPill {...market.author} />
			</td>
			<td
				style={{ width: '12%' }}
				onClick={e => e.stopPropagation()}
				onKeyDown={e => e.stopPropagation()}
			>
				<div className="votes-cell">
					<button
						onClick={e => handleVote(e, () => upvoteMarket(market.id))}
						onKeyDown={e => e.key === 'Enter' && handleVote(e, () => upvoteMarket(market.id))}
						className="vote-button"
						disabled={!user}
						type="button"
					>
						<span className={`vote-up ${hasUpvoted ? 'active' : ''}`}>↑{market.upvotes}</span>
					</button>
					<button
						onClick={e => handleVote(e, () => downvoteMarket(market.id))}
						onKeyDown={e => e.key === 'Enter' && handleVote(e, () => downvoteMarket(market.id))}
						className="vote-button"
						disabled={!user}
						type="button"
					>
						<span className={`vote-down ${hasDownvoted ? 'active' : ''}`}>↓{market.downvotes}</span>
					</button>
				</div>
			</td>
			<td style={{ width: '5%' }}>
				<button
					onClick={handleRowClick}
					onKeyDown={handleKeyDown}
					className="market-button"
					type="button"
				>
					<div className="market-meta">{market.comments.length}</div>
				</button>
			</td>
			<td style={{ width: '3%' }}>
				{isOwner && (
					<button
						type="button"
						onClick={e => {
							e.stopPropagation()
							setShowDeleteModal(true)
						}}
						className="button button-danger-subtle"
						title="Delete market"
					>
						×
					</button>
				)}
			</td>
			{showDeleteModal &&
				createPortal(
					<div className="modal">
						<div className="modal-content">
							<h2>Delete Market</h2>
							<p>Are you sure you want to delete this market? This action cannot be undone.</p>
							<div className="modal-actions">
								<button
									type="button"
									onClick={() => setShowDeleteModal(false)}
									className="button button-cancel"
									disabled={isDeleting}
								>
									Cancel
								</button>
								<button
									type="button"
									onClick={handleDelete}
									className="button button-danger"
									disabled={isDeleting}
								>
									{isDeleting ? 'Deleting...' : 'Delete'}
								</button>
							</div>
						</div>
					</div>,
					document.body
				)}
		</tr>
	)
}
