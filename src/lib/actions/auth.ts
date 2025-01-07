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
	email
}: { redirectUrl?: string; email: string }) {
	// Generate a username from email prefix
	const baseUsername = generateUsername(email)
	let username = baseUsername
	let counter = 1

	// Keep trying with incremented numbers until we find a unique username
	while (true) {
		const existingUser = await db.user.findFirst({
			where: { username }
		})
		if (!existingUser) break
		username = `${baseUsername}${counter}`
		counter++
	}

	const { key } = await db.session.create({
		data: {
			user: {
				connectOrCreate: {
					where: {
						email
					},
					create: {
						email,
						username
					}
				}
			}
		}
	})

	const magicLink = `${env.URL}/auth/signin/magiclink?key=${key}&redirectUrl=${encodeURIComponent(redirectUrl || '/')}`

	await resend.emails.send({
		from: 'MMXXV <welcome@mmxxv.bet>',
		to: [email],
		subject: 'Your Magic Link',
		react: MagicLinkEmailTemplate({ magicLink, username })
	})

	redirect('/auth/signin/magiclink/sent')
}

export async function handleSignOut({ redirectUrl }: { redirectUrl: string }) {
	const cookieStore = await cookies()

	cookieStore.delete('key')
	cookieStore.delete('user')

	redirect(redirectUrl)
}
