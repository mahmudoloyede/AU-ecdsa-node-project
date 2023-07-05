const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const {utf8ToBytes} = require('ethereum-cryptography/utils');
const {keccak256} = require('ethereum-cryptography/keccak');
const { secp256k1 } = require('ethereum-cryptography/secp256k1');

app.use(cors());
app.use(express.json());

const balances = {
  "0300d0008ffa416f985bb429c27d7dd6c5a5a026be1928708a4d2198bdb876c2ed": 100,
  "034f8cd2d4a4b6386f0eee069c3756bb3fa88960a7c60e785b4f8ff587f8522aa6": 50,
  "02c782a5ee0aa18ae900876eac2840f9d4ff8600a0647090df518d03b9d32f247f": 75,
  "023bd53fe958f436e111aa827acd9ff9da5b99ad8a1faed6d96186dc5ccd98048f": 200
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

app.post("/send", (req, res) => {
  const { sender, recipient, amount, signature } = req.body;

  setInitialBalance(sender);
  setInitialBalance(recipient);

  const bytes = utf8ToBytes(amount);
  const hash = keccak256(bytes);
  let amt = parseInt(amount);
  if (secp256k1.verify(signature, hash, sender)){
    if (balances[sender] < amount) {
      res.status(400).send({ message: "Not enough funds!" });
    } else {
      balances[sender] -= amt;
      balances[recipient] += amt;
      res.send({ balance: balances[sender] });
    }
  } else {
    res.status(404).send({message: "Invalid Signature"});
  }

});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
