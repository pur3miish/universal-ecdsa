# universal-ecdsa changelog

## 1.1.3

- Equality issue for [deterministically_generate_k](cpp/src/ecdsa.cpp) for {r,s} values fixed (start with 0x80).

## 1.1.2

### Patch

- racid bug fix.

# 1.1.1

- get_public_key is not producing a valid public key, prepends 3 for odd y coordinates and 2 for x.

# 1.1.0

### Minor

- Signature generation now includes racid.

- Private key size validation, closes #1.

## 1.0.0

### Major

Initial Release
