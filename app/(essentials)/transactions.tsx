import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// --- Types ---

type TransactionType = 'deposit' | 'withdrawal' | 'exchange' | 'earning' | 'mining' | 'staking';

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

// --- Mock Data ---

const mockTransactions: Transaction[] = [
  // Deposits
  {
    id: 'dep1',
    type: 'deposit',
    asset: 'Bitcoin',
    assetSymbol: 'BTC',
    amount: '0.005',
    amountUSD: '$225.00',
    status: 'completed',
    timestamp: '2023-10-27 10:30 AM',
    address: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    txHash: 'a1b2c3d4e5f6...',
    icon: '🟠'
  },
  {
    id: 'dep2',
    type: 'deposit',
    asset: 'Ethereum',
    assetSymbol: 'ETH',
    amount: '0.8',
    amountUSD: '$2,560.00',
    status: 'completed',
    timestamp: '2023-10-26 09:15 PM',
    address: '0x89205A3A3b2A69De6Dbf7f01ED13B2108B2c43e7',
    icon: '🟣'
  },
  {
    id: 'dep3',
    type: 'deposit',
    asset: 'Bitcoin',
    assetSymbol: 'BTC',
    amount: '0.021',
    amountUSD: '$945.00',
    status: 'pending',
    timestamp: '2023-10-26 05:00 PM',
    icon: '🟠'
  },

  // Withdrawals
  {
    id: 'wd1',
    type: 'withdrawal',
    asset: 'Bitcoin',
    assetSymbol: 'BTC',
    amount: '0.001',
    amountUSD: '$45.00',
    status: 'completed',
    timestamp: '2023-10-25 03:20 PM',
    address: 'bc1qwertyuiopasdfghjklzxcvbnm123456',
    txHash: 'x1y2z3...',
    icon: '🟠'
  },
  {
    id: 'wd2',
    type: 'withdrawal',
    asset: 'Ethereum',
    assetSymbol: 'ETH',
    amount: '0.5',
    amountUSD: '$1,600.00',
    status: 'processing',
    timestamp: '2023-10-24 11:45 AM',
    icon: '🟣'
  },
  {
    id: 'wd3',
    type: 'withdrawal',
    asset: 'USDT',
    assetSymbol: 'USDT',
    amount: '100.00',
    amountUSD: '$100.00',
    status: 'failed',
    timestamp: '2023-10-23 02:30 PM',
    address: 'TRX9cQiVWtPAGaG8tKxYRnkGfQmXk3m3Jf',
    icon: '💎'
  },

  // Exchanges
  {
    id: 'ex1',
    type: 'exchange',
    asset: 'Ethereum',
    assetSymbol: 'ETH',
    amount: '0.01406',
    amountUSD: '$45.00',
    status: 'completed',
    timestamp: '2023-10-22 04:15 PM',
    fromAsset: 'BTC',
    fromAmount: '0.001',
    toAsset: 'ETH',
    toAmount: '0.01406',
    description: 'BTC → ETH',
    icon: '🔄'
  },
  {
    id: 'ex2',
    type: 'exchange',
    asset: 'Solana',
    assetSymbol: 'SOL',
    amount: '8.89',
    amountUSD: '$1,600.00',
    status: 'processing',
    timestamp: '2023-10-21 09:30 AM',
    fromAsset: 'ETH',
    fromAmount: '0.5',
    toAsset: 'SOL',
    toAmount: '8.89',
    description: 'ETH → SOL',
    icon: '🔄'
  },
  {
    id: 'ex3',
    type: 'exchange',
    asset: 'Aleo',
    assetSymbol: 'ALEO',
    amount: '44.44',
    amountUSD: '$100.00',
    status: 'completed',
    timestamp: '2023-10-20 01:20 PM',
    fromAsset: 'USDT',
    fromAmount: '100.00',
    toAsset: 'ALEO',
    toAmount: '44.44',
    description: 'USDT → ALEO',
    icon: '🔄'
  },

  // Earnings (Mining Rewards)
  {
    id: 'earn1',
    type: 'earning',
    asset: 'Bitcoin',
    assetSymbol: 'BTC',
    amount: '0.000123',
    amountUSD: '$5.53',
    status: 'completed',
    timestamp: '2023-10-27 08:00 AM',
    description: 'Mining Reward - 24h',
    icon: '⛏️'
  },
  {
    id: 'earn2',
    type: 'earning',
    asset: 'Aleo',
    assetSymbol: 'ALEO',
    amount: '12.50',
    amountUSD: '$28.13',
    status: 'completed',
    timestamp: '2023-10-26 08:00 AM',
    description: 'Mining Reward - 24h',
    icon: '⛏️'
  },
  {
    id: 'earn3',
    type: 'earning',
    asset: 'Kaspa',
    assetSymbol: 'KAS',
    amount: '150.75',
    amountUSD: '$7.54',
    status: 'completed',
    timestamp: '2023-10-25 08:00 AM',
    description: 'Mining Reward - 24h',
    icon: '⛏️'
  },
  {
    id: 'earn4',
    type: 'earning',
    asset: 'Bitcoin',
    assetSymbol: 'BTC',
    amount: '0.000118',
    amountUSD: '$5.31',
    status: 'completed',
    timestamp: '2023-10-24 08:00 AM',
    description: 'Mining Reward - 24h',
    icon: '⛏️'
  },

  // Staking Rewards
  {
    id: 'stake1',
    type: 'staking',
    asset: 'Ethereum',
    assetSymbol: 'ETH',
    amount: '0.0025',
    amountUSD: '$8.00',
    status: 'completed',
    timestamp: '2023-10-27 12:00 PM',
    description: 'Staking Reward',
    icon: '⚡'
  },
  {
    id: 'stake2',
    type: 'staking',
    asset: 'Solana',
    assetSymbol: 'SOL',
    amount: '0.15',
    amountUSD: '$27.00',
    status: 'completed',
    timestamp: '2023-10-26 12:00 PM',
    description: 'Staking Reward',
    icon: '⚡'
  },

  // More transactions for scrolling
  {
    id: 'earn5',
    type: 'earning',
    asset: 'Aleo',
    assetSymbol: 'ALEO',
    amount: '11.80',
    amountUSD: '$26.55',
    status: 'completed',
    timestamp: '2023-10-23 08:00 AM',
    description: 'Mining Reward - 24h',
    icon: '⛏️'
  },
  {
    id: 'stake3',
    type: 'staking',
    asset: 'Ethereum',
    assetSymbol: 'ETH',
    amount: '0.0023',
    amountUSD: '$7.36',
    status: 'completed',
    timestamp: '2023-10-23 12:00 PM',
    description: 'Staking Reward',
    icon: '⚡'
  },
];

// --- Main Component ---

export default function TransactionsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Filter transactions based on current filter and search
  const filteredTransactions = transactions.filter(transaction => {
    const matchesFilter = filter === 'all' || transaction.type === filter;
    const matchesSearch = searchQuery === '' || 
      transaction.asset.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.assetSymbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      transaction.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // Sort by timestamp (newest first)
  const sortedTransactions = [...filteredTransactions].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  // Calculate totals
  const totals = {
    deposits: transactions.filter(t => t.type === 'deposit' && t.status === 'completed').reduce((sum, t) => sum + parseFloat(t.amountUSD.replace('$', '').replace(',', '')), 0),
    withdrawals: transactions.filter(t => t.type === 'withdrawal' && t.status === 'completed').reduce((sum, t) => sum + parseFloat(t.amountUSD.replace('$', '').replace(',', '')), 0),
    earnings: transactions.filter(t => (t.type === 'earning' || t.type === 'staking') && t.status === 'completed').reduce((sum, t) => sum + parseFloat(t.amountUSD.replace('$', '').replace(',', '')), 0),
  };

  const netEarnings = totals.earnings + totals.deposits - totals.withdrawals;

  const handleBackPress = () => {
    router.back();
  };

  const handleTransactionPress = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setShowDetailsModal(true);
  };

  const getStatusColor = (status: Transaction['status']) => {
    switch (status) {
      case 'completed': return '#34C759';
      case 'processing': return '#007AFF';
      case 'pending': return '#FF9500';
      case 'failed': return '#FF3B30';
      default: return '#8E8E93';
    }
  };

  const getStatusBackground = (status: Transaction['status']) => {
    switch (status) {
      case 'completed': return '#E8F5E9';
      case 'processing': return '#E3F2FD';
      case 'pending': return '#FFF8E1';
      case 'failed': return '#FFEBEE';
      default: return '#F2F2F7';
    }
  };

  const getTypeColor = (type: TransactionType) => {
    switch (type) {
      case 'deposit': return '#34C759';
      case 'withdrawal': return '#FF3B30';
      case 'exchange': return '#007AFF';
      case 'earning': return '#FF9500';
      case 'mining': return '#FF9500';
      case 'staking': return '#5856D6';
      default: return '#8E8E93';
    }
  };

  const getTypeIcon = (type: TransactionType) => {
    switch (type) {
      case 'deposit': return 'arrow-down-circle';
      case 'withdrawal': return 'arrow-up-circle';
      case 'exchange': return 'swap-horizontal';
      case 'earning': return 'trending-up';
      case 'mining': return 'hammer';
      case 'staking': return 'flash';
      default: return 'help-circle';
    }
  };

  const renderTransactionItem = ({ item }: { item: Transaction }) => {
    const isPositive = item.type === 'deposit' || item.type === 'earning' || item.type === 'staking' || item.type === 'mining';
    
    return (
      <TouchableOpacity 
        style={styles.transactionItem}
        onPress={() => handleTransactionPress(item)}
      >
        <View style={styles.transactionLeft}>
          <View style={[styles.transactionIcon, { backgroundColor: getTypeBackground(item.type) }]}>
            {item.type === 'exchange' ? (
              <Text style={styles.exchangeIcon}>🔄</Text>
            ) : (
              <Ionicons 
                name={getTypeIcon(item.type)} 
                size={20} 
                color={getTypeColor(item.type)} 
              />
            )}
          </View>
          
          <View style={styles.transactionInfo}>
            <Text style={styles.transactionAsset}>
              {item.type === 'exchange' && item.description ? item.description : item.asset}
            </Text>
            <Text style={styles.transactionTimestamp}>{item.timestamp}</Text>
            {item.description && item.type !== 'exchange' && (
              <Text style={styles.transactionDescription}>{item.description}</Text>
            )}
          </View>
        </View>

        <View style={styles.transactionRight}>
          <View style={styles.amountContainer}>
            <Text style={[
              styles.transactionAmount,
              { color: isPositive ? '#34C759' : '#FF3B30' }
            ]}>
              {isPositive ? '+' : '-'} {item.amount} {item.assetSymbol}
            </Text>
            <Text style={styles.transactionAmountUSD}>{item.amountUSD}</Text>
          </View>
          
          <View style={[
            styles.statusBadge,
            { backgroundColor: getStatusBackground(item.status) }
          ]}>
            <Text style={[
              styles.statusText,
              { color: getStatusColor(item.status) }
            ]}>
              {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const getTypeBackground = (type: TransactionType) => {
    switch (type) {
      case 'deposit': return '#E8F5E9';
      case 'withdrawal': return '#FFEBEE';
      case 'exchange': return '#E3F2FD';
      case 'earning': return '#FFF8E1';
      case 'mining': return '#FFF8E1';
      case 'staking': return '#F3E5F5';
      default: return '#F2F2F7';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Transactions</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Summary Cards */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Deposits</Text>
            <Text style={styles.summaryValue}>${totals.deposits.toLocaleString()}</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Withdrawals</Text>
            <Text style={[styles.summaryValue, { color: '#FF3B30' }]}>
              -${totals.withdrawals.toLocaleString()}
            </Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryLabel}>Total Earnings</Text>
            <Text style={[styles.summaryValue, { color: '#34C759' }]}>
              +${totals.earnings.toLocaleString()}
            </Text>
          </View>
        </View>

        {/* Net Earnings */}
        <View style={styles.netEarningsCard}>
          <Text style={styles.netEarningsLabel}>Net Earnings</Text>
          <Text style={[
            styles.netEarningsValue,
            { color: netEarnings >= 0 ? '#34C759' : '#FF3B30' }
          ]}>
            {netEarnings >= 0 ? '+' : ''}${netEarnings.toLocaleString()}
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search" size={20} color="#8E8E93" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search transactions..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#8E8E93"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color="#8E8E93" />
            </TouchableOpacity>
          )}
        </View>

        {/* Filter Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterContainer}>
          {(['all', 'deposit', 'withdrawal', 'exchange', 'earning', 'staking'] as FilterType[]).map((filterType) => (
            <TouchableOpacity
              key={filterType}
              style={[
                styles.filterButton,
                filter === filterType && styles.filterButtonActive
              ]}
              onPress={() => setFilter(filterType)}
            >
              <Text style={[
                styles.filterButtonText,
                filter === filterType && styles.filterButtonTextActive
              ]}>
                {filterType.charAt(0).toUpperCase() + filterType.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Transactions List */}
        <View style={styles.transactionsList}>
          <Text style={styles.listTitle}>
            {filter === 'all' ? 'All Transactions' : `${filter.charAt(0).toUpperCase() + filter.slice(1)}s`}
            <Text style={styles.listCount}></Text> ({sortedTransactions.length})
          </Text>
          
          {sortedTransactions.length > 0 ? (
            <FlatList
              data={sortedTransactions}
              keyExtractor={(item) => item.id}
              renderItem={renderTransactionItem}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Ionicons name="receipt-outline" size={64} color="#E9ECEF" />
              <Text style={styles.emptyStateText}>No transactions found</Text>
              <Text style={styles.emptyStateSubtext}>
                {searchQuery ? 'Try adjusting your search' : `No ${filter} transactions yet`}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Transaction Details Modal */}
      <Modal
        visible={showDetailsModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {selectedTransaction && (
              <>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Transaction Details</Text>
                  <TouchableOpacity onPress={() => setShowDetailsModal(false)}>
                    <Ionicons name="close" size={24} color="#000" />
                  </TouchableOpacity>
                </View>

                <View style={styles.detailsSection}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Type</Text>
                    <View style={[
                      styles.typeBadge,
                      { backgroundColor: getTypeBackground(selectedTransaction.type) }
                    ]}>
                      <Ionicons 
                        name={getTypeIcon(selectedTransaction.type)} 
                        size={16} 
                        color={getTypeColor(selectedTransaction.type)} 
                        style={styles.typeIcon}
                      />
                      <Text style={[
                        styles.typeText,
                        { color: getTypeColor(selectedTransaction.type) }
                      ]}>
                        {selectedTransaction.type.charAt(0).toUpperCase() + selectedTransaction.type.slice(1)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Amount</Text>
                    <View style={styles.amountDetail}>
                      <Text style={styles.detailValue}>
                        {selectedTransaction.amount} {selectedTransaction.assetSymbol}
                      </Text>
                      <Text style={styles.detailSubtext}>{selectedTransaction.amountUSD}</Text>
                    </View>
                  </View>

                  {selectedTransaction.fromAsset && selectedTransaction.toAsset && (
                    <>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>From</Text>
                        <Text style={styles.detailValue}>
                          {selectedTransaction.fromAmount} {selectedTransaction.fromAsset}
                        </Text>
                      </View>
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>To</Text>
                        <Text style={styles.detailValue}>
                          {selectedTransaction.toAmount} {selectedTransaction.toAsset}
                        </Text>
                      </View>
                    </>
                  )}

                  {selectedTransaction.description && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Description</Text>
                      <Text style={styles.detailValue}>{selectedTransaction.description}</Text>
                    </View>
                  )}

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Status</Text>
                    <View style={[
                      styles.statusBadgeLarge,
                      { backgroundColor: getStatusBackground(selectedTransaction.status) }
                    ]}>
                      <Text style={[
                        styles.statusTextLarge,
                        { color: getStatusColor(selectedTransaction.status) }
                      ]}>
                        {selectedTransaction.status.charAt(0).toUpperCase() + selectedTransaction.status.slice(1)}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Date & Time</Text>
                    <Text style={styles.detailValue}>{selectedTransaction.timestamp}</Text>
                  </View>

                  {selectedTransaction.address && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Address</Text>
                      <Text style={styles.addressText}>{selectedTransaction.address}</Text>
                    </View>
                  )}

                  {selectedTransaction.txHash && (
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Transaction Hash</Text>
                      <Text style={styles.txHashText}>{selectedTransaction.txHash}</Text>
                    </View>
                  )}
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  backButton: {
    padding: 4,
    marginEnd: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  summaryLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
  },
  netEarningsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    alignItems: 'center',
  },
  netEarningsLabel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 8,
  },
  netEarningsValue: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#E9ECEF',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#007AFF',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#8E8E93',
  },
  filterButtonTextActive: {
    color: '#FFFFFF',
  },
  transactionsList: {
    flex: 1,
    marginBottom: 30,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  listCount: {
    color: '#8E8E93',
    fontWeight: 'normal',
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  exchangeIcon: {
    fontSize: 20,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionAsset: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  transactionTimestamp: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  transactionDescription: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  amountContainer: {
    alignItems: 'flex-end',
    marginBottom: 4,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
  },
  transactionAmountUSD: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 4,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  detailsSection: {
    flex: 1,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: '#8E8E93',
    flex: 1,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
    textAlign: 'right',
    flex: 1,
  },
  detailSubtext: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'right',
    marginTop: 2,
  },
  amountDetail: {
    alignItems: 'flex-end',
    flex: 1,
  },
  typeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  typeIcon: {
    marginRight: 4,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadgeLarge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusTextLarge: {
    fontSize: 12,
    fontWeight: '600',
  },
  addressText: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'right',
    flex: 1,
  },
  txHashText: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'right',
    flex: 1,
  },
});