import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// --- Mock Data & Types ---

type HistoryEntry = {
  id: string;
  timestamp: string;
  status: string;
  message: string;
};

type OrderItem = {
  id: string;
  name: string;
  price: string;
  quantity: number;
  image: string;
};

type Order = {
  id: string;
  status: 'Unpaid' | 'To Ship' | 'To Receive' | 'Completed';
  date: string;
  totalAmount: string;
  items: OrderItem[];
  history: HistoryEntry[];
};

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
    history: [{ id: 'h8', timestamp: '2023-10-26 09:00', status: 'Unpaid', message: 'Order placed successfully. Awaiting payment.' }],
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

const filters = ['All', 'Unpaid', 'To Ship', 'To Receive', 'Completed'] as const;

export default function OrderPage() {
  const router = useRouter();
  const [selectedFilter, setSelectedFilter] = useState<(typeof filters)[number]>('All');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const filteredOrders = useMemo(() => {
    if (selectedFilter === 'All') return mockOrders;
    return mockOrders.filter((order) => order.status === selectedFilter);
  }, [selectedFilter]);

  const handleBackPress = () => router.back();

  const toggleOrderHistory = (orderId: string) => {
    setExpandedOrderId((prev) => (prev === orderId ? null : orderId));
  };

  const renderFilterTab = (filter: (typeof filters)[number]) => {
    const isSelected = selectedFilter === filter;

    return (
      <TouchableOpacity
        key={filter}
        onPress={() => setSelectedFilter(filter)}
        className={[
          'py-2 px-4 mr-2 rounded-2xl',
          isSelected ? 'bg-[#FFC000]' : 'bg-[#E9ECEF]',
        ].join(' ')}
      >
        <Text
          className={[
            'text-sm font-medium',
            isSelected ? 'text-white' : 'text-[#6C757D]',
          ].join(' ')}
        >
          {filter}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderOrderItem = ({ item }: { item: Order }) => {
    const firstItemImage = item.items[0]?.image || '📦';
    const isExpanded = expandedOrderId === item.id;

    return (
      <View className="bg-white rounded-lg p-4 mb-3">
        <TouchableOpacity onPress={() => toggleOrderHistory(item.id)}>
          <View className="flex-row items-center">
            {/* Product Image */}
            <View className="w-[50px] h-[50px] rounded-lg bg-[#F2F2F7] items-center justify-center mr-3">
              <Text className="text-2xl">{firstItemImage}</Text>
            </View>

            {/* Order Details */}
            <View className="flex-1 mr-2">
              <View className="flex-row justify-between items-center mb-1">
                <Text className="text-sm font-semibold text-[#212529]">
                  {item.id}
                </Text>
                <Text className="text-xs font-semibold text-[#FFC000]">
                  {item.status}
                </Text>
              </View>
              <Text className="text-[13px] text-[#8E8E93]">
                {item.items.length} item(s) • {item.totalAmount}
              </Text>
            </View>

            {/* Expand/Collapse Icon */}
            <Ionicons
              name={isExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="#8E8E93"
            />
          </View>
        </TouchableOpacity>

        {/* Expandable History Section */}
        {isExpanded && (
          <View className="mt-4 pt-4 border-t border-[#F2F2F7]">
            <Text className="text-base font-semibold text-[#212529] mb-3">
              Update History
            </Text>

            <FlatList
              data={item.history}
              keyExtractor={(historyItem) => historyItem.id}
              scrollEnabled={false}
              renderItem={({ item: historyItem }) => (
                <View className="mb-3 pl-2 border-l-2 border-[#FFC000]">
                  <Text className="text-xs text-[#8E8E93] mb-1">
                    {historyItem.timestamp}
                  </Text>
                  <Text className="text-sm font-semibold text-[#212529] mb-1">
                    {historyItem.status}
                  </Text>
                  <Text className="text-[13px] text-[#495057] leading-[18px]">
                    {historyItem.message}
                  </Text>
                </View>
              )}
            />
          </View>
        )}
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FA]">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-[#E9ECEF]">
        <TouchableOpacity onPress={handleBackPress} className="p-1 mr-3">
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text className="text-base font-semibold text-black">My Orders</Text>
      </View>

      {/* Content */}
      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {/* Filter Tabs */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-4"
        >
          {filters.map(renderFilterTab)}
        </ScrollView>

        {/* Orders List */}
        <FlatList
          data={filteredOrders}
          keyExtractor={(item) => item.id}
          renderItem={renderOrderItem}
          scrollEnabled={false}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
