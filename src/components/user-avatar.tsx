import { UserIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

export default function UserAvatar({ imageUrl }: { imageUrl?: string }) {
    return (
        <Avatar className="h-24 w-24 sm:h-44 sm:w-44 ring-primary">
            <AvatarImage src={imageUrl} alt="Avatar image" />
            <AvatarFallback>
                <UserIcon className="h-24 w-24 sm:h-44 sm:w-44 p-3 z-10" />
            </AvatarFallback>
        </Avatar>
    )
}
