'use client'

import { handleSignOut } from '~/actions/auth'
import { Button } from '~/ui'

export function SignOut() {
	return (
		<Button ROLE="destructive" onClick={() => handleSignOut({ redirectUrl: '/auth/signin' })}>
			Sign Out
		</Button>
	)
}
