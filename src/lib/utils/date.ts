export function formatDate(date: Date): string {
	const now = new Date()
	const diff = now.getTime() - date.getTime()
	const seconds = Math.floor(diff / 1000)
	const minutes = Math.floor(seconds / 60)
	const hours = Math.floor(minutes / 60)
	const days = Math.floor(hours / 24)

	if (days > 0) {
		return `${days}d ago`
	}
	if (hours > 0) {
		return `${hours}h ago`
	}
	if (minutes > 0) {
		return `${minutes}m ago`
	}
	return 'just now'
}

export function isNew(date: Date): boolean {
	const now = new Date()
	const diff = now.getTime() - date.getTime()
	const hours = Math.floor(diff / (1000 * 60 * 60))
	return hours < 24 // Consider items newer than 24 hours as "new"
}
