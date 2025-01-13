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
			<title>Arrow Left</title>
			<path d="M19 12H5M12 5l-7 7 7 7" />
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
			<title>Arrow Left</title>
			<path d="M19 12H5M12 5l-7 7 7 7" />
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
			<title>Arrow Left</title>
			<path d="M19 12H5M12 5l-7 7 7 7" />
		</svg>
	)
} satisfies Asset
