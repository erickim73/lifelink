"use client"

import { useState, useEffect } from "react"
import { useIsMobile } from "@/hooks/use-mobile"

export function useSettingsSidebar() {
    const isMobile = useIsMobile()
    const [isOpen, setIsOpen] = useState(!isMobile)

    useEffect(() => {
        setIsOpen(!isMobile)
    }, [isMobile])

    const toggle = () => setIsOpen((prev) => !prev)
    const open = () => setIsOpen(true)
    const close = () => setIsOpen(false)

    return {
        isOpen,
        toggle,
        open,
        close,
    }
}
