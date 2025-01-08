import type { CommentReactionType } from '@prisma/client'
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
	// Get unique active reactions
	const activeReactions = Object.keys(REACTIONS).filter(type =>
		comment.reactions.some(r => r.type === type)
	)

	return (
		<div className="comment-reactions">
			{/* Add reaction button */}
			<div className="reaction-picker">
				<button type="button" className="button-icon">
					<span style={{ paddingBottom: '0.2rem', fontSize: '1.25rem' }}>☺</span>
				</button>
				<div className="reaction-options">
					{Object.keys(REACTIONS).map(reactionType => (
						<button
							key={reactionType}
							type="button"
							className="button-icon"
							onClick={() => onReaction(reactionType as CommentReactionType)}
						>
							{REACTIONS[reactionType as CommentReactionType]}
						</button>
					))}
				</div>
			</div>

			{/* Active reactions */}
			{activeReactions.map(reactionType => (
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
					{comment.reactions.filter(r => r.type === reactionType).length}
				</button>
			))}
		</div>
	)
}

export default CommentReactions
