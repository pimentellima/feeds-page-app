import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { SmartphoneIcon } from 'lucide-react'

export default function DialogMobileView() {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size={'sm'}>
                    <SmartphoneIcon className="mr-1 h-4 w-4" />
                    Mobile view
                </Button>
            </DialogTrigger>
            <DialogContent className="bg-transparent border-none shadow-none">
                <div className="fixed top-1/2 -translate-y-1/2 translate-x-1/2 right-1/2">
                    <iframe
                        className="ring-8 ring-secondary rounded-[2.5rem] -webkit-min-device-pixel-ratio:3 scale-75"
                        scrolling="no"
                        height={844}
                        width={390}
                        src={process.env.NEXT_PUBLIC_URL + '/preview'}
                    ></iframe>
                </div>
            </DialogContent>
        </Dialog>
    )
}
