/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            { hostname: 'scontent.cdninstagram.com' },
            { hostname: 'img.youtube.com' },
            { hostname: 'utfs.io' },
            { hostname: '*-sign-va.tiktokcdn.com' },
        ],
    },
}

export default nextConfig
