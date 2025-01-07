import { useCallback, useRef } from 'react'

export function useDebounce<Args extends [string] | [number] | []>(
	callback: (...args: Args) => void,
	delay: number
): (...args: Args) => void {
	const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined)

	return useCallback(
		(...args: Args) => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current)
			}

			timeoutRef.current = setTimeout(() => {
				callback(...args)
			}, delay)
		},
		[callback, delay]
	)
}
