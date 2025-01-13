'use client'

import { Heading, Input, Modal, TextArea } from '@rubriclab/ui'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createMarket } from '~/actions/market'
import { MAX_MARKETS_PER_USER } from '~/constants'
import { Button } from '~/ui'

interface CreateMarketFormProps {
	marketCount: number
	buttonText?: string
}

export function CreateMarketForm({
	marketCount,
	buttonText = 'Create Market'
}: CreateMarketFormProps) {
	const [isOpen, setIsOpen] = useState(false)
	const [title, setTitle] = useState('')
	const [description, setDescription] = useState('')
	const [resolutionCriteria, setResolutionCriteria] = useState('')
	const [error, setError] = useState('')
	const [isLoading, setIsLoading] = useState(false)
	const [loadingSteps, setLoadingSteps] = useState<string[]>([])
	const [progress, setProgress] = useState(0)
	const router = useRouter()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('')
		setIsLoading(true)
		setProgress(0)
		setLoadingSteps(['Creating market...'])

		if (!title.trim() || !description.trim() || !resolutionCriteria.trim()) {
			setError('All fields are required')
			setIsLoading(false)
			setLoadingSteps([])
			return
		}

		try {
			const progressInterval = setInterval(() => {
				setProgress(prev => {
					if (prev >= 90) return prev
					if (prev < 30) return prev + 10
					if (prev < 60) return prev + 5
					return prev + 2
				})
			}, 500)

			setLoadingSteps(prev => [...prev, 'Generating image...', 'Generating categories...'])
			const result = await createMarket({
				title: title.trim(),
				description: description.trim(),
				resolutionCriteria: resolutionCriteria.trim()
			})

			clearInterval(progressInterval)
			setProgress(100)
			setLoadingSteps(prev => [...prev, 'Redirecting...'])
			setIsOpen(false)
			setTitle('')
			setDescription('')
			setResolutionCriteria('')
			router.push(`/markets/${result.id}`)
		} catch (err) {
			console.error('Error creating market:', err)
			setError(err instanceof Error ? err.message : 'Failed to create market. Please try again.')
			setIsLoading(false)
			setLoadingSteps([])
			setProgress(0)
		}
	}

	if (!isOpen) {
		return (
			<Button
				ROLE="information"
				onClick={() => setIsOpen(true)}
				disabled={marketCount >= MAX_MARKETS_PER_USER}
			>
				{buttonText} ({marketCount}/{MAX_MARKETS_PER_USER})
			</Button>
		)
	}

	return (
		<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
			<Heading ROLE="section">{buttonText}</Heading>
			<Button ROLE="destructive" onClick={() => setIsOpen(false)} disabled={isLoading}>
				Cancel
			</Button>
			{error && <div className="form-error">{error}</div>}
			{isLoading && loadingSteps.length > 0 && (
				<div className="form-status">
					<div className="loading-steps">
						{loadingSteps.map((step, index) => (
							<div key={index} className="loading-step">
								{step}
							</div>
						))}
					</div>
					<div className="progress-bar">
						<div className="progress-fill" style={{ width: `${progress}%` }} />
					</div>
				</div>
			)}

			<Input
				label="Title"
				placeholder="e.g., Will AI surpass human intelligence?"
				value={title}
				onChange={e => setTitle(e.target.value)}
				required
				disabled={isLoading}
			/>

			<TextArea
				label="Description"
				placeholder="Provide context and details about your prediction..."
				value={description}
				onChange={value => setDescription(value)}
				required
				rows={4}
				disabled={isLoading}
			/>
			<TextArea
				label="Resolution Criteria"
				placeholder="How will we determine if this prediction came true?"
				value={resolutionCriteria}
				onChange={value => setResolutionCriteria(value)}
				required
				rows={4}
				disabled={isLoading}
			/>
			<Button ROLE="destructive" onClick={() => setIsOpen(false)} disabled={isLoading}>
				Cancel
			</Button>
			<Button ROLE="success" onClick={handleSubmit} disabled={isLoading}>
				{isLoading ? 'Creating...' : buttonText}
			</Button>
		</Modal>
	)
}
