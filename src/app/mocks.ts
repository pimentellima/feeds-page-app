export const pinterestMocks = [
    {
        id: '1',
        created_at: '2024-01-01T10:30:00Z',
        link: '/',
        title: '',
        description: 'A serene lake surrounded by mountains at sunrise.',
        media: {
            media_type: 'image',
            images: {
                '150x150': {
                    width: 150,
                    height: 150,
                    url: 'https://picsum.photos/seed/1234/150/150',
                },
                '400x300': {
                    width: 400,
                    height: 300,
                    url: 'https://picsum.photos/seed/1234/400/300',
                },
                '600x': {
                    width: 600,
                    height: 400,
                    url: 'https://picsum.photos/seed/1234/600/400',
                },
                '1200x': {
                    width: 1200,
                    height: 800,
                    url: 'https://picsum.photos/seed/1234/1200/800',
                },
            },
        },
    },
    {
        id: '2',
        created_at: '2024-02-15T14:45:00Z',
        link: '/',
        title: '',
        description: 'A healthy and tasty avocado toast recipe.',
        media: {
            media_type: 'image',
            images: {
                '150x150': {
                    width: 150,
                    height: 150,
                    url: 'https://picsum.photos/seed/5678/150/150',
                },
                '400x300': {
                    width: 400,
                    height: 300,
                    url: 'https://picsum.photos/seed/5678/400/300',
                },
                '600x': {
                    width: 600,
                    height: 400,
                    url: 'https://picsum.photos/seed/5678/600/400',
                },
                '1200x': {
                    width: 1200,
                    height: 800,
                    url: 'https://picsum.photos/seed/5678/1200/800',
                },
            },
        },
    },
    {
        id: '3',
        created_at: '2024-03-10T08:30:00Z',
        link: '/',
        title: '',
        description: 'A collection of classic cars from the 1950s.',
        media: {
            media_type: 'image',
            images: {
                '150x150': {
                    width: 150,
                    height: 150,
                    url: 'https://picsum.photos/seed/8923/150/150',
                },
                '400x300': {
                    width: 400,
                    height: 300,
                    url: 'https://picsum.photos/seed/8923/400/300',
                },
                '600x': {
                    width: 600,
                    height: 400,
                    url: 'https://picsum.photos/seed/8923/600/400',
                },
                '1200x': {
                    width: 1200,
                    height: 800,
                    url: 'https://picsum.photos/seed/8923/1200/800',
                },
            },
        },
    },
    {
        id: '4',
        created_at: '2024-04-05T11:20:00Z',
        link: '/',
        title: '',
        description: 'A comfortable reading nook with a view of the garden.',
        media: {
            media_type: 'image',
            images: {
                '150x150': {
                    width: 150,
                    height: 150,
                    url: 'https://picsum.photos/seed/7530/150/150',
                },
                '400x300': {
                    width: 400,
                    height: 300,
                    url: 'https://picsum.photos/seed/7530/400/300',
                },
                '600x': {
                    width: 600,
                    height: 400,
                    url: 'https://picsum.photos/seed/7530/600/400',
                },
                '1200x': {
                    width: 1200,
                    height: 800,
                    url: 'https://picsum.photos/seed/7530/1200/800',
                },
            },
        },
    },
    {
        id: '5',
        created_at: '2024-05-22T16:00:00Z',
        link: '/',
        title: '',
        description: 'Creative and fun DIY craft projects for all ages.',
        media: {
            media_type: 'image',
            images: {
                '150x150': {
                    width: 150,
                    height: 150,
                    url: 'https://picsum.photos/seed/9224/150/150',
                },
                '400x300': {
                    width: 400,
                    height: 300,
                    url: 'https://picsum.photos/seed/9224/400/300',
                },
                '600x': {
                    width: 600,
                    height: 400,
                    url: 'https://picsum.photos/seed/9224/600/400',
                },
                '1200x': {
                    width: 1200,
                    height: 800,
                    url: 'https://picsum.photos/seed/9224/1200/800',
                },
            },
        },
    },
].sort(
    (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
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
        thumbnail_url: 'https://www.example.com/image/vacation-thumbnail.jpg',
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
