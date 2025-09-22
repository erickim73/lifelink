"use client"

import {ChevronsUpDown, HelpCircle, LogOut, Settings, User, } from "lucide-react"
import {Avatar, AvatarFallback, } from "@/components/ui/avatar"
import {DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger} from "@/components/ui/dropdown-menu"
import {SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar} from "@/components/ui/sidebar"
import { supabase } from "@/app/lib/supabase-client"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function NavUser({user}: {user: {name: string, email: string, initials: string}}) {
  const { isMobile } = useSidebar()
  const router = useRouter()

  const logout = async () => {
        await supabase.auth.signOut();
        router.push('/')
    }
  

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <Avatar className="w-8 h-8 rounded-lg">
                <AvatarFallback className="rounded-lg">{user.initials}</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-sm leading-tight text-left">
                <span className="font-medium truncate">{user.name}</span>
                <span className="text-xs truncate">{user.email}</span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-full rounded-lg min-w-56"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="w-8 h-8 rounded-lg">
                  <AvatarFallback className="rounded-lg">{user.initials}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-sm leading-tight text-left">
                  <span className="font-medium truncate">{user.name}</span>
                  <span className="text-xs truncate">{user.email}</span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Link href = '/settings' className="flex items-center w-full gap-2 ">
                  <User className="size-5" />
                  <span>Profile</span>
                </Link>
                
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link href = '/settings/' className="flex items-center w-full gap-2 ">
                  <Settings className="size-5" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Link href = '/termsofservice' className="flex items-center w-full gap-2 ">
                    <HelpCircle className="size-5" />
                    <span>Terms of Service</span>
                </Link>
              </DropdownMenuItem>

            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="flex w-full items-center gap-2 px-2.5 py-2 cursor-pointer">
              <LogOut className="size-5" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
