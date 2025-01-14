import {
	Card,
	Heading,
	Link,
	Page,
	Section,
	Stack,
	Table,
	TableCell,
	TableRow,
	Text
} from '@rubriclab/ui'
import { notFound, redirect } from 'next/navigation'
import { getSession } from '~/actions/auth'
import Nav from '~/components/nav'
import { ProbabilityAssignment } from '~/components/probability-assignment'
import { db } from '~/db'
import { formatDate } from '~/utils/date'

// January 20, 2025 at midnight EST = January 21, 2025 at 05:00 UTC
const PROBABILITIES_START_DATE = new Date('2025-01-21T05:00:00.000Z')

export default async function MarketProbabilityPage({
	params
}: {
	params: Promise<{ id: string }>
}) {
	// Redirect if before the start date
	if (new Date() < PROBABILITIES_START_DATE) {
		redirect('/markets')
	}

	const { id } = await params
	const { user } = await getSession()

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
			predictions: {
				select: {
					userId: true,
					probability: true,
					user: {
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

	const userPrediction = market.predictions.find(p => p.userId === user.id)?.probability
	const averageProbability = market.predictions.length
		? market.predictions.reduce((sum, p) => sum + p.probability, 0) / market.predictions.length
		: null

	return (
		<Page nav={<Nav />}>
			<Section>
				<Card ROLE="information" title={market.title}>
					<Stack>
						<Text content={market.description} />
						<Stack>
							<Text content="Posted by" />
							<Link ROLE="inline" href={`/users/${market.author.id}`}>
								{market.author.username || market.author.email}
							</Link>
							<Text content={`on ${formatDate(market.createdAt)}`} />
						</Stack>

						<Section>
							<Heading ROLE="section">Assign Your Probability</Heading>
							<ProbabilityAssignment marketId={market.id} initialProbability={userPrediction} />
						</Section>

						<Section>
							<Heading ROLE="section">Current Probability</Heading>
							<Text
								content={
									averageProbability !== null
										? `${(averageProbability * 100).toFixed(1)}% (based on ${market.predictions.length} predictions)`
										: 'No predictions yet'
								}
							/>
						</Section>

						{market.predictions.length > 0 && (
							<Section>
								<Heading ROLE="section">Individual Predictions</Heading>
								<Table>
									<TableRow>
										<TableCell ROLE="header">User</TableCell>
										<TableCell ROLE="header">Probability</TableCell>
									</TableRow>
									{market.predictions.map(prediction => (
										<TableRow key={prediction.userId}>
											<TableCell ROLE="data">
												<Link ROLE="inline" href={`/users/${prediction.user.id}`}>
													{prediction.user.username || prediction.user.email}
												</Link>
											</TableCell>
											<TableCell ROLE="data">{(prediction.probability * 100).toFixed(1)}%</TableCell>
										</TableRow>
									))}
								</Table>
							</Section>
						)}
					</Stack>
				</Card>
			</Section>
		</Page>
	)
}
