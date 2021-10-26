import { useWallet } from "@solana/wallet-adapter-react";
import React from "react";

import ConnectWalletEmptyState from "../../components/ConnectWalletEmptyState";
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import MakeInvestment from "../../components/MakeInvestment";
import Steps from "../../components/Steps";

export interface Step {
    id: string;
    name: string;
    status: string;
    onclick: () => void;
}

export default function Invest() {
    const wallet = useWallet();

    const contributed = false;
    console.log("invest rerendering...");
    const steps = [
        {
            id: "01",
            name: "Connect Wallet",
            status: wallet?.publicKey ? "complete" : "current",
            onclick: () => {
                wallet.disconnect();
            },
        },
        {
            id: "02",
            name: "Start Investing",
            onclick: () => {
                return;
            },
            status: wallet && !contributed ? "current" : "upcoming",
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
                            {steps[1].status === "current" && wallet?.publicKey && <MakeInvestment wallet={wallet} />}
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
