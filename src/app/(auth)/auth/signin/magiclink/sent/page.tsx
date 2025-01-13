import Nav from '~/components/nav'
import { Card, Page, Section } from '~/ui'

export default function MagicLinkSent() {
	return (
		<Page nav={<Nav unauthenticated={true} />}>
			<Section>
				<Card ROLE="brand" title="Check your inbox! ✉️">
					<p>We've sent you a magic link to sign in. Click the link in your email to continue.</p>
				</Card>
			</Section>
		</Page>
	)
}
