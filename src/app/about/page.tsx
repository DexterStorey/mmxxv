import { Card, Link, Page, Section } from '@rubriclab/ui'
import Heading from '@rubriclab/ui/src/components/heading/heading'
import { cookies } from 'next/headers'
import Nav from '~/components/nav'
import PredictionCharts from '~/components/prediction-charts'
import { Timeline } from '~/components/timeline'

export default async function About() {
	const userCookies = (await cookies()).get('user')

	return (
		<Page nav={<Nav unauthenticated={userCookies === undefined} />}>
			<Section title="MMXXV">
				<p>A prediction game for 2025.</p>
			</Section>
			<Section title="Game Stages">
				<Timeline />
			</Section>

			<Section title="Points System">
				<Heading ROLE="section">Initial Points</Heading>
				<p>You can earn points in two ways during the early stages:</p>
				<ul>
					<li>10 points for each person you refer (up to 5 people, maximum 50 points)</li>
					<li>10 points for each market you create (up to 5 markets, maximum 50 points)</li>
				</ul>
				<Heading ROLE="subsection">Market Selection Bonus</Heading>
				<p>
					If your created market makes it into the top 25 selected markets, you'll earn an additional 100
					points per selected market.
				</p>
				<Heading ROLE="subsection">Money Line Points</Heading>
				<p>
					Points are awarded for making probability estimates that align with the wisdom of the crowd.
					Everyone starts with 100 points per market, and points are deducted based on how far your
					estimate is from the average prediction.
				</p>
				<Card ROLE="information">
					<p>
						Example: You estimate a 10% chance for "Aliens make contact" while the average prediction is
						8%. You lose 2 points, resulting in 98 points for this market.
					</p>
				</Card>
				<Heading ROLE="subsection">Market Resolution Points</Heading>
				<p>
					Points are awarded based on correct predictions, with more points given for correctly
					predicting unlikely outcomes. The points are calculated using the following formula:
				</p>
				<ul>
					<li>
						For correct predictions: You earn min(100, 5/x) points, where x is the money line probability
					</li>
					<li>
						For incorrect predictions: You lose min(50, 2/x) points, where x is the money line probability
					</li>
				</ul>

				<PredictionCharts />

				<Card ROLE="information">
					<p>
						Example 1: A market has a 10% consensus probability (x = 0.1). You predict YES, and it
						happens. You earn 50 points (min(100, 5/0.1) = min(100, 50) = 50).
					</p>
				</Card>
				<Card ROLE="information">
					<p>
						Example 2: A market has a 1% consensus probability (x = 0.01). You predict YES, and it
						happens. You earn 100 points (min(100, 5/0.01) = min(100, 500) = 100).
					</p>
				</Card>
				<Card ROLE="information">
					<p>
						Example 3: A market has a 10% consensus probability (x = 0.1). You predict YES, and it doesn't
						happen. You lose 20 points (min(50, 2/0.1) = min(50, 20) = 20).
					</p>
				</Card>
			</Section>
			<Section title="Early Resolution">
				<p>Some markets may resolve before the end of the year. When this happens:</p>
				<ul>
					<li>Any user can submit a resolution request</li>
					<li>An admin will review and may approve the early resolution</li>
					<li>Early resolutions are provisional and will be voted on at the end of the year</li>
					<li>Provisional points will be displayed on the leaderboard for entertainment</li>
				</ul>
				<Card ROLE="information">
					<p>
						Example: A market about "Will X company release Y product?" might resolve early if the company
						makes an official announcement. A user can submit this as evidence for early resolution.
					</p>
				</Card>
			</Section>
			<Section title="Winning">
				<p>The player with the most points at the end of the year wins all the marbles.</p>
			</Section>
			<Section title="Conflict Resolution">
				<p>Markets should have clear, objective resolution criteria that everyone can agree on.</p>
				<p>
					If there is a dispute about a market's outcome, it will be put to a vote at the end of the
					year.
				</p>
				<p>
					Since this is our first year running this game, we will have a final vote to determine if the
					game was successful. If the majority votes yes, the prize will be awarded to the winner. If the
					majority votes no, all participants will be refunded.
				</p>
				<p>
					Players are strongly encouraged to resolve disputes in good faith. The game is designed to be
					self-governing, and admins will only handle technical matters.
				</p>
			</Section>
			<Section title="Code">
				<p>
					This is an open source project. Contributions are welcome at{' '}
					<Link ROLE="inline" href="https://github.com/RubricLab/mmxxv" external>
						github.com/RubricLab/mmxxv
					</Link>
					.
				</p>
			</Section>
		</Page>
	)
}
