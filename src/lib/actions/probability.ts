'use server'

import { revalidatePath } from 'next/cache'
import { getSession } from '~/actions/auth'
import { db } from '~/db'

export async function assignProbability(marketId: string, probability: number) {
  const { user } = await getSession()
  if (!user) {
    throw new Error('You must be logged in to assign probabilities')
  }

  // Validate probability is between 0 and 1
  if (probability < 0 || probability > 1) {
    throw new Error('Probability must be between 0 and 1')
  }

  // Create or update the prediction
  await db.prediction.upsert({
    where: {
      marketId_userId: {
        marketId,
        userId: user.id
      }
    },
    create: {
      marketId,
      userId: user.id,
      probability
    },
    update: {
      probability
    }
  })

  // Revalidate the markets page
  revalidatePath('/probabilities')
} 