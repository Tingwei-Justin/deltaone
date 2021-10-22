import { Struct, struct } from "superstruct";
import { List, slice } from "lodash";
import { getMultipleAccounts } from "./getMultipleAccounts";
import * as anchor from "@project-serum/anchor";
import { Commitment, PublicKey } from "@solana/web3.js";
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

function jsonRpcResultAndContext(resultDescription: Struct) {
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
export async function getMultipleAccountsGrouped(
    connection: anchor.web3.Connection,
    publicKeyGroupedArray: any[],
    commitment: Commitment
) {
    let dataToFetch: any[] = [],
        responseToReturn: ({
            publicKey: any;
            account: { executable: any; owner: PublicKey; lamports: any; data: Buffer };
        } | null)[][] = [];

    publicKeyGroupedArray.forEach(publicKeyArray => {
        dataToFetch = dataToFetch.concat(publicKeyArray);
    });
    let dataFetched: List<any> | null | undefined = [];
    dataFetched = await getMultipleAccounts(connection, dataToFetch, commitment);

    let lastIndex = 0;

    publicKeyGroupedArray.forEach((publicKeyArray: string | any[]) => {
        responseToReturn.push(slice(dataFetched, lastIndex, lastIndex + publicKeyArray.length));

        lastIndex += publicKeyArray.length;
    });

    return responseToReturn;
}
