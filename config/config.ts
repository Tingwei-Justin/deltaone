import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { clusterApiUrl, Connection } from "@solana/web3.js";

// Can be set to 'Devnet', 'Testnet', or 'Mainnet'
// const network = "http://127.0.0.1:8899";
// const endpoint = "http://127.0.0.1:8899";
export const network = WalletAdapterNetwork.Mainnet;
export const url = clusterApiUrl(network);
export const connection = new Connection(url);
