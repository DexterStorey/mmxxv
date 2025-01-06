'use client'

import { useState } from "react"
import { createMarket } from "../../app/(root)/markets/actions"

export function CreateMarketForm() {
    const [isOpen, setIsOpen] = useState(false)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [resolutionCriteria, setResolutionCriteria] = useState("")

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        
        if (!title.trim() || !description.trim() || !resolutionCriteria.trim()) {
            return
        }

        await createMarket({
            title,
            description,
            resolutionCriteria
        })

        // Reset form
        setTitle("")
        setDescription("")
        setResolutionCriteria("")
        setIsOpen(false)
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
                Create New Market
            </button>
        )
    }

    return (
        <div className="border p-4 rounded-lg mb-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Create New Market</h2>
                <button
                    onClick={() => setIsOpen(false)}
                    className="text-gray-500 hover:text-gray-700"
                >
                    ✕
                </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Title
                    </label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        placeholder="e.g., Will AI surpass human intelligence in 2025?"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        rows={3}
                        placeholder="Provide context and details about your prediction..."
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Resolution Criteria
                    </label>
                    <textarea
                        value={resolutionCriteria}
                        onChange={(e) => setResolutionCriteria(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                        rows={2}
                        placeholder="How will we determine if this prediction came true?"
                    />
                </div>
                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="px-4 py-2 border rounded hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Create Market
                    </button>
                </div>
            </form>
        </div>
    )
} 