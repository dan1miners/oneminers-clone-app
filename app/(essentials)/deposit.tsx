import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
  Dimensions,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';

// --- Types ---

type CryptoAsset = {
  id: string;
  name: string;
  symbol: string;
  balance: string;
  network: string;
};

type TransactionItem = {
  id: string;
  assetId: string;
  amount: string;
  status: 'Completed' | 'Pending' | 'Failed';
  timestamp: string;
};

// --- Mock Data ---

const mockCryptoAssets: CryptoAsset[] = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', balance: '0.01234567', network: 'Bitcoin Network' },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', balance: '1.57890', network: 'ERC20 Network' },
  { id: 'usdt', name: 'Tether', symbol: 'USDT', balance: '500.00', network: 'TRC20 Network' },
];

const mockTransactions: TransactionItem[] = [
  { id: 'tx1', assetId: 'btc', amount: '0.005', status: 'Completed', timestamp: '2023-10-27 10:30 AM' },
  { id: 'tx2', assetId: 'eth', amount: '0.8', status: 'Completed', timestamp: '2023-10-26 09:15 PM' },
  { id: 'tx3', assetId: 'btc', amount: '0.021', status: 'Pending', timestamp: '2023-10-26 05:00 PM' },
  { id: 'tx4', assetId: 'usdt', amount: '150.00', status: 'Completed', timestamp: '2023-10-25 11:00 AM' },
  { id: 'tx5', assetId: 'eth', amount: '1.2', status: 'Failed', timestamp: '2023-10-24 04:45 PM' },
];

const depositAddresses: Record<string, string> = {
  btc: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
  eth: '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7',
  usdt: 'TRX9cQiVWtPAGaG8tKxYRnkGfQmXk3m3Jf',
};

const generateQRCode = (text: string) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;

// --- Component ---

export default function DepositPage() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState(mockCryptoAssets[0].id);
  const [qrCodeUrl, setQrCodeUrl] = useState('');

  const currentCryptoData = mockCryptoAssets.find(c => c.id === selectedCrypto);
  const currentAddress = depositAddresses[selectedCrypto];

  useEffect(() => {
    if (currentAddress) {
      setQrCodeUrl(generateQRCode(currentAddress));
    }
  }, [currentAddress]);

  const filteredTransactions = mockTransactions.filter(
    tx => tx.assetId === selectedCrypto
  );

  const handleCopyAddress = async () => {
    if (!currentAddress) return;
    await Clipboard.setStringAsync(currentAddress);
    setCopied(true);
    Alert.alert('Copied!', 'Deposit address copied to clipboard.');
    setTimeout(() => setCopied(false), 2000);
  };

  const renderTransactionItem = ({ item }: { item: TransactionItem }) => {
    const statusStyles =
      item.status === 'Completed'
        ? 'bg-green-100 text-green-700'
        : item.status === 'Pending'
        ? 'bg-yellow-100 text-orange-600'
        : 'bg-red-100 text-red-700';

    return (
      <View className="flex-row justify-between items-center bg-white p-4 rounded-xl mb-2">
        <View className="flex-1">
          <Text className="text-base font-semibold text-[#212529]">
            + {item.amount} {currentCryptoData?.symbol}
          </Text>
          <Text className="text-xs text-[#8E8E93] mt-1">
            {item.timestamp}
          </Text>
        </View>

        <View className={`px-3 py-1.5 rounded-full ${statusStyles.split(' ')[0]}`}>
          <Text className={`text-xs font-semibold ${statusStyles.split(' ')[1]}`}>
            {item.status}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FA]">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-[#E9ECEF]">
        <TouchableOpacity onPress={() => router.back()} className="p-1 mr-3">
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-black">Deposit</Text>
      </View>

      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {/* Crypto Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-5">
          {mockCryptoAssets.map(crypto => {
            const active = selectedCrypto === crypto.id;
            return (
              <TouchableOpacity
                key={crypto.id}
                onPress={() => setSelectedCrypto(crypto.id)}
                className={[
                  'px-4 py-2 mr-3 rounded-full',
                  active ? 'bg-[#FFC000]' : 'bg-[#E9ECEF]',
                ].join(' ')}
              >
                <Text
                  className={[
                    'text-sm font-semibold',
                    active ? 'text-white' : 'text-[#8E8E93]',
                  ].join(' ')}
                >
                  {crypto.symbol}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Deposit Card */}
        <View className="bg-white rounded-2xl p-5 mb-6 items-center">
          <View className="flex-row justify-between items-center w-full mb-3">
            <Text className="text-base font-semibold text-[#212529]">
              Deposit {currentCryptoData?.name}
            </Text>

            <TouchableOpacity
              onPress={handleCopyAddress}
              className="px-3 py-1.5 rounded-full bg-[#FFF8E6]"
            >
              <Ionicons
                name={copied ? 'checkmark-circle' : 'copy-outline'}
                size={20}
                color="#FFC000"
              />
            </TouchableOpacity>
          </View>

          {/* QR Code */}
          <View className="my-5 p-3 bg-white rounded-xl">
            {qrCodeUrl ? (
              <Image
                source={{ uri: qrCodeUrl }}
                className="w-[180px] h-[180px]"
                resizeMode="contain"
              />
            ) : (
              <View className="w-[180px] h-[180px] bg-gray-200 rounded-xl items-center justify-center">
                <Text>Loading QR Code...</Text>
              </View>
            )}
          </View>

          <Text className="text-xs text-[#8E8E93] text-center mb-4">
            {currentAddress}
          </Text>

          {/* Warning */}
          <View className="flex-row bg-[#FFF8E1] p-3 rounded-lg mb-5">
            <Ionicons name="warning-outline" size={16} color="#FF9500" />
            <Text className="text-xs text-[#8B6914] ml-2 flex-1">
              Only send {currentCryptoData?.symbol} to this address. Sending other coins may result in permanent loss.
            </Text>
          </View>

          {/* Stats */}
          <View className="flex-row w-full justify-between border-t border-[#E9ECEF] pt-4">
            <View className="items-center flex-1">
              <Text className="text-base font-bold text-[#212529]">
                {currentCryptoData?.balance}
              </Text>
              <Text className="text-xs text-[#8E8E93] mt-1">
                {currentCryptoData?.symbol} Balance
              </Text>
            </View>

            <View className="w-px bg-[#E9ECEF] mx-3" />

            <View className="items-center flex-1">
              <Text className="text-sm font-semibold text-[#212529] text-center">
                {currentCryptoData?.network}
              </Text>
              <Text className="text-xs text-[#8E8E93] mt-1">Network</Text>
            </View>
          </View>
        </View>

        {/* Transactions */}
        <Text className="text-base font-bold text-[#212529] mb-4">
          Recent Transactions
        </Text>

        <FlatList
          data={filteredTransactions}
          keyExtractor={item => item.id}
          renderItem={renderTransactionItem}
          scrollEnabled={false}
          ListEmptyComponent={
            <Text className="text-center text-[#8E8E93] mt-6">
              No transactions yet.
            </Text>
          }
        />
      </ScrollView>
    </SafeAreaView>
  );
}
