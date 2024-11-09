import { NextRequest, NextResponse } from 'next/server';
import { TonClient, Address } from 'ton';
import { useTonConnect } from '@tonconnect/ui-react';

const LIKES_CONTRACT_ADDRESS = process.env.LIKES_CONTRACT_ADDRESS;

export async function POST(req: NextRequest) {
  try {
    const { address } = await req.json();
    
    const client = new TonClient({
      endpoint: 'https://toncenter.com/api/v2/jsonRPC',
    });

    const contract = new Address(LIKES_CONTRACT_ADDRESS, true);
    
    // Перевіряємо чи користувач вже лайкнув
    const hasLiked = await client.runMethod(contract, 'hasLiked', [{
      type: 'slice',
      value: address
    }]);

    if (hasLiked.stack.readNumber() === 1) {
      return NextResponse.json({ error: 'Already liked' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to process like' }, { status: 500 });
  }
} 