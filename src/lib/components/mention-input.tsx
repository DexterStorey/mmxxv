'use client'

import { useEffect, useRef, useState } from 'react'
import { searchUsers } from '~/actions/user'

type User = {
	id: string
	email: string
}

type MentionInputProps = {
	value: string
	onChange: (value: string) => void
	placeholder?: string
	rows?: number
}

export function MentionInput({ value, onChange, placeholder, rows = 3 }: MentionInputProps) {
	const [mentionUsers, setMentionUsers] = useState<User[]>([])
	const [showDropdown, setShowDropdown] = useState(false)
	const [cursorPosition, setCursorPosition] = useState<number | null>(null)
	const textareaRef = useRef<HTMLTextAreaElement>(null)
	const dropdownRef = useRef<HTMLDivElement>(null)

	// Handle @ symbol typing
	const handleInput = async (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const newValue = e.target.value
		const cursorPos = e.target.selectionStart
		onChange(newValue)
		setCursorPosition(cursorPos)

		// Find the @ symbol before the cursor
		const beforeCursor = newValue.slice(0, cursorPos)
		const atIndex = beforeCursor.lastIndexOf('@')

		if (atIndex >= 0 && !beforeCursor.slice(atIndex).includes(' ')) {
			const searchTerm = beforeCursor.slice(atIndex + 1)
			const users = await searchUsers(searchTerm)
			setMentionUsers(users)
			setShowDropdown(true)
		} else {
			setShowDropdown(false)
		}
	}

	const handleSelectUser = (selectedUser: User) => {
		if (!cursorPosition) return

		const beforeMention = value.slice(0, value.lastIndexOf('@', cursorPosition))
		const afterMention = value.slice(cursorPosition)
		const newValue = `${beforeMention}@${selectedUser.email} ${afterMention}`

		onChange(newValue)
		setShowDropdown(false)

		if (textareaRef.current) {
			textareaRef.current.focus()
			const newCursorPos = beforeMention.length + selectedUser.email.length + 2 // +2 for @ and space
			textareaRef.current.setSelectionRange(newCursorPos, newCursorPos)
		}
	}

	const handleKeyDown = (e: React.KeyboardEvent) => {
		if (!showDropdown) return

		if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
			e.preventDefault() // Prevent cursor movement
			const items = dropdownRef.current?.querySelectorAll('.mention-item')
			if (!items?.length) return

			const currentFocus = document.activeElement
			const currentIndex = Array.from(items).indexOf(currentFocus as Element)

			if (e.key === 'ArrowDown') {
				const nextIndex = currentIndex < items.length - 1 ? currentIndex + 1 : 0
				;(items[nextIndex] as HTMLElement).focus()
			} else {
				const prevIndex = currentIndex > 0 ? currentIndex - 1 : items.length - 1
				;(items[prevIndex] as HTMLElement).focus()
			}
		} else if (e.key === 'Enter' && document.activeElement?.classList.contains('mention-item')) {
			e.preventDefault()
			const selectedUser =
				mentionUsers[
					Array.from(dropdownRef.current?.querySelectorAll('.mention-item') || []).indexOf(
						document.activeElement
					)
				]
			if (selectedUser) {
				handleSelectUser(selectedUser)
			}
		} else if (e.key === 'Escape') {
			setShowDropdown(false)
		}
	}

	// Close dropdown when clicking outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setShowDropdown(false)
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => document.removeEventListener('mousedown', handleClickOutside)
	}, [])

	return (
		<div className="mention-input-container relative">
			<textarea
				ref={textareaRef}
				value={value}
				onChange={handleInput}
				onKeyDown={handleKeyDown}
				placeholder={placeholder}
				className="textarea w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
				rows={rows}
			/>

			{showDropdown && (
				<div
					ref={dropdownRef}
					className="mention-dropdown absolute right-0 left-0 mt-1 max-h-48 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg"
				>
					{mentionUsers.map(user => (
						<button
							key={user.id}
							type="button"
							className="mention-item flex w-full items-center px-4 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none"
							onClick={() => handleSelectUser(user)}
						>
							<span className="mention-pill mr-2 rounded-full bg-blue-100 px-2 py-0.5 text-blue-700 text-sm">
								@
							</span>
							{user.email}
						</button>
					))}
				</div>
			)}

			<style jsx>{`
				.textarea {
					font-family: inherit;
					line-height: 1.5;
				}

				.mention-pill {
					display: inline-flex;
					align-items: center;
					background-color: #e5edff;
					color: #3b82f6;
					border-radius: 9999px;
					padding: 0.125rem 0.5rem;
					margin: 0 0.125rem;
					font-size: 0.875rem;
					font-weight: 500;
				}
			`}</style>
		</div>
	)
}
