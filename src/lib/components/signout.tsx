'use client'

import { handleSignOut } from '~/actions/auth'

export function SignOut() {
	return (
		<button
			type="button"
			className="button"
			onClick={() => handleSignOut({ redirectUrl: '/auth/signin' })}
		>
			Sign Out
		</button>
	)
}
