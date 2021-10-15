import { ChevronRightIcon } from "@heroicons/react/solid";

const Hero = () => {
  return (
    <div className="relative bg-gray-800 overflow-hidden">
      <main className="mt-16 sm:mt-24">
        <div className="mx-auto max-w-7xl">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            <div className="px-4 sm:px-6 sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left lg:flex lg:items-center">
              <div>
                <a
                  target="__blank"
                  href="https://discord.gg/pSKG5X8s"
                  className="inline-flex items-center text-white bg-gray-900 rounded-full p-1 pr-2 sm:text-base lg:text-sm xl:text-base hover:text-gray-200"
                >
                  <span className="px-3 py-0.5 text-white text-xs font-semibold leading-5 uppercase tracking-wide bg-indigo-500 rounded-full">
                    Let's Go
                  </span>
                  <span className="ml-4 text-sm">Join our Discord</span>
                  <ChevronRightIcon
                    className="ml-2 w-5 h-5 text-gray-500"
                    aria-hidden="true"
                  />
                </a>
                <h1 className="mt-4 text-4xl tracking-tight font-extrabold text-white sm:mt-5 sm:leading-none lg:mt-6 lg:text-5xl xl:text-6xl">
                  <span className="md:block">Delta One</span>
                  <span className="text-indigo-400 md:block">
                    A Stablecoin with some extra juice.
                  </span>
                </h1>
                <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                  Delta one protocol is a stablecoin which earns yield. It gives access to high DeFi yields through a continuously optimised portfolio of advanced hedged yield farming strategies.
                </p>

              </div>
            </div>
          </div>
        </div>
      </main>
      <div className="py-12 ">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="lg:text-center">
      <h2 className="text-base text-indigo-400 font-semibold tracking-wide uppercase">DELTA ONE PROTOCOL</h2>
      <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
        A better way to hold your money.
      </p>
      <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
      Delta One Protocol returns are higher because they are leveraged using assets. 
      </p>
    </div>

    <div className="mt-10">
      <dl className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
        <div className="relative">
          <dt>
            <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
              </svg>
            </div>
            <p className="ml-16 text-lg leading-6 font-medium text-white">Stablecoin</p>
          </dt>
          <dd className="mt-2 ml-16 text-base text-gray-500">

          Because Delta One preserves its value and pegs itself to the USDC, you can feel safe using it.
          </dd>
        </div>

        <div className="relative">
          <dt>
            <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <p className="ml-16 text-lg leading-6 font-medium text-white">Decenteralized</p>
          </dt>
          <dd className="mt-2 ml-16 text-base text-gray-500">
            Delta One Protocol will be decenteralized and goverened using Delta One DAO. 
          </dd>
        </div>

        <div className="relative">
          <dt>
            <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <p className="ml-16 text-lg leading-6 font-medium text-white">Hedged</p>
          </dt>
          <dd className="mt-2 ml-16 text-base text-gray-500">
          The protocol uses delta hedging so losses are covered. 
          </dd>
        </div>

        <div className="relative">
          <dt>
            <div className="absolute flex items-center justify-center h-12 w-12 rounded-md bg-indigo-500 text-white">
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
            </div>
            <p className="ml-16 text-lg leading-6 font-medium text-white">Safe and secure</p>
          </dt>
          <dd className="mt-2 ml-16 text-base text-gray-500">
                  Delta One is a stablecoin protocol and the risks are primarily smart contract and stablecoin risks, rather than price volatility.
          </dd>
        </div>
      </dl>
    </div>
  </div>
</div>
  <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
        Trusted by users across the world.
      </h2>
      <p className="mt-3 text-xl text-indigo-200 sm:mt-4">
        Our closed beta users are reaping the benefits.
      </p>
    </div>
    <dl className="mt-10 text-center sm:max-w-3xl sm:mx-auto sm:grid sm:grid-cols-3 sm:gap-8">
      <div className="flex flex-col">
        <dt className="order-2 mt-2 text-lg leading-6 font-medium text-indigo-200">
          TVL
        </dt>
        <dd className="order-1 text-5xl font-extrabold text-white">
          $150K+
        </dd>
      </div>
      <div className="flex flex-col mt-10 sm:mt-0">
        <dt className="order-2 mt-2 text-lg leading-6 font-medium text-indigo-200">
          Yield per day
        </dt>
        <dd className="order-1 text-5xl font-extrabold text-white">
          1%
        </dd>
      </div>
      <div className="flex flex-col mt-10 sm:mt-0">
        <dt className="order-2 mt-2 text-lg leading-6 font-medium text-indigo-200">
          Wallets
        </dt>
        <dd className="order-1 text-5xl font-extrabold text-white">
          292
        </dd>
      </div>
    </dl>
</div>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:py-16 sm:px-6 lg:px-8 lg:py-20">
    <div className="max-w-4xl mx-auto text-center">
                <p className="mt-8 text-sm text-white tracking-wide font-semibold sm:mt-10">
                   Built on the best leverage yield farms on Solana, <span className="text-indigo-400">Tulip Protocol</span>.
                </p>
                  <div className="flex flex-row mt-4 justify-center">
                    <div className="col-span-1 flex justify-center py-8 px-8 bg-gray-50">
                      <img className="max-h-12" src="https://tulip.garden/static/media/tulip.be0a265d.svg" alt="Tulip Protocol"/>
                    </div>
                    {/* <div className="ml-4 col-span-1 flex justify-center py-8 px-8 bg-gray-50">
                      <img className="max-h-12" src="https://pbs.twimg.com/profile_images/1437360622144983043/Mk6wM8dM_400x400.jpg" alt="Francium"/>
                    </div> */}
                </div>
                </div>

      </div>
    </div>
  );
};

export default Hero;
