import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'
import { db } from '~/db'

export async function GET(request: Request) {
	const { searchParams } = new URL(request.url)
	const { key, redirectUrl } = z
		.object({ key: z.string(), redirectUrl: z.string() })
		.parse(Object.fromEntries(searchParams.entries()))

	const cookieStore = await cookies()

	const redirectUrlSearchParams = new URL(redirectUrl).searchParams
	const invitedBy = redirectUrlSearchParams.get('user')

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

	if (invitedBy) {
		await db.user.update({
			where: { id: user.id },
			data: {
				invitedBy: {
					connect: { username: invitedBy }
				}
			}
		})
	}

	cookieStore.set('key', key)
	cookieStore.set('user', JSON.stringify(user))

	redirect(redirectUrl)
}
