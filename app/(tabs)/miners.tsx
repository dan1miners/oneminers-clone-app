import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';

const { width } = Dimensions.get('window');

// Types
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
  {
    id: '2',
    name: 'Antminer S19',
    model: 'S19 Pro - 110 TH/s',
    minerId: '#1018',
    hashrate: '110.00',
    hashrateUnit: 'TH/s',
    status: 'running',
    location: 'Germany',
    energyFee: '0.072',
    dailyProfit: '0.89',
    expectedPerformance: '110.00 TH/s',
    lastShare: '30 minutes ago',
    image: '🔧',
    uptime: '99.5%',
    temperature: '72°C',
  },
  {
    id: '3',
    name: 'WhatsMiner M50',
    model: 'M50 - 118 TH/s',
    minerId: '#1019',
    hashrate: '118.00',
    hashrateUnit: 'TH/s',
    status: 'stopped',
    location: 'Canada',
    energyFee: '0.068',
    dailyProfit: '0.00',
    expectedPerformance: '118.00 TH/s',
    lastShare: '5 hours ago',
    image: '⛏️',
    uptime: '95.2%',
    temperature: '65°C',
  },
  {
    id: '4',
    name: 'Avalon A1246',
    model: 'A1246 - 90 TH/s',
    minerId: '#1020',
    hashrate: '90.00',
    hashrateUnit: 'TH/s',
    status: 'broken',
    location: 'USA',
    energyFee: '0.061',
    dailyProfit: '0.00',
    expectedPerformance: '90.00 TH/s',
    lastShare: '2 days ago',
    image: '🔨',
    uptime: '98.1%',
    temperature: '70°C',
  },
  {
    id: '5',
    name: 'Bitmain S21',
    model: 'S21 - 200 TH/s',
    minerId: '#1021',
    hashrate: '200.00',
    hashrateUnit: 'TH/s',
    status: 'restarting',
    location: 'Singapore',
    energyFee: '0.058',
    dailyProfit: '1.45',
    expectedPerformance: '200.00 TH/s',
    lastShare: '45 minutes ago',
    image: '💎',
    uptime: '97.8%',
    temperature: '75°C',
  },
];

const OVERVIEW_DATA = {
  totalHashrate: '533.05',
  totalHashrateUnit: 'TH/s',
  totalDailyProfit: '$2.58',
  active: 23,
  stopped: 3,
  restarting: 2,
  broken: 1,
  totalMiners: 29,
};

export default function MinersScreen() {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | MinerStatus>('all');
  const [showSearchBar, setShowSearchBar] = useState<boolean>(false);
  const [searchBarAnim] = useState(new Animated.Value(0));

  const filteredMiners = MINERS_DATA.filter((miner) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      miner.name.toLowerCase().includes(q) ||
      miner.minerId.toLowerCase().includes(q);
    const matchesFilter =
      selectedFilter === 'all' || miner.status === selectedFilter;
    return matchesSearch && matchesFilter;
  });

  const handleSearchPress = () => {
    if (showSearchBar) {
      setSearchQuery('');
      Animated.timing(searchBarAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setShowSearchBar(false));
    } else {
      setShowSearchBar(true);
      Animated.timing(searchBarAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleMinerPress = (miner: Miner) => {
    console.log('Navigate to miner detail:', miner.id);
    router.push(`/(essentials)/miner/${miner.id}`);
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

  const searchBarWidth = searchBarAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width - 80],
  });

  const renderMinerItem = ({ item }: { item: Miner }) => (
    <TouchableOpacity
      style={styles.minerCard}
      onPress={() => handleMinerPress(item)}
    >
      <View style={styles.minerHeader}>
        <View style={styles.minerInfo}>
          <View style={styles.minerImageContainer}>
            <Text style={styles.minerImage}>{item.image}</Text>
          </View>
          <View style={styles.minerDetails}>
            <Text style={styles.minerName}>{item.name}</Text>
            <Text style={styles.minerModel}>{item.model}</Text>
          </View>
        </View>
        <View style={[styles.statusBadge, getStatusStyle(item.status)]}>
          <Text style={styles.statusText}>{item.status}</Text>
        </View>
      </View>

      <View style={styles.minerStats}>
        <View style={styles.statRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Hash Rate</Text>
            <Text style={styles.statValue}>
              {item.hashrate} {item.hashrateUnit}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Daily Profit</Text>
            <Text style={[
              styles.statValue,
              item.dailyProfit === '0.00' && styles.zeroProfit
            ]}>
              ${item.dailyProfit}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Uptime</Text>
            <Text style={styles.statValue}>{item.uptime}</Text>
          </View>
        </View>
      </View>

      <View style={styles.minerFooter}>
        <View style={styles.location}>
          <Ionicons name="location-outline" size={12} color="#6B7280" />
          <Text style={styles.locationText}>{item.location}</Text>
        </View>
        <View style={styles.energyFee}>
          <Ionicons name="flash-outline" size={12} color="#6B7280" />
          <Text style={styles.energyFeeText}>{item.energyFee} USD/kWh</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header with inline search bar */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <Animated.View style={[styles.searchBarContainer, { width: searchBarWidth }]}>
            {showSearchBar && (
              <View style={styles.searchBarContent}>
                <View style={styles.searchInputContainer}>
                  <Ionicons name="search-outline" size={20} color="#6B7280" />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search miners..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholderTextColor="#6B7280"
                    autoFocus={true}
                  />
                  <TouchableOpacity onPress={handleSearchPress}>
                    <Ionicons name="close-outline" size={24} color="#6B7280" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Animated.View>

          <View style={styles.headerActions}>
            {!showSearchBar && (
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={handleSearchPress}
              >
                <Ionicons name="search-outline" size={20} color="#000" />
              </TouchableOpacity>
            )}
            <Link href="/shop" asChild>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="add-outline" size={20} color="#000" />
            </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* --- SIMPLIFIED OVERVIEW SECTION --- */}
        
        {/* Card 1: Primary Metrics */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Mining Overview</Text>
          <View style={styles.metricsRow}>
            <View style={styles.metricItem}>
              <Text style={styles.metricValue}>{OVERVIEW_DATA.totalHashrate}</Text>
              <Text style={styles.metricUnit}>{OVERVIEW_DATA.totalHashrateUnit}</Text>
            </View>
            <View style={styles.profitChip}>
              <Text style={styles.profitChipText}>{OVERVIEW_DATA.totalDailyProfit} / day</Text>
            </View>
          </View>
        </View>

        {/* Card 2: Status Summary */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Miner Status</Text>
          <View style={styles.statusGrid}>
            {[
              { label: 'Active', value: OVERVIEW_DATA.active, color: '#34C759' },
              { label: 'Stopped', value: OVERVIEW_DATA.stopped, color: '#FF9500' },
              { label: 'Restarting', value: OVERVIEW_DATA.restarting, color: '#007AFF' },
              { label: 'Broken', value: OVERVIEW_DATA.broken, color: '#FF3B30' },
            ].map((item) => (
              <View key={item.label} style={styles.statusGridItem}>
                <View style={[styles.statusDot, { backgroundColor: item.color }]} />
                <Text style={styles.statusGridLabel}>{item.label}</Text>
                <Text style={styles.statusGridValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* --- END OF OVERVIEW SECTION --- */}

        {/* Filter Options */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          {['all', 'running', 'stopped', 'restarting', 'broken'].map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                selectedFilter === filter && styles.filterButtonActive,
              ]}
              onPress={() => setSelectedFilter(filter as MinerStatus | 'all')}
            >
              <Text style={[
                styles.filterButtonText,
                selectedFilter === filter && styles.filterButtonTextActive,
              ]}>
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Miners List */}
        <View style={styles.minersSection}>
          <Text style={styles.sectionTitle}>
            {filteredMiners.length} Miner{filteredMiners.length !== 1 ? 's' : ''}
          </Text>

          <FlatList
            data={filteredMiners}
            renderItem={renderMinerItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.minersList}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// --- STYLES ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    height: 60,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  searchBarContainer: {
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
    marginRight: 12,
    borderRadius: 12,
  },
  searchBarContent: {
    flex: 1,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 40,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    marginRight: 8,
    fontSize: 16,
    color: '#000000',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  // --- New Simplified Card Styles ---
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderColor: '#FFC000',
    borderWidth: 1,  
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  metricItem: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  metricValue: {
    fontSize: 36,
    fontWeight: '800',
    color: '#000000',
    lineHeight: 42,
  },
  metricUnit: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 4,
  },
  profitChip: {
    backgroundColor: '#FFC000',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  profitChipText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#000000',
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  statusGridItem: {
    width: '48%', // Two items per row
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  statusGridLabel: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
  },
  statusGridValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginLeft: 8,
  },
  // --- Filter Styles ---
  filterContainer: {
    marginBottom: 16,
  },
  filterContent: {
    paddingRight: 16,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB'
  },
  filterButtonActive: {
    backgroundColor: '#FFC000',
    borderColor: '#FFC000',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterButtonTextActive: {
    color: '#000000',
  },
  // --- Miners List Styles ---
  minersSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 12,
  },
  minersList: {
    gap: 12,
    paddingBottom: 16,
  },
  minerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
  },
  minerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  minerInfo: {
    flexDirection: 'row',
    flex: 1,
  },
  minerImageContainer: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  minerImage: {
    fontSize: 18,
  },
  minerDetails: {
    flex: 1,
  },
  minerName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 2,
  },
  minerModel: {
    fontSize: 14,
    color: '#6B7280',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
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
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  minerStats: {
    marginBottom: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  zeroProfit: {
    color: '#6B7280',
  },
  minerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#6B7280',
  },
  energyFee: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  energyFeeText: {
    fontSize: 12,
    color: '#6B7280',
  },
});