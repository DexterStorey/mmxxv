import Nav from '~/components/nav'
import { Timeline } from '~/components/timeline'

export default function About() {
	return (
		<>
			<Nav />
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

						<h3 className="subtitle">Market Creation</h3>
						<p>
							Users earn 10 points for each market they create, up to a maximum of 10 markets per user.
							This means you can earn up to 100 points from creating markets.
						</p>

						<h3 className="subtitle">Money line points</h3>
						<p>
							Points are deducted for being too far from the average prediction. Everyone starts with 100 *
							number of markets.
						</p>
						<div className="example">
							Example: You think the market "Aliens make contact" has a 10% chance of happening. The
							average prediction is 8%. You lose 2 points and get 98 points.
						</div>

						<h3 className="subtitle">Market points</h3>
						<p>
							Points are awarded based on how well you do in the markets you selected, and how surprising
							the outcome is.
						</p>
						<div className="example">
							Example 1: The market "Aliens make contact" has a 10% chance of happening. You vote YES. It
							happens. you get 100 points * 100/10 = 1000 points.
						</div>
						<div className="example">
							Example 2: The market "Aliens make contact" has a 10% chance of happening. You vote YES. It
							doesn't happen. You get 0 points.
						</div>
					</div>

					<div className="section">
						<h2 className="section-title">Winning</h2>
						<p>The player with the most points at the end of the game wins all the marbles.</p>
					</div>

					<div className="section">
						<h2 className="section-title">Conflict Resolution</h2>
						<p>
							Markets should have good resolution criteria, and everyone should be able to agree on the
							outcome.
						</p>
						<p>If there is a dispute, we will do a vote at the end of the game.</p>
						<p>
							Since this is the first year we are doing this, and may have some issues, we will do a vote
							at the end of the game as to whether the game was successful. If majority say yes, we will
							issue the prize money to the winner. If majority say no, we will refund everyone.
						</p>
						<p>
							Players are STRONGLY encouraged to resolve disputes in good faith, but no one will be banned
							and admins will not do anything other than dev stuff.
						</p>
					</div>
				</div>
			</div>
		</>
	)
}
