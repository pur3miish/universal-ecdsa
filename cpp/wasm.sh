clang \
-Oz \
--target=wasm32-unknown-wasi \
--sysroot ./src/.lib/wasi-libc \
-nostartfiles \
-Wl,--no-entry \
-Wl,--export="_Z7get_ptri" \
-Wl,--export="_Z9sign_hashv" \
-Wl,--export="_Z14get_public_keyv" \
-I ./src/deps \
-o wasm/ecdsa.wasm \
./src/index.cpp ./src/deps/hmac-sha256/hmac-sha256.cpp ./src/deps/sha256/sha256.cpp

mkdir tmp
wasm2wat wasm/ecdsa.wasm -o tmp/ecdsa.wat
awk -f scripts/rm_fd_close.awk tmp/ecdsa.wat > tmp/one.wat
awk -f scripts/rm_fd_write.awk tmp/one.wat > tmp/two.wat
awk -f scripts/rm_fd_seek.awk tmp/two.wat > tmp/three.wat

wat2wasm tmp/three.wat -o ./tmp/ecdsa.wasm
wasm-snip ./tmp/ecdsa.wasm -o ./wasm/ecdsa.wasm  --skip-producers-section
rm -r tmp
node parse_wasm.js



# -Wl,--export-all \
