'use server'

import { createAuthActions } from '@rubriclab/auth/lib/utils'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { MagicLinkEmailTemplate } from '~/components/onboard-email'
import { db } from '~/db'
import { resend } from '~/email'
import { env } from '~/env'

export const { getSession } = createAuthActions({
	authProviders: {},
	db,
	unauthorizedUrl: `${env.URL}/auth/signin`
})

function generateUsername(email: string): string {
	const emailParts = email.split('@')
	if (emailParts.length !== 2 || !emailParts[0]) {
		throw new Error('Invalid email format')
	}

	const baseUsername = emailParts[0].replace(/[^a-zA-Z0-9]/g, '')
	if (!baseUsername) {
		throw new Error('Invalid email prefix')
	}

	return baseUsername
}

export async function sendMagicLink({
	redirectUrl,
	email,
	invitedBy
}: { redirectUrl?: string; email: string; invitedBy?: string }) {
	const existingUser = await db.user.findUnique({
		where: { email }
	})

	const username = existingUser?.username || (await generateUniqueUsername(email))

	const { key } = await db.session.create({
		data: {
			user: {
				connectOrCreate: {
					where: {
						email
					},
					create: {
						email,
						username,
						...(invitedBy ? { invitedBy: { connect: { username: invitedBy } } } : {})
					}
				}
			}
		}
	})

	const url = new URL('/auth/signin/magiclink', env.URL)
	url.searchParams.append('key', key)
	if (redirectUrl) url.searchParams.append('redirectUrl', redirectUrl)
	const magicLink = url.toString()

	await resend.emails.send({
		from: 'MMXXV <welcome@mmxxv.bet>',
		to: [email],
		subject: 'Your Magic Link',
		react: MagicLinkEmailTemplate({ magicLink, username })
	})

	redirect('/auth/signin/magiclink/sent')
}

async function generateUniqueUsername(email: string): Promise<string> {
	const baseUsername = generateUsername(email)
	let username = baseUsername
	let counter = 1

	while (true) {
		const existingUser = await db.user.findFirst({
			where: { username }
		})
		if (!existingUser) break
		username = `${baseUsername}${counter}`
		counter++
	}

	return username
}

export async function handleSignOut({ redirectUrl }: { redirectUrl: string }) {
	const cookieStore = await cookies()

	cookieStore.delete('key')
	cookieStore.delete('user')

	redirect(redirectUrl)
}
