'use client'

import type { Comment, User } from '@prisma/client'
import { useSession } from '@rubriclab/auth'
import { useCallback, useEffect, useRef, useState } from 'react'
import { deleteComment, getMarketById } from '~/actions/market'
import { getCurrentUsername } from '~/actions/user'
import type { MarketWithVotesAndComments } from '~/types/market'
import { formatDate } from '~/utils/date'
import { AddCommentForm } from './add-comment-form'
import { DeleteCommentModal } from './delete-comment-modal'
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
	onReply,
	depth = 0
}: {
	comment: CommentWithReplies
	highlightedCommentId: string | undefined
	onReply: (parentId: string) => void
	depth?: number
}) {
	const MAX_DEPTH = 6
	const { user } = useSession()
	const [showReplyForm, setShowReplyForm] = useState(false)
	const [showReplies, setShowReplies] = useState(false)
	const [isDeleting, setIsDeleting] = useState(false)
	const [showDeleteModal, setShowDeleteModal] = useState(false)
	const [isTemporarilyHighlighted, setIsTemporarilyHighlighted] = useState(false)
	const hasReplies = comment.replies?.length > 0
	const commentRef = useRef<HTMLDivElement>(null)
	const isHighlighted = comment.id === highlightedCommentId
	const isAuthor = user?.id === comment.author.id
	const canNest = depth < MAX_DEPTH

	// Check if this comment thread contains the highlighted comment
	const findHighlightedComment = useCallback(
		(replies: CommentWithReplies[]): boolean => {
			for (const reply of replies) {
				if (reply.id === highlightedCommentId) return true
				if (reply.replies.length > 0 && findHighlightedComment(reply.replies)) return true
			}
			return false
		},
		[highlightedCommentId]
	)

	useEffect(() => {
		if (highlightedCommentId && comment.replies.length > 0) {
			const shouldExpand = findHighlightedComment(comment.replies)
			if (shouldExpand) {
				setShowReplies(true)
			}
		}
	}, [highlightedCommentId, comment.replies, findHighlightedComment])

	useEffect(() => {
		if (isHighlighted) {
			setIsTemporarilyHighlighted(true)
			const timer = setTimeout(() => {
				setIsTemporarilyHighlighted(false)
			}, 4000)
			return () => clearTimeout(timer)
		}
		return
	}, [isHighlighted])

	const handleDelete = async () => {
		try {
			setIsDeleting(true)
			await deleteComment(comment.id)
			onReply(comment.id)
		} catch (error) {
			console.error('Error deleting comment:', error)
			alert('Failed to delete comment')
		} finally {
			setIsDeleting(false)
			setShowDeleteModal(false)
		}
	}

	return (
		<div className="comment-thread" ref={commentRef} data-comment-id={comment.id}>
			<div className={`comment ${isTemporarilyHighlighted ? 'highlight-flash' : ''}`}>
				<div className="comment-header">
					<div className="comment-meta">
						<UserPill {...comment.author} />
						<span className="comment-time">{formatDate(comment.createdAt)}</span>
					</div>
					{isAuthor && (
						<button
							type="button"
							className="comment-action-button button-danger-subtle"
							onClick={() => setShowDeleteModal(true)}
						>
							Delete
						</button>
					)}
				</div>
				<div className="comment-content">{formatCommentContent(comment.content, user?.id)}</div>
				<div className="comment-actions">
					<div className="comment-actions-left">
						{canNest ? (
							<button
								type="button"
								className="comment-action-button"
								onClick={() => setShowReplyForm(!showReplyForm)}
								disabled={!user}
							>
								Reply
							</button>
						) : (
							<span className="text-muted text-sm">Max nesting depth reached</span>
						)}
					</div>
					<div className="comment-actions-right">
						{hasReplies && (
							<button
								type="button"
								className="comment-action-button show-replies-btn"
								onClick={() => setShowReplies(!showReplies)}
							>
								{showReplies ? 'Hide Replies' : `Show Replies (${comment.replies.length})`}
							</button>
						)}
					</div>
				</div>
				{showReplyForm && canNest && (
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
				<div className={`comment-replies depth-${depth}`}>
					{comment.replies.map(reply => (
						<CommentThread
							key={reply.id}
							comment={reply}
							onReply={onReply}
							highlightedCommentId={highlightedCommentId}
							depth={depth + 1}
						/>
					))}
				</div>
			)}
			<DeleteCommentModal
				isOpen={showDeleteModal}
				onClose={() => setShowDeleteModal(false)}
				onDelete={handleDelete}
				isDeleting={isDeleting}
			/>
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
	const [comments, setComments] = useState<CommentWithReplies[]>(market.comments)
	const scrollTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined)

	const refreshComments = async () => {
		const updatedMarket = await getMarketById(market.id)
		if (updatedMarket) {
			setComments(updatedMarket.comments)
		}
	}

	useEffect(() => {
		setComments(market.comments)
	}, [market])

	useEffect(() => {
		if (!highlightedCommentId) return

		if (scrollTimeoutRef.current) {
			clearTimeout(scrollTimeoutRef.current)
		}

		const findAndExpandParents = (commentId: string, comments: CommentWithReplies[]): boolean => {
			for (const comment of comments) {
				if (comment.id === commentId) {
					return true
				}

				const foundInDirectReplies = comment.replies.some(reply => reply.id === commentId)
				if (foundInDirectReplies) {
					const commentEl = document.querySelector(`[data-comment-id="${comment.id}"]`)
					if (commentEl) {
						const showRepliesBtn = commentEl.querySelector('.show-replies-btn') as HTMLButtonElement
						if (showRepliesBtn) {
							showRepliesBtn.click()
						}
					}
					return true
				}

				if (comment.replies.length > 0) {
					const found = findAndExpandParents(commentId, comment.replies)
					if (found) {
						const commentEl = document.querySelector(`[data-comment-id="${comment.id}"]`)
						if (commentEl) {
							const showRepliesBtn = commentEl.querySelector('.show-replies-btn') as HTMLButtonElement
							if (showRepliesBtn) {
								showRepliesBtn.click()
							}
						}
						return true
					}
				}
			}
			return false
		}

		const attemptScroll = (attempt = 0) => {
			if (attempt > 10) return

			const highlightedComment = document.querySelector(`[data-comment-id="${highlightedCommentId}"]`)
			if (highlightedComment) {
				highlightedComment.scrollIntoView({ behavior: 'smooth', block: 'center' })
				const commentEl = highlightedComment.querySelector('.comment')
				if (commentEl) {
					commentEl.classList.add('highlight-flash')
					setTimeout(() => {
						commentEl.classList.remove('highlight-flash')
					}, 4000)
				}
			} else {
				scrollTimeoutRef.current = setTimeout(() => attemptScroll(attempt + 1), 100)
			}
		}

		findAndExpandParents(highlightedCommentId, comments)
		attemptScroll()

		return () => {
			if (scrollTimeoutRef.current) {
				clearTimeout(scrollTimeoutRef.current)
			}
		}
	}, [highlightedCommentId, comments])

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
