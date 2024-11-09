import { NextResponse } from 'next/server';
import { TonClient, Address } from 'ton';

const LIKES_CONTRACT_ADDRESS = process.env.LIKES_CONTRACT_ADDRESS;

export async function GET() {
  try {
    if (!LIKES_CONTRACT_ADDRESS) {
      throw new Error('LIKES_CONTRACT_ADDRESS is not set');
    }

    const client = new TonClient({
      endpoint: 'https://toncenter.com/api/v2/jsonRPC',
    });

    const contract = Address.parse(LIKES_CONTRACT_ADDRESS);
    
    const result = await client.runMethod(contract, 'getTotalLikes', []);
    const count = result.stack.readNumber();

    return NextResponse.json({ count });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to get likes count' }, { status: 500 });
  }
}