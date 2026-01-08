import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

/* ---------- Types ---------- */

type Product = {
  id: number;
  name: string;
  price: string;
  image: string;
  coin: string;
  hashrate: string;
  algorithm: string;
  profit: string;
  power: string;
  efficiency: string;
};

type FilterType = 'all' | 'btc' | 'kas' | 'aleo' | 'eth' | 'sol';

/* ---------- Mock Data ---------- */

const allProducts: Product[] = [
  { id: 1, name: 'Antminer S19 Pro', price: '$3,500', image: '⚙️', coin: 'BTC', hashrate: '110 TH/s', algorithm: 'SHA-256', profit: '$15/day', power: '3250W', efficiency: '29.5 J/TH' },
  { id: 2, name: 'Whatsminer M30S+', price: '$2,800', image: '🔧', coin: 'BTC', hashrate: '100 TH/s', algorithm: 'SHA-256', profit: '$12/day', power: '3400W', efficiency: '34 J/TH' },
  { id: 3, name: 'AvalonMiner 1246', price: '$4,200', image: '⚡', coin: 'BTC', hashrate: '90 TH/s', algorithm: 'SHA-256', profit: '$14/day', power: '3100W', efficiency: '34.4 J/TH' },
  { id: 4, name: 'Goldshell KD6', price: '$3,800', image: '🔩', coin: 'KAS', hashrate: '29.2 TH/s', algorithm: 'kHeavyHash', profit: '$18/day', power: '2350W', efficiency: '80.5 J/TH' },
  { id: 5, name: 'Aleo Miner F1', price: '$2,900', image: '💎', coin: 'ALEO', hashrate: '250 G/s', algorithm: 'AleoPoW', profit: '$16/day', power: '1200W', efficiency: '4.8 J/MH' },
  { id: 6, name: 'iPollo V1 Mini', price: '$1,200', image: '📱', coin: 'ETH', hashrate: '320 MH/s', algorithm: 'Ethash', profit: '$8/day', power: '220W', efficiency: '0.68 J/MH' },
];

/* ---------- Filters ---------- */

const filterOptions: { id: FilterType; name: string; icon: string }[] = [
  { id: 'all', name: 'All', icon: '🔍' },
  { id: 'btc', name: 'BTC', icon: '₿' },
  { id: 'kas', name: 'KAS', icon: '💠' },
  { id: 'aleo', name: 'ALEO', icon: '🔒' },
  { id: 'eth', name: 'ETH', icon: 'Ξ' },
  { id: 'sol', name: 'SOL', icon: '🟡' },
];

/* ---------- Component ---------- */

export default function SearchResultsPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const searchQuery = (params.query as string) || '';

  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'price-low' | 'price-high' | 'profit'>('relevance');
  const [showSortModal, setShowSortModal] = useState(false);
  const [searchInput, setSearchInput] = useState(searchQuery);

  const flatListRef = useRef<FlatList<Product>>(null);

  const filtered = allProducts.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.coin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.algorithm.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      activeFilter === 'all' || p.coin.toLowerCase() === activeFilter;

    return matchesSearch && matchesFilter;
  });

  const sorted = [...filtered].sort((a, b) => {
    const pa = parseFloat(a.price.replace('$', '').replace(',', ''));
    const pb = parseFloat(b.price.replace('$', '').replace(',', ''));
    const profA = parseFloat(a.profit.replace('$', ''));
    const profB = parseFloat(b.profit.replace('$', ''));

    if (sortBy === 'price-low') return pa - pb;
    if (sortBy === 'price-high') return pb - pa;
    if (sortBy === 'profit') return profB - profA;
    return 0;
  });

  useEffect(() => {
    flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
  }, [activeFilter, sortBy]);

  const renderProduct = ({ item }: { item: Product }) => (
    <Link href={`/(shop)/product/${item.id}`} asChild>
      <TouchableOpacity
        activeOpacity={0.85}
        className="w-[48%] bg-white rounded-xl p-3 border border-[#F2F2F7]"
      >
        {/* stable card height */}
        <View className="min-h-[190px]">
          <View className="h-28 bg-[#F2F2F7] rounded-lg items-center justify-center mb-2">
            <Text className="text-4xl">{item.image}</Text>
          </View>

          <Text className="text-sm font-semibold text-[#212529] mb-1" numberOfLines={2}>
            {item.name}
          </Text>

          <View className="flex-row justify-between mb-1">
            <Text className="text-base font-bold text-[#FFC000]">{item.price}</Text>
            <Text className="text-xs font-semibold text-green-600">{item.profit}</Text>
          </View>

          <View className="flex-row justify-between">
            <Text className="text-xs text-[#6C757D]">{item.coin}</Text>
            <Text className="text-[11px] text-[#8E8E93]" numberOfLines={1}>
              {item.hashrate}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F8F9FA]">
      {/* Header */}
      <View className="flex-row items-center px-4 py-3 border-b border-[#E9ECEF] bg-white">
        <TouchableOpacity onPress={() => router.back()} className="mr-3 p-1">
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>

        <View className="flex-1 flex-row items-center bg-[#F2F2F7] rounded-xl px-3 h-11">
          <Ionicons name="search-outline" size={18} color="#8E8E93" />
          <TextInput
            className="flex-1 ml-2"
            placeholder="Search miners..."
            value={searchInput}
            onChangeText={setSearchInput}
            onSubmitEditing={() => router.setParams({ query: searchInput })}
          />
          {!!searchInput && (
            <TouchableOpacity onPress={() => setSearchInput('')} className="p-1">
              <Ionicons name="close-circle" size={18} color="#8E8E93" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Results Header */}
      <View className="flex-row justify-between items-center px-4 py-2 border-b border-[#E9ECEF] bg-white">
        <View>
          <Text className="text-base font-semibold">{sorted.length} results</Text>
          <Text className="text-sm text-[#8E8E93]" numberOfLines={1}>
            for "{searchQuery}"
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => setShowSortModal(true)}
          className="flex-row items-center bg-[#FFF8E1] px-3 py-2 rounded-lg"
        >
          <Ionicons name="filter" size={14} color="#FFC000" />
          <Text className="mx-1 text-sm font-medium text-[#FFC000]">Sort</Text>
          <Ionicons name="chevron-down" size={14} color="#FFC000" />
        </TouchableOpacity>
      </View>

      {/* Filters */}
      <View className="bg-white border-b border-[#E9ECEF]">
        <View className="h-14 justify-center">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, alignItems: 'center' }}
          >
            {filterOptions.map(f => {
              const active = activeFilter === f.id;
              return (
                <TouchableOpacity
                  key={f.id}
                  onPress={() => setActiveFilter(f.id)}
                  className={`flex-row items-center justify-center h-10 px-4 rounded-full mr-2 border ${
                    active ? 'bg-[#FFF8E1] border-[#FFC000]' : 'bg-white border-[#E5E7EB]'
                  }`}
                >
                  <Text className="mr-2 text-base leading-[18px]">{f.icon}</Text>
                  <Text className={`text-sm font-medium ${active ? 'text-black' : 'text-[#6B7280]'}`} numberOfLines={1}>
                    {f.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>

      {/* Grid */}
      {sorted.length > 0 ? (
        <FlatList
          ref={flatListRef}
          data={sorted}
          renderItem={renderProduct}
          keyExtractor={i => i.id.toString()}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: 12 }}
          contentContainerStyle={{ padding: 16, paddingBottom: 28 }}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View className="flex-1 items-center justify-center px-6">
          <Ionicons name="search-outline" size={64} color="#E5E7EB" />
          <Text className="text-xl font-bold mt-4">No results found</Text>
          <Text className="text-[#8E8E93] text-center mt-2">Try adjusting your search or filters</Text>
          <TouchableOpacity
            onPress={() => {
              setActiveFilter('all');
              setSearchInput('');
            }}
            className="mt-6 bg-[#FFC000] px-6 py-3 rounded-lg"
          >
            <Text className="text-white font-semibold">Reset Filters</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Sort Modal */}
      <Modal transparent visible={showSortModal} animationType="fade">
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setShowSortModal(false)}
          className="flex-1 bg-black/50 items-center justify-center"
        >
          <View className="bg-white rounded-2xl p-5 w-[80%] max-w-xs">
            <Text className="text-lg font-bold text-center mb-4">Sort By</Text>

            {[
              { id: 'relevance', label: 'Relevance' },
              { id: 'price-low', label: 'Price: Low to High' },
              { id: 'price-high', label: 'Price: High to Low' },
              { id: 'profit', label: 'Best Profit' },
            ].map(o => (
              <TouchableOpacity
                key={o.id}
                onPress={() => {
                  setSortBy(o.id as any);
                  setShowSortModal(false);
                }}
                className="flex-row justify-between items-center py-3 border-b border-[#F2F2F7]"
              >
                <Text className={`text-base ${sortBy === o.id ? 'text-[#FFC000] font-semibold' : 'text-black'}`}>
                  {o.label}
                </Text>
                {sortBy === o.id && <Ionicons name="checkmark" size={18} color="#FFC000" />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
}
