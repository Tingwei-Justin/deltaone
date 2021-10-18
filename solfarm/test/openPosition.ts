import { Wallet } from "@project-serum/anchor";
import { Keypair, PublicKey } from "@solana/web3.js";
import TulipService from "../tulipService";
import { privateKey } from "../../secretKeys"

// create instance of Tulip Service. 
// generate wallet and test. 
// because if we use our real wallet and something shitty happens we are screwed. 


const wallet = new Wallet(Keypair.fromSecretKey(new PublicKey(privateKey).toBytes()))

const tulipService = new TulipService(wallet)

// get account. 

// open position.