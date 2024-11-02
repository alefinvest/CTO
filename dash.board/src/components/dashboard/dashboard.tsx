import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Globe, Plus, Heart } from "lucide-react";
import { useTonWallet, TonConnectButton, useTonConnectUI } from '@tonconnect/ui-react';
import { getTokenBalance } from '@/lib/tonUtils';

import './styles.css';

type DashboardData = {
  totalIdeas: number;
  avgImplementationRate: number;
  globalReach: number;
  topIdeas: { id: number; name: string; completionRate: number }[];
};

const BEST_TOKEN_ADDRESS = 'EQAYBBxTvEGY4CZ2Rvut6NV-7HUxewCR6G8AViuVSnDtnBfZ';

export function DashboardComponent() {
  const t = useTranslations('dashboard');
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [bestTokenBalance, setBestTokenBalance] = useState<string | null>(null);
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();

  useEffect(() => {
    fetchDashboardData().then((data: any) => {
      setDashboardData(data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (wallet && wallet.account.address) {
      fetchBestTokenBalance(wallet.account.address);
    }
  }, [wallet]);

  const fetchBestTokenBalance = async (address: string) => {
    try {
      const balance = await getTokenBalance(address, BEST_TOKEN_ADDRESS);
      setBestTokenBalance(balance);
    } catch (error) {
      console.error('Error fetching BEST token balance:', error);
      setBestTokenBalance('Error');
    }
  };

  const handleDisconnect = async () => {
    try {
      await tonConnectUI.disconnect();
      setBestTokenBalance(null);
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">{t('loading')}</div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground p-8">
      <div className="flex flex-col gap-4 mb-8">
        <h1 className="text-3xl font-bold">{t('ctoDashboard')}</h1>
        {wallet ? (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
              </Avatar>
              <span className="text-sm">{`${wallet.account.address?.substring(0, 4)}...${wallet.account.address?.substring(wallet.account.address.length - 4)}`}</span>
            </div>
            <Button onClick={handleDisconnect} variant="outline" className="w-full">Disconnect</Button>
          </div>
        ) : (
          <TonConnectButton />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('totalIdeas')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.totalIdeas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('avgImplementationRate')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.avgImplementationRate}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('globalReach')}</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <Globe className="h-24 w-24 text-muted-foreground" />
            <span className="absolute text-2xl font-bold">{dashboardData?.globalReach}</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('bestTokenBalance')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {bestTokenBalance !== null
                ? bestTokenBalance === 'Error'
                  ? t('errorFetchingBalance')
                  : `${bestTokenBalance} BEST`
                : t('fetching')}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{t('topIdeasPerformance')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {dashboardData?.topIdeas.map((idea) => (
              <div key={idea.id} className="flex items-center">
                <div className="w-40 font-medium">{idea.name}</div>
                <div className="w-full">
                  <Progress value={idea.completionRate} className="h-2" />
                </div>
                <div className="w-20 text-right">{idea.completionRate}%</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="fixed bottom-8 right-8 space-y-4">
        <Button size="icon" className="rounded-full">
          <Plus className="h-6 w-6" />
        </Button>
        <Button size="icon" variant="outline" className="rounded-full">
          <Heart className="h-6 w-6" />
          <span className="sr-only">Likes</span>
        </Button>
      </div>
    </div>
  );
}

// Mock function to simulate fetching dashboard data
const fetchDashboardData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalIdeas: 83,
        avgImplementationRate: 94,
        globalReach: 42,
        topIdeas: [
          { id: 1, name: "Idea 1", completionRate: 75 },
          { id: 2, name: "Idea 2", completionRate: 50 },
          { id: 3, name: "Idea 3", completionRate: 25 },
        ]
      });
    }, 1000);
  });
}