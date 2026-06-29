export function UrlToFileName(url_string: string) {
  const url = new URL(url_string)

  const protocol = url.protocol // "https:"
  const domain = url.hostname // "static-files-lms.s3.us-east-2.amazonaws.com"
  const path = url.pathname // "/7b02e229-48ae-4b9b-82db-76e42f611cedvideosHarry.mp4"
  const filename = path.split('/').pop() // "videosHarry.mp4"

  const uuidIndex = filename && filename.indexOf('-') // 32
  const withoutUUIDFileName = filename && uuidIndex && filename.slice(uuidIndex + 1) // "videosHarry.mp4"

  return {
    protocol,
    domain,
    path,
    filename,
    withoutUUIDFileName
  }
}
