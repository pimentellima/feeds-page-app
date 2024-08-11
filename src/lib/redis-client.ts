// lib/redisClient.js

import { createClient } from 'redis'

const client = createClient({
    url: process.env.REDIS_URL, // Ensure you set this environment variable
})

client.on('error', (err) => console.error('Redis Client Error', err))

async function connectRedis() {
    if (!client.isOpen) {
        await client.connect()
    }
}

export { client, connectRedis }
