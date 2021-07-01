awk -f scripts/rm_fd_close.awk tmp/wasm/ecdsa.wat > tmp/one.wat
awk -f scripts/rm_fd_seek.awk tmp/one.wat > tmp/two.wat
awk -f scripts/rm_fd_write.awk tmp/two.wat > tmp/four.wat
wat2wasm tmp/four.wat -o tmp/ecdsa.wasm

