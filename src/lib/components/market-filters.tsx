'use client'

import { MarketCategory } from '@prisma/client'
import { Search, Section, Select, SelectOption } from '@rubriclab/ui'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { useDebounce } from '~/hooks/use-debounce'

export function MarketFilters() {
	const router = useRouter()
	const searchParams = useSearchParams()
	const [searchValue, setSearchValue] = useState(searchParams.get('search') || '')

	const handleSearch = useDebounce((search: string) => {
		const params = new URLSearchParams(searchParams)
		if (search) {
			params.set('search', search)
		} else {
			params.delete('search')
		}
		router.push(`/markets?${params.toString()}`)
	}, 300)

	const handleSearchChange = (value: string) => {
		setSearchValue(value)
		handleSearch(value)
	}

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
		<Section>
			<Search
				ROLE="filter"
				placeholder="Search markets..."
				onChange={handleSearchChange}
				value={searchValue}
			/>
			<Select
				onChange={value => handleCategoryChange(value)}
				value={searchParams.get('category') || 'all'}
			>
				<SelectOption value="all">All Categories</SelectOption>
				{Object.entries(MarketCategory).map(([key, value]) => (
					<SelectOption key={key} value={value}>
						{key.charAt(0) + key.slice(1).toLowerCase().replace(/_/g, ' ')}
					</SelectOption>
				))}
			</Select>
		</Section>
	)
}
