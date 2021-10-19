import { isNil,  assign,  map,  } from 'lodash';
import {TokenAmount} from "../../utils/token-amount"
import * as anchor from '@project-serum/anchor';
import { MARKET_STATE_LAYOUT_V2 as  _MARKET_STATE_LAYOUT_V2,  OpenOrders } from '@project-serum/serum/lib/market.js';
import * as web3js from "@solana/web3.js";
import { MINT_LAYOUT, VAULT_LAYOUT, ACCOUNT_LAYOUT, GLOBAL_FARM_DATA_LAYOUT } from '../../utils/layouts';
import { TOKENS } from '../../utils/tokens';
import { getOrcaVaultProgramId, getVaultAccount, getFarmPoolId, getFarmPoolLpTokenAccount, getFarmPoolCoinTokenaccount, getFarmPoolPcTokenaccount, getFarmAmmId, getFarmAmmOpenOrders, getOrcaVaultAccount, getOrcaFarmPoolCoinTokenaccount, getOrcaFarmPoolPcTokenaccount, getOrcaVaultGlobalFarm, getVaultStakeLayout, isVersionFourOrFive, getVaultAmmLayout, getFarmSerumProgramId, FARM_PLATFORMS, isSupportedLendingFarm, getOrcaPeriodRate } from '../config';
import { FARMS } from '../farms/farm';
import {ORCA_FARMS} from "../farms/orcaFarms"
import { getMultipleAccountsGrouped } from '../multipleAccount';
import { commitment } from '../tulipService';

const NUMBER_OF_PERIODS_IN_A_WEEK = 24 * 7,
  NUMBER_OF_PERIODS_IN_A_YEAR = 24 * 365;

import { orcaConfig } from "../idl/orca_idl";

const getAPY = (periodicRate: number, numberOfPeriods: number) => {
  return (Math.pow((1 + (periodicRate/100)), numberOfPeriods) - 1);
}


const getPerBlockAmountTotalValue = (perBlockAmount: number, price: number) => {
  return (
    perBlockAmount  *
    2 *
    60 *
    60 *
    24 *
    365 *
    price
  );
}

export default class FarmStore {
  farms: {};
  web3: undefined;
  priceStore: any;
  constructor (web3: anchor.web3.Connection | undefined, priceStore: any) {
    this.farms = {};
    this.web3 = web3;
    this.priceStore = priceStore;

    this.getFarm = this.getFarm.bind(this);

    this.setPrice();
  }

  getFarm (mintAddress: string | number) {
    debugger
    return this.farms[mintAddress];
  }

  setFarm (mintAddress: string, farmDetails: { dailyAPR: number; price: number; weeklyAPY: number; yearlyAPY: number; yieldBreakdown: { dailyYield: number; weeklyYield: number; yearlyYield: number; dailyTradingFees: number; } | { dailyYield: number; weeklyYield: number; yearlyYield: number; dailyTradingFees: number; }; tulipAPR: number; baseTokenTotal?: any; quoteTokenTotal?: any; needTakePnlCoin?: any; needTakePnlPc?: any; tvl: number; totalVaultBalance: any; totalVlpShares: any; coinInLp: number | undefined; pcInLp: number | undefined; coinToPcRatio?: number | undefined; }) {
    if (!mintAddress || isNil(farmDetails)) {
      return;
    }

    !this.farms[mintAddress] && (this.farms[mintAddress] = {});

    assign(this.farms[mintAddress], farmDetails);
  }

  async setPrice () {

    const walletToInitialize = {
      signTransaction: () => {},
      signAllTransactions: () => {},
      publicKey: new anchor.web3.Account().publicKey
    };
    // @ts-ignore
    const provider = new anchor.Provider(this.web3, walletToInitialize, { skipPreflight: true });


    const orcaVaultProgramId = new anchor.web3.PublicKey(getOrcaVaultProgramId());
    const orcaVaultProgram = new anchor.Program(orcaConfig, orcaVaultProgramId, provider);

    // const pairs = await PriceFetcherService.fetchAll();
    const { getTokenPrice, getPair } = this.priceStore;
    
    // Raydium
    const vaultAccounts = map(FARMS, (farm) => new anchor.web3.PublicKey(getVaultAccount(farm.symbol)));
    const mintAddresses = map(FARMS, (farm) => new anchor.web3.PublicKey(farm.mintAddress));
    const poolIds = map(FARMS, (farm) => new anchor.web3.PublicKey(getFarmPoolId(farm.symbol)));
    const poolLpTokenAccounts = map(FARMS, (farm) => new anchor.web3.PublicKey(getFarmPoolLpTokenAccount(farm.symbol)));
    const poolCoinTokenaccounts = map(FARMS, (farm) => new anchor.web3.PublicKey(getFarmPoolCoinTokenaccount(farm.symbol)));
    const poolPcTokenaccounts = map(FARMS, (farm) => new anchor.web3.PublicKey(getFarmPoolPcTokenaccount(farm.symbol)));
    const ammIdAccounts = map(FARMS, (farm) => new anchor.web3.PublicKey(getFarmAmmId(farm.symbol)));
    const ammOpenOrdersAccounts = map(FARMS, (farm) => new anchor.web3.PublicKey(getFarmAmmOpenOrders(farm.symbol)));

    // Orca
    const orcaVaultAccounts = map(ORCA_FARMS, (farm) => new anchor.web3.PublicKey(getOrcaVaultAccount(farm.symbol)));
    const orcaMintAddresses = map(ORCA_FARMS, (farm) => new anchor.web3.PublicKey(farm.mintAddress));
    // const orcaPoolIds = map(ORCA_FARMS, (farm) => new anchor.web3.PublicKey(getOrcaFarmPoolId(farm.symbol)));
    // const orcaPoolLpTokenAccounts = map(ORCA_FARMS, (farm) => new anchor.web3.PublicKey(getOrcaFarmPoolLpTokenAccount(farm.symbol)));
    const orcaPoolCoinTokenaccounts = map(ORCA_FARMS, (farm) => new anchor.web3.PublicKey(getOrcaFarmPoolCoinTokenaccount(farm.symbol)));
    const orcaPoolPcTokenaccounts = map(ORCA_FARMS, (farm) => new anchor.web3.PublicKey(getOrcaFarmPoolPcTokenaccount(farm.symbol)));
    const orcaGlobalFarms = map(ORCA_FARMS, (farm) => new anchor.web3.PublicKey(getOrcaVaultGlobalFarm(farm.symbol)));
    // const orcaAmmIdAccounts = map(ORCA_FARMS, (farm) => new anchor.web3.PublicKey(getOrcaFarmAmmId(farm.symbol)));
    // const orcaAmmOpenOrdersAccounts = map(ORCA_FARMS, (farm) => new anchor.web3.PublicKey(getOrcaFarmAmmOpenOrders(farm.symbol)));
    const accountDetailsToFetch = [
        // Raydium
        vaultAccounts,
        mintAddresses,
        poolIds,
        poolLpTokenAccounts,
        poolCoinTokenaccounts,
        poolPcTokenaccounts,
        ammIdAccounts,
        ammOpenOrdersAccounts,

        // Orca
        orcaVaultAccounts,
        orcaMintAddresses,
        // orcaPoolIds,
        // orcaPoolLpTokenAccounts,
        orcaPoolCoinTokenaccounts,
        orcaPoolPcTokenaccounts,
        orcaGlobalFarms
        // orcaAmmIdAccounts,
        // orcaAmmOpenOrdersAccounts,
      ],
      [
        // Raydium
        vaultAccountsInfo,
        tokenSupplyForAllFarms,
        poolInfo,
        poolLpTokenAccountsInfo,
        poolCoinTokenaccountsInfo,
        poolPcTokenaccountsInfo,
        ammIdAccountsInfo,
        ammOpenOrdersAccountsInfo,

        // Orca
        orcaVaultAccountsInfo,
        orcaMintAddressesInfo,
        // orcaPoolIdsInfo,
        // orcaPoolLpTokenAccountsInfo,
        orcaPoolCoinTokenaccountsInfo,
        orcaPoolPcTokenaccountsInfo,
        orcaGlobalFarmsInfo,
        // orcaAmmIdAccountsInfo,
        // orcaAmmOpenOrdersAccountsInfo,

      ] = await getMultipleAccountsGrouped(this.web3, accountDetailsToFetch, commitment),
      tulipPrice = getTokenPrice(TOKENS.TULIP.symbol);

    //#region Raydium Farms
    tokenSupplyForAllFarms.forEach((tokenSupply, index) => {
      const farm = FARMS[index];
      const decodedTokenData = MINT_LAYOUT.decode(tokenSupply.account.data);
      const uiAmount = decodedTokenData.supply / Math.pow(10, decodedTokenData.decimals);
      const vaultAccountInfo = vaultAccountsInfo[index];
      const decodedVaultAccountData = VAULT_LAYOUT.decode(vaultAccountInfo.account.data);
      const { totalVaultBalance, totalVlpShares } = decodedVaultAccountData;
      const farmDetails = getPair(farm.mintAddress) || {},
          currentPoolInfo = poolInfo[index],
          currentPoolLayout = getVaultStakeLayout(farm.symbol),
          isPoolVersionFourOrFive = isVersionFourOrFive(farm.symbol),
          decodedPoolInfo = currentPoolLayout.decode(currentPoolInfo.account.data),
          poolLpTokenAccountInfo = poolLpTokenAccountsInfo[index],
          decodedPoolLpTokenAccountInfo = ACCOUNT_LAYOUT.decode(poolLpTokenAccountInfo.account.data),
          decodedPoolCoinTokenaccountInfo = ACCOUNT_LAYOUT.decode(poolCoinTokenaccountsInfo[index].account.data),
          decodedPoolPcTokenaccountInfo = ACCOUNT_LAYOUT.decode(poolPcTokenaccountsInfo[index].account.data),
          currentAmmLayout = getVaultAmmLayout(farm.symbol),
          currentAmmInfo = ammIdAccountsInfo[index],
          decodedAmmInfo = currentAmmLayout.decode(currentAmmInfo.account.data),
          OPEN_ORDERS_LAYOUT = OpenOrders.getLayout(new web3js.PublicKey(getFarmSerumProgramId(farm.symbol))),
          decodedAmmOpenOrdersInfo = OPEN_ORDERS_LAYOUT.decode(ammOpenOrdersAccountsInfo[index].account.data),
          { baseTokenTotal, quoteTokenTotal } = decodedAmmOpenOrdersInfo,
          { needTakePnlCoin, needTakePnlPc } = decodedAmmInfo;

      let price,
        rewardPerBlockAmount,
        rewardBPerBlockAmount,
        rewardPerBlockAmountTotalValue,
        rewardBPerBlockAmountTotalValue,
        totalAPY,
        poolCoinAmount,
        poolPCAmount,
        coinInLp,
        pcInLp;

      if (farm.singleStake) {
        price = Number(getTokenPrice(farm.symbol));
      } else {
        poolCoinAmount = new TokenAmount(0, farm.coin.decimals);
        poolPCAmount = new TokenAmount(0, farm.pc.decimals);

        poolCoinAmount.wei = poolCoinAmount.wei.plus(decodedPoolCoinTokenaccountInfo.amount.toString())
        poolPCAmount.wei = poolPCAmount.wei.plus(decodedPoolPcTokenaccountInfo.amount.toString())

        poolCoinAmount.wei = poolCoinAmount.wei.plus(baseTokenTotal.toString())
        poolPCAmount.wei = poolPCAmount.wei.plus(quoteTokenTotal.toString())

        poolCoinAmount.wei = poolCoinAmount.wei.minus(needTakePnlCoin.toString())
        poolPCAmount.wei = poolPCAmount.wei.minus(needTakePnlPc.toString())

        coinInLp = Number(poolCoinAmount.fixed()) / uiAmount;
        pcInLp = Number(poolPCAmount.fixed()) / uiAmount;


        price = (coinInLp * Number(getTokenPrice(farm.coin.symbol))) + (pcInLp * Number(getTokenPrice(farm.pc.symbol)));
      }

      const priceBN = new anchor.BN(price);
      if (isPoolVersionFourOrFive) {
        const { perBlock, perBlockB } = decodedPoolInfo,
          { reward, rewardB } = farm;

        rewardPerBlockAmount = new TokenAmount(perBlock.toString(), reward.decimals);
        rewardBPerBlockAmount = new TokenAmount(perBlockB.toString(), rewardB.decimals);

        rewardPerBlockAmountTotalValue = getPerBlockAmountTotalValue(
            rewardPerBlockAmount.toEther().toNumber(),
            getTokenPrice(reward.symbol)
          );

        rewardBPerBlockAmountTotalValue = getPerBlockAmountTotalValue(
            rewardBPerBlockAmount.toEther().toNumber(),
            getTokenPrice(rewardB.symbol)
          );

        // const liquidityInTokens = new anchor.BN(decodedPoolLpTokenAccountInfo.amount.toString()).div(new anchor.BN(Math.pow(10, farm.decimals)));
        // console.log("$$$ farmstore liquidity", farm.symbol, price)
        let liquidityInUsd = 0;
        let apyA = 0;
        let apyB = 0;
        try {
          // @ts-ignore
          liquidityInUsd = new anchor.BN(new anchor.BN(decodedPoolLpTokenAccountInfo.amount.toString()) * price).div(new anchor.BN(Math.pow(10, farm.decimals)));
          apyA = (100 * rewardPerBlockAmountTotalValue) / liquidityInUsd;
          apyB = (100 * rewardBPerBlockAmountTotalValue) / liquidityInUsd;
        } catch (e) {
          // @ts-ignore
          liquidityInUsd = (new anchor.BN(decodedPoolLpTokenAccountInfo.amount.toString()).div(new anchor.BN(Math.pow(10, farm.decimals)))) * price;
          apyA = (100 * rewardPerBlockAmountTotalValue) / liquidityInUsd;
          apyB = (100 * rewardBPerBlockAmountTotalValue) / liquidityInUsd;
        }
        // console.log("$$$ apy data ", farm.symbol, apyA, apyB, liquidityInUsd);
        if (reward && rewardB) {
          totalAPY = (apyA + apyB);
        } else {
          totalAPY = apyA;
        }
      } else {
        const { rewardPerBlock } = decodedPoolInfo;

        rewardPerBlockAmount = new TokenAmount(rewardPerBlock.toString(), farm.decimals);

        rewardPerBlockAmountTotalValue = getPerBlockAmountTotalValue(
            rewardPerBlockAmount.toEther().toNumber(),
            getTokenPrice(farm.reward.symbol)
          );

        const liquidityInUsd = new anchor.BN(decodedPoolLpTokenAccountInfo.amount.toString()).mul(priceBN).div(new anchor.BN(Math.pow(10, farm.decimals)));
        // const liquidityInUsd = (decodedPoolLpTokenAccountInfo.amount.toNumber() / Math.pow(10, farm.decimals)) * price;

        // @ts-ignore
        totalAPY = 100 * rewardPerBlockAmountTotalValue / liquidityInUsd;
      }

      // @ts-ignore
      const tvl = new anchor.BN(new anchor.BN(totalVaultBalance?.toString()) * price).div(new anchor.BN( Math.pow(10, farm.decimals))) * 1;

      // We want `apyDetails` in all cases but `farmDetails` only when the Farm is NOT `singleStake`
      if (!((farmDetails || farm.singleStake) && !isNil(totalAPY))) {
        console.log("$$$ failed to set tvb and tvs", farm.symbol, farmDetails, farm.singleStake, totalAPY);
        return;
      }

      const periodicRate = totalAPY / 365;
      const { apy: tradingFees = 0 } = getPair(farm.mintAddress) || {};
      const dailyTradingFees = Number(tradingFees) / 365;

      const mintAddress = (
        farm.symbol === 'RAY-SRM-DUAL' ? `${farm.mintAddress}0` : farm.mintAddress
      );

      const dailyAPR = periodicRate + (farm.disabled ? 0 : dailyTradingFees);
      const weeklyAPY = (100 * getAPY(periodicRate/(24), NUMBER_OF_PERIODS_IN_A_WEEK)) + (farm.disabled ? 0 : (dailyTradingFees * 7));
      const yearlyAPY = (100 * getAPY(periodicRate/(24), NUMBER_OF_PERIODS_IN_A_YEAR)) + (farm.disabled ? 0 : Number(tradingFees));

      this.setFarm(mintAddress, {
        dailyAPR,
        price,
        // since we compound every 1hr, we need that rate
        weeklyAPY,
        yearlyAPY,
        yieldBreakdown: {
          dailyYield: periodicRate,
          weeklyYield: (100 * getAPY(periodicRate/(24), NUMBER_OF_PERIODS_IN_A_WEEK)),
          yearlyYield: (100 * getAPY(periodicRate/(24), NUMBER_OF_PERIODS_IN_A_YEAR)),
          dailyTradingFees
        },
        tulipAPR: 100,
        baseTokenTotal,
        quoteTokenTotal,
        needTakePnlCoin,
        needTakePnlPc,
        tvl,
        totalVaultBalance,
        totalVlpShares,
        coinInLp,
        pcInLp
      });
    });
    ///#endregion

    //#region Orca Farms
    ORCA_FARMS.forEach((farm, index) => {
      const orcaPrice = getTokenPrice(TOKENS.ORCA.symbol) || 0;

      const decodedGlobalFarm = GLOBAL_FARM_DATA_LAYOUT.decode(orcaGlobalFarmsInfo[index].account.data);
      // console.log("$$$orca", decodedGlobalFarm);
      // const periodicRate = (decodedGlobalFarm.orcaEmissionPerDayPerThousandUsd * orcaPrice) / 10; // (÷ 1000 USD * 100%)



      const decodedTokenData = MINT_LAYOUT.decode(orcaMintAddressesInfo[index].account.data);
      const uiAmount = decodedTokenData.supply / Math.pow(10, decodedTokenData.decimals);
      const decodedVaultAccountData = orcaVaultProgram.coder.accounts.decode('Vault', Buffer.from(orcaVaultAccountsInfo[index].account.data));
      const { totalVaultBalance, totalVlpShares } = decodedVaultAccountData;
      const totalVaultBalanceInNumber = new anchor.BN(totalVaultBalance?.toString()).div(new anchor.BN(Math.pow(10, farm.decimals)));

      const decodedPoolCoinTokenaccountInfo = ACCOUNT_LAYOUT.decode(orcaPoolCoinTokenaccountsInfo[index].account.data);
      const decodedPoolPcTokenaccountInfo = ACCOUNT_LAYOUT.decode(orcaPoolPcTokenaccountsInfo[index].account.data);

      let price,
        poolCoinAmount,
        poolPCAmount,
        coinInLp,
        pcInLp,
        totalLiquidity,
        coinToPcRatio;

      // @ts-ignore
      if (farm.singleStake) {
        price = Number(getTokenPrice(farm.symbol));
      } else {
        poolCoinAmount = new TokenAmount(decodedPoolCoinTokenaccountInfo.amount.toString(), farm.coin.decimals);
        poolPCAmount = new TokenAmount(decodedPoolPcTokenaccountInfo.amount.toString(), farm.pc.decimals);

        coinToPcRatio = Number(poolCoinAmount.fixed()) / Number(poolPCAmount.fixed());

        coinInLp = Number(poolCoinAmount.fixed()) / uiAmount;
        pcInLp = Number(poolPCAmount.fixed()) / uiAmount;

        if (farm.symbol === 'ORCA-USDC') {
          this.priceStore.setTokenPrice(
            TOKENS.ORCA.symbol,
            poolPCAmount.wei.div( poolCoinAmount.wei).toNumber()
          );
        }

        price = (coinInLp * Number(getTokenPrice(farm.coin.symbol))) + (pcInLp * Number(getTokenPrice(farm.pc.symbol)));
        totalLiquidity  = price * uiAmount;
      }

      const periodicRate = getOrcaPeriodRate(
          decodedGlobalFarm,
          totalLiquidity,
          farm.reward.decimals,
          orcaPrice
      );


      const { apy: tradingFees = 0 } = getPair(farm.mintAddress) || {};
      const dailyTradingFees = Number(tradingFees) / 365;

      // console.log("$$$ orca farm", farm.symbol, periodicRate, tradingFees, decodedGlobalFarm, totalLiquidity, farm.reward.decimals, orcaPrice);

      // @ts-ignore
      const dailyAPR = periodicRate + (farm.disabled ? 0 : dailyTradingFees);
      // @ts-ignore
      const weeklyAPY = (100 * getAPY(periodicRate/(24), NUMBER_OF_PERIODS_IN_A_WEEK)) + (farm.disabled ? 0 : (dailyTradingFees * 7));
      // @ts-ignore
      const yearlyAPY = (100 * getAPY(periodicRate/(24), NUMBER_OF_PERIODS_IN_A_YEAR)) + (farm.disabled ? 0 : Number(tradingFees));




      // @ts-ignore
      const tvl = totalVaultBalanceInNumber * price;

      // @to-do: if we have Tulip rewards for Orca in the future, fix this
      const tulipAPR = 0;

      this.setFarm(farm.mintAddress, {
        dailyAPR,
        price,
        // since we compound every 1hr, we need that rate
        weeklyAPY,
        yearlyAPY,
        yieldBreakdown: {
          dailyYield: periodicRate,
          weeklyYield: (100 * getAPY(periodicRate/(24), NUMBER_OF_PERIODS_IN_A_WEEK)),
          yearlyYield: (100 * getAPY(periodicRate/(24), NUMBER_OF_PERIODS_IN_A_YEAR)),
          dailyTradingFees
        },
        tulipAPR,
        tvl,
        totalVaultBalance,
        totalVlpShares,
        coinInLp,
        pcInLp,
        coinToPcRatio
      });
    });

  }
  

}