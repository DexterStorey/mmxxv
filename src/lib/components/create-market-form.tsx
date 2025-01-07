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
	const router = useRouter()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		setError('')

		if (!title.trim() || !description.trim() || !resolutionCriteria.trim()) {
			setError('All fields are required')
			return
		}

		try {
			await createMarket({
				title: title.trim(),
				description: description.trim(),
				resolutionCriteria: resolutionCriteria.trim()
			})
			setIsOpen(false)
			setTitle('')
			setDescription('')
			setResolutionCriteria('')
			router.refresh()
		} catch (err) {
			console.error('Error creating market:', err)
			setError(err instanceof Error ? err.message : 'Failed to create market. Please try again.')
		}
	}

	if (!isOpen) {
		return (
			<button
				type="button"
				className="button button-primary"
				onClick={() => setIsOpen(true)}
				disabled={marketCount >= 10}
				title={marketCount >= 10 ? 'You have created the maximum number of markets' : undefined}
			>
				{buttonText} ({marketCount}/10)
			</button>
		)
	}

	return (
		<div className="modal-overlay">
			<div className="modal">
				<div className="modal-header">
					<h2 className="modal-title">{buttonText}</h2>
					<button type="button" className="modal-close" onClick={() => setIsOpen(false)}>
						×
					</button>
				</div>
				<form onSubmit={handleSubmit} className="form">
					{error && <div className="form-error">{error}</div>}
					<div className="form-group">
						<label htmlFor="market-title" className="form-label">
							Title
						</label>
						<input
							id="market-title"
							type="text"
							className="input"
							placeholder="e.g., Will AI surpass human intelligence?"
							value={title}
							onChange={e => setTitle(e.target.value)}
							required
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
						/>
					</div>
					<div className="modal-footer">
						<button type="button" className="button button-cancel" onClick={() => setIsOpen(false)}>
							Cancel
						</button>
						<button type="submit" className="button button-primary">
							{buttonText}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}
