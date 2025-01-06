'use client'

import { useSession } from "@rubriclab/auth"

export default function Nav() {
    const { user } = useSession()

    return (<>
    <h1><a href="/">MMXXV</a></h1>
    <div style={{display: "flex", flexDirection: "row", gap: "10px"}}>
        <a href="/markets">Markets</a>
        <a href="/leaderboard">Leaderboard</a>
        <a href="/about">About</a>
        {user ? <a href="/account">Account</a> : <a href="/auth/signin">Sign In</a>}
    </div>
    </>)
}