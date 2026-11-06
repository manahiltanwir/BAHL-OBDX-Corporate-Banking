
import { generateSecret, generateURI, verify } from 'otplib'
import QRCode from 'qrcode'

// Generate secret and QR code
export async function setupGoogleAuth(userEmail: string) {
  const secret = generateSecret()

  debugger
  console.log(secret);
  

  const otpauthUri = generateURI({
    issuer: 'YourAppName',
    label: userEmail,
    secret
  })

  const qrCodeDataUrl = await QRCode.toDataURL(otpauthUri)

  return {
    secret,
    qrCodeDataUrl
  }
}

// Verify Google Authenticator code
export async function verifyGoogleAuthToken(
  token: string,
  userSecret: string
): Promise<boolean> {
  const result = await verify({
    token,
    secret: userSecret
  })

  return result.valid
}
