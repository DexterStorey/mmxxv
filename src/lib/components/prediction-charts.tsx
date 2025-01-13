'use client'

import { Card, Chart, ChartLine, ChartLineItem } from '@rubriclab/ui'
import type { FC } from 'react'
import { calculateCorrectPoints, calculateIncorrectPoints } from '~/graphics/graphics'

const PredictionCharts: FC = () => {
	// Generate data points from 0.01 to 1.0 in increments of 0.01
	const probabilities = Array.from({ length: 100 }, (_, i) => (i + 1) / 100)

	const correctPoints = probabilities.map(p => ({
		x: p * 100, // Scale to 0-100 for SVG
		y: calculateCorrectPoints(p)
	}))

	const incorrectPoints = probabilities.map(p => ({
		x: p * 100, // Scale to 0-100 for SVG
		y: calculateIncorrectPoints(p)
	}))

	return (
		<>
			<Card ROLE="information" title="Points for Correct Prediction">
				<Chart height={400} width={500}>
					<ChartLine points={correctPoints} maxValue={125} />
					{[0, 0.25, 0.5, 0.75, 1].map(p => (
						<ChartLineItem
							key={p}
							x={p * 100}
							y={(calculateCorrectPoints(p) / 125) * 100}
							label={p.toString()}
						/>
					))}
				</Chart>
			</Card>
			<Card ROLE="information" title="Points Lost for Incorrect Prediction">
				<Chart height={400} width={500}>
					<ChartLine points={incorrectPoints} maxValue={75} />
					{[0, 0.25, 0.5, 0.75, 1].map(p => (
						<ChartLineItem
							key={p}
							x={p * 100}
							y={(calculateIncorrectPoints(p) / 75) * 100}
							label={p.toString()}
						/>
					))}
				</Chart>
			</Card>
		</>
	)
}

export default PredictionCharts
