'use client'

import type { Comment, Market, User } from '@prisma/client'
import { useSession } from '@rubriclab/auth'
import { useEffect, useRef, useState } from 'react'
import { getMarketById } from '~/actions/market'
import { getUserEmail } from '~/actions/user'
import { formatDate } from '~/utils/date'
import { AddCommentForm } from './add-comment-form'

type CommentWithAuthor = Comment & {
	author: Pick<User, 'id' | 'email'>
}

type CommentWithReplies = CommentWithAuthor & {
	replies: CommentWithReplies[]
}

type MarketWithComments = Market & {
	comments: CommentWithReplies[]
}

function formatCommentContent(content: string, currentUserEmail: string | undefined) {
	return content.split(/(@[^\s]+)/).map((part, index) => {
		if (part.startsWith('@')) {
			const mentionedEmail = part.slice(1)
			const isCurrentUser = currentUserEmail && mentionedEmail === currentUserEmail
			return (
				<span
					key={index}
					className={`mention-tag ${isCurrentUser ? 'mention-tag-self' : 'mention-tag-other'}`}
				>
					{part}
				</span>
			)
		}
		return part
	})
}

function CommentThread({
	comment,
	onReply,
	highlightedCommentId
}: {
	comment: CommentWithReplies
	onReply: (parentId: string) => void
	highlightedCommentId: string | undefined
}) {
	const [showReplyForm, setShowReplyForm] = useState(false)
	const [showReplies, setShowReplies] = useState(false)
	const hasReplies = comment.replies?.length > 0
	const commentRef = useRef<HTMLDivElement>(null)
	const isHighlighted = comment.id === highlightedCommentId
	const hasHighlightedReply = comment.replies.some(reply => reply.id === highlightedCommentId)
	const { user } = useSession()
	const [userEmail, setUserEmail] = useState<string>()

	useEffect(() => {
		if (user?.id) {
			getUserEmail(user.id).then(setUserEmail)
		}
	}, [user?.id])

	// Auto-expand replies if a nested reply is highlighted
	useEffect(() => {
		if (hasHighlightedReply) {
			setShowReplies(true)
		}
	}, [hasHighlightedReply])

	useEffect(() => {
		if (isHighlighted && commentRef.current) {
			commentRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' })
			commentRef.current.classList.add('highlighted')
			setTimeout(() => {
				commentRef.current?.classList.remove('highlighted')
			}, 3000)
		}
	}, [isHighlighted])

	return (
		<div className="comment-thread" ref={commentRef}>
			<div className={`comment ${isHighlighted ? 'highlighted' : ''}`}>
				<div className="comment-header">
					<div className="comment-meta">
						<span className="comment-author">{comment.author.email}</span>
						<span className="comment-time">{formatDate(comment.createdAt)}</span>
					</div>
				</div>
				<p className="comment-content">{formatCommentContent(comment.content, userEmail)}</p>
				<div className="comment-actions">
					<div className="comment-actions-left">
						<button
							type="button"
							className="comment-action-button"
							onClick={() => setShowReplyForm(!showReplyForm)}
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
	market: MarketWithComments
	highlightedCommentId: string | undefined
}) {
	const [comments, setComments] = useState<CommentWithReplies[]>(
		market.comments
			.filter(comment => !comment.parentId)
			.map(comment => ({
				...comment,
				replies: market.comments.filter(reply => reply.parentId === comment.id)
			}))
	)

	const refreshComments = async () => {
		const updatedMarket = await getMarketById(market.id)
		if (updatedMarket) {
			const topLevelComments = updatedMarket.comments
				.filter(comment => !comment.parentId)
				.map(comment => ({
					...comment,
					replies: updatedMarket.comments.filter(reply => reply.parentId === comment.id)
				}))
			setComments(topLevelComments)
		}
	}

	// Update comments when market data changes
	useEffect(() => {
		const topLevelComments = market.comments
			.filter(comment => !comment.parentId)
			.map(comment => ({
				...comment,
				replies: market.comments.filter(reply => reply.parentId === comment.id)
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
