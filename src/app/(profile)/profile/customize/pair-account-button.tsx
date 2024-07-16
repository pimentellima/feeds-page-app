'use client'

import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'

export default function PairAccountButton({
    label,
    link,
}: {
    label: string
    link: string
}) {
    const router = useRouter()
    const { toast } = useToast()
    return (
        <Button
            onClick={async () => {
                try {
                    const res = await fetch(link, { method: 'POST' })
                    if (!res.ok) {
                        toast({
                            title: 'An error occurred while pairing your account.',
                            variant: 'destructive',
                        })
                        return
                    }
                    const data = await res.json()
                    const url = data.url as string
                    router.push(url)
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
