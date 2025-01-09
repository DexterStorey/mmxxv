'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useMemo, useState } from 'react'
import { deleteMarket } from '~/actions/market'
import type { MarketWithVotesAndComments } from '~/types/market'
import { DeleteMarketModal } from './delete-market-modal'
import { MarketRow } from './market-row'

const marketsTableCols = {
	title: { label: 'TITLE', width: '22%' },
	description: { label: 'DESCRIPTION', width: '23%' },
	categories: { label: 'TAGS', width: '15%' },
	author: { label: 'AUTHOR', width: '15%', accessor: 'username' },
	upvotes: { label: 'VOTES', width: '12%' },
	comments: { label: 'COMMENTS', width: '11%' }
} as const satisfies {
	[key in keyof Partial<MarketWithVotesAndComments>]: {
		label: string
		width: string
		accessor?: keyof MarketWithVotesAndComments[key]
	}
}

type MarketsTableCol = keyof typeof marketsTableCols

export function MarketsTableClient({ markets }: { markets: MarketWithVotesAndComments[] }) {
	const router = useRouter()
	const [marketToDelete, setMarketToDelete] = useState<string | null>(null)
	const [isDeleting, setIsDeleting] = useState(false)

	const searchParams = useSearchParams()
	const sort = useMemo(() => searchParams.get('sort'), [searchParams]) as MarketsTableCol | null
	const direction = useMemo(() => searchParams.get('direction'), [searchParams])

	const handleDelete = async () => {
		if (!marketToDelete) return

		try {
			setIsDeleting(true)
			await deleteMarket(marketToDelete)
			router.refresh()
		} catch (error) {
			alert(error instanceof Error ? error.message : 'Failed to delete market')
		} finally {
			setIsDeleting(false)
			setMarketToDelete(null)
		}
	}

	const handleSortChange = useCallback(
		(newSort: MarketsTableCol) => {
			const params = new URLSearchParams(searchParams)

			const newDirection =
				sort !== newSort ? 'asc' : direction === 'asc' ? 'desc' : direction === 'desc' ? null : 'asc'

			if (newDirection) {
				params.set('sort', newSort)
				params.set('direction', newDirection)
			} else {
				params.delete('sort')
				params.delete('direction')
			}

			router.push(`?${params.toString()}`)
		},
		[router, searchParams, sort, direction]
	)

	const sortBy = useCallback((sort: MarketsTableCol | null, direction: string | null) => {
		if (!sort || !direction) return () => 0

		const accessor =
			'accessor' in marketsTableCols[sort]
				? (marketsTableCols[sort].accessor as keyof MarketWithVotesAndComments[typeof sort])
				: null

		return (a: MarketWithVotesAndComments, b: MarketWithVotesAndComments) => {
			const multiplier = direction === 'asc' ? 1 : -1
			const [typeA, typeB] = [typeof a[sort], typeof b[sort]]

			if (typeA === 'string' && typeB === 'string') return multiplier * (a[sort] > b[sort] ? 1 : -1)

			if (typeA === 'number' && typeB === 'number')
				return multiplier * (Number(b[sort]) - Number(a[sort]))

			if (typeA === 'object' && typeB === 'object') {
				if (accessor) return multiplier * (a[sort][accessor] > b[sort][accessor] ? 1 : -1)

				if (Array.isArray(a[sort]) && Array.isArray(b[sort]))
					return multiplier * ((b[sort] || []).length - (a[sort] || []).length)

				return 0
			}

			return 0
		}
	}, [])

	return (
		<>
			<div className="table-container">
				<table className="table">
					<thead>
						<tr>
							{Object.entries(marketsTableCols).map(([title, { label, width }]) => (
								<th
									key={title}
									style={{ width }}
									onClick={() => handleSortChange(title as MarketsTableCol)}
									onKeyDown={e => {
										if (e.key === 'Enter') handleSortChange(title as MarketsTableCol)
									}}
								>
									{label} {sort === title ? <>{direction === 'asc' ? '↓' : '↑'}</> : null}
								</th>
							))}
							<th style={{ width: '30px' }} />
						</tr>
					</thead>
					<tbody>
						{markets.sort(sortBy(sort, direction)).map(market => (
							<MarketRow
								key={market.id}
								market={market}
								onDeleteClick={() => setMarketToDelete(market.id)}
							/>
						))}
					</tbody>
				</table>
			</div>

			<DeleteMarketModal
				isOpen={!!marketToDelete}
				onClose={() => setMarketToDelete(null)}
				onDelete={handleDelete}
				isDeleting={isDeleting}
			/>
		</>
	)
}
