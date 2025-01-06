import type { ReactNode } from 'react'
import { ClientAuthProvider } from '@rubriclab/auth'
import { getSession } from '~/actions/auth'
import '../globals.css'

export default async function RootLayout({
	children
}: {
	children: ReactNode
}) {
	const session = await getSession()

	return (
		<html className="dark:dark flex h-full w-full items-center justify-center" lang="en">
			<body className="h-full w-full">
				<ClientAuthProvider session={session}>{children}</ClientAuthProvider>
			</body>
		</html>
	)
}
