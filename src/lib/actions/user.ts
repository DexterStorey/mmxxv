'use server'

import { db } from '~/db'

export async function searchUsers(searchTerm: string | null) {
	const where = searchTerm
		? {
				email: {
					contains: searchTerm,
					mode: 'insensitive' as const
				}
			}
		: {}

	return db.user.findMany({
		where,
		select: {
			id: true,
			email: true
		},
		take: 5,
		orderBy: {
			email: 'asc'
		}
	})
}

export async function getUserEmail(userId: string) {
	const user = await db.user.findUnique({
		where: { id: userId },
		select: { email: true }
	})
	return user?.email
}
