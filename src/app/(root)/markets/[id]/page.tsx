import { Page, Section, Tag } from '@rubriclab/ui'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getMarketById } from '~/actions/market'
import { MarketDetail } from '~/components/market-detail'
import Nav from '~/components/nav'

export default async function MarketPage({
	params,
	searchParams
}: {
	params: Promise<{ id: string }>
	searchParams: Promise<{ commentId?: string }>
}) {
	const { id } = await params
	const { commentId } = await searchParams

	const market = await getMarketById(id)

	if (!market) {
		notFound()
	}

	return (
		<Page nav={<Nav />}>
			{market.imageUrl && (
				<Section>
					<Image width={500} height={200} src={market.imageUrl} alt={market.title} />
					{market.categories.map(category => (
						<Tag key={category} ROLE="category">
							{category.replace(/_/g, ' ')}
						</Tag>
					))}
				</Section>
			)}
			<MarketDetail market={market} highlightedCommentId={commentId} />
		</Page>
	)
}
