import { Popover } from "@headlessui/react";
import { MenuIcon } from "@heroicons/react/outline";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/dist/client/router";
import React, { useEffect } from "react";

import ConnectWalletButton from "./ConnectWalletButton";

const navigation = [{ name: "Invest", href: "invest" }];
const Header = () => {
  const { wallet } = useWallet();
  const router = useRouter();
  useEffect(() => {
    if (wallet) {
      router.push(
        navigation.filter((option) => option.name === "Invest")[0].href
      );
    }
  }, [wallet]);
  return (
    <div className="relative bg-gray-800 overflow-hidden">
      <div
        className="hidden sm:block sm:absolute sm:inset-0"
        aria-hidden="true"
      >
        <svg
          className="absolute bottom-0 right-0 transform translate-x-1/2 mb-48 text-gray-700 lg:top-0 lg:mt-28 lg:mb-0 xl:transform-none xl:translate-x-0"
          width={364}
          height={384}
          viewBox="0 0 364 384"
          fill="none"
        >
          <defs>
            <pattern
              id="eab71dd9-9d7a-47bd-8044-256344ee00d0"
              x={0}
              y={0}
              width={20}
              height={20}
              patternUnits="userSpaceOnUse"
            >
              <rect x={0} y={0} width={4} height={4} fill="currentColor" />
            </pattern>
          </defs>
          <rect
            width={364}
            height={384}
            fill="url(#eab71dd9-9d7a-47bd-8044-256344ee00d0)"
          />
        </svg>
      </div>
      <div className="relative pt-6 pb-8 sm:pb-12">
        <Popover>
          <nav
            className="relative max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6"
            aria-label="Global"
          >
            <div className="flex items-center flex-1">
              <div className="flex items-center justify-between w-full md:w-auto">
                <a href="/#">
                  <span className="sr-only">Workflow</span>
                  <img
                    className="h-8 w-auto sm:h-10"
                    src="https://1.bp.blogspot.com/-6de2UnySTZY/X_nhgZikCpI/AAAAAAAAP88/cgqAn5Z-6TMT3KxTAhjDfmDLsZzCO-xwQCLcBGAsYHQ/s872/1200px-Greek_uc_delta.svg.png"
                    alt=""
                  />
                </a>
                <div className="-mr-2 flex items-center md:hidden">
                  <Popover.Button className="bg-gray-800 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:bg-gray-700 focus:outline-none focus:ring-2 focus-ring-inset focus:ring-white">
                    <span className="sr-only">Open main menu</span>
                    <MenuIcon className="h-6 w-6" aria-hidden="true" />
                  </Popover.Button>
                </div>
              </div>
              <div className="hidden space-x-10 md:flex md:ml-10">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="font-medium text-white hover:text-gray-300"
                  >
                    {item.name}
                  </a>
                ))}
                <a
                  target="__blank"
                  href="https://discord.gg/qEaGFrRdCC"
                  className="font-medium text-white hover:text-gray-300"
                >
                  Discord
                </a>
                <a
                  target="__blank"
                  href="https://twitter.com/deltafarming"
                  className="font-medium text-white hover:text-gray-300"
                >
                  Twitter
                </a>
                <a
                  target="__blank"
                  href="https://delta-one.gitbook.io/delta-one/"
                  className="font-medium text-white hover:text-gray-300"
                >
                  Docs
                </a>
                <a
                  target="__blank"
                  href="https://github.com/Delta-One-Protocol/deltaone/"
                  className="font-medium text-white hover:text-gray-300"
                >
                  Github
                </a>
              </div>
            </div>
            <ConnectWalletButton />
          </nav>
        </Popover>
      </div>
    </div>
  );
};

export default Header;
