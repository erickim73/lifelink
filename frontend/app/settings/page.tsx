"use client"

import { useState, useEffect } from "react"
import Profile from "./profile/Profile"
import SettingsSidebar from "./settingsSidebar/settingsSidebar"
import Account from "./account/Account"
import Privacy from "./privacy/Privacy"
import Security from "./security/Security"
import { useIsMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import { Menu, X, ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile")
    const [notifications, setNotifications] = useState(true)
    const isMobile = useIsMobile()
    const [settingsSidebarOpen, setSettingsSidebarOpen] = useState(!isMobile)
    const router = useRouter()

    // Handle tab change
    const handleTabChange = (tab: string) => {
        setActiveTab(tab)
        if (isMobile) {
          setSettingsSidebarOpen(false)
        }
    }

    // Toggle settings sidebar for mobile
    const toggleSettingsSidebar = () => {
        setSettingsSidebarOpen((prev) => !prev)
    }

    // Navigate back to chat page
    const navigateToChat = () => {
        router.push("/chat")
    }

    // Set initial sidebar states based on screen size
    useEffect(() => {
        if (isMobile) {
            setSettingsSidebarOpen(false)
        } else {
            setSettingsSidebarOpen(true)
        }
    }, [isMobile])

    // Handle window resize
    useEffect(() => {
        const handleResize = () => {
            if (!isMobile && !settingsSidebarOpen) {
                setSettingsSidebarOpen(true)
            }
        }

        window.addEventListener("resize", handleResize)
        return () => window.removeEventListener("resize", handleResize)
    }, [isMobile, settingsSidebarOpen])

    return (
        <div className="flex h-screen w-full bg-zinc-900 text-white">
            {/* Settings Sidebar - Mobile */}
            {isMobile && settingsSidebarOpen && (
                <div className="fixed inset-0 z-50 bg-zinc-900 overflow-y-auto">
                    <div className="flex justify-between items-center p-4 border-b border-zinc-800">
                        <div className="flex items-center">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={navigateToChat}
                                className="mr-2 text-gray-300 hover:text-white"
                            >
                                <ArrowLeft className="h-5 w-5" />
                                <span className="ml-1 text-lg">Chat</span>
                            </Button>
                        </div>
                        <Button variant="ghost" size="sm" onClick={toggleSettingsSidebar}>
                            <X className="h-5 w-5" />
                            <span className="sr-only">Close Menu</span>
                        </Button>
                    </div>
                    <div className="p-4 overflow-y-auto max-h-[calc(100vh-64px)]">
                        <SettingsSidebar
                            activeTab={activeTab}
                            setActiveTab={handleTabChange}
                            closeSidebar={() => setSettingsSidebarOpen(false)}
                        />
                    </div>
                </div>
            )}

            {/* Settings Sidebar - Desktop */}
            {!isMobile && (
                <div className="w-64 border-r border-zinc-800 flex-shrink-0 h-full overflow-y-auto">
                    <h1 className="text-4xl font-normal py-6 px-8 border-b border-zinc-800">Settings</h1>
                    <div className="p-4">
                        <SettingsSidebar activeTab={activeTab} setActiveTab={handleTabChange} />
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Mobile header with toggle button */}
                {isMobile && !settingsSidebarOpen && (
                    <div className="flex items-center p-4 border-b border-zinc-800">
                        <Button variant="ghost" size="sm" onClick={toggleSettingsSidebar} className="mr-2">
                            <Menu className="h-5 w-5" />
                            <span className="sr-only">Open Menu</span>
                        </Button>
                        <div className="flex items-center">
                            <h2 className="text-lg font-medium">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}</h2>
                        </div>                        
                    </div>
                )}

                <div className="flex-1 overflow-hidden">
                    <div className="h-full overflow-y-auto">
                        {activeTab === "profile" && (
                            <div className="h-full">
                                <Profile />
                            </div>
                        )}
                        {activeTab === "account" && (
                            <div className="h-full">
                                <Account notifications={notifications} setNotifications={setNotifications} />
                            </div>
                        )}
                        {activeTab === "privacy" && (
                            <div className="h-full">
                                <Privacy />
                            </div>
                        )}
                        {activeTab === "security" && (
                            <div className="h-full">
                                <Security />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}