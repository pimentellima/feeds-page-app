'use client'
import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { InstagramProfile } from '@/services/user'
import { DialogDescription } from '@radix-ui/react-dialog'
import { Dot, LinkIcon } from 'lucide-react'
import { useState } from 'react'

const accountLabel = {
    BUSINESS: 'Business account',
    MEDIA_CREATOR: 'Media Creator',
    PERSONAL: 'Personal account',
}

export default function LinkInstagramDialog({
    userProfile,
}: {
    userProfile?: InstagramProfile | null
}) {
    const [open, setOpen] = useState(false)

    return (
        <Dialog onOpenChange={(open) => setOpen(open)} open={open}>
            <DialogTrigger asChild>
                <Button variant={'outline'} className="">
                    <LinkIcon className="h-5 w-5 mr-1" />
                    {userProfile
                        ? 'Manage Instagram account'
                        : 'Link Instagram account'}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {userProfile
                            ? 'Manage Instagram account'
                            : 'Link Instagram account'}
                    </DialogTitle>
                    <DialogDescription>
                        {userProfile
                            ? 'Manage your Instagram account information'
                            : "Link your account to load your profile's posts"}
                    </DialogDescription>
                </DialogHeader>
                <div>
                    {userProfile ? (
                        <div>
                            <div className="flex gap-3 justify-center items-center">
                                <p>{userProfile.username}</p>
                                <Dot className="h-5 w-5" />
                                <p>{userProfile.media_count + ' media'}</p>
                                <Dot className="h-5 w-5" />
                                <p>{accountLabel[userProfile.account_type]}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-1 mt-6">
                                <Button>Unlink account</Button>
                                <Button
                                    onClick={() => setOpen(false)}
                                    variant={'outline'}
                                >
                                    Go back
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <Button variant={'outline'}>
                            Click here to link your instagram account
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    )
}
