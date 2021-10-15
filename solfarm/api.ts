import { Wallet } from "@project-serum/anchor";
import { PublicKey } from "@solana/web3.js";
import { findIndex } from "lodash";

import { addLiquidity } from "./addLiquidity";
import { createUserAccounts } from "./createUserAccounts";
import { createUserFarmObligation } from "./createUserFarmObligation";
import { createUserFarm } from "./createUserFarms";
import { depositBorrow } from "./depositBorrow";
import { depositMarginLpTokens } from "./depositMarginLpTokens";
import { getFarmBySymbol } from "./farm";
import { swapTokens } from "./swapTokens";
import { sendAllTransactions } from "./web3";

export interface Farm {
  name: string;
  mintAddress: PublicKey;
}

export interface PositionState {
  opening: number;
}
export interface Obligation {
  obligationAccount: PublicKey;
  id: string;
  positionState: PositionState;
}

export interface UserFarmInfo {
  obligations: Obligation[];
}
export interface FarmDetails {
  userFarmInfo: UserFarmInfo;
  isUserFarmValid: boolean;
}

const openMarginPosition = async (
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
  const farmDetails: FarmDetails = getStore("FarmStore").getFarm(
    farm.mintAddress
  );
  const { userFarmInfo } = farmDetails || {};
  const { obligations } = userFarmInfo || {};

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

    const createUserFarmManagerTxn = createUserFarm(assetSymbol, obligationIdx);
    transactions.push(createUserFarmManagerTxn);
    extraSigners.push([]);
  } else {
    if (
      obligations[obligationIdx].obligationAccount.toBase58() ===
      "11111111111111111111111111111111"
    ) {
      createAccounts = true;
      transactions.push(createUserFarmObligation(assetSymbol, obligationIdx));
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
    transactions.push(createUserAccounts(assetSymbol, obligationIdx));
    extraSigners.push([]);
  }
  if (obligationProgress > 0 && obligationProgress < 2) {
    const [depositBorrowTxn, signer] = await depositBorrow(
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
    transactions.push(swapTokens(assetSymbol, reserveName, obligationIdx));
    extraSigners.push([]);
  }

  if (obligationProgress > 0 && obligationProgress < 4) {
    transactions.push(addLiquidity(assetSymbol, reserveName, obligationIdx));
    extraSigners.push([]);
  }

  if (obligationProgress > 0 && obligationProgress < 5) {
    transactions.push(
      depositMarginLpTokens(assetSymbol, reserveName, obligationIdx)
    );
    extraSigners.push([]);
  }

  const fulfilledTransactions = await Promise.all(transactions);
  return sendAllTransactions(
    window.$web3,
    wallet,
    fulfilledTransactions,
    [],
    extraSigners
  );
};
