'use client'

import type { Comment, User } from '@prisma/client'
import { useSession } from '@rubriclab/auth'
import { useEffect, useRef, useState } from 'react'
import { getMarketById } from '~/actions/market'
import { getCurrentUsername } from '~/actions/user'
import { formatDate } from '~/utils/date'
import { AddCommentForm } from './add-comment-form'
import type { MarketWithVotesAndComments } from './market-item'
import UserPill from './user-pill'

type CommentWithAuthor = Comment & {
	author: Pick<User, 'id' | 'email' | 'username'>
}

type CommentWithReplies = CommentWithAuthor & {
	replies: CommentWithReplies[]
}

function formatCommentContent(content: string, currentUserId: string | undefined) {
	const [formattedContent, setFormattedContent] = useState<React.ReactNode[]>([])

	useEffect(() => {
		async function fetchUsernames() {
			const parts = content.split(/(@\[[^\]]+\])/)
			const formattedParts = await Promise.all(
				parts.map(async (part, index) => {
					if (part.startsWith('@[')) {
						const match = part.match(/@\[([^:]+):([^\]]+)\]/)
						if (!match) return part

						const [, userId] = match
						if (!userId) return part

						const isCurrentUser = currentUserId && userId === currentUserId

						try {
							const displayName = await getCurrentUsername(userId)
							return (
								<span
									key={index}
									className={`mention-tag ${isCurrentUser ? 'mention-tag-self' : 'mention-tag-other'}`}
								>
									@{displayName}
								</span>
							)
						} catch (error) {
							console.error('Error fetching user:', error)
							return (
								<span key={index} className="mention-tag mention-tag-other">
									@DELETED_USER
								</span>
							)
						}
					}
					return part
				})
			)
			setFormattedContent(formattedParts)
		}

		fetchUsernames()
	}, [content, currentUserId])

	return formattedContent
}

function CommentThread({
	comment,
	highlightedCommentId,
	onReply
}: {
	comment: CommentWithReplies
	highlightedCommentId: string | undefined
	onReply: (parentId: string) => void
}) {
	const { user } = useSession()
	const [showReplyForm, setShowReplyForm] = useState(false)
	const [showReplies, setShowReplies] = useState(false)
	const hasReplies = comment.replies?.length > 0
	const commentRef = useRef<HTMLDivElement>(null)
	const isHighlighted = comment.id === highlightedCommentId
	const hasHighlightedReply = comment.replies.some(reply => reply.id === highlightedCommentId)

	// Auto-expand replies if a nested reply is highlighted
	useEffect(() => {
		if (hasHighlightedReply) {
			setShowReplies(true)
		}
	}, [hasHighlightedReply])

	useEffect(() => {
		if (isHighlighted && commentRef.current) {
			commentRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
		}
	}, [isHighlighted])

	return (
		<div className="comment-thread" ref={commentRef}>
			<div className={`comment ${isHighlighted ? 'highlighted' : ''}`}>
				<div className="comment-header">
					<div className="comment-meta">
						<UserPill {...comment.author} />
						<span className="comment-time">{formatDate(comment.createdAt)}</span>
					</div>
				</div>
				<div className="comment-content">{formatCommentContent(comment.content, user?.id)}</div>
				<div className="comment-actions">
					<div className="comment-actions-left">
						<button
							type="button"
							className="comment-action-button"
							onClick={() => setShowReplyForm(!showReplyForm)}
							disabled={!user}
						>
							Reply
						</button>
					</div>
					<div className="comment-actions-right">
						{hasReplies && (
							<button
								type="button"
								className="comment-action-button"
								onClick={() => setShowReplies(!showReplies)}
							>
								{showReplies ? 'Hide Replies' : `Show Replies (${comment.replies.length})`}
							</button>
						)}
					</div>
				</div>
				{showReplyForm && (
					<div className="comment-reply-form">
						<AddCommentForm
							marketId={comment.marketId}
							parentId={comment.id}
							onCommentAdded={() => {
								setShowReplyForm(false)
								onReply(comment.id)
							}}
						/>
					</div>
				)}
			</div>
			{hasReplies && showReplies && (
				<div className="comment-replies">
					{comment.replies.map(reply => (
						<CommentThread
							key={reply.id}
							comment={reply}
							onReply={onReply}
							highlightedCommentId={highlightedCommentId}
						/>
					))}
				</div>
			)}
		</div>
	)
}

export function MarketComments({
	market,
	highlightedCommentId
}: {
	market: MarketWithVotesAndComments
	highlightedCommentId?: string | undefined
}) {
	// First, sort all comments by date
	const sortedComments = [...market.comments].sort(
		(a, b) => b.createdAt.getTime() - a.createdAt.getTime()
	)

	// Then organize into threads while preserving chronological order
	const [comments, setComments] = useState<CommentWithReplies[]>(
		sortedComments
			.filter(comment => !comment.parentId)
			.map(comment => ({
				...comment,
				replies: sortedComments.filter(reply => reply.parentId === comment.id)
			}))
	)

	const refreshComments = async () => {
		const updatedMarket = await getMarketById(market.id)
		if (updatedMarket) {
			const allSortedComments = [...updatedMarket.comments].sort(
				(a, b) => b.createdAt.getTime() - a.createdAt.getTime()
			)
			const topLevelComments = allSortedComments
				.filter(comment => !comment.parentId)
				.map(comment => ({
					...comment,
					replies: allSortedComments.filter(reply => reply.parentId === comment.id)
				}))
			setComments(topLevelComments)
		}
	}

	// Update comments when market data changes
	useEffect(() => {
		const allSortedComments = [...market.comments].sort(
			(a, b) => b.createdAt.getTime() - a.createdAt.getTime()
		)
		const topLevelComments = allSortedComments
			.filter(comment => !comment.parentId)
			.map(comment => ({
				...comment,
				replies: allSortedComments.filter(reply => reply.parentId === comment.id)
			}))
		setComments(topLevelComments)
	}, [market])

	return (
		<div className="comments-section">
			<h2 className="subtitle">Comments ({comments.length})</h2>
			<AddCommentForm marketId={market.id} onCommentAdded={refreshComments} />
			<div className="comments-list">
				{comments.map(comment => (
					<CommentThread
						key={comment.id}
						comment={comment}
						onReply={refreshComments}
						highlightedCommentId={highlightedCommentId}
					/>
				))}
			</div>
		</div>
	)
}
