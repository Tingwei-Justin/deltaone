export const PriceFetcherService = {
    fetchAll () {
      return fetch('https://api.solfarm.io/pairs?pair=TULIP-USDC,RAY-USDT,RAY-USDC,RAY-ETH,RAY-SOL,RAY-SRM,STEP-USDC,MEDIA-USDC,COPE-USDC,MER-USDC,ROPE-USDC,ALEPH-USDC,SNY-USDC,SLRS-USDC,LIKE-USDC,BOP-RAY,SAMO-RAY,KIN-RAY,FIDA-RAY,OXY-RAY,MAPS-RAY,MNGO-USDC,TULIP-RAY,COPE-RAY,LIKE-RAY,SNY-RAY,MEDIA-RAY,MER-RAY,SLRS-RAY,ATLAS-USDC,POLIS-USDC,ATLAS-RAY,POLIS-RAY,GRAPE-USDC,LARIX-USDC,MNDE-MSOL,MSOL-USDC,MSOL-RAY,MSOL-USDT,ETH-MSOL,BTC-MSOL')
        .then(response => response.json());
    },
  
    fetchTokenPrice () {
      return fetch('https://api.solfarm.io/price?coins=ray,step,media,cope,mer,sol,srm,maps,fida,kin,oxy,eth,usdc,usdt,rope,aleph,tulip,sny,bop,slrs,samo,like,btc,saber,mngo,ftt,atlas,polis,grape,orca,larix,mnde')
          .then(response => response.json());
    },
  
    fetchSaberPrice () {
      return fetch('https://api.coingecko.com/api/v3/simple/price?ids=saber&vs_currencies=usd')
          .then(response => response.json());
    },
  
    fetchOrcaPairs () {
      return fetch('https://api.solfarm.io/orca/pools?pool=ORCA-USDC,ORCA-SOL,SOL-USDC,USDC-USDT,SOL-USDT,ETH-USDC,ETH-SOL,mSOL-SOL,SOCN-USDC,SOCN-SOL,WHETH-USDC,WHETH-SOL')
        .then(response => response.json());
    },
  
    fetchTVL () {
      return fetch('https://api.solfarm.io/tvl')
        .then(response => response.json())
        .then((responseJson) => {
          return responseJson['TOTAL'];
        });
    }
  }