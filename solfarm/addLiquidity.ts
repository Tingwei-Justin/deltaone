import anchor from "@project-serum/anchor";
import { createAssociatedTokenAccount } from "@project-serum/associated-token";
import * as serumAssoToken from "@project-serum/associated-token";
import * as splToken from "@solana/spl-token";

import {
  FARM_PLATFORMS,
  getLendingFarmAccount,
  getLendingFarmProgramId,
  getLendingMarketAccount,
  getLendingProgramId,
  getOrcaVaultProgramId,
  getPriceFeedsForReserve,
  getReserveByName,
  getVaultProgramId,
  getVaultSerumVaultSigner,
} from "./config";
import { getFarmBySymbol } from "./farm";
import { getMultipleAccounts } from "./getMultipleAccounts";
import { farmIdl } from "./levFarm";
import {
  findLeveragedFarmAddress,
  findObligationVaultAddress,
  findUserFarmAddress,
  findUserFarmManagerAddress,
  findUserFarmObligationAddress,
} from "./levFarmUtils";
import { TOKENS } from "../utils/tokens";
export const addLiquidity = async (
  assetSymbol: any,
  reserveName: any,
  obligationIdx: string | number | anchor.BN | number[] | Uint8Array | Buffer,
  checkLpTokenAccount = false
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
    tulipTokenMint = new anchor.web3.PublicKey(TOKENS.TULIP.mintAddress),
    baseToken = farm.coins[0],
    quoteToken = farm.coins[1];

  const farmDetails = getStore("FarmStore").getFarm(farm.mintAddress);
  const {
    userFarmInfo,
    baseTokenTotal,
    quoteTokenTotal,
    needTakePnlCoin,
    needTakePnlPc,
  } = farmDetails || {};

  const [userFarmManager, nonce1] = await findUserFarmManagerAddress(
    provider.wallet.publicKey,
    new anchor.web3.PublicKey(getLendingFarmProgramId()),
    new anchor.BN(farm.marginIndex)
  );

  const [userFarm, nonce2] = await findUserFarmAddress(
    provider.wallet.publicKey,
    new anchor.web3.PublicKey(getLendingFarmProgramId()),
    new anchor.BN(0),
    new anchor.BN(farm.marginIndex)
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

  const [userObligationAcct1, obligationNonce] =
    await findUserFarmObligationAddress(
      provider.wallet.publicKey,
      userFarm,
      new anchor.web3.PublicKey(getLendingFarmProgramId()),
      new anchor.BN(obligationIdx) // userFarm has `numberOfObligations`, so we'll do `numberOfObligations + 1` here
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

  const serumMarketKey = new anchor.web3.PublicKey(
    getLendingFarmAccount(assetSymbol).serum_market
  );
  const serumMarketVaultSigner = new anchor.web3.PublicKey(
    getVaultSerumVaultSigner(assetSymbol)
  );
  // let openOrdersAccountFarm =  new anchor.web3.PublicKey(getLendingFarmAccount(assetSymbol).farm_open_orders);
  // const marketAccountInfo = await provider.connection.getAccountInfo(
  //     serumMarketKey
  // );

  let [obligationVaultAccount, obligationVaultNonce] =
    await findObligationVaultAddress(
      userFarm,
      new anchor.BN(obligationIdx), // userFarm has `numberOfObligations`, so we'll do `numberOfObligations + 1` here
      new anchor.web3.PublicKey(getLendingFarmProgramId())
    );

  const obligationLpTokenAccount = await createAssociatedTokenAccount(
    provider,
    obligationVaultAccount,
    new anchor.web3.PublicKey(farm.mintAddress)
  );

  const dexProgramId = new anchor.web3.PublicKey(
    getLendingFarmAccount(assetSymbol).serum_dex_program // lendingInfo -> farm -> accounts -> serumDexProgram
  );

  const txn = new anchor.web3.Transaction();

  if (checkLpTokenAccount) {
    const [obligationLPTokenAccountInfo] = await getMultipleAccounts(
      window.$web3,
      [obligationLpTokenAccount],
      commitment
    );

    if (!obligationLPTokenAccountInfo) {
      txn.add(
        await serumAssoToken.createAssociatedTokenAccount(
          provider.wallet.publicKey,
          obligationVaultAccount,
          new anchor.web3.PublicKey(farm.mintAddress)
        )
      );
    }
  }

  txn.add(
    vaultProgram.instruction.addLiquidityAddCollateral(
      new anchor.BN(obligationIdx),
      {
        accounts: {
          authority: provider.wallet.publicKey,
          userFarm: userFarm,
          leveragedFarm: leveragedFarm,
          liquidityProgramId: new anchor.web3.PublicKey(
            getLendingFarmAccount(assetSymbol).raydium_liquidity_program
          ),
          ammId: new anchor.web3.PublicKey(
            getLendingFarmAccount(assetSymbol).raydium_amm_id
          ),
          ammAuthority: new anchor.web3.PublicKey(
            getLendingFarmAccount(assetSymbol).raydium_amm_authority
          ),
          ammOpenOrders: new anchor.web3.PublicKey(
            getLendingFarmAccount(assetSymbol).raydium_amm_open_orders
          ),
          ammQuantitiesOrTargetOrders: new anchor.web3.PublicKey(
            getLendingFarmAccount(
              assetSymbol
            ).raydium_amm_quantities_or_target_orders
          ),
          lpMintAddress: new anchor.web3.PublicKey(
            getLendingFarmAccount(assetSymbol).raydium_lp_mint_address
          ),
          poolCoinTokenAccount: new anchor.web3.PublicKey(
            getLendingFarmAccount(assetSymbol).raydium_coin_token_account
          ),
          poolPcTokenAccount: new anchor.web3.PublicKey(
            getLendingFarmAccount(assetSymbol).raydium_pc_token_account
          ),
          poolWithdrawQueue: new anchor.web3.PublicKey(
            getLendingFarmAccount(assetSymbol).raydium_pool_withdraw_queue
          ),
          serumMarket: serumMarketKey,
          serumVaultSigner: serumMarketVaultSigner,
          tokenProgram: splToken.TOKEN_PROGRAM_ID,
          levFarmCoinTokenAccount: new anchor.web3.PublicKey(
            getLendingFarmAccount(assetSymbol).farm_base_token_account
          ),
          levFarmPcTokenAccount: new anchor.web3.PublicKey(
            getLendingFarmAccount(assetSymbol).farm_quote_token_account
          ),
          userLpTokenAccount: obligationLpTokenAccount,
          clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
          pythPriceAccount: new anchor.web3.PublicKey(
            getPriceFeedsForReserve(assetSymbol).price_account
          ),
          lendingMarketAccount: lendingMarketAccount,
          userFarmObligation: userObligationAcct1,
          derivedLendingMarketAuthority: derivedLendingMarketAuthority,
          lendingProgram: lendingProgramId,
          dexProgram: dexProgramId,
        },
      }
    )
  );

  return txn;
};
