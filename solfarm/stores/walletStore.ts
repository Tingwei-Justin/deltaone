import { observable, makeObservable, action, computed } from 'mobx';
import { isNil, forEach, map, concat, slice, assign, findIndex, filter, noop } from 'lodash';
import * as anchor from '@project-serum/anchor';
import * as anchorlatest from 'anchorlatest';
import * as serumAssoToken from '@project-serum/associated-token';
import { TOKENS } from '../../utils/tokens';
const idlJson = require('../idl/vault.json');
const farmIdlJson = require('../idl/farm.json');
const orcaIdlJson = require('../idl/orca_idl.json');

const getTulipHarvestedAmount = (userShares, rewardPerShare, rewardPerSharePaid, lastPendingReward, tulipDecimals) => {
  const amount = (((userShares * (rewardPerShare - rewardPerSharePaid)) / Math.pow(10, 18)) + Number(lastPendingReward)) / Math.pow(10, tulipDecimals);

  return Math.floor(amount * Math.pow(10, TOKENS.TULIP.decimals)) / Math.pow(10, TOKENS.TULIP.decimals);

  // return (((userShares.mul(rewardPerShare.sub(rewardPerSharePaid))).div(Math.pow(10, 18))).add(lastPendingReward)).div(Math.pow(10, tulipDecimals));
}

const getRewardPerShare = (tulipRewardPerShare, rewardApplicableSlot, tulipRewardPerSlot, lastInteractionSlot, totalVlpShares) => {
  if (totalVlpShares === 0) {
    return tulipRewardPerShare;
  }

  return Number(tulipRewardPerShare) + Number((tulipRewardPerSlot * (rewardApplicableSlot - lastInteractionSlot) * Math.pow(10, 18)) / totalVlpShares);
}


export default class WalletStore {
  wallet: any;
  tokenAccounts: {};
  invalidTokenAccounts: Map<any, any>;
  tulipRewardTokenAccountInfo: any;
  existingMintAddress: Map<any, any>;
  constructor () {
    this.wallet = null;
    this.tokenAccounts = {};
    this.invalidTokenAccounts = new Map();
    this.tulipRewardTokenAccountInfo = null;
    this.existingMintAddress = new Map();

    makeObservable(this, {
      wallet: observable,
      tokenAccounts: observable,
      invalidTokenAccounts: observable,
      setWallet: action.bound,
      clearWallet: action.bound,
      setTokenAccounts: action.bound,
      setDepositedAmount: action.bound,
      setInvalidTokenAccount: action.bound,
      setExistingMintAddress: action.bound,
      resetExistingMintAddresses: action.bound,
      walletAddress: computed,
      totalDeposited: computed,
      totalReservesDeposited: computed,
      totalTulipPending: computed
    });

    this.isTokenAccountInvalid = this.isTokenAccountInvalid.bind(this);
    this.hasTulipRewardPending = this.hasTulipRewardPending.bind(this);
    this.isMintAddressExisting = this.isMintAddressExisting.bind(this);
    this.isLowOnSolBalance = this.isLowOnSolBalance.bind(this);
  }

  isTokenAccountInvalid (mintAddress, platform = '') {
    // There's no concept of missing token for ORCA vaults
    // hence blanket bailout check
    if (platform === FARM_PLATFORMS.ORCA) {
      return false;
    }

    return this.invalidTokenAccounts.get(mintAddress) || false;
  }

  setInvalidTokenAccount (mintAddress, isInvalid) {
    this.invalidTokenAccounts.set(mintAddress, isInvalid);
  }

  isMintAddressExisting (mintAddress) {
    return this.existingMintAddress.get(mintAddress) || false;
  }

  setExistingMintAddress (mintAddress, isInvalid) {
    return this.existingMintAddress.set(mintAddress, isInvalid);
  }

  resetExistingMintAddresses () {
    return this.existingMintAddress.clear();
  }

  async setDepositedAmount () {
    const idl = idlJson;
    const farmIdl = farmIdlJson;

    const walletToInitialize = {
        signTransaction: this.wallet?.signTransaction,
        signAllTransactions: this.wallet?.signAllTransactions,
        publicKey: new anchor.web3.PublicKey(this.wallet?.publicKey?.toBase58())
      };

    const provider = new anchor.Provider(window.$web3, walletToInitialize, { skipPreflight: true });
    anchor.setProvider(provider);

    // Address of the deployed program.
    const vaultProgramId = new anchor.web3.PublicKey(getVaultProgramId());
    // Generate the program client from IDL.
    const vaultProgram = new anchor.Program(idl, vaultProgramId, provider);

    // Address of the deployed program.
    const farmProgramId = new anchor.web3.PublicKey(getLendingFarmProgramId());
    // Generate the program client from IDL.
    const farmProgram = new anchor.Program(farmIdl , farmProgramId, provider);

    // Address of the deployed program.
    const orcaVaultProgramId = new anchor.web3.PublicKey(getOrcaVaultProgramId());
    // Generate the program client from IDL.
    const orcaVaultProgram = new anchor.Program(orcaIdlJson, orcaVaultProgramId, providerLatest);

    const userDataKeys = map(FARMS, (farm) => {
        const mintAddress = (
          farm.symbol === 'RAY-SRM-DUAL' ? `${farm.mintAddress}0` : farm.mintAddress
        );

        const farmDetails = getStore('FarmStore').getFarm(mintAddress);

        return farmDetails.userBalanceAccount;
      }),
      newUserDataKeys = map(FARMS, (farm) => {
        const mintAddress = (
          farm.symbol === 'RAY-SRM-DUAL' ? `${farm.mintAddress}0` : farm.mintAddress
        );

        const farmDetails = getStore('FarmStore').getFarm(mintAddress);

        return farmDetails.newUserBalanceAccount;
      }),
      userMetadataKeys = map(FARMS, (farm) => {
        const mintAddress = (
          farm.symbol === 'RAY-SRM-DUAL' ? `${farm.mintAddress}0` : farm.mintAddress
        );

        const farmDetails = getStore('FarmStore').getFarm(mintAddress);

        return farmDetails.userBalanceMetadataAccount;
      }),
      userTulipRewardKeys = map(FARMS, (farm) => {
        const mintAddress = (
          farm.symbol === 'RAY-SRM-DUAL' ? `${farm.mintAddress}0` : farm.mintAddress
        );

        const farmDetails = getStore('FarmStore').getFarm(mintAddress);

        return farmDetails.tulipRewardMetadataAccount;
      }),
      vaultAccountKeys = map(FARMS, (farm) => new anchor.web3.PublicKey(getVaultAccount(farm.symbol))),
      tulipPubKey = new anchor.web3.PublicKey(TOKENS.TULIP.mintAddress),
      tulipRewardTokenAccount = await serumAssoToken.getAssociatedTokenAddress(
        this.wallet.publicKey,
        tulipPubKey
      ),
      //TODO: make a single list of leverage farms
      leverageVaults = filter(LEVERAGE_FARMS, (farm) => !isNil(farm.marginIndex)),
      leverageVaultsUserFarms = map(leverageVaults, (farm) => {
        const farmDetails = getStore('FarmStore').getFarm(farm.mintAddress);

        return farmDetails.userFarm;
      }),
      orcaVaultAccountKeys = map(ORCA_FARMS, (farm) => new anchor.web3.PublicKey(getOrcaVaultAccount(farm.symbol))),
      orcaVaultUserAccountKeys = map(ORCA_FARMS, (farm) => {
        const farmDetails = getStore('FarmStore').getFarm(farm.mintAddress);
        return farmDetails.orcaVaultUserAccountAddress;
      }),
      publicKeys = [
        userDataKeys,
        userMetadataKeys,
        userTulipRewardKeys,
        vaultAccountKeys,
        newUserDataKeys,
        leverageVaultsUserFarms,
        orcaVaultAccountKeys,
        orcaVaultUserAccountKeys,
        [tulipRewardTokenAccount],
      ];


    const [
      userBalanceAccounts,
      userBalanceMetadataAccounts,
      userTulipRewardMetadataAccounts,
      vaultAccountsInfo,
      newUserBalanceAccounts,
      leverageVaultsUserFarmsInfo,
      orcaVaultAccountsInfo,
      orcaUserBalanceAccounts,
      tulipRewardTokenAccountInfo
    ] = await getMultipleAccountsGrouped(window.$web3, publicKeys, commitment);

    this.tulipRewardTokenAccountInfo = tulipRewardTokenAccountInfo;


    let openedObligations = [];
    const pendingObligations = [];
    let pendingCloseObligations = [];
    let pendingAddCollateralObligations = [];
    let tulipRewardAccountsForObligations = [];
    const openedObligationMetadataAccounts = [];
    // userBalanceAccounts.forEach(async (userBalanceAccount, index) => {
    for (const [index, userBalanceAccount] of userBalanceAccounts.entries()) {
      const farm = FARMS[index];
      const newUserBalanceAccount = newUserBalanceAccounts[index];

      const mintAddress = (
        farm.symbol === 'RAY-SRM-DUAL' ? `${farm.mintAddress}0` : farm.mintAddress
      );

      getStore('FarmStore').setFarm(mintAddress, {
        isUserBalanceAccountValid: Boolean(userBalanceAccount),
        isNewUserBalanceAccountValid: Boolean(newUserBalanceAccount)
      });

      if (!isNil(farm.marginIndex)) {
        const leverageVaultUserFarmIndex = findIndex(leverageVaults, (leverageVault) => {
          return leverageVault.mintAddress === farm.mintAddress;
        });

        const userFarmInfo = leverageVaultsUserFarmsInfo[leverageVaultUserFarmIndex];
        let decodedUserFarmInfo;
        try {
          decodedUserFarmInfo = userFarmInfo && farmProgram.coder.accounts.decode('UserFarm', userFarmInfo?.account?.data);
        } catch (e) {
          break;
        }

        if (decodedUserFarmInfo && farm.symbol !== 'RAY-SRM-DUAL') {
          const { obligations } = decodedUserFarmInfo;

          obligations.forEach(async (obligation, obligationIdx) => {
            // console.log(farm.symbol + " obligation", obligation);
            if (
              obligation.positionState.hasOwnProperty("opened") ||
              obligation.positionState.hasOwnProperty("withdrawing") ||
              obligation.positionState.hasOwnProperty("removedLiquidity") ||
              obligation.positionState.hasOwnProperty("swappedForRepaying") ||
              obligation.positionState.hasOwnProperty("topUp") ||
              obligation.positionState.hasOwnProperty("topUpSwapped") ||
              obligation.positionState.hasOwnProperty("topUpAddedLiquidity")
            ) {
              // console.log('$$$ openedObligation for ', farm.symbol, obligation);
              openedObligations.push({
                farmIndex: index,
                obligationAccount: obligation.obligationAccount,
                obligationIdx
              });

              getStore('ObligationStore').add({
                obligationIdx,
                farmMintAddress: mintAddress,
                userFarmIndex: 0,
                ...obligation
              });
            } else if (
              obligation.positionState.hasOwnProperty("borrowed") ||
              obligation.positionState.hasOwnProperty("swapped") ||
              obligation.positionState.hasOwnProperty("addedLiquidity")
            ) {
                // console.log('$$$ pendingObligation for ', farm.symbol, obligation);
                pendingObligations.push({
                  farmIndex: index,
                  obligationAccount: obligation.obligationAccount,
                  obligationIdx
                });

                getStore('ObligationStore').add({
                  obligationIdx,
                  farmMintAddress: mintAddress,
                  userFarmIndex: 0,
                  ...obligation
                });
              }

            // Pending closed obligations
            if (
              obligation.positionState.hasOwnProperty("withdrawing") ||
              obligation.positionState.hasOwnProperty("removedLiquidity") ||
              obligation.positionState.hasOwnProperty("swappedForRepaying")
            ) {
                pendingCloseObligations.push({
                  farmIndex: index,
                  obligationAccount: obligation.obligationAccount,
                  obligationIdx
                });

                getStore('ObligationStore').add({
                  obligationIdx,
                  farmMintAddress: mintAddress,
                  userFarmIndex: 0,
                  ...obligation
                });
              }

            // Pending add collateral obligations
            if (
              obligation.positionState.hasOwnProperty("topUp") ||
              obligation.positionState.hasOwnProperty("topUpSwapped") ||
              obligation.positionState.hasOwnProperty("topUpAddedLiquidity")
            ) {
              pendingAddCollateralObligations.push({
                farmIndex: index,
                obligationAccount: obligation.obligationAccount,
                obligationIdx
              });

              getStore('ObligationStore').add({
                obligationIdx,
                farmMintAddress: mintAddress,
                userFarmIndex: 0,
                ...obligation
              });
            }

            if (obligation.positionState.hasOwnProperty('withdrawn')) {
              // Delete obligations from `ObligationStore` for 'withdrawn' state
              getStore('ObligationStore').delete(getObligationId({
                obligationIdx,
                farmMintAddress: mintAddress,
                userFarmIndex: 0,
              }));
            }
          });

          if (pendingObligations.length || pendingCloseObligations.length || pendingAddCollateralObligations.length) {
            getStore('InfobarStore').trigger({
              id: REPAIR_ISSUES,
              type: 'error',
              message: 'We have detected issue(s) with your transaction(s), kindly repair them.',
              primaryAction: {
                label: 'Repair Issues',
                onClick: () => {
                  getStore('ModalStore').trigger({ id: REPAIR_ISSUES, pendingObligations });
                }
              }
            });
          } else {
            getStore('InfobarStore').dismiss(REPAIR_ISSUES);
            getStore('ModalStore').dismiss(REPAIR_ISSUES);
          }

          //#region Tulip Calculation
          const solfarmVaultProgramId = new anchor.web3.PublicKey(
            getVaultProgramId()
          );

          for (const [obligationIdx, obligation] of obligations.entries()) {
            if (
              obligation.positionState.hasOwnProperty("opened") ||
              obligation.positionState.hasOwnProperty("withdrawing") ||
              obligation.positionState.hasOwnProperty("removedLiquidity") ||
              obligation.positionState.hasOwnProperty("swappedForRepaying")
            ) {

              let [userFarm] = await findUserFarmAddress(
                this.wallet.publicKey,
                new anchor.web3.PublicKey(getLendingFarmProgramId()),
                new anchor.BN(0),
                new anchor.BN(farm.marginIndex)
              );

              let [obligationVaultAccount] = await findObligationVaultAddress(
                userFarm,
                new anchor.BN(obligationIdx),
                new anchor.web3.PublicKey(getLendingFarmProgramId())
              );

              const [vaultInfoAccountPda] = await anchor.web3.PublicKey.findProgramAddress(
                [(new anchor.web3.PublicKey(getVaultAccount(farm.symbol))).toBytes(), Buffer.from("info")],
                solfarmVaultProgramId
            );

              let [userFarmManagerVaultBalanceAccount, n1] = await anchor.web3.PublicKey.findProgramAddress(
                [vaultInfoAccountPda.toBuffer(), obligationVaultAccount.toBuffer()],
                solfarmVaultProgramId
              );

              let [userFarmManagerVaultBalanceMetadataAccount, n2] = await anchor.web3.PublicKey.findProgramAddress(
                [
                  userFarmManagerVaultBalanceAccount.toBuffer(),
                  obligationVaultAccount.toBuffer(),
                ],
                solfarmVaultProgramId
            );

              let [userFarmManagerVaultTulipRewardAccount, n3] = await anchor.web3.PublicKey.findProgramAddress(
                [
                  userFarmManagerVaultBalanceMetadataAccount.toBuffer(),
                  obligationVaultAccount.toBuffer(),
                ],
                solfarmVaultProgramId,
              );

              tulipRewardAccountsForObligations.push(userFarmManagerVaultTulipRewardAccount);
              openedObligationMetadataAccounts.push(userFarmManagerVaultBalanceMetadataAccount);

              // console.log("$$ reward data account", userFarmManagerVaultTulipRewardAccount);

              //#endregion
            }
          }
        }

        getStore('FarmStore').setFarm(mintAddress, {
          userFarmInfo: decodedUserFarmInfo,
          isUserFarmValid: Boolean(userFarmInfo),
          farmObligationAccounts: [],
        });
      }

      if (!userBalanceAccount) {
        continue;
      }

      const userBalanceAccountData = vaultProgram.coder.accounts.decode('VaultBalanceAccount', Buffer.from(userBalanceAccount.account.data)),
        currentMetadataAccount = userBalanceMetadataAccounts[index],
        userBalanceMetadataAccount = currentMetadataAccount && (
          vaultProgram.coder.accounts.decode('VaultBalanceMetadata', currentMetadataAccount?.account?.data)
        );

      let newUserBalanceAccountData;
      if (newUserBalanceAccount) {
        newUserBalanceAccountData = vaultProgram.coder.accounts.decode('VaultBalanceAccount', Buffer.from(newUserBalanceAccount.account.data));
      }

      getStore('FarmStore').setFarm(mintAddress, {
        userShares: userBalanceAccountData.amount,
        totalLpTokens: userBalanceMetadataAccount?.totalLpTokens,
        newUserShares: !isNil(newUserBalanceAccountData) && getVaultInfoAccount(farm.symbol) !== getVaultOldInfoAccount(farm.symbol) ? newUserBalanceAccountData.amount: new anchor.BN(0),
        migrateAccount: !isNil(newUserBalanceAccountData) && getVaultInfoAccount(farm.symbol) !== getVaultOldInfoAccount(farm.symbol) ? newUserBalanceAccountData.owner.toBase58() === provider.wallet.publicKey.toBase58(): false,
        lastDepositTime: userBalanceMetadataAccount?.lastDepositTime.toNumber()
      });
    }

    const rayBalanceAccountLen = FARMS.length;
    const openedObligationOrcaBalanceAccounts = [];
    for (const [index, userBalanceAccount] of orcaUserBalanceAccounts.entries()) {
      const farm = ORCA_FARMS[index];

      const mintAddress = farm.mintAddress;

      getStore('FarmStore').setFarm(mintAddress, {
        isUserBalanceAccountValid: Boolean(userBalanceAccount),
      });

      // console.log("orca user balance accounts ", farm, userBalanceAccount);
      if (!isNil(farm.marginIndex)) {
        const leverageVaultUserFarmIndex = findIndex(leverageVaults, (leverageVault) => {
          return leverageVault.mintAddress === farm.mintAddress;
        });

        // console.log("orca lev vault farm index ", leverageVaultUserFarmIndex );
        const userFarmInfo = leverageVaultsUserFarmsInfo[leverageVaultUserFarmIndex];
        const decodedUserFarmInfo = userFarmInfo && farmProgram.coder.accounts.decode('UserFarm', userFarmInfo?.account?.data);

        if (decodedUserFarmInfo) {
          const { obligations } = decodedUserFarmInfo;

          obligations.forEach(async (obligation, obligationIdx) => {
            getStore('ObligationStore').add({
              obligationIdx,
              farmMintAddress: mintAddress,
              userFarmIndex: 0,
              ...obligation
            });

            // console.log(farm.symbol + " obligation", obligation);
            if (
                obligation.positionState.hasOwnProperty("opened") ||
                obligation.positionState.hasOwnProperty("withdrawing") ||
                obligation.positionState.hasOwnProperty("removedLiquidity") ||
                obligation.positionState.hasOwnProperty("swappedForRepaying") ||
                obligation.positionState.hasOwnProperty("topUp") ||
                obligation.positionState.hasOwnProperty("topUpSwapped") ||
                obligation.positionState.hasOwnProperty("topUpAddedLiquidity")
            ) {
              // console.log('$$$ openedObligation for ', farm.symbol, obligation);
              openedObligations.push({
                farmIndex: rayBalanceAccountLen + index,
                obligationAccount: obligation.obligationAccount,
                obligationIdx
              });
            } else if (
                obligation.positionState.hasOwnProperty("borrowed") ||
                obligation.positionState.hasOwnProperty("swapped") ||
                obligation.positionState.hasOwnProperty("addedLiquidity")
            ) {
              // console.log('$$$ pendingObligation for ', farm.symbol, obligation);
              pendingObligations.push({
                farmIndex: rayBalanceAccountLen + index,
                obligationAccount: obligation.obligationAccount,
                obligationIdx
              });
            }

            // Pending closed obligations
            if (
                obligation.positionState.hasOwnProperty("withdrawing") ||
                obligation.positionState.hasOwnProperty("removedLiquidity") ||
                obligation.positionState.hasOwnProperty("swappedForRepaying")
            ) {
              pendingCloseObligations.push({
                farmIndex: rayBalanceAccountLen + index,
                obligationAccount: obligation.obligationAccount,
                obligationIdx
              });
            }

            // Pending add collateral obligations
            if (
                obligation.positionState.hasOwnProperty("topUp") ||
                obligation.positionState.hasOwnProperty("topUpSwapped") ||
                obligation.positionState.hasOwnProperty("topUpAddedLiquidity")
            ) {
              pendingAddCollateralObligations.push({
                farmIndex: rayBalanceAccountLen + index,
                obligationAccount: obligation.obligationAccount,
                obligationIdx
              });
            }

            if (obligation.positionState.hasOwnProperty('withdrawn')) {
              // Delete obligations from `ObligationStore` for 'withdrawn' state
              getStore('ObligationStore').delete(getObligationId({
                obligationIdx,
                farmMintAddress: mintAddress,
                userFarmIndex: 0,
              }));
            }
          });

          if (pendingObligations.length || pendingCloseObligations.length || pendingAddCollateralObligations.length) {
            getStore('InfobarStore').trigger({
              id: REPAIR_ISSUES,
              type: 'error',
              message: 'We have detected issue(s) with your transaction(s), kindly repair them.',
              primaryAction: {
                label: 'Repair Issues',
                onClick: () => {
                  getStore('ModalStore').trigger({ id: REPAIR_ISSUES, pendingObligations });
                }
              }
            });
          } else {
            getStore('InfobarStore').dismiss(REPAIR_ISSUES);
            getStore('ModalStore').dismiss(REPAIR_ISSUES);
          }

          //#region Tulip Calculation
          const solfarmVaultProgramId = new anchor.web3.PublicKey(
              getOrcaVaultProgramId()
          );
          for (const [obligationIdx, obligation] of obligations.entries()) {
            if (
                obligation.positionState.hasOwnProperty("opened") ||
                obligation.positionState.hasOwnProperty("withdrawing") ||
                obligation.positionState.hasOwnProperty("removedLiquidity") ||
                obligation.positionState.hasOwnProperty("swappedForRepaying")
            ) {

              let [userFarm] = await findUserFarmAddress(
                  this.wallet.publicKey,
                  new anchor.web3.PublicKey(getLendingFarmProgramId()),
                  new anchor.BN(0),
                  new anchor.BN(farm.marginIndex)
              );

              let [obligationVaultAccount] = await findObligationVaultAddress(
                  userFarm,
                  new anchor.BN(obligationIdx),
                  new anchor.web3.PublicKey(getLendingFarmProgramId())
              );

              let [orcaVaultUserAccountAddress, orcaVaultUserAccountNonce] = await deriveVaultUserAccount(
                  new anchor.web3.PublicKey(getOrcaVaultAccount(farm.symbol)),
                  obligationVaultAccount,
                  solfarmVaultProgramId,
              );


              openedObligationOrcaBalanceAccounts.push(orcaVaultUserAccountAddress);
              //#endregion
            }
          }
        }

        getStore('FarmStore').setFarm(mintAddress, {
          userFarmInfo: decodedUserFarmInfo,
          isUserFarmValid: Boolean(userFarmInfo),
          farmObligationAccounts: [],
        });
      }

      if (!userBalanceAccount) {
        continue;
      }

      const userBalanceAccountData = orcaVaultProgram.coder.accounts.decode('VaultUser', Buffer.from(userBalanceAccount.account.data));


      // console.log("$$$ orca info", farm.symbol, userBalanceAccountData);
      getStore('FarmStore').setFarm(mintAddress, {
        userShares: userBalanceAccountData.shares,
        totalLpTokens: userBalanceAccountData?.depositedBalance,
        lastDepositTime: userBalanceAccountData?.lastDepositTime.toNumber()
      });
    }

    const openedObligationAddresses = openedObligations.map((openedObligation) => openedObligation.obligationAccount);
    const pendingObligationAddresses = pendingObligations.map((pendingObligation) => pendingObligation.obligationAccount);
    const pendingCloseObligationAddresses = pendingCloseObligations.map((pendingCloseObligation) => pendingCloseObligation.obligationAccount);
    const pendingAddCollateralObligationAddresses = pendingAddCollateralObligations.map((pendingAddCollateralObligation) => pendingAddCollateralObligation.obligationAccount);
    const obligationPubKeys = [
      openedObligationAddresses,
      pendingObligationAddresses,
      pendingCloseObligationAddresses,
      pendingAddCollateralObligationAddresses,
      tulipRewardAccountsForObligations,
      openedObligationMetadataAccounts,
      openedObligationOrcaBalanceAccounts,
    ];

    const result = await getMultipleAccountsGrouped(window.$web3, obligationPubKeys, commitment);
    const [
      obligationAccountDetails,
      pendingObligationAccountDetails,
      pendingCloseObligationAccountDetails,
      pendingAddCollateralAccountDetails,
      tulipRewardObligationAccountDetails,
      obligationAccountMetadataDetails,
      openedObligationOrcaBalanceAccountsDetails
    ] = result;

    // console.log("tulip meta account", tulipRewardAccountsForObligations);

    // Opened obligations
    let decodedOpenedObligations = {};

    let orcaParsed = 0;
    let leverageVaultAccountsInfo = concat(vaultAccountsInfo, orcaVaultAccountsInfo);
    openedObligations.forEach((openedObligation, index) => {
      const farm = LEVERAGE_FARMS[openedObligation.farmIndex];

      let decodedObligationAccount = LENDING_OBLIGATION_LAYOUT.decode(obligationAccountDetails[index].account.data);

      let extraObligationData = obligationAccountDetails[index].account.data.slice(143, 303);
      let obligationBorrows = [];
      for (let i = 0; i<decodedObligationAccount.borrowsLen; i++) {
        obligationBorrows.push(LENDING_OBLIGATION_LIQUIDITY.decode(extraObligationData.slice(i*80, (i+1) * 80)));
      }

      const {
        totalVlpShares
      } = getStore('FarmStore').getFarm(farm.mintAddress) || {};
      const vaultAccountInfo = leverageVaultAccountsInfo[openedObligation.farmIndex];
      switch (farm.platform) {
        case FARM_PLATFORMS.RAYDIUM: {
              const decodedVaultAccountInfo = vaultProgram.coder.accounts.decode('Vault', vaultAccountInfo?.account?.data),
              { tulipRewardPerShare, tulipRewardPerSlot, lastInteractionSlot } = decodedVaultAccountInfo || {};

          const tulipRewardForCurrentObligation = tulipRewardObligationAccountDetails[index];
          const decodedTulipRewardForCurrentObligation = tulipRewardForCurrentObligation && vaultProgram.coder.accounts.decode('VaultTulipRewardMetadata', tulipRewardForCurrentObligation.account.data);

          const rewardApplicableSlot = Math.min(window.$slot, farm.rewardEndSlot);
          const { rewardPerSharePaid = 0, lastPendingReward = 0 } = decodedTulipRewardForCurrentObligation || {};
          const rewardPerShare = getRewardPerShare(
              tulipRewardPerShare,
              rewardApplicableSlot,
              tulipRewardPerSlot,
              lastInteractionSlot,
              totalVlpShares
          );
          const tulipEarned = getTulipHarvestedAmount(
              decodedObligationAccount.vaultShares,
              rewardPerShare,
              rewardPerSharePaid,
              lastPendingReward,
              TOKENS.TULIP.decimals
          );

          const obligationMetadata = obligationAccountMetadataDetails[index];
          const decodedObligationMetadata = obligationMetadata && vaultProgram.coder.accounts.decode('VaultBalanceMetadata', obligationMetadata.account.data);
          const { totalLpTokens, lastDepositTime } = decodedObligationMetadata || {};
          const lastDepositedAmount = totalLpTokens?.toNumber() / Math.pow(10, farm.decimals);

          // Inject obligationIdx in decodedObligationAccount
          assign(decodedObligationAccount, { obligationIdx: openedObligation.obligationIdx });
          assign(decodedObligationAccount, { borrows: obligationBorrows });
          assign(decodedObligationAccount, { address: openedObligation.obligationAccount });
          assign(decodedObligationAccount, { tulipEarned });
          assign(decodedObligationAccount, { lastDepositedAmount });
          assign(decodedObligationAccount, { lastDepositTime });
          break;
        }

        case FARM_PLATFORMS.ORCA: {
          const orcaUserBalanceAccount = openedObligationOrcaBalanceAccountsDetails[orcaParsed];
          const decodedOrcaUserBalanceAccount = orcaUserBalanceAccount && orcaVaultProgram.coder.accounts.decode('VaultUser', orcaUserBalanceAccount.account.data);
          const { depositedBalance } = decodedOrcaUserBalanceAccount || {};
          const lastDepositedAmount = depositedBalance?.toNumber() / Math.pow(10, farm.decimals);

          // Inject obligationIdx in decodedObligationAccount
          assign(decodedObligationAccount, { obligationIdx: openedObligation.obligationIdx });
          assign(decodedObligationAccount, { borrows: obligationBorrows });
          assign(decodedObligationAccount, { address: openedObligation.obligationAccount });
          assign(decodedObligationAccount, { tulipEarned: 0 });
          assign(decodedObligationAccount, { lastDepositedAmount });

          // console.log("$$$ orca obligation", decodedObligationAccount);

          orcaParsed = orcaParsed + 1;
          break;
        }
      }


      let decodedFarmOpenedObligations = decodedOpenedObligations[farm.mintAddress] || [];
      decodedFarmOpenedObligations.push(decodedObligationAccount);
      decodedOpenedObligations[farm.mintAddress] = decodedFarmOpenedObligations;
    });

    for (const farmMintAddress in decodedOpenedObligations) {
      // console.log("$$ opened obligation ", farmMintAddress, decodedOpenedObligations);
      getStore('FarmStore').setFarm(farmMintAddress, {
        farmObligationAccounts: decodedOpenedObligations[farmMintAddress],
      });

      decodedOpenedObligations[farmMintAddress].forEach((obligation) => {
        getStore('ObligationStore').add({
          farmMintAddress,
          userFarmIndex: 0,
          ...obligation
        });
      });
    }

    // Pending obligations
    let decodedPendingObligations = {};
    pendingObligations.forEach((pendingObligation, index) => {
      const farm = LEVERAGE_FARMS[pendingObligation.farmIndex];

      let decodedObligationAccount = LENDING_OBLIGATION_LAYOUT.decode(pendingObligationAccountDetails[index].account.data);

      // console.log(
      //   '$$$decodedObligationAccount',
      //   decodedObligationAccount
      // )

      let extraObligationData = pendingObligationAccountDetails[index].account.data.slice(143, 303);
      let obligationBorrows = [];
      for (let i = 0; i<decodedObligationAccount.borrowsLen; i++) {
        obligationBorrows.push(LENDING_OBLIGATION_LIQUIDITY.decode(extraObligationData.slice(i*80, (i+1) * 80)));
      }
      // Inject obligationIdx in decodedObligationAccount
      assign(decodedObligationAccount, { obligationIdx: pendingObligation.obligationIdx });
      assign(decodedObligationAccount, { borrows: obligationBorrows });
      assign(decodedObligationAccount, { address: pendingObligation.obligationAccount });

      let decodedFarmPendingObligations = decodedPendingObligations[farm.mintAddress] || [];
      decodedFarmPendingObligations.push(decodedObligationAccount);
      decodedPendingObligations[farm.mintAddress] = decodedFarmPendingObligations;
    });


    // Pending Close Obligation
    let decodedPendingCloseObligations = {};
    pendingCloseObligations.forEach((pendingObligation, index) => {
      const farm = LEVERAGE_FARMS[pendingObligation.farmIndex];

      let decodedObligationAccount = LENDING_OBLIGATION_LAYOUT.decode(pendingCloseObligationAccountDetails[index].account.data);

      // console.log(
      //   '$$$decodedObligationAccount',
      //   decodedObligationAccount
      // )

      let extraObligationData = pendingCloseObligationAccountDetails[index].account.data.slice(143, 303);
      let obligationBorrows = [];
      for (let i = 0; i < decodedObligationAccount.borrowsLen; i++) {
        obligationBorrows.push(LENDING_OBLIGATION_LIQUIDITY.decode(extraObligationData.slice(i*80, (i+1) * 80)));
      }
      // Inject obligationIdx in decodedObligationAccount
      assign(decodedObligationAccount, { obligationIdx: pendingObligation.obligationIdx });
      assign(decodedObligationAccount, { borrows: obligationBorrows });
      assign(decodedObligationAccount, { address: pendingObligation.obligationAccount });

      let decodedFarmPendingObligations = decodedPendingCloseObligations[farm.mintAddress] || [];
      decodedFarmPendingObligations.push(decodedObligationAccount);
      decodedPendingCloseObligations[farm.mintAddress] = decodedFarmPendingObligations;
    });

    // Pending Add collateral Obligations
    let decodedPendingAddCollateralObligations = {};
    pendingAddCollateralObligations.forEach((pendingObligation, index) => {
      const farm = LEVERAGE_FARMS[pendingObligation.farmIndex];

      let decodedObligationAccount = LENDING_OBLIGATION_LAYOUT.decode(pendingAddCollateralAccountDetails[index].account.data);

      // console.log(
      //   '$$$decodedObligationAccount',
      //   decodedObligationAccount
      // )

      let extraObligationData = pendingAddCollateralAccountDetails[index].account.data.slice(143, 303);
      let obligationBorrows = [];
      for (let i = 0; i < decodedObligationAccount.borrowsLen; i++) {
        obligationBorrows.push(LENDING_OBLIGATION_LIQUIDITY.decode(extraObligationData.slice(i*80, (i+1) * 80)));
      }
      // Inject obligationIdx in decodedObligationAccount
      assign(decodedObligationAccount, { obligationIdx: pendingObligation.obligationIdx });
      assign(decodedObligationAccount, { borrows: obligationBorrows });
      assign(decodedObligationAccount, { address: pendingObligation.obligationAccount });

      let decodedFarmPendingObligations = decodedPendingAddCollateralObligations[farm.mintAddress] || [];
      decodedFarmPendingObligations.push(decodedObligationAccount);
      decodedPendingAddCollateralObligations[farm.mintAddress] = decodedFarmPendingObligations;
    });

    // console.log('$$$ PendingObligations:');
    // console.log({ decodedPendingObligations });
    // console.log({ decodedPendingCloseObligations });
    // console.log({ decodedPendingAddCollateralObligations });

    // We should clear all obligations and then loop again!
    for (const farmMintAddress in decodedPendingObligations) {
      getStore('FarmStore').setFarm(farmMintAddress, {
        farmPendingObligationAccounts: decodedPendingObligations[farmMintAddress]
      });

      decodedPendingObligations[farmMintAddress].forEach((obligation) => {
        getStore('ObligationStore').add({
          farmMintAddress,
          userFarmIndex: 0,
          ...obligation
        });
      });
    }

    for (const farmMintAddress in decodedPendingCloseObligations) {
      getStore('FarmStore').setFarm(farmMintAddress, {
        farmPendingCloseObligationAccounts: decodedPendingCloseObligations[farmMintAddress]
      });

      decodedPendingCloseObligations[farmMintAddress].forEach((obligation) => {
        getStore('ObligationStore').add({
          farmMintAddress,
          userFarmIndex: 0,
          ...obligation
        });
      });
    }

    for (const farmMintAddress in decodedPendingAddCollateralObligations) {
      getStore('FarmStore').setFarm(farmMintAddress, {
        farmPendingAddCollateralAccounts: decodedPendingAddCollateralObligations[farmMintAddress]
      });

      decodedPendingAddCollateralObligations[farmMintAddress].forEach((obligation) => {
        getStore('ObligationStore').add({
          farmMintAddress,
          userFarmIndex: 0,
          ...obligation
        });
      });
    }

    FARMS.forEach(async (farm, index) => {
      const mintAddress = (
        farm.symbol === 'RAY-SRM-DUAL' ? `${farm.mintAddress}0` : farm.mintAddress
      );

      const {
        userShares,
        isUserBalanceAccountValid,
        totalVaultBalance,
        totalVlpShares,
        totalLpTokens,
        newUserShares
      } = getStore('FarmStore').getFarm(mintAddress) || {};
  
      try {
        if (!isUserBalanceAccountValid) {
          return;
        }

        const rewardApplicableSlot = Math.min(window.$slot, farm.rewardEndSlot);
        const vaultAccountInfo = vaultAccountsInfo[index],
          decodedVaultAccountInfo = vaultProgram.coder.accounts.decode('Vault', vaultAccountInfo?.account?.data),
          { tulipRewardPerShare, tulipRewardPerSlot, tulipRewardEndSlot, lastInteractionSlot } = decodedVaultAccountInfo || {};
        const tulipRewardMetadataAccountInfo = userTulipRewardMetadataAccounts[index],
          decodedTulipRewardMetadataAccountInfo = tulipRewardMetadataAccountInfo && vaultProgram.coder.accounts.decode('VaultTulipRewardMetadata', tulipRewardMetadataAccountInfo.account.data),
          { rewardPerSharePaid = 0, lastPendingReward = 0 } = decodedTulipRewardMetadataAccountInfo || {},
          rewardPerShare = getRewardPerShare(
            tulipRewardPerShare,
            rewardApplicableSlot,
            tulipRewardPerSlot,
            lastInteractionSlot,
            totalVlpShares
          );
        let depositedAmount = 0;
        let lastDepositedAmount = 0;
        try{
          depositedAmount = (( (userShares.add(newUserShares)).mul(totalVaultBalance)).div(totalVlpShares)).toNumber() / Math.pow(10, farm.decimals);
          lastDepositedAmount = totalLpTokens?.toNumber() / Math.pow(10, farm.decimals);
        } catch (e) {
          depositedAmount = ((  (new anchor.BN(userShares.toString()).add(new anchor.BN(newUserShares.toString())))
              .mul(new anchor.BN(totalVaultBalance.toString())))
              .div(new anchor.BN(totalVlpShares.toString())))
              .div(new anchor.BN(Math.pow(10, farm.decimals)))
              .toNumber();
          lastDepositedAmount = new anchor.BN(totalLpTokens?.toString()).div(new anchor.BN(Math.pow(10, farm.decimals))).toNumber();
        }

        const tulipEarned = getTulipHarvestedAmount(
            userShares,
            rewardPerShare,
            rewardPerSharePaid,
            lastPendingReward,
            TOKENS.TULIP.decimals
          );

        // Cache Tulip Info to FarmStore
        getStore('FarmStore').setFarm(farm.mintAddress, {
          tulipRewardPerShare,
          tulipRewardPerSlot,
          lastInteractionSlot
        });

        if (this.tokenAccounts[mintAddress]) {
          assign(this.tokenAccounts[mintAddress], {
            deposited: depositedAmount.toFixed(farm.decimals),

            // For V1 (Beta) users, there was no metadata account, so we will show `0` for them
            rewardSinceLastDeposit: Boolean(lastDepositedAmount) ? (depositedAmount - lastDepositedAmount) : 0,
            lastDepositedAmount,
            tulipEarned
          });

          // Set Token Account as valid; clears previously set invalid data, if any.
          this.setInvalidTokenAccount(mintAddress, false);
        } else {
          this.tokenAccounts[mintAddress] = {
            deposited: depositedAmount.toFixed(farm.decimals),

            // For V1 (Beta) users, there was no metadata account, so we will show `0` for them
            rewardSinceLastDeposit: Boolean(lastDepositedAmount) ? (depositedAmount - lastDepositedAmount) : 0,
            lastDepositedAmount,
            tulipEarned
          }

          // Token Account is only invalid if there is `depositedAmount`
          this.setInvalidTokenAccount(mintAddress, Boolean(depositedAmount));
        }

        getStore('UIStore').resetRefreshState();
      } catch (err) {
        console.error(farm.symbol, err);
      }
    });

    ORCA_FARMS.forEach(async (farm, index) => {
      let {
        userShares,
        isUserBalanceAccountValid,
        totalVaultBalance,
        totalVlpShares,
        totalLpTokens
      } = getStore('FarmStore').getFarm(farm.mintAddress) || {};

      try {
        if (!isUserBalanceAccountValid) {
          return;
        }

        let depositedAmount = 0;
        let lastDepositedAmount = 0;

        try{
          depositedAmount = ((userShares.mul(totalVaultBalance)).div(totalVlpShares)).toNumber() / Math.pow(10, farm.decimals);
          lastDepositedAmount = totalLpTokens?.toNumber() / Math.pow(10, farm.decimals);
        } catch (e) {
          depositedAmount = ((new anchor.BN(userShares.toString())
              .mul(new anchor.BN(totalVaultBalance.toString())))
              .div(new anchor.BN(totalVlpShares.toString())))
              .div(new anchor.BN(Math.pow(10, farm.decimals)))
              .toNumber();
          lastDepositedAmount = new anchor.BN(totalLpTokens?.toString()).div(new anchor.BN(Math.pow(10, farm.decimals))).toNumber();
        }


        if (this.tokenAccounts[farm.mintAddress]) {
          assign(this.tokenAccounts[farm.mintAddress], {
            deposited: depositedAmount.toFixed(farm.decimals),

            // For V1 (Beta) users, there was no metadata account, so we will show `0` for them
            rewardSinceLastDeposit: Boolean(lastDepositedAmount) ? (depositedAmount - lastDepositedAmount) : 0,
            lastDepositedAmount,
            tulipEarned: 0,
          });

          // Set Token Account as valid; clears previously set invalid data, if any.
          this.setInvalidTokenAccount(farm.mintAddress, false);
        } else {
          this.tokenAccounts[farm.mintAddress] = {
            deposited: depositedAmount.toFixed(farm.decimals),

            // For V1 (Beta) users, there was no metadata account, so we will show `0` for them
            rewardSinceLastDeposit: Boolean(lastDepositedAmount) ? (depositedAmount - lastDepositedAmount) : 0,
            lastDepositedAmount,
            tulipEarned: 0
          }

          // Token Account is only invalid if there is `depositedAmount`
          this.setInvalidTokenAccount(farm.mintAddress, Boolean(depositedAmount));
        }

        getStore('UIStore').resetRefreshState();
      } catch (err) {
        console.error(farm.symbol, err);
      }
    });

    getStore('UIStore').resetRefreshState();
  }

  setTokenAccounts () {
    const conn = window.$web3;

    return conn.getParsedTokenAccountsByOwner(
      this.wallet.publicKey,
      {
        programId: TOKEN_PROGRAM_ID
      },
      'confirmed'
    )
    .then(async (parsedTokenAccounts) => {
      const tokenAccounts = {};
      this.resetExistingMintAddresses();

      parsedTokenAccounts.value.forEach(
        (tokenAccountInfo) => {
          const tokenAccountAddress = tokenAccountInfo.pubkey.toBase58(),
            parsedInfo = tokenAccountInfo.account.data.parsed.info,
            mintAddress = parsedInfo.mint,
            balance = new TokenAmount(parsedInfo.tokenAmount.amount, parsedInfo.tokenAmount.decimals);

          this.setExistingMintAddress(mintAddress, true);

          if (Object.prototype.hasOwnProperty.call(tokenAccounts, mintAddress)) {
            if (tokenAccounts[mintAddress].balance.isNullOrZero()) {
              tokenAccounts[mintAddress] = {
                tokenAccountAddress,
                balance
              }
            }
          } else {
            tokenAccounts[mintAddress] = {
              tokenAccountAddress,
              balance
            }
          }
        }
      );

      try {
        const solBalance = await conn.getBalance(this.wallet.publicKey, 'confirmed');
        
        tokenAccounts[NATIVE_SOL.mintAddress] = {
          tokenAccountAddress: this.walletAddress,
          balance: new TokenAmount(solBalance, NATIVE_SOL.decimals)
        }

        this.tokenAccounts = tokenAccounts;
        // console.log('tokenAccounts:', tokenAccounts);
        this.setDepositedAmount();
      } catch(err) {
        console.log(err);
      }
    });
  }

  setWallet (wallet) {
    !isNil(wallet) && (this.wallet = wallet);

    getStore('UIStore').setIsRefreshing(true);

    this.setTokenAccounts();

    // Store userBalanceAccounts in FarmStore
    const walletToInitialize = {
      signTransaction: this.wallet?.signTransaction,
      signAllTransactions: this.wallet?.signAllTransactions,
      publicKey: new anchor.web3.PublicKey(this.wallet?.publicKey?.toBase58())
    };

    const provider = new anchor.Provider(window.$web3, walletToInitialize, { skipPreflight: true });
    anchor.setProvider(provider);


    FARMS.forEach(async (farm) => {
      const vaultProgramId = new anchor.web3.PublicKey(getVaultProgramId()),
        [ userBalanceAccount ] = await anchor.web3.PublicKey.findProgramAddress(
          [
            new anchor.web3.PublicKey(getVaultOldInfoAccount(farm.symbol)).toBytes(),
            provider.wallet.publicKey.toBytes(),
          ],
          vaultProgramId
        ),

        [ newUserBalanceAccount ] = await anchor.web3.PublicKey.findProgramAddress(
            [
              new anchor.web3.PublicKey(getVaultInfoAccount(farm.symbol)).toBytes(),
              provider.wallet.publicKey.toBytes(),
            ],
            vaultProgramId
        ),
        [ userBalanceMetadataAccount ] = await anchor.web3.PublicKey.findProgramAddress(
          [
            userBalanceAccount.toBuffer(),
            provider.wallet.publicKey.toBytes(),
          ],
          vaultProgramId
        ),
        [ tulipRewardMetadataAccount ] = await anchor.web3.PublicKey.findProgramAddress(
            [
              userBalanceMetadataAccount.toBytes(),
              provider.wallet.publicKey.toBytes()
            ],
            vaultProgramId,
        );

      let userFarm;

      if (!isNil(farm.marginIndex)) {
        [userFarm] = await findUserFarmAddress(
          provider.wallet.publicKey,
          new anchor.web3.PublicKey(getLendingFarmProgramId()),
          new anchor.BN(0),
          new anchor.BN(farm.marginIndex)
        );
      }

      const mintAddress = (
        farm.symbol === 'RAY-SRM-DUAL' ? `${farm.mintAddress}0` : farm.mintAddress
      );

      getStore('FarmStore').setFarm(mintAddress, {
        userBalanceAccount,
        newUserBalanceAccount,
        userBalanceMetadataAccount,
        tulipRewardMetadataAccount,
        userFarm
      });
    });

    ORCA_FARMS.forEach(async (farm) => {
      const orcaVaultProgramId = new anchor.web3.PublicKey(getOrcaVaultProgramId());
      let [orcaVaultUserAccountAddress, _] = await deriveVaultUserAccount(
          new anchor.web3.PublicKey(getOrcaVaultAccount(farm.symbol)),
          provider.wallet.publicKey,
          orcaVaultProgramId,
      );

      let userFarm;

      if (!isNil(farm.marginIndex)) {
        [userFarm] = await findUserFarmAddress(
            provider.wallet.publicKey,
            new anchor.web3.PublicKey(getLendingFarmProgramId()),
            new anchor.BN(0),
            new anchor.BN(farm.marginIndex)
        );
      }

      getStore('FarmStore').setFarm(farm.mintAddress, {
        orcaVaultUserAccountAddress,
        userFarm
      });
    })
  }

  clearWallet () {
    this.wallet = null;
  }

  get walletAddress () {
    return this.wallet?.publicKey?.toBase58();
  }

  get totalDeposited () {
    let totalSum = 0;
    const farmMintAddresses = map(ALL_VAULT_FARMS, (farm) => {
      const mintAddress = (
        farm.symbol === 'RAY-SRM-DUAL' ? `${farm.mintAddress}0` : farm.mintAddress
      );

      return mintAddress;
    });
    
    forEach(this.tokenAccounts, (tokenAccount, mintAddress) => {
      if (!tokenAccount.deposited) {
        return;
      }

      // If this deposit amount is not for a vault, then skip adding this.
      if (!farmMintAddresses.includes(mintAddress)) {
        return;
      }

      const { price = 0 } = getStore('FarmStore')?.getFarm(mintAddress) || {};

      totalSum += tokenAccount.deposited * price;
    });

    return totalSum;
  }

  get totalReservesDeposited () {
    let totalSum = 0;
    const reserveCollateralTokenMintAddresses = map(LENDING_RESERVES, (reserve) => reserve.collateralTokenMint);
    
    forEach(this.tokenAccounts, (tokenAccount, collateralTokenMint) => {
      // If this deposit amount is not for a reserve, then skip adding this.
      if (!reserveCollateralTokenMintAddresses.includes(collateralTokenMint)) {
        return;
      }
      
      if (!tokenAccount.balance) {
        return;
      }

      const reserve = getReserveByCollateralTokenMint(collateralTokenMint),
        { getTokenPrice = noop } = getStore('PriceStore') || {},
        price = getTokenPrice(reserve.name);

      const { getReserve } = getStore('ReserveStore');
      const {
        totalSupply,
        uiAmount
      } = getReserve(reserve.mintAddress) || {};

      const depositedAmount = (Number(tokenAccount.balance.fixed()) * (Number(totalSupply))) / uiAmount;

      if (depositedAmount) {
        totalSum += depositedAmount * price;
      }
    });

    return totalSum;
  }

  get totalTulipPending () {
    let totalSum = 0;
    
    forEach(this.tokenAccounts, (tokenAccount) => {
      if (!tokenAccount.tulipEarned) {
        return;
      }

      totalSum += tokenAccount.tulipEarned;
    });

    return totalSum;
  }

  hasTulipRewardPending (assetSymbol) {
    const { mintAddress } = getFarmBySymbol(assetSymbol) || {};

    return Boolean(this.tokenAccounts[mintAddress]?.tulipEarned);
  }

  isLowOnSolBalance (minBalanceRequired) {
    if (!this.wallet || !this.tokenAccounts[NATIVE_SOL.mintAddress]) {
      return false;
    }

    return Number(this.tokenAccounts[NATIVE_SOL.mintAddress]?.balance?.fixed()) < minBalanceRequired;
  }
}