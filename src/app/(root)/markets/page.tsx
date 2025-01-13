import type { MarketCategory } from '@prisma/client'
import { getSession } from '~/actions/auth'
import { getMarkets } from '~/actions/market'
import { CreateMarketForm } from '~/components/create-market-form'
import { MarketsTable } from '~/components/markets-table'
import Nav from '~/components/nav'
import { db } from '~/db'
import { Card, Page, Section } from '~/ui'

export const maxDuration = 300

export default async function MarketsPage({
	searchParams
}: {
	searchParams: Promise<{ search?: string; category?: MarketCategory }>
}) {
	const { user } = await getSession()
	const { search, category } = await searchParams

	const marketCount = await db.market.count({
		where: {
			authorId: user.id
		}
	})

	const initialMarkets = await getMarkets({ search, category, limit: 50 })

	return (
		<Page nav={<Nav />}>
			<Section>
				<Card ROLE="information" title="Market Proposals">
					<p>
						Market Proposals are due on January 20. Submit markets and vote on which ones you want to see
						in the game!
					</p>
					<CreateMarketForm marketCount={marketCount} buttonText="Propose Market" />
				</Card>
			</Section>
			<Section>
				<MarketsTable initialMarkets={initialMarkets} />
			</Section>
		</Page>
	)
}
