import { struct } from "buffer-layout";
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
