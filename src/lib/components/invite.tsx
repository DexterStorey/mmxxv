'use client'


export default function Invite() {
	return <button onClick={() => {
		navigator.clipboard.writeText(window.location.href)
	}}>Copy invite link</button>
}
