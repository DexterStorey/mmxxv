import type { Market, User } from '@prisma/client'

const POINTS_PER_MARKET = 10

export type UserWithPoints = User & {
	points: number
}

export function calculatePoints(user: User & { markets: Market[] }): number {
	// Calculate points from created markets
	const marketPoints = user.markets.length * POINTS_PER_MARKET

	return marketPoints
}
