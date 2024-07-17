export function encodeBody(body: Record<string, string>) {
    return Object.keys(body)
        .map(
            (key) =>
                `${encodeURIComponent(key)}=${encodeURIComponent(
                    (body as any)[key]
                )}`
        )
        .join('&')
}
