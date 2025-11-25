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

const { width } = Dimensions.get('window');

// Types
type MinerStatus = 'running' | 'stopped' | 'restarting' | 'broken';
type MinerHealth = 'healthy' | 'maintenance' | 'warning';

type Miner = {
  id: string;
  name: string;
  model: string;
  minerId: string;
  hashrate: string;
  hashrateUnit: string;
  status: MinerStatus;
  health: MinerHealth;
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
    health: 'healthy',
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
    health: 'healthy',
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
    health: 'maintenance',
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
    health: 'warning',
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
    health: 'maintenance',
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
      // Hide search bar and clear search
      setSearchQuery('');
      Animated.timing(searchBarAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => setShowSearchBar(false));
    } else {
      // Show search bar
      setShowSearchBar(true);
      Animated.timing(searchBarAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  };

  const handleMinerPress = (miner: Miner) => {
    // Navigate to miner detail screen
    console.log('Navigate to miner detail:', miner.id);
    // navigation.navigate('MinerDetail', { minerId: miner.id });
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
    outputRange: [0, width - 80], // Full width minus button space
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
            <Text style={styles.minerId}>{item.minerId}</Text>
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
          <Ionicons name="location-outline" size={12} color="#8E8E93" />
          <Text style={styles.locationText}>{item.location}</Text>
        </View>
        <View style={styles.energyFee}>
          <Ionicons name="flash-outline" size={12} color="#8E8E93" />
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
          {/* Animated Search Bar */}
          <Animated.View style={[styles.searchBarContainer, { width: searchBarWidth }]}>
            {showSearchBar && (
              <View style={styles.searchBarContent}>
                <View style={styles.searchInputContainer}>
                  <Ionicons name="search-outline" size={20} color="#8E8E93" />
                  <TextInput
                    style={styles.searchInput}
                    placeholder="Search miners..."
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                    placeholderTextColor="#8E8E93"
                    autoFocus={true}
                  />
                  <TouchableOpacity onPress={handleSearchPress}>
                    <Ionicons name="close-outline" size={24} color="#8E8E93" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Animated.View>

          {/* Header Actions - Only Add button when search is not active */}
          <View style={styles.headerActions}>
            {!showSearchBar && (
              <TouchableOpacity 
                style={styles.headerButton}
                onPress={handleSearchPress}
              >
                <Ionicons name="search-outline" size={20} color="#000" />
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="add-outline" size={20} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Overview Section */}
        <View style={styles.overviewCard}>
          <View style={styles.overviewHeaderRow}>
            <View style={styles.overviewHeaderText}>
              <Text style={styles.overviewLabel}>Cluster overview</Text>
              <Text style={styles.overviewTitle}>Mining overview</Text>
            </View>
            <View style={styles.overviewBadge}>
              <View style={styles.overviewBadgeDot} />
              <Text style={styles.overviewBadgeText}>Stable</Text>
            </View>
          </View>

          <View style={styles.overviewMainRow}>
            {/* Left side: primary metric */}
            <View style={styles.overviewPrimaryMetric}>
              <Text style={styles.overviewMetricLabel}>Total hashrate</Text>
              <View style={styles.overviewMetricRow}>
                <Text style={styles.overviewMetricValue}>
                  {OVERVIEW_DATA.totalHashrate}
                </Text>
                <Text style={styles.overviewMetricUnit}>
                  {OVERVIEW_DATA.totalHashrateUnit}
                </Text>
              </View>

              <View style={styles.overviewChipRow}>
                <View style={styles.overviewChip}>
                  <Ionicons name="flash-outline" size={14} color="#000000" />
                  <Text style={styles.overviewChipText}>
                    {OVERVIEW_DATA.totalDailyProfit} / day
                  </Text>
                </View>
                <Text style={styles.overviewSecondaryText} numberOfLines={1}>
                  {OVERVIEW_DATA.totalMiners} miners total
                </Text>
              </View>
            </View>

            {/* Right side: status breakdown */}
            <View style={styles.overviewStatusColumn}>
              {[
                { label: 'Active', value: OVERVIEW_DATA.active, color: '#34C759' },
                { label: 'Restarting', value: OVERVIEW_DATA.restarting, color: '#007AFF' },
                { label: 'Stopped', value: OVERVIEW_DATA.stopped, color: '#FF9500' },
                { label: 'Broken', value: OVERVIEW_DATA.broken, color: '#FF3B30' },
              ].map((item) => (
                <View key={item.label} style={styles.overviewStatusRow}>
                  <View
                    style={[
                      styles.overviewStatusDot,
                      { backgroundColor: item.color },
                    ]}
                  />
                  <Text style={styles.overviewStatusLabel}>{item.label}</Text>
                  <Text style={styles.overviewStatusValue}>{item.value}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.overviewFooterRow}>
            <View style={styles.overviewProgressTrack}>
              <View
                style={[
                  styles.overviewProgressFill,
                  {
                    width: `${(OVERVIEW_DATA.active / OVERVIEW_DATA.totalMiners) * 100}%`,
                  },
                ]}
              />
            </View>
            <Text style={styles.overviewFooterText} numberOfLines={1}>
              {OVERVIEW_DATA.active} / {OVERVIEW_DATA.totalMiners} miners online
            </Text>
          </View>
        </View>

        {/* Filter Options */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterContainer}
          contentContainerStyle={styles.filterContent}
        >
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === 'all' && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedFilter('all')}
          >
            <Text style={[
              styles.filterButtonText,
              selectedFilter === 'all' && styles.filterButtonTextActive,
            ]}>
              All Miners
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === 'running' && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedFilter('running')}
          >
            <Text style={[
              styles.filterButtonText,
              selectedFilter === 'running' && styles.filterButtonTextActive,
            ]}>
              Running
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === 'stopped' && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedFilter('stopped')}
          >
            <Text style={[
              styles.filterButtonText,
              selectedFilter === 'stopped' && styles.filterButtonTextActive,
            ]}>
              Stopped
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === 'restarting' && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedFilter('restarting')}
          >
            <Text style={[
              styles.filterButtonText,
              selectedFilter === 'restarting' && styles.filterButtonTextActive,
            ]}>
              Restarting
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.filterButton,
              selectedFilter === 'broken' && styles.filterButtonActive,
            ]}
            onPress={() => setSelectedFilter('broken')}
          >
            <Text style={[
              styles.filterButtonText,
              selectedFilter === 'broken' && styles.filterButtonTextActive,
            ]}>
              Broken
            </Text>
          </TouchableOpacity>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
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
    backgroundColor: '#FFC000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Inline Search Bar
  searchBarContainer: {
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  searchBarContent: {
    flex: 1,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
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
  // Overview Section
  overviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#F2F2F7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  overviewHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  overviewHeaderText: {
    flex: 1,
    marginRight: 12,
  },
  overviewLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  overviewTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginTop: 2,
  },
  overviewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: '#E5F9E7',
    flexShrink: 0,
  },
  overviewBadgeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34C759',
    marginRight: 6,
  },
  overviewBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#166534',
  },
  overviewMainRow: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  overviewPrimaryMetric: {
    flex: 1,
    paddingRight: 16,
    minWidth: 0,
  },
  overviewMetricLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginBottom: 4,
  },
  overviewMetricRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
  },
  overviewMetricValue: {
    fontSize: 30,
    fontWeight: '800',
    color: '#000000',
    marginRight: 6,
    lineHeight: 36,
  },
  overviewMetricUnit: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    lineHeight: 20,
  },
  overviewChipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    flexWrap: 'wrap',
  },
  overviewChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFC00033',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    marginRight: 10,
    marginBottom: 4,
    flexShrink: 0,
  },
  overviewChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#000000',
    marginLeft: 4,
  },
  overviewSecondaryText: {
    fontSize: 12,
    color: '#6B7280',
    flexShrink: 1,
    minWidth: 0,
  },
  overviewStatusColumn: {
    width: 110,
    flexShrink: 0,
  },
  overviewStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  overviewStatusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 8,
    flexShrink: 0,
  },
  overviewStatusLabel: {
    fontSize: 12,
    color: '#4B5563',
    flex: 1,
    marginRight: 4,
    minWidth: 0,
  },
  overviewStatusValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    flexShrink: 0,
  },
  overviewFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  overviewProgressTrack: {
    flex: 1,
    height: 6,
    borderRadius: 999,
    backgroundColor: '#F3F4F6',
    overflow: 'hidden',
    marginRight: 12,
    minWidth: 0,
  },
  overviewProgressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#FFC000',
  },
  overviewFooterText: {
    fontSize: 12,
    color: '#6B7280',
    flexShrink: 0,
    minWidth: 0,
  },
  // Filter Options
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
    backgroundColor: '#F2F2F7',
    marginRight: 8,
  },
  filterButtonActive: {
    backgroundColor: '#FFC000',
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
  },
  filterButtonTextActive: {
    color: '#000000',
  },
  // Miners Section
  minersSection: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 12,
  },
  minersList: {
    gap: 12,
  },
  // Miner Card
  minerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
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
    backgroundColor: '#F2F2F7',
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
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 2,
  },
  minerModel: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 2,
  },
  minerId: {
    fontSize: 12,
    color: '#8E8E93',
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
    color: '#8E8E93',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  zeroProfit: {
    color: '#8E8E93',
  },
  minerFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  location: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  energyFee: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  energyFeeText: {
    fontSize: 12,
    color: '#8E8E93',
  },
});