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
			<title>Trash</title>
			<polyline points="3 6 5 6 21 6" />
			<path d="M19 6L5 6l1 14a2 2 0 002 2h8a2 2 0 002-2l1-14z" />
			<path d="M10 11v6M14 11v6M7 6V4a2 2 0 012-2h6a2 2 0 012 2v2" />
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
			<title>Trash</title>
			<polyline points="3 6 5 6 21 6" />
			<path d="M19 6L5 6l1 14a2 2 0 002 2h8a2 2 0 002-2l1-14z" />
			<path d="M10 11v6M14 11v6M7 6V4a2 2 0 012-2h6a2 2 0 012 2v2" />
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
			<title>Trash</title>
			<polyline points="3 6 5 6 21 6" />
			<path d="M19 6L5 6l1 14a2 2 0 002 2h8a2 2 0 002-2l1-14z" />
			<path d="M10 11v6M14 11v6M7 6V4a2 2 0 012-2h6a2 2 0 012 2v2" />
		</svg>
	)
} satisfies Asset
