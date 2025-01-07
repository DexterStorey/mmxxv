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
			<td style={{ width: '10%' }}>
				<button
					onClick={handleRowClick}
					onKeyDown={handleKeyDown}
					className="market-button"
					type="button"
				>
					<span className="market-meta">{rank}</span>
				</button>
			</td>
			<td
				style={{ width: '70%' }}
				onClick={e => e.stopPropagation()}
				onKeyDown={e => e.stopPropagation()}
			>
				<UserPill {...user} />
			</td>
			<td style={{ width: '20%', textAlign: 'right' }}>
				<button
					onClick={handleRowClick}
					onKeyDown={handleKeyDown}
					className="market-button"
					type="button"
				>
					<span className="market-meta">{user.points}</span>
				</button>
			</td>
		</tr>
	)
}

export function LeaderboardTable({ users }: { users: User[] }) {
	return (
		<div className="card">
			<table className="table">
				<thead>
					<tr>
						<th style={{ width: '10%' }}>RANK</th>
						<th style={{ width: '70%' }}>USER</th>
						<th style={{ width: '20%', textAlign: 'right' }}>POINTS</th>
					</tr>
				</thead>
				<tbody>
					{users.map((user, index) => (
						<LeaderboardRow key={user.id} user={user} rank={index + 1} />
					))}
				</tbody>
			</table>
		</div>
	)
}
