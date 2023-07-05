// Generate private key to be used to generate signature and public key that acts as wallet address
const secp = require("ethereum-cryptography/secp256k1");
const {toHex} = require("ethereum-cryptography/utils");



const privateKey = secp.secp256k1.utils.randomPrivateKey()
console.log('Private Key:',toHex(privateKey));

const publicKey = secp.secp256k1.getPublicKey(privateKey);
console.log('Public Key:',toHex(publicKey));

