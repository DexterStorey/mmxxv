'use client'

import { Button, Card, Input, Section, TextArea } from '@rubriclab/ui'
import { useState } from 'react'
import { updateUsername } from '~/actions/user'

const errorMessages: Record<string, string> = {
	invalid: 'Username must be alphanumeric and between 1-20 characters',
	taken: 'Username is already taken',
	unknown: 'An error occurred'
}

export function EditUserForm({
	initialUsername,
	initialBio,
	error,
	userId
}: {
	initialUsername: string | null
	initialBio: string | null
	error: string | undefined
	userId: string
}) {
	const [username, setUsername] = useState(initialUsername)
	const [bio, setBio] = useState(initialBio)

	const errorMessage = error ? errorMessages[error] : null

	const handleSubmit = async () => {
		await updateUsername({ username: username || '', bio: bio || '', userId })
	}

	return (
		<Section>
			<Input
				name="username"
				label="Username"
				value={username || ''}
				onChange={e => setUsername(e.target.value)}
			/>
			<TextArea name="bio" label="Bio" value={bio || ''} onChange={value => setBio(value)} />
			<Button ROLE="success" onClick={handleSubmit}>
				Save
			</Button>
			{errorMessage && <Card ROLE="destructive">{errorMessage}</Card>}
		</Section>
	)
}
