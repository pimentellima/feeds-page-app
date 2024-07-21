import { getUserByUsername } from '@/services/user'

export default async function UserPage({
    params,
}: {
    params: { username: string }
}) {
    const user = await getUserByUsername(params.username)

    return (
        <div className="bg-gradient flex justify-center items-center min-h-screen py-8"></div>
    )
}
