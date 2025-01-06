import { handleSignOut } from '~/actions/auth'

export async function GET() {
	await handleSignOut({ redirectUrl: '/auth/signin' })
}
