import { Connection, PublicKey } from "@solana/web3.js";
import { get } from "lodash";

import { GetMultipleAccountsAndContextRpcResult } from "./multipleAccount";

export const getMultipleAccounts = async (
  connection?: Connection,
  publicKeys: any[],
  commitment: any
) => {
  if(!connection){
    return
  }
  const keys = [];
  let tempKeys = [];

  publicKeys.forEach((k) => {
    if (tempKeys.length >= 100) {
      keys.push(tempKeys);
      tempKeys = [];
    }
    tempKeys.push(k.toBase58());
  });

  if (tempKeys.length > 0) {
    keys.push(tempKeys);
  }

  const accounts = [];

  for (const key of keys) {
    const args = [key, { commitment }];

    // @ts-ignore
    const unsafeRes = await connection._rpcRequest("getMultipleAccounts", args);
    const res = GetMultipleAccountsAndContextRpcResult(unsafeRes);

    if (res.error) {
      console.error(
        "failed to get info about accounts " +
          publicKeys.map((k) => k.toBase58()).join(", ") +
          ": " +
          res.error.message
      );

      return;
    }

    // assert(typeof res.result !== 'undefined')

    for (const account of res.result.value) {
      let value = null;

      if (account === null) {
        accounts.push(null);
        continue;
      }

      if (res.result.value) {
        const { executable, owner, lamports, data } = account || {};

        // assert(data[1] === 'base64')

        value = {
          executable,
          owner: new PublicKey(owner),
          lamports,
          data: Buffer.from(data[0], "base64"),
        };
      }

      if (value === null) {
        console.error("Invalid response");
        return;
      }

      accounts.push(value);
    }
  }

  return accounts.map((account, idx) => {
    if (account === null) {
      return null;
    }

    return {
      publicKey: publicKeys[idx],
      account,
    };
  });
};
