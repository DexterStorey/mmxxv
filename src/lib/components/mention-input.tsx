'use client'

import { Button, Link, TextArea } from '@rubriclab/ui'
import { useEffect, useRef, useState } from 'react'
import { searchUsers } from '~/actions/user'

type User = {
	id: string
	email: string
	username: string | null
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
	const [displayValue, setDisplayValue] = useState(value)
	const textareaRef = useRef<HTMLTextAreaElement>(null)
	const dropdownRef = useRef<HTMLDivElement>(null)

	// Convert internal format to display format
	useEffect(() => {
		const displayText = value.replace(/@\[([^:]+):([^\]]+)\]/g, '@$2')
		setDisplayValue(displayText)
	}, [value])

	// Handle @ symbol typing
	const handleInput = async (value: string) => {
		setDisplayValue(value)
		const cursorPos = textareaRef.current?.selectionStart
		setCursorPosition(cursorPos || null)

		// Find the @ symbol before the cursor
		const beforeCursor = value.slice(0, cursorPos)
		const atIndex = beforeCursor.lastIndexOf('@')

		if (atIndex >= 0 && !beforeCursor.slice(atIndex).includes(' ')) {
			const searchTerm = beforeCursor.slice(atIndex + 1)
			const users = await searchUsers(searchTerm)
			setMentionUsers(users)
			setShowDropdown(true)
		} else {
			setShowDropdown(false)
		}

		// Convert display format back to internal format for storage
		const internalValue = value.replace(/@([a-zA-Z0-9]+)/g, (match, username) => {
			const user = mentionUsers.find(u => u.username === username)
			return user ? `@[${user.id}:${user.username}]` : match
		})
		onChange(internalValue)
	}

	const handleSelectUser = (selectedUser: User) => {
		if (!cursorPosition || !selectedUser.username) return

		const beforeMention = displayValue.slice(0, displayValue.lastIndexOf('@', cursorPosition))
		const afterMention = displayValue.slice(cursorPosition)
		const newDisplayValue = `${beforeMention}@${selectedUser.username} ${afterMention}`
		setDisplayValue(newDisplayValue)

		const newInternalValue = `${value.slice(0, value.lastIndexOf('@', cursorPosition))}@[${selectedUser.id}:${selectedUser.username}] ${value.slice(cursorPosition)}`
		onChange(newInternalValue)

		setShowDropdown(false)

		if (textareaRef.current) {
			textareaRef.current.focus()
			const newCursorPos = beforeMention.length + selectedUser.username.length + 2 // +2 for @ and space
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
		<>
			<TextArea
				value={displayValue}
				onChange={handleInput}
				onKeyDown={handleKeyDown}
				placeholder={placeholder || ''}
				className="textarea w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
				rows={rows}
			/>

			{/* {showDropdown && (
				<div
					ref={dropdownRef}
					className="mention-dropdown absolute right-0 left-0 mt-1 max-h-48 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg"
				>
					{mentionUsers.map(user => (
						<Button key={user.id} ROLE="information" onClick={() => handleSelectUser(user)}>
							<span className="mention-pill mr-2 rounded-full bg-blue-100 px-2 py-0.5 text-blue-700 text-sm">
								@
							</span>
							<Link ROLE="inline" href={`/user${user.id}`}>
								{user.username}
							</Link>
						</Button>
					))}
				</div>
			)} */}
		</>
	)
}
