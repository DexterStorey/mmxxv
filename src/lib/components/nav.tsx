'use client'

import { useSession } from '@rubriclab/auth'
import Link from 'next/link'
import { useEffect, useState } from 'react'

// Temporarily set to yesterday for testing
const PROBABILITIES_START_DATE = new Date('2024-01-08T05:00:00.000Z')

export default function Nav({ unauthenticated }: { unauthenticated?: boolean }) {
	const [isProbabilitiesEnabled, setIsProbabilitiesEnabled] = useState(false)

	// Check every minute if we've passed the start date
	useEffect(() => {
		const checkDate = () => {
			setIsProbabilitiesEnabled(new Date() >= PROBABILITIES_START_DATE)
		}

		// Check immediately
		checkDate()

		// Then check every minute
		const interval = setInterval(checkDate, 60000)

		return () => clearInterval(interval)
	}, [])

	if (unauthenticated) {
		return (
			<nav className="nav">
				<div className="nav-list">
					<div className="nav-list-main">
						<Link href="/about" className="nav-link">
							About
						</Link>
					</div>
					<div className="nav-list-desktop-account">
						<Link href="/auth/signin" className="nav-link">
							Sign In
						</Link>
					</div>
				</div>
			</nav>
		)
	}

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
					{isProbabilitiesEnabled && (
						<Link href="/probabilities" className="nav-link" onClick={closeMenu}>
							Probabilities
						</Link>
					)}
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
