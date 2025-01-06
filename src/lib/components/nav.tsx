'use client'

import { useSession } from '@rubriclab/auth'
import Link from 'next/link'
import { useState } from 'react'

export default function Nav() {
	const { user } = useSession()
	const [isMenuOpen, setIsMenuOpen] = useState(false)

	const toggleMenu = () => {
		setIsMenuOpen(!isMenuOpen)
	}

	const closeMenu = () => {
		setIsMenuOpen(false)
	}

	return (
		<nav className="nav">
			<div className="nav-list">
				<button
					type="button"
					className="hamburger-menu"
					onClick={toggleMenu}
					aria-label="Toggle navigation menu"
				>
					{isMenuOpen ? '×' : '☰'}
				</button>
				<div className={`nav-list-main ${isMenuOpen ? 'open' : ''}`}>
					<Link href="/" className="nav-link" onClick={closeMenu}>
						Home
					</Link>
					<Link href="/markets" className="nav-link" onClick={closeMenu}>
						Markets
					</Link>
					<Link href="/leaderboard" className="nav-link" onClick={closeMenu}>
						Leaderboard
					</Link>
					<Link href="/about" className="nav-link" onClick={closeMenu}>
						About
					</Link>
					{user && (
						<Link href={`/users/${user.id}`} className="nav-link nav-link-account" onClick={closeMenu}>
							Profile
						</Link>
					)}
				</div>
				<div className="nav-list-desktop-account">
					{user && (
						<Link href="/account" className="nav-link" onClick={closeMenu}>
							Account
						</Link>
					)}
				</div>
			</div>
		</nav>
	)
}
