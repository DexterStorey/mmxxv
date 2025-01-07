'use client'

import { useSession } from '@rubriclab/auth'
import { useRouter } from 'next/navigation'
import { downvoteMarket, upvoteMarket } from '~/actions/market'
import type { MarketWithVotesAndComments } from '~/types/market'
import { formatDate, isNew } from '~/utils/date'
import UserPill from './user-pill'

interface MarketRowProps {
	market: MarketWithVotesAndComments
	onDeleteClick: () => void
}

export function MarketRow({ market, onDeleteClick }: MarketRowProps) {
	const { user } = useSession()
	const router = useRouter()
	const hasUpvoted = market.upvoters.some((u: { userId: string }) => u.userId === user?.id)
	const hasDownvoted = market.downvoters.some((u: { userId: string }) => u.userId === user?.id)
	const isOwner = user?.id === market.author.id
	const isNewMarket = isNew(market.createdAt)

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
					</div>
					<div className="market-meta">
						<span className={`time-pill ${isNewMarket ? 'new' : ''}`}>
							{formatDate(market.createdAt)}
						</span>
					</div>
				</button>
			</td>
			<td style={{ width: '30%' }}>
				<button
					onClick={handleRowClick}
					onKeyDown={handleKeyDown}
					className="market-button"
					type="button"
				>
					<div className="market-meta">{market.description}</div>
				</button>
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
						className={`vote-pill ${hasUpvoted ? 'active up' : ''}`}
						disabled={!user}
						type="button"
					>
						↑{market.upvotes}
					</button>
					<button
						onClick={e => handleVote(e, () => downvoteMarket(market.id))}
						onKeyDown={e => e.key === 'Enter' && handleVote(e, () => downvoteMarket(market.id))}
						className={`vote-pill ${hasDownvoted ? 'active down' : ''}`}
						disabled={!user}
						type="button"
					>
						↓{market.downvotes}
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
					<div className="market-meta centered">{market.comments.length}</div>
				</button>
			</td>
			<td style={{ width: '3%' }}>
				{isOwner && (
					<button
						type="button"
						onClick={e => {
							e.stopPropagation()
							onDeleteClick()
						}}
						className="button button-danger-subtle"
						title="Delete market"
					>
						×
					</button>
				)}
			</td>
		</tr>
	)
}
