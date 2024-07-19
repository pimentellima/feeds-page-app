export default function UserProfileInfo({
    user,
}: {
    user: { username?: string | null; bio?: string | null }
}) {
    return (
        <div
            className="mt-1 rounded-md font-medium group transition-colors
            px-4 py-2 max-w-96"
        >
            <p className="group-hover:underline underline-offset-4 w-full">
                {user.username || 'No username'}
            </p>
            <p className="group-hover:underline overflow-hidden whitespace-nowrap text-ellipsis">
                {user.bio || 'No bio'}
            </p>
        </div>
    )
}
