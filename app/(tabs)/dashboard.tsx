import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, FlatList, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Rect, Circle, G, Text as SvgText } from 'react-native-svg';
import { Link } from 'expo-router';

const { width } = Dimensions.get('window');

// Mock data
const REVENUE_DATA = [42.30, 51.20, 48.50, 62.80, 59.10, 71.40, 68.20];
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
  monthlyGrowth: '+12.5%'
};

// News data
const NEWS_DATA = [
  {
    id: '1',
    title: 'Bitcoin Mining Difficulty Reaches All-Time High',
    summary: 'Network difficulty increases by 6.5% as more miners join the network',
    category: 'Market News',
    date: '2 hours ago',
    image: '📈'
  },
  {
    id: '2',
    title: 'New ASIC Miner Releases: What to Expect in 2024',
    summary: 'Major manufacturers announce next-generation mining hardware',
    category: 'Technology',
    date: '5 hours ago',
    image: '⚡'
  },
  {
    id: '3',
    title: 'Energy Efficiency Breakthrough in Mining Operations',
    summary: 'New cooling technology reduces power consumption by 25%',
    category: 'Innovation',
    date: '1 day ago',
    image: '🌱'
  },
  {
    id: '4',
    title: 'Regulatory Updates: Mining Operations in Europe',
    summary: 'New guidelines for sustainable crypto mining practices',
    category: 'Regulation',
    date: '2 days ago',
    image: '📝'
  }
];

// Simple SVG Line Chart Component
type LineChartProps = {
  data: number[];
  color?: string;
  height?: number;
  width?: number;
};

const LineChart: React.FC<LineChartProps> = ({ data, color = '#FFC000', height = 150, width: chartWidth = width - 80 }) => {
  const maxValue = Math.max(...data);
  const minValue = Math.min(...data);
  const range = maxValue - minValue || 1;
  
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * chartWidth;
    const y = height - ((value - minValue) / range) * height * 0.8 - height * 0.1;
    return `${x},${y}`;
  }).join(' ');

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
      {/* Add gradient area under the line */}
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

const BarChart: React.FC<BarChartProps> = ({ data, color = '#FFC000', height = 120, width: chartWidth = width - 80 }) => {
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
  <TouchableOpacity className="bg-white rounded-2xl p-4 mr-3 flex-col" style={{ width: width * 0.8, ...(index === 0 && { marginLeft: 16 }) }}>
    <View className="w-full h-[180px] rounded-xl bg-gray-100 items-center justify-center mb-3">
      <Text className="text-5xl">{item.image}</Text>
    </View>
    <View className="flex-1 mt-3">
      <View className="bg-[#FFC000]/20 px-2 py-1 rounded-md self-start mb-2">
        <Text className="text-[10px] text-[#FFC000] font-semibold uppercase">{item.category}</Text>
      </View>
      <Text className="text-base font-bold text-black mb-1 leading-5" numberOfLines={2}>{item.title}</Text>
      <Text className="text-xs text-gray-400 mb-2 leading-4" numberOfLines={2}>{item.summary}</Text>
      <Text className="text-[10px] text-gray-400 font-medium">{item.date}</Text>
    </View>
  </TouchableOpacity>
);

// Oneminers Logo SVG Component
const OneminersLogo = () => (
  <View className="flex-row items-center">
    <Text className="text-xl font-bold text-[#FFC000]">one</Text>
    <Text className="text-xl font-bold text-black">miners</Text>
  </View>
);

export default function DashboardScreen() {
  const [aiBoostEnabled, setAiBoostEnabled] = React.useState(true);
  const [showAiBoostHint, setShowAiBoostHint] = React.useState(false);

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
        {/* Quick Stats with Gradient Cards */}
        <View className="flex-row flex-wrap justify-between mb-4">
          <View className="w-[48%] p-4 rounded-2xl mb-3 bg-white border border-gray-100" style={{ width: (width - 48) / 2 }}>
            <View className="flex-row items-center mb-2">
              <View className="w-7 h-7 rounded-full bg-[#FFC000]/20 items-center justify-center mr-2">
                <Ionicons name="speedometer-outline" size={20} color="#000" />
              </View>
              <Text className="text-xs text-gray-600 font-medium">Hash Rate</Text>
            </View>
            <Text className="text-xl font-bold text-gray-900 mb-0.5">{MOCK_DATA.hashrate}</Text>
            <Text className="text-[11px] text-gray-500">{MOCK_DATA.hashrateUnit}</Text>
          </View>

          <View className="w-[48%] p-4 rounded-2xl mb-3 bg-white border border-gray-100" style={{ width: (width - 48) / 2 }}>
            <View className="flex-row items-center mb-2">
              <View className="w-7 h-7 rounded-full bg-[#FFC000]/20 items-center justify-center mr-2">
                <Ionicons name="trending-up-outline" size={20} color="#000" />
              </View>
              <Text className="text-xs text-gray-600 font-medium">Revenue</Text>
            </View>
            <Text className="text-xl font-bold text-gray-900 mb-0.5">{MOCK_DATA.totalRevenue}</Text>
            <Text className="text-[11px] text-[#16A34A] font-semibold">{MOCK_DATA.monthlyGrowth}</Text>
          </View>

          <View className="w-[48%] p-4 rounded-2xl mb-3 bg-white border border-gray-100" style={{ width: (width - 48) / 2 }}>
            <View className="flex-row items-center mb-2">
              <View className="w-7 h-7 rounded-full bg-[#FFC000]/20 items-center justify-center mr-2">
                <Ionicons name="hardware-chip-outline" size={20} color="#000" />
              </View>
              <Text className="text-xs text-gray-600 font-medium">Active Miners</Text>
            </View>
            <Text className="text-xl font-bold text-gray-900 mb-0.5">
              {MOCK_DATA.activeMiners}/{MOCK_DATA.totalMiners}
            </Text>
            <Text className="text-[11px] text-gray-500">Online</Text>
          </View>

          <View className="w-[48%] p-4 rounded-2xl mb-3 bg-white border border-gray-100" style={{ width: (width - 48) / 2 }}>
            <View className="flex-row items-center mb-2">
              <View className="w-7 h-7 rounded-full bg-[#FFC000]/20 items-center justify-center mr-2">
                <Ionicons name="flash-outline" size={20} color="#000" />
              </View>
              <Text className="text-xs text-gray-600 font-medium">Uptime</Text>
            </View>
            <Text className="text-xl font-bold text-gray-900 mb-0.5">{MOCK_DATA.uptime}%</Text>
            <Text className="text-[11px] text-gray-500">Stable</Text>
          </View>
        </View>

        {/* Earnings Chart */}
        <View className="bg-white rounded-2xl p-5 mb-4">
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-lg font-bold text-black">Daily Earnings</Text>
              <Text className="text-sm text-gray-400 mt-0.5">Last 7 days</Text>
            </View>
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-[#FFC000] text-sm font-medium mr-0.5">View All</Text>
              <Ionicons name="chevron-forward" size={16} color="#FFC000" />
            </TouchableOpacity>
          </View>
          <View className="items-center">
            <LineChart data={REVENUE_DATA} color="#FFC000" />
            <View className="flex-row justify-between w-full mt-2">
              {DAYS.map((day, index) => (
                <Text key={day} className="text-xs text-gray-400 text-center flex-1">{day}</Text>
              ))}
            </View>
          </View>
        </View>

        {/* Hash Rate Performance */}
        <View className="bg-white rounded-2xl p-5 mb-4">
          <View className="flex-row justify-between items-center mb-4">
            <View>
              <Text className="text-lg font-bold text-black">Hash Rate Overview</Text>
              <Text className="text-sm text-gray-400 mt-0.5">24-hour overview</Text>
            </View>
          </View>
          <View className="items-center">
            <BarChart data={HASH_RATE_DATA} color="#FFC000" />
          </View>
        </View>

        {/* Quick Actions Section */}
        <View className="mb-6">
          <Text className="text-xl font-bold text-black mb-4">Quick Actions</Text>
          <View>
            {/* Daily Check-in */}
            <TouchableOpacity className="w-full bg-white rounded-xl p-4 mb-2 flex-row items-center border border-gray-100">
              <View className="w-10 h-10 rounded-lg bg-gray-50 items-center justify-center mr-3">
                <Ionicons name="calendar-outline" size={20} color="#FFC000" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-black mb-0.5">Daily Check-in</Text>
                <Text className="text-xs text-gray-400">Claim your reward</Text>
              </View>
              {!MOCK_DATA.dailyCheckin && (
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
                  <Text className="text-base font-semibold text-black mb-0.5">Refer & Earn</Text>
                  <Text className="text-xs text-gray-400">Invite friends</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#8E8E93" />
              </TouchableOpacity>
            </Link>
            
            {/* AI Boost */}
            <View className="w-full bg-white rounded-xl p-4 mb-2 flex-row items-center border border-gray-100">
              <View className="w-10 h-10 rounded-lg bg-gray-50 items-center justify-center mr-3">
                <Ionicons name="rocket-outline" size={20} color="#34C759" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-black mb-0.5">AI Boost</Text>
                <Text className="text-xs text-gray-400">Auto optimization</Text>
              </View>
              <Switch
                value={aiBoostEnabled}
                onValueChange={setAiBoostEnabled}
                trackColor={{ false: '#767577', true: '#34C759' }}
                thumbColor={aiBoostEnabled ? '#FFFFFF' : '#f4f3f4'}
                style={{ transform: [{ scaleX: 1.4 }, { scaleY: 1.4 }], marginRight: 8 }}
              />
              <TouchableOpacity 
                className="p-1"
                onPress={() => setShowAiBoostHint(!showAiBoostHint)}
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
                  <Text className="text-base font-semibold text-black mb-0.5">View Orders</Text>
                  <Text className="text-xs text-gray-400">Manage purchases</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#8E8E93" />
              </TouchableOpacity>
            </Link>
          </View>

          {/* AI Boost Hint */}
          {showAiBoostHint && (
            <View className="bg-gray-50 p-3 rounded-lg mt-2 border-l-4 border-l-[#FFC000]">
              <Text className="text-xs text-gray-600 leading-4">
                Disabling AI Crypto-Mining stops automatic pool switching. Mining will continue with current settings, without AI-driven optimizations.
              </Text>
            </View>
          )}
        </View>

        {/* News Section */}
        <View className="mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-xl font-bold text-black">Latest News</Text>
            <TouchableOpacity className="flex-row items-center">
              <Text className="text-[#FFC000] text-sm font-medium mr-0.5">View All</Text>
              <Ionicons name="chevron-forward" size={16} color="#FFC000" />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={NEWS_DATA}
            renderItem={({ item, index }) => <NewsItem item={item} index={index} />}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingRight: 16, paddingBottom: 8 }}
            snapToAlignment="start"
            decelerationRate="fast"
            snapToInterval={width * 0.8 + 12}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
