'use strict'

const fs = require('fs')

const buffer = fs.readFileSync('wasm/ecdsa.wasm')

fs.writeFileSync(
  '../private/ecdsa.json',
  JSON.stringify({
    WASM: buffer.toJSON().data
  })
)
