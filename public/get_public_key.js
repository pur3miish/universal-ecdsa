'use strict'

const init_wasm = require('../private/init_wasm.js')

/**
 * Generates a compressed public key for the `secp256k1` curve.
 * @kind function
 * @name get_public_key
 * @param {Uint8Array} private_key secp256k1 valid private key.
 * @returns {Uint8Array} Public key.
 * @example <caption>Ways to `import`.</caption>
 * ```js
 * import get_public_key from 'universal-ecdsa'
 * ```
 * @example <caption>Ways to `require`.</caption>
 * ```js
 * const get_public_key = require('universal-ecdsa')
 * ```
 * @example <caption>Usage `get_public_key`.</caption>
 * ```js
 * const private_key = new Uint8Array([
 *   210, 101, 63, 247, 203, 178, 216, 255, 18, 154, 194, 126, 245, 120, 28, 230,
 *   139, 37, 88, 196, 26, 116, 175, 31, 45, 220, 166, 53, 203, 238, 240, 125
 * ])
 *
 * get_public_key(private_key).then(console.log) // compressed public key.
 * ```
 * > The logged output was [2, …, 207].
 */
async function get_public_key(private_key) {
  const { _Z14get_public_keyv, _Z7get_ptri, set_bytes, extract_bytes } =
    await init_wasm()

  set_bytes(_Z7get_ptri(2), private_key)
  _Z14get_public_keyv()
  return Uint8Array.from([2, ...extract_bytes(_Z7get_ptri(4), 32)])
}

module.exports = get_public_key
