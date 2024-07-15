'use client'

import { Button } from '@/components/ui/button'
import { LogOutIcon } from 'lucide-react'
import { signOut } from 'next-auth/react'

export default function LogoutButton() {
    return (
        <Button onClick={() => signOut()}>
            <LogOutIcon className="h-5 w-5 mr-1" />
            Sign out
        </Button>
    )
}
