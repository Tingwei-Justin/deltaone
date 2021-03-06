export const orcaConfig = {
    "version": "0.0.0",
    "name": "vault",
    "instructions": [
      {
        "name": "newVault",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "vaultAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userFarm",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "global",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "globalFarm",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "aquaFarmProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "vaultPda",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "farmTokenMint",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "swapTokenMint",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "vaultFarmTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "vaultSwapTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "rewardTokenMint",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "vaultRewardTokenAccount",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "swapTokenAMint",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "swapTokenBMint",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "vaultSwapTokenAAccount",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "vaultSwapTokenBAccount",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "vaultUsdcTokenAccount",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "args",
            "type": {
              "defined": "NewVaultArgs"
            }
          }
        ]
      },
      {
        "name": "depositVault",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "vaultAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "vaultUserAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "rent",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "vaultPda",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "userFarmOwner",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userTransferAuthority",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "userBaseTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userFarmTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userRewardTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "globalBaseTokenVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "farmTokenMint",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "globalFarm",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userFarm",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "globalRewardTokenVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "convertAuthority",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "aquaFarmProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "fundingTokenAccount",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "depositArgs",
            "type": {
              "defined": "DepositVaultArgs"
            }
          }
        ]
      },
      {
        "name": "withdrawVault",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "vaultAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "vaultUserAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "rent",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "vaultPda",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "userFarmOwner",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userTransferAuthority",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "userBaseTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userFarmTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userRewardTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "globalBaseTokenVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "farmTokenMint",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "globalFarm",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userFarm",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "globalRewardTokenVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "convertAuthority",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "aquaFarmProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "receivingTokenAccount",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "addLiqDepositVault",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "vaultAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "vaultUserAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "rent",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "vaultPda",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "userFarmTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userRewardTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "globalBaseTokenVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "farmTokenMint",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "globalFarm",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userFarm",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "globalRewardTokenVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "convertAuthority",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "aquaFarmProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "fundingTokenAccountA",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "fundingTokenAccountB",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "poolTokenA",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "poolTokenB",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "swapProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "swapAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "swapAuthority",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "poolTokenMint",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "vaultSwapTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "swapPoolMint",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "depositArgs",
            "type": {
              "defined": "AddLiqDepositVaultArgs"
            }
          }
        ]
      },
      {
        "name": "addLiqDepositVaultSingle",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "vaultAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "vaultUserAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "rent",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "vaultPda",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "userFarmTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userRewardTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "globalBaseTokenVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "farmTokenMint",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "globalFarm",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userFarm",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "globalRewardTokenVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "convertAuthority",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "aquaFarmProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "fundingTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "poolTokenA",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "poolTokenB",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "swapProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "swapAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "swapAuthority",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "poolTokenMint",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "vaultSwapTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "swapPoolMint",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "depositArgs",
            "type": {
              "defined": "AddLiqDepositVaultSingleArgs"
            }
          }
        ]
      },
      {
        "name": "removeLiqWithdrawVault",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "vaultAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "vaultUserAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "rent",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "vaultPda",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "userFarmTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userRewardTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "globalBaseTokenVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "farmTokenMint",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "globalFarm",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userFarm",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "globalRewardTokenVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "convertAuthority",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "aquaFarmProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "poolTokenA",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "poolTokenB",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "swapProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "swapAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "swapAuthority",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "poolTokenMint",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "vaultSwapTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "swapPoolMint",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "swapPoolFee",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "amount",
            "type": "u64"
          }
        ]
      },
      {
        "name": "withdrawAqDepositAq",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "vaultAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "vaultUserAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "rent",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "vaultPda",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "userFarmTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "vaultFarmTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userRewardTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "vaultRewardTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "globalBaseTokenVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "farmTokenMint",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "globalFarm",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userFarm",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "vaultUserFarm",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "globalRewardTokenVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userConvertAuthority",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "vaultConvertAuthority",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "aquaFarmProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "swapProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "swapAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "swapAuthority",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "poolTokenMint",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userSwapTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "vaultSwapTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "swapPoolFee",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "args",
            "type": {
              "defined": "WithdrawAqDepositAqArgs"
            }
          }
        ]
      },
      {
        "name": "harvestRewards",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "global",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "vaultAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "vaultPda",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userFarmOwner",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userRewardTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "globalBaseTokenVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "farmTokenMint",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "globalFarm",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userFarm",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "globalRewardTokenVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "aquaFarmProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "convertAuthority",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": []
      },
      {
        "name": "swap",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "swapInfo",
            "accounts": [
              {
                "name": "vaultAccount",
                "isMut": true,
                "isSigner": false
              },
              {
                "name": "vaultPda",
                "isMut": true,
                "isSigner": false
              },
              {
                "name": "swapProgram",
                "isMut": false,
                "isSigner": false
              },
              {
                "name": "tokenProgram",
                "isMut": false,
                "isSigner": false
              },
              {
                "name": "swapAccount",
                "isMut": true,
                "isSigner": false
              },
              {
                "name": "swapAuthority",
                "isMut": false,
                "isSigner": false
              },
              {
                "name": "sourceTokenAccount",
                "isMut": true,
                "isSigner": false
              },
              {
                "name": "destinationTokenAccount",
                "isMut": true,
                "isSigner": false
              },
              {
                "name": "swapSourceAccount",
                "isMut": true,
                "isSigner": false
              },
              {
                "name": "swapDestinationAccount",
                "isMut": true,
                "isSigner": false
              },
              {
                "name": "hostFeeAccount",
                "isMut": true,
                "isSigner": false
              },
              {
                "name": "poolTokenMint",
                "isMut": true,
                "isSigner": false
              },
              {
                "name": "poolFeeAccount",
                "isMut": true,
                "isSigner": false
              }
            ]
          },
          {
            "name": "rewardFeeRecipient",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "fullAmount",
            "type": "bool"
          },
          {
            "name": "takeFee",
            "type": "bool"
          }
        ]
      },
      {
        "name": "depositLiquiditySingle",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "global",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "vaultAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "vaultPda",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "poolTokenA",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "poolTokenB",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "poolTokenAMint",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "poolTokenBMint",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "swapProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "swapAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "swapAuthority",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "poolTokenMint",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "vaultDepositTokenA",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "vaultDepositTokenB",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "vaultSwapTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "swapPoolMint",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "depositArgs",
            "type": {
              "defined": "DepositLiquidityArgs"
            }
          }
        ]
      },
      {
        "name": "depositLiquidity",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "global",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "vaultAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "vaultPda",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "poolTokenA",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "poolTokenB",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "poolTokenAMint",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "poolTokenBMint",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "swapProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "swapAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "swapAuthority",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "poolTokenMint",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "vaultDepositTokenA",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "vaultDepositTokenB",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "vaultSwapTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "swapPoolMint",
            "isMut": true,
            "isSigner": false
          }
        ],
        "args": []
      },
      {
        "name": "depositAquaFarm",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "vaultAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "rent",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "vaultPda",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "userFarmOwner",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userTransferAuthority",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "userBaseTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userFarmTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userRewardTokenAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "globalBaseTokenVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "farmTokenMint",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "globalFarm",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userFarm",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "globalRewardTokenVault",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "convertAuthority",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "aquaFarmProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": []
      },
      {
        "name": "recreateUserFarm",
        "accounts": [
          {
            "name": "authority",
            "isMut": true,
            "isSigner": true
          },
          {
            "name": "vaultAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "vaultPda",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "userFarm",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "tokenProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "global",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "globalFarm",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "aquaFarmProgram",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "rent",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "systemProgram",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": []
      },
      {
        "name": "updateVault",
        "accounts": [
          {
            "name": "authority",
            "isMut": false,
            "isSigner": true
          },
          {
            "name": "vaultAccount",
            "isMut": true,
            "isSigner": false
          },
          {
            "name": "global",
            "isMut": false,
            "isSigner": false
          }
        ],
        "args": [
          {
            "name": "args",
            "type": {
              "defined": "UpdateVaultArgs"
            }
          }
        ]
      },
      {
        "name": "adminWithdraw",
        "accounts": [
          {
            "name": "global",
            "isMut": false,
            "isSigner": false
          },
          {
            "name": "withdraw",
            "accounts": [
              {
                "name": "authority",
                "isMut": true,
                "isSigner": true
              },
              {
                "name": "vaultAccount",
                "isMut": true,
                "isSigner": false
              },
              {
                "name": "vaultUserAccount",
                "isMut": true,
                "isSigner": false
              },
              {
                "name": "tokenProgram",
                "isMut": false,
                "isSigner": false
              },
              {
                "name": "rent",
                "isMut": false,
                "isSigner": false
              },
              {
                "name": "vaultPda",
                "isMut": true,
                "isSigner": false
              },
              {
                "name": "systemProgram",
                "isMut": false,
                "isSigner": false
              },
              {
                "name": "userFarmOwner",
                "isMut": true,
                "isSigner": false
              },
              {
                "name": "userTransferAuthority",
                "isMut": false,
                "isSigner": false
              },
              {
                "name": "userBaseTokenAccount",
                "isMut": true,
                "isSigner": false
              },
              {
                "name": "userFarmTokenAccount",
                "isMut": true,
                "isSigner": false
              },
              {
                "name": "userRewardTokenAccount",
                "isMut": true,
                "isSigner": false
              },
              {
                "name": "globalBaseTokenVault",
                "isMut": true,
                "isSigner": false
              },
              {
                "name": "farmTokenMint",
                "isMut": true,
                "isSigner": false
              },
              {
                "name": "globalFarm",
                "isMut": true,
                "isSigner": false
              },
              {
                "name": "userFarm",
                "isMut": true,
                "isSigner": false
              },
              {
                "name": "globalRewardTokenVault",
                "isMut": true,
                "isSigner": false
              },
              {
                "name": "convertAuthority",
                "isMut": false,
                "isSigner": false
              },
              {
                "name": "aquaFarmProgram",
                "isMut": false,
                "isSigner": false
              },
              {
                "name": "receivingTokenAccount",
                "isMut": true,
                "isSigner": false
              }
            ]
          }
        ],
        "args": [
          {
            "name": "orcaWithdraw",
            "type": "bool"
          }
        ]
      }
    ],
    "state": {
      "struct": {
        "name": "Global",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "authority",
              "type": "publicKey"
            },
            {
              "name": "whitelisted",
              "type": {
                "array": [
                  "publicKey",
                  5
                ]
              }
            }
          ]
        }
      },
      "methods": [
        {
          "name": "new",
          "accounts": [
            {
              "name": "authority",
              "isMut": false,
              "isSigner": true
            }
          ],
          "args": []
        },
        {
          "name": "addWhitelisted",
          "accounts": [
            {
              "name": "authority",
              "isMut": false,
              "isSigner": true
            }
          ],
          "args": [
            {
              "name": "toAdd",
              "type": "publicKey"
            },
            {
              "name": "index",
              "type": "u8"
            }
          ]
        },
        {
          "name": "setAuthority",
          "accounts": [
            {
              "name": "authority",
              "isMut": false,
              "isSigner": true
            }
          ],
          "args": [
            {
              "name": "newAuthority",
              "type": "publicKey"
            }
          ]
        }
      ]
    },
    "accounts": [
      {
        "name": "Vault",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "authority",
              "type": "publicKey"
            },
            {
              "name": "pda",
              "type": "publicKey"
            },
            {
              "name": "pdaNonce",
              "type": "u8"
            },
            {
              "name": "accountNonce",
              "type": "u8"
            },
            {
              "name": "compoundAuthority",
              "type": "publicKey"
            },
            {
              "name": "userFarmAddr",
              "type": "publicKey"
            },
            {
              "name": "userFarmNonce",
              "type": "u8"
            },
            {
              "name": "totalVaultBalance",
              "type": "u64"
            },
            {
              "name": "totalVlpShares",
              "type": "u64"
            },
            {
              "name": "farmKey",
              "type": "u8"
            },
            {
              "name": "depositsPaused",
              "type": "bool"
            },
            {
              "name": "withdrawsPaused",
              "type": "bool"
            },
            {
              "name": "farmTokenAccount",
              "type": "publicKey"
            },
            {
              "name": "swapTokenAccount",
              "type": "publicKey"
            },
            {
              "name": "rewardTokenAccount",
              "type": "publicKey"
            },
            {
              "name": "precisionFactor",
              "type": "u64"
            },
            {
              "name": "lastCompoundTime",
              "type": "i64"
            },
            {
              "name": "compoundInterval",
              "type": "i64"
            },
            {
              "name": "swapTokenAAccount",
              "type": "publicKey"
            },
            {
              "name": "swapTokenBAccount",
              "type": "publicKey"
            },
            {
              "name": "slippageTolerance",
              "type": "u8"
            },
            {
              "name": "controllerFee",
              "type": "u64"
            },
            {
              "name": "platformFee",
              "type": "u64"
            },
            {
              "name": "feeRecipient",
              "type": "publicKey"
            },
            {
              "name": "hostFeeRecipient",
              "type": "publicKey"
            },
            {
              "name": "usdcTokenAccount",
              "type": "publicKey"
            },
            {
              "name": "buffer",
              "type": {
                "array": [
                  "u8",
                  545
                ]
              }
            }
          ]
        }
      },
      {
        "name": "VaultUser",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "owner",
              "type": "publicKey"
            },
            {
              "name": "vault",
              "type": "publicKey"
            },
            {
              "name": "shares",
              "type": "u64"
            },
            {
              "name": "depositedBalance",
              "type": "u64"
            },
            {
              "name": "lastDepositTime",
              "type": "i64"
            },
            {
              "name": "buffer",
              "type": {
                "array": [
                  "u8",
                  404
                ]
              }
            }
          ]
        }
      }
    ],
    "types": [
      {
        "name": "UpdateVaultArgs",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "fieldNames",
              "type": {
                "vec": "string"
              }
            },
            {
              "name": "fieldValues",
              "type": {
                "vec": "string"
              }
            }
          ]
        }
      },
      {
        "name": "NewVaultArgs",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "farmType",
              "type": "u8"
            },
            {
              "name": "feeRecipient",
              "type": "publicKey"
            },
            {
              "name": "hostFeeRecipient",
              "type": "publicKey"
            }
          ]
        }
      },
      {
        "name": "DepositVaultArgs",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "amount",
              "type": "u64"
            },
            {
              "name": "accountNonce",
              "type": "u8"
            }
          ]
        }
      },
      {
        "name": "AddLiqDepositVaultArgs",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "coin",
              "type": "u64"
            },
            {
              "name": "pc",
              "type": "u64"
            },
            {
              "name": "accountNonce",
              "type": "u8"
            }
          ]
        }
      },
      {
        "name": "AddLiqDepositVaultSingleArgs",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "amount",
              "type": "u64"
            },
            {
              "name": "accountNonce",
              "type": "u8"
            }
          ]
        }
      },
      {
        "name": "DepositLiquidityArgs",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "depositTokenA",
              "type": "bool"
            },
            {
              "name": "depositTokenB",
              "type": "bool"
            }
          ]
        }
      },
      {
        "name": "WithdrawAqDepositAqArgs",
        "type": {
          "kind": "struct",
          "fields": [
            {
              "name": "accountNonce",
              "type": "u8"
            },
            {
              "name": "aqTokens",
              "type": "u64"
            }
          ]
        }
      }
    ],
    "errors": [
      {
        "code": 300,
        "name": "Unauthorized",
        "msg": "unauthorized account"
      },
      {
        "code": 301,
        "name": "InvalidTokenProgram",
        "msg": "invalid token program"
      },
      {
        "code": 302,
        "name": "InvalidAquaFarmProgram",
        "msg": "invalid aquafarm program"
      },
      {
        "code": 303,
        "name": "InvalidUserFarmAddress",
        "msg": "invalid userfamr address"
      },
      {
        "code": 304,
        "name": "InvalidVaultAccount",
        "msg": "invalid vault account"
      },
      {
        "code": 305,
        "name": "InvalidVaultUserAccount",
        "msg": "invalid vault user account"
      },
      {
        "code": 306,
        "name": "InvalidVaultPda",
        "msg": "invalid vault pda"
      },
      {
        "code": 307,
        "name": "VaultIsPaused",
        "msg": "vault is paused"
      },
      {
        "code": 308,
        "name": "InvalidFarmTokenMint",
        "msg": "invalid farm token mint"
      },
      {
        "code": 309,
        "name": "InvalidFarmTokenAccount",
        "msg": "invalid farm token account"
      },
      {
        "code": 310,
        "name": "InvalidSwapTokenAccount",
        "msg": "invalid swap token account"
      },
      {
        "code": 311,
        "name": "InvalidGlobalTokenVault",
        "msg": "invalid global token vault"
      },
      {
        "code": 312,
        "name": "InvalidGlobalFarm",
        "msg": "invalid global farm"
      },
      {
        "code": 313,
        "name": "InvalidSystemProgram",
        "msg": "invalid system program"
      },
      {
        "code": 314,
        "name": "InvalidSwapTokenMint",
        "msg": "invalid swap token mint"
      },
      {
        "code": 315,
        "name": "InvalidRewardTokenMint",
        "msg": "invalid reward token mint"
      },
      {
        "code": 316,
        "name": "InvalidRewardTokenAccount",
        "msg": "invalid reward token account"
      }
    ]
  }