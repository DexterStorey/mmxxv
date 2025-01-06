'use client'

import { useEffect, useState } from 'react'

export default function InviteClient({ id }: { id: string }) {
	const [isCopied, setIsCopied] = useState(false)
	const [inviteLink, setInviteLink] = useState('')

	useEffect(() => {
		const url = new URL(window.location.href)
		url.searchParams.set('user', id)
		setInviteLink(url.toString())
	}, [id])

	return (
		<button
			type="button"
			onClick={() => {
				navigator.clipboard.writeText(inviteLink)
				setIsCopied(true)
			}}
			className="button"
			disabled={isCopied}
		>
			{isCopied ? 'Copied! Send to a friend.' : 'Copy Invite Link'}
		</button>
	)
}
