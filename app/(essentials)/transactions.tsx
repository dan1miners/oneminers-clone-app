import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

/* ---------- Types ---------- */

type TransactionType =
  | 'deposit'
  | 'withdrawal'
  | 'exchange'
  | 'earning'
  | 'mining'
  | 'staking';

type Transaction = {
  id: string;
  type: TransactionType;
  asset: string;
  assetSymbol: string;
  amount: string;
  amountUSD: string;
  status: 'completed' | 'pending' | 'failed' | 'processing';
  timestamp: string;
  fromAsset?: string;
  fromAmount?: string;
  toAsset?: string;
  toAmount?: string;
  address?: string;
  txHash?: string;
  description?: string;
  icon: string;
};

type FilterType = 'all' | TransactionType;

const mockTransactions: Transaction[] = [
  {
    id: 'tx-001',
    type: 'deposit',
    asset: 'Bitcoin',
    assetSymbol: 'BTC',
    amount: '0.025',
    amountUSD: '$1,125',
    status: 'completed',
    timestamp: '2024-02-12 10:30',
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    txHash: '0xabc123',
    icon: 'logo-bitcoin',
  },
  {
    id: 'tx-002',
    type: 'withdrawal',
    asset: 'USDT',
    assetSymbol: 'USDT',
    amount: '500',
    amountUSD: '$500',
    status: 'pending',
    timestamp: '2024-02-11 16:45',
    address: '0x742d35Cc6634C0532925a3b844Bc454e4438f44e',
    txHash: '0xdef456',
    icon: 'card',
  },
  {
    id: 'tx-003',
    type: 'earning',
    asset: 'Mining Reward',
    assetSymbol: 'BTC',
    amount: '0.0042',
    amountUSD: '$189',
    status: 'completed',
    timestamp: '2024-02-10 08:15',
    description: 'Daily mining reward',
    icon: 'trending-up',
  },
  {
    id: 'tx-004',
    type: 'exchange',
    asset: 'BTC → USDT',
    assetSymbol: 'USDT',
    amount: '0.01',
    amountUSD: '$450',
    status: 'completed',
    timestamp: '2024-02-09 19:20',
    description: 'Converted BTC to USDT',
    fromAsset: 'BTC',
    fromAmount: '0.01',
    toAsset: 'USDT',
    toAmount: '450',
    icon: 'swap-horizontal',
  },
  {
    id: 'tx-005',
    type: 'staking',
    asset: 'KAS',
    assetSymbol: 'KAS',
    amount: '1,250',
    amountUSD: '$82',
    status: 'processing',
    timestamp: '2024-02-08 13:10',
    description: 'Staking reward',
    icon: 'flash',
  },
];


/* ---------- Component ---------- */

export default function TransactionsPage() {
  const router = useRouter();

  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  /* ---------- Filtering ---------- */

  const filtered = transactions.filter(t => {
    const matchFilter = filter === 'all' || t.type === filter;
    const matchSearch =
      !searchQuery ||
      t.asset.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.assetSymbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchFilter && matchSearch;
  });

  const sorted = [...filtered].sort(
    (a, b) =>
      new Date(b.timestamp).getTime() -
      new Date(a.timestamp).getTime()
  );

  /* ---------- Totals ---------- */

  const totals = {
    deposits: transactions
      .filter(t => t.type === 'deposit' && t.status === 'completed')
      .reduce((s, t) => s + Number(t.amountUSD.replace(/[$,]/g, '')), 0),
    withdrawals: transactions
      .filter(t => t.type === 'withdrawal' && t.status === 'completed')
      .reduce((s, t) => s + Number(t.amountUSD.replace(/[$,]/g, '')), 0),
    earnings: transactions
      .filter(
        t =>
          (t.type === 'earning' || t.type === 'staking') &&
          t.status === 'completed'
      )
      .reduce((s, t) => s + Number(t.amountUSD.replace(/[$,]/g, '')), 0),
  };

  const netEarnings =
    totals.earnings + totals.deposits - totals.withdrawals;

  /* ---------- Helpers ---------- */

  const statusColor = (s: Transaction['status']) =>
    ({
      completed: '#34C759',
      processing: '#FFC000',
      pending: '#FF9500',
      failed: '#FF3B30',
    }[s]);

  const statusBg = (s: Transaction['status']) =>
    ({
      completed: '#E8F5E9',
      processing: '#FFF8E1',
      pending: '#FFF3CD',
      failed: '#FDECEA',
    }[s]);

  const typeColor = (t: TransactionType) =>
    ({
      deposit: '#34C759',
      withdrawal: '#FF3B30',
      exchange: '#FFC000',
      earning: '#FFC000',
      mining: '#FFC000',
      staking: '#5856D6',
    }[t]);

  const typeIcon = (t: TransactionType) =>
    ({
      deposit: 'arrow-down-circle',
      withdrawal: 'arrow-up-circle',
      exchange: 'swap-horizontal',
      earning: 'trending-up',
      mining: 'hammer',
      staking: 'flash',
    }[t]);

  /* ---------- Render Item ---------- */

  const renderItem = ({ item }: { item: Transaction }) => {
    const positive =
      item.type === 'deposit' ||
      item.type === 'earning' ||
      item.type === 'staking' ||
      item.type === 'mining';

    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedTransaction(item);
          setShowDetailsModal(true);
        }}
        className="flex-row justify-between bg-white p-4 rounded-xl mb-2"
      >
        <View className="flex-row items-center flex-1">
          <View
            className="w-10 h-10 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: `${typeColor(item.type)}20` }}
          >
            <Ionicons
              name={typeIcon(item.type) as any}
              size={20}
              color={typeColor(item.type)}
            />
          </View>

          <View className="flex-1">
            <Text className="text-base font-semibold text-black">
              {item.type === 'exchange' && item.description
                ? item.description
                : item.asset}
            </Text>
            <Text className="text-xs text-[#8E8E93] mt-1">
              {item.timestamp}
            </Text>
            {item.description && item.type !== 'exchange' && (
              <Text className="text-xs text-[#8E8E93] mt-1">
                {item.description}
              </Text>
            )}
          </View>
        </View>

        <View className="items-end">
          <Text
            className="text-base font-semibold"
            style={{
              color: positive ? '#34C759' : '#FF3B30',
            }}
          >
            {positive ? '+' : '-'} {item.amount} {item.assetSymbol}
          </Text>
          <Text className="text-xs text-[#8E8E93] mt-1">
            {item.amountUSD}
          </Text>

          <View
            className="mt-2 px-2 py-1 rounded-md"
            style={{ backgroundColor: statusBg(item.status) }}
          >
            <Text
              className="text-[10px] font-semibold"
              style={{ color: statusColor(item.status) }}
            >
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  /* ---------- UI ---------- */

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top', 'bottom', 'left', 'right']}>
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 bg-white border-b border-[#E9ECEF]">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>
        <Text className="text-lg font-semibold">Transactions</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Summary */}
        <View className="flex-row mb-4">
          {[
            ['Deposits', totals.deposits, '#34C759'],
            ['Withdrawals', totals.withdrawals, '#FF3B30'],
            ['Earnings', totals.earnings, '#34C759'],
          ].map(([label, value, color], i) => (
            <View
              key={i}
              className="flex-1 bg-white rounded-xl p-4 mx-1 items-center"
            >
              <Text className="text-xs text-[#8E8E93] mb-1">
                {label}
              </Text>
              <Text
                className="text-base font-bold"
                style={{ color: color as string }}
              >
                ${Number(value).toLocaleString()}
              </Text>
            </View>
          ))}
        </View>

        {/* Net */}
        <View className="bg-white rounded-2xl p-5 items-center mb-5">
          <Text className="text-sm text-[#8E8E93] mb-2">
            Net Earnings
          </Text>
          <Text
            className="text-3xl font-bold"
            style={{
              color: netEarnings >= 0 ? '#34C759' : '#FF3B30',
            }}
          >
            {netEarnings >= 0 ? '+' : '-'}$
            {Math.abs(netEarnings).toLocaleString()}
          </Text>
        </View>

        {/* Search */}
        <View className="flex-row items-center bg-white rounded-xl px-4 py-3 mb-4">
          <Ionicons name="search" size={18} color="#8E8E93" />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search transactions..."
            placeholderTextColor="#8E8E93"
            className="flex-1 ml-3"
          />
          {!!searchQuery && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color="#8E8E93" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          {(['all', 'deposit', 'withdrawal', 'exchange', 'earning', 'staking'] as FilterType[]).map(f => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              className={`px-4 py-2 rounded-full mr-2 ${
                filter === f ? 'bg-[#FFF8E1]' : 'bg-[#E9ECEF]'
              }`}
            >
              <Text
                className={`text-sm font-semibold ${
                  filter === f ? 'text-black' : 'text-[#8E8E93]'
                }`}
              >
                {f.toUpperCase()}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* List */}
        <Text className="text-lg font-bold mb-3">
          {sorted.length} Transactions
        </Text>

        {sorted.length ? (
          <FlatList
            data={sorted}
            renderItem={renderItem}
            keyExtractor={i => i.id}
            scrollEnabled={false}
          />
        ) : (
          <View className="items-center py-16">
            <Ionicons name="receipt-outline" size={64} color="#E5E5EA" />
            <Text className="text-base font-semibold text-[#8E8E93] mt-4">
              No transactions found
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Details Modal */}
      <Modal transparent visible={showDetailsModal} animationType="slide">
        <View className="flex-1 bg-black/50 items-center justify-center px-5">
          <View className="bg-white rounded-2xl p-5 w-full max-h-[80%]">
            <View className="flex-row justify-between mb-4">
              <Text className="text-lg font-bold">
                Transaction Details
              </Text>
              <TouchableOpacity
                onPress={() => setShowDetailsModal(false)}
              >
                <Ionicons name="close" size={24} />
              </TouchableOpacity>
            </View>

            {selectedTransaction && (
              <ScrollView>
                {[
                  ['Type', selectedTransaction.type],
                  [
                    'Amount',
                    `${selectedTransaction.amount} ${selectedTransaction.assetSymbol}`,
                  ],
                  ['USD', selectedTransaction.amountUSD],
                  ['Status', selectedTransaction.status],
                  ['Date', selectedTransaction.timestamp],
                  ['Address', selectedTransaction.address],
                  ['Tx Hash', selectedTransaction.txHash],
                ].map(
                  ([label, value], i) =>
                    value && (
                      <View
                        key={i}
                        className="flex-row justify-between mb-3"
                      >
                        <Text className="text-sm text-[#8E8E93]">
                          {label}
                        </Text>
                        <Text className="text-sm font-semibold text-black text-right ml-4">
                          {value}
                        </Text>
                      </View>
                    )
                )}
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
