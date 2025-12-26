import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
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
import AnimatedStatusDot from '../components/m_overview';
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

  const glowScaleAnim = useRef(new Animated.Value(1.0)).current;

  useEffect(() => {
    // Create a looping pulsing animation for the glow
    Animated.loop(
      Animated.sequence([
        // Animate to a larger scale
        Animated.timing(glowScaleAnim, {
          toValue: 1.15, // Scale up to 115%
          duration: 1500,
          useNativeDriver: true, // Can use native driver for scale
        }),
        // Animate back to the original scale
        Animated.timing(glowScaleAnim, {
          toValue: 1.0, // Scale back to 100%
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

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
      case 'running': return 'bg-[#34C759]';
      case 'stopped': return 'bg-[#FF9500]';
      case 'restarting': return 'bg-[#007AFF]';
      case 'broken': return 'bg-[#FF3B30]';
      default: return 'bg-[#34C759]';
    }
  };

  const searchBarWidth = searchBarAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, width - 80],
  });

  const renderMinerItem = ({ item }: { item: Miner }) => (
    <TouchableOpacity
      className="bg-white rounded-2xl p-4"
      onPress={() => handleMinerPress(item)}
    >
      <View className="flex-row justify-between items-start mb-3">
        <View className="flex-row flex-1">
          <View className="w-10 h-10 rounded-[10px] bg-gray-100 items-center justify-center mr-3">
            <Text className="text-lg">{item.image}</Text>
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-black mb-0.5">{item.name}</Text>
            <Text className="text-sm text-gray-500">{item.model}</Text>
          </View>
        </View>
        <View className={`px-2 py-1 rounded-lg ${getStatusStyle(item.status)}`}>
          <Text className="text-white text-[10px] font-semibold uppercase">{item.status}</Text>
        </View>
      </View>

      <View className="mb-3">
        <View className="flex-row justify-between">
          <View className="items-center flex-1">
            <Text className="text-xs text-gray-500 mb-1">Hash Rate</Text>
            <Text className="text-sm font-semibold text-black">
              {item.hashrate} {item.hashrateUnit}
            </Text>
          </View>
          <View className="items-center flex-1">
            <Text className="text-xs text-gray-500 mb-1">Daily Profit</Text>
            <Text className={`text-sm font-semibold ${item.dailyProfit === '0.00' ? 'text-gray-500' : 'text-black'}`}>
              ${item.dailyProfit}
            </Text>
          </View>
          <View className="items-center flex-1">
            <Text className="text-xs text-gray-500 mb-1">Uptime</Text>
            <Text className="text-sm font-semibold text-black">{item.uptime}</Text>
          </View>
        </View>
      </View>

      <View className="flex-row justify-between items-center pt-3 border-t border-gray-100">
        <View className="flex-row items-center gap-1">
          <Ionicons name="location-outline" size={12} color="#6B7280" />
          <Text className="text-xs text-gray-500">{item.location}</Text>
        </View>
        <View className="flex-row items-center gap-1">
          <Ionicons name="flash-outline" size={12} color="#6B7280" />
          <Text className="text-xs text-gray-500">{item.energyFee} USD/kWh</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
  

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      {/* Header with inline search bar */}
      <View className="py-2 px-4 border-b border-gray-200 h-[60px]">
        <View className="flex-row items-center justify-between flex-1">
          <Animated.View className="bg-white overflow-hidden mr-3 rounded-xl" style={{ width: searchBarWidth }}>
            {showSearchBar && (
              <View className="flex-1">
                <View className="flex-row items-center bg-gray-100 rounded-xl px-3 h-10">
                  <Ionicons name="search-outline" size={20} color="#6B7280" />
                  <TextInput
                    className="flex-1 ml-2 mr-2 text-base text-black"
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

          <View className="flex-row gap-2">
            {!showSearchBar && (
              <TouchableOpacity 
                className="w-10 h-10 rounded-xl bg-white items-center justify-center border border-gray-200"
                onPress={handleSearchPress}
              >
                <Ionicons name="search-outline" size={20} color="#000" />
              </TouchableOpacity>
            )}
            <Link href="/shop" asChild>
              <TouchableOpacity className="w-10 h-10 rounded-xl bg-white items-center justify-center border border-gray-200">
                <Ionicons name="add-outline" size={20} color="#000" />
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {/* Overview Section */}
        <View className="items-center justify-center mb-8 relative">
          {/* Glowing Background Effect */}
          <Animated.View
            className="absolute w-[180px] h-[180px] rounded-full"
            style={{
              backgroundColor: 'rgba(255, 192, 0, 0.4)',
              transform: [{ scale: glowScaleAnim }],
            }}
          />

          {/* The solid ring on top */}
          <View className="w-[180px] h-[180px] rounded-full border-[12px] border-[#FFC000]" />

          {/* Static Inner Circle with Text */}
          <View className="absolute w-[150px] h-[150px] rounded-full bg-white justify-center items-center">
            <Text className="text-[32px] font-extrabold text-black leading-[38px] text-center">{OVERVIEW_DATA.totalHashrate}</Text>
            <Text className="text-base font-semibold text-gray-500 mb-1">{OVERVIEW_DATA.totalHashrateUnit}</Text>
            <Text className="text-sm font-bold text-[#FFC000] text-center">{OVERVIEW_DATA.totalDailyProfit} / day</Text>
          </View>
        </View>
        
        {/* Status Summary */}
        <View className="flex-row justify-around px-5 mb-6 bg-white rounded-2xl py-4">
          {[
            { label: 'Active', value: OVERVIEW_DATA.active, color: '#34C759', isActive: true },
            { label: 'Stopped', value: OVERVIEW_DATA.stopped, color: '#FF9500', isActive: false },
            { label: 'Restarting', value: OVERVIEW_DATA.restarting, color: '#007AFF', isActive: false },
            { label: 'Broken', value: OVERVIEW_DATA.broken, color: '#FF3B30', isActive: false },
          ].map((item) => (
            <View key={item.label} className="items-center mb-2">
              <AnimatedStatusDot color={item.color} isActive={item.isActive} />
              <Text className="text-sm text-gray-500 ml-2">{item.label}</Text>
              <Text className="text-base font-bold text-black ml-1">{item.value}</Text>
            </View>
          ))}
        </View>

        {/* Filter Options */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-4"
          contentContainerStyle={{ paddingRight: 16 }}
        >
          {['all', 'running', 'stopped', 'restarting', 'broken'].map((filter) => (
            <TouchableOpacity
              key={filter}
              className={`px-4 py-2 rounded-xl bg-white mr-2 border ${selectedFilter === filter ? 'bg-[#FFC000] border-[#FFC000]' : 'border-gray-200'}`}
              onPress={() => setSelectedFilter(filter as MinerStatus | 'all')}
            >
              <Text className={`text-sm font-medium ${selectedFilter === filter ? 'text-black' : 'text-gray-500'}`}>
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Miners List */}
        <View className="mb-4">
          <Text className="text-lg font-bold text-black mb-3">
            {filteredMiners.length} Miner{filteredMiners.length !== 1 ? 's' : ''}
          </Text>

          <FlatList
            data={filteredMiners}
            renderItem={renderMinerItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={{ gap: 12, paddingBottom: 16 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


