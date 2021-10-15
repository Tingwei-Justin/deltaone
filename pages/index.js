import dynamic from "next/dynamic";

import WWW from "../components/WWW";

const WalletConnectionProvider = dynamic(
  () => import("../components/WalletConnectionProvider"),
  {
    ssr: false,
  }
);

export default function Home() {
  return (
    <>
      <WalletConnectionProvider>
        <WWW />
      </WalletConnectionProvider>
    </>
  );
}
