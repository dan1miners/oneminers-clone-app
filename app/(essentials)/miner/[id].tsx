import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// --- Mock Data & Types ---

type MinerStatus = 'running' | 'stopped' | 'restarting' | 'broken';

type Miner = {
  id: string;
  name: string;
  model: string;
  minerId: string;
  hashrate: string;
  hashrateUnit: string;
  status: MinerStatus;
  location: string;
  energyFee: string;
  dailyProfit: string;
  expectedPerformance: string;
  lastShare: string;
  image: string;
  uptime: string;
  temperature: string;
};

const MINERS_DATA: Miner[] = [
  {
    id: '1',
    name: 'Iceriver KS5M',
    model: 'KS5M - 15 TH/s',
    minerId: '#1017',
    hashrate: '15.00',
    hashrateUnit: 'TH/s',
    status: 'running',
    location: 'USA',
    energyFee: '0.065',
    dailyProfit: '0.12',
    expectedPerformance: '15.00 TH/s',
    lastShare: '1 hour ago',
    image: '⚡',
    uptime: '99.8%',
    temperature: '68°C',
  },
  // ... other miners
];

type IncomeEntry = {
  id: string;
  period: string;
  hashrate: string;
  income: string;
};

const mockIncomeHistory: IncomeEntry[] = [
  { id: 'h1', period: 'Last Hour', hashrate: '14.95 TH/s', income: '$0.005' },
  { id: 'h2', period: 'Last 24 Hours', hashrate: '15.02 TH/s', income: '$0.12' },
  { id: 'h3', period: 'Last 7 Days', hashrate: '14.99 TH/s', income: '$0.84' },
  { id: 'h4', period: 'Last 30 Days', hashrate: '15.05 TH/s', income: '$3.60' },
];

// --- Main Component ---

export default function MinerInfoScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const miner = MINERS_DATA.find((m) => m.id === id);

  const handleBackPress = () => {
    router.back();
  };

  const statusBadgeClass = (status: MinerStatus) => {
    switch (status) {
      case 'running':
        return 'bg-[#34C759]';
      case 'stopped':
        return 'bg-[#FF9500]';
      case 'restarting':
        return 'bg-[#FFC000]'; // changed from blue to yellow
      case 'broken':
        return 'bg-[#FF3B30]';
      default:
        return 'bg-[#34C759]';
    }
  };

  const renderIncomeItem = ({ item }: { item: IncomeEntry }) => (
    <View className="flex-row items-start mb-4 relative pl-5">
      <View className="absolute left-0 top-[6px] w-[10px] h-[10px] rounded-full bg-[#FFC000]" />
      <View className="flex-1">
        <Text className="text-base font-semibold text-black mb-1">
          {item.period}
        </Text>
        <Text className="text-sm text-[#6B7280]">
          {item.hashrate} • {item.income}
        </Text>
      </View>
    </View>
  );

  if (!miner) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'bottom', 'left', 'right']}>
        <View className="flex-row items-center justify-start px-4 py-3 border-b border-[#E5E7EB]">
          <TouchableOpacity onPress={handleBackPress} className="p-1">
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <View className="flex-1 items-center justify-center">
          <Text className="text-lg text-[#6B7280]">Miner not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FA]" edges={['top']}>
      {/* Header */}
      <View className="flex-row items-center justify-start px-4 py-3 border-b border-[#E5E7EB]">
        <TouchableOpacity onPress={handleBackPress} className="p-1">
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* 1. Product Image Section */}
        <View className="bg-white py-6 items-center border-b-4 border-[#FFC000]">
          <View className="w-[120px] h-[120px] rounded-full bg-[#F2F2F7] items-center justify-center">
            <Text className="text-[60px]">{miner.image}</Text>
          </View>
        </View>

        {/* 2. Miner Details Section */}
        <View className="bg-white p-5 mt-[2px]">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-2xl font-bold text-black">
              {miner.name}
            </Text>

            <View className={`px-3 py-1.5 rounded-full ${statusBadgeClass(miner.status)}`}>
              <Text className="text-white text-xs font-semibold">
                {miner.status.toUpperCase()}
              </Text>
            </View>
          </View>

          <Text className="text-base text-[#6B7280] mb-5">
            {miner.model}
          </Text>

          <View className="flex-row flex-wrap justify-between">
            <View className="w-[48%] mb-4">
              <Text className="text-sm text-[#6B7280] mb-1">Hashrate</Text>
              <Text className="text-base font-bold text-black">
                {miner.hashrate} {miner.hashrateUnit}
              </Text>
            </View>

            <View className="w-[48%] mb-4">
              <Text className="text-sm text-[#6B7280] mb-1">Daily Profit</Text>
              <Text className={`text-base font-bold ${miner.dailyProfit === '0.00' ? 'text-[#6B7280]' : 'text-black'}`}>
                ${miner.dailyProfit}
              </Text>
            </View>

            <View className="w-[48%] mb-4">
              <Text className="text-sm text-[#6B7280] mb-1">Uptime</Text>
              <Text className="text-base font-bold text-black">
                {miner.uptime}
              </Text>
            </View>

            <View className="w-[48%] mb-4">
              <Text className="text-sm text-[#6B7280] mb-1">Temperature</Text>
              <Text className="text-base font-bold text-black">
                {miner.temperature}
              </Text>
            </View>

            <View className="w-[48%] mb-4">
              <Text className="text-sm text-[#6B7280] mb-1">Location</Text>
              <Text className="text-base font-bold text-black">
                {miner.location}
              </Text>
            </View>

            <View className="w-[48%] mb-4">
              <Text className="text-sm text-[#6B7280] mb-1">Energy Fee</Text>
              <Text className="text-base font-bold text-black">
                {miner.energyFee} USD/kWh
              </Text>
            </View>
          </View>
        </View>

        {/* 3. Income History Section */}
        <View className="bg-white p-5 mt-4 rounded-2xl mx-4 mb-6">
          <Text className="text-xl font-bold text-black mb-4">
            Mining Income History
          </Text>

          <FlatList
            data={mockIncomeHistory}
            keyExtractor={(item) => item.id}
            renderItem={renderIncomeItem}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
