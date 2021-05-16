// @format
import { readFileSync } from "fs";
import fetch from "cross-fetch";

const id = 1;

export function txfactory(from, gasLimit, gasPrice, nonce, data) {
  return {
    from,
    gasLimit,
    gasPrice,
    nonce,
    data
  };
}

export function loadbin(path) {
  return `0x${readFileSync(path)}`;
}

export async function send(url, tx) {
  const body = {
    method: "eth_sendRawTransaction",
    id,
    jsonrpc: "2.0",
    params: [`0x${tx}`]
  };

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(body)
  });
}
