import { Card, Page, Section } from '@rubriclab/ui'
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
		<Page nav={<Nav />}>
			<Section>
				<Card ROLE="information" title="Leaderboard">
					<p>
						Points are awarded for creating markets, inviting users, and making accurate predictions.
					</p>
				</Card>
			</Section>
			<Section>
				<LeaderboardTable users={sortedUsers} />
			</Section>
		</Page>
	)
}
