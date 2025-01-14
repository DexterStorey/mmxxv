'use client'

import { Card, CodeBlock, Dropdown, Heading, Pill, Section } from '@rubriclab/ui'
import { formatDistanceToNow } from 'date-fns'

interface MarketEdit {
	id: string
	createdAt: Date
	editor: {
		id: string
		username: string | null
		email: string
	}
	previousTitle: string
	previousDescription: string
	previousResolutionCriteria: string
	newTitle: string
	newDescription: string
	newResolutionCriteria: string
}

interface MarketEditHistoryProps {
	edits: MarketEdit[]
}

interface DiffViewProps {
	label: string
	oldLines: string[]
	newLines: string[]
}

export function DiffView({ label, oldLines, newLines }: DiffViewProps) {
	if (oldLines.join('\n') === newLines.join('\n')) return null

	return (
		<Dropdown ROLE="details" label={label}>
			{oldLines.length > 0 && (
				<CodeBlock ROLE="negative-diff" language="plain">
					{oldLines.join('\n')}
				</CodeBlock>
			)}
			{newLines.length > 0 && (
				<CodeBlock ROLE="positive-diff" language="plain">
					{newLines.join('\n')}
				</CodeBlock>
			)}
		</Dropdown>
	)
}

export function MarketEditHistory({ edits }: MarketEditHistoryProps) {
	if (edits.length === 0) return null

	return (
		<Section
			title={
				<>
					Edit History <Pill ROLE="count">{`${edits.length}`}</Pill>
				</>
			}
		>
			{edits.map(edit => (
				<Card ROLE="information" key={edit.id}>
					<Heading ROLE="minor">
						Edited by {edit.editor.username || edit.editor.email} {formatDistanceToNow(edit.createdAt)}{' '}
						ago
					</Heading>

					<DiffView
						label="Title"
						oldLines={edit.previousTitle.split('\n')}
						newLines={edit.newTitle.split('\n')}
					/>
					<DiffView
						label="Description"
						oldLines={edit.previousDescription.split('\n')}
						newLines={edit.newDescription.split('\n')}
					/>
					<DiffView
						label="Resolution Criteria"
						oldLines={edit.previousResolutionCriteria.split('\n')}
						newLines={edit.newResolutionCriteria.split('\n')}
					/>
				</Card>
			))}
		</Section>
	)
}
