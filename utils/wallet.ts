import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Connection, LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import { TOKENS } from './tokens';


export const getUSDCBalance = async (connection: Connection, publicKey: PublicKey): Promise<number> => {
  const { value } = await connection.getTokenAccountsByOwner(
    publicKey,
    {
      mint: new PublicKey(TOKENS.USDC.mintAddress),
      programId: TOKEN_PROGRAM_ID,
    }
  );

  let sum = 0;
  for (const { account } of value) {
    console.log(account)
    sum += account.lamports / LAMPORTS_PER_SOL;
  }

  return sum;
}