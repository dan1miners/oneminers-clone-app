import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, FlatList, Switch } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Svg, { Path, Rect, Circle, G, Text as SvgText } from 'react-native-svg';

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
  <TouchableOpacity style={[styles.newsCard, index === 0 && { marginLeft: 0 }]}>
    <View style={styles.newsImageContainer}>
      <Text style={styles.newsImage}>{item.image}</Text>
    </View>
    <View style={styles.newsContent}>
      <View style={styles.newsCategory}>
        <Text style={styles.newsCategoryText}>{item.category}</Text>
      </View>
      <Text style={styles.newsTitle} numberOfLines={2}>{item.title}</Text>
      <Text style={styles.newsSummary} numberOfLines={2}>{item.summary}</Text>
      <Text style={styles.newsDate}>{item.date}</Text>
    </View>
  </TouchableOpacity>
);

// Oneminers Logo SVG Component
const OneminersLogo = () => (
  <Svg width={120} height={32} viewBox="0 0 120 32">
    <Path
      d="M20 8L24 16L20 24L12 24L8 16L12 8L20 8Z"
      fill="#FFC000"
    />
    <Path
      d="M20 8L24 16L20 24M20 8L12 8L8 16L12 24L20 24M20 8V24"
      stroke="#000000"
      strokeWidth="1.5"
    />
    <Path
      d="M16 12L16 20"
      stroke="#000000"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <SvgText x="35" y="20" fontSize="18" fontWeight="bold" fill="#000000">
      oneminers
    </SvgText>
  </Svg>
);

export default function DashboardScreen() {
  const [aiBoostEnabled, setAiBoostEnabled] = React.useState(true);
  const [showAiBoostHint, setShowAiBoostHint] = React.useState(false);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <OneminersLogo />
        <TouchableOpacity style={styles.profileButton}>
          <View style={styles.profileAvatar}>
            <Ionicons name="person-outline" size={16} color="#000" />
          </View>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Stats with Gradient Cards */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <View style={styles.statIconContainer}>
                <Ionicons name="speedometer-outline" size={20} color="#000" />
              </View>
              <Text style={styles.statCardLabel}>Hash Rate</Text>
            </View>
            <Text style={styles.statCardValue}>{MOCK_DATA.hashrate}</Text>
            <Text style={styles.statCardUnit}>{MOCK_DATA.hashrateUnit}</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <View style={styles.statIconContainer}>
                <Ionicons name="trending-up-outline" size={20} color="#000" />
              </View>
              <Text style={styles.statCardLabel}>Revenue</Text>
            </View>
            <Text style={styles.statCardValue}>{MOCK_DATA.totalRevenue}</Text>
            <Text style={styles.statCardGrowth}>{MOCK_DATA.monthlyGrowth}</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <View style={styles.statIconContainer}>
                <Ionicons name="hardware-chip-outline" size={20} color="#000" />
              </View>
              <Text style={styles.statCardLabel}>Active Miners</Text>
            </View>
            <Text style={styles.statCardValue}>
              {MOCK_DATA.activeMiners}/{MOCK_DATA.totalMiners}
            </Text>
            <Text style={styles.statCardUnit}>Online</Text>
          </View>

          <View style={styles.statCard}>
            <View style={styles.statHeader}>
              <View style={styles.statIconContainer}>
                <Ionicons name="flash-outline" size={20} color="#000" />
              </View>
              <Text style={styles.statCardLabel}>Uptime</Text>
            </View>
            <Text style={styles.statCardValue}>{MOCK_DATA.uptime}%</Text>
            <Text style={styles.statCardUnit}>Stable</Text>
          </View>
        </View>

        {/* Earnings Chart */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View>
              <Text style={styles.chartTitle}>Daily Earnings</Text>
              <Text style={styles.chartSubtitle}>Last 7 days</Text>
            </View>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
              <Ionicons name="chevron-forward" size={16} color="#FFC000" />
            </TouchableOpacity>
          </View>
          <View style={styles.chartContainer}>
            <LineChart data={REVENUE_DATA} color="#FFC000" />
            <View style={styles.chartLabels}>
              {DAYS.map((day, index) => (
                <Text key={day} style={styles.chartLabel}>{day}</Text>
              ))}
            </View>
          </View>
        </View>

        {/* Hash Rate Performance */}
        <View style={styles.chartCard}>
          <View style={styles.chartHeader}>
            <View>
              <Text style={styles.chartTitle}>Hash Rate Overview</Text>
              <Text style={styles.chartSubtitle}>24-hour overview</Text>
            </View>
          </View>
          <View style={styles.chartContainer}>
            <BarChart data={HASH_RATE_DATA} color="#FFC000" />
          </View>
        </View>

        {/* Quick Actions Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.quickActionsList}>
            {/* Daily Check-in */}
            <TouchableOpacity style={styles.quickActionItem}>
              <View style={styles.quickActionIcon}>
                <Ionicons name="calendar-outline" size={20} color="#FFC000" />
              </View>
              <View style={styles.quickActionContent}>
                <Text style={styles.quickActionText}>Daily Check-in</Text>
                <Text style={styles.quickActionSubtext}>Claim your reward</Text>
              </View>
              {!MOCK_DATA.dailyCheckin && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>1</Text>
                </View>
              )}
              <Ionicons name="chevron-forward" size={16} color="#8E8E93" />
            </TouchableOpacity>

            {/* Refer & Earn */}
            <TouchableOpacity style={styles.quickActionItem}>
              <View style={styles.quickActionIcon}>
                <Ionicons name="people-outline" size={20} color="#007AFF" />
              </View>
              <View style={styles.quickActionContent}>
                <Text style={styles.quickActionText}>Refer & Earn</Text>
                <Text style={styles.quickActionSubtext}>Invite friends</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#8E8E93" />
            </TouchableOpacity>

            {/* AI Boost */}
            <View style={styles.quickActionItem}>
              <View style={styles.quickActionIcon}>
                <Ionicons name="rocket-outline" size={20} color="#34C759" />
              </View>
              <View style={styles.quickActionContent}>
                <Text style={styles.quickActionText}>AI Boost</Text>
                <Text style={styles.quickActionSubtext}>Auto optimization</Text>
              </View>
              <Switch
                value={aiBoostEnabled}
                onValueChange={setAiBoostEnabled}
                trackColor={{ false: '#767577', true: '#34C759' }}
                thumbColor={aiBoostEnabled ? '#FFFFFF' : '#f4f3f4'}
                style={styles.switch}
              />
              <TouchableOpacity 
                style={styles.hintButton}
                onPress={() => setShowAiBoostHint(!showAiBoostHint)}
              >
                <Ionicons name="help-circle-outline" size={16} color="#8E8E93" />
              </TouchableOpacity>
            </View>

            {/* View Orders */}
            <TouchableOpacity style={styles.quickActionItem}>
              <View style={styles.quickActionIcon}>
                <Ionicons name="document-text-outline" size={20} color="#FF9500" />
              </View>
              <View style={styles.quickActionContent}>
                <Text style={styles.quickActionText}>View Orders</Text>
                <Text style={styles.quickActionSubtext}>Manage purchases</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          {/* AI Boost Hint */}
          {showAiBoostHint && (
            <View style={styles.hintContainer}>
              <Text style={styles.hintText}>
                Disabling AI Crypto-Mining stops automatic pool switching. Mining will continue with current settings, without AI-driven optimizations.
              </Text>
            </View>
          )}
        </View>

        {/* News Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Latest News</Text>
            <TouchableOpacity style={styles.viewAllButton}>
              <Text style={styles.viewAllText}>View All</Text>
              <Ionicons name="chevron-forward" size={16} color="#FFC000" />
            </TouchableOpacity>
          </View>
          
          <FlatList
            data={NEWS_DATA}
            renderItem={({ item, index }) => <NewsItem item={item} index={index} />}
            keyExtractor={item => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.newsCarousel}
            snapToAlignment="start"
            decelerationRate="fast"
            snapToInterval={width * 0.8}
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
   
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 60,
  },
  greeting: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000000',
  },
  profileButton: {
    padding: 4,
  },
  profileAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#E5E5EA',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  statsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statCard: {
    width: (width - 48) / 2,
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#F2F2F7',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  statHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  statIconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFC00020',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  statCardLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  statCardValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  statCardUnit: {
    fontSize: 11,
    color: '#6B7280',
  },
  statCardGrowth: {
    fontSize: 11,
    color: '#16A34A',
    fontWeight: '600',
  },
  chartCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  chartSubtitle: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    color: '#FFC000',
    fontSize: 14,
    fontWeight: '500',
    marginRight: 2,
  },
  chartContainer: {
    alignItems: 'center',
  },
  chartLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  chartLabel: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'center',
    flex: 1,
  },
  // Section Styles
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 16,
  },
  // Quick Actions - Single Column
  quickActionsList: {
    // Single column layout
  },
  quickActionItem: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#F2F2F7',
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  quickActionContent: {
    flex: 1,
  },
  quickActionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 2,
  },
  quickActionSubtext: {
    fontSize: 12,
    color: '#8E8E93',
  },
  badge: {
    backgroundColor: '#FF3B30',
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  switch: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
    marginRight: 8,
  },
  hintButton: {
    padding: 4,
  },
  hintContainer: {
    backgroundColor: '#F8F9FA',
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#FFC000',
  },
  hintText: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 16,
  },
  // News Section Styles
  newsCarousel: {
    paddingRight: 16,
    paddingBottom: 8,
  },
  newsCard: {
    width: width * 0.8,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
  },
  newsImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  newsImage: {
    fontSize: 24,
  },
  newsContent: {
    flex: 1,
  },
  newsCategory: {
    backgroundColor: '#FFC00020',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  newsCategoryText: {
    fontSize: 10,
    color: '#FFC000',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  newsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 4,
    lineHeight: 20,
  },
  newsSummary: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 8,
    lineHeight: 16,
  },
  newsDate: {
    fontSize: 10,
    color: '#8E8E93',
    fontWeight: '500',
  },
});