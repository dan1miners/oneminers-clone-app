import React, { useMemo, useState } from 'react';
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

/* ---------- Mock ---------- */

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

/* ---------- Theme (match dashboard) ---------- */

const COLORS = {
  accent: '#FFC000',
  text: '#000000',
  subtext: '#6B7280', // gray-500/600 range
  muted: '#8E8E93',
  border: '#E5E7EB',
  success: '#34C759',
  danger: '#FF3B30',
  info: '#007AFF',
};

/* ---------- Component ---------- */

export default function TransactionsPage() {
  const router = useRouter();

  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  /* ---------- Helpers ---------- */

  const statusMeta = (s: Transaction['status']) => {
    switch (s) {
      case 'completed':
        return { fg: COLORS.success, bg: `${COLORS.success}1A` };
      case 'processing':
        return { fg: COLORS.accent, bg: `${COLORS.accent}1A` };
      case 'pending':
        return { fg: '#FF9500', bg: '#FF95001A' };
      case 'failed':
      default:
        return { fg: COLORS.danger, bg: `${COLORS.danger}1A` };
    }
  };

  const typeMeta = (t: TransactionType) => {
    switch (t) {
      case 'deposit':
        return { color: COLORS.success, icon: 'arrow-down-circle' as const };
      case 'withdrawal':
        return { color: COLORS.danger, icon: 'arrow-up-circle' as const };
      case 'exchange':
        return { color: COLORS.accent, icon: 'swap-horizontal' as const };
      case 'earning':
        return { color: COLORS.accent, icon: 'trending-up' as const };
      case 'mining':
        return { color: COLORS.accent, icon: 'hammer' as const };
      case 'staking':
        return { color: COLORS.info, icon: 'flash' as const };
      default:
        return { color: COLORS.accent, icon: 'receipt-outline' as const };
    }
  };

  const parseUSD = (v: string) => Number(v.replace(/[$,]/g, ''));

  /* ---------- Derived Data ---------- */

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const matchFilter = filter === 'all' || t.type === filter;
      const q = searchQuery.trim().toLowerCase();

      const matchSearch =
        !q ||
        t.asset.toLowerCase().includes(q) ||
        t.assetSymbol.toLowerCase().includes(q) ||
        (t.description?.toLowerCase().includes(q) ?? false);

      return matchFilter && matchSearch;
    });
  }, [transactions, filter, searchQuery]);

  const sorted = useMemo(() => {
    return [...filtered].sort(
      (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    );
  }, [filtered]);

  const totals = useMemo(() => {
    const deposits = transactions
      .filter((t) => t.type === 'deposit' && t.status === 'completed')
      .reduce((s, t) => s + parseUSD(t.amountUSD), 0);

    const withdrawals = transactions
      .filter((t) => t.type === 'withdrawal' && t.status === 'completed')
      .reduce((s, t) => s + parseUSD(t.amountUSD), 0);

    const earnings = transactions
      .filter(
        (t) =>
          (t.type === 'earning' || t.type === 'staking') &&
          t.status === 'completed'
      )
      .reduce((s, t) => s + parseUSD(t.amountUSD), 0);

    return { deposits, withdrawals, earnings };
  }, [transactions]);

  const netEarnings = totals.earnings + totals.deposits - totals.withdrawals;

  /* ---------- Render Item ---------- */

  const renderItem = ({ item }: { item: Transaction }) => {
    const isPositive =
      item.type === 'deposit' ||
      item.type === 'earning' ||
      item.type === 'staking' ||
      item.type === 'mining';

    const tm = typeMeta(item.type);
    const sm = statusMeta(item.status);

    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedTransaction(item);
          setShowDetailsModal(true);
        }}
        activeOpacity={0.85}
        className="flex-row justify-between bg-white p-4 rounded-2xl mb-2 border border-gray-100"
      >
        <View className="flex-row items-center flex-1">
          <View
            className="w-10 h-10 rounded-full items-center justify-center mr-3"
            style={{ backgroundColor: `${tm.color}20` }}
          >
            <Ionicons name={tm.icon as any} size={20} color={tm.color} />
          </View>

          <View className="flex-1">
            <Text className="text-base font-bold text-black">
              {item.type === 'exchange' && item.description
                ? item.description
                : item.asset}
            </Text>

            <Text className="text-xs text-gray-400 mt-1">{item.timestamp}</Text>

            {item.description && item.type !== 'exchange' && (
              <Text className="text-xs text-gray-400 mt-1">
                {item.description}
              </Text>
            )}
          </View>
        </View>

        <View className="items-end">
          <Text
            className="text-base font-bold"
            style={{ color: isPositive ? COLORS.success : COLORS.danger }}
          >
            {isPositive ? '+' : '-'} {item.amount} {item.assetSymbol}
          </Text>

          <Text className="text-xs text-gray-400 mt-1">{item.amountUSD}</Text>

          <View
            className="mt-2 px-2 py-1 rounded-md"
            style={{ backgroundColor: sm.bg }}
          >
            <Text className="text-[10px] font-semibold" style={{ color: sm.fg }}>
              {item.status.toUpperCase()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  /* ---------- UI ---------- */

  return (
    <SafeAreaView
      className="flex-1 bg-gray-50"
      edges={['top', 'bottom', 'left', 'right']}
    >
      {/* Header */}
      <View className="py-3 px-5 border-b border-gray-200 flex-row items-center h-[60px]">
        <TouchableOpacity onPress={() => router.back()} className="mr-3">
          <Ionicons name="arrow-back" size={24} color={COLORS.text} />
        </TouchableOpacity>
        <Text className="text-lg font-bold text-black">Transactions</Text>
      </View>

      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {/* Summary (match dashboard tiles) */}
        <View className="flex-row mb-4">
          {[
            {
              label: 'Deposits',
              value: totals.deposits,
              icon: 'arrow-down-circle-outline',
              iconColor: COLORS.success,
            },
            {
              label: 'Withdrawals',
              value: totals.withdrawals,
              icon: 'arrow-up-circle-outline',
              iconColor: COLORS.danger,
            },
            {
              label: 'Earnings',
              value: totals.earnings,
              icon: 'trending-up-outline',
              iconColor: COLORS.accent,
            },
          ].map((x, i) => (
            <View
              key={i}
              className="flex-1 bg-white rounded-2xl p-4 mx-1 border border-gray-100"
            >
              <View className="flex-row items-center mb-2">
                <View
                  className="w-7 h-7 rounded-full items-center justify-center mr-2"
                  style={{ backgroundColor: `${x.iconColor}20` }}
                >
                  <Ionicons name={x.icon as any} size={16} color={x.iconColor} />
                </View>
                <View className='flex-1 min-w-0'>
                  <Text className="text-xs text-gray-600 font-medium"
                    numberOfLines={1}
                    ellipsizeMode="tail"
                    >
                    {x.label}
                  </Text>
                </View>
              </View>

              <Text className="text-lg font-bold text-black">
                ${Number(x.value).toLocaleString()}
              </Text>
              <Text className="text-[11px] text-gray-400 mt-0.5">Completed</Text>
            </View>
          ))}
        </View>

        {/* Net */}
        <View className="bg-white rounded-2xl p-5 items-center mb-5 border border-gray-100">
          <Text className="text-sm text-gray-400 mb-2">Net Earnings</Text>
          <Text
            className="text-3xl font-bold"
            style={{
              color: netEarnings >= 0 ? COLORS.success : COLORS.danger,
            }}
          >
            {netEarnings >= 0 ? '+' : '-'}$
            {Math.abs(netEarnings).toLocaleString()}
          </Text>
        </View>

        {/* Search */}
        <View className="flex-row items-center bg-white rounded-xl px-4 py-3 mb-4 border border-gray-100">
          <Ionicons name="search" size={18} color={COLORS.muted} />
          <TextInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search transactions..."
            placeholderTextColor={COLORS.muted}
            className="flex-1 ml-3 text-black"
          />
          {!!searchQuery && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={18} color={COLORS.muted} />
            </TouchableOpacity>
          )}
        </View>

        {/* Filters */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-4"
        >
          {(
            ['all', 'deposit', 'withdrawal', 'exchange', 'earning', 'staking'] as FilterType[]
          ).map((f) => {
            const active = filter === f;
            return (
              <TouchableOpacity
                key={f}
                onPress={() => setFilter(f)}
                activeOpacity={0.85}
                className="px-4 py-2 rounded-full mr-2 border"
                style={{
                  backgroundColor: active ? `${COLORS.accent}1A` : '#F3F4F6',
                  borderColor: active ? `${COLORS.accent}33` : '#E5E7EB',
                }}
              >
                <Text
                  className="text-sm font-semibold"
                  style={{ color: active ? COLORS.text : COLORS.muted }}
                >
                  {f.toUpperCase()}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* List */}
        <Text className="text-lg font-bold text-black mb-3">
          {sorted.length} Transactions
        </Text>

        {sorted.length ? (
          <FlatList
            data={sorted}
            renderItem={renderItem}
            keyExtractor={(i) => i.id}
            scrollEnabled={false}
          />
        ) : (
          <View className="items-center py-16">
            <Ionicons name="receipt-outline" size={64} color="#E5E5EA" />
            <Text className="text-base font-semibold text-gray-400 mt-4">
              No transactions found
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Details Modal */}
      <Modal transparent visible={showDetailsModal} animationType="fade">
        <View className="flex-1 bg-black/40 items-center justify-center px-5">
          <View className="bg-white rounded-2xl p-5 w-full max-h-[80%] border border-gray-100">
            <View className="flex-row justify-between mb-4 items-center">
              <Text className="text-lg font-bold text-black">
                Transaction Details
              </Text>
              <TouchableOpacity onPress={() => setShowDetailsModal(false)}>
                <Ionicons name="close" size={22} color={COLORS.text} />
              </TouchableOpacity>
            </View>

            {selectedTransaction && (
              <ScrollView showsVerticalScrollIndicator={false}>
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
                        <Text className="text-sm text-gray-400">{label}</Text>
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
