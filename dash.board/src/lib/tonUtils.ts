import TonWeb from 'tonweb'

// Initialize TonWeb with a public endpoint
const tonweb = new TonWeb(new TonWeb.HttpProvider('https://toncenter.com/api/v2/jsonRPC'))

/**
 * Fetches the token balance for a given TON address.
 * @param address - The TON wallet address.
 * @returns The balance in TON.
 */
export async function getTokenBalance(address: string): Promise<string> {
  const addressObj = tonweb.address(address)
  const balance = await tonweb.getBalance(addressObj)
  // Convert from nanotons to tons
  const balanceInTons = TonWeb.utils.fromNano(balance)
  return balanceInTons.toString()
}