'use strict'

/**
 * Universal sha256 message digest helper function.
 * @kind function
 * @name sha256
 * @param {Uint8Array} data Binary data to hash.
 * @returns {Uint8Array} Message digest.
 * @example <caption>Ways to `import`.</caption>
 * ```js
 * import sha256 from 'universal-ecdsa'
 * ```
 * @example <caption>Ways to `require`.</caption>
 * ```js
 * const sha256 = require('universal-ecdsa')
 * ```
 * @example <caption>Usage `sha256` in node.</caption>
 * ```js
 * const array = Uint8Array.from(
 *   Buffer.from('The quick brown fox jumped over the lazy dog')
 * )
 *
 * sha256(array).then(console.log)
 * ```
 * > The logged output is [215, …, 146 ]
 */
async function sha256(data) {
  if (!(data instanceof Uint8Array))
    throw new TypeError('Expected Uint8Array input data.')

  if (typeof window == 'undefined') {
    // https://github.com/mysticatea/eslint-plugin-node/issues/250
    // eslint-disable-next-line
    const { createHash } = await import('crypto')
    return new Uint8Array(createHash('sha256').update(data).digest())
  } else return new Uint8Array(await crypto.subtle.digest('SHA-256', data))
}

module.exports = sha256
