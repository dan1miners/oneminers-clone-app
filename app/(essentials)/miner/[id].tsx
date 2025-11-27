import React from 'react';
import {
  View,
  Text,
  StyleSheet,
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

  const getStatusStyle = (status: MinerStatus) => {
    switch (status) {
      case 'running': return styles.statusRunning;
      case 'stopped': return styles.statusStopped;
      case 'restarting': return styles.statusRestarting;
      case 'broken': return styles.statusBroken;
      default: return styles.statusRunning;
    }
  };

  const renderIncomeItem = ({ item }: { item: IncomeEntry }) => (
    <View style={styles.incomeItem}>
      <View style={styles.incomeDot} />
      <View style={styles.incomeContent}>
        <Text style={styles.incomePeriod}>{item.period}</Text>
        <Text style={styles.incomeDetails}>{item.hashrate} • {item.income}</Text>
      </View>
    </View>
  );

  if (!miner) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#000" />
          </TouchableOpacity>
        </View>
        <View style={styles.notFoundContainer}>
          <Text style={styles.notFoundText}>Miner not found.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* 1. Product Image Section */}
        <View style={styles.productImageSection}>
          <View style={styles.productImageContainer}>
            <Text style={styles.productImage}>{miner.image}</Text>
          </View>
        </View>

        {/* 2. Miner Details Section */}
        <View style={styles.detailsSection}>
          <View style={styles.detailsHeader}>
            <Text style={styles.minerNameLarge}>{miner.name}</Text>
            <View style={[styles.statusBadge, getStatusStyle(miner.status)]}>
              <Text style={styles.statusText}>{miner.status.toUpperCase()}</Text>
            </View>
          </View>
          <Text style={styles.minerModelLarge}>{miner.model}</Text>

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Hashrate</Text>
              <Text style={styles.detailValue}>{miner.hashrate} {miner.hashrateUnit}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Daily Profit</Text>
              <Text style={[styles.detailValue, miner.dailyProfit === '0.00' && styles.zeroProfit]}>
                ${miner.dailyProfit}
              </Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Uptime</Text>
              <Text style={styles.detailValue}>{miner.uptime}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Temperature</Text>
              <Text style={styles.detailValue}>{miner.temperature}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Location</Text>
              <Text style={styles.detailValue}>{miner.location}</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Energy Fee</Text>
              <Text style={styles.detailValue}>{miner.energyFee} USD/kWh</Text>
            </View>
          </View>
        </View>

        {/* 3. Income History Section */}
        <View style={styles.historySection}>
          <Text style={styles.historyTitle}>Mining Income History</Text>
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

// --- Styles ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start', // Align to the left
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  // --- Product Image Section ---
  productImageSection: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 24,
    alignItems: 'center',
    borderBottomWidth: 4,
    borderBottomColor: '#FFC000', // Yellow accent border
  },
  productImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  productImage: {
    fontSize: 60,
  },
  // --- Details Section ---
  detailsSection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: 2, // Small gap to connect with image section
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  minerNameLarge: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusRunning: { backgroundColor: '#34C759' },
  statusStopped: { backgroundColor: '#FF9500' },
  statusRestarting: { backgroundColor: '#007AFF' },
  statusBroken: { backgroundColor: '#FF3B30' },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  minerModelLarge: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 20,
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  detailItem: {
    width: '48%', // Two items per row
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  zeroProfit: {
    color: '#6B7280',
  },
  // --- History Section ---
  historySection: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    marginTop: 16,
    borderRadius: 16,
  },
  historyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
  },
  incomeItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    position: 'relative',
    paddingLeft: 20,
  },
  incomeDot: {
    position: 'absolute',
    left: 0,
    top: 6,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FFC000',
  },
  incomeContent: {
    flex: 1,
  },
  incomePeriod: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  incomeDetails: {
    fontSize: 14,
    color: '#6B7280',
  },
  // --- Fallback Styles ---
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: 18,
    color: '#6B7280',
  },
  
});