// import { db } from '~/db'
import { Card, Footer, Link, Page, Section } from '@rubriclab/ui'
import { getSession } from '~/actions/auth'
import { getMarkets } from '~/actions/market'
import Invite from '~/components/invite'
import { MarketsTable } from '~/components/markets-table'
import Nav from '~/components/nav'

export default async () => {
	await getSession()

	// const { stage } = await db.settings.findUniqueOrThrow({ where: { id: '0' } })

	const markets = await getMarkets({ limit: 50 })

	return (
		<Page
			nav={<Nav />}
			footer={
				<Footer>
					<Link ROLE="inline" href="https://github.com/RubricLab/mmxxv" external>
						Built with love by Rubric and Friends Sam, Tanner, Ted and Dexter
					</Link>
				</Footer>
			}
		>
			<Section>
				<Card ROLE="brand" title="Welcome to MMXXV">
					<p>A prediction game for 2025.</p>
					<Invite />
				</Card>
			</Section>

			<Section>
				<MarketsTable initialMarkets={markets} />
			</Section>
		</Page>
	)
}
