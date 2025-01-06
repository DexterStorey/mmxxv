import { LeaderboardTable } from '~/components/leaderboard-table'
import Nav from '~/components/nav'
import { db } from '~/db'

export default async function LeaderboardPage() {
	const users = await db.user.findMany({
		orderBy: {
			points: 'desc'
		}
	})

	return (
		<>
			<Nav />
			<div className="container">
				<LeaderboardTable users={users} />
			</div>
		</>
	)
}
