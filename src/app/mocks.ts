export const tiktokMocks = [
    {
        id: '1',
        title: 'Amazing Dance Moves',
        video_description:
            'Watch these incredible dance moves that will leave you mesmerized!',
        duration: 60,
        cover_image_url: 'https://picsum.photos/seed/012d/600/400',
        embed_link: 'https://tiktok.com/embed/1',
        create_time: 1622519100,
        comment_count: 150,
        share_count: 200,
        view_count: 5000,
        share_url: 'https://tiktok.com/share/1',
    },
    {
        id: '2',
        title: 'Funny Cat Compilation',
        video_description:
            'A compilation of the funniest cat moments that will make your day!',
        duration: 45,
        cover_image_url: 'https://picsum.photos/seed/012d/600/400',
        embed_link: 'https://tiktok.com/embed/2',
        create_time: 1622605500,
        comment_count: 230,
        share_count: 300,
        view_count: 7500,
        share_url: 'https://tiktok.com/share/2',
    },
    {
        id: '3',
        title: 'Quick Cooking Hacks',
        video_description:
            'Learn some quick and easy cooking hacks to make your meals delicious!',
        duration: 90,
        cover_image_url: 'https://picsum.photos/seed/012d/600/400',
        embed_link: 'https://tiktok.com/embed/3',
        create_time: 1622691900,
        comment_count: 120,
        share_count: 180,
        view_count: 4000,
        share_url: 'https://tiktok.com/share/3',
    },
    {
        id: '4',
        title: 'Incredible Nature Shots',
        video_description:
            'Experience the beauty of nature through these stunning shots.',
        duration: 120,
        cover_image_url: 'https://picsum.photos/seed/012d/600/400',
        embed_link: 'https://tiktok.com/embed/4',
        create_time: 1622778300,
        comment_count: 310,
        share_count: 450,
        view_count: 12000,
        share_url: 'https://tiktok.com/share/4',
    },
   
].sort((a, b) =>
    a.create_time && b.create_time
        ? new Date(b.create_time).getTime() - new Date(a.create_time).getTime()
        : 1
)

export const instagramMocks = [
    {
        id: '1',
        caption: '',
        media_url: 'https://picsum.photos/seed/abcde/600/400',
        media_type: 'IMAGE',
        timestamp: '2024-01-15T18:30:00Z',
        permalink: '/',
    },
    {
        id: '2',
        caption: '',
        media_url: 'https://picsum.photos/seed/d3fg/600/400',
        media_type: 'IMAGE',
        timestamp: '2024-02-20T12:00:00Z',
        permalink: '/',
    },
    {
        id: '3',
        media_url: 'https://picsum.photos/seed/ffff/600/400',
        media_type: 'VIDEO',
        thumbnail_url: 'https://picsum.photos/seed/dddd/600/400',
        timestamp: '2024-03-05T09:45:00Z',
        permalink: '/',
    },
    {
        id: '4',
        caption: '',
        media_url: 'https://picsum.photos/seed/qwqw/600/400',
        media_type: 'IMAGE',
        timestamp: '2024-04-10T14:15:00Z',
        permalink: 'https://www.instagram.com/p/4',
    },
    {
        id: '5',
        caption: '',
        media_url: 'https://picsum.photos/seed/34ff/600/400',
        media_type: 'CAROUSEL_ALBUM',
        timestamp: '2024-05-18T07:30:00Z',
        permalink: '/',
    },
].sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
)
