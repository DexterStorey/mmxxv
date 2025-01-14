'use client'

import { MarketCategory } from '@prisma/client'
import {
	Button,
	Heading,
	Link,
	Pill,
	Search,
	Section,
	Select,
	SelectOption,
	Stack,
	Table,
	TableCell,
	TableRow,
	Tag
} from '@rubriclab/ui'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { downvoteMarket, getMarkets, upvoteMarket } from '~/actions/market'
import { useDebounce } from '~/hooks/use-debounce'
import type { MarketFromAction } from '~/types/market'
import { formatDate } from '~/utils/date'

export function MarketsTable({
	initialMarkets
}: {
	initialMarkets: MarketFromAction[]
}) {
	const router = useRouter()
	const searchParams = useSearchParams()
	const [markets, setMarkets] = useState(initialMarkets)
	const [searchValue, setSearchValue] = useState(searchParams.get('search') || '')

	const handleSearch = useDebounce(async (search: string) => {
		const params = new URLSearchParams(searchParams)
		if (search) {
			params.set('search', search)
		} else {
			params.delete('search')
		}
		router.push(`/markets?${params.toString()}`)
		const updatedMarkets = await getMarkets({
			search,
			category: (searchParams.get('category') as MarketCategory) || undefined,
			limit: 50
		})
		setMarkets(updatedMarkets)
	}, 300)

	const handleSearchChange = (value: string) => {
		setSearchValue(value)
		handleSearch(value)
	}

	const handleCategoryChange = useCallback(
		async (category: string) => {
			const params = new URLSearchParams(searchParams)
			if (category && category !== 'all') {
				params.set('category', category)
			} else {
				params.delete('category')
			}
			router.push(`/markets?${params.toString()}`)
			const updatedMarkets = await getMarkets({
				search: searchParams.get('search') || undefined,
				category: category !== 'all' ? (category as MarketCategory) : undefined,
				limit: 50
			})
			setMarkets(updatedMarkets)
		},
		[router, searchParams]
	)

	return (
		<>
			<Section>
				<Stack>
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
				</Stack>
			</Section>

			<Table>
				<TableRow>
					<TableCell ROLE="header">Title</TableCell>
					<TableCell ROLE="header">Description</TableCell>
					<TableCell ROLE="header">Tags</TableCell>
					<TableCell ROLE="header">Author</TableCell>
					<TableCell ROLE="header">Votes</TableCell>
					<TableCell ROLE="header">Comments</TableCell>
				</TableRow>
				{markets.map(market => (
					<TableRow key={market.id}>
						<TableCell ROLE="data">
							<Link ROLE="inline" href={`/markets/${market.id}`} key={market.id}>
								<Heading ROLE="section">{market.title}</Heading>
							</Link>
							<Pill ROLE="status">{`Updated ${formatDate(market.updatedAt)}`}</Pill>
						</TableCell>
						<TableCell ROLE="data">{market.description}</TableCell>
						<TableCell ROLE="data">
							{market.categories?.map(category => (
								<Tag ROLE="category" key={category}>
									{category.toLowerCase()}
								</Tag>
							))}
						</TableCell>
						<TableCell ROLE="data">
							<Link ROLE="inline" href={`/users/${market.author.id}`}>
								{market.author.username}
							</Link>
						</TableCell>
						<TableCell ROLE="data">
							<Button ROLE="success" onClick={() => upvoteMarket(market.id)}>
								↑{market.upvoters.length}
							</Button>
							<Button ROLE="destructive" onClick={() => downvoteMarket(market.id)}>
								↓{market.downvoters.length}
							</Button>
						</TableCell>
						<TableCell ROLE="data">{market.comments.length}</TableCell>
					</TableRow>
				))}
			</Table>
		</>
	)
}
