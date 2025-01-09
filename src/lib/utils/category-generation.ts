import { MarketCategory } from '@prisma/client'
import { zodResponseFormat } from 'openai/helpers/zod.mjs'
import OpenAI from 'openai/index.mjs'
import { z } from 'zod'
import { env } from '~/env'

export async function generateMarketCategories(
	title: string,
	description: string
): Promise<MarketCategory[]> {
	try {
		const client = new OpenAI({
			apiKey: env.OPENAI_API_KEY
		})

		const { choices } = await client.beta.chat.completions.parse({
			messages: [
				{
					role: 'system',
					content: `Given this prediction market title: "${title}" and description: "${description}", suggest 1-3 relevant categories`
				}
			],
			model: 'gpt-4o',
			response_format: zodResponseFormat(
				z.object({
					categories: z
						.array(z.nativeEnum(MarketCategory))
						.describe('The suggested categories for the prediction market')
				}),
				'answer'
			)
		})

		return choices[0]?.message.parsed?.categories || []
	} catch (error) {
		console.error('Failed to generate categories:', error)
		return []
	}
}
