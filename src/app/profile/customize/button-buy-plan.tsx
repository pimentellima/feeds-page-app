'use client'
import { useToast } from '@/components/ui/use-toast'
import { createCheckoutSession } from './actions'
import { CreditCardIcon, CrownIcon } from 'lucide-react'
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
        <Button onClick={onClickBuyPlan} variant={'default'}>
            <CreditCardIcon className="mr-2 h-4 w-4" />
            <span>Checkout on stripe</span>
        </Button>
    )
}
