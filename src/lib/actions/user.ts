'use server'

import { Prisma } from '@prisma/client'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { db } from '~/db'

export async function searchUsers(searchTerm: string | null) {
	const where = searchTerm
		? {
				OR: [
					{
						username: {
							contains: searchTerm,
							mode: 'insensitive' as const
						}
					},
					{
						email: {
							contains: searchTerm,
							mode: 'insensitive' as const
						}
					}
				]
			}
		: {}

	return db.user.findMany({
		where,
		select: {
			id: true,
			email: true,
			username: true
		},
		take: 5,
		orderBy: {
			username: 'asc'
		}
	})
}

export async function getUserEmail(userId: string) {
	const user = await db.user.findUnique({
		where: { id: userId },
		select: {
			email: true,
			username: true
		}
	})
	return user?.username || user?.email
}

export async function getCurrentUsername(userId: string) {
	const user = await db.user.findUnique({
		where: { id: userId },
		select: { username: true }
	})
	return user?.username || 'DELETED_USER'
}

const updateUsernameSchema = z.object({
	username: z
		.string()
		.min(1)
		.max(20)
		.regex(/^[a-zA-Z0-9]+$/, 'Username must be alphanumeric'),
	bio: z.string().max(100).optional(),
	userId: z.string()
})

export async function updateUsername({
	username: _username,
	bio: _bio,
	userId: _userId
}: { username: string; bio: string; userId: string }) {
	try {
		const { username, bio, userId } = updateUsernameSchema.parse({
			username: _username,
			bio: _bio,
			userId: _userId
		})

		// Get the current user to find their old username
		const currentUser = await db.user.findUnique({
			where: { id: userId },
			select: { username: true }
		})

		// Update the user's username
		await db.user.update({
			where: { id: userId },
			data: {
				username,
				...(bio ? { bio } : {})
			}
		})

		// If the user had a previous username, update any mentions in comments
		if (currentUser?.username) {
			// Find all comments that mention the old username
			const comments = await db.comment.findMany({
				where: {
					content: {
						contains: `@${currentUser.username}`
					}
				}
			})

			// Update each comment with the new username
			await Promise.all(
				comments.map(comment =>
					db.comment.update({
						where: { id: comment.id },
						data: {
							content: comment.content.replace(new RegExp(`@${currentUser.username}`, 'g'), `@${username}`)
						}
					})
				)
			)
		}
	} catch (error) {
		if (error instanceof z.ZodError) redirect('/account?error=invalid')

		if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002')
			redirect('/account?error=taken')

		redirect('/account?error=unknown')
	}
	redirect('/account')
}
