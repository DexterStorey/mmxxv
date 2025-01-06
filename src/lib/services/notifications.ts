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
			where: { id: market.authorId }
		})

		if (marketAuthor) {
			await sendEmailNotification({
				type: 'comment',
				marketTitle: market.title,
				marketUrl: `${env.URL}/markets/${market.id}`,
				commentId: comment.id,
				commentContent: comment.content,
				authorEmail: author.email,
				recipientEmail: marketAuthor.email
			})
		}
	}

	// If this is a reply, notify the parent comment author
	if (comment.parentId) {
		const parentComment = await db.comment.findUnique({
			where: { id: comment.parentId },
			include: { author: true }
		})

		if (parentComment && parentComment.authorId !== author.id) {
			await sendEmailNotification({
				type: 'reply',
				marketTitle: market.title,
				marketUrl: `${env.URL}/markets/${market.id}`,
				commentId: comment.id,
				commentContent: comment.content,
				authorEmail: author.email,
				recipientEmail: parentComment.author.email
			})
		}
	}

	// Extract and notify mentioned users
	const mentionedEmails = extractMentions(comment.content)
	if (mentionedEmails.length > 0) {
		const mentionedUsers = await db.user.findMany({
			where: {
				email: {
					in: mentionedEmails
				}
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
					recipientEmail: mentionedUser.email
				})
			}
		}
	}
}

function extractMentions(content: string): string[] {
	const mentionRegex = /@([^\s]+)/g
	const matches = content.match(mentionRegex)
	return matches ? matches.map(match => match.slice(1)) : []
}

async function sendEmailNotification({
	type,
	marketTitle,
	marketUrl,
	commentId,
	commentContent,
	authorEmail,
	recipientEmail
}: {
	type: 'comment' | 'reply' | 'mention'
	marketTitle: string
	marketUrl: string
	commentId: string
	commentContent: string
	authorEmail: string
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
			authorEmail
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
