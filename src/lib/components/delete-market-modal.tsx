'use client'

import { Button, Heading, Modal, Text } from '@rubriclab/ui'

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
	return (
		<Modal isOpen={isOpen} onClose={onClose}>
			<Heading ROLE="section">Delete Market</Heading>
			<Text content="Are you sure you want to delete this market? This action cannot be undone." />
			<Button ROLE="destructive" onClick={onClose} disabled={isDeleting}>
				Cancel
			</Button>
			<Button ROLE="success" onClick={onDelete} disabled={isDeleting}>
				{isDeleting ? 'Deleting...' : 'Delete Market'}
			</Button>
		</Modal>
	)
}
