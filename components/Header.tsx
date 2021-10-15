import { Popover } from "@headlessui/react";
import { MenuIcon } from "@heroicons/react/outline";
import { useWallet } from "@solana/wallet-adapter-react";
import { useRouter } from "next/dist/client/router";
import React, { useEffect } from "react";
import logo from "../assets/logo.svg";

import ConnectWalletButton from "./ConnectWalletButton";
interface LogoProps{
  className: string;
}
function Logo({className}: LogoProps) {
  return (<svg version="1.0" xmlns="http://www.w3.org/2000/svg"
  className={className}
  viewBox="0 0 1280.000000 1119.000000"
  preserveAspectRatio="xMidYMid meet">
 <g transform="translate(0.000000,1119.000000) scale(0.100000,-0.100000)" stroke="none">
 <path d="M5890 11057 c-85 -29 -158 -76 -217 -141 -34 -37 -344 -564 -1030
 -1747 -539 -932 -1790 -3089 -2778 -4794 -989 -1705 -1805 -3116 -1815 -3135
 -9 -19 -25 -65 -34 -101 -66 -268 95 -537 370 -615 54 -16 185 -18 1434 -24
 l1375 -6 -1130 -4 c-621 -2 -1087 -6 -1035 -10 52 -4 2518 -11 5480 -15 5065
 -8 5390 -7 5469 9 176 36 275 118 317 262 28 98 10 200 -61 349 -37 76 -33 69
 -595 1045 -378 657 -497 864 -722 1255 -63 110 -167 290 -230 400 -64 110
 -254 441 -423 735 -169 294 -378 657 -463 805 -217 376 -536 930 -717 1245
 -140 244 -612 1065 -880 1530 -62 107 -174 303 -250 435 -76 132 -187 326
 -248 430 -60 105 -206 359 -325 565 -539 939 -567 986 -652 1061 -60 55 -136
 99 -127 75 15 -37 -6 -9 -69 97 -80 132 -127 186 -208 239 -123 80 -299 102
 -436 55z m-2462 -10564 c-38 -2 -98 -2 -135 0 -38 2 -7 3 67 3 74 0 105 -1 68
 -3z m255 0 c-23 -2 -64 -2 -90 0 -26 2 -7 3 42 3 50 0 71 -1 48 -3z m6290 -10
 c-468 -2 -1238 -2 -1710 0 -472 1 -88 2 852 2 941 0 1327 -1 858 -2z m1650 0
 c-7 -2 -21 -2 -30 0 -10 3 -4 5 12 5 17 0 24 -2 18 -5z"/>
 </g>
 </svg>
 )
}

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
                 <Logo className="text-indigo-400 fill-current w-8 h-8"/>
                  {/* <img
                    className="h-8 w-auto sm:h-10"
                    src="https://1.bp.blogspot.com/-6de2UnySTZY/X_nhgZikCpI/AAAAAAAAP88/cgqAn5Z-6TMT3KxTAhjDfmDLsZzCO-xwQCLcBGAsYHQ/s872/1200px-Greek_uc_delta.svg.png"
                    alt=""
                  /> */}
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
