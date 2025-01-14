import type { Asset, HexColor } from '@rubriclab/ui/src/types/DesignSystem'

export default {
	light: () => (
		<svg
			width="24"
			height="24"
			fill="none"
			stroke="#374151"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			viewBox="0 0 24 24"
		>
			<title>Search</title>
			<circle cx="11" cy="11" r="8" />
			<path d="M21 21l-4.35-4.35" />
		</svg>
	),
	dark: () => (
		<svg
			width="24"
			height="24"
			fill="none"
			stroke="#e5e7eb"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			viewBox="0 0 24 24"
		>
			<title>Search</title>
			<circle cx="11" cy="11" r="8" />
			<path d="M21 21l-4.35-4.35" />
		</svg>
	),
	mono: (fill: HexColor) => (
		<svg
			width="24"
			height="24"
			fill="none"
			stroke={fill}
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
			viewBox="0 0 24 24"
		>
			<title>Search</title>
			<circle cx="11" cy="11" r="8" />
			<path d="M21 21l-4.35-4.35" />
		</svg>
	)
} satisfies Asset
