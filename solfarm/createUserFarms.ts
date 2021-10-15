import anchor from "@project-serum/anchor";
import * as serumAssoToken from "@project-serum/associated-token";
import { createAssociatedTokenAccount } from "@project-serum/associated-token";
import * as splToken from "@solana/spl-token";

import {
  FARM_PLATFORMS,
  getLendingFarmAccount,
  getLendingFarmManagementAccount,
  getLendingFarmProgramId,
  getLendingMarketAccount,
  getLendingProgramId,
  getOrcaVaultProgramId,
  getVaultProgramId,
} from "./config";
import { getFarmBySymbol } from "./farm";
import { getMultipleAccounts } from "./getMultipleAccounts";
import {
  findLeveragedFarmAddress,
  findObligationVaultAddress,
  findUserFarmAddress,
  findUserFarmObligationAddress,
} from "./levFarmUtils";
import { TOKENS } from "./tokens";
export const createUserFarm = async (
  assetSymbol: string,
  obligationIdx: number
) => {
  // console.log("obligation index", obligationIdx);
  const {
      wallet,
      tokenAccounts,
      isMintAddressExisting,
      hasTulipRewardPending,
    } = getStore("WalletStore"),
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
    quoteToken = farm.coins[1]; // quote / pc | @to-do: change coins[0] and coins[1] to baseToken and quoteToken
  anchor.setProvider(provider);

  // Address of the deployed program.
  const farmProgramId = new anchor.web3.PublicKey(getLendingFarmProgramId());
  // Generate the program client from IDL.
  const farmProgram = new anchor.Program(farmIdl, farmProgramId);

  const solfarmVaultProgramId = new anchor.web3.PublicKey(
    farm.platform === FARM_PLATFORMS.ORCA
      ? getOrcaVaultProgramId()
      : getVaultProgramId() // info.json -> programId
  );
  const lendingProgramId = new anchor.web3.PublicKey(
    getLendingProgramId() // lendingInfo -> programs -> lending -> id
  );

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
      farmProgramId
    );

  const [userObligationAcct1, obligationNonce] =
    await findUserFarmObligationAddress(
      provider.wallet.publicKey,
      userFarm,
      farmProgramId,
      new anchor.BN(obligationIdx) // userFarm has `numberOfObligations`, so we'll do `numberOfObligations + 1` here
    );

  const [leveragedFarm] = await findLeveragedFarmAddress(
    solfarmVaultProgramId,
    new anchor.web3.PublicKey(getLendingFarmAccount(assetSymbol).serum_market),
    farmProgramId,
    new anchor.BN(farm.marginIndex)
  );

  const obligationLPTokenAccount =
    await serumAssoToken.getAssociatedTokenAddress(
      obligationVaultAccount,
      new anchor.web3.PublicKey(farm.mintAddress)
    );

  const obligationTulipTokenAccount =
    await serumAssoToken.getAssociatedTokenAddress(
      obligationVaultAccount,
      tulipTokenMint
    );
  const [obligationLPTokenAccountInfo, obligationTulipTokenAccountInfo] =
    await getMultipleAccounts(
      window.$web3,
      [obligationLPTokenAccount, obligationTulipTokenAccount],
      commitment
    );

  const instructions = [];

  if (!obligationLPTokenAccountInfo) {
    instructions.push(
      await serumAssoToken.createAssociatedTokenAccount(
        provider.wallet.publicKey,
        obligationVaultAccount,
        new anchor.web3.PublicKey(farm.mintAddress)
      )
    );
  }

  if (!obligationTulipTokenAccountInfo) {
    instructions.push(
      await serumAssoToken.createAssociatedTokenAccount(
        provider.wallet.publicKey,
        obligationVaultAccount,
        tulipTokenMint
      )
    );
  }

  if (
    baseToken.symbol !== "SOL" &&
    !isMintAddressExisting(baseToken.mintAddress)
  ) {
    instructions.push(
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
    instructions.push(
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

  const tulipTokenAccount =
    tokenAccounts[TOKENS.TULIP.mintAddress]?.tokenAccountAddress;
  const derivedTulipTokenAccount = await createAssociatedTokenAccount(
    provider,
    provider.wallet.publicKey,
    new anchor.web3.PublicKey(TOKENS.TULIP.mintAddress)
  );
  const isTulipAssociatedAddress =
    tulipTokenAccount === derivedTulipTokenAccount.toBase58();
  const isTulipAuxillaryAddress =
    tulipTokenAccount && !isTulipAssociatedAddress;
  const shouldCreateTulipAssociatedAddress =
    baseToken.mintAddress !== TOKENS.TULIP.mintAddress
      ? !isTulipAssociatedAddress
      : isTulipAuxillaryAddress;

  if (shouldCreateTulipAssociatedAddress) {
    instructions.push(
      await serumAssoToken.createAssociatedTokenAccount(
        // who will pay for the account creation
        provider.wallet.publicKey,

        // who is the account getting created for
        provider.wallet.publicKey,

        // what mint address token is being created
        new anchor.web3.PublicKey(TOKENS.TULIP.mintAddress)
      )
    );
  }

  const createUserFarmAccounts = {
    authority: provider.wallet.publicKey,
    userFarm: userFarm,
    userFarmObligation: userObligationAcct1,
    lendingMarket: new anchor.web3.PublicKey(getLendingMarketAccount()), // `lendingMarketAccount` from `lending_info.json`
    global: new anchor.web3.PublicKey(getLendingFarmManagementAccount()), // lendingInfo -> farm -> managementAccount
    leveragedFarm: leveragedFarm, // use findLeveragedFarmAddress()
    clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
    rent: anchor.web3.SYSVAR_RENT_PUBKEY,
    systemProgram: new anchor.web3.PublicKey(
      "11111111111111111111111111111111"
    ),
    lendingProgram: lendingProgramId,
    tokenProgram: splToken.TOKEN_PROGRAM_ID,
    obligationVaultAddress: obligationVaultAccount,
  };

  // console.log("farm accounts", createUserFarmAccounts);
  const txn = await farmProgram.transaction.createUserFarm(
    solfarmVaultProgramId,
    {
      accounts: createUserFarmAccounts,
      instructions,
    }
  );

  return txn;
};
