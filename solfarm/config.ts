/* eslint-disable @typescript-eslint/no-var-requires */
import anchor from "@project-serum/anchor";
import { concat, find } from "lodash";

import {
  AMM_INFO_LAYOUT_V4,
  STAKE_INFO_LAYOUT,
  STAKE_INFO_LAYOUT_V4,
} from "../utils/layouts";
import { LENDING_RESERVES } from "./lendingReserves";
const config = require("../idl/info.json");
const lendConfig = require("../idl/lending_info.json");
const saberConfig = require("../idl/saber_info.json");
const orcaConfig = require("../idl/orca_info.json");

export const getVaultProgramId = () => config.programId;
export const getTokenProgramId = () => config.rayTokenProgramId;
export const getSaberVaultProgramId = () => saberConfig.programs.vault.id;
export const getOrcaVaultProgramId = () => orcaConfig.programs.vault.id;

const vaultAccounts = concat(
  config.vault.accounts,
  saberConfig.vault.accounts,
  orcaConfig.vault.accounts
);

const farmAccounts = concat(config.farms, saberConfig.farms, orcaConfig.farms);

//#region Vault getters
export const getVaultInfoAccount = (name) => {
  const vaultAccount = find(vaultAccounts, (account) => account.name === name);

  return vaultAccount?.infoAccount;
};

export const getVaultOldInfoAccount = (name) => {
  const vaultAccount = find(vaultAccounts, (account) => account.name === name);

  return vaultAccount?.oldInfoAccount;
};

export const getVaultAccount = (name) => {
  const vaultAccount = find(vaultAccounts, (account) => account.name === name);

  return vaultAccount?.account;
};

export const getVaultLpTokenAccount = (name) => {
  const vaultAccount = find(vaultAccounts, (account) => account.name === name);

  return vaultAccount?.lpTokenAccount;
};

export const getVaultPdaAccount = (name) => {
  const vaultAccount = find(vaultAccounts, (account) => account.name === name);

  return vaultAccount?.pdaAccount;
};

export const getVaultRewardAccountA = (name) => {
  const vaultAccount = find(vaultAccounts, (account) => account.name === name);

  return vaultAccount?.rewardAccountA;
};

export const getVaultRewardAccountB = (name) => {
  const vaultAccount = find(vaultAccounts, (account) => account.name === name);

  return vaultAccount?.rewardAccountB;
};

export const getVaultVersion = (name) => {
  const vaultAccount = find(vaultAccounts, (account) => account.name === name);

  return vaultAccount?.rayPoolVersion;
};

export const getVaultTulipTokenAccount = (name) => {
  const vaultAccount = find(vaultAccounts, (account) => account.name === name);

  return vaultAccount?.vaultTulipTokenAccount;
};

export const getVaultTulipRewardPerSlot = (name) => {
  const vaultAccount = find(vaultAccounts, (account) => account.name === name);

  return vaultAccount?.tulipRewardPerSlot;
};

export const getVaultTulipRewardEndSlot = (name) => {
  const vaultAccount = find(vaultAccounts, (account) => account.name === name);

  return vaultAccount?.tulipRewardEndSlot;
};

export const getVaultTulipMint = (name) => {
  const vaultAccount = find(vaultAccounts, (account) => account.name === name);

  return vaultAccount?.tulipMint;
};

export const getVaultSerumOpenOrdersAccount = (name) => {
  const vaultAccount = find(vaultAccounts, (account) => account.name === name);

  return vaultAccount?.serumOpenOrdersAccount;
};

export const getVaultSerumVaultSigner = (name) => {
  const vaultAccount = find(vaultAccounts, (account) => account.name === name);

  return vaultAccount?.serumVaultSigner;
};

export const getVaultStakeLayout = (name) => {
  return isVersionFourOrFive(name) ? STAKE_INFO_LAYOUT_V4 : STAKE_INFO_LAYOUT;
};

export const getVaultAmmLayout = (name) => {
  return isVersionFourOrFive(name) ? AMM_INFO_LAYOUT_V4 : AMM_INFO_LAYOUT_V4;
};

export const isVersionFourOrFive = (name) => {
  const vaultVersion = getVaultVersion(name);

  return ["4", "5"].includes(vaultVersion);
};
//#endregion

//#region Saber Vault getters
export const getSaberVaultInfoAccount = (name) => {
  const vaultAccount = find(
    saberConfig.vault.accounts,
    (account) => account.name === name
  );

  return vaultAccount?.infoAccount;
};

export const getSaberVaultAccount = (name) => {
  const vaultAccount = find(
    saberConfig.vault.accounts,
    (account) => account.name === name
  );

  return vaultAccount?.account;
};

export const getSaberVaultTempLpTokenAccount = (name) => {
  const vaultAccount = find(
    saberConfig.vault.accounts,
    (account) => account.name === name
  );

  return vaultAccount?.vault_temp_lp_token_account;
};

export const getSaberVaultLpTokenMint = (name) => {
  const vaultAccount = find(
    saberConfig.vault.accounts,
    (account) => account.name === name
  );

  return vaultAccount?.saber_farm_lp_token_mint;
};

export const getSaberVaultPdaAccount = (name) => {
  const vaultAccount = find(
    saberConfig.vault.accounts,
    (account) => account.name === name
  );

  return vaultAccount?.vault_pda_signer;
};

export const getSaberVaultRewardAccount = (name) => {
  const vaultAccount = find(
    saberConfig.vault.accounts,
    (account) => account.name === name
  );

  return vaultAccount?.vault_saber_rewards_token_account;
};

export const getSaberVaultLandlord = (name) => {
  const vaultAccount = find(
    saberConfig.vault.accounts,
    (account) => account.name === name
  );

  return vaultAccount?.saber_farm_landlord;
};

export const getSaberVaultFarmProgram = (name) => {
  const vaultAccount = find(
    saberConfig.vault.accounts,
    (account) => account.name === name
  );

  return vaultAccount?.saber_farm_program;
};

export const getSaberVaultSunnyFarmProgram = (name) => {
  const vaultAccount = find(
    saberConfig.vault.accounts,
    (account) => account.name === name
  );

  return vaultAccount?.sunny_farm_program;
};

export const getSaberVaultFarmPlot = (name) => {
  const vaultAccount = find(
    saberConfig.vault.accounts,
    (account) => account.name === name
  );

  return vaultAccount?.saber_farm_plot;
};

export const getSaberVaultCoinTokenAccount = (name) => {
  const vaultAccount = find(
    saberConfig.vault.accounts,
    (account) => account.name === name
  );

  return vaultAccount?.saber_coin_token_account;
};

export const getSaberVaultPcTokenAccount = (name) => {
  const vaultAccount = find(
    saberConfig.vault.accounts,
    (account) => account.name === name
  );

  return vaultAccount?.saber_pc_token_account;
};

export const getSaberAssociatedVaultFarmerAccount = (name) => {
  const vaultAccount = find(
    saberConfig.vault.accounts,
    (account) => account.name === name
  );

  return vaultAccount?.associated_vault_farmer_account;
};

export const getSaberFarmVaultLpTokenAccount = (name) => {
  const vaultAccount = find(
    saberConfig.vault.accounts,
    (account) => account.name === name
  );
  return vaultAccount?.vault_farm_lp_token_account;
};
//#endregion

export const getSaberFarmSunnyPool = (name) => {
  const vaultAccount = find(
    saberConfig.vault.accounts,
    (account) => account.name === name
  );
  return vaultAccount?.sunny_pool;
};

export const getSaberFarmSunnyVaultAccount = (name) => {
  const vaultAccount = find(
    saberConfig.vault.accounts,
    (account) => account.name === name
  );
  return vaultAccount?.sunny_vault_account;
};

export const getSaberFarmSunnyVaultFarmTokenAccount = (name) => {
  const vaultAccount = find(
    saberConfig.vault.accounts,
    (account) => account.name === name
  );
  return vaultAccount?.sunny_vault_farm_token_account;
};

export const getSaberFarmSunnyVaultLpTokenAccount = (name) => {
  const vaultAccount = find(
    saberConfig.vault.accounts,
    (account) => account.name === name
  );
  return vaultAccount?.sunny_vault_lp_token_account;
};

export const getSaberFarmSunnyFarmer = (name) => {
  const vaultAccount = find(
    saberConfig.vault.accounts,
    (account) => account.name === name
  );
  return vaultAccount?.sunny_vault_farmer_account;
};

export const getSaberFarmSunnyFarmerVault = (name) => {
  const vaultAccount = find(
    saberConfig.vault.accounts,
    (account) => account.name === name
  );
  return vaultAccount?.sunny_vault_farmer_lp_token_account;
};

export const getSaberFarmSunnyFarmTokenAccount = (name) => {
  const vaultAccount = find(
    saberConfig.vault.accounts,
    (account) => account.name === name
  );
  return vaultAccount?.sunny_vault_farm_token_account;
};

export const getSaberFarmSunnyMineProgram = (name) => {
  const vaultAccount = find(
    saberConfig.vault.accounts,
    (account) => account.name === name
  );
  return vaultAccount?.sunny_mine_program;
};

export const getSaberFarmSunnyFarmMint = (name) => {
  const vaultAccount = find(
    saberConfig.vault.accounts,
    (account) => account.name === name
  );
  return vaultAccount?.sunny_farm_mint;
};

export const getSaberFarmSunnyRewarder = (name) => {
  const vaultAccount = find(
    saberConfig.vault.accounts,
    (account) => account.name === name
  );
  return vaultAccount?.sunny_rewarder;
};

export const getSaberFarmSunnyQuarry = (name) => {
  const vaultAccount = find(
    saberConfig.vault.accounts,
    (account) => account.name === name
  );
  return vaultAccount?.sunny_quarry;
};

export const getSaberFarmSunnyMiner = (name) => {
  const vaultAccount = find(
    saberConfig.vault.accounts,
    (account) => account.name === name
  );
  return vaultAccount?.sunny_vault_miner_account;
};

export const getSaberFarmSunnyMinerVault = (name) => {
  const vaultAccount = find(
    saberConfig.vault.accounts,
    (account) => account.name === name
  );
  return vaultAccount?.sunny_vault_miner_farm_token_account;
};

export const getSaberFarmQuarryMiner = (name) => {
  const vaultAccount = find(
    saberConfig.vault.accounts,
    (account) => account.name === name
  );
  return vaultAccount?.quarry_miner;
};

export const getSaberFarmQuarry = (name) => {
  const vaultAccount = find(
    saberConfig.vault.accounts,
    (account) => account.name === name
  );
  return vaultAccount?.quarry;
};

export const getSaberFarmQuarryMinerVault = (name) => {
  const vaultAccount = find(
    saberConfig.vault.accounts,
    (account) => account.name === name
  );
  return vaultAccount?.quarry_miner_vault;
};

export const getSaberFarmQuarryRewarder = (name) => {
  return "rXhAofQCT7NN9TUqigyEAUzV1uLL4boeD8CRkNBSkYk";
};

//#region Orca Vault getters
export const getOrcaVaultAccount = (name) => {
  const vaultAccount = find(
    orcaConfig.vault.accounts,
    (account) => account.name === name
  );

  return vaultAccount?.account;
};

export const getOrcaVaultLpAccount = (name) => {
  const vaultAccount = find(
    orcaConfig.vault.accounts,
    (account) => account.name === name
  );

  return vaultAccount?.farm_token_account;
};

export const getOrcaVaultFarmMint = (name) => {
  const vaultAccount = find(
    orcaConfig.vault.accounts,
    (account) => account.name === name
  );

  return vaultAccount?.farm_token_mint;
};

export const getOrcaVaultGlobalBaseTokenVault = (name) => {
  const vaultAccount = find(
    orcaConfig.vault.accounts,
    (account) => account.name === name
  );

  return vaultAccount?.global_base_token_vault;
};

export const getOrcaVaultGlobalFarm = (name) => {
  const vaultAccount = find(
    orcaConfig.vault.accounts,
    (account) => account.name === name
  );

  return vaultAccount?.global_farm;
};

export const getOrcaVaultGlobalRewardTokenVault = (name) => {
  const vaultAccount = find(
    orcaConfig.vault.accounts,
    (account) => account.name === name
  );

  return vaultAccount?.global_reward_token_vault;
};

export const getOrcaVaultConvertAuthority = (name) => {
  const vaultAccount = find(
    orcaConfig.vault.accounts,
    (account) => account.name === name
  );

  return vaultAccount?.convert_authority;
};

export const getOrcaVaultLpMint = (name) => {
  const vaultAccount = find(
    orcaConfig.vault.accounts,
    (account) => account.name === name
  );

  return vaultAccount?.swap_pool_token_mint;
};

export const getOrcaVaultSwapPoolTokenAccount = (name) => {
  const vaultAccount = find(
    orcaConfig.vault.accounts,
    (account) => account.name === name
  );

  return vaultAccount?.swap_pool_token_account;
};

export const getOrcaVaultRewardMint = (name) => {
  const vaultAccount = find(
    orcaConfig.vault.accounts,
    (account) => account.name === name
  );

  return vaultAccount?.reward_token_mint;
};

export const getOrcaVaultFeeAccount = (name) => {
  const vaultAccount = find(
    orcaConfig.vault.accounts,
    (account) => account.name === name
  );

  return vaultAccount?.orca_fee_account;
};

export const getOrcaFarmPoolId = (name) => {
  const farm = find(orcaConfig.farms, (farm) => farm.name === name);

  return farm?.poolId;
};

export const getOrcaLpMintAddress = (name) => {
  const farm = find(orcaConfig.farms, (farm) => farm.name === name);

  return farm?.lpMintAddress;
};

export const getOrcaFarmPoolLpTokenAccount = (name) => {
  const farm = find(orcaConfig.farms, (farm) => farm.name === name);

  return farm?.poolLpTokenAccount;
};

export const getOrcaFarmPoolCoinTokenaccount = (name) => {
  const farm = find(orcaConfig.farms, (farm) => farm.name === name);

  return farm?.poolCoinTokenaccount;
};

export const getOrcaFarmPoolPcTokenaccount = (name) => {
  const farm = find(orcaConfig.farms, (farm) => farm.name === name);

  return farm?.poolPcTokenaccount;
};

export const getOrcaFarmAmmId = (name) => {
  const farm = find(orcaConfig.farms, (farm) => farm.name === name);

  return farm?.ammId;
};

export const getOrcaFarmAmmAuthority = (name) => {
  const farm = find(orcaConfig.farms, (farm) => farm.name === name);

  return farm?.ammAuthority;
};

export const getOrcaFarmAmmOpenOrders = (name) => {
  const farm = find(orcaConfig.farms, (farm) => farm.name === name);

  return farm?.ammOpenOrders;
};
//#endregion

//#region Farm getters
export const getFarmProgramId = (name) => {
  const farm = find(farmAccounts, (farm) => farm.name === name);

  return farm?.programId;
};

export const getFarmPoolId = (name) => {
  const farm = find(farmAccounts, (farm) => farm.name === name);

  return farm?.poolId;
};

export const getFarmPoolAuthority = (name) => {
  const farm = find(farmAccounts, (farm) => farm.name === name);

  return farm?.poolAuthority;
};

export const getFarmLpMintAddress = (name) => {
  const farm = find(farmAccounts, (farm) => farm.name === name);

  return farm?.lpMintAddress;
};

export const getFarmPoolLpTokenAccount = (name) => {
  const farm = find(farmAccounts, (farm) => farm.name === name);

  return farm?.poolLpTokenAccount;
};

export const getFarmPoolRewardATokenAccount = (name) => {
  const farm = find(farmAccounts, (farm) => farm.name === name);

  return farm?.poolRewardATokenAccount;
};

export const getFarmPoolRewardBTokenAccount = (name) => {
  const farm = find(farmAccounts, (farm) => farm.name === name);

  return farm?.poolRewardBTokenAccount;
};

export const getFarmFusion = (name) => {
  const farm = find(farmAccounts, (farm) => farm.name === name);

  return farm?.fusion;
};

export const getFarmPoolCoinTokenaccount = (name) => {
  const farm = find(farmAccounts, (farm) => farm.name === name);

  return farm?.poolCoinTokenaccount;
};

export const getFarmPoolPcTokenaccount = (name) => {
  const farm = find(farmAccounts, (farm) => farm.name === name);

  return farm?.poolPcTokenaccount;
};

export const getFarmAmmId = (name) => {
  const farm = find(farmAccounts, (farm) => farm.name === name);

  return farm?.ammId;
};

export const getFarmAmmOpenOrders = (name) => {
  const farm = find(farmAccounts, (farm) => farm.name === name);

  return farm?.ammOpenOrders;
};

export const getFarmSerumProgramId = (name) => {
  const farm = find(farmAccounts, (farm) => farm.name === name);

  return farm?.serumProgramId;
};
//#endregion

//#region Lending Info getters
export const getLendingProgramId = () => lendConfig.programs.lending.id;

export const getLendingFarmProgramId = () => lendConfig.programs.farm.id;

export const getLendingMarketAccount = () =>
  lendConfig.lending.lending_market_account;

export const getLendingFarmManagementAccount = () =>
  lendConfig.farm.global_account;

export const getLendingFarmAccount = (name: string) =>
  find(lendConfig.farm.farms, (farm) => farm.name === name);

export const getLendingReserve = (name: string) =>
  find(lendConfig.lending.reserves, (reserve) => reserve.name === name);

export const getLendingReserveFromKey = (key: string) =>
  find(lendConfig.lending.reserves, (reserve) => reserve.account === key);

export const getPriceFeedsForReserve = (name: string) =>
  find(lendConfig.pyth.price_feeds, (priceFeed) => priceFeed.name === name);

export const isSupportedLendingFarm = (name: string) =>
  Boolean(find(lendConfig.farm.farms, (farm) => farm.name === name));

export const getLendingReserveByAccount = (account: string) =>
  find(lendConfig.lending.reserves, (reserve) => reserve.account === account);
//#endregion
export const FARM_PLATFORMS = {
  RAYDIUM: "raydium",
  SABER: "saber",
  ORCA: "orca",
};

export const getReserveByName = (name: string) =>
  find(LENDING_RESERVES, (reserve) => reserve.name === name);

export const TOKEN_PROGRAM_ID = new anchor.web3.PublicKey(
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
);
export const AQUAFARM_PROGRAM_ID = new anchor.web3.PublicKey(
  "82yxjeMsvaURa4MbZZ7WZZHfobirZYkH1zF8fmeGtyaQ"
);

export async function deriveVaultUserAccount(
  vaultAccount: { toBuffer: () => Buffer | Uint8Array },
  authority: { toBuffer: () => Buffer | Uint8Array },
  program: anchor.web3.PublicKey
) {
  return anchor.web3.PublicKey.findProgramAddress(
    [vaultAccount.toBuffer(), authority.toBuffer()],
    program
  );
}

export function getOrcaPeriodRate(
  globalFarm,
  totalLiquidity,
  decimals,
  orcaPrice
) {
  return new Decimal(globalFarm.emissionsPerSecondNumerator.toString())
      .mul(60 * 60 * 24 * 100) // the 100 here is divided by 10 as its divided later, in the SDK it was 1000
      .div(globalFarm.emissionsPerSecondDenominator.toString())
      .div(totalLiquidity)
      .div(new Decimal(10).pow(decimals))
      .mul(orcaPrice).toNumber();
}
