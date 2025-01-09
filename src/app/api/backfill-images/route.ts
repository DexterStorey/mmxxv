import { db } from '~/db'
import { generateMarketImage } from '~/utils/image-generation'

export async function GET() {
	try {
		const marketsWithoutImages = await db.market.findMany({
			where: {
				imageUrl: null
			},
			select: {
				id: true,
				title: true,
				description: true
			}
		})

		const results = await Promise.allSettled(
			marketsWithoutImages.map(async market => {
				const imageUrl = await generateMarketImage(market.title, market.description)
				if (imageUrl) {
					await db.market.update({
						where: { id: market.id },
						data: { imageUrl }
					})
					return { id: market.id, success: true }
				}
				return { id: market.id, success: false }
			})
		)

		const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length
		const failed = results.filter(
			r => r.status === 'rejected' || (r.status === 'fulfilled' && !r.value.success)
		).length

		return Response.json({
			total: marketsWithoutImages.length,
			successful,
			failed
		})
	} catch (error) {
		console.error('Error backfilling images:', error)
		return new Response('Internal Server Error', { status: 500 })
	}
}
