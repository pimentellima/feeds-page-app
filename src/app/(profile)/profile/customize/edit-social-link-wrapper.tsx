'use client'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { links } from '@/drizzle/schema'
import { InferSelectModel } from 'drizzle-orm'
import { ReactNode, useState } from 'react'
import AddLinkForm from './add-link-form'

export function EditSocialLinkWrapper({
    children,
    link,
}: {
    children: ReactNode
    link: InferSelectModel<typeof links>
}) {
    const [linkDialogOpen, setLinkDialogOpen] = useState(false)

    return (
        <Dialog
            open={linkDialogOpen}
            onOpenChange={(open) => setLinkDialogOpen(open)}
        >
            <DialogTrigger>{children}</DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit social link</DialogTitle>
                </DialogHeader>
                <AddLinkForm
                    link={link}
                    onCancelForm={() => setLinkDialogOpen(false)}
                    onSubmitForm={() => setLinkDialogOpen(false)}
                />
            </DialogContent>
        </Dialog>
    )
}
