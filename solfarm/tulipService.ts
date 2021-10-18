import anchor from "@project-serum/anchor";
import * as serumAssoToken from "@project-serum/associated-token";
import * as splToken from "@solana/spl-token";
import * as serum from "@project-serum/serum";
import { createAssociatedTokenAccount } from "@project-serum/associated-token";
import { Wallet } from "@project-serum/anchor"
import { findIndex } from "lodash"
import { FarmDetails } from "./types"
import FarmStore from "./stores/farmStore"
import PriceStore from "./stores/priceStore"
import { sendAllTransactions } from "./web3"
import { Commitment, Connection, PublicKey, SystemProgram } from '@solana/web3.js';
import { TOKENS } from "../utils/tokens"
import { getLendingFarmProgramId, FARM_PLATFORMS, getOrcaVaultProgramId, getVaultProgramId, getLendingProgramId, getLendingFarmAccount, getLendingMarketAccount, getLendingFarmManagementAccount, getReserveByName, getLendingReserve, getPriceFeedsForReserve, getVaultAccount, AQUAFARM_PROGRAM_ID, deriveVaultUserAccount, getFarmFusion, getFarmPoolAuthority, getFarmPoolId, getFarmPoolLpTokenAccount, getFarmPoolRewardATokenAccount, getFarmPoolRewardBTokenAccount, getFarmProgramId, getOrcaVaultAccount, getOrcaVaultConvertAuthority, getOrcaVaultFarmMint, getOrcaVaultGlobalBaseTokenVault, getOrcaVaultGlobalFarm, getOrcaVaultGlobalRewardTokenVault, getOrcaVaultLpMint, getOrcaVaultRewardMint, getVaultInfoAccount, getVaultOldInfoAccount, getVaultPdaAccount, getVaultRewardAccountA, getVaultRewardAccountB, getVaultTulipTokenAccount, getOrcaFarmPoolCoinTokenaccount, getOrcaFarmPoolPcTokenaccount, getOrcaLpMintAddress, getVaultSerumVaultSigner } from "./config"
import { getMultipleAccounts } from "./getMultipleAccounts"
import { farmIdl } from "./levFarm"
import { findUserFarmAddress, findObligationVaultAddress, findUserFarmObligationAddress, findLeveragedFarmAddress, findBorrowAuthorizer, findOrcaUserFarmAddress, findUserFarmManagerAddress } from "./levFarmUtils"
import { ACCOUNT_LAYOUT } from "../utils/layouts";
import { getFarmBySymbol } from "./farms/farm";

export const commitment: Commitment = "confirmed"

export default class TulipService{
    stores={}
    web3: Connection
    wallet: Wallet;
    constructor(wallet){
        this.stores={}
        this.wallet = wallet;
        this.web3 = this.createWeb3Instance("https://solana-api.projectserum.com")
        this.stores["PriceStore"] = new PriceStore()
        this.stores["FarmStore"] = new FarmStore(this.web3, this.stores["priceStore"])

    }
    createWeb3Instance = (endpoint) => {
        const web3 = new Connection(endpoint);
        return web3;
      }
    getStore = (storeName: string)=>{

        return this.stores[storeName]
    }

openMarginPosition = async (
    wallet: Wallet,
    assetSymbol: string,
    reserveName: string,
    baseTokenAmount: number,
    quoteTokenAmount: number,
    leverageValue: number,
    obligationIndex = -2
    ) => {
    const transactions = [];

    const farm = getFarmBySymbol(assetSymbol);
    if (farm === undefined) {
        return;
    }
    const farmDetails: FarmDetails = this.getStore("FarmStore").getFarm(
        farm.mintAddress
    );
    const { userFarmInfo } = farmDetails || {};
    const { obligations } = userFarmInfo || {};

    // TODO: What is this?
    let obligationIdx;
    if (obligationIndex !== -2) {
        obligationIdx = obligationIndex;
    } else {
        obligationIdx = findIndex(obligations, (obligation) => {
        return (
            obligation.positionState.hasOwnProperty("opening") ||
            obligation.positionState.hasOwnProperty("borrowed") ||
            obligation.positionState.hasOwnProperty("swapped") ||
            obligation.positionState.hasOwnProperty("addedLiquidity") ||
            obligation.positionState.hasOwnProperty("withdrawn") ||
            obligation.positionState.hasOwnProperty("exitingAndLiquidated")
        );
        });
    }

    let obligationPositionState = { opening: {} };
    if (obligationIdx !== -1) {
        obligationPositionState = obligations[obligationIdx].positionState;
    }

    const { isUserFarmValid } = farmDetails || {};
    let createAccounts = false;
    const extraSigners = [];

    if (!isUserFarmValid) {
        createAccounts = true;
        obligationIdx = 0;

        const createUserFarmManagerTxn = this.createUserFarm(assetSymbol, obligationIdx);
        transactions.push(createUserFarmManagerTxn);
        extraSigners.push([]);
    } else {
        if (
        obligations[obligationIdx].obligationAccount.toBase58() ===
        "11111111111111111111111111111111"
        ) {
        createAccounts = true;
        transactions.push(this.createUserFarmObligation(assetSymbol, obligationIdx));
        extraSigners.push([]);
        }
    }

    let obligationProgress = 0;
    if (
        obligationPositionState.hasOwnProperty("opening") ||
        obligationPositionState.hasOwnProperty("withdrawn") ||
        obligationPositionState.hasOwnProperty("exitingAndLiquidated")
    ) {
        obligationProgress = 1;
    } else if (obligationPositionState.hasOwnProperty("borrowed")) {
        obligationProgress = 2;
    } else if (obligationPositionState.hasOwnProperty("swapped")) {
        obligationProgress = 3;
    } else if (obligationPositionState.hasOwnProperty("addedLiquidity")) {
        obligationProgress = 4;
    }

    if (!createAccounts && obligationProgress < 4) {
        transactions.push(this.createUserAccounts(assetSymbol, obligationIdx));
        extraSigners.push([]);
    }
    if (obligationProgress > 0 && obligationProgress < 2) {
        const [depositBorrowTxn, signer] = await this.depositBorrow(
        assetSymbol,
        reserveName,
        baseTokenAmount,
        quoteTokenAmount,
        leverageValue,
        obligationIdx,
        createAccounts
        );
        transactions.push(depositBorrowTxn);
        extraSigners.push(signer);
    }

    if (obligationProgress > 0 && obligationProgress < 3) {
        transactions.push(this.swapTokens(assetSymbol, obligationIdx));
        extraSigners.push([]);
    }

    if (obligationProgress > 0 && obligationProgress < 4) {
        transactions.push(this.addLiquidity(assetSymbol,  obligationIdx));
        extraSigners.push([]);
    }

    if (obligationProgress > 0 && obligationProgress < 5) {
        transactions.push(
        this.depositMarginLpTokens(assetSymbol,  obligationIdx)
        );
        extraSigners.push([]);
    }

    const fulfilledTransactions = await Promise.all(transactions);
    return sendAllTransactions(
        this.web3,
        wallet,
        fulfilledTransactions,
        [],
        extraSigners
    );
};
createUserFarm = async (
  assetSymbol: string,
  obligationIdx: number
) => {
    const wallet = this.wallet,
    walletToInitialize = {
      signTransaction: wallet.signTransaction,
      signAllTransactions: wallet.signAllTransactions,
      publicKey: new anchor.web3.PublicKey(wallet.publicKey.toBase58()),
    },
    provider = new anchor.Provider(this.web3, walletToInitialize, {
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
  // @ts-ignore
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
      this.web3,
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
createUserAccounts = async (
  assetSymbol: string,
  obligationIdx: string | number | anchor.BN | Buffer | Uint8Array | number[]
) => {
    const wallet = this.wallet,
    walletToInitialize = {
      signTransaction: wallet.signTransaction,
      signAllTransactions: wallet.signAllTransactions,
      publicKey: new anchor.web3.PublicKey(wallet.publicKey.toBase58()),
    },
    provider = new anchor.Provider(this.web3, walletToInitialize, {
      skipPreflight: true,
      preflightCommitment: commitment,
    }),
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
    this.web3,
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


  return txn;
};
createUserFarmObligation = async (assetSymbol, obligationIdx) => {
  // console.log("obligation index", obligationIdx);
    const wallet = this.wallet,
    walletToInitialize = {
      signTransaction: wallet.signTransaction,
      signAllTransactions: wallet.signAllTransactions,
      publicKey: new anchor.web3.PublicKey(wallet.publicKey.toBase58()),
    },
    provider = new anchor.Provider(this.web3, walletToInitialize, {
      skipPreflight: true,
      preflightCommitment: commitment,
    }),
    tulipTokenMint = new anchor.web3.PublicKey(TOKENS.TULIP.mintAddress),
    farm = getFarmBySymbol(assetSymbol),
    baseToken = farm.coins[0],
    quoteToken = farm.coins[1];
  anchor.setProvider(provider);

  // Address of the deployed program.
  const farmProgramId = new anchor.web3.PublicKey(getLendingFarmProgramId());
  // Generate the program client from IDL.
  // @ts-ignore
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
      this.web3,
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

  const createUserFarmObligationAccounts = {
    authority: provider.wallet.publicKey,
    userFarm: userFarm,
    leveragedFarm: leveragedFarm, // use findLeveragedFarmAddress()
    userFarmObligation: userObligationAcct1,
    lendingMarket: new anchor.web3.PublicKey(getLendingMarketAccount()), // `lendingMarketAccount` from `lending_info.json`
    obligationVaultAddress: obligationVaultAccount,
    clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
    rent: anchor.web3.SYSVAR_RENT_PUBKEY,
    lendingProgram: lendingProgramId,
    tokenProgram: splToken.TOKEN_PROGRAM_ID,
    systemProgram: new anchor.web3.PublicKey(
      "11111111111111111111111111111111"
    ),
  };

  const txn = await farmProgram.transaction.createUserFarmObligation({
    accounts: createUserFarmObligationAccounts,
    instructions,
  });

  return txn;
};
depositBorrow = async (
  assetSymbol: any,
  reserveName: any,
  baseTokenAmount: number,
  quoteTokenAmount: number,
  leverageValue: number,
  obligationIdx: string | number | anchor.BN | number[] | Uint8Array | Buffer,
  createAccounts: any
) => {
    const wallet = this.wallet,
    walletToInitialize = {
      signTransaction: wallet.signTransaction,
      signAllTransactions: wallet.signAllTransactions,
      publicKey: new anchor.web3.PublicKey(wallet.publicKey.toBase58()),
    },
    provider = new anchor.Provider(this.web3, walletToInitialize, {
      skipPreflight: true,
      preflightCommitment: commitment,
    }),

    farm = getFarmBySymbol(assetSymbol),
    reserve = getReserveByName(reserveName),
    baseToken = farm.coins[0], // base / coin
    quoteToken = farm.coins[1]; // quote / pc | @to-do: change coins[0] and coins[1] to baseToken and quoteToken

  anchor.setProvider(provider);

  // console.log(tokenAccounts);
  // Address of the deployed program.
  const vaultProgramId = new anchor.web3.PublicKey(getLendingFarmProgramId());
  // Generate the program client from IDL.
  // @ts-ignore
  const vaultProgram = new anchor.Program(farmIdl, vaultProgramId);

  // console.log('farm.marginIndex', farm.marginIndex);

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


  const reserves = [
    new anchor.web3.PublicKey(reserve.account),
    // new anchor.web3.PublicKey(getLendingReserve(reserveNotBorrowing.symbol).account)
  ];

  const { getTokenPrice } = this.getStore("PriceStore");

  const baseTokenPrice = Number(getTokenPrice(baseToken.symbol)),
    quoteTokenPrice = Number(getTokenPrice(quoteToken.symbol)),
    reserveToBeBorrowedPrice = Number(getTokenPrice(reserve.name));
  // Send existing baseTokenAmount and quoteTokenAmount
  // Existing ($10) + New Deposit ($15 USDC) -> Borrow
  const liquidityToBorrow =
    ((leverageValue - 1) *
      (baseTokenAmount * baseTokenPrice + quoteTokenAmount * quoteTokenPrice)) /
    reserveToBeBorrowedPrice;

  const [borrowAuthorizer, borrowAuthorizerNonce] = await findBorrowAuthorizer(
    lendingMarketAccount,
    new anchor.web3.PublicKey(getLendingFarmProgramId())
  );

  const txn = new anchor.web3.Transaction();

  let coinSourceTokenAccount, pcSourceTokenAccount;
  let borrowMint = reserve.mintAddress;
  // eslint-disable-next-line prefer-const
  let signers = [];
  if (baseToken.symbol === "SOL") {
    const lamportsToCreateAccount =
      await this.web3.getMinimumBalanceForRentExemption(
        ACCOUNT_LAYOUT.span,
        commitment
      );

    const newAccount = new anchor.web3.Account();
    signers.push(newAccount);

    coinSourceTokenAccount = newAccount.publicKey;
    txn.add(
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: coinSourceTokenAccount,
        lamports:
          baseTokenAmount * Math.pow(10, baseToken.decimals) +
          lamportsToCreateAccount,
        space: ACCOUNT_LAYOUT.span,
        programId: splToken.TOKEN_PROGRAM_ID,
      })
    );

    txn.add(
      splToken.Token.createInitAccountInstruction(
        splToken.TOKEN_PROGRAM_ID,
        new PublicKey(TOKENS.WSOL.mintAddress),
        coinSourceTokenAccount,
        wallet.publicKey
      )
    );
  }

  if (quoteToken.symbol === "SOL") {
    const lamportsToCreateAccount =
      await this.web3.getMinimumBalanceForRentExemption(
        ACCOUNT_LAYOUT.span,
        commitment
      );

    const newAccount = new anchor.web3.Account();
    signers.push(newAccount);

    pcSourceTokenAccount = newAccount.publicKey;
    txn.add(
      SystemProgram.createAccount({
        fromPubkey: wallet.publicKey,
        newAccountPubkey: pcSourceTokenAccount,
        lamports:
          quoteTokenAmount * Math.pow(10, quoteToken.decimals) +
          lamportsToCreateAccount,
        space: ACCOUNT_LAYOUT.span,
        programId: splToken.TOKEN_PROGRAM_ID,
      })
    );

    txn.add(
      splToken.Token.createInitAccountInstruction(
        splToken.TOKEN_PROGRAM_ID,
        new PublicKey(TOKENS.WSOL.mintAddress),
        pcSourceTokenAccount,
        wallet.publicKey
      )
    );
  }

  if (borrowMint === "11111111111111111111111111111111") {
    borrowMint = "So11111111111111111111111111111111111111112";
  }

  const vaultAccount =
    farm.platform === FARM_PLATFORMS.ORCA
      ? getLendingFarmAccount(assetSymbol).vault_account
      : getVaultAccount(assetSymbol);

  txn.add(
    vaultProgram.instruction.depositBorrowZero(
      reserves,
      new anchor.BN(baseTokenAmount * Math.pow(10, baseToken.decimals)),
      new anchor.BN(quoteTokenAmount * Math.pow(10, quoteToken.decimals)),
      new anchor.BN(liquidityToBorrow * Math.pow(10, reserve.decimals)),
      new anchor.BN(obligationIdx),
      {
        accounts: {
          authority: provider.wallet.publicKey,
          userFarm: userFarm,
          leveragedFarm: leveragedFarm,
          userFarmObligation: userObligationAcct1,
          coinSourceTokenAccount,
          coinDestinationTokenAccount: new anchor.web3.PublicKey(
            getLendingFarmAccount(assetSymbol).farm_base_token_account
          ),
          coinDepositReserveAccount: new anchor.web3.PublicKey(
            getLendingReserve(baseToken.symbol).account
          ),
          pcSourceTokenAccount,
          pcDestinationTokenAccount: new anchor.web3.PublicKey(
            getLendingFarmAccount(assetSymbol).farm_quote_token_account
          ),
          pcDepositReserveAccount: new anchor.web3.PublicKey(
            getLendingReserve(quoteToken.symbol).account
          ),
          coinReserveLiquidityOracle: new anchor.web3.PublicKey(
            getPriceFeedsForReserve(baseToken.symbol).price_account
          ),
          pcReserveLiquidityOracle: new anchor.web3.PublicKey(
            getPriceFeedsForReserve(quoteToken.symbol).price_account
          ),
          lendingMarketAccount: lendingMarketAccount,
          derivedLendingMarketAuthority: derivedLendingMarketAuthority,
          clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
          tokenProgram: splToken.TOKEN_PROGRAM_ID,
          lendingProgram: lendingProgramId,
          sourceReserveLiquidityTokenAccount: new anchor.web3.PublicKey(
            getLendingReserve(reserveName).liquidity_supply_token_account
          ),
          borrowMint: new anchor.web3.PublicKey(borrowMint),
          reserveLiquidityFeeReceiver: new anchor.web3.PublicKey(
            getLendingReserve(reserveName).liquidity_fee_receiver
          ),
          borrowAuthorizer: borrowAuthorizer,
          lpPythPriceAccount: new anchor.web3.PublicKey(
            getPriceFeedsForReserve(assetSymbol).price_account
          ),
          vaultAccount: new anchor.web3.PublicKey(vaultAccount),
        },
        remainingAccounts: [
          {
            isSigner: false,
            isWritable: true,
            pubkey: new anchor.web3.PublicKey(
              getLendingReserve(reserveName).account
            ),
          },
          {
            isSigner: false,
            isWritable: false,
            pubkey: new anchor.web3.PublicKey(
              getPriceFeedsForReserve(reserveName).price_account
            ),
          },
          {
            isSigner: false,
            isWritable: true,
            pubkey: new anchor.web3.PublicKey(
              getLendingReserve(reserveName).account
            ),
          },
        ],
      }
    )
  );

  if (baseToken.symbol === "SOL") {
    txn.add(
      splToken.Token.createCloseAccountInstruction(
        splToken.TOKEN_PROGRAM_ID,
        coinSourceTokenAccount,
        wallet.publicKey,
        wallet.publicKey,
        []
      )
    );
  }

  if (quoteToken.symbol === "SOL") {
    txn.add(
      splToken.Token.createCloseAccountInstruction(
        splToken.TOKEN_PROGRAM_ID,
        pcSourceTokenAccount,
        wallet.publicKey,
        wallet.publicKey,
        []
      )
    );
  }

  return [txn, signers];
};
depositMarginLpTokens = async (
  assetSymbol: any,
  obligationIdx: string | number | anchor.BN | number[] | Uint8Array | Buffer
) => {
  const wallet = this.wallet,
    walletToInitialize = {
      signTransaction: wallet.signTransaction,
      signAllTransactions: wallet.signAllTransactions,
      publicKey: new anchor.web3.PublicKey(wallet.publicKey.toBase58()),
    },
    provider = new anchor.Provider(this.web3, walletToInitialize, {
      skipPreflight: true,
      preflightCommitment: commitment,
    });

  anchor.setProvider(provider);

  // Address of the deployed program.
  const vaultProgramId = new anchor.web3.PublicKey(getLendingFarmProgramId());
  // Generate the program client from IDL.
  // @ts-ignore
  const vaultProgram = new anchor.Program(farmIdl, vaultProgramId);

  const farm = getFarmBySymbol(assetSymbol),
    tulipTokenMint = new anchor.web3.PublicKey(TOKENS.TULIP.mintAddress);


  const [userFarm] = await findUserFarmAddress(
    provider.wallet.publicKey,
    new anchor.web3.PublicKey(getLendingFarmProgramId()), // lending_info.json -> programs -> farm -> id
    new anchor.BN(0),
    new anchor.BN(farm?.marginIndex)
  );

  const [obligationVaultAccount] = await findObligationVaultAddress(
    userFarm,
    new anchor.BN(obligationIdx), // userFarm has `numberOfObligations`, so we'll do `numberOfObligations + 1` here
    new anchor.web3.PublicKey(getLendingFarmProgramId())
  );

  const [userObligationAcct1] = await findUserFarmObligationAddress(
    provider.wallet.publicKey,
    userFarm,
    new anchor.web3.PublicKey(getLendingFarmProgramId()),
    new anchor.BN(obligationIdx) // userFarm has `numberOfObligations`, so we'll do `numberOfObligations + 1` here
  );

  // console.log("user farm: ", userFarm.toString());
  // console.log("user farm obligation (0): ", userObligationAcct1.toString());
  // console.log("user farm obligation (0) vault account: ", obligationVaultAccount.toString());

  const vaultAccount = new anchor.web3.PublicKey(getVaultAccount(assetSymbol));
  const vaultPdaAccount = new anchor.web3.PublicKey(
    getVaultPdaAccount(assetSymbol)
  );

  const solfarmVaultProgramId = new anchor.web3.PublicKey(
    farm?.platform === FARM_PLATFORMS.ORCA
      ? getOrcaVaultProgramId()
      : getVaultProgramId()
  );

  const lendingProgramId = new anchor.web3.PublicKey(getLendingProgramId());

  const [leveragedFarm] = await findLeveragedFarmAddress(
    solfarmVaultProgramId,
    new anchor.web3.PublicKey(getLendingFarmAccount(assetSymbol).serum_market),
    new anchor.web3.PublicKey(getLendingFarmProgramId()),
    new anchor.BN(farm?.marginIndex)
  );

  const lendingMarketAccount = new anchor.web3.PublicKey(
    getLendingMarketAccount()
  );

  const [derivedLendingMarketAuthority] =
    await anchor.web3.PublicKey.findProgramAddress(
      [lendingMarketAccount.toBytes()],
      lendingProgramId
    );

  const userFarmManagerLpTokenAccount = await createAssociatedTokenAccount(
    provider.wallet.publicKey,
    obligationVaultAccount,
    new anchor.web3.PublicKey(farm?.mintAddress)
  );

  let txn;

  switch (farm.platform) {
    case FARM_PLATFORMS.RAYDIUM: {
      const vaultInfoAccountPda = new anchor.web3.PublicKey(
        getVaultInfoAccount(assetSymbol)
      );

      const vaultLpTokenAccount = await createAssociatedTokenAccount(
        provider.wallet.publicKey,
        vaultPdaAccount,
        new anchor.web3.PublicKey(
          getLendingFarmAccount(assetSymbol).raydium_lp_mint_address
        )
      );

      const [userFarmManagerVaultBalanceAccount, nonce3] =
        await anchor.web3.PublicKey.findProgramAddress(
          [
            new anchor.web3.PublicKey(
              getVaultOldInfoAccount(assetSymbol)
            ).toBytes(),
            obligationVaultAccount.toBuffer(),
          ],
          solfarmVaultProgramId
        );
      const vaultBalanceNonce = nonce3;
      const [userFarmManagerVaultBalanceMetadataAccount, nonce4] =
        await anchor.web3.PublicKey.findProgramAddress(
          [
            userFarmManagerVaultBalanceAccount.toBuffer(),
            obligationVaultAccount.toBuffer(),
          ],
          solfarmVaultProgramId
        );
      const vaultMetaNonce = nonce4;

      const [userFarmManagerVaultTulipRewardAccount, vaultTulipRewardNonce] =
        await anchor.web3.PublicKey.findProgramAddress(
          [
            userFarmManagerVaultBalanceMetadataAccount.toBuffer(),
            obligationVaultAccount.toBuffer(),
          ],
          solfarmVaultProgramId
        );

      const userFarmManagerTulipAccount = await createAssociatedTokenAccount(
        provider.wallet.publicKey,
        obligationVaultAccount,
        tulipTokenMint
      );

      const instructions = [];

      instructions.push(
        vaultProgram.instruction.harvestTulips(
          {
            nonce: vaultBalanceNonce,
            metaNonce: vaultMetaNonce,
            rewardNonce: vaultTulipRewardNonce,
          },
          new anchor.BN(obligationIdx),
          {
            accounts: {
              authority: provider.wallet.publicKey,
              obligationVaultAddress: obligationVaultAccount,
              userFarm: userFarm,
              leveragedFarm: leveragedFarm,
              vaultProgram: solfarmVaultProgramId,
              vault: vaultAccount,
              vaultPdaAccount: vaultPdaAccount,
              userInfoAccount: vaultInfoAccountPda,
              userBalanceAccount: userFarmManagerVaultBalanceAccount,
              userTulipRewardMetadata: userFarmManagerVaultTulipRewardAccount,
              vaultTulipTokenAccount: new anchor.web3.PublicKey(
                getVaultTulipTokenAccount(assetSymbol)
              ),
              userTulipTokenAccount: userFarmManagerTulipAccount,
              tokenProgramId: splToken.TOKEN_PROGRAM_ID,
              clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
              rent: anchor.web3.SYSVAR_RENT_PUBKEY,
              systemProgram: new anchor.web3.PublicKey(
                "11111111111111111111111111111111"
              ),
            },
          }
        )
      );

      const depositAccounts = {
        authority: provider.wallet.publicKey,
        userFarm: userFarm,
        obligationVaultAddress: obligationVaultAccount,
        leveragedFarm: leveragedFarm,
        vaultProgram: solfarmVaultProgramId,
        vault: vaultAccount,
        lpTokenAccount: vaultLpTokenAccount,
        // todo(bonedaddy): set to the correct one
        authorityTokenAccount: userFarmManagerLpTokenAccount,
        // need to figure these out from raydium
        stakeProgramId: new anchor.web3.PublicKey(
          getFarmProgramId(assetSymbol)
        ),
        vaultPdaAccount: vaultPdaAccount,
        // need to figure these out from raydium
        poolId: new anchor.web3.PublicKey(getFarmPoolId(assetSymbol)),
        poolAuthority: new anchor.web3.PublicKey(
          getFarmPoolAuthority(assetSymbol)
        ),
        userInfoAccount: vaultInfoAccountPda,
        // userLpTokenAccount: vaultLpTokenAccount,
        poolLpTokenAccount: new anchor.web3.PublicKey(
          getFarmPoolLpTokenAccount(assetSymbol)
        ),
        // since this is for a non-fusion pool reward use the same address
        userRewardATokenAccount: new anchor.web3.PublicKey(
          getVaultRewardAccountA(assetSymbol)
        ),
        poolRewardATokenAccount: new anchor.web3.PublicKey(
          getFarmPoolRewardATokenAccount(assetSymbol)
        ),
        userRewardBTokenAccount: new anchor.web3.PublicKey(
          getVaultRewardAccountA(assetSymbol)
        ),
        poolRewardBTokenAccount: new anchor.web3.PublicKey(
          getFarmPoolRewardBTokenAccount(assetSymbol)
        ),
        userBalanceAccount: userFarmManagerVaultBalanceAccount,
        userBalanceMetadata: userFarmManagerVaultBalanceMetadataAccount,
        clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
        tokenProgramId: serum.TokenInstructions.TOKEN_PROGRAM_ID,
        systemProgram: new anchor.web3.PublicKey(
          "11111111111111111111111111111111"
        ),
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
      };

      if (getFarmFusion(assetSymbol)) {
        depositAccounts.userRewardBTokenAccount = new anchor.web3.PublicKey(
          getVaultRewardAccountB(assetSymbol)
        );
      }
      txn = await vaultProgram.transaction.depositVault(
        {
          nonce: vaultBalanceNonce,
          metaNonce: vaultMetaNonce,
        },
        new anchor.BN(obligationIdx),
        {
          accounts: depositAccounts,
          remainingAccounts: [
            { pubkey: lendingMarketAccount, isWritable: true, isSigner: false },
            { pubkey: userObligationAcct1, isWritable: true, isSigner: false },
            {
              pubkey: derivedLendingMarketAuthority,
              isWritable: true,
              isSigner: false,
            },
            { pubkey: lendingProgramId, isWritable: false, isSigner: false },
          ],
          instructions,
        }
      );

      break;
    }

    case FARM_PLATFORMS.ORCA: {
      const [orcaVaultUserAccountAddress, orcaVaultUserAccountNonce] =
        await deriveVaultUserAccount(
          new anchor.web3.PublicKey(getOrcaVaultAccount(assetSymbol)),
          obligationVaultAccount,
          solfarmVaultProgramId
        );

      const vaultBaseTokenAccount =
        await serumAssoToken.getAssociatedTokenAddress(
          vaultPdaAccount,
          new anchor.web3.PublicKey(getOrcaVaultLpMint(assetSymbol))
        );
      const vaultFarmTokenAccount =
        await serumAssoToken.getAssociatedTokenAddress(
          vaultPdaAccount,
          new anchor.web3.PublicKey(getOrcaVaultFarmMint(assetSymbol))
        );
      const vaultRewardTokenAccount =
        await serumAssoToken.getAssociatedTokenAddress(
          vaultPdaAccount,
          new anchor.web3.PublicKey(getOrcaVaultRewardMint(assetSymbol))
        );

      const orcaGlobalFarm = new anchor.web3.PublicKey(
        getOrcaVaultGlobalFarm(assetSymbol)
      );

      const [orcaUserFarm, _] = await findOrcaUserFarmAddress(
        orcaGlobalFarm,
        vaultPdaAccount,
        splToken.TOKEN_PROGRAM_ID,
        AQUAFARM_PROGRAM_ID
      );
      const depositAccounts = {
        authority: provider.wallet.publicKey,
        vaultAccount: vaultAccount,
        vaultUserAccount: orcaVaultUserAccountAddress,
        tokenProgram: serum.TokenInstructions.TOKEN_PROGRAM_ID,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        vaultPda: vaultPdaAccount,
        systemProgram: new anchor.web3.PublicKey(
          "11111111111111111111111111111111"
        ),
        userFarmOwner: vaultPdaAccount,
        userTransferAuthority: vaultPdaAccount,
        userBaseTokenAccount: vaultBaseTokenAccount,
        userFarmTokenAccount: vaultFarmTokenAccount,
        userRewardTokenAccount: vaultRewardTokenAccount,
        globalBaseTokenVault: new anchor.web3.PublicKey(
          getOrcaVaultGlobalBaseTokenVault(assetSymbol)
        ),
        farmTokenMint: new anchor.web3.PublicKey(
          getOrcaVaultFarmMint(assetSymbol)
        ),
        globalFarm: orcaGlobalFarm,
        orcaUserFarm: orcaUserFarm,
        globalRewardTokenVault: new anchor.web3.PublicKey(
          getOrcaVaultGlobalRewardTokenVault(assetSymbol)
        ),
        convertAuthority: new anchor.web3.PublicKey(
          getOrcaVaultConvertAuthority(assetSymbol)
        ),
        aquaFarmProgram: AQUAFARM_PROGRAM_ID,
        fundingTokenAccount: userFarmManagerLpTokenAccount,
        solfarmVaultProgram: solfarmVaultProgramId,
        leveragedFarm: leveragedFarm,
        clock: anchor.web3.SYSVAR_CLOCK_PUBKEY,
        obligationVaultAddress: obligationVaultAccount,
        leveragedUserFarm: userFarm,
      };

      // console.log("$$ orca accounts", depositAccounts);
      txn = await vaultProgram.transaction.depositOrcaVault(
        {
          accountNonce: orcaVaultUserAccountNonce,
        },
        new anchor.BN(obligationIdx),
        {
          accounts: depositAccounts,
          remainingAccounts: [
            { pubkey: lendingMarketAccount, isWritable: true, isSigner: false },
            { pubkey: userObligationAcct1, isWritable: true, isSigner: false },
            {
              pubkey: derivedLendingMarketAuthority,
              isWritable: true,
              isSigner: false,
            },
            { pubkey: lendingProgramId, isWritable: false, isSigner: false },
          ],
        }
      );

      break;
    }

    // Someday
    case FARM_PLATFORMS.SABER: {
      break;
    }
  }

  return txn;
};
swapTokens = async (
  assetSymbol: string,
  obligationIdx: string | number | anchor.BN | Buffer | Uint8Array | number[]
) => {
    const wallet = this.wallet,
    walletToInitialize = {
      signTransaction: wallet.signTransaction,
      signAllTransactions: wallet.signAllTransactions,
      publicKey: new anchor.web3.PublicKey(wallet.publicKey.toBase58()),
    },
    provider = new anchor.Provider(this.web3, walletToInitialize, {
      skipPreflight: true,
      preflightCommitment: commitment,
    });

  anchor.setProvider(provider);

  // Address of the deployed program.
  const vaultProgramId = new anchor.web3.PublicKey(getLendingFarmProgramId());
  // Generate the program client from IDL.
  // @ts-ignore
  const vaultProgram = new anchor.Program(farmIdl, vaultProgramId);

  const farm = getFarmBySymbol(assetSymbol);


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
addLiquidity = async (
  assetSymbol: any,
  obligationIdx: string | number | anchor.BN | number[] | Uint8Array | Buffer,
  checkLpTokenAccount = false
) => {
    const wallet = this.wallet,
    walletToInitialize = {
      signTransaction: wallet.signTransaction,
      signAllTransactions: wallet.signAllTransactions,
      publicKey: new anchor.web3.PublicKey(wallet.publicKey.toBase58()),
    },
    provider = new anchor.Provider(this.web3, walletToInitialize, {
      skipPreflight: true,
      preflightCommitment: commitment,
    });

  anchor.setProvider(provider);

  // Address of the deployed program.
  const vaultProgramId = new anchor.web3.PublicKey(getLendingFarmProgramId());
  // Generate the program client from IDL.
  // @ts-ignore
  const vaultProgram = new anchor.Program(farmIdl, vaultProgramId);

  const farm = getFarmBySymbol(assetSymbol);


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
    provider.wallet.publicKey,
    obligationVaultAccount,
    new anchor.web3.PublicKey(farm.mintAddress)
  );

  const dexProgramId = new anchor.web3.PublicKey(
    getLendingFarmAccount(assetSymbol).serum_dex_program // lendingInfo -> farm -> accounts -> serumDexProgram
  );

  const txn = new anchor.web3.Transaction();

  if (checkLpTokenAccount) {
    const [obligationLPTokenAccountInfo] = await getMultipleAccounts(
      this.web3,
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

}