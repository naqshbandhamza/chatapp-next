import CryptoJS from 'crypto-js';

const SECRET = process.env.SESSION_SECRET || 'my-secret-key'

export async function encrypt(value: string) {
  return CryptoJS.AES.encrypt(value, SECRET).toString()
}

export async function decrypt(ciphertext: string) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET)
  return bytes.toString(CryptoJS.enc.Utf8)
}
