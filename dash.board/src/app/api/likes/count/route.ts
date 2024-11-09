import { NextResponse } from 'next/server';
import { TonClient, Address } from 'ton';

const LIKES_CONTRACT_ADDRESS = process.env.LIKES_CONTRACT_ADDRESS;

export async function GET() {
  try {
    const client = new TonClient({
      endpoint: 'https://toncenter.com/api/v2/jsonRPC',
    });

    const contract = new Address(LIKES_CONTRACT_ADDRESS, true);
    
    const result = await client.runMethod(contract, 'getTotalLikes', []);
    const count = result.stack.readNumber();

    return NextResponse.json({ count });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to get likes count' }, { status: 500 });
  }
}