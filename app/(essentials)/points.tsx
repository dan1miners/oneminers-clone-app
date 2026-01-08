import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Link } from 'expo-router';

export default function PointsScreen() {
  const totalCoins = 120;

  const recent = [
    { id: '1', title: 'Daily check-in', date: 'Today', points: 1 },
    { id: '2', title: 'Daily check-in', date: 'Yesterday', points: 1 },
    { id: '3', title: 'Referral bonus', date: '2 days ago', points: 10 },
  ];

  // ✅ Redemption examples (mock)
  const redeemItems = [
    {
      id: 'r1',
      title: '$5 credit (paid in BTC)',
      pointsRequired: 1000,
      subtitle: 'Exchange 1000 points for $5 worth of BTC (rate at time of redemption).',
      icon: 'logo-bitcoin',
    },
    {
      id: 'r2',
      title: '$10 credit (paid in BTC)',
      pointsRequired: 2000,
      subtitle: 'Exchange 2000 points for $10 worth of BTC (rate at time of redemption).',
      icon: 'gift-outline',
    },
    {
      id: 'r3',
      title: '$25 credit (paid in BTC)',
      pointsRequired: 5000,
      subtitle: 'Exchange 5000 points for $25 worth of BTC (rate at time of redemption).',
      icon: 'wallet-outline',
    },
  ];

  const canRedeem = (needed: number) => totalCoins >= needed;

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-gray-200">
        <Link href="/dashboard" asChild>
          <TouchableOpacity className="p-1 mr-3">
            <Ionicons name="arrow-back" size={22} color="#000" />
          </TouchableOpacity>
        </Link>

        <View className="flex-row items-baseline">
          <Text className="text-xl font-extrabold text-[#FFC000]">one</Text>
          <Text className="text-xl font-extrabold text-black">miners</Text>
        </View>
      </View>

      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {/* Summary */}
        <View className="bg-white rounded-2xl p-5 border border-gray-100">
          <Text className="text-lg font-bold text-black">Points & Coins</Text>
          <Text className="text-sm text-gray-500 mt-1">
            Earn points daily and exchange them for rewards.
          </Text>

          <View className="mt-4 bg-gray-50 rounded-2xl p-4 border border-gray-100">
            <Text className="text-sm text-gray-600">Total points</Text>
            <Text className="text-2xl font-extrabold text-black mt-1">{totalCoins}</Text>
            <Text className="text-xs text-gray-400 mt-2">
              Redemptions are paid in BTC based on the current rate at the time of redemption.
            </Text>
          </View>
        </View>

        {/* ✅ Redeem section */}
        <View className="bg-white rounded-2xl p-5 border border-gray-100 mt-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-base font-bold text-black">Redeem rewards</Text>
            <View className="bg-[#FFC000]/15 px-3 py-1 rounded-full">
              <Text className="text-[11px] font-semibold text-black">Paid in BTC</Text>
            </View>
          </View>

          {redeemItems.map((item) => {
            const eligible = canRedeem(item.pointsRequired);

            return (
              <View
                key={item.id}
                className="border border-gray-100 rounded-2xl p-4 mb-3 bg-white"
              >
                <View className="flex-row items-center">
                  <View className="w-10 h-10 rounded-xl bg-[#FFC000]/15 items-center justify-center mr-3">
                    <Ionicons name={item.icon as any} size={18} color="#000" />
                  </View>

                  <View className="flex-1">
                    <Text className="text-sm font-semibold text-black">{item.title}</Text>
                    <Text className="text-xs text-gray-400 mt-0.5">
                      {item.pointsRequired} points required
                    </Text>
                  </View>

                  <View
                    className={`px-2 py-1 rounded-full ${
                      eligible ? 'bg-[#FFC000]/20' : 'bg-gray-100'
                    }`}
                  >
                    <Text className={`text-[10px] font-semibold ${eligible ? 'text-black' : 'text-gray-400'}`}>
                      {eligible ? 'Available' : 'Not enough'}
                    </Text>
                  </View>
                </View>

                <Text className="text-xs text-gray-500 mt-3 leading-5">
                  {item.subtitle}
                </Text>

                <TouchableOpacity
                  disabled={!eligible}
                  className={`mt-4 rounded-xl py-3 items-center ${
                    eligible ? 'bg-[#FFC000]' : 'bg-gray-100'
                  }`}
                  activeOpacity={0.9}
                  onPress={() => {
                    // TODO: connect this to your redemption API
                    // For now, just a placeholder action
                  }}
                >
                  <Text className={`text-sm font-bold ${eligible ? 'text-black' : 'text-gray-400'}`}>
                    Redeem
                  </Text>
                </TouchableOpacity>
              </View>
            );
          })}

          <Text className="text-[11px] text-gray-400 mt-2 leading-4">
            Note: Rewards, conversion rates, and availability may change. BTC value is calculated at redemption time.
          </Text>
        </View>

        {/* How it works */}
        <View className="bg-white rounded-2xl p-5 border border-gray-100 mt-4">
          <Text className="text-base font-bold text-black mb-3">How it works</Text>

          <View className="flex-row mb-3">
            <View className="w-8 h-8 rounded-lg bg-[#FFC000]/20 items-center justify-center mr-3">
              <Ionicons name="calendar-outline" size={16} color="#000" />
            </View>
            <Text className="text-sm text-gray-600 leading-5 flex-1">
              Check in once per day to earn points. A 7-day streak gives consistent rewards.
            </Text>
          </View>

          <View className="flex-row mb-3">
            <View className="w-8 h-8 rounded-lg bg-[#FFC000]/20 items-center justify-center mr-3">
              <Ionicons name="gift-outline" size={16} color="#000" />
            </View>
            <Text className="text-sm text-gray-600 leading-5 flex-1">
              Points can be redeemed for rewards such as BTC credits.
            </Text>
          </View>

          <View className="flex-row">
            <View className="w-8 h-8 rounded-lg bg-[#FFC000]/20 items-center justify-center mr-3">
              <Ionicons name="help-circle-outline" size={16} color="#000" />
            </View>
            <Text className="text-sm text-gray-600 leading-5 flex-1">
              Rewards and values may change based on promotions and account status.
            </Text>
          </View>
        </View>

        {/* Recent activity */}
        <View className="bg-white rounded-2xl p-5 border border-gray-100 mt-4 mb-8">
          <Text className="text-base font-bold text-black mb-3">Recent activity</Text>

          {recent.map((item) => (
            <View key={item.id} className="flex-row items-center py-3 border-b border-gray-100">
              <View className="w-9 h-9 rounded-xl bg-gray-50 items-center justify-center mr-3">
                <Ionicons name="sparkles-outline" size={16} color="#FFC000" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-semibold text-black">{item.title}</Text>
                <Text className="text-xs text-gray-400 mt-0.5">{item.date}</Text>
              </View>
              <Text className="text-sm font-bold text-black">+{item.points}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
