import { getSession } from '~/actions/auth'
import Nav from '~/components/nav'
import { SignOut } from '~/components/signout'
import { db } from '~/db'

export default async function AccountPage() {
	const { user } = await getSession()
	const email = await db.user.findUniqueOrThrow({
		where: { id: user.id },
		select: { email: true }
	})

	return (
		<>
			<Nav />
			<div className="container">
				<div className="card">
					<h1 className="title">Account</h1>
					<div className="section">
						<h2 className="section-title">Profile</h2>
						<p className="section-content">
							Signed in as: <span className="meta">{email.email}</span>
						</p>
					</div>
					<div className="section">
						<SignOut />
					</div>
				</div>
			</div>
		</>
	)
}
