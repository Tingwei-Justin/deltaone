import { observable, makeObservable, action } from 'mobx';
import { PriceFetcherService } from '../services/PriceFetcherService';
import { assign } from 'lodash';
import { getFarmBySymbol } from '../farm';

export default class PriceStore {
  constructor () {
    this.tokensPrice = {};
    this.pairs = {};

    makeObservable(this, {
      tokensPrice: observable,
      pairs: observable,
      setTokensPrice: action.bound,
      setPairs: action.bound
    });

    this.getTokenPrice = this.getTokenPrice.bind(this);
    this.getPair = this.getPair.bind(this);

    this.init();
  }

  async init () {
    const [tokensPrice, pairs, orcaPairs] = await Promise.all([
      PriceFetcherService.fetchTokenPrice(),
      PriceFetcherService.fetchAll(),
      PriceFetcherService.fetchOrcaPairs()
    ]);

    this.setTokensPrice(tokensPrice);

    const pairsToStore = {};

    for (const [_, pair] of Object.entries(pairs)) {
      pairsToStore[pair.lp_mint] = pair;
    }

    for (const [assetSymbol, pair] of Object.entries(orcaPairs)) {
      const farm = getFarmBySymbol(assetSymbol);
      pairsToStore[farm.mintAddress] = pair;
    }
    // pairs.forEach((pair) => {
    //   pairsToStore[pair.lp_mint] = pair;
    // });

    this.setPairs(pairsToStore);
  }

  getTokenPrice (name) {
    //TOOO: write a proper map for conversion
    if (name === "mSOL" || name === "SOCN") {
      name = "SOL";
    }

    if (name === "whETH") {
      name = "ETH"
    }
    return this.tokensPrice[name];
  }

  setTokenPrice (token, price) {
    assign(this.tokensPrice, { [token]: price });
  }

  setTokensPrice (tokensPrice) {
    assign(this.tokensPrice, tokensPrice);
  }

  getPair (name) {
    return this.pairs[name];
  }

  setPairs (pairs) {
    this.pairs = pairs;
  }
}