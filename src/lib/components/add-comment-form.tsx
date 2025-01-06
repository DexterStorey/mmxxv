'use client'

import { useSession } from '@rubriclab/auth'
import { useState } from 'react'
import { addComment } from '~/actions/market'

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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!content.trim() || !user) return

		try {
			await addComment(marketId, content.trim(), parentId)
			setContent('')
			onCommentAdded()
		} catch (error) {
			console.error('Error adding comment:', error)
		}
	}

	if (!user) return null

	return (
		<form onSubmit={handleSubmit} className="form">
			<textarea
				value={content}
				onChange={e => setContent(e.target.value)}
				placeholder={parentId ? 'Write a reply...' : 'Add your comment...'}
				className="textarea"
				rows={3}
			/>
			<button type="submit" className="button" disabled={!content.trim()}>
				{parentId ? 'Reply' : 'Add Comment'}
			</button>
		</form>
	)
}
