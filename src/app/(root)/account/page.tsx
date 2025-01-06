import { getSession } from '~/actions/auth'
import { updateUsername } from '~/actions/user'
import Nav from '~/components/nav'
import { SignOut } from '~/components/signout'
import { db } from '~/db'

export default async function AccountPage({
	searchParams
}: {
	searchParams: Promise<{ error?: string }>
}) {
	const { user } = await getSession()
	const { email, username } = await db.user.findUniqueOrThrow({
		where: { id: user.id },
		select: { email: true, username: true }
	})

	const errorMessages = {
		invalid: 'Username must be alphanumeric and between 1-20 characters',
		taken: 'Username is already taken',
		unknown: 'An error occurred'
	}

	const { error } = await searchParams

	return (
		<>
			<Nav />
			<div className="container">
				<div className="card">
					<h1 className="title">Account</h1>
					<div className="section">
						<h2 className="section-title">Profile</h2>
						<p className="section-content">
							Signed in as: <span className="meta">{email}</span>
						</p>
						<form action={updateUsername} className="form">
							<div className="form-group">
								<label htmlFor="username" className="form-label">
									Username
								</label>
								<input
									type="text"
									name="username"
									defaultValue={username || ''}
									placeholder="Set username"
									className="input"
									maxLength={20}
								/>
								<input type="hidden" name="userId" value={user.id} />
								<button type="submit" className="button">
									Save
								</button>
								{error && (
									<p className="form-error">{errorMessages[error as keyof typeof errorMessages]}</p>
								)}
							</div>
						</form>
					</div>
					<div className="section">
						<SignOut />
					</div>
				</div>
			</div>
		</>
	)
}
