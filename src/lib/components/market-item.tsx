'use client'

import type { Comment, Market } from '@prisma/client'
import { useSession } from '@rubriclab/auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { downvoteMarket, upvoteMarket } from '~/actions/market'
import { formatDate, isNew } from '~/utils/date'

export type CommentWithAuthor = Comment & {
	author: { email: string; id: string }
}

export type CommentWithReplies = CommentWithAuthor & {
	replies: CommentWithReplies[]
}

export type MarketWithVotesAndComments = Market & {
	upvoters: { userId: string }[]
	downvoters: { userId: string }[]
	comments: CommentWithReplies[]
	author: { email: string; id: string }
}

export function MarketItem({ market }: { market: MarketWithVotesAndComments }) {
	const { user } = useSession()
	const router = useRouter()
	const hasUpvoted = market.upvoters.some(u => u.userId === user?.id)
	const hasDownvoted = market.downvoters.some(u => u.userId === user?.id)

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
			<td>
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
			<td>{market.description}</td>
			<td>
				<Link
					href={`/users/${market.author.id}`}
					className="market-meta"
					onClick={e => e.stopPropagation()}
				>
					{market.author.email}
				</Link>
			</td>
			<td onClick={e => e.stopPropagation()} onKeyDown={e => e.stopPropagation()}>
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
			<td>{market.comments.length}</td>
		</tr>
	)
}
