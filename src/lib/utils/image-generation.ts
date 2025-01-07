import { fal } from '@fal-ai/client'
import { zodResponseFormat } from 'openai/helpers/zod.mjs'
import OpenAI from 'openai/index.mjs'
import { z } from 'zod'
import { env } from '~/env'

export async function generateMarketImage(
	title: string,
	description: string
): Promise<string | null> {
	try {
		fal.config({
			credentials: env.FAL_API_KEY
		})

		const openAIClient = new OpenAI({
			apiKey: env.OPENAI_API_KEY
		})

		const { choices } = await openAIClient.beta.chat.completions.parse({
			messages: [
				{
					role: 'system',
					content: `We need your help to create a detailed prompt for an image generation model. This image will be used as a banner on a 2025 prediction game website where there are markets that people guess the likelihood of something happening. It should represent the market titled "${title}" with the following description: ${description}.

Your task is to generate a prompt that the image model can use to create a visually stunning and relevant image. Please ensure the prompt includes specific visual elements and metaphors that directly relate to the prediction's theme.

The image must adhere to these aesthetic guidelines:
- Elegant minimalism with cyberpunk influences
- Soft, muted color palette with selective neon accents
- Incorporate Japanese design principles and wabi-sabi philosophy
- Delicate film grain and analog texture overlays for depth
- Blend architectural precision with organic, flowing elements
- Use ethereal lighting and gentle gradients to create depth
- Layer multiple visual elements with varying opacity

Your goal is to craft a prompt that clearly expresses these aesthetics while being relevant to the prediction's content. Design a visual story that is immediately recognizable as relating to ${title}, while including in the prompt the aesthetic guidelines. Be descriptive and creative but concise.
The model struggles with instructions of what you want it to do since it's not a language model. So your prompt should not be instructions but a description of the exact image you want - as if you were asking an artist to make exactly what you want. They're not a creative director, they're a very low level model that turns a text description into an image.
Also, without very very clean aesthetic guidelines, the model will create a very low quality image, so it's important to be extremely explicit about the style you want.
We really want something relevant with perfect aesthetics.
Also, keep your prompts very short. One paragraph max. Don't suggest to generate complex text, unless it's 100% necessary or some kind of icon.
`
				}
			],
			model: 'gpt-4o',
			response_format: zodResponseFormat(
				z.object({
					prompt: z.string().describe('The detailed visual description for the image')
				}),
				'prompt'
			)
		})

		const generatedPrompt = choices[0]?.message.parsed?.prompt

		console.log('Generated prompt:', generatedPrompt)

		if (!generatedPrompt) {
			throw new Error('Failed to generate image prompt')
		}

		const result = await fal.subscribe('fal-ai/flux-pro/v1.1-ultra', {
			input: {
				prompt: generatedPrompt,
				aspect_ratio: '21:9'
			},
			logs: true
		})

		return result.data?.images?.[0]?.url || null
	} catch (error) {
		console.error('Failed to generate image:', error)
		return null
	}
}
