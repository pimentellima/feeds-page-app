'use client'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
    CircleUserIcon,
    LineChartIcon,
    LinkIcon,
    LogOut,
    SparklesIcon,
} from 'lucide-react'
import { signOut } from 'next-auth/react'

export function AccountSettingsDropdown() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                    <CircleUserIcon className="mr-1 h-4 w-4" /> Account
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-48">
                <DropdownMenuGroup>
                    <DropdownMenuItem>
                        <LineChartIcon className="mr-2 h-4 w-4" />
                        <span>Check metrics</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <SparklesIcon className="mr-2 h-4 w-4" />
                        <span>Upgrade plan</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <LinkIcon className="mr-2 h-4 w-4" />
                        <span>Manage integrations</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => signOut()}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
