import Link from 'next/link'

type UserPillProps = {
	id: string
	email: string
	username: string | null
	showEmail?: boolean
	className?: string
}

export default function UserPill({
	id,
	email,
	username,
	showEmail = false,
	className = ''
}: UserPillProps) {
	const displayName = username || email
	const shouldShowEmail = showEmail && username && email !== username

	return (
		<span className={`user-pill ${className}`}>
			<Link href={`/users/${id}`} className="user-pill-link">
				{displayName}
			</Link>
			{shouldShowEmail && <span className="user-pill-email">({email})</span>}
		</span>
	)
}
