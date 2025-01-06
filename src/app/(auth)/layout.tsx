import '../globals.css'

export { metadata } from '~/constants'

export default function RootLayout({
	children
}: {
	children: React.ReactNode
}) {
	return (
		<html lang="en">
			<body>{children}</body>
		</html>
	)
}
