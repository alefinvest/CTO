"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Globe, Plus, Heart } from "lucide-react"
import { useTonWallet, TonConnectButton } from '@tonconnect/ui-react'
import { getTokenBalance } from '@/lib/tonUtils' // Import the utility function

// Define the type for the dashboard data
type DashboardData = {
  totalIdeas: number;
  avgImplementationRate: number;
  globalReach: number;
  topIdeas: { id: number; name: string; completionRate: number }[];
};

export function DashboardComponent() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)
  const [tokenBalance, setTokenBalance] = useState<string | null>(null)
  const wallet = useTonWallet()

  useEffect(() => {
    fetchDashboardData().then((data: any) => {
      setDashboardData(data)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (wallet && wallet.account.address) {
      fetchTokenBalance(wallet.account.address)
    }
  }, [wallet])

  const fetchTokenBalance = async (address: string) => {
    try {
      const balance = await getTokenBalance(address)
      setTokenBalance(balance)
    } catch (error) {
      console.error('Error fetching token balance:', error)
      setTokenBalance('Error')
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dash Board Dashboard</h1>
        {wallet ? (
          <div className="flex items-center space-x-2">
            <Avatar>
              <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <span className="text-sm">{wallet.account.address}</span>
          </div>
        ) : (
          <TonConnectButton />
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Ideas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.totalIdeas}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Implementation Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dashboardData?.avgImplementationRate}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Global Reach</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center justify-center">
            <Globe className="h-24 w-24 text-muted-foreground" />
            <span className="absolute text-2xl font-bold">{dashboardData?.globalReach}</span>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">TON Token Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {tokenBalance !== null
                ? tokenBalance === 'Error'
                  ? 'Error fetching balance'
                  : `${tokenBalance} TON`
                : 'Fetching...'}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Top Ideas Performance</CardTitle>
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
  )
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
      })
    }, 1000)
  })
}