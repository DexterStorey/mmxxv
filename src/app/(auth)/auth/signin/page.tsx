'use client'

import { Button, Input } from 'rubricui'
import { z } from 'zod'
import { sendMagicLink } from './actions'

async function handleSubmit(formData: FormData) {
	try {
		const { email } = z
			.object({ email: z.string().email() })
			.parse(Object.fromEntries(formData.entries()))
		await sendMagicLink({ email })
	} catch (e) {}
}

export default function SignInPage() {
	return (
		<>
			<h1>Welcome to MMXXV. A prediction game for 2025.</h1>
			<p>Enter your email to get started.</p>
			<form action={handleSubmit}>
				<Input name="email" />
				<Button type="submit">Send Magic Link 🪄</Button>
			</form>
		</>
	)
}
