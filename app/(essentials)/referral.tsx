import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

// --- Mock Data & Types ---

type ReferralItem = {
  id: string;
  name: string;
  email: string;
  pointsEarned: string;
  avatar: string;
};

const mockReferrals: ReferralItem[] = [
  { id: '1', name: 'John Doe', email: 'john.doe@example.com', pointsEarned: '150', avatar: '👨‍💻' },
  { id: '2', name: 'Jane Smith', email: 'jane.smith@example.com', pointsEarned: '75', avatar: '👩‍🎨' },
  { id: '3', name: 'Peter Jones', email: 'peter.jones@example.com', pointsEarned: '200', avatar: '👨‍🚀' },
  { id: '4', name: 'Mary Johnson', email: 'mary.j@example.com', pointsEarned: '50', avatar: '👩‍🔬' },
  { id: '5', name: 'David Williams', email: 'd.williams@example.com', pointsEarned: '300', avatar: '👨‍🏫' },
];

export default function ReferralPage() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);

  const userReferralCode = 'GOLDMINER2024';
  const totalReferrals = mockReferrals.length;
  const totalEarnings = '$42.50';

  const handleCopyCode = async () => {
    await Clipboard.setStringAsync(userReferralCode);
    setCopied(true);
    Alert.alert('Copied!', 'Referral code copied to clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  const renderReferralItem = ({ item }: { item: ReferralItem }) => (
    <View className="flex-row items-center bg-white p-4 rounded-xl mb-1.5">
      <View className="w-[50px] h-[50px] rounded-full bg-[#F2F2F7] items-center justify-center mr-3">
        <Text className="text-2xl">{item.avatar}</Text>
      </View>

      <View className="flex-1">
        <Text className="text-base font-semibold text-[#212529]">
          {item.name}
        </Text>
        <Text className="text-xs text-[#8E8E93] mt-0.5">
          {item.email}
        </Text>
      </View>

      <View className="bg-[#E8F5E9] px-2.5 py-1.5 rounded-xl">
        <Text className="text-xs font-semibold text-[#2E7D32]">
          {item.pointsEarned} pts
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FA]">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-[#E9ECEF]">
        <TouchableOpacity onPress={() => router.back()} className="p-1 mr-3">
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-black">
          Referral Program
        </Text>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {/* Referral Highlight Card */}
        <View className="bg-white rounded-2xl p-5 mb-6 items-center">
          <View className="flex-row justify-between items-center w-full mb-3">
            <Text className="text-base font-semibold text-[#212529]">
              Your Referral Code
            </Text>

            <TouchableOpacity
              onPress={handleCopyCode}
              className="flex-row items-center bg-[#FFF8E1] px-3 py-1.5 rounded-full"
            >
              <Ionicons
                name={copied ? 'checkmark-circle' : 'copy-outline'}
                size={20}
                color="#FFC000"
              />
            </TouchableOpacity>
          </View>

          <Text className="text-2xl font-bold text-[#FFC000] tracking-[1.5px] mb-5">
            {userReferralCode}
          </Text>

          <View className="flex-row w-full justify-around">
            <View className="items-center">
              <Text className="text-xl font-bold text-[#212529]">
                {totalReferrals}
              </Text>
              <Text className="text-xs text-[#8E8E93] mt-1">
                Total Referrals
              </Text>
            </View>

            <View className="w-px h-10 bg-[#E9ECEF]" />

            <View className="items-center">
              <Text className="text-xl font-bold text-[#212529]">
                {totalEarnings}
              </Text>
              <Text className="text-xs text-[#8E8E93] mt-1">
                Total Earnings
              </Text>
            </View>
          </View>
        </View>

        {/* Referrals List */}
        <Text className="text-base font-bold text-[#212529] mb-4">
          History
        </Text>

        <View className="mb-8">
          <FlatList
            data={mockReferrals}
            keyExtractor={(item) => item.id}
            renderItem={renderReferralItem}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
