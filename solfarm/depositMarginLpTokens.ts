import anchor from "@project-serum/anchor";
import * as serumAssoToken from "@project-serum/associated-token";
import { createAssociatedTokenAccount } from "@project-serum/associated-token";
import * as serum from "@project-serum/serum";
import * as splToken from "@solana/spl-token";

import {
  AQUAFARM_PROGRAM_ID,
  deriveVaultUserAccount,
  FARM_PLATFORMS,
  getFarmFusion,
  getFarmPoolAuthority,
  getFarmPoolId,
  getFarmPoolLpTokenAccount,
  getFarmPoolRewardATokenAccount,
  getFarmPoolRewardBTokenAccount,
  getFarmProgramId,
  getLendingFarmAccount,
  getLendingFarmProgramId,
  getLendingMarketAccount,
  getLendingProgramId,
  getOrcaVaultAccount,
  getOrcaVaultConvertAuthority,
  getOrcaVaultFarmMint,
  getOrcaVaultGlobalBaseTokenVault,
  getOrcaVaultGlobalFarm,
  getOrcaVaultGlobalRewardTokenVault,
  getOrcaVaultLpMint,
  getOrcaVaultProgramId,
  getOrcaVaultRewardMint,
  getReserveByName,
  getVaultAccount,
  getVaultInfoAccount,
  getVaultOldInfoAccount,
  getVaultPdaAccount,
  getVaultProgramId,
  getVaultRewardAccountA,
  getVaultRewardAccountB,
  getVaultTulipTokenAccount,
  TOKENS,
} from "./config";
import { getFarmBySymbol } from "./farm";
import {
  findLeveragedFarmAddress,
  findObligationVaultAddress,
  findOrcaUserFarmAddress,
  findUserFarmAddress,
  findUserFarmObligationAddress,
} from "./levFarmUtils";
export const depositMarginLpTokens = async (
  assetSymbol: any,
  reserveName: any,
  obligationIdx: string | number | anchor.BN | number[] | Uint8Array | Buffer
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
    quoteToken = farm.coins[1],
    isTulipRewardAccountValid = isMintAddressExisting(TOKENS.TULIP.mintAddress);

  const farmDetails = getStore("FarmStore").getFarm(farm.mintAddress);
  const { userFarmInfo } = farmDetails || {};

  const [userFarm] = await findUserFarmAddress(
    provider.wallet.publicKey,
    new anchor.web3.PublicKey(getLendingFarmProgramId()), // lending_info.json -> programs -> farm -> id
    new anchor.BN(0),
    new anchor.BN(farm.marginIndex)
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
    farm.platform === FARM_PLATFORMS.ORCA
      ? getOrcaVaultProgramId()
      : getVaultProgramId()
  );

  const lendingProgramId = new anchor.web3.PublicKey(getLendingProgramId());

  const [leveragedFarm] = await findLeveragedFarmAddress(
    solfarmVaultProgramId,
    new anchor.web3.PublicKey(getLendingFarmAccount(assetSymbol).serum_market),
    new anchor.web3.PublicKey(getLendingFarmProgramId()),
    new anchor.BN(farm.marginIndex)
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
    provider,
    obligationVaultAccount,
    new anchor.web3.PublicKey(farm.mintAddress)
  );

  let txn;

  switch (farm.platform) {
    case FARM_PLATFORMS.RAYDIUM: {
      const vaultInfoAccountPda = new anchor.web3.PublicKey(
        getVaultInfoAccount(assetSymbol)
      );

      const vaultLpTokenAccount = await createAssociatedTokenAccount(
        provider,
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
        provider,
        obligationVaultAccount,
        tulipTokenMint
      );

      const userTulipAccount = await createAssociatedTokenAccount(
        provider,
        provider.wallet.publicKey,
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
              authorityTulipTokenAccount: userTulipAccount,
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
