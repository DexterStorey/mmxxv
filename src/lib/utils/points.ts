import type { Market, User } from '@prisma/client'

const POINTS_PER_MARKET = 10

export type UserWithPoints = User & {
	points: number
}

export function calculatePoints(
	user: User & { invitees: { id: string }[] } & { markets: Market[] }
): number {
	const marketPoints = user.markets.length * POINTS_PER_MARKET
	const invitePoints = user.invitees.length * 10

	const totalPoints = marketPoints + invitePoints

	return totalPoints
}
