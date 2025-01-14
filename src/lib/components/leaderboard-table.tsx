'use client'

import type { User } from '@prisma/client'
import { Link, Table, TableCell, TableRow } from '@rubriclab/ui'

export function LeaderboardTable({ users }: { users: User[] }) {
	return (
		<Table>
			<TableRow>
				<TableCell ROLE="header">RANK</TableCell>
				<TableCell ROLE="header">USER</TableCell>
				<TableCell ROLE="header">POINTS</TableCell>
			</TableRow>
			{users.map((user, index) => (
				<TableRow key={user.id}>
					<TableCell ROLE="data">{index + 1}</TableCell>
					<TableCell ROLE="data">
						<Link ROLE="inline" href={`/users/${user.id}`}>
							{user.username}
						</Link>
						<p>{user.bio}</p>
					</TableCell>
					<TableCell ROLE="data">{user.points}</TableCell>
				</TableRow>
			))}
		</Table>
	)
}
