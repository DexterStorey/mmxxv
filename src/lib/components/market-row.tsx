'use client'

import { useSession } from '@rubriclab/auth'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { downvoteMarket, upvoteMarket } from '~/actions/market'
import { formatDate, isNew } from '~/utils/date'
import type { MarketWithVotesAndComments } from './market-item'

interface MarketRowProps {
	market: MarketWithVotesAndComments
	onDeleteClick: () => void
}

export function MarketRow({ market, onDeleteClick }: MarketRowProps) {
	const { user } = useSession()
	const router = useRouter()
	const hasUpvoted = market.upvoters.some(u => u.userId === user?.id)
	const hasDownvoted = market.downvoters.some(u => u.userId === user?.id)
	const isOwner = user?.id === market.author.id

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
						{isNew(market.createdAt) && <span className="badge-new">NEW</span>}
					</div>
					<div className="market-meta">{formatDate(market.createdAt)}</div>
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
			<td style={{ width: '15%' }}>
				<button
					onClick={handleRowClick}
					onKeyDown={handleKeyDown}
					className="market-button"
					type="button"
				>
					<Link
						href={`/users/${market.author.id}`}
						className="market-meta"
						onClick={e => e.stopPropagation()}
					>
						{market.author.email}
					</Link>
				</button>
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
			<td style={{ width: '5%' }}>
				<button
					onClick={handleRowClick}
					onKeyDown={handleKeyDown}
					className="market-button"
					type="button"
				>
					<div className="market-meta">{market.comments.length}</div>
				</button>
			</td>
			<td
				style={{ width: '3%' }}
				onClick={e => e.stopPropagation()}
				onKeyDown={e => e.stopPropagation()}
			>
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
