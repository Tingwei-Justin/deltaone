import anchor from "@project-serum/anchor";
import * as serumAssoToken from "@project-serum/associated-token";

import { getLendingFarmProgramId, TOKENS } from "./config";
import { getFarmBySymbol } from "./farm";
import { getMultipleAccounts } from "./getMultipleAccounts";
import {
  findObligationVaultAddress,
  findUserFarmAddress,
} from "./levFarmUtils";
export const createUserAccounts = async (
  assetSymbol: string,
  obligationIdx: string | number | anchor.BN | Buffer | Uint8Array | number[]
) => {
  const { wallet, isMintAddressExisting } = getStore("WalletStore"),
    walletToInitialize = {
      signTransaction: wallet.signTransaction,
      signAllTransactions: wallet.signAllTransactions,
      publicKey: new anchor.web3.PublicKey(wallet.publicKey.toBase58()),
    },
    provider = new anchor.Provider(window.$web3, walletToInitialize, {
      skipPreflight: true,
      preflightCommitment: commitment,
    }),
    tulipTokenMint = new anchor.web3.PublicKey(TOKENS.TULIP.mintAddress),
    farm = getFarmBySymbol(assetSymbol),
    baseToken = farm.coins[0], // base / coin
    quoteToken = farm.coins[1]; // quote / pc

  anchor.setProvider(provider);

  const [userFarm, nonce2] = await findUserFarmAddress(
    provider.wallet.publicKey,
    new anchor.web3.PublicKey(getLendingFarmProgramId()), // lending_info.json -> programs -> farm -> id
    new anchor.BN(0),
    new anchor.BN(farm.marginIndex)
  );

  const [obligationVaultAccount, obligationVaultNonce] =
    await findObligationVaultAddress(
      userFarm,
      new anchor.BN(obligationIdx), // userFarm has `numberOfObligations`, so we'll do `numberOfObligations + 1` here
      new anchor.web3.PublicKey(getLendingFarmProgramId())
    );

  const obligationLPTokenAccount =
    await serumAssoToken.getAssociatedTokenAddress(
      obligationVaultAccount,
      new anchor.web3.PublicKey(farm.mintAddress)
    );

  const [obligationLPTokenAccountInfo] = await getMultipleAccounts(
    window.$web3,
    [obligationLPTokenAccount],
    commitment
  );

  const txn = new anchor.web3.Transaction();

  if (!obligationLPTokenAccountInfo) {
    txn.add(
      // userFarmManagerLpTokenAccount
      await serumAssoToken.createAssociatedTokenAccount(
        provider.wallet.publicKey,
        obligationVaultAccount,
        new anchor.web3.PublicKey(farm.mintAddress)
      )
    );
  }

  if (
    baseToken.symbol !== "SOL" &&
    !isMintAddressExisting(baseToken.mintAddress)
  ) {
    txn.add(
      await serumAssoToken.createAssociatedTokenAccount(
        // who will pay for the account creation
        wallet.publicKey,

        // who is the account getting created for
        wallet.publicKey,

        // what mint address token is being created
        new anchor.web3.PublicKey(baseToken.mintAddress)
      )
    );
  }

  if (
    quoteToken.symbol !== "SOL" &&
    !isMintAddressExisting(quoteToken.mintAddress)
  ) {
    txn.add(
      await serumAssoToken.createAssociatedTokenAccount(
        // who will pay for the account creation
        wallet.publicKey,

        // who is the account getting created for
        wallet.publicKey,

        // what mint address token is being created
        new anchor.web3.PublicKey(quoteToken.mintAddress)
      )
    );
  }

  return txn;
};
