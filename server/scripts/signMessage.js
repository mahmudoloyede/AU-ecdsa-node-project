// Sign an int(amount to be transfered) using a private key both passed in as args.
const {utf8ToBytes, toHex} = require('ethereum-cryptography/utils');
const {keccak256} = require('ethereum-cryptography/keccak');
const { secp256k1 } = require('ethereum-cryptography/secp256k1');

function signMessage(message, privateKey) {
  const bytes = utf8ToBytes(message);
  const hash = keccak256(bytes);
  return secp256k1.sign(hash, privateKey).toCompactHex();
}

const [message, privateKey] = process.argv.slice(-2);
console.log(signMessage(message, privateKey));

