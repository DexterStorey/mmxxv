'use client'

import { useSession } from '@rubriclab/auth'
import { Nav, NavItem } from '@rubriclab/ui'
import { useEffect, useState } from 'react'

const PROBABILITIES_START_DATE = new Date('2025-01-21T05:00:00.000Z')

export default function ({ unauthenticated }: { unauthenticated?: boolean }) {
	const [isProbabilitiesEnabled, setIsProbabilitiesEnabled] = useState(false)

	// Check every minute if we've passed the start date
	useEffect(() => {
		const checkDate = () => {
			setIsProbabilitiesEnabled(new Date() >= PROBABILITIES_START_DATE)
		}

		checkDate()

		const interval = setInterval(checkDate, 60000)

		return () => clearInterval(interval)
	}, [])

	if (unauthenticated) {
		return (
			<Nav>
				<NavItem href="/about">About</NavItem>
				<NavItem href="/auth/signin">Sign In</NavItem>
			</Nav>
		)
	}

	const { user } = useSession()

	if (!user) {
		return (
			<Nav>
				<NavItem href="/about">About</NavItem>
				<NavItem href="/auth/signin">Sign In</NavItem>
			</Nav>
		)
	}

	return (
		<Nav>
			<NavItem href="/">Home</NavItem>
			<NavItem href="/about">About</NavItem>
			<NavItem href="/markets">Markets</NavItem>
			<NavItem href="/leaderboard">Leaderboard</NavItem>
			{isProbabilitiesEnabled && <NavItem href="/probabilities">Probabilities</NavItem>}
			<NavItem href="/account">Account</NavItem>
		</Nav>
	)
}
