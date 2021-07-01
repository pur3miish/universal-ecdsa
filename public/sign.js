'use strict'

const init_wasm = require('../private/init_wasm.js')
const sha256_hash = require('./sha256.js')

/**
 * Generates a digital signature on the secp256k1 Koblitz curve.
 * @kind function
 * @name sign
 * @param {object} Arg Argument.
 * @param {Uin8Array} Arg.private_key secp256k1 private key.
 * @param {Uin8Array} Arg.data Data to sign.
 * @returns {Signature} Digital signature object containing `r` and `s` values.
 * @example <caption>Ways to `import`.</caption>
 * ```js
 * import { sign } from 'universal-ecdsa'
 * ```
 * @example <caption>Ways to `require`.</caption>
 * ```js
 * const { sign } = require('universal-ecdsa')
 * ```
 *  @example <caption>Usage `sign`.</caption>
 * ```js
 * const private_key = new Uint8Array([
 *   210, 101, 63, 247, 203, 178, 216, 255, 18, 154, 194, 126, 245, 120, 28, 230,
 *   139, 37, 88, 196, 26, 116, 175, 31, 45, 220, 166, 53, 203, 238, 240, 125
 * ])
 *
 * const data = Uint8Array.from([104, 101, 108, 108, 111])
 * sign({ data, private_key }).then(console.log)
 * ```
 * > The logged output is { r: [23, …, 89], s: [111, …, 142] }
 */
async function sign({ private_key, data }) {
  const { _Z9sign_hashv, _Z7get_ptri, set_bytes, extract_bytes } =
    await init_wasm()
  const hash = await sha256_hash(data)

  set_bytes(_Z7get_ptri(2), private_key)
  set_bytes(_Z7get_ptri(3), hash)
  _Z9sign_hashv()

  const r = extract_bytes(_Z7get_ptri(0), 32)
  const s = extract_bytes(_Z7get_ptri(1), 32)

  return { r, s }
}

module.exports = sign
