'use client'

import { Button, Input, Section } from '@rubriclab/ui'
import { useState } from 'react'
import { sendMagicLink } from '~/actions/auth'

export function SignInForm({ invitedBy }: { invitedBy?: string | undefined }) {
	const [email, setEmail] = useState('')

	const handleSubmit = async () => {
		await sendMagicLink({ email, invitedBy })
	}

	return (
		<Section>
			<Input value={email} label="Email" onChange={e => setEmail(e.target.value)} />
			<Button ROLE="brand" onClick={handleSubmit}>
				Send Magic Link
			</Button>
		</Section>
	)
}
