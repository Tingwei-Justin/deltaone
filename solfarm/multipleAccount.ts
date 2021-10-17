import { struct } from "buffer-layout";
import { slice } from "lodash";
import { getMultipleAccounts } from "./getMultipleAccounts";
function jsonRpcResult(resultDescription: { context: any; value: any }) {
  const jsonRpcVersion = struct.literal("2.0");

  return struct.union([
    struct({
      jsonrpc: jsonRpcVersion,
      id: "string",
      error: "any",
    }),
    struct({
      jsonrpc: jsonRpcVersion,
      id: "string",
      error: "null?",
      result: resultDescription,
    }),
  ]);
}

function jsonRpcResultAndContext(resultDescription) {
  return jsonRpcResult({
    context: struct({
      slot: "number",
    }),
    value: resultDescription,
  });
}

export const AccountInfoResult = struct({
  executable: "boolean",
  owner: "string",
  lamports: "number",
  data: "any",
  rentEpoch: "number?",
});

export const GetMultipleAccountsAndContextRpcResult = jsonRpcResultAndContext(
  struct.array([struct.union(["null", AccountInfoResult])])
);

/**
 * Get multiple accounts for grouped public keys (in arrays).
 *
 * @param {Object} connection - web3 connection
 * @param {Array[]} publicKeyGroupedArray - Array of array of public keys
 * @param {String} commitment
 *
 * @returns {Array[]}
 */
 export async function getMultipleAccountsGrouped(connection, publicKeyGroupedArray, commitment) {
  let dataToFetch = [],
    responseToReturn = [];

  publicKeyGroupedArray.forEach((publicKeyArray) => {
    dataToFetch = dataToFetch.concat(publicKeyArray);
  });

  const dataFetched = await getMultipleAccounts(connection, dataToFetch, commitment);

  let lastIndex = 0;

  publicKeyGroupedArray.forEach((publicKeyArray) => {
    responseToReturn.push(
      slice(dataFetched, lastIndex, lastIndex + publicKeyArray.length)
    );

    lastIndex += publicKeyArray.length;
  });

  return responseToReturn;
}