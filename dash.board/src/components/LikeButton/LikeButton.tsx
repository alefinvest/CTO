import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useTonWallet, useTonConnectUI } from '@tonconnect/ui-react';
import { Address } from 'ton-core';
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
      
      const response = await fetch('/api/likes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          address: wallet.account.address,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to like');
      }

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