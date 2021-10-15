import { RadioGroup } from "@headlessui/react";
import { useWallet } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";
import React, { useEffect } from "react";
import { useState } from "react";
import { connection } from "../config/config";
import { TOKENS } from "../utils/tokens";

import { USDollarFormatter } from "../utils/utils";
import { getUSDCBalance } from "../utils/wallet";
import { PickInvestmentStrategyProps } from "./PickInvestmentStrategy";
import PortfolioChoice from "./PortfolioChoice";

const MakeInvestment = ({
  selectedInvestmentStrategy,
  setInvestmentStrategy,
}: PickInvestmentStrategyProps) => {
  const [contributionPercentage, setContributionPercentage] = useState(75);
  const [walletConnected, setWalletConnected] = useState(false)
  const [usdcBalance, setUSDCBalance] = useState<number>(0);
  const {  publicKey} = useWallet();

  const slippage = 0.01;

  useEffect(()=> {
    async function initialize() {
      try {
          console.log('publicKey', publicKey)
        if(publicKey){
          const balance = await getUSDCBalance(connection, publicKey);
          console.log('balance', usdcBalance)
          setUSDCBalance(balance);
        }
      } catch (error) {
        console.error(error);
      } finally {
      }
    }
    initialize()

  }, [publicKey, connection])


  return (
    <>
      <div
        className="flex min-h-screen text-center sm:block sm:px-6 lg:px-8"
        style={{ fontSize: 0 }}
      >
        {/* This element is to trick the browser into centering the modal contents. */}
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="flex text-base text-left transform transition w-full sm:inline-block max-w-3xl my-10 sm:align-top">
          <form className="w-full relative flex flex-col bg-white  pb-8 overflow-hidden sm:pb-6 sm:rounded-lg">
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8">
              <h2 className="text-lg font-medium text-gray-900">
                Review Investment
              </h2>
            </div>

            <section aria-labelledby="cart-heading" className="my-10">
              <div className="w-96 mx-auto">
                <RadioGroup
                  value={selectedInvestmentStrategy}
                  onChange={setInvestmentStrategy}
                >
                  <PortfolioChoice
                    plan={selectedInvestmentStrategy}
                    checked={true}
                  />
                </RadioGroup>
              </div>
            </section>

            <section
              aria-labelledby="summary-heading"
              className="mt-auto sm:px-6 lg:px-8"
            >
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
                          (Based on USDC in your wallet)
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
                          onChange={(event) => {
                            setContributionPercentage(
                              parseInt(event.target.value)
                            );
                          }}
                          className="range range-secondary"
                        />
                      </div>
                    </div>
                    <div className="py-4 flex items-center justify-between">
                      <dt className="text-gray-600">Slippage</dt>
                      <dd className="font-medium text-gray-900">1%</dd>
                    </div>
                    <div className="py-4 flex items-center justify-between">
                      <dt className="text-base font-medium text-gray-900">
                        Investment total
                      </dt>
                      <dd className="text-base font-medium text-gray-900">
                        {USDollarFormatter.format(
                          usdcBalance *
                            (contributionPercentage / 100) *
                            (1 - slippage)
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
                onClick={()=>alert("Only for beta users. Join Discord and ask to join.")}
              >
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
