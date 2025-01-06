'use client'

import type { User } from '@prisma/client'
import { useRouter } from 'next/navigation'

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
			<td>
				<button
					onClick={handleRowClick}
					onKeyDown={handleKeyDown}
					className="market-button"
					type="button"
				>
					<span className="market-title">{rank}</span>
				</button>
			</td>
			<td>
				<button
					onClick={handleRowClick}
					onKeyDown={handleKeyDown}
					className="market-button"
					type="button"
				>
					<span className="market-title">{user.email}</span>
				</button>
			</td>
			<td>
				<button
					onClick={handleRowClick}
					onKeyDown={handleKeyDown}
					className="market-button"
					type="button"
				>
					<span className="market-title">{user.points}</span>
				</button>
			</td>
		</tr>
	)
}

export function LeaderboardTable({ users }: { users: User[] }) {
	return (
		<div className="card">
			<div className="card-header">
				<h1 className="title" style={{ margin: 0, borderBottom: 'none', fontFamily: 'inherit' }}>
					Leaderboard
				</h1>
			</div>
			<table className="table">
				<thead>
					<tr>
						<th>Rank</th>
						<th>User</th>
						<th>Points</th>
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
