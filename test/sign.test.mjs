import { deepStrictEqual } from 'assert'
import sign from '../public/sign.js'

const private_key = new Uint8Array([
  210, 101, 63, 247, 203, 178, 216, 255, 18, 154, 194, 126, 245, 120, 28, 230,
  139, 37, 88, 196, 26, 116, 175, 31, 45, 220, 166, 53, 203, 238, 240, 125
])

export default tests => {
  tests.add('ECDSA test.', async () => {
    const data = Uint8Array.from([104, 101, 108, 108, 111])
    sign({ private_key, data }).then(({ r, s }) => {
      deepStrictEqual(
        r,
        Uint8Array.from([
          23, 65, 177, 231, 159, 63, 28, 25, 165, 77, 134, 46, 57, 177, 238, 12,
          27, 154, 144, 172, 2, 178, 236, 72, 4, 137, 215, 73, 68, 45, 204, 89
        ]),
        'Expected r signature.'
      )
      deepStrictEqual(
        s,
        Uint8Array.from([
          111, 249, 137, 86, 106, 238, 64, 221, 142, 155, 69, 155, 220, 248,
          115, 86, 40, 253, 185, 203, 14, 216, 101, 226, 70, 25, 127, 31, 145,
          3, 72, 142
        ]),
        'Expected s signature.'
      )
    })
  })

  tests.add('ECDSA test 2 iterations.', async () => {
    const data = Uint8Array.from([
      75, 64, 14, 80, 102, 145, 71, 88, 235, 218, 14, 154, 227, 28, 80, 119, 99,
      141, 64, 3, 32, 154, 180, 208, 111, 159, 242, 81, 40, 228, 231, 137
    ])
    sign({ private_key, data }).then(({ r, s }) => {
      deepStrictEqual(
        r,
        Uint8Array.from([
          72, 119, 153, 175, 250, 205, 95, 240, 175, 129, 65, 165, 241, 156, 94,
          5, 11, 62, 4, 242, 176, 82, 210, 128, 50, 153, 199, 248, 142, 62, 238,
          79
        ]),
        'expected r value for 3 iterations'
      )
      deepStrictEqual(
        s,
        Uint8Array.from([
          49, 194, 138, 9, 93, 243, 130, 1, 210, 178, 11, 92, 186, 3, 250, 30,
          128, 152, 12, 196, 247, 1, 174, 129, 76, 218, 56, 145, 133, 186, 42,
          100
        ]),
        'expected r value for 3 iterations'
      )
    })
  })

  tests.add('ECDSA test 3 iterations.', async () => {
    const data = Uint8Array.from([
      69, 190, 43, 207, 207, 204, 186, 186, 41, 243, 229, 40, 86, 150, 183, 176,
      50, 222, 50, 152, 13, 242, 56, 51, 159, 168, 98, 15, 76, 26, 229, 68
    ])
    sign({ private_key, data }).then(({ r, s }) => {
      deepStrictEqual(
        r,
        Uint8Array.from([
          77, 179, 117, 207, 35, 85, 114, 147, 158, 226, 74, 245, 183, 193, 235,
          254, 94, 235, 225, 57, 205, 172, 76, 28, 232, 114, 124, 152, 169, 107,
          179, 126
        ]),
        'expected r value for 3 iterations'
      )
      deepStrictEqual(
        s,
        Uint8Array.from([
          97, 193, 51, 17, 33, 239, 215, 165, 234, 181, 56, 157, 219, 104, 227,
          162, 254, 117, 190, 81, 216, 165, 95, 159, 3, 115, 250, 179, 46, 181,
          116, 16
        ]),
        'expected r value for 3 iterations'
      )
    })
  })
}
