'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { editMarket } from '~/actions/market'
import type { MarketWithVotesAndComments } from './market-item'

interface EditMarketFormProps {
	market: MarketWithVotesAndComments
	onClose: () => void
}

export function EditMarketForm({ market, onClose }: EditMarketFormProps) {
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
			onClose()
			router.refresh()
		} catch (err) {
			console.error('Error editing market:', err)
			setError(err instanceof Error ? err.message : 'Failed to edit market. Please try again.')
		}
	}

	return (
		<div className="modal-overlay">
			<div className="modal">
				<div className="modal-header">
					<h2 className="modal-title">Edit Market</h2>
					<button type="button" className="modal-close" onClick={onClose}>
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
							placeholder="How will this market be resolved?"
							value={resolutionCriteria}
							onChange={e => setResolutionCriteria(e.target.value)}
							required
							rows={4}
						/>
					</div>
					<div className="form-actions">
						<button type="submit" className="button">
							Save Changes
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}
