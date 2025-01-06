'use server'

import { getSession } from "~/actions/auth"
import { db } from "~/db"

export async function createMarket(data: {
    title: string;
    description: string;
    resolutionCriteria: string;
}) {
    const { user } = await getSession()

    const market = await db.market.create({
        data: {
            ...data,
            authorId: user.id
        }
    })

    return market
}

export async function upvoteMarket(marketId: string) {
    const { user } = await getSession()

    const existingUpvote = await db.marketUpvotes.findUnique({
        where: {
            marketId_userId: {
                marketId,
                userId: user.id
            }
        }
    })

    if (existingUpvote) {
        await db.marketUpvotes.delete({
            where: {
                marketId_userId: {
                    marketId,
                    userId: user.id
                }
            }
        })
        await db.market.update({
            where: { id: marketId },
            data: { upvotes: { decrement: 1 } }
        })
    } else {
        await db.marketUpvotes.create({
            data: {
                marketId,
                userId: user.id
            }
        })
        await db.market.update({
            where: { id: marketId },
            data: { upvotes: { increment: 1 } }
        })
    }
}

export async function downvoteMarket(marketId: string) {
    const { user } = await getSession()

    const existingDownvote = await db.marketDownvotes.findUnique({
        where: {
            marketId_userId: {
                marketId,
                userId: user.id
            }
        }
    })

    if (existingDownvote) {
        await db.marketDownvotes.delete({
            where: {
                marketId_userId: {
                    marketId,
                    userId: user.id
                }
            }
        })
        await db.market.update({
            where: { id: marketId },
            data: { downvotes: { decrement: 1 } }
        })
    } else {
        await db.marketDownvotes.create({
            data: {
                marketId,
                userId: user.id
            }
        })
        await db.market.update({
            where: { id: marketId },
            data: { downvotes: { increment: 1 } }
        })
    }
}

export async function addComment(marketId: string, content: string) {
    const { user } = await getSession()

    await db.comment.create({
        data: {
            content,
            marketId,
            authorId: user.id
        }
    })
} 