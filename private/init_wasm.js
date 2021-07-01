'use strict'

const { WASM } = require('./ecdsa.json')

/**
 * A web assembly, Wasm, function that returns the memory address location of various variables.
 * @kind function
 * @name ECDSA#_Z7get_ptri
 * @param {number} index Pointer index value range 0 - 4.
 * @returns {number} Memory address.
 * @ignore
 * @example <caption>Wasm _Z7get_ptri</caption>
 * ```js
 * async function test() {
 *   const { _Z7get_ptri } = await init_wasm()
 *   _Z7get_ptri(0) // digital siganture `r` address.
 *   _Z7get_ptri(1) // digital siganture `s` address.
 *   _Z7get_ptri(2) // private key address.
 *   _Z7get_ptri(3) // sha256_data address.
 *   _Z7get_ptri(4) // public key address.
 * }
 * ```
 */

/**
 * A web assembly, Wasm, function that generates `private key` from a given `public key`.
 * @kind function
 * @name ECDSA#_Z14get_public_keyv
 * @ignore
 * @example <caption>Wasm _Z14get_public_keyv</caption>
 * ```js
 * async function test() {
 *   const { _Z14get_public_keyv, _Z7get_ptri, set_bytes, extract_bytes } =
 *     await init_wasm()
 *
 *   set_bytes(_Z7get_ptri(2), private_key)
 *   _Z14get_public_keyv()
 *   extract_bytes(_Z7get_ptri(4), 32) // public key byte array
 * }
 * ```
 */

/**
 * A web assembly function that generates a ECDSA signature.
 * @kind function
 * @name ECDSA#_Z9sign_hashv
 * @ignore
 * @example <caption>Wasm _Z9sign_hashv</caption>
 * ```js
 * async function test() {
 *   const { _Z7get_ptri, set_bytes, extract_bytes, _Z9sign_hashv } = await init_wasm()
 *   const sha256_hex = await sha256(hex)
 *   set_bytes(_Z7get_ptri(2), private_key)
 *   set_bytes(_Z7get_ptri(3), sha256_hex)
 *   sign()
 *   const r = extract_bytes(_Z7get_ptri(0), 32)
 *   const s = extract_bytes(_Z7get_ptri(1), 32)
 * }
 * ```
 */

/**
 * A Wasm object instance for operations on the `secp256k1` curve.
 * @kind typedef
 * @name ECDSA
 * @ignore
 * @type {object}
 */

/**
 * Initialise the `ECDSA` web assembly module.
 * @returns {ECDSA} The built Wasm utility object.
 * @ignore
 */
async function init_wasm() {
  const {
    instance: {
      exports: { memory, ...exports }
    }
  } = await WebAssembly.instantiate(new Uint8Array(WASM))

  /**
   * Extract bytes from the web assembly memory byte array.
   * @name ECDSA#extract_bytes
   * @param {number} pointer The Wasm memory address to start at.
   * @param {number} length The length of bytes to shift from pointer address.
   * @returns {Uint8Array} The extracted Uint8Array.
   * @ignore
   */
  function extract_bytes(pointer, length) {
    return new Uint8Array(memory.buffer).slice(pointer, pointer + length)
  }

  /**
   * Update the web assembly memory at a given address.
   * @name ECDSA#set_bytes
   * @param {number} pointer The memory address to stat at.
   * @param {Uint8Array} bytes The array data to insert into Wasm memory.
   * @ignore
   */
  function set_bytes(pointer, bytes) {
    const cArray = new Uint8Array(memory.buffer, pointer, bytes.length)
    cArray.set(bytes)
  }

  return { set_bytes, extract_bytes, ...exports }
}

module.exports = init_wasm
