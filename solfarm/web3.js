import { delay } from "lodash";

// Bulk transactions
export async function signAllTransactions(
  connection,
  wallet,
  transactions,
  signers = [],
  extraSigners = []
) {
  // let blockHashses = [];
  const recentBlockhash = (await connection.getRecentBlockhash("confirmed"))
    .blockhash;

  const finalTransactions = [];
  transactions.forEach((transaction, index) => {
    if (transaction.instructions.length > 0) {
      transaction.recentBlockhash = recentBlockhash;
      transaction.setSigners(
        wallet.publicKey,
        ...signers.map((s) => s.publicKey)
      );

      if (extraSigners[index].length > 0) {
        const extraSigner = extraSigners[index]; // todo(therealssj): fix this
        transaction.setSigners(
          wallet.publicKey,
          ...extraSigner.map((s) => s.publicKey)
        );
        transaction.partialSign(...extraSigner);
      }

      if (signers.length > 0) {
        transaction.partialSign(...signers);
      }

      finalTransactions.push(transaction);
    }
  });

  return await wallet.signAllTransactions(finalTransactions);
}

export async function sendAllTransactions(
  connection,
  wallet,
  transactions,
  signers,
  extraSigners
) {
  const signedTransactions = await signAllTransactions(
    connection,
    wallet,
    transactions,
    signers,
    extraSigners
  );
  return await sendAllSignedTransactions(connection, signedTransactions);
}

export async function sendAllSignedTransactions(
  connection,
  signedTransactions
) {
  const transactions = [];

  for (let signedTransaction of signedTransactions) {
    const rawTransaction = signedTransaction.serialize();
    const txId = await connection.sendRawTransaction(rawTransaction, {
      skipPreflight: true,
      preflightCommitment: "confirmed",
    });

    console.log("Sending transaction ID:", txId);

    transactions.push(txId);
    await delay(2000);

    const signatureStatus = await window.$web3.getSignatureStatus(txId, {
      searchTransactionHistory: true,
    });

    if (signatureStatus.value?.err) {
      throw new Error("Transaction not completed successfully. Please retry.");
    }
  }

  return transactions;
}
