import { TonClient } from 'ton';
import { Address, beginCell } from 'ton-core';

/**
 * Fetches the token balance for a given TON address.
 * @param walletAddress - The TON wallet address.
 * @param tokenAddress - The token address (optional).
 * @returns The balance in TON.
 */
export async function getTokenBalance(walletAddress: string, tokenAddress?: string): Promise<string> {
  try {
    const client = new TonClient({
      endpoint: 'https://toncenter.com/api/v2/jsonRPC',
    });

    if (tokenAddress) {
      // Fetch Jetton (token) balance
      const jettonWalletAddress = await client.runMethod(
        Address.parse(tokenAddress),
        'get_wallet_address',
        [{
          type: 'slice',
          cell: beginCell().storeAddress(Address.parse(walletAddress)).endCell()
        }]
      );

      const balance = await client.runMethod(
        jettonWalletAddress.stack.readAddress(),
        'get_wallet_data'
      );

      const tokenBalance = balance.stack.readBigNumber();
      return (Number(tokenBalance) / 1e3).toString(); // Assuming 3 decimals
    }

    // Fetch TON balance if no token address provided
    const balance = await client.getBalance(Address.parse(walletAddress));
    return (Number(balance) / 1e9).toString();
  } catch (error) {
    console.error('Error fetching balance:', error);
    throw error;
  }
}
