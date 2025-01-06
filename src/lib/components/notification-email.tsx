type NotificationEmailProps = {
	type: 'comment' | 'reply' | 'mention'
	marketTitle: string
	marketUrl: string
	commentId: string
	commentContent?: string
	authorEmail?: string
}

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
		fontSize: '20px',
		fontWeight: '600',
		marginBottom: '16px',
		color: '#111'
	},
	text: {
		fontSize: '16px',
		lineHeight: '24px',
		color: '#333',
		marginBottom: '20px'
	},
	button: {
		backgroundColor: '#111',
		color: '#fff',
		padding: '12px 24px',
		borderRadius: '6px',
		textDecoration: 'none',
		display: 'inline-block',
		fontSize: '16px',
		fontWeight: '500'
	},
	meta: {
		fontSize: '14px',
		color: '#666',
		marginTop: '24px',
		padding: '16px 0',
		borderTop: '1px solid #e0e0e0'
	},
	quote: {
		borderLeft: '4px solid #e0e0e0',
		paddingLeft: '16px',
		margin: '16px 0',
		color: '#666',
		fontStyle: 'italic'
	}
}

export function NotificationEmail({
	type,
	marketTitle,
	marketUrl,
	commentId,
	commentContent,
	authorEmail
}: NotificationEmailProps) {
	const getTitle = () => {
		switch (type) {
			case 'comment':
				return 'New Comment on Your Market'
			case 'reply':
				return 'New Reply to Your Comment'
			case 'mention':
				return 'You Were Mentioned in a Comment'
		}
	}

	const getMessage = () => {
		switch (type) {
			case 'comment':
				return `${authorEmail} commented on your market "${marketTitle}"`
			case 'reply':
				return `${authorEmail} replied to your comment on "${marketTitle}"`
			case 'mention':
				return `${authorEmail} mentioned you in a comment on "${marketTitle}"`
		}
	}

	const url = new URL(marketUrl)
	url.searchParams.set('commentId', commentId)

	return (
		<div style={styles.container}>
			<div style={styles.card}>
				<h1 style={styles.title}>{getTitle()}</h1>
				<p style={styles.text}>{getMessage()}</p>

				{commentContent && <div style={styles.quote}>"{commentContent}"</div>}

				<a href={url.toString()} style={styles.button}>
					View on MMXXV
				</a>

				<div style={styles.meta}>
					You're receiving this email because you're participating in MMXXV.
				</div>
			</div>
		</div>
	)
}
