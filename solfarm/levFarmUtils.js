import * as anchor from "@project-serum/anchor";
import { isNil } from "lodash";

// finds a UserFarm account address
export async function findUserFarmAddress(
  // the user's main wallet account
  authority,
  // the id of the lending program
  programId,
  // the index of the account
  // 0 = first account, 1 = second account, etc...
  index,
  // the enum of the particular farm
  // 0 = ray-usdc lp, 1 = ray-sol lp
  farm
) {
  let seeds = [
    authority.toBuffer(),
    index.toArrayLike(Buffer, "le", 8),
    farm.toArrayLike(Buffer, "le", 8),
  ];
  return anchor.web3.PublicKey.findProgramAddress(seeds, programId);
}

// used to find a UserFarmManager account address
export async function findUserFarmManagerAddress(
  // the user's main wallet account
  authority,
  // the id of the lending program
  programId,
  // the enum of the particular farm
  // 0 = ray-usdc lp, 1 = ray-sol lp
  farm
) {
  let seeds = [authority.toBuffer(), farm.toArrayLike(Buffer, "le", 8)];
  return anchor.web3.PublicKey.findProgramAddress(seeds, programId);
}

export async function findUserFarmObligationAddress(
  authority,
  userFarmAddr,
  lendingProgramId,
  obligationIndex
) {
  let seeds = [
    authority.toBuffer(),
    userFarmAddr.toBuffer(),
    obligationIndex.toArrayLike(Buffer, "le", 8),
  ];
  return anchor.web3.PublicKey.findProgramAddress(seeds, lendingProgramId);
}

export async function findLeveragedFarmAddress(
  solfarmVaultProgram,
  serumMarket,
  farmProgramId,
  farm
) {
  let seeds = [
    Buffer.from("new"),
    solfarmVaultProgram.toBuffer(),
    serumMarket.toBuffer(),
    farm.toArrayLike(Buffer, "le", 8),
  ];
  return anchor.web3.PublicKey.findProgramAddress(seeds, farmProgramId);
}

export async function findVaultManagerAddress(
  authority,
  leveragedFarmAccount,
  farmProgramId
) {
  let seeds = [authority.toBuffer(), leveragedFarmAccount.toBuffer()];
  return anchor.web3.PublicKey.findProgramAddress(seeds, farmProgramId);
}

export async function findObligationVaultAddress(
  userFarmAccount,
  obligationIndex,
  farmProgramId
) {
  let seeds = [
    userFarmAccount.toBuffer(),
    obligationIndex.toArrayLike(Buffer, "le", 8),
  ];
  return anchor.web3.PublicKey.findProgramAddress(seeds, farmProgramId);
}

export async function findBorrowAuthorizer(lendingMarket, sourceProgram) {
  let seeds = [lendingMarket.toBuffer(), sourceProgram.toBuffer()];
  return anchor.web3.PublicKey.findProgramAddress(seeds, sourceProgram);
}

export function getDefaultSelectedCoinIndex(borrowDisabledCoinIndex) {
  if (isNil(borrowDisabledCoinIndex)) {
    return 1;
  }

  return borrowDisabledCoinIndex === 0 ? 1 : 0;
}

// finds a Orca UserFarm address
export async function findOrcaUserFarmAddress(
  globalFarm,
  owner,
  tokenProgramId,
  aquaFarmProgramId
) {
  let seeds = [
    globalFarm.toBuffer(),
    owner.toBuffer(),
    tokenProgramId.toBuffer(),
  ];
  return anchor.web3.PublicKey.findProgramAddress(seeds, aquaFarmProgramId);
}
