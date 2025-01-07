import { notFound } from 'next/navigation'
import type { MarketWithVotesAndComments } from '~/components/market-item'
import { MarketItem } from '~/components/market-item'
import Nav from '~/components/nav'
import UserPill from '~/components/user-pill'
import { db } from '~/db'
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
							<UserPill {...user} showEmail={true} className="user-profile-name" />
						</div>
						<div className="user-profile-points">{points} points</div>
					</div>
					<div className="section">
						<h2 className="section-title">Created Markets ({user.markets.length}/10)</h2>
						<div className="table-container">
							<table className="table">
								<thead>
									<tr>
										<th style={{ width: '35%' }}>TITLE</th>
										<th style={{ width: '30%' }}>DESCRIPTION</th>
										<th style={{ width: '15%' }}>AUTHOR</th>
										<th style={{ width: '12%' }}>VOTES</th>
										<th style={{ width: '5%' }}>COMMENTS</th>
										<th style={{ width: '3%' }} />
									</tr>
								</thead>
								<tbody>
									{user.markets.map(market => (
										<MarketItem key={market.id} market={market as MarketWithVotesAndComments} />
									))}
								</tbody>
							</table>
						</div>
					</div>
					<div className="section">
						<h2 className="section-title">Upvoted Markets ({user.upvotedMarkets.length})</h2>
						<div className="table-container">
							<table className="table">
								<thead>
									<tr>
										<th style={{ width: '35%' }}>TITLE</th>
										<th style={{ width: '30%' }}>DESCRIPTION</th>
										<th style={{ width: '15%' }}>AUTHOR</th>
										<th style={{ width: '12%' }}>VOTES</th>
										<th style={{ width: '5%' }}>COMMENTS</th>
										<th style={{ width: '3%' }} />
									</tr>
								</thead>
								<tbody>
									{user.upvotedMarkets.map(({ market }) => (
										<MarketItem key={market.id} market={market as MarketWithVotesAndComments} />
									))}
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
