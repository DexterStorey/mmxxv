'use client'

import { useSession } from '@rubriclab/auth'
import { Button, Heading, Input, Modal, Stack, Text } from '@rubriclab/ui'
import { useEffect, useState } from 'react'
import { updateUsername } from '~/actions/user'

type SessionUser = {
	id: string
	username?: string | null
}

export function UsernamePrompt() {
	const { user } = useSession()
	const [showPrompt, setShowPrompt] = useState(false)
	const [username, setUsername] = useState('')
	const sessionUser = user as SessionUser | null

	useEffect(() => {
		if (sessionUser?.username?.includes('-')) {
			setShowPrompt(true)
			setUsername(sessionUser.username.split('-')[0] || '')
		}
	}, [sessionUser?.username])

	const handleSubmit = async () => {
		if (!sessionUser?.id || !username.trim()) return
		await updateUsername({ username: username.trim(), bio: '', userId: sessionUser.id })
		setShowPrompt(false)
	}

	if (!showPrompt) return null

	return (
		<Modal isOpen={showPrompt} onClose={() => setShowPrompt(false)}>
			<Stack>
				<Heading ROLE="section">Set Your Username</Heading>
				<Text content="Choose a username to make it easier for others to mention you in comments." />
				<Stack>
					<Input
						label="Username"
						value={username}
						onChange={e => setUsername(e.target.value)}
						maxLength={20}
						placeholder="Choose a username"
						required
					/>
					<Text content="Only letters and numbers, up to 20 characters" />
					<Stack justify="end">
						<Button ROLE="destructive" onClick={() => setShowPrompt(false)}>
							Skip for now
						</Button>
						<Button ROLE="success" onClick={handleSubmit}>
							Save Username
						</Button>
					</Stack>
				</Stack>
			</Stack>
		</Modal>
	)
}
