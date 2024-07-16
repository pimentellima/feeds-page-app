'use client'

import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { deleteIntegration } from './actions'

export default function DeleteIntegrationButton({
    label = 'Delete feed',
    id,
}: {
    label?: string
    id: string
}) {
    const { toast } = useToast()

    return (
        <Button
            variant={'destructive'}
            onClick={async () => {
                try {
                    const error = await deleteIntegration(id)
                    if (error)
                        toast({
                            title: 'An error occurred while deleting the feed.',
                            description: error,
                            variant: 'destructive',
                        })
                } catch (e) {
                    toast({
                        title: 'An error occurred while deleting the feed.',
                        variant: 'destructive',
                    })
                }
            }}
        >
            {label}
        </Button>
    )
}
