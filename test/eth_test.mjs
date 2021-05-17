// @format
import test from "ava";
import EthCrypto from "eth-crypto";
import { readFileSync } from "fs";

import { send, txfactory, loadbin } from "../src/eth.mjs";

test("if binary is same as solcli bytecode", async t => {
  const bytecode = readFileSync("./dist/RugPullIndex.bin").toString();
  const abi = JSON.parse(readFileSync("./dist/RugPullIndex.abi"));

  const code = EthCrypto.txDataByCompiled(abi, bytecode, []);
  t.is(code, `0x${bytecode}`);
});

test("if deploy works", async t => {
  const path = "./dist/RugPullIndex.bin";
  const gasLimit = 150000;
  const gasPrice = 1;
  const nonce = 0;

  const privKey = readFileSync("./test/fixtures/keys")
    .toString()
    .trim();

  const ctrlVal =
    "0x5735667f4f633ac21d743288ea561eba48cb23db4992389dff1185b054b464e7";
  t.is(privKey, ctrlVal);
  t.truthy(privKey);
  const pubKey = EthCrypto.publicKeyByPrivateKey(privKey);
  t.truthy(pubKey);
  const address = EthCrypto.publicKey.toAddress(pubKey);
  t.truthy(address);

  const data = loadbin(path);
  const tx = txfactory(address, gasLimit, gasPrice, nonce, data);
  console.log(tx);
  t.truthy(tx);

  const signed = EthCrypto.signTransaction(tx, privKey);
  t.truthy(signed);

  const url = "http://127.0.0.1:8545";
  const res = await send(url, signed);
  console.log(await res.json());
});
