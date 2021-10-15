import anchor from "@project-serum/anchor";
import { createAssociatedTokenAccount } from "@project-serum/associated-token";
import { Token } from "@solana/spl-token";
import * as splToken from "@solana/spl-token";
import { AccountLayout as ACCOUNT_LAYOUT } from "@solana/spl-token";
import { PublicKey, SystemProgram } from "@solana/web3.js";

import {
  FARM_PLATFORMS,
  getLendingFarmAccount,
  getLendingFarmProgramId,
  getLendingMarketAccount,
  getLendingProgramId,
  getLendingReserve,
  getOrcaVaultProgramId,
  getPriceFeedsForReserve,
  getReserveByName,
  getVaultAccount,
  getVaultProgramId,
  TOKEN_PROGRAM_ID,
  TOKENS,
} from "./config";
import { getFarmBySymbol } from "./farm";
import {
  findBorrowAuthorizer,
  findLeveragedFarmAddress,
  findObligationVaultAddress,
  findUserFarmAddress,
  findUserFarmObligationAddress,
} from "./levFarmUtils";
export const depositBorrow = async (
  assetSymbol: any,
  reserveName: any,
  baseTokenAmount: number,
  quoteTokenAmount: number,
  leverageValue: number,
  obligationIdx: string | number | anchor.BN | number[] | Uint8Array | Buffer,
  createAccounts: any
) => {
  const { wallet, tokenAccounts, isMintAddressExisting } =
      getStore("WalletStore"),
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
    reserve = getReserveByName(reserveName),
    baseToken = farm.coins[0], // base / coin
    quoteToken = farm.coins[1]; // quote / pc | @to-do: change coins[0] and coins[1] to baseToken and quoteToken

  anchor.setProvider(provider);

  const farmDetails = getStore("FarmStore").getFarm(farm.mintAddress);
  const { userFarmInfo } = farmDetails || {};
  const { numberOfObligations = 0 } = userFarmInfo || {};

  // console.log(tokenAccounts);
  // Address of the deployed program.
  const vaultProgramId = new anchor.web3.PublicKey(getLendingFarmProgramId());
  // Generate the program client from IDL.
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

  const [obligationVaultAccount, obligationVaultNonce] =
    await findObligationVaultAddress(
      userFarm,
      new anchor.BN(obligationIdx), // userFarm has `numberOfObligations`, so we'll do `numberOfObligations + 1` here
      new anchor.web3.PublicKey(getLendingFarmProgramId())
    );

  const reserveNotBorrowing =
    reserveName === baseToken.symbol ? quoteToken : baseToken;

  const reserves = [
    new anchor.web3.PublicKey(reserve.account),
    // new anchor.web3.PublicKey(getLendingReserve(reserveNotBorrowing.symbol).account)
  ];

  const { getTokenPrice } = getStore("PriceStore");

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

  if (
    baseToken.symbol !== "SOL" &&
    !isMintAddressExisting(baseToken.mintAddress)
  ) {
    // txn.add(
    //   await serumAssoToken.createAssociatedTokenAccount(
    //     // who will pay for the account creation
    //     wallet.publicKey,
    //
    //     // who is the account getting created for
    //     wallet.publicKey,
    //
    //     // what mint address token is being created
    //     new anchor.web3.PublicKey(baseToken.mintAddress)
    //   )
    // );

    coinSourceTokenAccount = await createAssociatedTokenAccount(
      provider,
      provider.wallet.publicKey,
      new anchor.web3.PublicKey(baseToken.mintAddress)
    );
  } else {
    coinSourceTokenAccount = new anchor.web3.PublicKey(
      tokenAccounts[baseToken.mintAddress]?.tokenAccountAddress
    );
  }

  if (
    quoteToken.symbol !== "SOL" &&
    !isMintAddressExisting(quoteToken.mintAddress)
  ) {
    // txn.add(
    //   await serumAssoToken.createAssociatedTokenAccount(
    //     // who will pay for the account creation
    //     provider.wallet.publicKey,
    //
    //     // who is the account getting created for
    //     provider.wallet.publicKey,
    //
    //     // what mint address token is being created
    //     new anchor.web3.PublicKey(quoteToken.mintAddress)
    //   )
    // );

    pcSourceTokenAccount = await createAssociatedTokenAccount(
      provider,
      provider.wallet.publicKey,
      new anchor.web3.PublicKey(quoteToken.mintAddress)
    );
  } else {
    pcSourceTokenAccount = new anchor.web3.PublicKey(
      tokenAccounts[quoteToken.mintAddress]?.tokenAccountAddress
    );
  }

  // eslint-disable-next-line prefer-const
  let signers = [];
  if (baseToken.symbol === "SOL") {
    const lamportsToCreateAccount =
      await window.$web3.getMinimumBalanceForRentExemption(
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
        programId: TOKEN_PROGRAM_ID,
      })
    );

    txn.add(
      splToken.Token.createInitAccountInstruction(
        TOKEN_PROGRAM_ID,
        new PublicKey(TOKENS.WSOL.mintAddress),
        coinSourceTokenAccount,
        wallet.publicKey
      )
    );
  }

  if (quoteToken.symbol === "SOL") {
    const lamportsToCreateAccount =
      await window.$web3.getMinimumBalanceForRentExemption(
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
        programId: TOKEN_PROGRAM_ID,
      })
    );

    txn.add(
      Token.createInitAccountInstruction(
        TOKEN_PROGRAM_ID,
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
          // {
          //   isSigner: false,
          //   isWritable: true,
          //   pubkey: new anchor.web3.PublicKey(getLendingReserve(reserveNotBorrowing.symbol).account),
          // },
          // {
          //   isSigner: false,
          //   isWritable: false,
          //   pubkey: new anchor.web3.PublicKey(getPriceFeedsForReserve(reserveNotBorrowing.symbol).price_account),
          // },
          // refresh the reserve we are borrowing from
          {
            isSigner: false,
            isWritable: true,
            pubkey: new anchor.web3.PublicKey(
              getLendingReserve(reserveName).account
            ),
          },
          // {
          //   isSigner: false,
          //   isWritable: true,
          //   pubkey: new anchor.web3.PublicKey(getLendingReserve(reserveNotBorrowing.symbol).account),
          // },
        ],
      }
    )
  );

  if (baseToken.symbol === "SOL") {
    txn.add(
      Token.createCloseAccountInstruction(
        TOKEN_PROGRAM_ID,
        coinSourceTokenAccount,
        wallet.publicKey,
        wallet.publicKey,
        []
      )
    );
  }

  if (quoteToken.symbol === "SOL") {
    txn.add(
      Token.createCloseAccountInstruction(
        TOKEN_PROGRAM_ID,
        pcSourceTokenAccount,
        wallet.publicKey,
        wallet.publicKey,
        []
      )
    );
  }

  return [txn, signers];
};
