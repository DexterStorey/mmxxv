'use client'

import { Button, Card, Input, Modal, TextArea } from '@rubriclab/ui'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { editMarket } from '~/actions/market'
import type { MarketWithVotesAndComments } from '~/types/market'
import { Heading } from '~/ui'

interface EditMarketFormProps {
	market: MarketWithVotesAndComments
}

export function EditMarketForm({ market }: EditMarketFormProps) {
	const [title, setTitle] = useState(market.title)
	const [description, setDescription] = useState(market.description)
	const [resolutionCriteria, setResolutionCriteria] = useState(market.resolutionCriteria)
	const [error, setError] = useState('')
	const router = useRouter()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('')

		if (!title.trim() || !description.trim() || !resolutionCriteria.trim()) {
			setError('All fields are required')
			return
		}

		try {
			await editMarket({
				id: market.id,
				title: title.trim(),
				description: description.trim(),
				resolutionCriteria: resolutionCriteria.trim()
			})
			setIsOpen(false)
			router.refresh()
		} catch (err) {
			console.error('Error editing market:', err)
			setError(err instanceof Error ? err.message : 'Failed to edit market. Please try again.')
		}
	}

	const [isOpen, setIsOpen] = useState(false)

	if (!isOpen)
		return (
			<Button ROLE="information" onClick={() => setIsOpen(true)}>
				Edit
			</Button>
		)

	return (
		<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
			<Heading ROLE="section">Edit Market</Heading>
			<Button ROLE="destructive" onClick={() => setIsOpen(false)}>
				Cancel
			</Button>
			{error && <Card ROLE="destructive">{error}</Card>}

			<Input
				label="Title"
				id="market-title"
				type="text"
				placeholder="e.g., Will AI surpass human intelligence?"
				value={title}
				onChange={e => setTitle(e.target.value)}
				required
			/>

			<TextArea
				label="Description"
				id="market-description"
				placeholder="Provide context and details about your prediction..."
				value={description}
				onChange={value => setDescription(value)}
				required
				rows={4}
			/>

			<TextArea
				placeholder="How will this market be resolved?"
				value={resolutionCriteria}
				onChange={value => setResolutionCriteria(value)}
				required
				rows={4}
			/>
			<Button ROLE="success" onClick={handleSubmit}>
				Save Changes
			</Button>
		</Modal>
	)
}
