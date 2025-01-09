'use client'

import type { User } from '@prisma/client'
import { useRouter } from 'next/navigation'
import UserPill from './user-pill'

function LeaderboardRow({ user, rank }: { user: User; rank: number }) {
	const router = useRouter()

	const handleRowClick = () => {
		router.push(`/users/${user.id}`)
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault()
			handleRowClick()
		}
	}

	return (
		<tr className="market-row">
			<td style={{ width: '15%', textAlign: 'center' }}>
				<button
					onClick={handleRowClick}
					onKeyDown={handleKeyDown}
					className="market-button"
					type="button"
				>
					<div className="market-meta centered" style={{ fontWeight: 500 }}>
						{rank}
					</div>
				</button>
			</td>
			<td
				className="leaderboard-user-cell"
				onClick={e => e.stopPropagation()}
				onKeyDown={e => e.stopPropagation()}
			>
				<UserPill {...user} />
				<div className="leaderboard-user-bio">{user.bio}</div>
			</td>
			<td style={{ width: '30%', textAlign: 'center' }}>
				<button
					onClick={handleRowClick}
					onKeyDown={handleKeyDown}
					className="market-button"
					type="button"
				>
					<div className="market-meta centered" style={{ color: 'var(--success)', fontWeight: 500 }}>
						{user.points}
					</div>
				</button>
			</td>
		</tr>
	)
}

export function LeaderboardTable({ users }: { users: User[] }) {
	return (
		<table className="table">
			<thead>
				<tr>
					<th style={{ width: '15%', textAlign: 'center' }}>RANK</th>
					<th style={{ width: '55%' }}>USER</th>
					<th style={{ width: '30%', textAlign: 'center' }}>POINTS</th>
				</tr>
			</thead>
			<tbody>
				{users.map((user, index) => (
					<LeaderboardRow key={user.id} user={user} rank={index + 1} />
				))}
			</tbody>
		</table>
	)
}
