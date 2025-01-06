import type { Market, User } from '@prisma/client'

const POINTS_PER_MARKET = 10
const POINTS_PER_INVITE = 10
const MAX_INVITE_POINTS = 100

export type UserWithPoints = User & {
	points: number
}

export function calculatePoints(
	user: User & { invitees: { id: string }[] } & { markets: Market[] }
): number {
	const marketPoints = user.markets.length * POINTS_PER_MARKET
	const invitePoints = Math.min(user.invitees.length * POINTS_PER_INVITE, MAX_INVITE_POINTS)

	const totalPoints = marketPoints + invitePoints

	return totalPoints
}
