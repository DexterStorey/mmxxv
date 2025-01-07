import type { NextConfig } from 'next'

export default {
	transpilePackages: ['@rubriclab/auth', '@rubriclab/ui'],
	reactStrictMode: true,
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'fal.media'
			}
		]
	}
} satisfies NextConfig
