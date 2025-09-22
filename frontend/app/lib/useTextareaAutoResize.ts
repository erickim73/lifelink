import { useEffect } from 'react';


export function useTextareaAutoResize(textareaRef: React.RefObject<HTMLTextAreaElement | null>, content: string) {
    useEffect(() => {
        const adjustHeight = () => {
            const textarea = textareaRef.current
            if (textarea) {
                textarea.style.height = 'auto'
                const scrollHeight = textarea.scrollHeight
                const maxHeight = 200
                const newHeight = Math.min(maxHeight, scrollHeight)
                textarea.style.height = `${newHeight}px`
                textarea.style.overflowY = scrollHeight > maxHeight ? 'auto' : 'hidden'
            }
        }
        adjustHeight()

        const timeoutId = setTimeout(adjustHeight, 10)
        
        return () => clearTimeout(timeoutId)
    }, [content, textareaRef])
}
