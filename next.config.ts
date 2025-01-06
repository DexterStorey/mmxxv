import type { NextConfig } from 'next'

export default {
	transpilePackages: [
		'@rubriclab/auth',
		'@rubriclab/ui'
	],
	reactStrictMode: true
} satisfies NextConfig
