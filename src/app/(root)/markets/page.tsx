import type { MarketCategory } from '@prisma/client'
import { getSession } from '~/actions/auth'
import { CreateMarketForm } from '~/components/create-market-form'
import { MarketFilters } from '~/components/market-filters'
import { MarketsTable } from '~/components/markets-table'
import Nav from '~/components/nav'
import { db } from '~/db'

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

	return (
		<>
			<Nav />
			<div className="container">
				<div className="card">
					<div className="card-header">
						<div>
							<h1 className="title">Market Proposals</h1>
							<p className="description">
								Market Proposals are due on January 20. Submit markets and vote on which ones you want to
								see in the game!
							</p>
						</div>
						<div>
							<CreateMarketForm marketCount={marketCount} buttonText="Propose Market" />
						</div>
					</div>
					<MarketFilters />
					<div className="overflow-x-auto">
						<MarketsTable search={search} category={category} />
					</div>
				</div>
			</div>
		</>
	)
}
