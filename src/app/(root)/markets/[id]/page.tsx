import Image from 'next/image'
import { notFound } from 'next/navigation'
import { MarketDetail } from '~/components/market-detail'
import Nav from '~/components/nav'
import { db } from '~/db'

export default async function MarketPage({
	params,
	searchParams
}: {
	params: Promise<{ id: string }>
	searchParams: Promise<{ comment?: string }>
}) {
	const { id } = await params
	const { comment: commentId } = await searchParams

	const market = await db.market.findUnique({
		where: { id },
		include: {
			author: {
				select: {
					id: true,
					email: true,
					username: true
				}
			},
			upvoters: {
				select: { userId: true }
			},
			downvoters: {
				select: { userId: true }
			},
			comments: {
				orderBy: { createdAt: 'asc' },
				include: {
					author: {
						select: {
							id: true,
							email: true,
							username: true
						}
					},
					replies: {
						orderBy: { createdAt: 'asc' },
						include: {
							author: {
								select: {
									id: true,
									email: true,
									username: true
								}
							},
							replies: {
								orderBy: { createdAt: 'asc' },
								include: {
									author: {
										select: {
											id: true,
											email: true,
											username: true
										}
									},
									replies: {
										orderBy: { createdAt: 'asc' },
										include: {
											author: {
												select: {
													id: true,
													email: true,
													username: true
												}
											},
											replies: {
												orderBy: { createdAt: 'asc' },
												include: {
													author: {
														select: {
															id: true,
															email: true,
															username: true
														}
													}
												}
											}
										}
									}
								}
							}
						}
					}
				}
			},
			edits: {
				orderBy: {
					createdAt: 'desc'
				},
				include: {
					editor: {
						select: {
							id: true,
							email: true,
							username: true
						}
					}
				}
			}
		}
	})

	if (!market) {
		notFound()
	}

	const marketWithReplies = market

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
				<MarketDetail market={marketWithReplies} highlightedCommentId={commentId} />
			</div>
		</div>
	)
}
