import { Storage } from '@google-cloud/storage'

const credentials = JSON.parse(
    Buffer.from(process.env.GOOGLE_SERVICE_KEY as string, 'base64').toString()
)

export const storage = new Storage({
    projectId: credentials.project_id,
    credentials: {
        client_email: credentials.client_email,
        private_key: credentials.private_key ? credentials.private_key : '',
    },
})

export const bucket = storage.bucket(process.env.GCS_BUCKET as string)

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
            resolve(`https://storage.googleapis.com/${bucket.name}/${fileName}`)
        })

        stream.end(fileBuffer)
    })
}

export async function deleteFile(fileName: string): Promise<any> {
    const bucketFile = bucket.file(fileName)

    await bucketFile.delete()
}
