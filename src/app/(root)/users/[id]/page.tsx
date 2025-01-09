import { notFound } from 'next/navigation'
import { MarketsTable } from '~/components/markets-table'
import Nav from '~/components/nav'
import UserPill from '~/components/user-pill'
import { db } from '~/db'
import type { MarketWithVotesAndComments } from '~/types/market'
import { calculatePoints } from '~/utils/points'

type PageProps = {
	params: Promise<{ id: string }>
}

export default async function UserProfilePage({ params }: PageProps) {
	const { id } = await params

	const user = await db.user.findUnique({
		where: { id },
		include: {
			markets: {
				include: {
					author: { select: { email: true, username: true, id: true } },
					upvoters: { select: { userId: true } },
					downvoters: { select: { userId: true } },
					comments: {
						include: {
							author: { select: { email: true, username: true, id: true } },
							replies: {
								include: {
									author: { select: { email: true, username: true, id: true } }
								}
							}
						}
					}
				},
				orderBy: { createdAt: 'desc' }
			},
			invitees: {
				select: { id: true }
			},
			upvotedMarkets: {
				include: {
					market: {
						include: {
							author: { select: { email: true, username: true, id: true } },
							upvoters: { select: { userId: true } },
							downvoters: { select: { userId: true } },
							comments: {
								include: {
									author: { select: { email: true, username: true, id: true } },
									replies: {
										include: {
											author: { select: { email: true, username: true, id: true } }
										}
									}
								}
							}
						}
					}
				}
			}
		}
	})

	if (!user) return notFound()

	const points = calculatePoints(user)

	return (
		<>
			<Nav />
			<div className="container">
				<div className="card">
					<div className="user-profile-header">
						<div>
							<UserPill {...user} showEmail={false} className="user-profile-name" />
						</div>
						<div className="user-profile-points">{points} points</div>
					</div>
					<div className="section">
						<h2 className="section-title">Created Markets ({user.markets.length}/10)</h2>
						<div className="table-container">
							<MarketsTable markets={user.markets as MarketWithVotesAndComments[]} />
						</div>
					</div>
					<div className="section">
						<h2 className="section-title">Upvoted Markets ({user.upvotedMarkets.length})</h2>
						<div className="table-container">
							<MarketsTable
								markets={user.upvotedMarkets.map(({ market }) => market as MarketWithVotesAndComments)}
							/>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
