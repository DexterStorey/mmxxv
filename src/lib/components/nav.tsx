'use client'

import { useSession } from '@rubriclab/auth'
import Link from 'next/link'

export default function Nav() {
	const { user } = useSession()

	return (
		<nav className="nav">
			<div className="nav-list">
				<div className="nav-list-main">
					<Link href="/" className="nav-link">
						Home
					</Link>
					<Link href="/markets" className="nav-link">
						Markets
					</Link>
					<Link href="/leaderboard" className="nav-link">
						Leaderboard
					</Link>
					<Link href="/about" className="nav-link">
						About
					</Link>
				</div>
				<div className="nav-list-account">
					{user && (
						<Link href={`/users/${user.id}`} className="nav-link">
							Account
						</Link>
					)}
				</div>
			</div>
		</nav>
	)
}
