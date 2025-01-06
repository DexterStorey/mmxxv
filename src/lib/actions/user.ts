'use server'

import { Prisma } from '@prisma/client'
import { redirect } from 'next/navigation'
import { z } from 'zod'
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

const updateUsernameSchema = z.object({
	username: z
		.string()
		.min(1)
		.max(20)
		.regex(/^[a-zA-Z0-9]+$/, 'Username must be alphanumeric'),
	userId: z.string()
})

export async function updateUsername(formData: FormData) {
	try {
		const { username, userId } = updateUsernameSchema.parse(Object.fromEntries(formData))

		await db.user.update({
			where: { id: userId },
			data: { username }
		})
	} catch (error) {
		if (error instanceof z.ZodError) redirect('/account?error=invalid')

		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002')
			redirect('/account?error=taken')

		redirect('/account?error=unknown')
	}
	redirect('/account')
}
