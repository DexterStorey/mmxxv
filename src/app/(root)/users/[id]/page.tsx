import { Card, Heading, Link, Page, Section, Stack, Text } from '@rubriclab/ui'
import { notFound } from 'next/navigation'
import { MarketsTable } from '~/components/markets-table'
import Nav from '~/components/nav'
import { MAX_MARKETS_PER_USER } from '~/constants'
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
		<Page nav={<Nav />}>
			<Section>
				<Card ROLE="information">
					<Stack>
						<Section>
							<Stack justify="between">
								<Stack>
									<Link ROLE="inline" href={`/users/${user.id}`}>
										{user.username || user.email}
									</Link>
									<Text content={user.bio || ''} />
								</Stack>
								<Text content={`${points} points`} />
							</Stack>
						</Section>

						<Section>
							<Heading ROLE="section">
								Created Markets ({user.markets.length}/{MAX_MARKETS_PER_USER})
							</Heading>
							<MarketsTable initialMarkets={user.markets as MarketWithVotesAndComments[]} />
						</Section>

						<Section>
							<Heading ROLE="section">Upvoted Markets ({user.upvotedMarkets.length})</Heading>
							<MarketsTable
								initialMarkets={user.upvotedMarkets.map(
									({ market }) => market as MarketWithVotesAndComments
								)}
							/>
						</Section>
					</Stack>
				</Card>
			</Section>
		</Page>
	)
}
