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
                  <span className="md:block">Delta One</span>{" "}
                  <span className="text-indigo-400 md:block">
                    A Stablecoin with some extra juice.
                  </span>
                </h1>
                <p className="mt-3 text-base text-gray-300 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                  Use advanced delta neutral hedging strategies to earn high APYs. Making you money while you sleep.
                </p>
                <p className="mt-8 text-sm text-white uppercase tracking-wide font-semibold sm:mt-10">
                  Used by: 292 Solana Wallets.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Hero;
