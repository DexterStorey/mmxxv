import type { Market, User } from '@prisma/client'
import { MAX_INVITE_POINTS, POINTS_PER_INVITE, POINTS_PER_MARKET } from '~/constants'

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
