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
  const [selectedCrypto, setSelectedCrypto] = useState<string>('btc');

  const [withdrawalAddress, setWithdrawalAddress] = useState('');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');


  const [showCoinPicker, setShowCoinPicker] = useState(false);

  // Quick coins shown in the horizontal row (user can customize)
  const [quickCoins, setQuickCoins] = useState<string[]>(['btc', 'eth', 'usdt', 'kas', 'aleo']);

  // Search inside coin picker modal
  const [coinSearch, setCoinSearch] = useState('');


  const currentCrypto = mockCryptoAssets.find((c) => c.id === selectedCrypto);

  const withdrawals = mockWithdrawals.filter((w) => w.assetId === selectedCrypto);

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
      setSuccessMessage(
      `Withdrawal of ${withdrawalAmount} ${currentCrypto?.symbol} submitted.`
    );
    setShowSuccessModal(true);
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
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'bottom', 'left', 'right']}>
      {/* Header */}
      <View className="py-3 px-5 border-b border-gray-200 flex-row  items-center h-[60px]">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text className="text-lg font-semibold">Withdraw</Text>
      </View>

      <ScrollView className="p-4">
        {/* Crypto Selector */}
        <View className="mb-5">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {mockCryptoAssets
              .filter((c) => quickCoins.includes(c.id))
              .map((c) => {
                const active = selectedCrypto === c.id;
                return (
                  <TouchableOpacity
                    key={c.id}
                    onPress={() => setSelectedCrypto(c.id)}
                    activeOpacity={0.85}
                    className="px-4 py-2 mr-3 rounded-full border"
                    style={{
                      backgroundColor: active ? '#FFF8E1' : '#F3F4F6',
                      borderColor: active ? '#FFC00055' : '#E5E7EB',
                    }}
                  >
                    <Text
                      className="font-semibold"
                      style={{ color: active ? '#000' : '#8E8E93' }}
                    >
                      {c.symbol}
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
              <Text className="ml-1 font-semibold text-black">More</Text>
            </TouchableOpacity>
          </ScrollView>

          {/* Small helper line (optional) */}
          <Text className="text-[11px] text-gray-400 mt-2">
            Tip: Use “More” to pick any coin (and pin it to this row).
          </Text>
        </View>


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
      <Modal transparent visible={showSuccessModal} animationType="fade">
        <View className="flex-1 bg-black/40 items-center justify-center px-5">
          <View className="bg-white rounded-2xl p-5 w-full border border-gray-100">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-lg font-bold text-black">Success</Text>

              <TouchableOpacity onPress={() => setShowSuccessModal(false)}>
                <Ionicons name="close" size={20} color="#111827" />
              </TouchableOpacity>
            </View>

            <Text className="text-sm text-gray-600 leading-5 mt-1">
              {successMessage}
            </Text>

            <TouchableOpacity
              activeOpacity={0.9}
              className="mt-5 bg-[#FFC000] rounded-xl py-4 items-center"
              onPress={() => {
                setShowSuccessModal(false);
                setWithdrawalAmount('');
                setWithdrawalAddress('');
              }}
            >
              <Text className="text-base font-bold text-white">OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
                          className="w-10 h-10 rounded-full items-center justify-center mr-3"
                          style={{ backgroundColor: '#FFC00020' }}
                        >
                          <Text className="font-bold text-black">
                            {c.symbol.slice(0, 3)}
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

                            // limit quick row to 6 to keep it clean
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

    </SafeAreaView>
  );
}
