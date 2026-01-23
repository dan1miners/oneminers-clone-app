import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

const COLORS = {
  accent: '#FFC000',
  text: '#000000',
  muted: '#8E8E93',
  border: '#E5E7EB',
  success: '#34C759',
  danger: '#FF3B30',
};

export default function WalletScreen() {
  const [isBalanceHidden, setIsBalanceHidden] = useState(false);

  const assets = [
    { name: 'Bitcoin', ticker: 'BTC', holdings: '0.362113 BTC', estimated: '$31,694.80', change: '+2.3%', icon: '🟠' },
    { name: 'Aleo', ticker: 'ALEO', holdings: '1,250.50 ALEO', estimated: '$2,845.25', change: '+5.7%', icon: '🔵' },
    { name: 'Kaspa', ticker: 'KAS', holdings: '320,931.17 KAS', estimated: '$15,913.54', change: '+1.2%', icon: '🟢' },
    { name: 'Ethereum', ticker: 'ETH', holdings: '2.45 ETH', estimated: '$8,245.60', change: '-0.8%', icon: '🟣' },
    { name: 'Solana', ticker: 'SOL', holdings: '15.75 SOL', estimated: '$2,835.00', change: '+3.1%', icon: '🟡' },
    { name: 'USDT', ticker: 'USDT', holdings: '5,250.00 USDT', estimated: '$5,250.00', change: '0.0%', icon: '💎' },
  ];

  const totalBalance = '$50,770.46';
  const unpaidBalance = '$13.66';
  const dayChange = '+2.1%';
  const dayChangeValue = '+$1,045.22';

  const toggleHidden = () => setIsBalanceHidden((v) => !v);

  const changeColor = (v: string) =>
    v.startsWith('+') ? COLORS.success : v.startsWith('-') ? COLORS.danger : COLORS.muted;

  const actions = useMemo(
    () => [
      { label: 'Deposit', icon: 'arrow-down' as const, href: 'deposit' },
      { label: 'Withdraw', icon: 'arrow-up' as const, href: 'withdraw' },
      { label: 'Exchange', icon: 'swap-horizontal' as const, href: 'exchange' },
      { label: 'History', icon: 'list' as const, href: 'transactions' },
    ],
    []
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'bottom', 'left', 'right']}>
      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        {/* Header row */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-2xl font-bold text-black">Wallet</Text>

          <TouchableOpacity
            activeOpacity={0.85}
            onPress={toggleHidden}
            className="flex-row items-center bg-white px-3 py-2 rounded-full border border-gray-100"
          >
            <Ionicons
              name={isBalanceHidden ? 'eye-off-outline' : 'eye-outline'}
              size={18}
              color={COLORS.text}
            />
            <Text className="ml-2 text-xs font-semibold text-black">
              {isBalanceHidden ? 'Show' : 'Hide'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Balance Card (standard wallet look) */}
        <View
          className="rounded-3xl p-6 mb-5 border border-gray-100"
          style={{ backgroundColor: '#FFF6D6' }} // soft gold, not harsh
        >
          <Text className="text-xs font-semibold text-black/60">Total Balance</Text>

          <Text className="text-[34px] font-extrabold text-black mt-1">
            {isBalanceHidden ? '•••••' : totalBalance}
          </Text>

          {/* 24h change */}
          <View className="flex-row items-center mt-2">
            <View
              className="px-2.5 py-1 rounded-full"
              style={{ backgroundColor: `${changeColor(dayChange)}1A` }}
            >
              <Text className="text-xs font-bold" style={{ color: changeColor(dayChange) }}>
                {dayChange}
              </Text>
            </View>

            <Text className="text-xs font-semibold ml-2" style={{ color: changeColor(dayChange) }}>
              {isBalanceHidden ? '•••••' : dayChangeValue}
            </Text>
          </View>

          {/* Divider */}
          <View className="h-[1px] bg-black/10 my-4" />

          {/* Unpaid row */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Ionicons name="alert-circle-outline" size={16} color="#111827" />
              <Text className="text-xs font-semibold text-black/70 ml-2">Unpaid Balance</Text>
            </View>

            <Text className="text-sm font-bold text-black">
              {isBalanceHidden ? '•••••' : unpaidBalance}
            </Text>
          </View>

          {/* Subtle progress bar */}
          <View className="h-2 bg-black/10 rounded-full overflow-hidden mt-3">
            <View className="h-full w-[30%] bg-black/70 rounded-full" />
          </View>
        </View>

        {/* Action row (pill buttons - standard wallet) */}
        <View className="flex-row mb-6">
          {actions.map((a) => (
            <View key={a.label} className="flex-1 mx-1">
              <Link href={a.href as any} asChild>
                <TouchableOpacity
                  activeOpacity={0.9}
                  className="bg-white rounded-2xl py-4 items-center border border-gray-100"
                >
                  <View
                    className="w-10 h-10 rounded-full items-center justify-center mb-2"
                    style={{ backgroundColor: `${COLORS.accent}1A` }}
                  >
                    <Ionicons name={a.icon} size={18} color={COLORS.text} />
                  </View>
                  <Text className="text-[11px] font-bold text-black">{a.label}</Text>
                </TouchableOpacity>
              </Link>
            </View>
          ))}
        </View>

        {/* Assets */}
        <View className="mb-10">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-lg font-bold text-black">Assets</Text>
            <TouchableOpacity activeOpacity={0.85} className="flex-row items-center">
              <Text className="text-xs font-semibold" style={{ color: COLORS.muted }}>
                View all
              </Text>
              <Ionicons name="chevron-forward" size={14} color={COLORS.muted} />
            </TouchableOpacity>
          </View>

          <View className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            {assets.map((asset, index) => (
              <TouchableOpacity
                key={asset.ticker}
                activeOpacity={0.85}
                className={[
                  'flex-row items-center justify-between px-4 py-4',
                  index < assets.length - 1 ? 'border-b border-gray-100' : '',
                ].join(' ')}
              >
                {/* Left */}
                <View className="flex-row items-center flex-1">
                  <View className="w-11 h-11 rounded-full bg-gray-100 items-center justify-center mr-3">
                    <Text className="text-xl">{asset.icon}</Text>
                  </View>

                  <View className="flex-1">
                    <View className="flex-row items-center">
                      <Text className="text-base font-bold text-black">{asset.name}</Text>
                      <View className="ml-2 px-2 py-0.5 rounded-full bg-gray-100">
                        <Text className="text-[10px] font-bold text-gray-600">{asset.ticker}</Text>
                      </View>
                    </View>

                    <Text className="text-xs text-gray-400 mt-1">
                      {isBalanceHidden ? '•••••' : asset.holdings}
                    </Text>
                  </View>
                </View>

                {/* Right */}
                <View className="items-end">
                  <Text className="text-base font-extrabold text-black">
                    {isBalanceHidden ? '•••••' : asset.estimated}
                  </Text>
                  <Text
                    className="text-xs font-bold mt-1"
                    style={{ color: changeColor(asset.change) }}
                  >
                    {asset.change}
                  </Text>
                </View>

                <Ionicons name="chevron-forward" size={16} color="#D1D5DB" style={{ marginLeft: 10 }} />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
