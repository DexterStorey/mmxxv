'use client'

import { useState } from 'react'
import { createMarket } from '~/actions/market'
import { useRouter } from 'next/navigation'

export function CreateMarketForm() {
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
                resolutionCriteria: resolutionCriteria.trim(),
            })
            setIsOpen(false)
            setTitle('')
            setDescription('')
            setResolutionCriteria('')
            router.refresh()
        } catch (err) {
            console.error('Error creating market:', err)
            setError('Failed to create market. Please try again.')
        }
    }

    if (!isOpen) {
        return (
            <button className="button-primary" onClick={() => setIsOpen(true)}>
                Create Market
            </button>
        )
    }

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h2 className="modal-title">Create New Market</h2>
                    <button className="modal-close" onClick={() => setIsOpen(false)}>×</button>
                </div>
                <form onSubmit={handleSubmit} className="form">
                    {error && (
                        <div className="form-error">
                            {error}
                        </div>
                    )}
                    <div className="form-group">
                        <label className="form-label">Title</label>
                        <input
                            type="text"
                            className="input"
                            placeholder="e.g., Will AI surpass human intelligence?"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Description</label>
                        <textarea
                            className="textarea"
                            placeholder="Provide context and details about your prediction..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            rows={4}
                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Resolution Criteria</label>
                        <textarea
                            className="textarea"
                            placeholder="How will we determine if this prediction came true?"
                            value={resolutionCriteria}
                            onChange={(e) => setResolutionCriteria(e.target.value)}
                            required
                            rows={4}
                        />
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="button" onClick={() => setIsOpen(false)}>
                            Cancel
                        </button>
                        <button type="submit" className="button-primary">
                            Create Market
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
} 