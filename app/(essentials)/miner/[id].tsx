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

// --- Mock Data & Types (copied for this screen) ---

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

// In a real app, this would come from a shared file or API
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
  // ... add all other miners from your original data here
];

// Type for the new income history data
type IncomeEntry = {
  id: string;
  period: string;
  hashrate: string;
  income: string;
};

// Mock data for income history
const mockIncomeHistory: IncomeEntry[] = [
  { id: 'h1', period: 'Last Hour', hashrate: '14.95 TH/s', income: '$0.005' },
  { id: 'h2', period: 'Last 24 Hours', hashrate: '15.02 TH/s', income: '$0.12' },
  { id: 'h3', period: 'Last 7 Days', hashrate: '14.99 TH/s', income: '$0.84' },
  { id: 'h4', period: 'Last 30 Days', hashrate: '15.05 TH/s', income: '$3.60' },
];

// --- Main Component ---

export default function MinerInfoScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  

    // --- ADD THESE DEBUGGING LINES ---
  console.log('ID from URL:', id); // Log the ID from the URL
  console.log('Type of ID from URL:', typeof id); // Log its type
  // ---------------------------------

  // Find the specific miner data based on the ID from the URL
  const miner = MINERS_DATA.find((m) => m.id === id);

    // --- ADD THIS DEBUGGING LINE ---
  console.log('Found Miner:', miner); // Log the result of the find operation
  // ---------------------------------


  const handleBackPress = () => {
    router.back();
  };

  // Helper to get status style
  const getStatusStyle = (status: MinerStatus) => {
    switch (status) {
      case 'running': return styles.statusRunning;
      case 'stopped': return styles.statusStopped;
      case 'restarting': return styles.statusRestarting;
      case 'broken': return styles.statusBroken;
      default: return styles.statusRunning;
    }
  };

  // Render item for the income history list
  const renderIncomeItem = ({ item }: { item: IncomeEntry }) => (
    <View style={styles.incomeItem}>
      <Text style={styles.incomePeriod}>{item.period}</Text>
      <View style={styles.incomeDetails}>
        <Text style={styles.incomeHashrate}>{item.hashrate}</Text>
        <Text style={styles.incomeAmount}>{item.income}</Text>
      </View>
    </View>
  );

  // If miner is not found, show a message
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
        <Text style={styles.headerTitle}>{miner.name}</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Miner Details Card */}
        <View style={styles.detailsCard}>
          <View style={styles.minerHeader}>
            <View style={styles.minerInfo}>
              <View style={styles.minerImageContainer}>
                <Text style={styles.minerImage}>{miner.image}</Text>
              </View>
              <View style={styles.minerDetails}>
                <Text style={styles.minerName}>{miner.name}</Text>
                <Text style={styles.minerModel}>{miner.model}</Text>
                <Text style={styles.minerId}>{miner.minerId}</Text>
              </View>
            </View>
            <View style={[styles.statusBadge, getStatusStyle(miner.status)]}>
              <Text style={styles.statusText}>{miner.status}</Text>
            </View>
          </View>

          <View style={styles.detailsGrid}>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Hash Rate</Text>
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
              <Text style={styles.detailLabel}>Energy Fee</Text>
              <Text style={styles.detailValue}>{miner.energyFee} USD/kWh</Text>
            </View>
            <View style={styles.detailItem}>
              <Text style={styles.detailLabel}>Last Share</Text>
              <Text style={styles.detailValue}>{miner.lastShare}</Text>
            </View>
          </View>
        </View>

        {/* Income History Section */}
        <View style={styles.incomeCard}>
          <Text style={styles.incomeTitle}>Mining Income History</Text>
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    padding: 4,
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: 18,
    color: '#6B7280',
  },
  detailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderColor: '#FFC000',
    borderWidth: 1,
  },
  minerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  minerInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  minerImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  minerImage: {
    fontSize: 28,
  },
  minerDetails: {
    flex: 1,
  },
  minerName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  minerModel: {
    fontSize: 16,
    color: '#6B7280',
    marginBottom: 4,
  },
  minerId: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  statusRunning: {
    backgroundColor: '#34C759',
  },
  statusStopped: {
    backgroundColor: '#FF9500',
  },
  statusRestarting: {
    backgroundColor: '#007AFF',
  },
  statusBroken: {
    backgroundColor: '#FF3B30',
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
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
  incomeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  incomeTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
  },
  incomeItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  incomePeriod: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
  },
  incomeDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  incomeHashrate: {
    fontSize: 14,
    color: '#6B7280',
    marginRight: 16,
  },
  incomeAmount: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFC000',
  },
});