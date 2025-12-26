import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

export default function WalletScreen() {
  // 2. Add state for hiding balance
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);

  const assets = [
    {
      name: 'Bitcoin',
      ticker: 'BTC',
      holdings: '0.362113 BTC',
      estimated: '$31,694.80',
      change: '+2.3%',
      icon: '🟠'
    },
    {
      name: 'Aleo',
      ticker: 'ALEO',
      holdings: '1,250.50 ALEO',
      estimated: '$2,845.25',
      change: '+5.7%',
      icon: '🔵'
    },
    {
      name: 'Kaspa',
      ticker: 'KAS',
      holdings: '320,931.17 KAS',
      estimated: '$15,913.54',
      change: '+1.2%',
      icon: '🟢'
    },
    {
      name: 'Ethereum',
      ticker: 'ETH',
      holdings: '2.45 ETH',
      estimated: '$8,245.60',
      change: '-0.8%',
      icon: '🟣'
    },
    {
      name: 'Solana',
      ticker: 'SOL',
      holdings: '15.75 SOL',
      estimated: '$2,835.00',
      change: '+3.1%',
      icon: '🟡'
    },
    {
      name: 'USDT',
      ticker: 'USDT',
      holdings: '5,250.00 USDT',
      estimated: '$5,250.00',
      change: '0.0%',
      icon: '💎'
    }
  ];

  // 3. Create a function to toggle the balance visibility
  const handleToggleBalance = () => {
    setIsBalanceHidden(!isBalanceHidden);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {/* Gold Balance Card */}
        <View className="bg-[#FFD700] rounded-[20px] p-6 mb-8 shadow-lg">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-base text-black opacity-70 font-semibold">Total Balance</Text>
            <TouchableOpacity onPress={handleToggleBalance}>
              <Ionicons 
                name={isBalanceHidden ? 'eye-off-outline' : 'eye-outline'} 
                size={20} 
                color="#000" 
              />
            </TouchableOpacity>
          </View>
          <Text className="text-[36px] font-bold text-black mb-5">
            {isBalanceHidden ? '*****' : '$50,770.46'}
          </Text>
          
          <View className="bg-white/30 rounded-xl p-4">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-sm text-black opacity-80">Unpaid Balance</Text>
              <Text className="text-lg font-bold text-black">
                {isBalanceHidden ? '*****' : '$13.66'}
              </Text>
            </View>
            <View className="h-1.5 bg-white/50 rounded-sm overflow-hidden">
              <View className="h-full w-[30%] bg-black rounded-sm" />
            </View>
          </View>
        </View>

        {/* Circular Action Buttons */}
        <View className="flex-row justify-between mb-8 px-2">
          <View className="items-center flex-1">
            <Link href="deposit" asChild>
              <TouchableOpacity className="items-center w-[72px]">
                <View className="w-14 h-14 rounded-full bg-white items-center justify-center mb-2 shadow-sm">
                  <Ionicons name="arrow-down" size={20} color="#000" />
                </View>
                <Text className="text-[10px] font-semibold text-black text-center mt-1">Deposit</Text>
              </TouchableOpacity>
            </Link>
          </View>
          
          <View className="items-center flex-1">
            <Link href="withdraw" asChild>
              <TouchableOpacity className="items-center w-[72px]">
                <View className="w-14 h-14 rounded-full bg-white items-center justify-center mb-2 shadow-sm">
                  <Ionicons name="arrow-up" size={20} color="#000" />
                </View>
                <Text className="text-[10px] font-semibold text-black text-center mt-1">Withdraw</Text>
              </TouchableOpacity>
            </Link>
          </View>
          
          <View className="items-center flex-1">
            <Link href="exchange" asChild>
              <TouchableOpacity className="items-center w-[72px]">
                <View className="w-14 h-14 rounded-full bg-white items-center justify-center mb-2 shadow-sm">
                  <Ionicons name="swap-horizontal" size={20} color="#000" />
                </View>
                <Text className="text-[10px] font-semibold text-black text-center mt-1">Exchange</Text>
              </TouchableOpacity>
            </Link>
          </View>
          
          <View className="items-center flex-1">
            <Link href="transactions" asChild>
              <TouchableOpacity className="items-center w-[72px]">
                <View className="w-14 h-14 rounded-full bg-white items-center justify-center mb-2 shadow-sm">
                  <Ionicons name="list" size={20} color="#000" />
                </View>
                <Text className="text-[10px] font-semibold text-black text-center mt-1">Transactions</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Assets Section */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-black mb-4">Assets</Text>
          
          <View className="bg-white rounded-2xl">
            {assets.map((asset, index) => (
              <View 
                key={asset.ticker} 
                className={`flex-row justify-between items-center py-4 px-4 ${index < assets.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                <View className="flex-row items-center flex-1">
                  <View className="w-11 h-11 rounded-full bg-gray-100 items-center justify-center mr-3">
                    <Text className="text-xl">{asset.icon}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-black">{asset.name}</Text>
                    <Text className="text-sm text-gray-400 mt-0.5">
                      {isBalanceHidden ? '*****' : asset.holdings}
                    </Text>
                  </View>
                </View>
                
                <View className="items-end">
                  <Text className="text-base font-bold text-black">
                    {isBalanceHidden ? '*****' : asset.estimated}
                  </Text>
                  <Text 
                    className="text-xs font-semibold mt-0.5"
                    style={{ color: asset.change.startsWith('+') ? '#34C759' : asset.change.startsWith('-') ? '#FF3B30' : '#8E8E93' }}
                  >
                    {asset.change}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
