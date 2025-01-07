'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { createMarket } from '~/actions/market'

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
			// Start progress animation
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
			<button
				type="button"
				className="button button-primary"
				onClick={() => setIsOpen(true)}
				disabled={marketCount >= 5}
				title={marketCount >= 5 ? 'You have created the maximum number of markets' : undefined}
			>
				{buttonText} ({marketCount}/5)
			</button>
		)
	}

	return (
		<div className="modal-overlay">
			<div className="modal">
				<div className="modal-header">
					<h2 className="modal-title">{buttonText}</h2>
					<button
						type="button"
						className="modal-close"
						onClick={() => setIsOpen(false)}
						disabled={isLoading}
					>
						×
					</button>
				</div>
				<form onSubmit={handleSubmit} className="form">
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
					<div className="form-group">
						<label htmlFor="market-title" className="form-label">
							itle
						</label>
						<input
							id="market-title"
							type="text"
							className="input"
							placeholder="e.g., Will AI surpass human intelligence?"
							value={title}
							onChange={e => setTitle(e.target.value)}
							required
							disabled={isLoading}
						/>
					</div>
					<div className="form-group">
						<label htmlFor="market-description" className="form-label">
							Description
						</label>
						<textarea
							id="market-description"
							className="textarea"
							placeholder="Provide context and details about your prediction..."
							value={description}
							onChange={e => setDescription(e.target.value)}
							required
							rows={4}
							disabled={isLoading}
						/>
					</div>
					<div className="form-group">
						<label htmlFor="market-resolution" className="form-label">
							Resolution Criteria
						</label>
						<textarea
							id="market-resolution"
							className="textarea"
							placeholder="How will we determine if this prediction came true?"
							value={resolutionCriteria}
							onChange={e => setResolutionCriteria(e.target.value)}
							required
							rows={4}
							disabled={isLoading}
						/>
					</div>
					<div className="modal-footer">
						<button
							type="button"
							className="button button-cancel"
							onClick={() => setIsOpen(false)}
							disabled={isLoading}
						>
							Cancel
						</button>
						<button type="submit" className="button button-primary" disabled={isLoading}>
							{isLoading ? 'Creating...' : buttonText}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}
