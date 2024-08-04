import {
    Storage
} from '@google-cloud/storage'
import { existsSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

const pathJson = join(process.cwd(), 'keys', 'gcs.json')

const createJsonCredentials = () => {
    const key = process.env.GOOGLE_SERVICE_KEY as string
    const credentials = JSON.parse(Buffer.from(key, 'base64').toString())

    writeFileSync(pathJson, JSON.stringify(credentials, null, 2))

    return credentials
}

const makeCredentials = () => {
    const existsPath = existsSync(pathJson)

    if (!existsPath) return createJsonCredentials()

    const credentials = require(pathJson)
    return credentials
}

const credentials = makeCredentials()

export const storage = new Storage({
    projectId: credentials.project_id,
    credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key ? credentials.private_key : '',
    },
})

export const bucket = storage.bucket(process.env.GCS_BUCKET as string)

export const baseGCSUrl = `http://storage.googleapis.com/${bucket.name}`

export async function uploadFile(file: File): Promise<string> {
    const arrayBuffer = await file.arrayBuffer()
    const fileBuffer = Buffer.from(arrayBuffer)

    return new Promise(async (resolve, reject) => {
        const fileName = crypto.randomUUID()
        const bucketFile = bucket.file(fileName)
        const stream = bucketFile.createWriteStream()

        stream.on('error', (err) => {
            reject(err)
        })

        stream.on('finish', () => {
            resolve(`http://storage.googleapis.com/${bucket.name}/${fileName}`)
        })

        stream.end(fileBuffer)
    })
}

export async function deleteFile(fileName: string): Promise<any> {
    const bucketFile = bucket.file(fileName)

    await bucketFile.delete()
}
