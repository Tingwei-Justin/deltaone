import { RadioGroup } from "@headlessui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { connection } from "../config/config";

import { USDollarFormatter } from "../utils/utils";
import { getSOLBalance } from "../utils/wallet";
import { TulipService } from "../solfarm/tulipService";

interface SolanaConversion {
    usd: number;
}
interface CoinGeckoResponse {
    solana: SolanaConversion;
}
const MakeInvestment = () => {
    const [contributionPercentage, setContributionPercentage] = useState(100);
    const [usdcBalance, setUSDCBalance] = useState<number>(0);
    const { publicKey, wallet } = useWallet();

    const slippage = 0.01;

    useEffect(() => {
        async function initialize() {
            try {
                if (publicKey) {
                    const balance = await getSOLBalance(connection, publicKey);
                    const { data } = await axios.get<CoinGeckoResponse>(
                        "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd"
                    );
                    const usdcBalanceConverted = balance * data.solana.usd;
                    setUSDCBalance(usdcBalanceConverted);
                }
            } catch (error) {
                console.error(error);
            } finally {
            }
        }
        initialize();
    }, [publicKey, connection]);

    return (
        <>
            <div className="flex min-h-screen text-center sm:block sm:px-6 lg:px-8" style={{ fontSize: 0 }}>
                {/* This element is to trick the browser into centering the modal contents. */}
                <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
                    &#8203;
                </span>
                <div className="flex text-base text-left transform transition w-full sm:inline-block max-w-3xl my-10 sm:align-top">
                    <form className="w-full relative flex flex-col bg-white  pb-8 overflow-hidden sm:pb-6 sm:rounded-lg">
                        <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
                            <h2 className="text-lg font-medium text-gray-900">Review Investment</h2>
                        </div>

                        <section aria-labelledby="summary-heading" className="mt-auto sm:px-6 lg:px-8">
                            <div className="bg-gray-50 p-6 sm:p-8 sm:rounded-lg">
                                <h2 id="summary-heading" className="sr-only">
                                    Order summary
                                </h2>

                                <div className="flow-root">
                                    <dl className="-my-4 text-sm divide-y divide-gray-200">
                                        <div className="py-4 flex items-center justify-between">
                                            <div>
                                                <dt className="text-gray-600">Investment Amount</dt>
                                                <dt className="text-gray-600 text-2xs">
                                                    (Based on SOL in your wallet)
                                                </dt>
                                            </div>
                                            <div>
                                                <dd className="font-medium text-3xl text-gray-900">
                                                    {USDollarFormatter.format(
                                                        usdcBalance * (contributionPercentage / 100)
                                                    )}
                                                </dd>
                                                <input
                                                    type="range"
                                                    max="100"
                                                    defaultValue={contributionPercentage}
                                                    onChange={event => {
                                                        setContributionPercentage(parseInt(event.target.value));
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <div className="py-4 flex items-center justify-between">
                                            <dt className="text-gray-600">Slippage</dt>
                                            <dd className="font-medium text-gray-900">1%</dd>
                                        </div>
                                        <div className="py-4 flex items-center justify-between">
                                            <dt className="text-base font-medium text-gray-900">Investment total</dt>
                                            <dd className="text-base font-medium text-gray-900">
                                                {USDollarFormatter.format(
                                                    usdcBalance * (contributionPercentage / 100) * (1 - slippage)
                                                )}
                                            </dd>
                                        </div>
                                    </dl>
                                </div>
                            </div>
                        </section>

                        <div className="mt-8 flex justify-end px-4 sm:px-6 lg:px-8">
                            <button
                                type="submit"
                                className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-indigo-500"
                                onClick={() => {
                                    // const testing = true;
                                    const testing = false;
                                    if (testing) {
                                        const tulipService = new TulipService(wallet);
                                    } else {
                                        alert("Only for beta users. Join Discord to join beta.");
                                    }
                                }}>
                                Invest
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};
export default MakeInvestment;
