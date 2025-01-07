'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { deleteMarket } from '~/actions/market'
import type { MarketWithVotesAndComments } from '~/types/market'
import { DeleteMarketModal } from './delete-market-modal'
import { MarketRow } from './market-row'

export function MarketsTable({ markets }: { markets: MarketWithVotesAndComments[] }) {
	const router = useRouter()
	const [marketToDelete, setMarketToDelete] = useState<string | null>(null)
	const [isDeleting, setIsDeleting] = useState(false)

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

	return (
		<>
			<div className="table-container">
				<table className="table">
					<thead>
						<tr>
							<th style={{ width: '22%' }}>TITLE</th>
							<th style={{ width: '23%' }}>DESCRIPTION</th>
							<th style={{ width: '15%' }}>TAGS</th>
							<th style={{ width: '15%' }}>AUTHOR</th>
							<th style={{ width: '12%' }}>VOTES</th>
							<th style={{ width: '9%', textAlign: 'center' }}>COMMENTS</th>
							<th style={{ width: '40px' }} />
						</tr>
					</thead>
					<tbody>
						{markets.map(market => (
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
