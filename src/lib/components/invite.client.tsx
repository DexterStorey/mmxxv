'use client'

import { useEffect, useState } from 'react'
import { MAX_INVITEES } from '~/constants'
import { Button } from '~/ui'

export default function InviteClient({ id, invitees }: { id: string; invitees: number }) {
	const [isCopied, setIsCopied] = useState(false)
	const [inviteLink, setInviteLink] = useState('')

	useEffect(() => {
		const url = new URL(window.location.href)
		url.searchParams.set('user', id)
		setInviteLink(url.toString())
	}, [id])

	return (
		<Button
			ROLE="destructive"
			onClick={() => {
				navigator.clipboard.writeText(inviteLink)
				setIsCopied(true)
			}}
			disabled={isCopied || invitees >= MAX_INVITEES}
		>
			{isCopied
				? 'Copied! Send to a friend.'
				: `Copy Invite Link (${Math.max(0, MAX_INVITEES - invitees)}/${MAX_INVITEES})`}
		</Button>
	)
}
