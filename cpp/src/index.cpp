#include "./ecdsa.cpp"


// Get location of variables in memory.
unsigned char *get_ptr(int x) {
    unsigned char* ptr;
    switch(x) {
        case 0:
            ptr = r;
        break;
        case 1:
            ptr = s;
        break;
        case 2:
            ptr = private_key;
        break;
        case 3:
            ptr = sha256_data;
        break;
        case 4:
            ptr = public_key;
        break;
        default:
            ptr = racid;
        break;
    }
    return ptr;
}

// Generates EDCSA signature for secp256k1.
void sign_hash() {
    initialize_secp256k1();
    deterministically_generate_k(sha256_data, private_key);
    terminate_secp256k1();
}

// Genrates compressed public key (x-coordinate) from private key.
void get_public_key() {
    initialize_secp256k1();
    bigint num;
    bigint_init(&num);
    array_to_bigint(num, private_key, 32);

    if (bigint_cmp(&n, &num) < 0) return;
    coordinates G = { x,y };
    coordinates R = double_and_add(G, num);
    // if y coordinate is odd prefix it with 3 else 2.
    if (is_odd(&R.y)) public_key[0] = 3;
    else public_key[0] = 2;

    unsigned char* x = &public_key[1];
    bigint_to_unsigned_char(x, R.x, 32);
    terminate_secp256k1();
    bigint_free(&num);
}
