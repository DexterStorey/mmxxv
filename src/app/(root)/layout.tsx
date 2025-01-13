import { ClientAuthProvider } from '@rubriclab/auth'
import type { ReactNode } from 'react'
import { getSession } from '~/actions/auth'
import { UsernamePrompt } from '~/components/username-prompt'
import '../globals.css'
import { Layout } from '~/ui'

export { metadata } from '~/constants'

export default async function RootLayout({
	children
}: {
	children: ReactNode
}) {
	const session = (await getSession({ redirectUnauthorizedUsers: false })) ?? {
		sessionKey: '',
		user: { id: '', authProviders: [] }
	}

	return (
		<Layout>
			<ClientAuthProvider session={session}>
				{children}
				<UsernamePrompt />
			</ClientAuthProvider>
		</Layout>
	)
}
