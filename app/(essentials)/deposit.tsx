import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Modal,
  Image,
  TextInput,
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

  { id: 'doge', name: 'Dogecoin', symbol: 'DOGE', balance: '8250.00', network: 'Dogecoin Network' },
  { id: 'kas', name: 'Kaspa', symbol: 'KAS', balance: '1250.00', network: 'Kaspa Network' },
  { id: 'aleo', name: 'Aleo', symbol: 'ALEO', balance: '88.25', network: 'Aleo Network' },
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

  doge: 'D9f1ZpExampleDogeAddressxxxxxxxxxxxxxx',
  kas: 'kaspa:qpExampleKasAddressxxxxxxxxxxxxxx',
  aleo: 'aleo1examplealeoaddressxxxxxxxxxxxxxxx',
};

const generateQRCode = (text: string) =>
  `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(text)}`;

// --- Component ---

export default function DepositPage() {
  const router = useRouter();
  const [copied, setCopied] = useState(false);
  const [selectedCrypto, setSelectedCrypto] = useState(mockCryptoAssets[0].id);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [showCoinPicker, setShowCoinPicker] = useState(false);
  const [coinSearch, setCoinSearch] = useState('');
  const [showCopiedToast, setShowCopiedToast] = useState(false);
  const [copiedMessage, setCopiedMessage] = useState('Deposit address copied.');


  // Pinned coins shown in the header row
  const [quickCoins, setQuickCoins] = useState<string[]>([
    'btc',
    'eth',
    'usdt',
    'kas',
    'aleo',
  ]);

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

    setCopiedMessage(`${currentCryptoData?.symbol} address copied to clipboard.`);
    setShowCopiedToast(true);

    setTimeout(() => {
      setCopied(false);
      setShowCopiedToast(false);
    }, 1600);
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
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'bottom', 'left', 'right']}>
      {/* Header */}
      <View className="py-3 px-5 border-b border-gray-200 flex-row items-center h-[60px]">
        <TouchableOpacity onPress={() => router.back()} className="p-1 mr-3">
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-black">Deposit</Text>
      </View>

      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {/* Crypto Selector */}
        <View className="mb-5">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {mockCryptoAssets
              .filter((c) => quickCoins.includes(c.id))
              .map((crypto) => {
                const active = selectedCrypto === crypto.id;
                return (
                  <TouchableOpacity
                    key={crypto.id}
                    onPress={() => setSelectedCrypto(crypto.id)}
                    activeOpacity={0.85}
                    className="px-4 py-2 mr-3 rounded-full border"
                    style={{
                      backgroundColor: active ? '#FFF8E1' : '#F3F4F6',
                      borderColor: active ? '#FFC00055' : '#E5E7EB',
                    }}
                  >
                    <Text
                      className="text-sm font-semibold"
                      style={{ color: active ? '#000' : '#8E8E93' }}
                    >
                      {crypto.symbol}
                    </Text>
                  </TouchableOpacity>
                );
              })}

            {/* More button */}
            <TouchableOpacity
              onPress={() => setShowCoinPicker(true)}
              activeOpacity={0.85}
              className="px-4 py-2 mr-3 rounded-full border bg-white flex-row items-center"
              style={{ borderColor: '#E5E7EB' }}
            >
              <Ionicons name="add" size={16} color="#000" />
              <Text className="ml-1 text-sm font-semibold text-black">More</Text>
            </TouchableOpacity>
          </ScrollView>

          <Text className="text-[11px] text-gray-400 mt-2">
            Tip: Open “More” to select any coin and pin it here.
          </Text>
        </View>


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
            {currentAddress ? currentAddress : 'No deposit address available for this coin yet.'}
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
      <Modal transparent visible={showCoinPicker} animationType="fade">
        <View className="flex-1 bg-black/40 items-center justify-center px-5">
          <View className="bg-white rounded-2xl p-5 w-full max-h-[80%] border border-gray-100">
            {/* Header */}
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-lg font-bold text-black">Select coin</Text>
              <TouchableOpacity onPress={() => setShowCoinPicker(false)}>
                <Ionicons name="close" size={20} color="#111827" />
              </TouchableOpacity>
            </View>

            {/* Search */}
            <View className="flex-row items-center bg-gray-50 rounded-xl px-4 py-3 border border-gray-100 mb-4">
              <Ionicons name="search" size={18} color="#8E8E93" />
              <TextInput
                value={coinSearch}
                onChangeText={setCoinSearch}
                placeholder="Search coin"
                placeholderTextColor="#8E8E93"
                className="flex-1 ml-3 text-black"
              />
              {!!coinSearch && (
                <TouchableOpacity onPress={() => setCoinSearch('')}>
                  <Ionicons name="close-circle" size={18} color="#8E8E93" />
                </TouchableOpacity>
              )}
            </View>

            {/* List */}
            <ScrollView showsVerticalScrollIndicator={false}>
              {mockCryptoAssets
                .filter((c) => {
                  const q = coinSearch.trim().toLowerCase();
                  if (!q) return true;
                  return (
                    c.name.toLowerCase().includes(q) ||
                    c.symbol.toLowerCase().includes(q)
                  );
                })
                .map((c) => {
                  const active = selectedCrypto === c.id;
                  const pinned = quickCoins.includes(c.id);

                  return (
                    <TouchableOpacity
                      key={c.id}
                      activeOpacity={0.85}
                      onPress={() => {
                        setSelectedCrypto(c.id);
                        setShowCoinPicker(false);
                        setCoinSearch('');
                      }}
                      className="flex-row items-center justify-between p-4 rounded-2xl mb-2 border"
                      style={{
                        backgroundColor: active ? '#FFF8E1' : '#FFFFFF',
                        borderColor: active ? '#FFC00055' : '#F3F4F6',
                      }}
                    >
                      <View className="flex-row items-center flex-1">
                        <View
                          className="w-20 h-20 rounded-full items-center justify-center mr-3"
                          style={{ backgroundColor: '#FFC00020' }}
                        >
                          <Text className="font-bold text-black">
                            {c.symbol.slice(0, 4)}
                          </Text>
                        </View>

                        <View className="flex-1">
                          <Text className="text-base font-bold text-black">
                            {c.symbol}
                          </Text>
                          <Text className="text-xs text-gray-400 mt-0.5">
                            {c.name} • {c.network}
                          </Text>
                        </View>
                      </View>

                      {/* Pin/unpin */}
                      <TouchableOpacity
                        onPress={() => {
                          setQuickCoins((prev) => {
                            const exists = prev.includes(c.id);
                            if (exists) return prev.filter((id) => id !== c.id);

                            // keep row clean: max 6
                            const next = [...prev, c.id];
                            return next.slice(-6);
                          });
                        }}
                        className="p-2"
                      >
                        <Ionicons
                          name={pinned ? 'star' : 'star-outline'}
                          size={18}
                          color={pinned ? '#FFC000' : '#8E8E93'}
                        />
                      </TouchableOpacity>
                    </TouchableOpacity>
                  );
                })}
            </ScrollView>

            {/* Footer */}
            <TouchableOpacity
              activeOpacity={0.9}
              className="mt-3 bg-[#FFC000] rounded-xl py-4 items-center"
              onPress={() => setShowCoinPicker(false)}
            >
              <Text className="text-base font-bold text-white">Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal transparent visible={showCopiedToast} animationType="fade">
        <View className="flex-1 justify-end">
          <View className="px-5 pb-8">
            <View className="bg-white rounded-2xl border border-gray-100 px-4 py-3 flex-row items-center shadow">
              <View className="w-9 h-9 rounded-full bg-[#FFC000]/20 items-center justify-center mr-3">
                <Ionicons name="checkmark" size={18} color="#000" />
              </View>

              <View className="flex-1">
                <Text className="text-sm font-bold text-black">Copied</Text>
                <Text className="text-xs text-gray-500 mt-0.5">
                  {copiedMessage}
                </Text>
              </View>

              <TouchableOpacity onPress={() => setShowCopiedToast(false)} className="p-1">
                <Ionicons name="close" size={18} color="#8E8E93" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>


    </SafeAreaView>
  );
}
