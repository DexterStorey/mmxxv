'use client'

import type { CommentReactionType } from '@prisma/client'
import { useSession } from '@rubriclab/auth'
import { Button, Card, Heading, Link, Section, Stack } from '@rubriclab/ui'
import { useCallback, useEffect, useRef, useState } from 'react'
import { addCommentReaction, removeCommentReaction } from '~/actions/comment'
import { deleteComment, getMarketById } from '~/actions/market'
import { getCurrentUsername } from '~/actions/user'
import type { CommentWithReplies, MarketWithVotesAndComments } from '~/types/market'
import { formatDate } from '~/utils/date'
import { AddCommentForm } from './add-comment-form'
import CommentReactions from './comment-reactions'
import { DeleteCommentModal } from './delete-comment-modal'

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
									style={{ color: isCurrentUser ? 'var(--highlight)' : 'var(--secondary)' }}
								>
									@{displayName}
								</span>
							)
						} catch (error) {
							console.error('Error fetching user:', error)
							return (
								<span key={index} style={{ color: 'var(--secondary)' }}>
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
	// const commentRef = useRef<HTMLDivElement>(null)
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

	const handleReaction = async (type: CommentReactionType) => {
		try {
			if (comment.reactions.filter(r => r.type === type).some(r => r.authorId === user?.id)) {
				await removeCommentReaction({ commentId: comment.id, type })
			} else {
				await addCommentReaction({ commentId: comment.id, type })
			}
		} catch (error) {
			console.error('Error reacting to comment:', error)
			alert('Failed to add reaction')
		}
	}

	return (
		<Section data-comment-id={comment.id}>
			<Card
				ROLE="information"
				style={{ opacity: isTemporarilyHighlighted ? 0.7 : 1 }}
				title={
					<Stack justify="between">
						<Stack justify="start">
							<Link ROLE="inline" href={`/user/${comment.author.id}`}>
								{comment.author.username}
							</Link>
							<span style={{ color: 'var(--secondary)' }}>{formatDate(comment.createdAt)}</span>
						</Stack>
						{isAuthor && (
							<Button ROLE="destructive" onClick={() => setShowDeleteModal(true)}>
								Delete
							</Button>
						)}
					</Stack>
				}
			>
				<Section>
					<Section>{formatCommentContent(comment.content, user?.id)}</Section>
					<Stack justify="between">
						<Stack justify="start">
							{canNest ? (
								<Button
									ROLE="information"
									onClick={() => setShowReplyForm(!showReplyForm)}
									disabled={!user}
								>
									Reply
								</Button>
							) : (
								<span style={{ color: 'var(--secondary)' }}>Max nesting depth reached</span>
							)}
							<CommentReactions comment={comment} userId={user?.id || ''} onReaction={handleReaction} />
						</Stack>
						{hasReplies && (
							<Button ROLE="information" onClick={() => setShowReplies(!showReplies)}>
								{showReplies ? 'Hide Replies' : `Show Replies (${comment.replies.length})`}
							</Button>
						)}
					</Stack>
					{showReplyForm && canNest && (
						<Section>
							<AddCommentForm
								marketId={comment.marketId}
								parentId={comment.id}
								onCommentAdded={() => {
									setShowReplyForm(false)
									onReply(comment.id)
								}}
							/>
						</Section>
					)}
				</Section>
			</Card>
			{hasReplies && showReplies && (
				<Section style={{ marginLeft: `${depth * 20}px` }}>
					{comment.replies.map(reply => (
						<CommentThread
							key={reply.id}
							comment={reply}
							onReply={onReply}
							highlightedCommentId={highlightedCommentId}
							depth={depth + 1}
						/>
					))}
				</Section>
			)}
			<DeleteCommentModal
				isOpen={showDeleteModal}
				onClose={() => setShowDeleteModal(false)}
				onDelete={handleDelete}
				isDeleting={isDeleting}
			/>
		</Section>
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
						const showRepliesBtn = commentEl.querySelector('button') as HTMLButtonElement
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
							const showRepliesBtn = commentEl.querySelector('button') as HTMLButtonElement
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
		<Section>
			<Heading ROLE="section">Comments ({comments.length})</Heading>
			<Section>
				<AddCommentForm marketId={market.id} onCommentAdded={refreshComments} />
				<Section>
					{comments.map(comment => (
						<CommentThread
							key={comment.id}
							comment={comment}
							onReply={refreshComments}
							highlightedCommentId={highlightedCommentId}
						/>
					))}
				</Section>
			</Section>
		</Section>
	)
}
