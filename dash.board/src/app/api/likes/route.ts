import { NextRequest, NextResponse } from 'next/server';
import { TonClient, Address, beginCell } from 'ton';
// import { useTonConnectUI } from '@tonconnect/ui-react';

const LIKES_CONTRACT_ADDRESS = process.env.LIKES_CONTRACT_ADDRESS;

export async function POST(req: NextRequest) {
  try {
    const { address } = await req.json();
    
    if (!LIKES_CONTRACT_ADDRESS) {
      throw new Error('LIKES_CONTRACT_ADDRESS не встановлено');
    }

    const client = new TonClient({
      endpoint: 'https://toncenter.com/api/v2/jsonRPC',
    });

    const contract = Address.parse(LIKES_CONTRACT_ADDRESS);
    
    // Перевіряємо, чи користувач вже лайкнув
    const userAddressCell = beginCell().storeAddress(Address.parse(address)).endCell();
    const hasLiked = await client.runMethod(contract, 'hasLiked', [{ type: 'slice', cell: userAddressCell }]);

    if (hasLiked.stack.readNumber() === 1) {
      return NextResponse.json({ error: 'Ви вже лайкнули' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Не вдалося обробити лайк' }, { status: 500 });
  }
} 