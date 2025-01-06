'use client'

type Stage = {
	number: number
	title: string
	description: string
	endsAt: string
}

const stages: Stage[] = [
	{
		number: 0,
		title: 'Market Creation & Community',
		description:
			'Sign up, invite friends, create markets, and vote. The top 25 markets will be selected for the game. Earn points for referrals, creating markets, and getting your markets selected.',
		endsAt: 'January 23, 2025'
	},
	{
		number: 1,
		title: 'Money Lines',
		description:
			'Set your probability estimates for each market. Points awarded for aligning with the wisdom of the crowd.',
		endsAt: 'January 24, 2025'
	},
	{
		number: 2,
		title: 'Prediction',
		description: 'Submit your YES/NO predictions for each market you want to participate in.',
		endsAt: 'January 25, 2025'
	},
	{
		number: 3,
		title: 'Resolution',
		description:
			'Markets are resolved and final results announced. Early resolutions may be submitted throughout the year.',
		endsAt: 'December 31, 2025'
	}
]

function getCurrentStage(): number {
	if (stages.length === 0) return 0

	const now = new Date()
	for (const stage of stages) {
		if (now < new Date(stage.endsAt)) {
			return stage.number
		}
	}
	const lastStage = stages[stages.length - 1]
	return lastStage ? lastStage.number : 0
}

export function Timeline() {
	const currentStage = getCurrentStage()

	return (
		<div className="timeline">
			<div className="timeline-line" />
			{stages.map((stage, index) => (
				<div key={stage.number} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
					<div className={`timeline-card ${currentStage === stage.number ? 'current' : ''}`}>
						<div className="timeline-number">{stage.number}</div>
						<h3 className="timeline-title">
							Stage {stage.number}: {stage.title}
						</h3>
						<p className="timeline-description">{stage.description}</p>
						<time className="timeline-date">Ends on {stage.endsAt}</time>
					</div>
				</div>
			))}
		</div>
	)
}
