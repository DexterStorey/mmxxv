'use client'

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
    <div className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <input
            type="range"
            min="0"
            max="100"
            value={probability * 100}
            onChange={e => setProbability(Number(e.target.value) / 100)}
            className="w-full"
          />
          <span className="ml-4 w-16 text-right">
            {(probability * 100).toFixed(1)}%
          </span>
        </div>
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="button"
        >
          {submitting ? 'Saving...' : 'Assign Probability'}
        </button>
      </div>
    </div>
  )
} 