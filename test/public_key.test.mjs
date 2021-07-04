import { deepStrictEqual, rejects } from 'assert'
import get_public_key from '../public/get_public_key.js'

export default tests => {
  // prettier-ignore
  const private_key = new Uint8Array(
  [
    210, 101, 63, 247, 203, 178, 216, 255,
    18, 154, 194, 126, 245, 120, 28, 230,
    139, 37, 88, 196, 26, 116, 175, 31,
    45, 220, 166, 53, 203, 238, 240, 125
  ])
  // prettier-ignore
  const public_key = new Uint8Array([
    2, 192, 222, 210, 188,  31,  19,   5,
    251,  15, 170, 197, 230, 192,  62, 227,
    161, 146,  66,  52, 152,  84,  39, 182,
     22, 124, 165, 105, 209,  61, 244,  53,
    207
  ])

  const private_key_negative_y = new Uint8Array([
    253, 156, 168, 92, 14, 7, 242, 47, 88, 234, 12, 42, 46, 235, 100, 3, 182,
    58, 108, 250, 164, 92, 66, 252, 93, 171, 39, 59, 188, 182, 83, 97
  ])
  const public_key_negative_y = new Uint8Array([
    3, 168, 142, 49, 253, 219, 92, 148, 48, 96, 69, 112, 118, 158, 50, 60, 229,
    222, 18, 223, 1, 16, 96, 251, 225, 221, 1, 245, 224, 136, 33, 80, 200
  ])

  tests.add('Public key from private key', async () => {
    const pub_key = await get_public_key(private_key)
    deepStrictEqual(pub_key, public_key, 'Expected public key from private key')
  })
  tests.add('Range error public key from private key', async () => {
    const pub_key = new Uint8Array(32).fill(255)
    rejects(async () => get_public_key(pub_key), 'Expected throw')
  })
  tests.add('Public key with odd y coordinate', async () => {
    deepStrictEqual(
      public_key_negative_y,
      await get_public_key(
        private_key_negative_y,
        'Expected public key from private key with negative y'
      )
    )
  })
}
