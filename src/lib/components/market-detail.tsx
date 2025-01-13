'use client'

import { Button, Card, Heading, Link, Modal, Section } from '@rubriclab/ui'
import { formatDistanceToNow } from 'date-fns'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getSession } from '~/actions/auth'
import { deleteMarket } from '~/actions/market'
import type { MarketWithVotesAndComments } from '~/types/market'
import { DeleteMarketModal } from './delete-market-modal'
import { EditMarketForm } from './edit-market-form'
import { MarketComments } from './market-comments'
import { MarketEditHistory } from './market-edit-history'
import { MarketVotes } from './market-votes'

export function MarketDetail({
	market,
	highlightedCommentId,
	hideTitle = false
}: {
	market: MarketWithVotesAndComments & {
		edits: Array<{
			id: string
			createdAt: Date
			editor: {
				id: string
				username: string | null
				email: string
			}
			previousTitle: string
			previousDescription: string
			previousResolutionCriteria: string
			newTitle: string
			newDescription: string
			newResolutionCriteria: string
		}>
	}
	highlightedCommentId: string | undefined
	hideTitle?: boolean
}) {
	const router = useRouter()
	const [isDeleting, setIsDeleting] = useState(false)
	const [showDeleteModal, setShowDeleteModal] = useState(false)
	const [userId, setUserId] = useState<string | null>(null)

	useEffect(() => {
		getSession().then(session => setUserId(session.user.id))
	}, [])

	const handleDelete = async () => {
		try {
			setIsDeleting(true)
			await deleteMarket(market.id)
			router.push('/markets')
		} catch (error) {
			alert(error instanceof Error ? error.message : 'Failed to delete market')
			setIsDeleting(false)
		}
	}

	return (
		<>
			<Section>
				<Card ROLE="information">
					{!hideTitle && (
						<>
							<Heading ROLE="page">{market.title}</Heading>
							<p>
								Posted by{' '}
								<Link ROLE="inline" href={`/users/${market.author.id}`}>
									{market.author.username}
								</Link>{' '}
								{formatDistanceToNow(market.createdAt)} ago
							</p>
						</>
					)}
					{userId === market.author.id && (
						<>
							<EditMarketForm market={market} />
							<Button ROLE="destructive" onClick={() => setShowDeleteModal(true)} disabled={isDeleting}>
								{isDeleting ? 'Deleting...' : 'Delete'}
							</Button>
						</>
					)}
				</Card>

				<Card ROLE="information">
					<Heading ROLE="section">Description</Heading>
					<p>{market.description}</p>
				</Card>

				<Card ROLE="information">
					<Heading ROLE="section">Resolution Criteria</Heading>
					<p>{market.resolutionCriteria}</p>
				</Card>
			</Section>

			<MarketVotes market={market} />
			<MarketEditHistory edits={market.edits || []} />
			<MarketComments market={market} highlightedCommentId={highlightedCommentId} />
			{showDeleteModal && (
				<DeleteMarketModal
					isOpen={showDeleteModal}
					onClose={() => setShowDeleteModal(false)}
					onDelete={handleDelete}
					isDeleting={isDeleting}
				/>
			)}
		</>
	)
}
