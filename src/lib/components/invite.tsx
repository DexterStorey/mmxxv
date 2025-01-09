import { Suspense } from 'react'
import { getSession } from '~/actions/auth'
import { db } from '~/db'
import InviteClient from './invite.client'

export default async function Invite() {
	const session = await getSession({ redirectUnauthorizedUsers: false })

	if (!session) return <></>

	const { username, _count } = await db.user.findUniqueOrThrow({
		where: {
			id: session.user.id
		},
		select: {
			username: true,
			_count: {
				select: {
					invitees: true
				}
			}
		}
	})

	if (!username) return <></>

	return (
		<Suspense fallback={<>...</>}>
			<InviteClient id={username} invitees={_count.invitees} />
		</Suspense>
	)
}
