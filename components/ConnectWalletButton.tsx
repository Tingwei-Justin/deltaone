import { useWallet } from "@solana/wallet-adapter-react";
import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import React from "react";

const ConnectWalletButton = () => {
  const { wallet } = useWallet();
  return !wallet ? (
    <WalletMultiButton className="mx-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700">
      Connect Wallet
    </WalletMultiButton>
  ) : (
    <WalletDisconnectButton className="mx-auto inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-600 hover:bg-gray-700">
      Disconnect
    </WalletDisconnectButton>
  );
};
export default ConnectWalletButton;
