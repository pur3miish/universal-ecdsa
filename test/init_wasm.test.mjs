import { ok } from 'assert'
import init_wasm from '../private/init_wasm.js'

export default tests => {
  tests.add('init wasm test', async () => {
    const data = await init_wasm()
    if (!data.set_bytes) throw new Error('Missing set_bytes')
    if (!data.extract_bytes) throw new Error('Missing extract_bytes')
    if (!data._Z7get_ptri) throw new Error('Missing _Z7get_ptri')
    if (!data._Z9sign_hashv) throw new Error('Missing _Z9sign_hashv')
    if (!data._Z14get_public_keyv)
      throw new Error('Missing _Z14get_public_keyv')

    ok(true, 'Expected functions')
  })
}
