import React, { useState } from 'react';
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
  network: string;
  fee: string;
};

type WithdrawalTransaction = {
  id: string;
  assetId: string;
  amount: string;
  address: string;
  status: 'Completed' | 'Pending' | 'Failed' | 'Processing';
  timestamp: string;
  txHash?: string;
};

/* ---------- Mock Data ---------- */

const mockCryptoAssets: CryptoAsset[] = [
  { id: 'btc', name: 'Bitcoin', symbol: 'BTC', balance: '0.01234567', network: 'Bitcoin Network', fee: '0.0005' },
  { id: 'eth', name: 'Ethereum', symbol: 'ETH', balance: '1.57890', network: 'ERC20 Network', fee: '0.003' },
  { id: 'usdt', name: 'Tether', symbol: 'USDT', balance: '500.00', network: 'TRC20 Network', fee: '1.0' },
];

const mockWithdrawals: WithdrawalTransaction[] = [
  { id: 'wd1', assetId: 'btc', amount: '0.001', address: 'bc1qxy2kgd...', status: 'Completed', timestamp: '2023-10-27 10:30 AM', txHash: 'a1b2c3...' },
  { id: 'wd2', assetId: 'eth', amount: '0.5', address: '0x89205A3...', status: 'Processing', timestamp: '2023-10-26 09:15 PM', txHash: 'x1y2z3...' },
  { id: 'wd3', assetId: 'btc', amount: '0.002', address: 'bc1qwerty...', status: 'Pending', timestamp: '2023-10-26 05:00 PM' },
  { id: 'wd4', assetId: 'usdt', amount: '100.00', address: 'TRX9cQiVW...', status: 'Completed', timestamp: '2023-10-25 11:00 AM', txHash: 'q1w2e3...' },
  { id: 'wd5', assetId: 'eth', amount: '1.0', address: '0xinvalid...', status: 'Failed', timestamp: '2023-10-24 04:45 PM' },
];

/* ---------- Component ---------- */

export default function WithdrawPage() {
  const router = useRouter();

  const [selectedCrypto, setSelectedCrypto] = useState(mockCryptoAssets[0].id);
  const [withdrawalAddress, setWithdrawalAddress] = useState('');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const currentCrypto = mockCryptoAssets.find(c => c.id === selectedCrypto);
  const withdrawals = mockWithdrawals.filter(w => w.assetId === selectedCrypto);

  const availableBalance = currentCrypto
    ? (parseFloat(currentCrypto.balance) - parseFloat(currentCrypto.fee)).toFixed(8)
    : '0';

  const handleWithdraw = () => {
    if (!withdrawalAddress.trim()) return Alert.alert('Error', 'Enter a valid address.');
    if (!withdrawalAmount || parseFloat(withdrawalAmount) <= 0) return Alert.alert('Error', 'Enter a valid amount.');
    if (parseFloat(withdrawalAmount) > parseFloat(availableBalance)) return Alert.alert('Error', 'Insufficient balance.');
    setShowConfirmModal(true);
  };

  const confirmWithdrawal = () => {
    setIsProcessing(true);
    setShowConfirmModal(false);
    setTimeout(() => {
      setIsProcessing(false);
      Alert.alert(
        'Success',
        `Withdrawal of ${withdrawalAmount} ${currentCrypto?.symbol} submitted.`,
        [{ text: 'OK', onPress: () => { setWithdrawalAmount(''); setWithdrawalAddress(''); } }]
      );
    }, 2000);
  };

  const statusStyle = (s: WithdrawalTransaction['status']) =>
    ({
      Completed: 'bg-green-100 text-green-700',
      Processing: 'bg-yellow-100 text-yellow-700',
      Pending: 'bg-orange-100 text-orange-700',
      Failed: 'bg-red-100 text-red-700',
    }[s]);

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FA]">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-[#E9ECEF]">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text className="text-lg font-semibold">Withdraw</Text>
      </View>

      <ScrollView className="p-4">
        {/* Crypto Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-5">
          {mockCryptoAssets.map(c => (
            <TouchableOpacity
              key={c.id}
              onPress={() => setSelectedCrypto(c.id)}
              className={`px-4 py-2 mr-3 rounded-full ${
                selectedCrypto === c.id ? 'bg-[#FFF8E1]' : 'bg-[#E9ECEF]'
              }`}
            >
              <Text className={`font-semibold ${
                selectedCrypto === c.id ? 'text-black' : 'text-[#8E8E93]'
              }`}>
                {c.symbol}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Withdraw Card */}
        <View className="bg-white rounded-2xl p-5 mb-6">
          <Text className="text-lg font-semibold mb-4">
            Withdraw {currentCrypto?.name}
          </Text>

          <View className="bg-[#F8F9FA] rounded-xl p-4 mb-5">
            {[
              ['Available Balance', `${availableBalance} ${currentCrypto?.symbol}`],
              ['Network Fee', `${currentCrypto?.fee} ${currentCrypto?.symbol}`],
              ['Network', currentCrypto?.network],
            ].map(([l, v], i) => (
              <View key={i} className="flex-row justify-between mb-2">
                <Text className="text-sm text-[#8E8E93]">{l}</Text>
                <Text className="text-sm font-semibold">{v}</Text>
              </View>
            ))}
          </View>

          <Text className="text-sm font-semibold mb-2">Withdrawal Address</Text>
          <TextInput
            className="border border-[#E9ECEF] rounded-xl p-4 mb-4"
            placeholder={`Enter ${currentCrypto?.symbol} address`}
            value={withdrawalAddress}
            onChangeText={setWithdrawalAddress}
          />

          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-sm font-semibold">Amount</Text>
            <TouchableOpacity onPress={() => setWithdrawalAmount(availableBalance)}>
              <Text className="font-semibold text-[#FFC000]">MAX</Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row items-center border border-[#E9ECEF] rounded-xl mb-5">
            <TextInput
              className="flex-1 p-4 text-lg font-semibold"
              placeholder="0.00"
              keyboardType="decimal-pad"
              value={withdrawalAmount}
              onChangeText={setWithdrawalAmount}
            />
            <Text className="px-4 text-[#8E8E93] font-semibold">
              {currentCrypto?.symbol}
            </Text>
          </View>

          <TouchableOpacity
            disabled={!withdrawalAmount || !withdrawalAddress || isProcessing}
            onPress={handleWithdraw}
            className={`py-4 rounded-xl items-center ${
              withdrawalAmount && withdrawalAddress ? 'bg-[#FFC000]' : 'bg-[#E9ECEF]'
            }`}
          >
            <Text className="font-semibold text-white">
              {isProcessing ? 'Processing...' : 'Withdraw'}
            </Text>
          </TouchableOpacity>

          <View className="flex-row bg-[#FFF8E1] p-3 rounded-xl mt-4">
            <Ionicons name="warning-outline" size={16} color="#FF9500" />
            <Text className="text-xs text-[#8B6914] ml-2 flex-1">
              Double-check the withdrawal address. Transactions cannot be reversed.
            </Text>
          </View>
        </View>

        {/* History */}
        <Text className="text-lg font-bold mb-4">Recent Withdrawals</Text>

        <FlatList
          data={withdrawals}
          scrollEnabled={false}
          keyExtractor={i => i.id}
          ListEmptyComponent={<Text className="text-center text-[#8E8E93]">No withdrawal history.</Text>}
          renderItem={({ item }) => (
            <View className="bg-white rounded-xl p-4 mb-2 flex-row items-start">
              {/* Left */}
              <View className="flex-1 pr-3">
                <Text className="font-semibold text-black">
                  - {item.amount} {currentCrypto?.symbol}
                </Text>
          
                <Text className="text-xs text-[#8E8E93] mt-1" numberOfLines={1}>
                  To: {item.address}
                </Text>
          
                <Text className="text-xs text-[#8E8E93] mt-1">
                  {item.timestamp}
                </Text>
              </View>
          
              {/* Right (Status Pill) */}
              <View
                className={`px-3 py-1 rounded-full self-start min-w-[92px] items-center ${statusStyle(
                  item.status
                )}`}
              >
                <Text className="text-xs font-semibold">
                  {item.status}
                </Text>
              </View>
            </View>
          )}
          
        />
      </ScrollView>

      {/* Confirm Modal */}
      <Modal transparent visible={showConfirmModal} animationType="slide">
        <View className="flex-1 bg-black/50 items-center justify-center px-5">
          <View className="bg-white rounded-2xl p-6 w-full max-w-md">
            <Text className="text-xl font-bold text-center mb-5">
              Confirm Withdrawal
            </Text>

            {[
              ['Amount', `${withdrawalAmount} ${currentCrypto?.symbol}`],
              ['Fee', `${currentCrypto?.fee} ${currentCrypto?.symbol}`],
              ['You Receive',
                `${(parseFloat(withdrawalAmount) - parseFloat(currentCrypto?.fee || '0')).toFixed(8)} ${currentCrypto?.symbol}`
              ],
            ].map(([l, v], i) => (
              <View key={i} className="flex-row justify-between mb-3">
                <Text className="text-sm text-[#8E8E93]">{l}</Text>
                <Text className="text-sm font-semibold">{v}</Text>
              </View>
            ))}

            <View className="flex-row gap-3 mt-6">
              <TouchableOpacity
                onPress={() => setShowConfirmModal(false)}
                className="flex-1 bg-[#E9ECEF] py-4 rounded-xl items-center"
              >
                <Text className="font-semibold text-[#8E8E93]">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={confirmWithdrawal}
                className="flex-1 bg-[#FFC000] py-4 rounded-xl items-center"
              >
                <Text className="font-semibold text-white">
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
