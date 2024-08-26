import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CrownIcon, RocketIcon, StarsIcon } from 'lucide-react'
import ButtonBuyPlan from './button-buy-plan'
import DialogRedeemCode from './dialog-redeem-code'

export default function DialogUpgradePlan() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <StarsIcon className="mr-1 h-4 w-4 text-yellow-600" />{' '}
                    Deploy your page
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <div className="flex flex-col items-center justify-center gap-4 py-8">
                    <RocketIcon className="size-12 text-primary" />
                    <div className="space-y-2">
                        <div className="flex items-center justify-center">
                            <h3 className="text-2xl font-bold">
                                Upgrade plan{' '}
                            </h3>
                            <CrownIcon className="text-yellow-600 ml-2 h-5 w-5" />
                        </div>
                        <p className="text-muted-foreground">
                            Deploy your page and support the development of this
                            app with a one-time payment of $20.
                        </p>
                    </div>
                </div>
                <DialogFooter>
                    <div className="flex gap-1">
                        <DialogRedeemCode />
                        <ButtonBuyPlan />
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
