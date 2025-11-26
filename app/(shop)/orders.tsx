import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// --- Mock Data & Types ---

// Define the structure for a single history entry
type HistoryEntry = {
  id: string;
  timestamp: string;
  status: string;
  message: string;
};

// Define the structure for a single order item
type OrderItem = {
  id: string;
  name: string;
  price: string;
  quantity: number;
  image: string; // Added image property
};

// Define the structure for an order
type Order = {
  id: string;
  status: 'Unpaid' | 'To Ship' | 'To Receive' | 'Completed';
  date: string;
  totalAmount: string;
  items: OrderItem[];
  history: HistoryEntry[];
};

// Mock data for orders with images
const mockOrders: Order[] = [
  {
    id: 'ORD-2023-001',
    status: 'Completed',
    date: '2023-10-20',
    totalAmount: '$4,200',
    items: [{ id: '1', name: 'Antminer S19 XP', price: '$4,200', quantity: 1, image: '⚙️' }],
    history: [
      { id: 'h1', timestamp: '2023-10-20 14:30', status: 'Completed', message: 'Order has been delivered and marked as completed.' },
      { id: 'h2', timestamp: '2023-10-18 11:00', status: 'To Receive', message: 'Your order is out for delivery.' },
      { id: 'h3', timestamp: '2023-10-16 09:15', status: 'To Ship', message: 'Order has been shipped. Tracking number: 1Z9999W99999999999' },
      { id: 'h4', timestamp: '2023-10-15 18:45', status: 'Unpaid', message: 'Order placed successfully. Awaiting payment.' },
    ],
  },
  {
    id: 'ORD-2023-002',
    status: 'To Receive',
    date: '2023-10-25',
    totalAmount: '$6,700',
    items: [
      { id: '2', name: 'Goldshell KD6', price: '$3,800', quantity: 1, image: '🔧' },
      { id: '3', name: 'Aleo Miner F1', price: '$2,900', quantity: 1, image: '⚡' },
    ],
    history: [
      { id: 'h5', timestamp: '2023-10-25 10:00', status: 'To Receive', message: 'Your order is out for delivery.' },
      { id: 'h6', timestamp: '2023-10-23 16:00', status: 'To Ship', message: 'Order has been shipped. Tracking number: 1Z8888W88888888888' },
      { id: 'h7', timestamp: '2023-10-22 12:00', status: 'Unpaid', message: 'Payment confirmed. Order is being processed.' },
    ],
  },
  {
    id: 'ORD-2023-003',
    status: 'Unpaid',
    date: '2023-10-26',
    totalAmount: '$3,500',
    items: [{ id: '4', name: 'Whatsminer M50', price: '$3,500', quantity: 1, image: '🔩' }],
    history: [
      { id: 'h8', timestamp: '2023-10-26 09:00', status: 'Unpaid', message: 'Order placed successfully. Awaiting payment.' },
    ],
  },
  {
    id: 'ORD-2023-004',
    status: 'To Ship',
    date: '2023-10-26',
    totalAmount: '$7,000',
    items: [{ id: '5', name: 'Antminer S19 Pro', price: '$3,500', quantity: 2, image: '⚙️' }],
    history: [
        { id: 'h9', timestamp: '2023-10-26 17:00', status: 'To Ship', message: 'Payment confirmed. Preparing for shipment.' },
        { id: 'h10', timestamp: '2023-10-26 15:00', status: 'Unpaid', message: 'Order placed successfully.' },
    ],
  },
];

// --- Main Component ---

const filters = ['All', 'Unpaid', 'To Ship', 'To Receive', 'Completed'];

export default function OrderPage() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const filteredOrders = useMemo(() => {
    if (selectedFilter === 'All') {
      return mockOrders;
    }
    return mockOrders.filter(order => order.status === selectedFilter);
  }, [selectedFilter]);

  const handleBackPress = () => {
    router.back();
  };

  const toggleOrderHistory = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const renderFilterTab = (filter: string) => (
    <TouchableOpacity
      key={filter}
      style={[styles.filterTab, selectedFilter === filter && styles.filterTabSelected]}
      onPress={() => setSelectedFilter(filter)}
    >
      <Text style={[styles.filterTabText, selectedFilter === filter && styles.filterTabTextSelected]}>
        {filter}
      </Text>
    </TouchableOpacity>
  );

  const renderOrderItem = ({ item }: { item: Order }) => {
    const firstItemImage = item.items[0]?.image || '📦'; // Fallback emoji
    const isExpanded = expandedOrderId === item.id;

    return (
      <View style={styles.orderCard}>
        <TouchableOpacity onPress={() => toggleOrderHistory(item.id)}>
          <View style={styles.orderCardRow}>
            {/* Product Image */}
            <View style={styles.productImageContainer}>
              <Text style={styles.productImage}>{firstItemImage}</Text>
            </View>

            {/* Order Details */}
            <View style={styles.orderDetailsContainer}>
              <View style={styles.orderIdStatusRow}>
                <Text style={styles.orderIdCompact}>{item.id}</Text>
                <Text style={styles.orderStatusCompact}>{item.status}</Text>
              </View>
              <Text style={styles.orderSummaryCompact}>{item.items.length} item(s) • {item.totalAmount}</Text>
            </View>

            {/* Expand/Collapse Icon */}
            <Ionicons 
              name={isExpanded ? "chevron-up" : "chevron-down"} 
              size={20} 
              color="#8E8E93" 
            />
          </View>
        </TouchableOpacity>

        {/* Expandable History Section */}
        {isExpanded && (
          <View style={styles.historyContainer}>
            <Text style={styles.historyTitle}>Update History</Text>
            <FlatList
              data={item.history}
              keyExtractor={(historyItem) => historyItem.id}
              renderItem={({ item: historyItem }) => (
                <View style={styles.historyItem}>
                  <Text style={styles.historyTimestamp}>{historyItem.timestamp}</Text>
                  <Text style={styles.historyStatus}>{historyItem.status}</Text>
                  <Text style={styles.historyMessage}>{historyItem.message}</Text>
                </View>
              )}
              scrollEnabled={false}
            />
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Filter Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersContainer}>
          {filters.map(renderFilterTab)}
        </ScrollView>

        {/* Orders List */}
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrderItem}
          contentContainerStyle={styles.ordersList}
          scrollEnabled={false}
        />
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
    borderBottomColor: '#E9ECEF',
  },
  backButton: {
    padding: 4,
    marginEnd: 12,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  filtersContainer: {
    marginBottom: 16,
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 16,
    backgroundColor: '#E9ECEF',
  },
  filterTabSelected: {
    backgroundColor: '#FFC000',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6C757D',
  },
  filterTabTextSelected: {
    color: '#FFFFFF',
  },
  ordersList: {
    paddingBottom: 16,
  },
  // --- New Compact Card Styles ---
  orderCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  orderCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImageContainer: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  productImage: {
    fontSize: 24,
  },
  orderDetailsContainer: {
    flex: 1,
    marginRight: 8,
  },
  orderIdStatusRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  orderIdCompact: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212529',
  },
  orderStatusCompact: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFC000',
  },
  orderSummaryCompact: {
    fontSize: 13,
    color: '#8E8E93',
  },
  // --- History Styles (unchanged) ---
  historyContainer: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 12,
  },
  historyItem: {
    marginBottom: 12,
    paddingLeft: 8,
    borderLeftWidth: 2,
    borderLeftColor: '#FFC000',
  },
  historyTimestamp: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  historyStatus: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 4,
  },
  historyMessage: {
    fontSize: 13,
    color: '#495057',
    lineHeight: 18,
  },
});