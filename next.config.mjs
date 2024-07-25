/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            { hostname: 'scontent.cdninstagram.com' },
            { hostname: 'img.youtube.com' },
            { hostname: 'utfs.io' },
            { hostname: '*-sign-va.tiktokcdn.com' },
            { hostname: 'scontent-*.cdninstagram.com' },
            { hostname: 'yt3.ggpht.com' },
            { hostname: 'i.ytimg.com' },
            { hostname: 'i.scdn.co' },
        ],
    },
}

export default nextConfig
