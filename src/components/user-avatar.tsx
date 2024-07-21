import { UserIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

export default function UserAvatar({ imageUrl }: { imageUrl?: string }) {
    return (
        <Avatar className="h-44 w-44 ring-primary">
            <AvatarImage src={imageUrl} alt="Avatar image" />
            <AvatarFallback>
                <UserIcon className="h-44 w-44 p-3" />
            </AvatarFallback>
        </Avatar>
    )
}
