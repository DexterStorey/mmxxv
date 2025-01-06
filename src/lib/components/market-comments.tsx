'use client'

import type { Comment, Market, User } from '@prisma/client'
import { useState } from 'react'
import { getMarketById } from '~/actions/market'
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

function CommentThread({
	comment,
	onReply
}: {
	comment: CommentWithReplies
	onReply: (parentId: string) => void
}) {
	const [showReplyForm, setShowReplyForm] = useState(false)
	const [showReplies, setShowReplies] = useState(false)
	const hasReplies = comment.replies?.length > 0

	return (
		<div className="comment-thread">
			<div className="comment">
				<div className="comment-header">
					<div className="comment-meta">
						<span className="comment-author">{comment.author.email}</span>
						<span className="comment-time">{formatDate(comment.createdAt)}</span>
					</div>
					<div className="comment-actions">
						{hasReplies && (
							<button
								type="button"
								className="comment-action-button"
								onClick={() => setShowReplies(!showReplies)}
							>
								{showReplies ? 'Hide Replies' : `Show Replies (${comment.replies.length})`}
							</button>
						)}
						<button
							type="button"
							className="comment-action-button"
							onClick={() => setShowReplyForm(!showReplyForm)}
						>
							Reply
						</button>
					</div>
				</div>
				<p className="comment-content">{comment.content}</p>
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
						<CommentThread key={reply.id} comment={reply} onReply={onReply} />
					))}
				</div>
			)}
		</div>
	)
}

export function MarketComments({ market }: { market: MarketWithComments }) {
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

	return (
		<div className="comments-section">
			<h2 className="subtitle">Comments ({comments.length})</h2>
			<AddCommentForm marketId={market.id} onCommentAdded={refreshComments} />
			<div className="comments-list">
				{comments.map(comment => (
					<CommentThread key={comment.id} comment={comment} onReply={refreshComments} />
				))}
			</div>
		</div>
	)
}
