'use client'

import { Button, Stack, Text } from '@rubriclab/ui'
import { useState } from 'react'
import { assignProbability } from '~/actions/probability'

export function ProbabilityAssignment({
	marketId,
	initialProbability = 0.5
}: {
	marketId: string
	initialProbability?: number | undefined
}) {
	const [probability, setProbability] = useState(initialProbability ?? 0.5)
	const [submitting, setSubmitting] = useState(false)
	const [error, setError] = useState<string | null>(null)

	const handleSubmit = async () => {
		try {
			setSubmitting(true)
			setError(null)
			await assignProbability(marketId, probability)
			// Refresh the page to show updated probabilities
			window.location.reload()
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to assign probability')
		} finally {
			setSubmitting(false)
		}
	}

	return (
		<Stack>
			{error && <Text content={error} />}
			<Stack>
				<div className="flex items-center justify-between">
					<input
						type="range"
						min="0"
						max="100"
						value={probability * 100}
						onChange={e => setProbability(Number(e.target.value) / 100)}
						className="w-full"
					/>
					<Text content={`${(probability * 100).toFixed(1)}%`} />
				</div>
				<Button ROLE="success" onClick={handleSubmit} disabled={submitting} type="button">
					{submitting ? 'Saving...' : 'Assign Probability'}
				</Button>
			</Stack>
		</Stack>
	)
}
