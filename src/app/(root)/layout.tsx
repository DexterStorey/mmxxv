import { ClientAuthProvider } from '@rubriclab/auth'
import type { ReactNode } from 'react'
import { getSession } from '~/actions/auth'
import '../globals.css'

export default async function RootLayout({
	children
}: {
	children: ReactNode
}) {
	const session = await getSession()

	return (
		<html lang="en">
			<body>
				<ClientAuthProvider session={session}>{children}</ClientAuthProvider>
			</body>
		</html>
	)
}
