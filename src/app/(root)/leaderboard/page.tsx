import { LeaderboardTable } from '~/components/leaderboard-table'
import Nav from '~/components/nav'
import { db } from '~/db'
import { type UserWithPoints, calculatePoints } from '~/utils/points'

export default async function LeaderboardPage() {
	const users = await db.user.findMany({
		include: {
			markets: true,
			invitees: {
				select: { id: true }
			}
		}
	})

	// Calculate points for each user
	const usersWithPoints: UserWithPoints[] = users.map(user => ({
		...user,
		points: calculatePoints(user)
	}))

	// Sort users by points
	const sortedUsers = usersWithPoints.sort((a, b) => b.points - a.points)

	return (
		<>
			<Nav />
			<div className="container">
				<div className="card">
					<div
						className="card-header"
						style={{
							display: 'flex',
							justifyContent: 'space-between',
							alignItems: 'flex-start',
							gap: '2rem',
							padding: '1rem'
						}}
					>
						<div>
							<h1 className="title" style={{ margin: 0, marginBottom: '0.5rem', fontFamily: 'inherit' }}>
								Leaderboard
							</h1>
							<p className="description" style={{ margin: 0, color: 'var(--muted)' }}>
								Points are awarded for creating markets, inviting users, and making accurate predictions.
							</p>
						</div>
					</div>
					<div className="overflow-x-auto">
						<LeaderboardTable users={sortedUsers} />
					</div>
				</div>
			</div>
		</>
	)
}
