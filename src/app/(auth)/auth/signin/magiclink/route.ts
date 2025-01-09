import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { db } from '~/db'

const LOGIN_EXPIRY = 60 * 60 * 24 * 30 // 30 days

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url)
	const { key, redirectUrl } = z
		.object({
			key: z.string(),
			redirectUrl: z.string().default('/')
		})
		.parse(Object.fromEntries(searchParams.entries()))

	const cookieStore = await cookies()

	const { user } = await db.session.findUniqueOrThrow({
		where: {
			key
		},
		select: {
			user: {
				select: {
					id: true,
					authProviders: {
						select: {
							provider: true,
							accountId: true
						}
					}
				}
			}
		}
	})

	cookieStore.set('key', key, { maxAge: LOGIN_EXPIRY })
	cookieStore.set('user', JSON.stringify(user), { maxAge: LOGIN_EXPIRY })
	cookieStore.delete('invitedBy')

	redirect(redirectUrl)
}
