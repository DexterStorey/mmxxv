'use client'

import Link from "next/link"

export default function Nav() {
    return (
        <nav className="nav">
            <div className="nav-list">
                <Link href="/" className="nav-link">MMXXV</Link>
                <Link href="/markets" className="nav-link">Markets</Link>
                <Link href="/leaderboard" className="nav-link">Leaderboard</Link>
                <Link href="/about" className="nav-link">About</Link>
            </div>
        </nav>
    )
}