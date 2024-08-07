'use client'

import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'

export default function ButtonConnectAccount({
    label,
    url,
}: {
    label: string
    url: string
}) {
    const router = useRouter()
    const { toast } = useToast()

    return (
        <Button
            variant={'secondary'}
            onClick={async () => {
                try {
                    const res = await fetch(url, { method: 'POST' })
                    if (!res.ok) {
                        toast({
                            title: 'An error occurred while pairing your account.',
                            variant: 'destructive',
                        })
                        return
                    }
                    const data = await res.json()
                    router.push(data.url)
                } catch (e) {
                    toast({
                        title: 'An error occurred while pairing your account.',
                        variant: 'destructive',
                    })
                }
            }}
        >
            {label}
        </Button>
    )
}
