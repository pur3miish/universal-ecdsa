#include "./bigint.c"
#include "hmac-sha256/hmac-sha256.h"
#include "sha256/sha256.h"


unsigned char private_key[32] = {};
unsigned char public_key[33] = {};
unsigned char sha256_data[32] = {};
unsigned char r[32];
unsigned char s[32];
// constants used in the digital signature.
static bigint zero, one,two, mod, x, y, n, b, a, h, n_half, two_fifty_six;
static char buf[65536];

// Struct for storing ECC coordinates.
typedef struct {
    bigint x;
    bigint y;
} coordinates;
// Determines if big integer is odd number.
int is_odd(bigint* k) {
    bigint_write(buf, sizeof(buf), k);
    return buf[strlen(buf) - 1] & 1;
}
// Modulus operation.
void get_mod(bigint& dst, bigint& val, bigint& mod) 
{
    bigint_mod(&dst, &val, &mod);
    bigint_add(&dst, &dst, &mod);
    bigint_mod(&dst, &dst, &mod);
};
// Modular multiplicative inverse.
void mul_inverse(bigint& dst, bigint& val, bigint& mod) 
{
    bigint a, b, b0, t, q, x0, x1;
    bigint_init(&a);
    bigint_init(&b);
    bigint_init(&b0);
    bigint_init(&t);
    bigint_init(&q);
    bigint_init(&x0);
    bigint_init(&x1);
    bigint_cpy(&b, &mod);
    get_mod(a, val, b); // Take mod of val and store value in a.
    bigint_cpy(&b0, &b); // Set b0 = mod.
    bigint_from_int(&x0, 0);
    bigint_from_int(&x1, 1);
    
    if (bigint_cmp(&mod, &one) == 0) bigint_from_int(&dst, 1);
    else {
        while (bigint_cmp(&a, &one) > 0) {
            bigint_div(&q, &a, &b);
            bigint_cpy(&t, &b);
            bigint_mod(&dst, &a, &b);
            bigint_cpy(&b, &dst);            
            bigint_cpy(&a, &t);
            bigint_cpy(&t, &x0);
            bigint_mul(&q, &x0, &q);
            bigint_sub(&x0, &x1, &q);
            bigint_cpy(&x1, &t);
        }
    }

    if (bigint_cmp(&x1, &zero) < 0) bigint_add(&x1, &x1, &b0);
    bigint_cpy(&dst, &x1);

    bigint_free(&a);
    bigint_free(&b);
    bigint_free(&b0);
    bigint_free(&t);
    bigint_free(&q);
    bigint_free(&x0);
    bigint_free(&x1);
}
// Pre allocates memory and sets all the constant for secp256k1 signature generation.
void initialize_secp256k1() {
    bigint_init(&zero);
    bigint_init(&one);
    bigint_init(&two);
    bigint_init(&a);
    bigint_init(&b);
    bigint_init(&h);
    bigint_init(&x);
    bigint_init(&y);
    bigint_init(&mod);
    bigint_init(&n);
    bigint_init(&n_half);
    bigint_init(&two_fifty_six);

    bigint_from_int(&zero, 0);
    bigint_from_int(&one, 1);
    bigint_from_int(&two, 2);
    bigint_from_int(&a, 0);
    bigint_from_int(&b, 7);
    bigint_from_int(&h, 1);
    bigint_from_int(&two_fifty_six, 256);
    bigint_from_str(&x, "55066263022277343669578718895168534326250603453777594175500187360389116729240");
    bigint_from_str(&y, "32670510020758816978083085130507043184471273380659243275938904335757337482424");
    bigint_from_str(&mod, "115792089237316195423570985008687907853269984665640564039457584007908834671663");
    bigint_from_str(&n, "115792089237316195423570985008687907852837564279074904382605163141518161494337");
    bigint_from_str(&n_half, "57896044618658097711785492504343953926418782139537452191302581570759080747168");
}
// Frees all the allocated big int memory.
void terminate_secp256k1() {
    bigint_free(&zero);
    bigint_free(&one);
    bigint_free(&two);
    bigint_free(&a);
    bigint_free(&b);
    bigint_free(&h);
    bigint_free(&x);
    bigint_free(&y);
    bigint_free(&mod);
    bigint_free(&n);
    bigint_free(&n_half);
    bigint_free(&two_fifty_six);
}
// Calculates a new point on the curve.
void calc_new_point(coordinates& R, coordinates& Q, coordinates& P, bigint& λ)
{
    bigint_mul(&R.x, &λ, &λ);
    get_mod(R.x,R.x,mod);
    bigint_sub(&R.x, &R.x, &P.x);
    bigint_sub(&R.x, &R.x, &Q.x);
    get_mod(R.x, R.x, mod);
    
    bigint_sub(&R.y, &P.x, &R.x);
    bigint_mul(&R.y, &R.y, &λ);
    get_mod(R.y, R.y, mod);
    bigint_sub(&R.y, &R.y, &P.y);
    get_mod(R.y, R.y, mod);
}
// ECC point addition.
void add(coordinates& R, coordinates& Q, coordinates& P) 
{
    bigint x1, y1;
    bigint_init(&x1);
    bigint_init(&y1);
    bigint_sub(&x1, &P.x, &Q.x);
    mul_inverse(x1, x1, mod);
    
    bigint_sub(&y1, &P.y, &Q.y);
    get_mod(y1, y1, mod);
    bigint_mul(&y1, &y1, &x1);
    get_mod(y1, y1, mod); // slope

    calc_new_point(R, Q, P, y1);

    bigint_free(&x1);
    bigint_free(&y1);
}
coordinates add(coordinates& Q, coordinates& P) {
    coordinates R = {};
    add(R, Q, P);
    return R;
}

// ECC point doubling.
void dbl(coordinates& R, coordinates& G) 
{
    bigint numerator, three, denominator;
    bigint_init(&three);
    bigint_init(&numerator);
    bigint_init(&denominator);

    bigint_from_int(&three, 3);
    bigint_mul(&numerator, &G.x, &G.x);
    get_mod(numerator, numerator, mod);
    bigint_mul(&numerator, &numerator, &three);
    get_mod(numerator, numerator, mod);
    
    bigint_mul(&denominator, &two, &G.y);
    mul_inverse(denominator, denominator, mod);

    bigint_mul(&denominator, &denominator, &numerator);
    get_mod(denominator, denominator, mod);
    calc_new_point(R,G,G,denominator);

    bigint_free(&numerator);
    bigint_free(&denominator);
    bigint_free(&three);
}
coordinates dbl(coordinates& G) {
    coordinates R = {};
    dbl(R, G);
    return R;
}
// Recursive function for ECC point multiplication.
coordinates double_and_add(coordinates G, bigint& k) {
    if (bigint_cmp(&k, &one) == 0) return G;
    else if(is_odd(&k)) {
        bigint_sub(&k, &k, &one);
        coordinates P = double_and_add(G, k);
        return add(P, G);
    } else {
        bigint_div(&k, &k, &two);
        return double_and_add(dbl(G), k);
    }
}
// checks is the coordinate Q is point at {0,0}.
int isInfinity(coordinates Q) 
{
    return bigint_cmp(&Q.x, &zero) == 0 && bigint_cmp(&Q.y, &zero) == 0 ? 1 : 0;
}
// performs a sha256 message digest on msg.
void digest(uint8_t msg[], uint8_t* msg_digest, size_t msg_length) 
{
    sha256_t ctx;    
    sha256_init (&ctx);
    sha256_update (&ctx, msg, msg_length);
    sha256_final (&ctx, msg_digest);
}

void array_to_bigint(bigint &dst, uint8_t* arr, size_t length) {
    bigint acc, tfs;
    bigint_init(&acc);
    bigint_init(&tfs);
    bigint_from_int(&acc, 0);
    bigint_from_int(&tfs, 256);

    for (int i = 0; i < length; i++) {
        bigint x,x2;
        bigint_init(&x);
        bigint_init(&x2);
        bigint_from_int(&x, arr[i]);
        bigint_pow_word(&x2, &tfs, length - i - 1);
        bigint_mul(&x, &x, &x2);
        bigint_add(&acc, &x, &acc);
        bigint_free(&x);
        bigint_free(&x2);
    }
    bigint_cpy(&dst, &acc);

    bigint_free(&acc);
    bigint_free(&tfs);
}

// Convert a bigint to unsiged char array.
void bigint_to_unsigned_char(unsigned char* dst, bigint& num, size_t length = 32) {
    bigint val, acc;
    bigint_init(&acc);
    bigint_init(&val);
    bigint_cpy(&val, &num);

    for(int i = length; i > 0; i--) {
        bigint_mod(&acc, &val, &two_fifty_six);
        bigint_write(buf, sizeof(buf), &acc);
        dst[i-1] = atoi(buf);
        bigint_div(&val, &val, &two_fifty_six);
    }
    bigint_free(&acc);
    bigint_free(&val);
}

// validates signature and sets r, s value if a valid signature. returns 1 if is invalid.
int validate_signature(bigint& T, bigint& e, bigint& d) {
    coordinates G = { x, y };

    bigint x1;
    bigint_init(&x1);
    bigint_sub(&x1, &T, &n);
    int invalid = bigint_cmp(&x1, &zero) >= 0 || bigint_cmp(&zero, &T) >= 0;
    bigint_free(&x1);
    if (invalid) return 1;

    bigint val;
    bigint_init(&val);
    bigint_cpy(&val, &T);
    coordinates Q = double_and_add(G, val); 
    if (isInfinity(Q)) return 1;

    bigint_to_unsigned_char((unsigned char*)r, Q.x); // set r value.
    mul_inverse(val, T, n);
    bigint_mul(&Q.x, &Q.x, &d);
    bigint_add(&Q.x, &Q.x, &e);
    bigint_mul(&val, &val, &Q.x);
    get_mod(val, val, n); // val == s coordinate
    
    // Enforce low S values, see BIP62.    
    if (bigint_cmp(&val, &n_half) > 0) bigint_sub(&val, &n, &val);
    bigint_to_unsigned_char((unsigned char*)s, val); // set s value.
    bigint_free(&val);
    return 0;
}

// https://tools.ietf.org/html/rfc6979#section-3.2
void deterministically_generate_k(uint8_t* hash, uint8_t* private_key, int nonce = 0) {
    uint8_t msg_digest[32];
    if (nonce) {
        int nhsh_len = 32 + nonce; 
        uint8_t hash_nonce[nhsh_len];
        for (int i = 0; i < nhsh_len; i++) hash_nonce[i] = i < 32 ? hash[i] : 0;
        digest(hash_nonce, msg_digest, nhsh_len);    
    } else for (int i=0; i < 32; i++) msg_digest[i] = hash[i];

    uint8_t x[32];
    for (int i = 0; i < 32; i++) x[i] = private_key[i];
    // Step B
    uint8_t v[32];
    for(int i = 0; i < 32; i++) v[i] = 1;
    // Step C
    uint8_t k[32];
    for(int i = 0; i < 32; i++) k[i] = 0;
    // Step D
    uint8_t buff_d[97];
    for (int i = 0; i < 32; i++) buff_d[i] = v[i];
    buff_d[32] = 0;
    for (int i = 0; i < 32; i++) buff_d[33+i] = x[i];
    for (int i = 0; i < 32; i++) buff_d[65+i] = msg_digest[i];
    uint8_t buff_D[32];
    hmac_sha256(buff_D, buff_d, 97, k, 32);
    // Step E
    uint8_t buf_E[32];
    hmac_sha256(buf_E, v, 32, buff_D, 32);
    // Step F
    uint8_t buf_F[32];
    
    uint8_t buf_f[97];
    for (int i=0; i < 32; i++) buf_f[i] = buf_E[i];
    buf_f[32] = 1;
    for (int i = 0; i < 32; i++) buf_f[33+i] = x[i];
    for (int i = 0; i < 32; i++) buf_f[65+i] = msg_digest[i];
    hmac_sha256(buf_F, buf_f,97, buff_D, 32);
    // Step G
    uint8_t buf_G[32];
    hmac_sha256(buf_G, buf_E, 32, buf_F, 32);
     // Step H1/H2a, ignored as tlen === qlen (256 bit)
    // Step H2b
    uint8_t buf_h2b[32];
    hmac_sha256(buf_h2b, buf_G, 32, buf_F, 32);

    bigint T, e, d;
    bigint_init(&T);
    bigint_init(&e);
    bigint_init(&d);

    array_to_bigint(T, buf_h2b, 32);
    array_to_bigint(e, hash, 32);
    array_to_bigint(d, x, 32);


    while (validate_signature(T, e, d)) {
        uint8_t buf_k[32];
        uint8_t buf_pad_v[33];
        for(int i = 0; i < 32; i++) buf_pad_v[i] = buf_h2b[i];
        buf_pad_v[32] = 0;
        hmac_sha256(buf_k, buf_pad_v, 33, buf_F, 32);
        uint8_t bufv[32];
        hmac_sha256(bufv, buf_h2b, 32, buf_k, 32);
        // Step H1/H2a, again
        // Step H2b again
        uint8_t bufv2[32];
        hmac_sha256(bufv2, bufv, 32, buf_k, 32);
        array_to_bigint(T, bufv2, 32);
    }

    bigint_free(&T);
    bigint_free(&e);
    bigint_free(&d);

    if ((r[0] > 0x80) || (s[0] > 0x80)) deterministically_generate_k(hash, private_key, ++nonce);
}
