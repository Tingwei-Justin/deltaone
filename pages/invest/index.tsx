import { useWallet } from "@solana/wallet-adapter-react";
import React, { useState } from "react";

import ConnectWalletEmptyState from "../../components/ConnectWalletEmptyState";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import MakeInvestment from "../../components/MakeInvestment";
import PickInvestmentStrategy, {
  Plan,
} from "../../components/PickInvestmentStrategy";
import Steps from "../../components/Steps";

export interface Step {
  id: string;
  name: string;
  status: string;
  onclick: () => void;
}

export default function Invest() {
  const { publicKey, disconnect } = useWallet();
  const contributed = false;
  const [selectedInvestmentStrategy, setSelectedInvestmentStrategy] =
    useState<Plan>();

  const steps = [
    {
      id: "01",
      name: "Connect Wallet",
      status: publicKey ? "complete" : "current",
      onclick: () => {
        disconnect();
        setSelectedInvestmentStrategy(undefined);
      },
    },
    {
      id: "02",
      name: "Pick Investment Strategy",
      onclick: () => {
        setSelectedInvestmentStrategy(undefined);
      },
      status:
        (publicKey &&
          selectedInvestmentStrategy &&
          !contributed &&
          "complete") ||
        (publicKey && !selectedInvestmentStrategy && !contributed
          ? "current"
          : "upcoming"),
    },
    {
      id: "03",
      name: "Start Investing",
      onclick: () => {
        return;
      },
      status:
        publicKey && selectedInvestmentStrategy && !contributed
          ? "current"
          : "upcoming",
    },
  ];
  return (
    <div className="relative bg-gray-800 overflow-hidden">
      <Header />
      <div className="bg-gray-800 pb-32">
        <header className="py-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold text-white">Invest</h1>
          </div>
        </header>
      </div>

      <main className="-mt-32">
        <div className="max-w-7xl mx-auto pb-12 px-4 sm:px-6 lg:px-8">
          {/* Replace with your content */}
          <div className="bg-white rounded-lg shadow px-5 py-6 sm:px-6">
            <div className="rounded-lg">
              <Steps steps={steps} />
              {steps[0].status === "current" && (
                <div className="my-10">
                  <ConnectWalletEmptyState />
                </div>
              )}
              {steps[1].status === "current" && (
                <div className="mt-10 w-96 mx-auto">
                  <PickInvestmentStrategy
                    selectedInvestmentStrategy={selectedInvestmentStrategy}
                    setInvestmentStrategy={setSelectedInvestmentStrategy}
                  />
                </div>
              )}
              {steps[2].status === "current" && (
                <MakeInvestment
                  selectedInvestmentStrategy={selectedInvestmentStrategy}
                  setInvestmentStrategy={setSelectedInvestmentStrategy}
                />
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}