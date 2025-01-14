'use client'

import type { Market, User } from '@prisma/client'
import { Button, Input, Stack, Table, TableCell, TableRow, Text } from '@rubriclab/ui'
import { useState } from 'react'
import { assignProbability } from '~/actions/probability'

type MarketWithAuthor = Market & {
	author: Pick<User, 'id' | 'email' | 'username'>
	predictions?: { userId: string; probability: number }[]
}

export function ProbabilityMarketsTable({
	markets,
	userId
}: {
	markets: MarketWithAuthor[]
	userId: string
}) {
	const [probabilities, setProbabilities] = useState<Record<string, number>>({})
	const [submitting, setSubmitting] = useState<Record<string, boolean>>({})
	const [error, setError] = useState<string | null>(null)

	const handleProbabilityChange = (marketId: string, value: string) => {
		const probability = Number.parseFloat(value)
		if (Number.isNaN(probability) || probability < 0 || probability > 1) {
			return
		}
		setProbabilities(prev => ({ ...prev, [marketId]: probability }))
	}

	const handleSubmit = async (marketId: string) => {
		try {
			setSubmitting(prev => ({ ...prev, [marketId]: true }))
			setError(null)

			const probability = probabilities[marketId]
			if (probability === undefined) {
				throw new Error('Please enter a probability')
			}

			await assignProbability(marketId, probability)

			setProbabilities(prev => {
				const next = { ...prev }
				delete next[marketId]
				return next
			})
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Failed to assign probability')
		} finally {
			setSubmitting(prev => ({ ...prev, [marketId]: false }))
		}
	}

	return (
		<Stack>
			{error && <Text content={error} />}

			<Table>
				<TableRow>
					<TableCell ROLE="header">Title</TableCell>
					<TableCell ROLE="header">Description</TableCell>
					<TableCell ROLE="header">Author</TableCell>
					<TableCell ROLE="header">Current</TableCell>
					<TableCell ROLE="header">Your Prediction</TableCell>
				</TableRow>

				{markets.map(market => {
					const userPrediction = market.predictions?.find(p => p.userId === userId)?.probability
					const averageProbability = market.predictions?.length
						? market.predictions.reduce((sum, p) => sum + p.probability, 0) / market.predictions.length
						: null

					return (
						<TableRow key={market.id}>
							<TableCell ROLE="data">{market.title}</TableCell>
							<TableCell ROLE="data">{market.description}</TableCell>
							<TableCell ROLE="data">{market.author.username || market.author.email}</TableCell>
							<TableCell ROLE="data">
								{averageProbability !== null ? `${(averageProbability * 100).toFixed(1)}%` : '-'}
							</TableCell>
							<TableCell ROLE="data">
								<Stack justify="start">
									<Input
										type="number"
										min={0}
										max={1}
										step={0.01}
										value={probabilities[market.id] ?? userPrediction ?? ''}
										onChange={e => handleProbabilityChange(market.id, e.target.value)}
										placeholder="0.00-1.00"
									/>
									<Button
										ROLE="success"
										type="button"
										onClick={() => handleSubmit(market.id)}
										disabled={submitting[market.id]}
									>
										{submitting[market.id] ? '...' : 'Save'}
									</Button>
								</Stack>
							</TableCell>
						</TableRow>
					)
				})}
			</Table>
		</Stack>
	)
}
