'use client'

import { MarketCategory } from '@prisma/client'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback } from 'react'
import { useDebounce } from '~/hooks/use-debounce'

export function MarketFilters() {
	const router = useRouter()
	const searchParams = useSearchParams()

	const handleSearch = useDebounce((search: string) => {
		const params = new URLSearchParams(searchParams)
		if (search) {
			params.set('search', search)
		} else {
			params.delete('search')
		}
		router.push(`/markets?${params.toString()}`)
	}, 300)

	const handleCategoryChange = useCallback(
		(category: string) => {
			const params = new URLSearchParams(searchParams)
			if (category && category !== 'all') {
				params.set('category', category)
			} else {
				params.delete('category')
			}
			router.push(`/markets?${params.toString()}`)
		},
		[router, searchParams]
	)

	return (
		<div className="market-filters">
			<input
				type="text"
				placeholder="Search markets..."
				className="input"
				onChange={e => handleSearch(e.target.value)}
				defaultValue={searchParams.get('search') || ''}
			/>
			<select
				className="select"
				onChange={e => handleCategoryChange(e.target.value)}
				defaultValue={searchParams.get('category') || 'all'}
			>
				<option value="all">All Categories</option>
				{Object.entries(MarketCategory).map(([key, value]) => (
					<option key={key} value={value}>
						{key.charAt(0) + key.slice(1).toLowerCase().replace(/_/g, ' ')}
					</option>
				))}
			</select>
		</div>
	)
}
