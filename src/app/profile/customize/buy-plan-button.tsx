'use client'
import { useToast } from '@/components/ui/use-toast'
import { createCheckoutSession } from './actions'
import { CrownIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function BuyPlanButton({
    styled = false,
}: {
    styled?: boolean
}) {
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

    return styled ? (
        <Button onClick={onClickBuyPlan} variant={'outline'}>
            <CrownIcon className="text-yellow-600 mr-2 h-4 w-4" />
            <span>Get lifetime access</span>
        </Button>
    ) : (
        <button className="flex items-center" onClick={onClickBuyPlan}>
            <CrownIcon className="text-yellow-600 mr-2 h-4 w-4" />
            <span>Get lifetime access</span>
        </button>
    )
}
