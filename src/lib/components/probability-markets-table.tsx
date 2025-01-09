'use client'

import type { Market, User } from '@prisma/client'
import { useState } from 'react'
import { assignProbability } from '~/actions/probability'

type MarketWithAuthor = Market & {
  author: Pick<User, 'id' | 'email' | 'username'>
  predictions?: { userId: string; probability: number }[]
}

export function ProbabilityMarketsTable({ markets, userId }: { markets: MarketWithAuthor[], userId: string }) {
  const [probabilities, setProbabilities] = useState<Record<string, number>>({})
  const [submitting, setSubmitting] = useState<Record<string, boolean>>({})
  const [error, setError] = useState<string | null>(null)

  const handleProbabilityChange = (marketId: string, value: string) => {
    const probability = parseFloat(value)
    if (isNaN(probability) || probability < 0 || probability > 1) {
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
      
      // Clear the input after successful submission
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
    <div className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-4 text-red-700">
          {error}
        </div>
      )}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th style={{ width: '35%' }}>TITLE</th>
              <th style={{ width: '30%' }}>DESCRIPTION</th>
              <th style={{ width: '15%' }}>AUTHOR</th>
              <th style={{ width: '10%' }}>CURRENT</th>
              <th style={{ width: '10%' }}>YOUR PREDICTION</th>
            </tr>
          </thead>
          <tbody>
            {markets.map(market => {
              const userPrediction = market.predictions?.find(p => p.userId === userId)?.probability
              const averageProbability = market.predictions?.length 
                ? market.predictions.reduce((sum, p) => sum + p.probability, 0) / market.predictions.length 
                : null

              return (
                <tr key={market.id}>
                  <td>{market.title}</td>
                  <td>{market.description}</td>
                  <td>{market.author.username || market.author.email}</td>
                  <td>
                    {averageProbability !== null 
                      ? `${(averageProbability * 100).toFixed(1)}%`
                      : '-'
                    }
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="1"
                        step="0.01"
                        value={probabilities[market.id] ?? userPrediction ?? ''}
                        onChange={e => handleProbabilityChange(market.id, e.target.value)}
                        placeholder="0.00-1.00"
                        className="input w-24"
                      />
                      <button
                        onClick={() => handleSubmit(market.id)}
                        disabled={submitting[market.id]}
                        className="button"
                      >
                        {submitting[market.id] ? '...' : 'Save'}
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
} 