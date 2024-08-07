'use client'
import { useToast } from '@/components/ui/use-toast'
import { createCheckoutSession } from './actions'
import { CrownIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function ButtonBuyPlan() {
    const { toast } = useToast()

    const onClickBuyPlan = async () => {
        const error = await createCheckoutSession()

        if (error) {
            toast({
                title: 'An error occurred',
                description: error,
                variant: 'destructive',
            })
        }
    }

    return (
        <Button onClick={onClickBuyPlan} variant={'outline'}>
            <CrownIcon className="text-yellow-600 mr-2 h-4 w-4" />
            <span>Get lifetime access</span>
        </Button>
    )
}
