import { cookies } from 'next/headers'
import { z } from 'zod'
import { sendMagicLink } from '~/actions/auth'
import Nav from '~/components/nav'

async function handleSubmit(formData: FormData) {
	'use server'
	const { email, invitedBy } = z
		.object({
			email: z.string().email(),
			invitedBy: z.string().optional()
		})
		.parse(Object.fromEntries(formData.entries()))

	await sendMagicLink({
		email,
		...(invitedBy ? { invitedBy } : {})
	})
}

export default async function SignInPage() {
	const cookieStore = await cookies()
	const invitedBy = cookieStore.get('invitedBy')

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
							<input id="email" name="email" className="input" placeholder="your@email.com" />
						</div>
						<input type="hidden" name="invitedBy" value={invitedBy?.value} />
						<button type="submit" className="button-primary">
							Send Magic Link 🪄
						</button>
					</form>
				</div>
			</div>
		</>
	)
}
