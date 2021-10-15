import anchor from "@project-serum/anchor";
import * as serum from "@project-serum/serum";
import * as splToken from "@solana/spl-token";

import {
  FARM_PLATFORMS,
  getLendingFarmAccount,
  getLendingFarmProgramId,
  getLendingMarketAccount,
  getLendingProgramId,
  getOrcaFarmPoolCoinTokenaccount,
  getOrcaFarmPoolPcTokenaccount,
  getOrcaLpMintAddress,
  getOrcaVaultProgramId,
  getReserveByName,
  getVaultProgramId,
  getVaultSerumVaultSigner,
} from "./config";
import { getFarmBySymbol } from "./farm";
import { findLeveragedFarmAddress, findUserFarmAddress } from "./levFarmUtils";
export const swapTokens = async (
  assetSymbol: string,
  reserveName: string,
  obligationIdx: string | number | anchor.BN | Buffer | Uint8Array | number[]
) => {
  const { wallet, tokenAccounts } = getStore("WalletStore"),
    walletToInitialize = {
      signTransaction: wallet.signTransaction,
      signAllTransactions: wallet.signAllTransactions,
      publicKey: new anchor.web3.PublicKey(wallet.publicKey.toBase58()),
    },
    provider = new anchor.Provider(window.$web3, walletToInitialize, {
      skipPreflight: true,
      preflightCommitment: commitment,
    });

  anchor.setProvider(provider);

  // Address of the deployed program.
  const vaultProgramId = new anchor.web3.PublicKey(getLendingFarmProgramId());
  // Generate the program client from IDL.
  const vaultProgram = new anchor.Program(farmIdl, vaultProgramId);

  const farm = getFarmBySymbol(assetSymbol),
    reserve = getReserveByName(reserveName),
    baseToken = farm.coins[0],
    quoteToken = farm.coins[1];

  const farmDetails = getStore("FarmStore").getFarm(farm.mintAddress);
  const { userFarmInfo } = farmDetails || {};

  const [userFarm, nonce2] = await findUserFarmAddress(
    provider.wallet.publicKey,
    new anchor.web3.PublicKey(getLendingFarmProgramId()),
    new anchor.BN(0),
    new anchor.BN(farm.marginIndex)
  );

  let serumMarketKey = new anchor.web3.PublicKey(
    getLendingFarmAccount(assetSymbol).serum_market
  );
  let serumMarketVaultSigner = new anchor.web3.PublicKey(
    getVaultSerumVaultSigner(assetSymbol)
  );
  let openOrdersAccountFarm = new anchor.web3.PublicKey(
    getLendingFarmAccount(assetSymbol).farm_open_orders
  );
  let marketAccountInfo = await provider.connection.getAccountInfo(
    serumMarketKey
  );
  let dexProgramId = new anchor.web3.PublicKey(
    getLendingFarmAccount(assetSymbol).serum_dex_program // lendingInfo -> farm -> accounts -> serumDexProgram
  );
  const decoded = await serum.Market.getLayout(dexProgramId).decode(
    marketAccountInfo.data
  );

  const [userObligationAcct1, obligationNonce] =
    await findUserFarmObligationAddress(
      provider.wallet.publicKey,
      userFarm,
      new anchor.web3.PublicKey(getLendingFarmProgramId()),
      new anchor.BN(obligationIdx) // userFarm has `numberOfObligations`, so we'll do `numberOfObligations + 1` here
    );

  const solfarmVaultProgramId = new anchor.web3.PublicKey(
    farm.platform === FARM_PLATFORMS.ORCA
      ? getOrcaVaultProgramId()
      : getVaultProgramId()
  );

  const [leveragedFarm] = await findLeveragedFarmAddress(
    solfarmVaultProgramId,
    new anchor.web3.PublicKey(getLendingFarmAccount(assetSymbol).serum_market),
    new anchor.web3.PublicKey(getLendingFarmProgramId()),
    new anchor.BN(farm.marginIndex)
  );

  const lendingProgramId = new anchor.web3.PublicKey(getLendingProgramId());

  const lendingMarketAccount = new anchor.web3.PublicKey(
    getLendingMarketAccount()
  );

  const [derivedLendingMarketAuthority, nonce] =
    await anchor.web3.PublicKey.findProgramAddress(
      [lendingMarketAccount.toBytes()],
      lendingProgramId
    );

  let requestQueue = decoded.requestQueue;
  let eventQueue = decoded.eventQueue;
  let marketBids = decoded.bids;
  let marketAsks = decoded.asks;
  let baseVault = decoded.baseVault;
  let quoteVault = decoded.quoteVault;

  if (farm.platform === FARM_PLATFORMS.ORCA) {
    baseVault = new anchor.web3.PublicKey(
      getOrcaFarmPoolCoinTokenaccount(assetSymbol)
    );
    quoteVault = new anchor.web3.PublicKey(
      getOrcaFarmPoolPcTokenaccount(assetSymbol)
    );
    requestQueue = new anchor.web3.PublicKey(
      "11111111111111111111111111111111"
    );
  }

  let marketAccountsBids = {
    market: serumMarketKey,
    requestQueue: requestQueue,
    eventQueue: eventQueue,
    bids: marketBids,
    asks: marketAsks,
    coinVault: baseVault,
    pcVault: quoteVault,
    vaultSigner: serumMarketVaultSigner,
    openOrders: openOrdersAccountFarm,
    orderPayerTokenAccount: new anchor.web3.PublicKey(
      getLendingFarmAccount(assetSymbol).farm_base_token_account
    ),
    coinWallet: new anchor.web3.PublicKey(
      getLendingFarmAccount(assetSymbol).farm_base_token_account
    ),
  };

  let remainingAccounts = [
    {
      isSigner: false,
      isWritable: true,
      pubkey: new anchor.web3.PublicKey(
        getLendingFarmAccount(assetSymbol).serum_fee_recipient
      ),
    },
    { pubkey: lendingMarketAccount, isWritable: true, isSigner: false },
    {
      pubkey: derivedLendingMarketAuthority,
      isWritable: true,
      isSigner: false,
    },
    { pubkey: lendingProgramId, isWritable: false, isSigner: false },
  ];

  let swapTokens;

  switch (farm.platform) {
    case FARM_PLATFORMS.RAYDIUM: {
      swapTokens = vaultProgram.transaction.swapTokensExperimental;

      break;
    }

    case FARM_PLATFORMS.ORCA: {
      swapTokens = vaultProgram.transaction.swapTokensAddCollateralSplTokenSwap;
      remainingAccounts.push({
        pubkey: new anchor.web3.PublicKey(getOrcaLpMintAddress(assetSymbol)),
        isWritable: true,
        isSigner: false,
      });
      break;
    }

    // Someday
    case FARM_PLATFORMS.SABER: {
      break;
    }
  }

  const txn = await swapTokens(new anchor.BN(obligationIdx), {
    accounts: {
      authority: provider.wallet.publicKey,
      leveragedFarm: leveragedFarm,
      userFarm: userFarm,
      userFarmObligation: userObligationAcct1,
      pcWallet: new anchor.web3.PublicKey(
        getLendingFarmAccount(assetSymbol).farm_quote_token_account
      ),
      market: marketAccountsBids,
      tokenProgram: splToken.TOKEN_PROGRAM_ID,
      rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      dexProgram: dexProgramId,
      vaultSigner: serumMarketVaultSigner,
    },
    remainingAccounts: remainingAccounts,
  });

  return txn;
};
