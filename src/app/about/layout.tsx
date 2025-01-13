import { ClientAuthProvider } from '@rubriclab/auth'
import type { ReactNode } from 'react'
import { getSession } from '~/actions/auth'
import '../globals.css'
import { Layout } from '~/ui'

export { metadata } from '~/constants'

export default async function RootLayout({
	children
}: {
	children: ReactNode
}) {
	const session = await getSession({ redirectUnauthorizedUsers: false })

	return (
		<Layout>
			<ClientAuthProvider session={session}>{children}</ClientAuthProvider>
		</Layout>
	)
}
