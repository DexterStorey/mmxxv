'use client'

import { Button } from '@rubriclab/ui'
import { handleSignOut } from '~/actions/auth'

export function SignOut() {
	return (
		<Button ROLE="destructive" onClick={() => handleSignOut({ redirectUrl: '/auth/signin' })}>
			Sign Out
		</Button>
	)
}
