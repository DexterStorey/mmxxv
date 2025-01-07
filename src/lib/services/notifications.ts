'use server'

import type { Comment, Market, User } from '@prisma/client'
import { db } from '~/db'
import { resend } from '~/email'
import { env } from '~/env'
import { NotificationEmail } from '../components/notification-email'

export async function handleNewComment(comment: Comment, market: Market, author: User) {
	// Notify market author if they're not the commenter
	if (market.authorId !== author.id) {
		const marketAuthor = await db.user.findUnique({
			where: { id: market.authorId },
			select: {
				email: true,
				username: true
			}
		})

		if (marketAuthor) {
			await sendEmailNotification({
				type: 'comment',
				marketTitle: market.title,
				marketUrl: `${env.URL}/markets/${market.id}`,
				commentId: comment.id,
				commentContent: comment.content,
				authorEmail: author.email,
				authorUsername: author.username,
				recipientEmail: marketAuthor.email
			})
		}
	}

	// If this is a reply, notify the parent comment author
	if (comment.parentId) {
		const parentComment = await db.comment.findUnique({
			where: { id: comment.parentId },
			include: {
				author: {
					select: {
						id: true,
						email: true,
						username: true
					}
				}
			}
		})

		if (parentComment && parentComment.authorId !== author.id) {
			await sendEmailNotification({
				type: 'reply',
				marketTitle: market.title,
				marketUrl: `${env.URL}/markets/${market.id}`,
				commentId: comment.id,
				commentContent: comment.content,
				authorEmail: author.email,
				authorUsername: author.username,
				recipientEmail: parentComment.author.email
			})
		}
	}

	// Extract and notify mentioned users
	const mentionedUsernames = extractMentions(comment.content)
	if (mentionedUsernames.length > 0) {
		const mentionedUsers = await db.user.findMany({
			where: {
				username: {
					in: mentionedUsernames
				}
			},
			select: {
				id: true,
				email: true,
				username: true
			}
		})

		for (const mentionedUser of mentionedUsers) {
			if (mentionedUser.id !== author.id) {
				await sendEmailNotification({
					type: 'mention',
					marketTitle: market.title,
					marketUrl: `${env.URL}/markets/${market.id}`,
					commentId: comment.id,
					commentContent: comment.content,
					authorEmail: author.email,
					authorUsername: author.username,
					recipientEmail: mentionedUser.email
				})
			}
		}
	}
}

function extractMentions(content: string): string[] {
	const mentionRegex = /@\[([^:]+):([^\]]+)\]/g
	const matches = content.match(mentionRegex)
	return matches
		? matches
				.map(match => {
					const [, userId] = match.match(/@\[([^:]+):([^\]]+)\]/) || []
					return userId || ''
				})
				.filter(id => id !== '')
		: []
}

async function sendEmailNotification({
	type,
	marketTitle,
	marketUrl,
	commentId,
	commentContent,
	authorEmail,
	authorUsername,
	recipientEmail
}: {
	type: 'comment' | 'reply' | 'mention'
	marketTitle: string
	marketUrl: string
	commentId: string
	commentContent: string
	authorEmail: string
	authorUsername: string | null
	recipientEmail: string
}) {
	await resend.emails.send({
		from: 'MMXXV <notifications@mmxxv.bet>',
		to: [recipientEmail],
		subject: getEmailSubject(type, marketTitle),
		react: NotificationEmail({
			type,
			marketTitle,
			marketUrl,
			commentId,
			commentContent,
			authorEmail,
			authorUsername
		})
	})
}

function getEmailSubject(type: 'comment' | 'reply' | 'mention', marketTitle: string): string {
	switch (type) {
		case 'comment':
			return `New Comment on "${marketTitle}"`
		case 'reply':
			return `New Reply to Your Comment on "${marketTitle}"`
		case 'mention':
			return `You Were Mentioned in a Comment on "${marketTitle}"`
	}
}
