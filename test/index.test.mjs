import TestDirector from 'test-director'
import init_wasmTestMjs from './init_wasm.test.mjs'
import test_get_public_key from './public_key.test.mjs'
import sha256TestMjs from './sha256.test.mjs'
import signTestMjs from './sign.test.mjs'

const tests = new TestDirector()
test_get_public_key(tests)
sha256TestMjs(tests)
signTestMjs(tests)
init_wasmTestMjs(tests)
tests.run()
