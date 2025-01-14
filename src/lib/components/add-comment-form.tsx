'use client'

import { useSession } from '@rubriclab/auth'
import { Button, Section } from '@rubriclab/ui'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { addComment } from '~/actions/market'
import { MentionInput } from './mention-input'

export function AddCommentForm({
	marketId,
	parentId,
	onCommentAdded
}: {
	marketId: string
	parentId?: string
	onCommentAdded: () => void
}) {
	const [content, setContent] = useState('')
	const { user } = useSession()
	const router = useRouter()

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!content.trim() || !user) return

		try {
			const commentId = await addComment(marketId, content.trim(), parentId)
			setContent('')
			onCommentAdded()

			// Update URL with comment ID
			const url = new URL(window.location.href)
			url.searchParams.set('commentId', commentId)
			router.replace(url.pathname + url.search)
		} catch (error) {
			console.error('Error adding comment:', error)
		}
	}

	if (!user) return null

	return (
		<Section>
			<MentionInput
				value={content}
				onChange={setContent}
				placeholder={
					parentId
						? 'Write a reply... Use @ to mention users'
						: 'Add your comment... Use @ to mention users'
				}
				rows={3}
			/>
			<Button ROLE="information" disabled={!content.trim()} onClick={handleSubmit}>
				{parentId ? 'Reply' : 'Add Comment'}
			</Button>
		</Section>
	)
}
