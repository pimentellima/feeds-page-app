import { auth } from '@/lib/auth'
import { getUser } from '@/services/user'
import {
    FacebookIcon,
    InstagramIcon,
    XIcon,
    YoutubeIcon
} from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { AccountSettingsDropdown } from './account-settings-dropdown'
import ChangeImageDialog from './change-image-dialog'
import ChangeThemeSelect from './change-theme-dropdown'
import { CustomizeWidgetsPanel } from './customize-widgets-panel'
import EditProfileDialog from './edit-profile-dialog'

export default async function CustomizePage() {
    const session = await auth()

    if (!session?.user) {
        redirect('/sign-in')
    }

    const user = await getUser(session.user.id)

    return (
        <>
            <div className="fixed top-5 right-14 flex items-center gap-1">
                <ChangeThemeSelect />
                <AccountSettingsDropdown />
            </div>
            <div className="grid grid-cols-[4fr,10fr] gap-4 min-h-screen px-16 bg-background">
                <div className="flex flex-col fixed top-0 mt-20 pb-32 h-full">
                    <ChangeImageDialog imageUrl={user?.imageUrl || ''} />
                    <EditProfileDialog user={user} />
                    <div className="mt-10">
                        <ShortLinks />
                    </div>
                </div>
                <div className="col-start-2 grid grid-cols-2 grid-rows-2 gap-4 pt-20 pb-10">
                    <CustomizeWidgetsPanel
                        userId={user.id}
                        userWidgets={user.widgets}
                    />
                </div>
            </div>
        </>
    )
}

function ShortLinks() {
    return (
        <div className="flex gap-9">
            <Link href={''}>
                <XIcon className="h-6 w-6" />
            </Link>
            <Link href={''}>
                <InstagramIcon className="h-6 w-6" />
            </Link>
            <Link href={''}>
                <YoutubeIcon className="h-6 w-6" />
            </Link>
            <Link href={''}>
                <FacebookIcon className="h-6 w-6" />
            </Link>
        </div>
    )
}
