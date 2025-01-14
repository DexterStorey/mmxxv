import type { CommentReactionType } from '@prisma/client'
import { Button, Dropdown, Stack } from '@rubriclab/ui'
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
		<Stack justify="start">
			{/* Add reaction button */}
			<Dropdown ROLE="menu" label={<span style={{ fontSize: '1.25rem' }}>☺</span>}>
				<Stack>
					{Object.keys(REACTIONS).map(reactionType => (
						<Button
							key={reactionType}
							ROLE="information"
							type="button"
							onClick={() => onReaction(reactionType as CommentReactionType)}
						>
							{REACTIONS[reactionType as CommentReactionType]}
						</Button>
					))}
				</Stack>
			</Dropdown>

			{/* Active reactions */}
			{activeReactions.map(reactionType => {
				const isActive = comment.reactions
					.filter(r => r.type === reactionType)
					.some(r => r.authorId === userId)
				const count = comment.reactions.filter(r => r.type === reactionType).length

				return (
					<Button
						key={reactionType}
						ROLE={isActive ? 'success' : 'destructive'}
						type="button"
						onClick={() => onReaction(reactionType as CommentReactionType)}
					>
						{REACTIONS[reactionType as CommentReactionType]} {count}
					</Button>
				)
			})}
		</Stack>
	)
}

export default CommentReactions
