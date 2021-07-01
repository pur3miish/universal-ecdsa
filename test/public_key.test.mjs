import { deepStrictEqual } from 'assert'
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

  tests.add('Public key from private key', async () => {
    const pub_key = await get_public_key(private_key)
    deepStrictEqual(pub_key, public_key, 'Expected public key from private key')
  })
}
