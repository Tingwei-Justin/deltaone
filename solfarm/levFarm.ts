export const farmIdl = {
  version: "0.0.0",
  name: "farm",
  instructions: [
    {
      name: "createLeveragedFarm",
      accounts: [
        {
          name: "global",
          isMut: false,
          isSigner: false,
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "leveragedFarm",
          isMut: true,
          isSigner: false,
        },
        {
          name: "solfarmVaultProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "serumMarket",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "serumMarket",
          type: "publicKey",
        },
        {
          name: "solfarmVaultProgram",
          type: "publicKey",
        },
        {
          name: "solfarmVaultAddress",
          type: "publicKey",
        },
        {
          name: "serumRequestQueue",
          type: "publicKey",
        },
        {
          name: "serumEventQueue",
          type: "publicKey",
        },
        {
          name: "serumMarketBids",
          type: "publicKey",
        },
        {
          name: "serumMarketAsks",
          type: "publicKey",
        },
        {
          name: "serumCoinVaultAccount",
          type: "publicKey",
        },
        {
          name: "serumPcVaultAccount",
          type: "publicKey",
        },
        {
          name: "serumFeeRecipient",
          type: "publicKey",
        },
        {
          name: "serumDexProgram",
          type: "publicKey",
        },
        {
          name: "raydiumLpMintAddress",
          type: "publicKey",
        },
        {
          name: "raydiumAmmId",
          type: "publicKey",
        },
        {
          name: "raydiumAmmAuthority",
          type: "publicKey",
        },
        {
          name: "raydiumAmmOpenOrders",
          type: "publicKey",
        },
        {
          name: "raydiumAmmQuantitiesOrTargetOrders",
          type: "publicKey",
        },
        {
          name: "raydiumLiquidityProgram",
          type: "publicKey",
        },
        {
          name: "raydiumCoinTokenAccount",
          type: "publicKey",
        },
        {
          name: "raydiumPcTokenAccount",
          type: "publicKey",
        },
        {
          name: "raydiumPoolTempTokenAccount",
          type: "publicKey",
        },
        {
          name: "raydiumPoolWithdrawQueue",
          type: "publicKey",
        },
        {
          name: "lendingMarket",
          type: "publicKey",
        },
        {
          name: "lendingProgram",
          type: "publicKey",
        },
        {
          name: "farm",
          type: "u64",
        },
      ],
    },
    {
      name: "initializeLeveragedFarmOne",
      accounts: [
        {
          name: "global",
          isMut: false,
          isSigner: false,
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "leveragedFarm",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "baseMint",
          type: "publicKey",
        },
        {
          name: "quoteMint",
          type: "publicKey",
        },
        {
          name: "feeReceiver",
          type: "publicKey",
        },
        {
          name: "lpTokenPriceAccount",
          type: "publicKey",
        },
        {
          name: "coinTokenPriceAccount",
          type: "publicKey",
        },
        {
          name: "pcTokenPriceAccount",
          type: "publicKey",
        },
        {
          name: "coinReserveLiquidityFeeReceiver",
          type: "publicKey",
        },
        {
          name: "pcReserveLiquidityFeeReceiver",
          type: "publicKey",
        },
        {
          name: "lpDecimals",
          type: "u8",
        },
        {
          name: "baseDecimals",
          type: "u8",
        },
        {
          name: "quoteDecimals",
          type: "u8",
        },
        {
          name: "supportsFee",
          type: "bool",
        },
      ],
    },
    {
      name: "initializeLeveragedFarmTwo",
      accounts: [
        {
          name: "global",
          isMut: false,
          isSigner: false,
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "leveragedFarm",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "baseReserve",
          type: "publicKey",
        },
        {
          name: "quoteReserve",
          type: "publicKey",
        },
        {
          name: "baseTokenAccount",
          type: "publicKey",
        },
        {
          name: "quoteTokenAccount",
          type: "publicKey",
        },
        {
          name: "serumOpenOrdersAccount",
          type: "publicKey",
        },
        {
          name: "buySlip",
          type: "u64",
        },
        {
          name: "sellSlip",
          type: "u64",
        },
      ],
    },
    {
      name: "createUserFarm",
      accounts: [
        {
          name: "authority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "userFarm",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userFarmObligation",
          isMut: true,
          isSigner: false,
        },
        {
          name: "lendingMarket",
          isMut: true,
          isSigner: false,
        },
        {
          name: "global",
          isMut: false,
          isSigner: false,
        },
        {
          name: "leveragedFarm",
          isMut: false,
          isSigner: false,
        },
        {
          name: "clock",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "lendingProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "obligationVaultAddress",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "farmProgramId",
          type: "publicKey",
        },
      ],
    },
    {
      name: "createUserFarmObligation",
      accounts: [
        {
          name: "authority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "userFarm",
          isMut: true,
          isSigner: false,
        },
        {
          name: "leveragedFarm",
          isMut: false,
          isSigner: false,
        },
        {
          name: "userFarmObligation",
          isMut: true,
          isSigner: false,
        },
        {
          name: "lendingMarket",
          isMut: true,
          isSigner: false,
        },
        {
          name: "obligationVaultAddress",
          isMut: true,
          isSigner: false,
        },
        {
          name: "clock",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
        {
          name: "lendingProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [],
    },
    {
      name: "depositBorrow",
      accounts: [
        {
          name: "authority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "userFarm",
          isMut: true,
          isSigner: false,
        },
        {
          name: "leveragedFarm",
          isMut: false,
          isSigner: false,
        },
        {
          name: "userFarmObligation",
          isMut: true,
          isSigner: false,
        },
        {
          name: "coinSourceTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "coinDestinationTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "pcSourceTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "pcDestinationTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "coinDepositReserveAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "pcDepositReserveAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "coinReserveLiquidityOracle",
          isMut: false,
          isSigner: false,
        },
        {
          name: "pcReserveLiquidityOracle",
          isMut: false,
          isSigner: false,
        },
        {
          name: "lendingMarketAccount",
          isMut: false,
          isSigner: false,
        },
        {
          name: "derivedLendingMarketAuthority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "clock",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "lendingProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "sourceReserveLiquidityTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "borrowMint",
          isMut: true,
          isSigner: false,
        },
        {
          name: "reserveLiquidityFeeReceiver",
          isMut: true,
          isSigner: false,
        },
        {
          name: "borrowAuthorizer",
          isMut: false,
          isSigner: false,
        },
        {
          name: "lpPythPriceAccount",
          isMut: false,
          isSigner: false,
        },
        {
          name: "vaultAccount",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "reserves",
          type: {
            vec: "publicKey",
          },
        },
        {
          name: "coinAmount",
          type: "u64",
        },
        {
          name: "pcAmount",
          type: "u64",
        },
        {
          name: "borrowAmount",
          type: "u64",
        },
        {
          name: "obligationIndex",
          type: "u8",
        },
      ],
    },
    {
      name: "depositBorrowZero",
      accounts: [
        {
          name: "authority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "userFarm",
          isMut: true,
          isSigner: false,
        },
        {
          name: "leveragedFarm",
          isMut: false,
          isSigner: false,
        },
        {
          name: "userFarmObligation",
          isMut: true,
          isSigner: false,
        },
        {
          name: "coinSourceTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "coinDestinationTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "pcSourceTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "pcDestinationTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "coinDepositReserveAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "pcDepositReserveAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "coinReserveLiquidityOracle",
          isMut: false,
          isSigner: false,
        },
        {
          name: "pcReserveLiquidityOracle",
          isMut: false,
          isSigner: false,
        },
        {
          name: "lendingMarketAccount",
          isMut: false,
          isSigner: false,
        },
        {
          name: "derivedLendingMarketAuthority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "clock",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "lendingProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "sourceReserveLiquidityTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "borrowMint",
          isMut: true,
          isSigner: false,
        },
        {
          name: "reserveLiquidityFeeReceiver",
          isMut: true,
          isSigner: false,
        },
        {
          name: "borrowAuthorizer",
          isMut: false,
          isSigner: false,
        },
        {
          name: "lpPythPriceAccount",
          isMut: false,
          isSigner: false,
        },
        {
          name: "vaultAccount",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "reserves",
          type: {
            vec: "publicKey",
          },
        },
        {
          name: "coinAmount",
          type: "u64",
        },
        {
          name: "pcAmount",
          type: "u64",
        },
        {
          name: "borrowAmount",
          type: "u64",
        },
        {
          name: "obligationIndex",
          type: "u8",
        },
      ],
    },
    {
      name: "swapTokensAddCollateralSplTokenSwap",
      accounts: [
        {
          name: "authority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "leveragedFarm",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userFarm",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userFarmObligation",
          isMut: true,
          isSigner: false,
        },
        {
          name: "pcWallet",
          isMut: true,
          isSigner: false,
        },
        {
          name: "market",
          accounts: [
            {
              name: "market",
              isMut: true,
              isSigner: false,
            },
            {
              name: "openOrders",
              isMut: true,
              isSigner: false,
            },
            {
              name: "requestQueue",
              isMut: true,
              isSigner: false,
            },
            {
              name: "eventQueue",
              isMut: true,
              isSigner: false,
            },
            {
              name: "bids",
              isMut: true,
              isSigner: false,
            },
            {
              name: "asks",
              isMut: true,
              isSigner: false,
            },
            {
              name: "orderPayerTokenAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "coinVault",
              isMut: true,
              isSigner: false,
            },
            {
              name: "pcVault",
              isMut: true,
              isSigner: false,
            },
            {
              name: "vaultSigner",
              isMut: false,
              isSigner: false,
            },
            {
              name: "coinWallet",
              isMut: true,
              isSigner: false,
            },
          ],
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
        {
          name: "dexProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "vaultSigner",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "obligationIndex",
          type: "u8",
        },
      ],
    },
    {
      name: "swapTokensExperimental",
      accounts: [
        {
          name: "authority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "leveragedFarm",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userFarm",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userFarmObligation",
          isMut: true,
          isSigner: false,
        },
        {
          name: "pcWallet",
          isMut: true,
          isSigner: false,
        },
        {
          name: "market",
          accounts: [
            {
              name: "market",
              isMut: true,
              isSigner: false,
            },
            {
              name: "openOrders",
              isMut: true,
              isSigner: false,
            },
            {
              name: "requestQueue",
              isMut: true,
              isSigner: false,
            },
            {
              name: "eventQueue",
              isMut: true,
              isSigner: false,
            },
            {
              name: "bids",
              isMut: true,
              isSigner: false,
            },
            {
              name: "asks",
              isMut: true,
              isSigner: false,
            },
            {
              name: "orderPayerTokenAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "coinVault",
              isMut: true,
              isSigner: false,
            },
            {
              name: "pcVault",
              isMut: true,
              isSigner: false,
            },
            {
              name: "vaultSigner",
              isMut: false,
              isSigner: false,
            },
            {
              name: "coinWallet",
              isMut: true,
              isSigner: false,
            },
          ],
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
        {
          name: "dexProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "vaultSigner",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "obligationIndex",
          type: "u8",
        },
      ],
    },
    {
      name: "addLiquidityAddCollateral",
      accounts: [
        {
          name: "authority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "userFarm",
          isMut: true,
          isSigner: false,
        },
        {
          name: "leveragedFarm",
          isMut: true,
          isSigner: false,
        },
        {
          name: "liquidityProgramId",
          isMut: false,
          isSigner: false,
        },
        {
          name: "ammId",
          isMut: true,
          isSigner: false,
        },
        {
          name: "ammAuthority",
          isMut: true,
          isSigner: false,
        },
        {
          name: "ammOpenOrders",
          isMut: true,
          isSigner: false,
        },
        {
          name: "ammQuantitiesOrTargetOrders",
          isMut: true,
          isSigner: false,
        },
        {
          name: "lpMintAddress",
          isMut: true,
          isSigner: false,
        },
        {
          name: "poolCoinTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "poolPcTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "serumMarket",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "levFarmCoinTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "levFarmPcTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userLpTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "pythPriceAccount",
          isMut: false,
          isSigner: false,
        },
        {
          name: "lendingMarketAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userFarmObligation",
          isMut: true,
          isSigner: false,
        },
        {
          name: "derivedLendingMarketAuthority",
          isMut: true,
          isSigner: false,
        },
        {
          name: "lendingProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "clock",
          isMut: false,
          isSigner: false,
        },
        {
          name: "dexProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "obligationIndex",
          type: "u8",
        },
      ],
    },
    {
      name: "depositOrcaVault",
      accounts: [
        {
          name: "authority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "vaultAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "vaultUserAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
        {
          name: "vaultPda",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "userFarmOwner",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userTransferAuthority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "userBaseTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userFarmTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userRewardTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "globalBaseTokenVault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "farmTokenMint",
          isMut: true,
          isSigner: false,
        },
        {
          name: "globalFarm",
          isMut: true,
          isSigner: false,
        },
        {
          name: "orcaUserFarm",
          isMut: true,
          isSigner: false,
        },
        {
          name: "globalRewardTokenVault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "convertAuthority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "aquaFarmProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "fundingTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "solfarmVaultProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "leveragedFarm",
          isMut: false,
          isSigner: false,
        },
        {
          name: "leveragedUserFarm",
          isMut: true,
          isSigner: false,
        },
        {
          name: "clock",
          isMut: false,
          isSigner: false,
        },
        {
          name: "obligationVaultAddress",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "depositArgs",
          type: {
            defined: "DepositOrcaVaultArgs",
          },
        },
        {
          name: "obligationIndex",
          type: "u8",
        },
      ],
    },
    {
      name: "withdrawOrcaVault",
      accounts: [
        {
          name: "authority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "vaultAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "vaultUserAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
        {
          name: "vaultPda",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "userFarmOwner",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userTransferAuthority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "userBaseTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userFarmTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userRewardTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "globalBaseTokenVault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "farmTokenMint",
          isMut: true,
          isSigner: false,
        },
        {
          name: "globalFarm",
          isMut: true,
          isSigner: false,
        },
        {
          name: "orcaUserFarm",
          isMut: true,
          isSigner: false,
        },
        {
          name: "globalRewardTokenVault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "convertAuthority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "aquaFarmProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "receivingTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "clock",
          isMut: false,
          isSigner: false,
        },
        {
          name: "leveragedUserFarm",
          isMut: true,
          isSigner: false,
        },
        {
          name: "leveragedFarm",
          isMut: true,
          isSigner: false,
        },
        {
          name: "solfarmVaultProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "obligationVaultAddress",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "obligationIndex",
          type: "u8",
        },
      ],
    },
    {
      name: "depositVault",
      accounts: [
        {
          name: "authority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "userFarm",
          isMut: true,
          isSigner: false,
        },
        {
          name: "obligationVaultAddress",
          isMut: true,
          isSigner: false,
        },
        {
          name: "leveragedFarm",
          isMut: true,
          isSigner: false,
        },
        {
          name: "vaultProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "authorityTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "vaultPdaAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "vault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "lpTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userBalanceAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "stakeProgramId",
          isMut: false,
          isSigner: false,
        },
        {
          name: "poolId",
          isMut: true,
          isSigner: false,
        },
        {
          name: "poolAuthority",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userInfoAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "poolLpTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userRewardATokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "poolRewardATokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userRewardBTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "poolRewardBTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "clock",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgramId",
          isMut: false,
          isSigner: false,
        },
        {
          name: "userBalanceMetadata",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "depositArgs",
          type: {
            defined: "DepositFarmArgs",
          },
        },
        {
          name: "obligationIndex",
          type: "u8",
        },
      ],
    },
    {
      name: "withdrawVault",
      accounts: [
        {
          name: "authority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "userFarm",
          isMut: true,
          isSigner: false,
        },
        {
          name: "obligationVaultAddress",
          isMut: true,
          isSigner: false,
        },
        {
          name: "leveragedFarm",
          isMut: false,
          isSigner: false,
        },
        {
          name: "authorityTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "vault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "vaultProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "userBalanceAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userInfoAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userLpTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userRewardATokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "poolRewardATokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userRewardBTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "poolRewardBTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgramId",
          isMut: false,
          isSigner: false,
        },
        {
          name: "clock",
          isMut: false,
          isSigner: false,
        },
        {
          name: "vaultPdaAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "poolLpTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "poolAuthority",
          isMut: true,
          isSigner: false,
        },
        {
          name: "poolId",
          isMut: true,
          isSigner: false,
        },
        {
          name: "stakeProgramId",
          isMut: false,
          isSigner: false,
        },
        {
          name: "userBalanceMeta",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "withdrawArgs",
          type: {
            defined: "WithdrawFarmArgs",
          },
        },
        {
          name: "obligationIndex",
          type: "u8",
        },
      ],
    },
    {
      name: "removeLiquidity",
      accounts: [
        {
          name: "userFarm",
          isMut: true,
          isSigner: false,
        },
        {
          name: "obligationVaultAddress",
          isMut: true,
          isSigner: false,
        },
        {
          name: "leveragedFarm",
          isMut: false,
          isSigner: false,
        },
        {
          name: "liquidityProgramId",
          isMut: false,
          isSigner: false,
        },
        {
          name: "ammId",
          isMut: true,
          isSigner: false,
        },
        {
          name: "ammAuthority",
          isMut: true,
          isSigner: false,
        },
        {
          name: "ammOpenOrders",
          isMut: true,
          isSigner: false,
        },
        {
          name: "ammQuantitiesOrTargetOrders",
          isMut: true,
          isSigner: false,
        },
        {
          name: "lpMintAddress",
          isMut: true,
          isSigner: false,
        },
        {
          name: "poolCoinTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "poolPcTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "poolWithdrawQueue",
          isMut: true,
          isSigner: false,
        },
        {
          name: "poolTempLpTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "serumProgramId",
          isMut: false,
          isSigner: false,
        },
        {
          name: "serumMarket",
          isMut: true,
          isSigner: false,
        },
        {
          name: "serumCoinVaultAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "serumPcVaultAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "serumVaultSigner",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "levFarmCoinTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "levFarmPcTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userLpTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "clock",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "obligationIndex",
          type: "u8",
        },
      ],
    },
    {
      name: "swapTokensForRepayingExperimental",
      accounts: [
        {
          name: "authority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "leveragedFarm",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userFarm",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userFarmObligation",
          isMut: true,
          isSigner: false,
        },
        {
          name: "pcWallet",
          isMut: true,
          isSigner: false,
        },
        {
          name: "market",
          accounts: [
            {
              name: "market",
              isMut: true,
              isSigner: false,
            },
            {
              name: "openOrders",
              isMut: true,
              isSigner: false,
            },
            {
              name: "requestQueue",
              isMut: true,
              isSigner: false,
            },
            {
              name: "eventQueue",
              isMut: true,
              isSigner: false,
            },
            {
              name: "bids",
              isMut: true,
              isSigner: false,
            },
            {
              name: "asks",
              isMut: true,
              isSigner: false,
            },
            {
              name: "orderPayerTokenAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "coinVault",
              isMut: true,
              isSigner: false,
            },
            {
              name: "pcVault",
              isMut: true,
              isSigner: false,
            },
            {
              name: "vaultSigner",
              isMut: false,
              isSigner: false,
            },
            {
              name: "coinWallet",
              isMut: true,
              isSigner: false,
            },
          ],
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
        {
          name: "dexProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "vaultSigner",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "reserves",
          type: {
            vec: "publicKey",
          },
        },
        {
          name: "obligationIndex",
          type: "u8",
        },
        {
          name: "settleMethod",
          type: "u8",
        },
      ],
    },
    {
      name: "swapTokensForRepayingExperimentalSplTokenSwap",
      accounts: [
        {
          name: "authority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "leveragedFarm",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userFarm",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userFarmObligation",
          isMut: true,
          isSigner: false,
        },
        {
          name: "pcWallet",
          isMut: true,
          isSigner: false,
        },
        {
          name: "market",
          accounts: [
            {
              name: "market",
              isMut: true,
              isSigner: false,
            },
            {
              name: "openOrders",
              isMut: true,
              isSigner: false,
            },
            {
              name: "requestQueue",
              isMut: true,
              isSigner: false,
            },
            {
              name: "eventQueue",
              isMut: true,
              isSigner: false,
            },
            {
              name: "bids",
              isMut: true,
              isSigner: false,
            },
            {
              name: "asks",
              isMut: true,
              isSigner: false,
            },
            {
              name: "orderPayerTokenAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "coinVault",
              isMut: true,
              isSigner: false,
            },
            {
              name: "pcVault",
              isMut: true,
              isSigner: false,
            },
            {
              name: "vaultSigner",
              isMut: false,
              isSigner: false,
            },
            {
              name: "coinWallet",
              isMut: true,
              isSigner: false,
            },
          ],
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
        {
          name: "dexProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "vaultSigner",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "reserves",
          type: {
            vec: "publicKey",
          },
        },
        {
          name: "obligationIndex",
          type: "u8",
        },
        {
          name: "settleMethod",
          type: "u8",
        },
      ],
    },
    {
      name: "repayObligationLiquidity",
      accounts: [
        {
          name: "authority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "userFarm",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userFarmObligation",
          isMut: true,
          isSigner: false,
        },
        {
          name: "leveragedFarm",
          isMut: false,
          isSigner: false,
        },
        {
          name: "coinSourceTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "coinDestinationTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "pcSourceTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "pcDestinationTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "coinReserveAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "pcReserveAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "lendingMarketAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "derivedLendingMarketAuthority",
          isMut: true,
          isSigner: false,
        },
        {
          name: "clock",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "lendingProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "lpPythPriceAccount",
          isMut: false,
          isSigner: false,
        },
        {
          name: "coinPriceAccount",
          isMut: false,
          isSigner: false,
        },
        {
          name: "pcPriceAccount",
          isMut: false,
          isSigner: false,
        },
        {
          name: "vaultAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userCoinTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userPcTokenAccount",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "reserves",
          type: {
            vec: "publicKey",
          },
        },
        {
          name: "obligationIndex",
          type: "u8",
        },
      ],
    },
    {
      name: "forceRepayObligationLiquidity",
      accounts: [
        {
          name: "admin",
          isMut: false,
          isSigner: true,
        },
        {
          name: "global",
          isMut: false,
          isSigner: false,
        },
        {
          name: "authority",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userFarm",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userFarmObligation",
          isMut: true,
          isSigner: false,
        },
        {
          name: "leveragedFarm",
          isMut: false,
          isSigner: false,
        },
        {
          name: "coinSourceTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "coinDestinationTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "pcSourceTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "pcDestinationTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "coinReserveAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "pcReserveAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "lendingMarketAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "derivedLendingMarketAuthority",
          isMut: true,
          isSigner: false,
        },
        {
          name: "clock",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "lendingProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "lpPythPriceAccount",
          isMut: false,
          isSigner: false,
        },
        {
          name: "coinPriceAccount",
          isMut: false,
          isSigner: false,
        },
        {
          name: "pcPriceAccount",
          isMut: false,
          isSigner: false,
        },
        {
          name: "vaultAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userCoinTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userPcTokenAccount",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "reserves",
          type: {
            vec: "publicKey",
          },
        },
        {
          name: "obligationIndex",
          type: "u8",
        },
      ],
    },
    {
      name: "harvestTulips",
      accounts: [
        {
          name: "authority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "userFarm",
          isMut: true,
          isSigner: false,
        },
        {
          name: "obligationVaultAddress",
          isMut: true,
          isSigner: false,
        },
        {
          name: "leveragedFarm",
          isMut: false,
          isSigner: false,
        },
        {
          name: "vaultProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "vault",
          isMut: true,
          isSigner: false,
        },
        {
          name: "vaultPdaAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userInfoAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userBalanceAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userTulipRewardMetadata",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userTulipTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "vaultTulipTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "authorityTulipTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgramId",
          isMut: false,
          isSigner: false,
        },
        {
          name: "clock",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "harvestArgs",
          type: {
            defined: "HarvestFarmTulipsArgs",
          },
        },
        {
          name: "obligationIndex",
          type: "u8",
        },
      ],
    },
    {
      name: "startUserObligationLiquidation",
      accounts: [
        {
          name: "global",
          isMut: false,
          isSigner: false,
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "userFarm",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userObligation",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userObligationLiquidation",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tempLiquidationLpTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tempLiquidationBaseTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tempLiquidationQuoteTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "levfarmBaseTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "levfarmQuoteTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "lendingProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "leveragedFarm",
          isMut: false,
          isSigner: false,
        },
        {
          name: "clock",
          isMut: false,
          isSigner: false,
        },
        {
          name: "rent",
          isMut: false,
          isSigner: false,
        },
        {
          name: "systemProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "pythPriceAccount",
          isMut: false,
          isSigner: false,
        },
        {
          name: "coinPriceAccount",
          isMut: false,
          isSigner: false,
        },
        {
          name: "pcPriceAccount",
          isMut: false,
          isSigner: false,
        },
        {
          name: "vaultAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "lendingMarketAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "derivedLendingMarketAuthority",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "reserves",
          type: {
            vec: "publicKey",
          },
        },
        {
          name: "obligationIndex",
          type: "u8",
        },
        {
          name: "temporaryAccountNonce",
          type: "u8",
        },
      ],
    },
    {
      name: "pullLpForLiquidationSplTokenSwap",
      accounts: [
        {
          name: "userObligationLiquidation",
          isMut: false,
          isSigner: false,
        },
        {
          name: "withdrawFarm",
          accounts: [
            {
              name: "authority",
              isMut: true,
              isSigner: true,
            },
            {
              name: "vaultAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "vaultUserAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "tokenProgram",
              isMut: false,
              isSigner: false,
            },
            {
              name: "rent",
              isMut: false,
              isSigner: false,
            },
            {
              name: "vaultPda",
              isMut: true,
              isSigner: false,
            },
            {
              name: "systemProgram",
              isMut: false,
              isSigner: false,
            },
            {
              name: "userFarmOwner",
              isMut: true,
              isSigner: false,
            },
            {
              name: "userTransferAuthority",
              isMut: false,
              isSigner: false,
            },
            {
              name: "userBaseTokenAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "userFarmTokenAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "userRewardTokenAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "globalBaseTokenVault",
              isMut: true,
              isSigner: false,
            },
            {
              name: "farmTokenMint",
              isMut: true,
              isSigner: false,
            },
            {
              name: "globalFarm",
              isMut: true,
              isSigner: false,
            },
            {
              name: "orcaUserFarm",
              isMut: true,
              isSigner: false,
            },
            {
              name: "globalRewardTokenVault",
              isMut: true,
              isSigner: false,
            },
            {
              name: "convertAuthority",
              isMut: false,
              isSigner: false,
            },
            {
              name: "aquaFarmProgram",
              isMut: false,
              isSigner: false,
            },
            {
              name: "receivingTokenAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "clock",
              isMut: false,
              isSigner: false,
            },
            {
              name: "leveragedUserFarm",
              isMut: true,
              isSigner: false,
            },
            {
              name: "leveragedFarm",
              isMut: true,
              isSigner: false,
            },
            {
              name: "solfarmVaultProgram",
              isMut: false,
              isSigner: false,
            },
            {
              name: "obligationVaultAddress",
              isMut: true,
              isSigner: false,
            },
          ],
        },
      ],
      args: [
        {
          name: "obligationIndex",
          type: "u8",
        },
      ],
    },
    {
      name: "pullLpForLiquidation",
      accounts: [
        {
          name: "global",
          isMut: false,
          isSigner: false,
        },
        {
          name: "userObligationLiquidation",
          isMut: false,
          isSigner: false,
        },
        {
          name: "withdrawFarm",
          accounts: [
            {
              name: "authority",
              isMut: false,
              isSigner: true,
            },
            {
              name: "userFarm",
              isMut: true,
              isSigner: false,
            },
            {
              name: "obligationVaultAddress",
              isMut: true,
              isSigner: false,
            },
            {
              name: "leveragedFarm",
              isMut: false,
              isSigner: false,
            },
            {
              name: "authorityTokenAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "vault",
              isMut: true,
              isSigner: false,
            },
            {
              name: "vaultProgram",
              isMut: false,
              isSigner: false,
            },
            {
              name: "userBalanceAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "userInfoAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "userLpTokenAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "userRewardATokenAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "poolRewardATokenAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "userRewardBTokenAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "poolRewardBTokenAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "tokenProgramId",
              isMut: false,
              isSigner: false,
            },
            {
              name: "clock",
              isMut: false,
              isSigner: false,
            },
            {
              name: "vaultPdaAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "poolLpTokenAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "poolAuthority",
              isMut: true,
              isSigner: false,
            },
            {
              name: "poolId",
              isMut: true,
              isSigner: false,
            },
            {
              name: "stakeProgramId",
              isMut: false,
              isSigner: false,
            },
            {
              name: "userBalanceMeta",
              isMut: true,
              isSigner: false,
            },
          ],
        },
      ],
      args: [
        {
          name: "metaNonce",
          type: "u8",
        },
        {
          name: "nonce",
          type: "u8",
        },
        {
          name: "obligationIndex",
          type: "u8",
        },
      ],
    },
    {
      name: "removeLiquidityForLiquidation",
      accounts: [
        {
          name: "global",
          isMut: false,
          isSigner: false,
        },
        {
          name: "userObligationLiquidation",
          isMut: false,
          isSigner: false,
        },
        {
          name: "removeLiquidity",
          accounts: [
            {
              name: "userFarm",
              isMut: true,
              isSigner: false,
            },
            {
              name: "obligationVaultAddress",
              isMut: true,
              isSigner: false,
            },
            {
              name: "leveragedFarm",
              isMut: false,
              isSigner: false,
            },
            {
              name: "liquidityProgramId",
              isMut: false,
              isSigner: false,
            },
            {
              name: "ammId",
              isMut: true,
              isSigner: false,
            },
            {
              name: "ammAuthority",
              isMut: true,
              isSigner: false,
            },
            {
              name: "ammOpenOrders",
              isMut: true,
              isSigner: false,
            },
            {
              name: "ammQuantitiesOrTargetOrders",
              isMut: true,
              isSigner: false,
            },
            {
              name: "lpMintAddress",
              isMut: true,
              isSigner: false,
            },
            {
              name: "poolCoinTokenAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "poolPcTokenAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "poolWithdrawQueue",
              isMut: true,
              isSigner: false,
            },
            {
              name: "poolTempLpTokenAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "serumProgramId",
              isMut: false,
              isSigner: false,
            },
            {
              name: "serumMarket",
              isMut: true,
              isSigner: false,
            },
            {
              name: "serumCoinVaultAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "serumPcVaultAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "serumVaultSigner",
              isMut: true,
              isSigner: false,
            },
            {
              name: "tokenProgram",
              isMut: false,
              isSigner: false,
            },
            {
              name: "levFarmCoinTokenAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "levFarmPcTokenAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "userLpTokenAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "clock",
              isMut: false,
              isSigner: false,
            },
          ],
        },
      ],
      args: [
        {
          name: "obligationIndex",
          type: "u8",
        },
      ],
    },
    {
      name: "serumLiquidationSwapExperimental",
      accounts: [
        {
          name: "serumSwap",
          accounts: [
            {
              name: "authority",
              isMut: false,
              isSigner: true,
            },
            {
              name: "leveragedFarm",
              isMut: true,
              isSigner: false,
            },
            {
              name: "userFarm",
              isMut: true,
              isSigner: false,
            },
            {
              name: "userFarmObligation",
              isMut: true,
              isSigner: false,
            },
            {
              name: "pcWallet",
              isMut: true,
              isSigner: false,
            },
            {
              name: "market",
              accounts: [
                {
                  name: "market",
                  isMut: true,
                  isSigner: false,
                },
                {
                  name: "openOrders",
                  isMut: true,
                  isSigner: false,
                },
                {
                  name: "requestQueue",
                  isMut: true,
                  isSigner: false,
                },
                {
                  name: "eventQueue",
                  isMut: true,
                  isSigner: false,
                },
                {
                  name: "bids",
                  isMut: true,
                  isSigner: false,
                },
                {
                  name: "asks",
                  isMut: true,
                  isSigner: false,
                },
                {
                  name: "orderPayerTokenAccount",
                  isMut: true,
                  isSigner: false,
                },
                {
                  name: "coinVault",
                  isMut: true,
                  isSigner: false,
                },
                {
                  name: "pcVault",
                  isMut: true,
                  isSigner: false,
                },
                {
                  name: "vaultSigner",
                  isMut: false,
                  isSigner: false,
                },
                {
                  name: "coinWallet",
                  isMut: true,
                  isSigner: false,
                },
              ],
            },
            {
              name: "tokenProgram",
              isMut: false,
              isSigner: false,
            },
            {
              name: "rent",
              isMut: false,
              isSigner: false,
            },
            {
              name: "dexProgram",
              isMut: false,
              isSigner: false,
            },
            {
              name: "vaultSigner",
              isMut: false,
              isSigner: false,
            },
          ],
        },
      ],
      args: [
        {
          name: "obligationIndex",
          type: "u8",
        },
        {
          name: "reserves",
          type: {
            vec: "publicKey",
          },
        },
      ],
    },
    {
      name: "splLiquidationSwapExperimental",
      accounts: [
        {
          name: "serumSwap",
          accounts: [
            {
              name: "authority",
              isMut: false,
              isSigner: true,
            },
            {
              name: "leveragedFarm",
              isMut: true,
              isSigner: false,
            },
            {
              name: "userFarm",
              isMut: true,
              isSigner: false,
            },
            {
              name: "userFarmObligation",
              isMut: true,
              isSigner: false,
            },
            {
              name: "pcWallet",
              isMut: true,
              isSigner: false,
            },
            {
              name: "market",
              accounts: [
                {
                  name: "market",
                  isMut: true,
                  isSigner: false,
                },
                {
                  name: "openOrders",
                  isMut: true,
                  isSigner: false,
                },
                {
                  name: "requestQueue",
                  isMut: true,
                  isSigner: false,
                },
                {
                  name: "eventQueue",
                  isMut: true,
                  isSigner: false,
                },
                {
                  name: "bids",
                  isMut: true,
                  isSigner: false,
                },
                {
                  name: "asks",
                  isMut: true,
                  isSigner: false,
                },
                {
                  name: "orderPayerTokenAccount",
                  isMut: true,
                  isSigner: false,
                },
                {
                  name: "coinVault",
                  isMut: true,
                  isSigner: false,
                },
                {
                  name: "pcVault",
                  isMut: true,
                  isSigner: false,
                },
                {
                  name: "vaultSigner",
                  isMut: false,
                  isSigner: false,
                },
                {
                  name: "coinWallet",
                  isMut: true,
                  isSigner: false,
                },
              ],
            },
            {
              name: "tokenProgram",
              isMut: false,
              isSigner: false,
            },
            {
              name: "rent",
              isMut: false,
              isSigner: false,
            },
            {
              name: "dexProgram",
              isMut: false,
              isSigner: false,
            },
            {
              name: "vaultSigner",
              isMut: false,
              isSigner: false,
            },
          ],
        },
      ],
      args: [
        {
          name: "obligationIndex",
          type: "u8",
        },
        {
          name: "reserves",
          type: {
            vec: "publicKey",
          },
        },
      ],
    },
    {
      name: "setTemporaryLiquidationAccount",
      accounts: [
        {
          name: "global",
          isMut: false,
          isSigner: false,
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "userObligationLiquidation",
          isMut: true,
          isSigner: false,
        },
        {
          name: "destinationLpTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "sourceLpTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "userFarmManager",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userFarmOwner",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "lpTokenAccount",
          type: "publicKey",
        },
        {
          name: "index",
          type: "u8",
        },
        {
          name: "farm",
          type: {
            defined: "Farms",
          },
        },
      ],
    },
    {
      name: "repayLiquidationDebt",
      accounts: [
        {
          name: "global",
          isMut: false,
          isSigner: false,
        },
        {
          name: "userObligationLiquidation",
          isMut: true,
          isSigner: false,
        },
        {
          name: "obligationLiquidity",
          accounts: [
            {
              name: "authority",
              isMut: true,
              isSigner: true,
            },
            {
              name: "userFarm",
              isMut: true,
              isSigner: false,
            },
            {
              name: "userFarmObligation",
              isMut: true,
              isSigner: false,
            },
            {
              name: "leveragedFarm",
              isMut: false,
              isSigner: false,
            },
            {
              name: "coinSourceTokenAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "coinDestinationTokenAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "pcSourceTokenAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "pcDestinationTokenAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "coinReserveAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "pcReserveAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "lendingMarketAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "derivedLendingMarketAuthority",
              isMut: true,
              isSigner: false,
            },
            {
              name: "clock",
              isMut: false,
              isSigner: false,
            },
            {
              name: "tokenProgram",
              isMut: false,
              isSigner: false,
            },
            {
              name: "lendingProgram",
              isMut: false,
              isSigner: false,
            },
            {
              name: "lpPythPriceAccount",
              isMut: false,
              isSigner: false,
            },
            {
              name: "coinPriceAccount",
              isMut: false,
              isSigner: false,
            },
            {
              name: "pcPriceAccount",
              isMut: false,
              isSigner: false,
            },
            {
              name: "vaultAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "userCoinTokenAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "userPcTokenAccount",
              isMut: true,
              isSigner: false,
            },
          ],
        },
      ],
      args: [
        {
          name: "reserves",
          type: {
            vec: "publicKey",
          },
        },
        {
          name: "obligationIndex",
          type: "u8",
        },
      ],
    },
    {
      name: "endObligationLiquidation",
      accounts: [
        {
          name: "global",
          isMut: false,
          isSigner: false,
        },
        {
          name: "userObligationLiquidation",
          isMut: true,
          isSigner: false,
        },
        {
          name: "authority",
          isMut: true,
          isSigner: true,
        },
        {
          name: "userFarm",
          isMut: true,
          isSigner: false,
        },
        {
          name: "leveragedFarm",
          isMut: false,
          isSigner: false,
        },
        {
          name: "lpTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "baseTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "quoteTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "liquidatorBaseAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "liquidatorQuoteAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "liquidatorLpAccount",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "obligationIndex",
          type: "u8",
        },
      ],
    },
    {
      name: "topUpPosition",
      accounts: [
        {
          name: "authority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "userFarm",
          isMut: true,
          isSigner: false,
        },
        {
          name: "leveragedFarm",
          isMut: false,
          isSigner: false,
        },
        {
          name: "userFarmObligation",
          isMut: true,
          isSigner: false,
        },
        {
          name: "coinSourceTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "coinDestinationTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "pcSourceTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "pcDestinationTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "coinDepositReserveAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "pcDepositReserveAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "coinReserveLiquidityOracle",
          isMut: false,
          isSigner: false,
        },
        {
          name: "pcReserveLiquidityOracle",
          isMut: false,
          isSigner: false,
        },
        {
          name: "lendingMarketAccount",
          isMut: false,
          isSigner: false,
        },
        {
          name: "derivedLendingMarketAuthority",
          isMut: false,
          isSigner: false,
        },
        {
          name: "clock",
          isMut: false,
          isSigner: false,
        },
        {
          name: "lendingProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "coinAmount",
          type: "u64",
        },
        {
          name: "pcAmount",
          type: "u64",
        },
        {
          name: "obligationIndex",
          type: "u8",
        },
      ],
    },
    {
      name: "forceRemoveLiqUpdate",
      accounts: [
        {
          name: "userAuthority",
          isMut: true,
          isSigner: false,
        },
        {
          name: "depositFarm",
          accounts: [
            {
              name: "authority",
              isMut: false,
              isSigner: true,
            },
            {
              name: "userFarm",
              isMut: true,
              isSigner: false,
            },
            {
              name: "obligationVaultAddress",
              isMut: true,
              isSigner: false,
            },
            {
              name: "leveragedFarm",
              isMut: true,
              isSigner: false,
            },
            {
              name: "vaultProgram",
              isMut: false,
              isSigner: false,
            },
            {
              name: "authorityTokenAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "vaultPdaAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "vault",
              isMut: true,
              isSigner: false,
            },
            {
              name: "lpTokenAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "userBalanceAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "systemProgram",
              isMut: false,
              isSigner: false,
            },
            {
              name: "stakeProgramId",
              isMut: false,
              isSigner: false,
            },
            {
              name: "poolId",
              isMut: true,
              isSigner: false,
            },
            {
              name: "poolAuthority",
              isMut: true,
              isSigner: false,
            },
            {
              name: "userInfoAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "poolLpTokenAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "userRewardATokenAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "poolRewardATokenAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "userRewardBTokenAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "poolRewardBTokenAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "clock",
              isMut: false,
              isSigner: false,
            },
            {
              name: "rent",
              isMut: false,
              isSigner: false,
            },
            {
              name: "tokenProgramId",
              isMut: false,
              isSigner: false,
            },
            {
              name: "userBalanceMetadata",
              isMut: true,
              isSigner: false,
            },
          ],
        },
      ],
      args: [
        {
          name: "depositArgs",
          type: {
            defined: "ForceDepositFarmArgs",
          },
        },
        {
          name: "obligationIndex",
          type: "u8",
        },
      ],
    },
    {
      name: "forcePositionStateReset",
      accounts: [
        {
          name: "userFarmAuthority",
          isMut: true,
          isSigner: false,
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "userFarm",
          isMut: true,
          isSigner: false,
        },
        {
          name: "leveragedFarm",
          isMut: false,
          isSigner: false,
        },
        {
          name: "global",
          isMut: false,
          isSigner: false,
        },
        {
          name: "tempLiquidationBaseTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tempLiquidationQuoteTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "levfarmBaseTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "levfarmQuoteTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "farm",
          type: "u64",
        },
        {
          name: "newState",
          type: "u64",
        },
        {
          name: "obligationIndex",
          type: "u8",
        },
      ],
    },
    {
      name: "forceDepositVault",
      accounts: [
        {
          name: "userAuthority",
          isMut: true,
          isSigner: false,
        },
        {
          name: "depositFarm",
          accounts: [
            {
              name: "authority",
              isMut: false,
              isSigner: true,
            },
            {
              name: "userFarm",
              isMut: true,
              isSigner: false,
            },
            {
              name: "obligationVaultAddress",
              isMut: true,
              isSigner: false,
            },
            {
              name: "leveragedFarm",
              isMut: true,
              isSigner: false,
            },
            {
              name: "vaultProgram",
              isMut: false,
              isSigner: false,
            },
            {
              name: "authorityTokenAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "vaultPdaAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "vault",
              isMut: true,
              isSigner: false,
            },
            {
              name: "lpTokenAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "userBalanceAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "systemProgram",
              isMut: false,
              isSigner: false,
            },
            {
              name: "stakeProgramId",
              isMut: false,
              isSigner: false,
            },
            {
              name: "poolId",
              isMut: true,
              isSigner: false,
            },
            {
              name: "poolAuthority",
              isMut: true,
              isSigner: false,
            },
            {
              name: "userInfoAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "poolLpTokenAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "userRewardATokenAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "poolRewardATokenAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "userRewardBTokenAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "poolRewardBTokenAccount",
              isMut: true,
              isSigner: false,
            },
            {
              name: "clock",
              isMut: false,
              isSigner: false,
            },
            {
              name: "rent",
              isMut: false,
              isSigner: false,
            },
            {
              name: "tokenProgramId",
              isMut: false,
              isSigner: false,
            },
            {
              name: "userBalanceMetadata",
              isMut: true,
              isSigner: false,
            },
          ],
        },
      ],
      args: [
        {
          name: "depositArgs",
          type: {
            defined: "ForceDepositFarmArgs",
          },
        },
        {
          name: "obligationIndex",
          type: "u8",
        },
      ],
    },
    {
      name: "updateLeveragedFarmAccount",
      accounts: [
        {
          name: "global",
          isMut: false,
          isSigner: false,
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "leveragedFarm",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [
        {
          name: "fieldName",
          type: "string",
        },
        {
          name: "fieldValue",
          type: "string",
        },
        {
          name: "raydiumUpdate",
          type: {
            defined: "RaydiumLevFarmUpdate",
          },
        },
        {
          name: "acceptDanger",
          type: "bool",
        },
      ],
    },
    {
      name: "emergencyLpTokenTransfer",
      accounts: [
        {
          name: "global",
          isMut: false,
          isSigner: false,
        },
        {
          name: "authority",
          isMut: false,
          isSigner: true,
        },
        {
          name: "leveragedFarm",
          isMut: true,
          isSigner: false,
        },
        {
          name: "userObligationLiquidation",
          isMut: false,
          isSigner: false,
        },
        {
          name: "userFarm",
          isMut: false,
          isSigner: false,
        },
        {
          name: "destinationTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "sourceTokenAccount",
          isMut: true,
          isSigner: false,
        },
        {
          name: "tokenProgram",
          isMut: false,
          isSigner: false,
        },
        {
          name: "obligationVaultAddress",
          isMut: true,
          isSigner: false,
        },
      ],
      args: [],
    },
  ],
  state: {
    struct: {
      name: "Global",
      type: {
        kind: "struct",
        fields: [
          {
            name: "authority",
            type: "publicKey",
          },
          {
            name: "whitelisted",
            type: {
              array: ["publicKey", 5],
            },
          },
        ],
      },
    },
    methods: [
      {
        name: "new",
        accounts: [
          {
            name: "authority",
            isMut: false,
            isSigner: true,
          },
        ],
        args: [],
      },
      {
        name: "addWhitelisted",
        accounts: [
          {
            name: "authority",
            isMut: false,
            isSigner: true,
          },
        ],
        args: [
          {
            name: "toAdd",
            type: "publicKey",
          },
          {
            name: "index",
            type: "u8",
          },
        ],
      },
      {
        name: "setAuthority",
        accounts: [
          {
            name: "authority",
            isMut: false,
            isSigner: true,
          },
        ],
        args: [
          {
            name: "auth",
            type: "publicKey",
          },
        ],
      },
    ],
  },
  accounts: [
    {
      name: "LeveragedFarm",
      type: {
        kind: "struct",
        fields: [
          {
            name: "global",
            type: "publicKey",
          },
          {
            name: "solfarmVaultProgram",
            type: "publicKey",
          },
          {
            name: "solfarmVaultAddress",
            type: "publicKey",
          },
          {
            name: "serumMarket",
            type: "publicKey",
          },
          {
            name: "serumRequestQueue",
            type: "publicKey",
          },
          {
            name: "serumEventQueue",
            type: "publicKey",
          },
          {
            name: "serumMarketBids",
            type: "publicKey",
          },
          {
            name: "serumMarketAsks",
            type: "publicKey",
          },
          {
            name: "serumCoinVaultAccount",
            type: "publicKey",
          },
          {
            name: "serumPcVaultAccount",
            type: "publicKey",
          },
          {
            name: "serumFeeRecipient",
            type: "publicKey",
          },
          {
            name: "serumDexProgram",
            type: "publicKey",
          },
          {
            name: "serumBaseReferralAccount",
            type: "publicKey",
          },
          {
            name: "serumQuoteReferralAccount",
            type: "publicKey",
          },
          {
            name: "serumOpenOrdersAccount",
            type: "publicKey",
          },
          {
            name: "raydiumLpMintAddress",
            type: "publicKey",
          },
          {
            name: "raydiumAmmId",
            type: "publicKey",
          },
          {
            name: "raydiumAmmAuthority",
            type: "publicKey",
          },
          {
            name: "raydiumAmmOpenOrders",
            type: "publicKey",
          },
          {
            name: "raydiumAmmQuantitiesOrTargetOrders",
            type: "publicKey",
          },
          {
            name: "raydiumLiquidityProgram",
            type: "publicKey",
          },
          {
            name: "raydiumCoinAccount",
            type: "publicKey",
          },
          {
            name: "raydiumPcAccount",
            type: "publicKey",
          },
          {
            name: "raydiumPoolTempTokenAccount",
            type: "publicKey",
          },
          {
            name: "raydiumPoolWithdrawQueue",
            type: "publicKey",
          },
          {
            name: "lendingMarket",
            type: "publicKey",
          },
          {
            name: "lendingProgram",
            type: "publicKey",
          },
          {
            name: "baseMint",
            type: "publicKey",
          },
          {
            name: "quoteMint",
            type: "publicKey",
          },
          {
            name: "baseReserve",
            type: "publicKey",
          },
          {
            name: "quoteReserve",
            type: "publicKey",
          },
          {
            name: "baseTokenAccount",
            type: "publicKey",
          },
          {
            name: "quoteTokenAccount",
            type: "publicKey",
          },
          {
            name: "lpDecimals",
            type: "u8",
          },
          {
            name: "baseDecimals",
            type: "u8",
          },
          {
            name: "quoteDecimals",
            type: "u8",
          },
          {
            name: "farmType",
            type: {
              defined: "Farms",
            },
          },
          {
            name: "initialized",
            type: "bool",
          },
          {
            name: "supportsFee",
            type: "bool",
          },
          {
            name: "feeReceiver",
            type: "publicKey",
          },
          {
            name: "lpTokenPriceAccount",
            type: "publicKey",
          },
          {
            name: "coinPriceAccount",
            type: "publicKey",
          },
          {
            name: "pcPriceAccount",
            type: "publicKey",
          },
          {
            name: "coinReserveLiquidityFeeReceiver",
            type: "publicKey",
          },
          {
            name: "pcReserveLiquidityFeeReceiver",
            type: "publicKey",
          },
          {
            name: "borrowAuthorizer",
            type: "publicKey",
          },
          {
            name: "borrowAuthorizerNonce",
            type: "u8",
          },
          {
            name: "nonce",
            type: "u8",
          },
          {
            name: "buySlip",
            type: "u64",
          },
          {
            name: "sellSlip",
            type: "u64",
          },
          {
            name: "buffer",
            type: {
              array: ["u8", 304],
            },
          },
        ],
      },
    },
    {
      name: "UserFarm",
      type: {
        kind: "struct",
        fields: [
          {
            name: "authority",
            type: "publicKey",
          },
          {
            name: "leveragedFarm",
            type: "publicKey",
          },
          {
            name: "userFarmNumber",
            type: "u8",
          },
          {
            name: "numberOfObligations",
            type: "u8",
          },
          {
            name: "numberOfUserFarms",
            type: "u8",
          },
          {
            name: "nonce",
            type: "u8",
          },
          {
            name: "obligations",
            type: {
              array: [
                {
                  defined: "Obligation",
                },
                3,
              ],
            },
          },
        ],
      },
    },
    {
      name: "ObligationLiquidationAccount",
      type: {
        kind: "struct",
        fields: [
          {
            name: "userFarm",
            type: "publicKey",
          },
          {
            name: "obligation",
            type: "publicKey",
          },
          {
            name: "obligationIndex",
            type: "u8",
          },
          {
            name: "lpTokenAccount",
            type: "publicKey",
          },
          {
            name: "baseTokenAccount",
            type: "publicKey",
          },
          {
            name: "quoteTokenAccount",
            type: "publicKey",
          },
          {
            name: "coinReturn",
            type: "u64",
          },
          {
            name: "pcReturn",
            type: "u64",
          },
          {
            name: "farmKey",
            type: {
              defined: "Farms",
            },
          },
          {
            name: "leveragedFarmAccount",
            type: "publicKey",
          },
          {
            name: "buffer",
            type: {
              array: ["u8", 127],
            },
          },
        ],
      },
    },
  ],
  types: [
    {
      name: "Farms",
      type: {
        kind: "enum",
        variants: [
          {
            name: "RayUsdcVault",
          },
          {
            name: "RaySolVault",
          },
          {
            name: "RayUsdtVault",
          },
          {
            name: "RaySrmVault",
          },
          {
            name: "MerUsdcVault",
          },
          {
            name: "MediaUsdcVault",
          },
          {
            name: "CopeUsdcVault",
          },
          {
            name: "RayEthVault",
          },
          {
            name: "StepUsdcVault",
          },
          {
            name: "RopeUsdcVault",
          },
          {
            name: "AlephUsdcVault",
          },
          {
            name: "TulipUsdcVault",
          },
          {
            name: "SnyUsdcVault",
          },
          {
            name: "BopRayVault",
          },
          {
            name: "SlrsUsdcVault",
          },
          {
            name: "SamoRayVault",
          },
          {
            name: "LikeUsdcVault",
          },
          {
            name: "OrcaUsdcVault",
          },
          {
            name: "OrcaSolVault",
          },
          {
            name: "AtlasUsdcVault",
          },
          {
            name: "AtlasRayVault",
          },
          {
            name: "PolisUsdcVault",
          },
          {
            name: "PolisRayVault",
          },
          {
            name: "Unknown",
          },
        ],
      },
    },
    {
      name: "Position",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Opening",
          },
          {
            name: "Swapped",
          },
          {
            name: "AddedLiquidity",
          },
          {
            name: "Opened",
          },
          {
            name: "Withdrawing",
          },
          {
            name: "RemovedLiquidity",
          },
          {
            name: "SwappedForRepaying",
          },
          {
            name: "Repaid",
          },
          {
            name: "Withdrawn",
          },
          {
            name: "Closing",
          },
          {
            name: "ClosingAndExiting",
          },
          {
            name: "Closed",
          },
          {
            name: "ExitingAndLiquidated",
          },
          {
            name: "Liquidated",
          },
          {
            name: "TopUp",
          },
          {
            name: "Borrowed",
          },
          {
            name: "TopUpSwapped",
          },
          {
            name: "TopUpAddedLiquidity",
          },
        ],
      },
    },
    {
      name: "Obligation",
      type: {
        kind: "struct",
        fields: [
          {
            name: "obligationAccount",
            type: "publicKey",
          },
          {
            name: "coinAmount",
            type: "u64",
          },
          {
            name: "pcAmount",
            type: "u64",
          },
          {
            name: "depositedLpTokens",
            type: "u64",
          },
          {
            name: "positionState",
            type: {
              defined: "Position",
            },
          },
        ],
      },
    },
    {
      name: "BorrowedAsset",
      type: {
        kind: "struct",
        fields: [
          {
            name: "reserve",
            type: "publicKey",
          },
          {
            name: "amount",
            type: "u64",
          },
        ],
      },
    },
    {
      name: "DepositedAsset",
      type: {
        kind: "struct",
        fields: [
          {
            name: "reserve",
            type: "publicKey",
          },
          {
            name: "amount",
            type: "u64",
          },
          {
            name: "returnAmount",
            type: "u64",
          },
          {
            name: "penaltyAmount",
            type: "u64",
          },
        ],
      },
    },
    {
      name: "AddLiquidityArgs",
      type: {
        kind: "struct",
        fields: [
          {
            name: "coinTakepnl",
            type: "u64",
          },
          {
            name: "pcTakepnl",
            type: "u64",
          },
        ],
      },
    },
    {
      name: "DepositBorrowArgs",
      type: {
        kind: "struct",
        fields: [
          {
            name: "reserves",
            type: {
              vec: "publicKey",
            },
          },
          {
            name: "coinAmount",
            type: "u64",
          },
          {
            name: "pcAmount",
            type: "u64",
          },
          {
            name: "borrowAmount",
            type: "u64",
          },
          {
            name: "obligationIdx",
            type: "u64",
          },
        ],
      },
    },
    {
      name: "Side",
      type: {
        kind: "enum",
        variants: [
          {
            name: "Bid",
          },
          {
            name: "Ask",
          },
        ],
      },
    },
    {
      name: "DepositFarmArgs",
      type: {
        kind: "struct",
        fields: [
          {
            name: "nonce",
            type: "u8",
          },
          {
            name: "metaNonce",
            type: "u8",
          },
        ],
      },
    },
    {
      name: "ForceDepositFarmArgs",
      type: {
        kind: "struct",
        fields: [
          {
            name: "lpTokenAmount",
            type: "u64",
          },
          {
            name: "coinAmount",
            type: "u64",
          },
          {
            name: "pcAmount",
            type: "u64",
          },
          {
            name: "depositFarmArgs",
            type: {
              defined: "DepositFarmArgs",
            },
          },
        ],
      },
    },
    {
      name: "WithdrawFarmArgs",
      type: {
        kind: "struct",
        fields: [
          {
            name: "metaNonce",
            type: "u8",
          },
          {
            name: "nonce",
            type: "u8",
          },
        ],
      },
    },
    {
      name: "HarvestFarmTulipsArgs",
      type: {
        kind: "struct",
        fields: [
          {
            name: "nonce",
            type: "u8",
          },
          {
            name: "metaNonce",
            type: "u8",
          },
          {
            name: "rewardNonce",
            type: "u8",
          },
        ],
      },
    },
    {
      name: "RaydiumLevFarmUpdate",
      type: {
        kind: "struct",
        fields: [
          {
            name: "raydiumLpMintAddress",
            type: "publicKey",
          },
          {
            name: "raydiumAmmId",
            type: "publicKey",
          },
          {
            name: "raydiumAmmAuthority",
            type: "publicKey",
          },
          {
            name: "raydiumAmmOpenOrders",
            type: "publicKey",
          },
          {
            name: "raydiumAmmQuantitiesOrTargetOrders",
            type: "publicKey",
          },
          {
            name: "raydiumLiquidityProgram",
            type: "publicKey",
          },
          {
            name: "raydiumCoinAccount",
            type: "publicKey",
          },
          {
            name: "raydiumPcAccount",
            type: "publicKey",
          },
          {
            name: "raydiumPoolTempTokenAccount",
            type: "publicKey",
          },
          {
            name: "raydiumPoolWithdrawQueue",
            type: "publicKey",
          },
        ],
      },
    },
    {
      name: "DepositOrcaVaultArgs",
      type: {
        kind: "struct",
        fields: [
          {
            name: "accountNonce",
            type: "u8",
          },
        ],
      },
    },
  ],
  errors: [
    {
      code: 100,
      name: "Unauthorized",
      msg: "unauthorized access",
    },
    {
      code: 101,
      name: "TooManyReserves",
      msg: "market has too many reserves",
    },
    {
      code: 102,
      name: "InvalidReserveCount",
      msg: "given reserves does not match remaining accounts length",
    },
    {
      code: 103,
      name: "NoReserveSpaceLeft",
      msg: "obligation has no reserve space available for action",
    },
    {
      code: 104,
      name: "UnknownReserve",
      msg: "unknown reserve given",
    },
    {
      code: 105,
      name: "InvalidReferralAccount",
      msg: "invalid referral account given",
    },
    {
      code: 106,
      name: "InvalidFarmProgram",
      msg: "invalid farm program given",
    },
    {
      code: 107,
      name: "InvalidDestinationCollateralTokenAccount",
      msg: "invalid destination collateral token account given",
    },
    {
      code: 108,
      name: "InvalidSourceCollateralTokenAccount",
      msg: "invalid source collateral token account given",
    },
    {
      code: 109,
      name: "InvalidLendingMarket",
      msg: "invalid lending market given",
    },
    {
      code: 110,
      name: "InvalidLendingProgram",
      msg: "invalid lending program given",
    },
    {
      code: 111,
      name: "InvalidUserFarmManager",
      msg: "user farm manager is invalid",
    },
    {
      code: 112,
      name: "InvalidLeveragedFarm",
      msg: "invalid leveraged farm given",
    },
    {
      code: 113,
      name: "InvalidObligationAccount",
      msg: "invalid obligation account given",
    },
    {
      code: 114,
      name: "InvalidSourceLiquidityTokenAccount",
      msg: "invalid source liquidity token account given",
    },
    {
      code: 115,
      name: "InvalidPCWallet",
      msg: "invalid pc wallet given",
    },
    {
      code: 116,
      name: "InvalidOrderPayer",
      msg: "invalid order payer account given",
    },
    {
      code: 117,
      name: "InvalidCoinWallet",
      msg: "invalid coin wallet given",
    },
    {
      code: 118,
      name: "InvalidSerumOpenOrders",
      msg: "invalid serum open orders account given",
    },
    {
      code: 119,
      name: "InvalidPCVault",
      msg: "invalid serum pc vault given",
    },
    {
      code: 120,
      name: "InvalidCoinVault",
      msg: "invalid serum coin vault given",
    },
    {
      code: 121,
      name: "InvalidAsks",
      msg: "invalid serum asks given",
    },
    {
      code: 122,
      name: "InvalidBids",
      msg: "invalid serum bids given",
    },
    {
      code: 123,
      name: "InvalidMarket",
      msg: "invalid serum market given",
    },
    {
      code: 124,
      name: "InvalidRequestQueue",
      msg: "invalid serum request queue given",
    },
    {
      code: 125,
      name: "InvalidEventQueue",
      msg: "invalid serum event queue given",
    },
    {
      code: 126,
      name: "InvalidOpenOrders",
      msg: "invalid serum open orders account",
    },
    {
      code: 127,
      name: "InvalidAmmId",
      msg: "invalid raydium amm id",
    },
    {
      code: 128,
      name: "InvalidAmmAuthority",
      msg: "invalid raydium amm authority",
    },
    {
      code: 129,
      name: "InvalidAmmOpenOrders",
      msg: "invalid raydium amm open orders",
    },
    {
      code: 130,
      name: "InvalidAmmQuantitiesOrTargetOrders",
      msg: "invalid raydium amm quantities or target ordres",
    },
    {
      code: 131,
      name: "InvalidLpMint",
      msg: "invalid lp token mint",
    },
    {
      code: 132,
      name: "InvalidFarmTokenAccount",
      msg: "invalid farm coin or farm pc token account",
    },
    {
      code: 133,
      name: "InvalidLpToken",
      msg: "invalid lp token account given",
    },
    {
      code: 134,
      name: "InvalidLiquidityProgram",
      msg: "invalid liquidity program given",
    },
    {
      code: 135,
      name: "InvalidPoolTokenAccount",
      msg: "invalid pool coin or pc token account",
    },
    {
      code: 136,
      name: "InvalidPoolWithdrawQueue",
      msg: "invalid pool withdraw queue given",
    },
    {
      code: 137,
      name: "InvalidSerumProgram",
      msg: "invalid serum dex program given",
    },
    {
      code: 138,
      name: "InvalidUserVaultAccount",
      msg: "invalid solfarm vault user balance or metadata account",
    },
    {
      code: 139,
      name: "AlreadyInitialized",
      msg: "leveraged farm is already initialized",
    },
    {
      code: 140,
      name: "Uninitialized",
      msg: "leveraged farm is uninitialized",
    },
    {
      code: 141,
      name: "InvalidBaseMint",
      msg: "invalid base token mint",
    },
    {
      code: 142,
      name: "InvalidQuoteMint",
      msg: "invalid quote mint",
    },
    {
      code: 143,
      name: "InvalidTokenOwner",
      msg: "invalid token owner",
    },
    {
      code: 144,
      name: "InvalidReferral",
      msg: "referral account is none or incorrect account",
    },
    {
      code: 145,
      name: "TooManyObligations",
      msg: "too many obligations already created, please use a different account",
    },
    {
      code: 146,
      name: "InvalidObligationIndex",
      msg: "obligation index is invalid",
    },
    {
      code: 147,
      name: "ObligationIsClosing",
      msg: "obligation account is closing, liquidation in process",
    },
    {
      code: 148,
      name: "ObligationIsOpen",
      msg: "obligation must be closing to be liquidated",
    },
    {
      code: 149,
      name: "InvalidTokenAccount",
      msg: "invalid token account given",
    },
    {
      code: 150,
      name: "ObligationIsLiquidated",
      msg: "the obligation account has been liquidated please close",
    },
    {
      code: 151,
      name: "ObligationIsNotLiquidated",
      msg: "obligation account must be liquidated to proceed",
    },
    {
      code: 152,
      name: "UnhealthyObligation",
      msg: "obligation is unhealthy",
    },
    {
      code: 153,
      name: "ObligationIsExiting",
      msg: "obligation is already exiting",
    },
    {
      code: 154,
      name: "InvalidPythPriceAccount",
      msg: "invalid pyth price account given",
    },
    {
      code: 155,
      name: "InvalidAccountOwner",
      msg: "Input account owner is not the program address",
    },
    {
      code: 156,
      name: "InvalidAccountInput",
      msg: "Invalid account input",
    },
    {
      code: 157,
      name: "ReserveStale",
      msg: "Reserve state needs to be refreshed",
    },
    {
      code: 158,
      name: "HealthyAccount",
      msg: "Trying to start liquidation on healthy account",
    },
    {
      code: 159,
      name: "InsufficientTokenAmount",
      msg: "zero base and quote tokens in obligation",
    },
    {
      code: 160,
      name: "DepositTooLowOrTooHigh",
      msg: "deposit is below the minimum required amount or above the limit",
    },
    {
      code: 161,
      name: "NotEnoughCollateral",
      msg: "not enough collateral to borrow this amount",
    },
    {
      code: 162,
      name: "InvalidOracleConfig",
      msg: "Input oracle config is invalid",
    },
    {
      code: 163,
      name: "InvalidPositionState",
      msg: "Invalid position state",
    },
    {
      code: 164,
      name: "InvalidFeeReceiver",
      msg: "Invalid fee receier",
    },
    {
      code: 165,
      name: "InvalidVaultAccount",
      msg: "Invalid vault account",
    },
    {
      code: 166,
      name: "InvalidProdBool",
      msg: "Flip prod bool",
    },
    {
      code: 167,
      name: "HighSpread",
      msg: "High Spread",
    },
    {
      code: 168,
      name: "HighSlippage",
      msg: "High Slippage",
    },
  ],
};
