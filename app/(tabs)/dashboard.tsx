import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Switch,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Rect, G, Text as SvgText } from 'react-native-svg';
import { Link } from 'expo-router';

const { width } = Dimensions.get('window');

// Mock data
const REVENUE_DATA = [42.3, 51.2, 48.5, 62.8, 59.1, 71.4, 68.2];
const HASH_RATE_DATA = [1200, 1250, 1180, 1320, 1280, 1350, 1290];
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const MOCK_DATA = {
  hashrate: '1,284.5',
  hashrateUnit: 'TH/s',
  dailyEarnings: '0.002154',
  earningsUnit: 'BTC',
  usdValue: '$45.30',
  activeMiners: 8,
  totalMiners: 12,
  uptime: '99.2',
  temperature: '68°C',
  powerConsumption: '2.4',
  powerUnit: 'kWh',
  aiBoost: true,
  dailyCheckin: false,
  streak: 5,
  referralCode: 'MINER2024',
  totalRevenue: '$2,847',
  monthlyGrowth: '+12.5%',
};

// News data
const NEWS_DATA = [
  {
    id: '1',
    title: 'Bitcoin Mining Difficulty Reaches All-Time High',
    summary:
      'Network difficulty increases by 6.5% as more miners join the network',
    category: 'Market News',
    date: '2 hours ago',
    image: '📈',
  },
  {
    id: '2',
    title: 'New ASIC Miner Releases: What to Expect in 2024',
    summary: 'Major manufacturers announce next-generation mining hardware',
    category: 'Technology',
    date: '5 hours ago',
    image: '⚡',
  },
  {
    id: '3',
    title: 'Energy Efficiency Breakthrough in Mining Operations',
    summary: 'New cooling technology reduces power consumption by 25%',
    category: 'Innovation',
    date: '1 day ago',
    image: '🌱',
  },
  {
    id: '4',
    title: 'Regulatory Updates: Mining Operations in Europe',
    summary: 'New guidelines for sustainable crypto mining practices',
    category: 'Regulation',
    date: '2 days ago',
    image: '📝',
  },
];

// Simple SVG Line Chart Component
type LineChartProps = {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
};

const LineChart: React.FC<LineChartProps> = ({
  data,
  color = '#FFC000',
  height = 150,
  width: chartWidth = width - 80,
}) => {
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * chartWidth;
      const y =
        height - ((value - minValue) / range) * height * 0.8 - height * 0.1;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <Svg height={height} width={chartWidth}>
      <Path
        d={`M ${points}`}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d={`M ${points} L ${chartWidth},${height} L 0,${height} Z`}
        fill={`${color}20`}
      />
    </Svg>
  );
};

// Simple SVG Bar Chart Component
type BarChartProps = {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
};

const BarChart: React.FC<BarChartProps> = ({
  data,
  color = '#FFC000',
  height = 120,
  width: chartWidth = width - 80,
}) => {
  const maxValue = Math.max(...data);
  const barWidth = (chartWidth - 40) / data.length;

  return (
    <Svg height={height} width={chartWidth}>
      {data.map((value, index) => {
        const barHeight = (value / maxValue) * (height - 30);
        const x = index * barWidth + 20;
        const y = height - barHeight - 10;

        return (
          <G key={index}>
            <Rect
              x={x}
              y={y}
              width={barWidth - 8}
              height={barHeight}
              fill={color}
              rx={4}
            />
            <SvgText
              x={x + (barWidth - 8) / 2}
              y={height - 2}
              fontSize="10"
              fill="#8E8E93"
              textAnchor="middle"
            >
              {DAYS[index]}
            </SvgText>
          </G>
        );
      })}
    </Svg>
  );
};

// News Carousel Item
const NewsItem = ({ item, index }: { item: any; index: number }) => (
  <TouchableOpacity
    className="bg-white rounded-2xl p-4 mr-3 flex-col"
    style={{ width: width * 0.8, ...(index === 0 && { marginLeft: 16 }) }}
  >
    <View className="w-full h-[180px] rounded-xl bg-gray-100 items-center justify-center mb-3">
      <Text className="text-5xl">{item.image}</Text>
    </View>
    <View className="flex-1 mt-3">
      <View className="bg-[#FFC000]/20 px-2 py-1 rounded-md self-start mb-2">
        <Text className="text-[10px] text-[#FFC000] font-semibold uppercase">
          {item.category}
        </Text>
      </View>
      <Text
        className="text-base font-bold text-black mb-1 leading-5"
        numberOfLines={2}
      >
        {item.title}
      </Text>
      <Text
        className="text-xs text-gray-400 mb-2 leading-4"
        numberOfLines={2}
      >
        {item.summary}
      </Text>
      <Text className="text-[10px] text-gray-400 font-medium">{item.date}</Text>
    </View>
  </TouchableOpacity>
);

// Oneminers text logo component
const OneminersLogo = () => (
  <View className="flex-row items-center">
    <Text className="text-xl font-bold text-[#FFC000]">one</Text>
    <Text className="text-xl font-bold text-black">miners</Text>
  </View>
);

export default function DashboardScreen() {
  // AI Boost
  const [aiBoostEnabled, setAiBoostEnabled] = useState(true);
  const [showAiBoostHint, setShowAiBoostHint] = useState(false);

  // Daily check-in
  const [checkinOpen, setCheckinOpen] = useState(false);
  const [checkedInToday, setCheckedInToday] = useState(false);
  const [currentCoins, setCurrentCoins] = useState(120);
  const todayReward = 1;

  const [week, setWeek] = useState([
    { day: 1, points: 1, claimed: false },
    { day: 2, points: 1, claimed: false },
    { day: 3, points: 1, claimed: false },
    { day: 4, points: 1, claimed: false },
    { day: 5, points: 1, claimed: false },
    { day: 6, points: 1, claimed: false },
    { day: 7, points: 1, claimed: false },
  ]);

  const handleOpenCheckin = () => setCheckinOpen(true);

  const handleCheckin = () => {
    if (checkedInToday) return;

    setCheckedInToday(true);
    setCurrentCoins((prev) => prev + todayReward);

    setWeek((prev) => {
      const copy = [...prev];
      const idx = copy.findIndex((d) => !d.claimed);
      if (idx !== -1) copy[idx] = { ...copy[idx], claimed: true };
      return copy;
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      {/* Header */}
      <View className="py-3 px-5 border-b border-gray-200 flex-row justify-between items-center h-[60px]">
        <OneminersLogo />
        <TouchableOpacity className="p-1">
          <View className="w-9 h-9 rounded-full bg-gray-100 items-center justify-center border-2 border-gray-200">
            <Ionicons name="person-outline" size={16} color="#000" />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {/* Quick Stats */}
        <View className="flex-row flex-wrap justify-between mb-4">
          <View
            className="p-4 rounded-2xl mb-3 bg-white border border-gray-100"
            style={{ width: (width - 48) / 2 }}
          >
            <View className="flex-row items-center mb-2">
              <View className="w-7 h-7 rounded-full bg-[#FFC000]/20 items-center justify-center mr-2">
                <Ionicons name="speedometer-outline" size={20} color="#000" />
              </View>
              <Text className="text-xs text-gray-600 font-medium">
                Hash Rate
              </Text>
            </View>
            <Text className="text-xl font-bold text-gray-900 mb-0.5">
              {MOCK_DATA.hashrate}
            </Text>
            <Text className="text-[11px] text-gray-500">
              {MOCK_DATA.hashrateUnit}
            </Text>
          </View>

          <View
            className="p-4 rounded-2xl mb-3 bg-white border border-gray-100"
            style={{ width: (width - 48) / 2 }}
          >
            <View className="flex-row items-center mb-2">
              <View className="w-7 h-7 rounded-full bg-[#FFC000]/20 items-center justify-center mr-2">
                <Ionicons name="trending-up-outline" size={20} color="#000" />
              </View>
              <Text className="text-xs text-gray-600 font-medium">Revenue</Text>
            </View>
            <Text className="text-xl font-bold text-gray-900 mb-0.5">
              {MOCK_DATA.totalRevenue}
            </Text>
            <Text className="text-[11px] text-[#16A34A] font-semibold">
              {MOCK_DATA.monthlyGrowth}
            </Text>
          </View>

          <View
            className="p-4 rounded-2xl mb-3 bg-white border border-gray-100"
            style={{ width: (width - 48) / 2 }}
          >
            <View className="flex-row items-center mb-2">
              <View className="w-7 h-7 rounded-full bg-[#FFC000]/20 items-center justify-center mr-2">
                <Ionicons
                  name="hardware-chip-outline"
                  size={20}
                  color="#000"
                />
              </View>
              <Text className="text-xs text-gray-600 font-medium">
                Active Miners
              </Text>
            </View>
            <Text className="text-xl font-bold text-gray-900 mb-0.5">
              {MOCK_DATA.activeMiners}/{MOCK_DATA.totalMiners}
            </Text>
            <Text className="text-[11px] text-gray-500">Online</Text>
          </View>

          <View
            className="p-4 rounded-2xl mb-3 bg-white border border-gray-100"
            style={{ width: (width - 48) / 2 }}
          >
            <View className="flex-row items-center mb-2">
              <View className="w-7 h-7 rounded-full bg-[#FFC000]/20 items-center justify-center mr-2">
                <Ionicons name="flash-outline" size={20} color="#000" />
              </View>
              <Text className="text-xs text-gray-600 font-medium">Uptime</Text>
            </View>
            <Text className="text-xl font-bold text-gray-900 mb-0.5">
              {MOCK_DATA.uptime}%
            </Text>
            <Text className="text-[11px] text-gray-500">Stable</Text>
          </View>
        </View>

        {/* Earnings Chart */}
        <View className="bg-white rounded-2xl p-5 mb-4">
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-lg font-bold text-black">
                Daily Earnings
              </Text>
              <Text className="text-sm text-gray-400 mt-0.5">Last 7 days</Text>
            </View>
            <Link href="/earnings" asChild>
              <TouchableOpacity className="flex-row items-center">
                <Text className="text-[#FFC000] text-sm font-medium mr-0.5">
                  View All
                </Text>
                <Ionicons name="chevron-forward" size={16} color="#FFC000" />
              </TouchableOpacity>
            </Link>

          </View>
          <View className="items-center">
            <LineChart data={REVENUE_DATA} color="#FFC000" />
            <View className="flex-row justify-between w-full mt-2">
              {DAYS.map((day) => (
                <Text
                  key={day}
                  className="text-xs text-gray-400 text-center flex-1"
                >
                  {day}
                </Text>
              ))}
            </View>
          </View>
        </View>

        {/* Hash Rate Performance */}
        <View className="bg-white rounded-2xl p-5 mb-4">
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-lg font-bold text-black">
                Hash Rate Overview
              </Text>
              <Text className="text-sm text-gray-400 mt-0.5">
                24-hour overview
              </Text>
            </View>
          </View>
          <View className="items-center">
            <BarChart data={HASH_RATE_DATA} color="#FFC000" />
          </View>
        </View>

        {/* Quick Actions */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-black mb-4">
            Quick Actions
          </Text>

          {/* Daily Check-in */}
          <TouchableOpacity
            onPress={handleOpenCheckin}
            className="w-full bg-white rounded-xl p-4 mb-2 flex-row items-center border border-gray-100"
          >
            <View className="w-10 h-10 rounded-lg bg-gray-50 items-center justify-center mr-3">
              <Ionicons name="calendar-outline" size={20} color="#FFC000" />
            </View>

            <View className="flex-1">
              <Text className="text-base font-semibold text-black mb-0.5">
                Daily Check-in
              </Text>
              <Text className="text-xs text-gray-400">
                {checkedInToday ? "You're checked in today" : 'Claim your reward'}
              </Text>
            </View>

            {!checkedInToday && (
              <View className="bg-[#FF3B30] w-5 h-5 rounded-full items-center justify-center mr-3">
                <Text className="text-white text-xs font-bold">1</Text>
              </View>
            )}

            <Ionicons name="chevron-forward" size={16} color="#8E8E93" />
          </TouchableOpacity>

          {/* Refer & Earn */}
          <Link href="/referral" asChild>
            <TouchableOpacity className="w-full bg-white rounded-xl p-4 mb-2 flex-row items-center border border-gray-100">
              <View className="w-10 h-10 rounded-lg bg-gray-50 items-center justify-center mr-3">
                <Ionicons name="people-outline" size={20} color="#007AFF" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-black mb-0.5">
                  Refer & Earn
                </Text>
                <Text className="text-xs text-gray-400">Invite friends</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#8E8E93" />
            </TouchableOpacity>
          </Link>

          {/* AI Boost */}
          {/* AI Boost (fixed layout + green active switch) */}
          <View className="w-full bg-white rounded-xl p-4 mb-2 flex-row items-center border border-gray-100">
            <View className="w-10 h-10 rounded-lg bg-gray-50 items-center justify-center mr-3">
              <Ionicons name="rocket-outline" size={20} color="#34C759" />
            </View>

            <View className="flex-1">
              <Text className="text-base font-semibold text-black mb-0.5">
                AI Boost
              </Text>
              <Text className="text-xs text-gray-400">Auto optimization</Text>
            </View>

            <Switch
              value={aiBoostEnabled}
              onValueChange={setAiBoostEnabled}
              trackColor={{ false: '#D1D5DB', true: '#34C759' }}
              thumbColor={aiBoostEnabled ? '#FFFFFF' : '#FFFFFF'}
              ios_backgroundColor="#D1D5DB"
              style={{ marginRight: 8 }}
            />

            <TouchableOpacity
              onPress={() => setShowAiBoostHint(true)}
              className="p-1"
            >
              <Ionicons name="help-circle-outline" size={20} color="#8E8E93" />
            </TouchableOpacity>
          </View>


          {/* View Orders */}
          <Link href="/orders" asChild>
            <TouchableOpacity className="w-full bg-white rounded-xl p-4 mb-2 flex-row items-center border border-gray-100">
              <View className="w-10 h-10 rounded-lg bg-gray-50 items-center justify-center mr-3">
                <Ionicons name="document-text-outline" size={20} color="#FF9500" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-black mb-0.5">
                  View Orders
                </Text>
                <Text className="text-xs text-gray-400">Manage purchases</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#8E8E93" />
            </TouchableOpacity>
          </Link>

        </View>

        {/* News Section */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-black">Latest News</Text>
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-[#FFC000] text-sm font-medium mr-0.5">
                View All
              </Text>
              <Ionicons name="chevron-forward" size={16} color="#FFC000" />
            </TouchableOpacity>
          </View>

          <FlatList
            data={NEWS_DATA}
            renderItem={({ item, index }) => <NewsItem item={item} index={index} />}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16, paddingBottom: 8 }}
            snapToAlignment="start"
            decelerationRate="fast"
            snapToInterval={width * 0.8 + 12}
          />
        </View>

        <View className="h-8" />
      </ScrollView>

      {/* ✅ Check-in Modal */}
      <Modal
        visible={checkinOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setCheckinOpen(false)}
      >
        <Pressable
          className="flex-1 bg-black/40 items-center justify-center px-5"
          onPress={() => setCheckinOpen(false)}
        >
          <Pressable className="w-full bg-white rounded-2xl p-5" onPress={() => {}}>
            {/* Header */}
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="w-10 h-10 rounded-xl bg-[#FFC000]/20 items-center justify-center mr-3">
                  <Ionicons name="gift-outline" size={20} color="#000" />
                </View>
                <View>
                  <Text className="text-lg font-bold text-black">Daily Check-in</Text>
                  <Text className="text-xs text-gray-400">
                    {checkedInToday ? 'Checked in today' : 'Check in to claim points'}
                  </Text>
                </View>
              </View>

              <TouchableOpacity onPress={() => setCheckinOpen(false)} className="p-2">
                <Ionicons name="close" size={18} color="#111827" />
              </TouchableOpacity>
            </View>

            {/* 7-day row */}
            <View className="mt-4 flex-row justify-between">
              {week.map((d) => (
                <View
                  key={d.day}
                  className={`w-[13%] rounded-xl py-2 items-center border ${
                    d.claimed
                      ? 'bg-[#FFC000]/15 border-[#FFC000]/40'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <Text className="text-[10px] text-gray-500">Day {d.day}</Text>
                  <Text className="text-sm font-bold text-black">{d.points}</Text>
                </View>
              ))}
            </View>

            {/* Reward summary */}
            <View className="mt-4 bg-gray-50 rounded-2xl p-4 border border-gray-100">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-sm text-gray-600">Today’s reward</Text>
                <Text className="text-sm font-bold text-black">+{todayReward} point</Text>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-gray-600">Total coins</Text>
                <Text className="text-sm font-bold text-black">{currentCoins}</Text>
              </View>
            </View>

            {/* Action */}
            <TouchableOpacity
              onPress={handleCheckin}
              disabled={checkedInToday}
              className={`mt-4 rounded-xl py-4 items-center ${
                checkedInToday ? 'bg-gray-100' : 'bg-[#FFC000]'
              }`}
              activeOpacity={0.9}
            >
              <Text
                className={`text-base font-bold ${
                  checkedInToday ? 'text-gray-400' : 'text-black'
                }`}
              >
                {checkedInToday ? 'Already Checked In' : 'Check In Now'}
              </Text>
            </TouchableOpacity>

            {/* ✅ Link to points page (no router) */}
            <Link
              href="/points"
              onPress={() => setCheckinOpen(false)}
              asChild
            >
              <TouchableOpacity className="mt-4 items-center">
                <Text className="text-sm font-semibold text-[#FFC000]">
                  See how points work
                </Text>
              </TouchableOpacity>
            </Link>
          </Pressable>
        </Pressable>
      </Modal>
      {/* ✅ AI Boost Tooltip (NO layout impact) */}
      <Modal visible={showAiBoostHint} transparent animationType="fade">
        <Pressable
          className="flex-1 bg-black/30"
          onPress={() => setShowAiBoostHint(false)}
        >
          <View className="absolute bottom-24 left-5 right-5">
            <View className="bg-white rounded-xl p-4 shadow-lg">
              <Text className="text-sm font-bold text-black mb-2">
                AI Boost
              </Text>
              <Text className="text-xs text-gray-600 leading-4">
                Automatically switches to the most profitable mining pools using
                real-time performance data.
              </Text>
              <TouchableOpacity
                onPress={() => setShowAiBoostHint(false)}
                className="mt-3 self-end"
              >
                <Text className="text-xs font-semibold text-[#FFC000]">
                  Got it
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
      
    </SafeAreaView>
  );
}
