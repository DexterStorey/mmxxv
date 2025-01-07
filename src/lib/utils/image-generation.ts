import { fal } from '@fal-ai/client'
import { env } from '~/env'

export async function generateMarketImage(
	title: string,
	description: string
): Promise<string | null> {
	try {
		fal.config({
			credentials: env.FAL_API_KEY
		})

		const prompt = `A beautiful image for a banner for a prediction market about: ${title}. ${description}. Style: Modern, clean, simple. Should be in a cyberpunk, lowfi, grainy japanese style. Very pantone, minimalist. Future punk, but also subtle and low-fi and grainy.`

		const result = await fal.subscribe('fal-ai/flux-pro/v1.1-ultra', {
			input: {
				prompt
			},
			logs: true
		})

		return result.data?.images?.[0]?.url || null
	} catch (error) {
		console.error('Failed to generate image:', error)
		return null
	}
}
