import type { Metadata } from 'next'

export const metadata: Metadata = {
	title: 'MMXXV',
	description: 'A prediction game for 2025.'
}

export const POINTS_PER_MARKET = 10
export const POINTS_PER_INVITE = 10
export const MAX_INVITEES = 10
export const MAX_INVITE_POINTS = MAX_INVITEES * POINTS_PER_INVITE
export const MAX_MARKETS_PER_USER = 5
