'use client'
import { Button } from 'rubricui'
import { handleSignOut } from '~/actions/auth'

export function SignOut() {
	return <Button onClick={() => handleSignOut({ redirectUrl: '/auth/signin' })}>Sign Out</Button>
}
