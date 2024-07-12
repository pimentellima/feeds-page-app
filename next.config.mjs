/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            { hostname: 'scontent.cdninstagram.com' },
            { hostname: 'img.youtube.com' },
        ],
    },
}

export default nextConfig
