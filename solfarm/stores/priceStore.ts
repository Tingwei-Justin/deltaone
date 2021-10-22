import { observable, makeObservable, action } from "mobx";
import { assign } from "lodash";
import { PriceFetcherService } from "../service/priceFetcherService";
import { getFarmBySymbol } from "../farms/farm";

export default class PriceStore {
    tokensPrice: {};
    pairs: {};

    constructor() {
        this.tokensPrice = {};
        this.pairs = {};

        makeObservable(this, {
            tokensPrice: observable,
            pairs: observable,
            setTokensPrice: action.bound,
            setPairs: action.bound,
        });

        this.getTokenPrice = this.getTokenPrice.bind(this);
        this.getPair = this.getPair.bind(this);

        this.init();
    }

    async init() {
        const [tokensPrice, pairs, orcaPairs] = await Promise.all([
            PriceFetcherService.fetchTokenPrice(),
            PriceFetcherService.fetchAll(),
            PriceFetcherService.fetchOrcaPairs(),
        ]);

        this.setTokensPrice(tokensPrice);

        const pairsToStore = {};

        for (const [_, pair] of Object.entries(pairs)) {
            // @ts-ignore
            pairsToStore[pair.lp_mint] = pair;
        }

        for (const [assetSymbol, pair] of Object.entries(orcaPairs)) {
            const farm = getFarmBySymbol(assetSymbol);
            if (farm?.mintAddress) {
                pairsToStore[farm.mintAddress] = pair;
            }
        }
        // pairs.forEach((pair) => {
        //   pairsToStore[pair.lp_mint] = pair;
        // });

        this.setPairs(pairsToStore);
    }

    getTokenPrice(name: string) {
        //TOOO: write a proper map for conversion
        if (name === "mSOL" || name === "SOCN") {
            name = "SOL";
        }

        if (name === "whETH") {
            name = "ETH";
        }
        return this.tokensPrice[name];
    }

    setTokenPrice(token: any, price: any) {
        assign(this.tokensPrice, { [token]: price });
    }

    setTokensPrice(tokensPrice: any) {
        assign(this.tokensPrice, tokensPrice);
    }

    getPair(name: string | number) {
        return this.pairs[name];
    }

    setPairs(pairs: {}) {
        this.pairs = pairs;
    }
}
