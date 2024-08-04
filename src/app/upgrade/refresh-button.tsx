'use client'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'

export default function RefreshButton() {
    const router = useRouter()

    return (
        <Button onClick={() => router.refresh()} variant={'link'}>
            Refresh
        </Button>
    )
}
