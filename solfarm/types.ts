import { PublicKey } from "@solana/web3.js";


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

