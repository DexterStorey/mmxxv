'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Nav() {
	const pathname = usePathname()
	const isAboutPage = pathname === '/about'

	if (isAboutPage) {
		return (
			<nav className="nav">
				<Link href="/" className="nav-brand">
					MMXXV
				</Link>
			</nav>
		)
	}

	return (
		<nav className="nav">
			<Link href="/" className="nav-brand">
				MMXXV
			</Link>
		</nav>
	)
} 