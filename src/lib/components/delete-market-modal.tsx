'use client'

export function DeleteMarketModal({
	isOpen,
	onClose,
	onDelete,
	isDeleting
}: {
	isOpen: boolean
	onClose: () => void
	onDelete: () => void
	isDeleting: boolean
}) {
	if (!isOpen) return null

	return (
		<div className="modal-overlay">
			<div className="modal">
				<div className="modal-header">
					<h2 className="modal-title">Delete Market</h2>
					<button type="button" className="modal-close" onClick={onClose}>
						×
					</button>
				</div>
				<p className="description">
					Are you sure you want to delete this market? This action cannot be undone.
				</p>
				<div className="modal-footer">
					<button type="button" className="button" onClick={onClose}>
						Cancel
					</button>
					<button
						type="button"
						className="button button-danger"
						onClick={onDelete}
						disabled={isDeleting}
					>
						{isDeleting ? 'Deleting...' : 'Delete Market'}
					</button>
				</div>
			</div>
		</div>
	)
}
