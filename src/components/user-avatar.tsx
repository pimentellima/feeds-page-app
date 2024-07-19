import { UserIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

export default function UserAvatar({ imageUrl }: { imageUrl?: string }) {
    return (
        <Avatar className="h-28 w-28">
            <AvatarImage src={imageUrl} alt="Avatar image" />
            <AvatarFallback>
                <UserIcon className="h-28 w-28 p-3" />
            </AvatarFallback>
        </Avatar>
    )
}
