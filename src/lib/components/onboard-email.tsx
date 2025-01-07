const styles = {
	container: {
		fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
		padding: '20px',
		maxWidth: '600px',
		margin: '0 auto',
		color: '#111',
		backgroundColor: '#fafafa'
	},
	card: {
		backgroundColor: '#fff',
		borderRadius: '8px',
		padding: '24px',
		border: '1px solid #e0e0e0'
	},
	title: {
		fontSize: '24px',
		fontWeight: '600',
		marginBottom: '16px',
		color: '#111'
	},
	text: {
		fontSize: '16px',
		lineHeight: '24px',
		color: '#333',
		marginBottom: '24px'
	},
	button: {
		backgroundColor: '#111',
		color: '#fff !important',
		padding: '12px 24px',
		borderRadius: '6px',
		textDecoration: 'none',
		display: 'inline-block',
		fontSize: '16px',
		fontWeight: '500',
		textAlign: 'center' as const,
		border: '1px solid #111',
		margin: '16px 0'
	},
	fallbackLink: {
		display: 'block',
		marginTop: '16px',
		color: '#111',
		textDecoration: 'underline'
	},
	meta: {
		fontSize: '14px',
		color: '#666',
		marginTop: '24px',
		padding: '16px 0',
		borderTop: '1px solid #e0e0e0'
	}
}

export function MagicLinkEmailTemplate({
	magicLink,
	username
}: { magicLink: string; username: string }) {
	return (
		<div style={styles.container}>
			<div style={styles.card}>
				<h1 style={styles.title}>Welcome to MMXXV</h1>
				<p style={styles.text}>Click the button below to sign in and start predicting the future.</p>

				<p style={styles.text}>
					Your username has been set to <strong>{username}</strong>. You can change this in your account
					settings after signing in.
				</p>

				<table role="presentation" style={{ borderCollapse: 'collapse', width: 'auto' }}>
					<tr>
						<td style={{ backgroundColor: '#111', borderRadius: '6px' }}>
							<a href={magicLink} style={styles.button}>
								Sign In to MMXXV
							</a>
						</td>
					</tr>
				</table>

				<a href={magicLink} style={styles.fallbackLink}>
					Or click here to sign in to MMXXV
				</a>

				<div style={styles.meta}>If you didn't request this email, you can safely ignore it.</div>
			</div>
		</div>
	)
}
