import type { CommentReactionType } from '@prisma/client'
import React from 'react'
import type { CommentWithAuthorAndReactions } from '~/types/market'

export const REACTIONS = {
	LAUGH: '😂',
	HEART: '❤️‍🔥',
	UFO: '🛸',
	FIRE: '🔥',
	CRYSTAL_BALL: '🔮',
	UP_TREND: '📈',
	DOWN_TREND: '📉'
} as const satisfies Record<CommentReactionType, string>

const CommentReactions = ({
	comment,
	userId,
	onReaction
}: {
	comment: CommentWithAuthorAndReactions
	userId: string
	onReaction: (reactionType: CommentReactionType) => Promise<void>
}) => {
	return (
		<div className="comment-reactions">
			{Object.keys(REACTIONS).map(reactionType => (
				<button
					key={reactionType}
					type="button"
					className="button-icon"
					data-active={comment.reactions
						.filter(r => r.type === reactionType)
						.some(r => r.authorId === userId)}
					onClick={() => onReaction(reactionType as CommentReactionType)}
				>
					{REACTIONS[reactionType as CommentReactionType]}{' '}
					{comment.reactions.filter(r => r.type === reactionType).length || ''}
				</button>
			))}
		</div>
	)
}

export default CommentReactions
