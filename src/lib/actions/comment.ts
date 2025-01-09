'use server'

import type { CommentReactionType } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { db } from '~/db'
import { getSession } from './auth'

export async function addCommentReaction({
	commentId,
	type
}: {
	commentId: string
	type: CommentReactionType
}) {
	const { user } = await getSession()

	if (!user) throw new Error('User not found')

	const {
		comment: { marketId }
	} = await db.commentReaction.create({
		data: {
			commentId,
			type,
			authorId: user.id
		},
		select: {
			comment: {
				select: {
					marketId: true
				}
			}
		}
	})

	revalidatePath(`/markets/${marketId}`)
}

export async function removeCommentReaction({
	commentId,
	type
}: {
	commentId: string
	type: CommentReactionType
}) {
	const { user } = await getSession()

	if (!user) throw new Error('User not found')

	const {
		comment: { marketId }
	} = await db.commentReaction.delete({
		where: {
			commentId_type_authorId: {
				commentId,
				type,
				authorId: user.id
			}
		},
		select: {
			comment: {
				select: {
					marketId: true
				}
			}
		}
	})

	revalidatePath(`/markets/${marketId}`)
}
