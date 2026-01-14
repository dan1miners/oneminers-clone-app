import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

/* ---------- Types ---------- */

type CryptoAsset = {
  id: string;
  name: string;
  symbol: string;
  balance: string;
  price: number;
  change24h: string;
  icon: string;
};

type ExchangePair = {
  from: string;
  to: string;
  rate: number;
  fee: number;
  minAmount: number;
};

type ExchangeTransaction = {
  id: string;
  fromAsset: string;
  toAsset: string;
  fromAmount: string;
  toAmount: string;
  rate: number;
  status: 'Completed' | 'Pending' | 'Failed' | 'Processing';
  timestamp: string;
};

/* ---------- Mock Data ---------- */

const mockCryptoAssets: CryptoAsset[] = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', balance: '0.01234567', price: 45000, change24h: '+2.3%', icon: '🟠' },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', balance: '1.57890', price: 3200, change24h: '+1.8%', icon: '🟣' },
  { id: 'usdt', name: 'Tether', symbol: 'USDT', balance: '500.00', price: 1, change24h: '0.0%', icon: '💎' },
  { id: 'aleo', name: 'Aleo', symbol: 'ALEO', balance: '1250.50', price: 2.25, change24h: '+5.7%', icon: '🔵' },
  { id: 'kas', name: 'Kaspa', symbol: 'KAS', balance: '320931.17', price: 0.05, change24h: '+1.2%', icon: '🟢' },
  { id: 'sol', name: 'Solana', symbol: 'SOL', balance: '15.75', price: 180, change24h: '+3.1%', icon: '🟡' },
];

const exchangeRates: ExchangePair[] = [
  { from: 'btc', to: 'eth', rate: 14.0625, fee: 0.1, minAmount: 0.001 },
  { from: 'btc', to: 'usdt', rate: 45000, fee: 0.1, minAmount: 0.001 },
  { from: 'eth', to: 'btc', rate: 0.0711, fee: 0.1, minAmount: 0.01 },
  { from: 'eth', to: 'usdt', rate: 3200, fee: 0.1, minAmount: 0.01 },
];

const mockExchanges: ExchangeTransaction[] = [
  { id: 'ex1', fromAsset: 'btc', toAsset: 'eth', fromAmount: '0.001', toAmount: '0.01406', rate: 14.06, status: 'Completed', timestamp: '2023-10-27 10:30 AM' },
  { id: 'ex2', fromAsset: 'eth', toAsset: 'sol', fromAmount: '0.5', toAmount: '8.89', rate: 17.78, status: 'Processing', timestamp: '2023-10-26 09:15 PM' },
];

/* ---------- Component ---------- */

export default function ExchangePage() {
  const router = useRouter();

  const [fromAsset, setFromAsset] = useState(mockCryptoAssets[0].id);
  const [toAsset, setToAsset] = useState(mockCryptoAssets[1].id);
  const [fromAmount, setFromAmount] = useState('');
  const [toAmount, setToAmount] = useState('');
  const [showFromSelector, setShowFromSelector] = useState(false);
  const [showToSelector, setShowToSelector] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const fromAssetData = mockCryptoAssets.find(a => a.id === fromAsset);
  const toAssetData = mockCryptoAssets.find(a => a.id === toAsset);

  const currentExchangeRate = exchangeRates.find(
    r => r.from === fromAsset && r.to === toAsset
  );

  useEffect(() => {
    if (fromAmount && currentExchangeRate) {
      const amount = parseFloat(fromAmount);
      if (!isNaN(amount)) {
        setToAmount(
          (amount * currentExchangeRate.rate * (1 - currentExchangeRate.fee / 100)).toFixed(8)
        );
      } else {
        setToAmount('');
      }
    } else {
      setToAmount('');
    }
  }, [fromAmount, currentExchangeRate]);

  const handleExchange = () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0) {
      Alert.alert('Error', 'Please enter a valid amount.');
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmExchange = () => {
    setIsProcessing(true);
    setShowConfirmModal(false);

    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert(
        'Success',
        `Exchange of ${fromAmount} ${fromAssetData?.symbol} to ${toAmount} ${toAssetData?.symbol} submitted.`,
        [{ text: 'OK', onPress: () => {
          setFromAmount('');
          setToAmount('');
        }}]
      );
    }, 2000);
  };

  const renderAssetItem = (asset: CryptoAsset, onSelect: (id: string) => void, isFrom: boolean) => (
    <TouchableOpacity
      className="flex-row items-center p-4 border-b border-[#F2F2F7]"
      onPress={() => {
        onSelect(asset.id);
        isFrom ? setShowFromSelector(false) : setShowToSelector(false);
      }}
    >
      <View className="w-10 h-10 rounded-full bg-[#F2F2F7] items-center justify-center mr-3">
        <Text className="text-lg">{asset.icon}</Text>
      </View>

      <View className="flex-1">
        <Text className="text-base font-semibold text-[#212529]">
          {asset.name}
        </Text>
        <Text className="text-xs text-[#8E8E93]">
          {asset.balance} {asset.symbol}
        </Text>
      </View>

      <View className="items-end">
        <Text className="text-sm font-semibold text-[#212529]">
          ${asset.price.toLocaleString()}
        </Text>
        <Text
          className={`text-xs ${
            asset.change24h.startsWith('+')
              ? 'text-green-600'
              : asset.change24h.startsWith('-')
              ? 'text-red-500'
              : 'text-[#8E8E93]'
          }`}
        >
          {asset.change24h}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderExchangeItem = ({ item }: { item: ExchangeTransaction }) => {
    const badge =
      item.status === 'Completed'
        ? { bg: 'bg-green-100', text: 'text-green-700' }
        : item.status === 'Processing'
        ? { bg: 'bg-blue-100', text: 'text-blue-700' }
        : item.status === 'Pending'
        ? { bg: 'bg-yellow-100', text: 'text-orange-600' }
        : { bg: 'bg-red-100', text: 'text-red-700' };
  
    return (
      <View className="bg-white p-4 rounded-xl mb-2 flex-row items-start">
        {/* Left column */}
        <View className="flex-1 pr-3">
          <Text className="text-sm font-semibold text-[#212529]" numberOfLines={1}>
            - {item.fromAmount} {item.fromAsset.toUpperCase()}
          </Text>
  
          <Text className="text-sm text-green-600 mt-0.5" numberOfLines={1}>
            + {item.toAmount} {item.toAsset.toUpperCase()}
          </Text>
  
          <Text className="text-xs text-[#8E8E93] mt-1" numberOfLines={1}>
            {item.timestamp}
          </Text>
        </View>
  
        {/* Right column (Status) */}
        <View className={`px-3 py-1.5 rounded-full self-start min-w-[96px] items-center ${badge.bg}`}>
          <Text className={`text-xs font-semibold ${badge.text}`}>
            {item.status}
          </Text>
        </View>
      </View>
    );
  };
  

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'bottom', 'left', 'right']}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-[#E9ECEF]">
        <TouchableOpacity onPress={() => router.back()} className="p-1 mr-3">
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-lg font-semibold text-black">Exchange</Text>
      </View>

      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {/* Exchange Card */}
        <View className="bg-white rounded-2xl p-5 mb-6">
          <Text className="text-lg font-semibold text-center mb-5">
            Quick Exchange
          </Text>

          {/* From */}
          <Text className="text-sm font-semibold text-[#8E8E93] mb-2">
            From
          </Text>
          <TouchableOpacity
            className="flex-row justify-between items-center border border-[#E9ECEF] rounded-xl p-4 mb-3"
            onPress={() => setShowFromSelector(true)}
          >
            <Text className="font-semibold">
              {fromAssetData?.name}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#8E8E93" />
          </TouchableOpacity>

          <View className="flex-row items-center border border-[#E9ECEF] rounded-xl mb-4">
            <TextInput
              className="flex-1 p-4 text-lg font-semibold"
              placeholder="0.00"
              value={fromAmount}
              onChangeText={setFromAmount}
              keyboardType="decimal-pad"
              placeholderTextColor="#8E8E93"
            />
            <TouchableOpacity onPress={() => setFromAmount(fromAssetData?.balance || '')}>
              <Text className="px-4 text-sm font-semibold text-[#FFC000]">
                MAX
              </Text>
            </TouchableOpacity>
          </View>

          {/* To */}
          <Text className="text-sm font-semibold text-[#8E8E93] mb-2">
            To
          </Text>
          <TouchableOpacity
            className="flex-row justify-between items-center border border-[#E9ECEF] rounded-xl p-4 mb-3"
            onPress={() => setShowToSelector(true)}
          >
            <Text className="font-semibold">
              {toAssetData?.name}
            </Text>
            <Ionicons name="chevron-down" size={20} color="#8E8E93" />
          </TouchableOpacity>

          <View className="flex-row items-center border border-[#E9ECEF] rounded-xl mb-5">
            <TextInput
              className="flex-1 p-4 text-lg font-semibold text-[#212529]"
              value={toAmount}
              editable={false}
            />
            <Text className="px-4 text-sm font-semibold text-[#8E8E93]">
              {toAssetData?.symbol}
            </Text>
          </View>

          {/* Exchange Button */}
          <TouchableOpacity
            onPress={handleExchange}
            disabled={!fromAmount || !toAmount || isProcessing}
            className={[
              'rounded-xl p-4 items-center',
              !fromAmount || !toAmount || isProcessing
                ? 'bg-[#E9ECEF]'
                : 'bg-[#FFC000]',
            ].join(' ')}
          >
            <Text className="text-base font-semibold text-white">
              {isProcessing ? 'Processing...' : 'Exchange'}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Recent Exchanges */}
        <Text className="text-base font-bold mb-4">
          Recent Exchanges
        </Text>

        <FlatList
          data={mockExchanges}
          keyExtractor={item => item.id}
          renderItem={renderExchangeItem}
          scrollEnabled={false}
          ListEmptyComponent={
            <Text className="text-center text-[#8E8E93] mt-6">
              No exchange history.
            </Text>
          }
        />
      </ScrollView>

      {/* Asset Modals */}
      <Modal visible={showFromSelector} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-center p-5">
          <View className="bg-white rounded-2xl max-h-[80%]">
            <View className="flex-row justify-between items-center p-4 border-b border-[#E9ECEF]">
              <Text className="text-lg font-bold">Select Asset</Text>
              <TouchableOpacity onPress={() => setShowFromSelector(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={mockCryptoAssets.filter(a => a.id !== toAsset)}
              keyExtractor={i => i.id}
              renderItem={({ item }) =>
                renderAssetItem(item, setFromAsset, true)
              }
            />
          </View>
        </View>
      </Modal>

      <Modal visible={showToSelector} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-center p-5">
          <View className="bg-white rounded-2xl max-h-[80%]">
            <View className="flex-row justify-between items-center p-4 border-b border-[#E9ECEF]">
              <Text className="text-lg font-bold">Select Asset</Text>
              <TouchableOpacity onPress={() => setShowToSelector(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={mockCryptoAssets.filter(a => a.id !== fromAsset)}
              keyExtractor={i => i.id}
              renderItem={({ item }) =>
                renderAssetItem(item, setToAsset, false)
              }
            />
          </View>
        </View>
      </Modal>

      {/* Confirm Modal */}
      <Modal visible={showConfirmModal} transparent animationType="slide">
        <View className="flex-1 bg-black/50 justify-center p-5">
          <View className="bg-white rounded-2xl p-5">
            <Text className="text-lg font-bold mb-4">
              Confirm Exchange
            </Text>

            <View className="mb-5">
              <View className="flex-row justify-between mb-3">
                <Text className="text-[#8E8E93]">You Send</Text>
                <Text className="font-semibold">
                  {fromAmount} {fromAssetData?.symbol}
                </Text>
              </View>
              <View className="flex-row justify-between mb-3">
                <Text className="text-[#8E8E93]">You Receive</Text>
                <Text className="font-semibold">
                  {toAmount} {toAssetData?.symbol}
                </Text>
              </View>
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 bg-[#E9ECEF] rounded-xl p-4 items-center"
                onPress={() => setShowConfirmModal(false)}
              >
                <Text className="text-[#8E8E93] font-semibold">Cancel</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 bg-[#FFC000] rounded-xl p-4 items-center"
                onPress={confirmExchange}
              >
                <Text className="text-white font-semibold">
                  Confirm
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
