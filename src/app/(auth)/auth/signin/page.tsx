import { cookies } from 'next/headers'
import Nav from '~/components/nav'
import { SignInForm } from '~/components/sign-in-form'
import { Card, Page, Section } from '~/ui'

export default async function SignInPage() {
	const cookieStore = await cookies()
	const invitedBy = cookieStore.get('invitedBy')

	return (
		<Page nav={<Nav unauthenticated={true} />}>
			<Section>
				<Card ROLE="brand" title="Sign In">
					<SignInForm invitedBy={invitedBy?.value} />
				</Card>
			</Section>
		</Page>
	)
}
