'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { deleteMarket } from '~/actions/market'
import type { MarketWithVotesAndComments } from '~/types/market'
import { DeleteMarketModal } from './delete-market-modal'
import { MarketRow } from './market-row'

type DeleteModalState = {
	isOpen: boolean
	marketId: string | null
}

export function MarketsTable({ markets }: { markets: MarketWithVotesAndComments[] }) {
	const router = useRouter()
	const [deleteModal, setDeleteModal] = useState<DeleteModalState>({
		isOpen: false,
		marketId: null
	})
	const [isDeleting, setIsDeleting] = useState(false)

	const handleDelete = async () => {
		if (!deleteModal.marketId) return

		try {
			setIsDeleting(true)
			await deleteMarket(deleteModal.marketId)
			router.refresh()
		} catch (error) {
			alert(error instanceof Error ? error.message : 'Failed to delete market')
		} finally {
			setIsDeleting(false)
			setDeleteModal({ isOpen: false, marketId: null })
		}
	}

	return (
		<>
			<table className="table">
				<thead>
					<tr>
						<th style={{ width: '35%' }}>TITLE</th>
						<th style={{ width: '30%' }}>DESCRIPTION</th>
						<th style={{ width: '15%' }}>AUTHOR</th>
						<th style={{ width: '12%' }}>VOTES</th>
						<th style={{ width: '5%' }}>COMMENTS</th>
						<th style={{ width: '3%' }} />
					</tr>
				</thead>
				<tbody>
					{markets.map(market => (
						<MarketRow
							key={market.id}
							market={market}
							onDeleteClick={() => setDeleteModal({ isOpen: true, marketId: market.id })}
						/>
					))}
				</tbody>
			</table>

			<DeleteMarketModal
				isOpen={deleteModal.isOpen}
				onClose={() => setDeleteModal({ isOpen: false, marketId: null })}
				onDelete={handleDelete}
				isDeleting={isDeleting}
			/>
		</>
	)
}
