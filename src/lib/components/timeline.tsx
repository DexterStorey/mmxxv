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
		title: 'Account creation',
		description: 'Sign up for an account, invite friends.',
		endsAt: 'January 20, 2025'
	},
	{
		number: 1,
		title: 'Market submission',
		description: 'Submit markets and resolution criteria.',
		endsAt: 'January 22, 2025'
	},
	{
		number: 2,
		title: 'Market voting',
		description:
			'Upvote / Downvote on the markets you think are interesting, suggest changes to the resolution criteria.',
		endsAt: 'January 23, 2025'
	},
	{
		number: 3,
		title: 'Money Lines',
		description:
			'Make your best guess on the probability of each market outcome. Get points for getting close to the wisdom of the crowd.',
		endsAt: 'January 24, 2025'
	},
	{
		number: 4,
		title: 'Prediction',
		description: 'Select YES/NO for each market you are interested in.',
		endsAt: 'January 25, 2025'
	},
	{
		number: 5,
		title: 'Resolution',
		description: 'The markets are resolved and the results are announced.',
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
