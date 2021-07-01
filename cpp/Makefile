.PHONY: run
run: 
	@g++ ./src/index.cpp ./src/deps/hmac-sha256/hmac-sha256.cpp ./src/deps/sha256/sha256.cpp  -I ./src/deps -o secp256k1 && ./secp256k1
	@rm secp256k1

