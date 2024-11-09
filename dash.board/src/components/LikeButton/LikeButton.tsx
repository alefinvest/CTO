'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useTonWallet, useTonConnectUI } from '@tonconnect/ui-react';
import useSWR from 'swr';

export function LikeButton() {
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();
  const [isLiking, setIsLiking] = useState(false);
  
  const { data: likesCount, mutate } = useSWR('/api/likes/count', async () => {
    const response = await fetch('/api/likes/count');
    const data = await response.json();
    return data.count;
  });

  const handleLike = async () => {
    if (!wallet) {
      await tonConnectUI.connectWallet();
      return;
    }

    try {
      setIsLiking(true);
      
      // Виклик функції `like` смарт-контракту через TonConnect
      const contractAddress = process.env.NEXT_PUBLIC_LIKES_CONTRACT_ADDRESS;
      if (!contractAddress) {
        throw new Error('LIKES_CONTRACT_ADDRESS не встановлено в середовищі');
      }

      const contract = wallet.addressToAddress(contractAddress);

      // Створення повідомлення для виклику функції `like`
      const msgValue = '0.01'; // Залежно від необхідної суми для транзакції
      const opCode = 'like'; // Відповідно до смарт-контракту
      const body = `${opCode}c`; // Конвертація рядка у байтове представлення, якщо необхідно

      await wallet.sendTransaction({
        to: contract,
        value: msgValue,
        body: body,
      });

      // Після успішної транзакції оновлюємо кількість лайків
      await mutate();
    } catch (error) {
      console.error('Error liking:', error);
    } finally {
      setIsLiking(false);
    }
  };

  return (
    <Button 
      size="icon" 
      variant="outline" 
      className="rounded-full"
      onClick={handleLike}
      disabled={isLiking}
    >
      <Heart className="h-6 w-6" />
      {likesCount && <span className="ml-2">{likesCount}</span>}
    </Button>
  );
}