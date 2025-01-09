'use client'

import { formatDistanceToNow } from 'date-fns'
import { useState } from 'react'

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

function DiffLine({
	type,
	content,
	lineNumber
}: {
	type: '-' | '+'
	content: string
	lineNumber: number
}) {
	const lineClass = type === '-' ? 'diff-delete' : 'diff-add'

	return (
		<div className={`diff-line ${lineClass}`}>
			<div className="diff-line-number">{lineNumber}</div>
			<div className="diff-line-sign">{type}</div>
			<div className="diff-line-content">
				<pre>{content}</pre>
			</div>
		</div>
	)
}

function DiffSection({
	label,
	oldValue,
	newValue,
	isExpanded,
	onToggle
}: {
	label: string
	oldValue: string
	newValue: string
	isExpanded: boolean
	onToggle: () => void
}) {
	if (oldValue === newValue) return null

	const oldLines = oldValue.split('\n')
	const newLines = newValue.split('\n')

	return (
		<div className="diff-section">
			<button type="button" onClick={onToggle} className="diff-header">
				<div className="diff-header-left">
					<span className="diff-expander">{isExpanded ? '▼' : '▶'}</span>
					<span className="diff-title">{label}</span>
					<span className="diff-stats">
						{oldLines.length} line{oldLines.length !== 1 ? 's' : ''} changed
					</span>
				</div>
				<div className="diff-header-right">
					<span className="diff-delete-count">-{oldLines.length}</span>
					<span className="diff-separator">/</span>
					<span className="diff-add-count">+{newLines.length}</span>
				</div>
			</button>
			{isExpanded && (
				<div className="diff-content">
					{oldLines.map((line, i) => (
						<DiffLine key={`old-${i}`} type="-" content={line} lineNumber={i + 1} />
					))}
					{newLines.map((line, i) => (
						<DiffLine key={`new-${i}`} type="+" content={line} lineNumber={i + 1} />
					))}
				</div>
			)}
		</div>
	)
}

export function MarketEditHistory({ edits }: MarketEditHistoryProps) {
	const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({})
	if (edits.length === 0) return null

	const toggleSection = (editId: string, section: string) => {
		setExpandedSections(prev => ({
			...prev,
			[`${editId}-${section}`]: !prev[`${editId}-${section}`]
		}))
	}

	return (
		<div className="section">
			<div className="edit-history-header">
				<div className="edit-history-title">
					<h2>Edit History</h2>
					<span className="edit-count">{edits.length}</span>
				</div>
			</div>
			<div className="edit-history-content">
				{edits.map(edit => (
					<div key={edit.id} className="edit-entry">
						<div className="edit-meta">
							Edited by {edit.editor.username || edit.editor.email} {formatDistanceToNow(edit.createdAt)}{' '}
							ago
						</div>
						<div className="edit-diffs">
							<DiffSection
								label="Title"
								oldValue={edit.previousTitle}
								newValue={edit.newTitle}
								isExpanded={!!expandedSections[`${edit.id}-title`]}
								onToggle={() => toggleSection(edit.id, 'title')}
							/>
							<DiffSection
								label="Description"
								oldValue={edit.previousDescription}
								newValue={edit.newDescription}
								isExpanded={!!expandedSections[`${edit.id}-description`]}
								onToggle={() => toggleSection(edit.id, 'description')}
							/>
							<DiffSection
								label="Resolution Criteria"
								oldValue={edit.previousResolutionCriteria}
								newValue={edit.newResolutionCriteria}
								isExpanded={!!expandedSections[`${edit.id}-resolution`]}
								onToggle={() => toggleSection(edit.id, 'resolution')}
							/>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
