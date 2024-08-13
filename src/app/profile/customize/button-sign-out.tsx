'use client'
import { Button } from '@/components/ui/button'
import { LogOut } from 'lucide-react'
import { signOut } from 'next-auth/react'

export function ButtonSignOut() {
    return (
        <Button variant={'ghost'} className="flex" onClick={() => signOut()}>
            <LogOut className="mr-0 sm:mr-1 h-4 w-4" />
            <span className='hidden sm:block'>Sign out</span>
        </Button>
    )
}
