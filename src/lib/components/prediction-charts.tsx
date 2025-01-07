'use client'

import {
	CategoryScale,
	Chart as ChartJS,
	Legend,
	LineElement,
	LinearScale,
	PointElement,
	Title,
	Tooltip
} from 'chart.js'
import { Line } from 'react-chartjs-2'
import { calculateCorrectPoints, calculateIncorrectPoints } from '../graphics/graphics'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend)

const commonOptions = {
	responsive: true,
	plugins: {
		legend: {
			position: 'top' as const
		}
	},
	scales: {
		x: {
			type: 'linear' as const,
			title: {
				display: true,
				text: 'Probability'
			},
			min: 0,
			max: 1,
			ticks: {
				stepSize: 0.1
			}
		}
	}
}

const correctOptions = {
	...commonOptions,
	scales: {
		...commonOptions.scales,
		y: {
			title: {
				display: true,
				text: 'Points'
			},
			min: 0,
			max: 125
		}
	}
}

const incorrectOptions = {
	...commonOptions,
	scales: {
		...commonOptions.scales,
		y: {
			title: {
				display: true,
				text: 'Points'
			},
			min: 0,
			max: 75
		}
	}
}

export default function PredictionCharts() {
	// Generate data points from 0.01 to 1.0 in increments of 0.01
	const probabilities = Array.from({ length: 100 }, (_, i) => (i + 1) / 100)

	const correctData = {
		datasets: [
			{
				label: 'Points for Correct Prediction',
				data: probabilities.map(p => ({ x: p, y: calculateCorrectPoints(p) })),
				borderColor: 'rgb(75, 192, 192)',
				backgroundColor: 'rgba(75, 192, 192, 0.5)'
			}
		]
	}

	const incorrectData = {
		datasets: [
			{
				label: 'Points Lost for Incorrect Prediction',
				data: probabilities.map(p => ({ x: p, y: calculateIncorrectPoints(p) })),
				borderColor: 'rgb(255, 99, 132)',
				backgroundColor: 'rgba(255, 99, 132, 0.5)'
			}
		]
	}

	return (
		<div className="my-4 grid grid-cols-1 gap-4 md:grid-cols-2">
			<div>
				<Line options={correctOptions} data={correctData} />
			</div>
			<div>
				<Line options={incorrectOptions} data={incorrectData} />
			</div>
		</div>
	)
}
