import { notFound } from 'next/navigation'
import { MarketDetail } from '~/components/market-detail'
import type { MarketWithVotesAndComments } from '~/components/market-item'
import Nav from '~/components/nav'
import { db } from '~/db'

type PageProps = {
	params: Promise<{ id: string }>
}

export default async function MarketPage({ params }: PageProps) {
	const { id } = await params
	const market = await db.market.findUnique({
		where: { id },
		include: {
			author: {
				select: { email: true, id: true }
			},
			upvoters: {
				select: { userId: true }
			},
			downvoters: {
				select: { userId: true }
			},
			comments: {
				include: {
					author: {
						select: { email: true, id: true }
					},
					replies: {
						include: {
							author: {
								select: { email: true, id: true }
							}
						}
					}
				}
			}
		}
	})

	if (!market) {
		notFound()
	}

	// Transform the data to match the expected type
	const marketWithReplies: MarketWithVotesAndComments = {
		...market,
		comments: market.comments.map(comment => ({
			...comment,
			replies: comment.replies.map(reply => ({
				...reply,
				replies: []
			}))
		}))
	}

	return (
		<>
			<Nav />
			<div className="container">
				<MarketDetail market={marketWithReplies} />
			</div>
		</>
	)
}
