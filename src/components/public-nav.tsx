import Link from 'next/link'

export default function PublicNav() {
	return (
		<nav className="sticky top-0 z-50 flex h-16 w-full items-center justify-between border-b border-neutral-800 bg-black/50 px-4 backdrop-blur-xl">
			<div className="flex items-center gap-8">
				<Link href="/" className="text-xl font-bold tracking-tighter text-white">
					MMXXV
				</Link>
			</div>
			<div className="flex items-center gap-4">
				<Link
					href="/auth/signin"
					className="rounded-lg border border-neutral-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-900">
					Sign In
				</Link>
			</div>
		</nav>
	)
} 