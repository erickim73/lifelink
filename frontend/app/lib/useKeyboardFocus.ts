import { useEffect, RefObject } from 'react';

export function useKeyboardFocus(textareaRef: RefObject<HTMLTextAreaElement | null>) {
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const isInput = e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement
            const isModifierKey = e.ctrlKey || e.altKey || e.metaKey

            if (isInput || isModifierKey) {
                return
            }

            if (e.key.length !== 1) {
                return
            }

            if (textareaRef.current) {
                textareaRef.current.focus()
            }
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [textareaRef])
}