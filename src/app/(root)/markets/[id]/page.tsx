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
		<div className="market-page">
			<Nav />
			<div className="container">
				{market.imageUrl && (
					<div className="market-banner">
						<div className="banner-image-container">
							<Image src={market.imageUrl} alt={market.title} fill className="banner-image" priority />
						</div>
						<div className="banner-overlay" />
						{market.categories?.length > 0 && (
							<div className="banner-categories">
								{market.categories.map(category => (
									<span key={category} className="category-tag">
										{category.replace(/_/g, ' ')}
									</span>
								))}
							</div>
						)}
					</div>
				)}
				<MarketDetail market={market} highlightedCommentId={commentId} />
			</div>
		</div>
	)
}
