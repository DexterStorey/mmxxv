import type { Asset, HexColor } from '@rubriclab/ui/src/types/DesignSystem'

export default {
	light: () => (
		<svg
			width="160"
			height="40"
			viewBox="0 0 160 40"
			style={{ color: '#374151' }}
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>MMXXV Wordmark (light)</title>
			<text
				x="50%"
				y="50%"
				fill="currentColor"
				fontSize="24"
				fontFamily="sans-serif"
				fontWeight="bold"
				dominantBaseline="middle"
				textAnchor="middle"
			>
				MMXXV
			</text>
		</svg>
	),
	dark: () => (
		<svg
			width="160"
			height="40"
			viewBox="0 0 160 40"
			style={{ color: '#e5e7eb' }}
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>MMXXV Wordmark (dark)</title>
			<text
				x="50%"
				y="50%"
				fill="currentColor"
				fontSize="24"
				fontFamily="sans-serif"
				fontWeight="bold"
				dominantBaseline="middle"
				textAnchor="middle"
			>
				MMXXV
			</text>
		</svg>
	),
	mono: (fill: HexColor) => (
		<svg
			width="160"
			height="40"
			viewBox="0 0 160 40"
			style={{ color: fill }}
			xmlns="http://www.w3.org/2000/svg"
		>
			<title>MMXXV Wordmark (mono)</title>
			<text
				x="50%"
				y="50%"
				fill="currentColor"
				fontSize="24"
				fontFamily="sans-serif"
				fontWeight="bold"
				dominantBaseline="middle"
				textAnchor="middle"
			>
				MMXXV
			</text>
		</svg>
	)
} satisfies Asset
