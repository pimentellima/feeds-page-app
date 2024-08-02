import {
    Storage,
    type DownloadResponse,
    type File as StorageFile,
} from '@google-cloud/storage'

export const storage = new Storage({
    projectId: process.env.GOOGLE_PROJECT_ID,
    credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY!.split(String.raw`\n`).join('\n'),
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

export async function getFile(
    fileName: string
): Promise<[StorageFile, Promise<DownloadResponse>]> {
    const bucketFile = bucket.file(fileName)
    return [bucketFile, bucketFile.download()]
}

export async function deleteFile(fileName: string): Promise<any> {
    const bucketFile = bucket.file(fileName)

    await bucketFile.delete()
}
