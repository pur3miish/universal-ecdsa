import { deepStrictEqual } from 'assert'
import sha256 from '../public/sha256.js'

export default tests => {
  tests.add('Sha256', async () => {
    const array = Uint8Array.from([
      84, 104, 101, 32, 113, 117, 105, 99, 107, 32, 98, 114, 111, 119, 110, 32,
      102, 111, 120, 32, 106, 117, 109, 112, 115, 32, 111, 118, 101, 114, 32,
      116, 104, 101, 32, 108, 97, 122, 121, 32, 100, 111, 103
    ])
    const expected = Uint8Array.from([
      215, 168, 251, 179, 7, 215, 128, 148, 105, 202, 154, 188, 176, 8, 46, 79,
      141, 86, 81, 228, 109, 60, 219, 118, 45, 2, 208, 191, 55, 201, 229, 146
    ])

    const data = await sha256(array)

    deepStrictEqual(data, expected, 'Expected sha256 value')
  })
}
