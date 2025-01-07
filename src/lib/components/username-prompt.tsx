'use client'

import { useSession } from '@rubriclab/auth'
import { useEffect, useState } from 'react'
import { updateUsername } from '~/actions/user'

type SessionUser = {
	id: string
	username?: string | null
}

export function UsernamePrompt() {
	const { user } = useSession()
	const [showPrompt, setShowPrompt] = useState(false)
	const sessionUser = user as SessionUser | null

	useEffect(() => {
		if (sessionUser?.username?.includes('-')) {
			setShowPrompt(true)
		}
	}, [sessionUser?.username])

	if (!showPrompt) return null

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
				<h2 className="mb-4 font-semibold text-xl">Set Your Username</h2>
				<p className="mb-4 text-gray-600">
					Choose a username to make it easier for others to mention you in comments.
				</p>
				<form action={updateUsername}>
					<input type="hidden" name="userId" value={sessionUser?.id} />
					<div className="mb-4">
						<label htmlFor="username" className="mb-1 block font-medium text-gray-700 text-sm">
							Username
						</label>
						<input
							type="text"
							name="username"
							id="username"
							defaultValue={sessionUser?.username?.split('-')[0]}
							className="input w-full"
							maxLength={20}
							placeholder="Choose a username"
						/>
						<p className="mt-1 text-gray-500 text-sm">Only letters and numbers, up to 20 characters</p>
					</div>
					<div className="flex justify-end gap-3">
						<button type="button" className="button-cancel" onClick={() => setShowPrompt(false)}>
							Skip for now
						</button>
						<button type="submit" className="button-primary">
							Save Username
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}
