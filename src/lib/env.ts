import { createEnv } from '@t3-oss/env-nextjs'
import { z } from 'zod'

export const env = createEnv({
	server: {
		URL: z.string().min(1),
		DATABASE_URL: z.string().min(1),
		RESEND_API_KEY: z.string().min(1)
	},
	client: {},
	runtimeEnv: {
		URL: process.env.URL,
		DATABASE_URL: process.env.DATABASE_URL,
		RESEND_API_KEY: process.env.RESEND_API_KEY
	}
})
