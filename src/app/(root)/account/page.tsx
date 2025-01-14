import { Card, Page, Section } from '@rubriclab/ui'
import { getSession } from '~/actions/auth'
import { EditUserForm } from '~/components/edit-user-form'
import Nav from '~/components/nav'
import { SignOut } from '~/components/signout'
import { db } from '~/db'

export default async function AccountPage({
	searchParams
}: {
	searchParams: Promise<{ error?: string }>
}) {
	const { user } = await getSession()
	const { email, username, bio } = await db.user.findUniqueOrThrow({
		where: { id: user.id },
		select: { email: true, username: true, bio: true }
	})

	const { error } = await searchParams

	return (
		<Page nav={<Nav />}>
			<Section>
				<Card ROLE="information" title="Account">
					<p>Signed in as: {email}</p>
				</Card>
			</Section>

			<EditUserForm initialUsername={username} initialBio={bio} error={error} userId={user.id} />
			<SignOut />
		</Page>
	)
}
