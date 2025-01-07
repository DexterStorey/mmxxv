'use client'

import { Button, Input } from 'rubricui'
import { z } from 'zod'
import { sendMagicLink } from '~/actions/auth'
import Nav from '~/components/nav'

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
			<Nav unauthenticated={true} />
			<div className="container">
				<div className="card">
					<h1 className="title">Welcome to MMXXV</h1>
					<p className="description">A prediction game for 2025. Enter your email to get started.</p>
					<form action={handleSubmit} className="form">
						<div className="form-group">
							<label htmlFor="email" className="form-label">
								Email
							</label>
							<Input id="email" name="email" className="input" placeholder="your@email.com" />
						</div>
						<Button type="submit" className="button-primary">
							Send Magic Link 🪄
						</Button>
					</form>
				</div>
			</div>
		</>
	)
}
