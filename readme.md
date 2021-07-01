![secp256k1 logo](https://raw.githubusercontent.com/pur3miish/universal-ecdsa/master/static/secp256k1.svg)

# Universal ECDSA

[![NPM Package](https://img.shields.io/npm/v/universal-ecdsa.svg)](https://www.npmjs.org/package/universal-ecdsa) [![CI status](https://github.com/pur3miish/universal-ecdsa/workflows/CI/badge.svg)](https://github.com/pur3miish/universal-ecdsa/actions) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://github.com/pur3miish/eos-ecc/blob/main/LICENSE)

A [Universal](https://en.wikipedia.org/wiki/Isomorphic_JavaScript) JavaScript [Elliptic Curve Digital Signature Algorithm](https://en.bitcoin.it/wiki/Elliptic_Curve_Digital_Signature_Algorithm) (ECDSA) for the Koblitz secp256k1 curve.

# Setup

```shell
npm i universal-ecdsa
```

# Suport

- Node.js `^12.20.1 || >= 13.2`
- Browser `defaults, no IE 11`

# API

- [function get_public_key](#function-get_public_key)
- [function sha256](#function-sha256)
- [function sign](#function-sign)

## function get_public_key

Generates a compressed public key for the `secp256k1` curve.

| Parameter     | Type       | Description                  |
| :------------ | :--------- | :--------------------------- |
| `private_key` | Uint8Array | secp256k1 valid private key. |

**Returns:** Uint8Array — Public key.

### Examples

_Ways to `import`._

> ```js
> import get_public_key from 'universal-ecdsa'
> ```

_Ways to `require`._

> ```js
> const get_public_key = require('universal-ecdsa')
> ```

_Usage `get_public_key`._

> ```js
> const private_key = new Uint8Array([
>   210, 101, 63, 247, 203, 178, 216, 255, 18, 154, 194, 126, 245, 120, 28, 230,
>   139, 37, 88, 196, 26, 116, 175, 31, 45, 220, 166, 53, 203, 238, 240, 125
> ])
>
> get_public_key(private_key).then(console.log) // compressed public key.
> ```
>
> > The logged output was \[2, …, 207].

---

## function sha256

Universal sha256 message digest helper function.

| Parameter | Type       | Description          |
| :-------- | :--------- | :------------------- |
| `data`    | Uint8Array | Binary data to hash. |

**Returns:** Uint8Array — Message digest.

### Examples

_Ways to `import`._

> ```js
> import sha256 from 'universal-ecdsa'
> ```

_Ways to `require`._

> ```js
> const sha256 = require('universal-ecdsa')
> ```

_Usage `sha256` in node._

> ```js
> const array = Uint8Array.from(
>   Buffer.from('The quick brown fox jumped over the lazy dog')
> )
>
> sha256(array).then(console.log)
> ```
>
> > The logged output is \[215, …, 146 ]

---

## function sign

Generates a digital signature on the secp256k1 Koblitz curve.

| Parameter         | Type      | Description            |
| :---------------- | :-------- | :--------------------- |
| `Arg`             | object    | Argument.              |
| `Arg.private_key` | Uin8Array | secp256k1 private key. |
| `Arg.data`        | Uin8Array | Data to sign.          |

**Returns:** Signature — Digital signature object containing `r` and `s` values.

### Examples

_Ways to `import`._

> ```js
> import sign from 'universal-ecdsa'
> ```

_Ways to `require`._

> ```js
> const sign = require('universal-ecdsa')
> ```

_Usage `sign`._

> ```js
> const private_key = new Uint8Array([
>   210, 101, 63, 247, 203, 178, 216, 255, 18, 154, 194, 126, 245, 120, 28, 230,
>   139, 37, 88, 196, 26, 116, 175, 31, 45, 220, 166, 53, 203, 238, 240, 125
> ])
>
> const data = Uint8Array.from([104, 101, 108, 108, 111])
> sign({ data, private_key }).then(console.log)
> ```
>
> > The logged output is { r: \[23, …, 89], s: \[111, …, 142] }
