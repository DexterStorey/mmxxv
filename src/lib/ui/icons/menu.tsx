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
			<title>Menu</title>
			<line x1="3" y1="6" x2="21" y2="6" />
			<line x1="3" y1="12" x2="21" y2="12" />
			<line x1="3" y1="18" x2="21" y2="18" />
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
			<title>Menu</title>
			<line x1="3" y1="6" x2="21" y2="6" />
			<line x1="3" y1="12" x2="21" y2="12" />
			<line x1="3" y1="18" x2="21" y2="18" />
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
			<title>Menu</title>
			<line x1="3" y1="6" x2="21" y2="6" />
			<line x1="3" y1="12" x2="21" y2="12" />
			<line x1="3" y1="18" x2="21" y2="18" />
		</svg>
	)
} satisfies Asset
