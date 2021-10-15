import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Wallet } from '@solana/wallet-adapter-wallets';
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { TOKENS } from './tokens';


export const getUSDCBalance = async (connection: Connection, publicKey: PublicKey): Promise<number> => {
  const { value } = await connection.getTokenAccountsByOwner(
    publicKey,
    {
      mint: new PublicKey(new PublicKey(TOKENS.USDC.mintAddress)), 
      programId: TOKEN_PROGRAM_ID,
    }
  );

  let sum = 0;
  console.log(value)
  for (const { account } of value) {
    console.log(account)
    sum += account.lamports ;
  }

  return sum;
}