import { cookies } from 'next/headers'
import Nav from '~/components/nav'
import { Timeline } from '~/components/timeline'
import PredictionCharts from '../../lib/components/prediction-charts'

export default async function About() {
	const userCookies = (await cookies()).get('user')

	return (
		<>
			<Nav unauthenticated={userCookies === undefined} />
			<div className="container">
				<div className="card">
					<h1 className="title">MMXIV</h1>
					<p className="description">A prediction game for 2025.</p>

					<div className="section">
						<h2 className="section-title">Game Stages</h2>
						<Timeline />
					</div>

					<div className="section">
						<h2 className="section-title">Points System</h2>

						<h3 className="subtitle">Initial Points</h3>
						<p>You can earn points in two ways during the early stages:</p>
						<ul>
							<li>10 points for each person you refer (up to 10 people, maximum 100 points)</li>
							<li>10 points for each market you create (up to 3 markets, maximum 30 points)</li>
						</ul>

						<h3 className="subtitle">Market Selection Bonus</h3>
						<p>
							If your created market makes it into the top 25 selected markets, you'll earn an additional
							100 points per selected market.
						</p>

						<h3 className="subtitle">Money Line Points</h3>
						<p>
							Points are awarded for making probability estimates that align with the wisdom of the crowd.
							Everyone starts with 100 points per market, and points are deducted based on how far your
							estimate is from the average prediction.
						</p>
						<div className="example">
							Example: You estimate a 10% chance for "Aliens make contact" while the average prediction is
							8%. You lose 2 points, resulting in 98 points for this market.
						</div>

						<h3 className="subtitle">Market Resolution Points</h3>
						<p>
							Points are awarded based on correct predictions, with more points given for correctly
							predicting unlikely outcomes. The points are calculated using the following formula:
						</p>
						<ul>
							<li>
								For correct predictions: You earn min(100, 5/x) points, where x is the money line
								probability
							</li>
							<li>
								For incorrect predictions: You lose min(50, 2/x) points, where x is the money line
								probability
							</li>
						</ul>

						<PredictionCharts />

						<div className="example">
							Example 1: A market has a 10% consensus probability (x = 0.1). You predict YES, and it
							happens. You earn 50 points (min(100, 5/0.1) = min(100, 50) = 50).
						</div>
						<div className="example">
							Example 2: A market has a 1% consensus probability (x = 0.01). You predict YES, and it
							happens. You earn 100 points (min(100, 5/0.01) = min(100, 500) = 100).
						</div>
						<div className="example">
							Example 3: A market has a 10% consensus probability (x = 0.1). You predict YES, and it
							doesn't happen. You lose 20 points (min(50, 2/0.1) = min(50, 20) = 20).
						</div>
						<p>
							Markets resolve either when their defined resolution criteria are met or at the end of 2025
							if the predicted event hasn't occurred. The winner of the game is the user with the highest
							total points summed across all predictions.
						</p>
					</div>

					<div className="section">
						<h2 className="section-title">Early Resolution</h2>
						<p>Some markets may resolve before the end of the year. When this happens:</p>
						<ul>
							<li>Any user can submit a resolution request</li>
							<li>An admin will review and may approve the early resolution</li>
							<li>Early resolutions are provisional and will be voted on at the end of the year</li>
							<li>Provisional points will be displayed on the leaderboard for entertainment</li>
						</ul>
						<div className="example">
							Example: A market about "Will X company release Y product?" might resolve early if the
							company makes an official announcement. A user can submit this as evidence for early
							resolution.
						</div>
					</div>

					<div className="section">
						<h2 className="section-title">Winning</h2>
						<p>The player with the most points at the end of the year wins all the marbles.</p>
					</div>

					<div className="section">
						<h2 className="section-title">Conflict Resolution</h2>
						<p>Markets should have clear, objective resolution criteria that everyone can agree on.</p>
						<p>
							If there is a dispute about a market's outcome, it will be put to a vote at the end of the
							year.
						</p>
						<p>
							Since this is our first year running this game, we will have a final vote to determine if the
							game was successful. If the majority votes yes, the prize will be awarded to the winner. If
							the majority votes no, all participants will be refunded.
						</p>
						<p>
							Players are strongly encouraged to resolve disputes in good faith. The game is designed to be
							self-governing, and admins will only handle technical matters.
						</p>
					</div>

					<div className="section">
						<h2 className="section-title">Code</h2>
						<p>
							This is an open source project. Contributions are welcome at{' '}
							<a href="https://github.com/RubricLab/mmxxv" className="market-meta">
								github.com/RubricLab/mmxxv
							</a>
						</p>
					</div>
				</div>
			</div>
		</>
	)
}
