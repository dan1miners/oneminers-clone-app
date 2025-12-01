import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// --- Types ---

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

// --- Mock Data ---

const allProducts: Product[] = [
  { id: 1, name: 'Antminer S19 Pro', price: '$3,500', image: '⚙️', coin: 'BTC', hashrate: '110 TH/s', algorithm: 'SHA-256', profit: '$15/day', power: '3250W', efficiency: '29.5 J/TH' },
  { id: 2, name: 'Whatsminer M30S+', price: '$2,800', image: '🔧', coin: 'BTC', hashrate: '100 TH/s', algorithm: 'SHA-256', profit: '$12/day', power: '3400W', efficiency: '34 J/TH' },
  { id: 3, name: 'AvalonMiner 1246', price: '$4,200', image: '⚡', coin: 'BTC', hashrate: '90 TH/s', algorithm: 'SHA-256', profit: '$14/day', power: '3100W', efficiency: '34.4 J/TH' },
  { id: 4, name: 'Goldshell KD6', price: '$3,800', image: '🔩', coin: 'KAS', hashrate: '29.2 TH/s', algorithm: 'kHeavyHash', profit: '$18/day', power: '2350W', efficiency: '80.5 J/TH' },
  { id: 5, name: 'Aleo Miner F1', price: '$2,900', image: '💎', coin: 'ALEO', hashrate: '250 G/s', algorithm: 'AleoPoW', profit: '$16/day', power: '1200W', efficiency: '4.8 J/MH' },
  { id: 6, name: 'iPollo V1 Mini', price: '$1,200', image: '📱', coin: 'ETH', hashrate: '320 MH/s', algorithm: 'Ethash', profit: '$8/day', power: '220W', efficiency: '0.68 J/MH' },
  { id: 7, name: 'Antminer S19 XP', price: '$4,200', image: '⚙️', coin: 'BTC', hashrate: '140 TH/s', algorithm: 'SHA-256', profit: '$18/day', power: '3010W', efficiency: '21.5 J/TH' },
  { id: 8, name: 'Whatsminer M50', price: '$3,500', image: '🔩', coin: 'BTC', hashrate: '118 TH/s', algorithm: 'SHA-256', profit: '$17/day', power: '3276W', efficiency: '27.8 J/TH' },
  { id: 9, name: 'Goldshell HS Box', price: '$1,800', image: '📦', coin: 'KAS', hashrate: '1.6 TH/s', algorithm: 'kHeavyHash', profit: '$9/day', power: '160W', efficiency: '100 J/TH' },
  { id: 10, name: 'Aleo Miner X1', price: '$3,200', image: '💎', coin: 'ALEO', hashrate: '500 G/s', algorithm: 'AleoPoW', profit: '$22/day', power: '1500W', efficiency: '3 J/MH' },
  { id: 11, name: 'Antminer L7', price: '$5,000', image: '⚙️', coin: 'LTC', hashrate: '9.5 GH/s', algorithm: 'Scrypt', profit: '$25/day', power: '3425W', efficiency: '0.36 J/MH' },
  { id: 12, name: 'iPollo G1 Mini', price: '$800', image: '📱', coin: 'ETH', hashrate: '26 MH/s', algorithm: 'Ethash', profit: '$4/day', power: '210W', efficiency: '8.07 J/MH' },
];

// Filter options
const filterOptions = [
  { id: 'all' as FilterType, name: 'All', icon: '🔍' },
  { id: 'btc' as FilterType, name: 'BTC', icon: '₿' },
  { id: 'kas' as FilterType, name: 'KAS', icon: '💠' },
  { id: 'aleo' as FilterType, name: 'ALEO', icon: '🔒' },
  { id: 'eth' as FilterType, name: 'ETH', icon: 'Ξ' },
  { id: 'sol' as FilterType, name: 'SOL', icon: '🟡' },
];

// --- Main Component ---

export default function SearchResultsPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const searchQuery = params.query as string || '';
  
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [sortBy, setSortBy] = useState<'relevance' | 'price-low' | 'price-high' | 'profit'>('relevance');
  const [showSortModal, setShowSortModal] = useState(false);
  const [searchInput, setSearchInput] = useState(searchQuery);
  const flatListRef = useRef<FlatList>(null);

  // Filter and sort products
  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.coin.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         product.algorithm.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = activeFilter === 'all' || product.coin.toLowerCase() === activeFilter;
    
    return matchesSearch && matchesFilter;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return parseFloat(a.price.replace('$', '').replace(',', '')) - parseFloat(b.price.replace('$', '').replace(',', ''));
      case 'price-high':
        return parseFloat(b.price.replace('$', '').replace(',', '')) - parseFloat(a.price.replace('$', '').replace(',', ''));
      case 'profit':
        return parseFloat(b.profit.replace('$', '')) - parseFloat(a.profit.replace('$', ''));
      case 'relevance':
      default:
        return 0;
    }
  });

  // Scroll to top when filter changes
  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
    }
  }, [activeFilter, sortBy]);

  const handleBackPress = () => {
    router.back();
  };

  const handleSearch = () => {
    if (searchInput.trim()) {
      router.setParams({ query: searchInput.trim() });
    }
  };

  const handleProductPress = (product: Product) => {
    // In a real app, you would navigate to product detail page
    console.log('Product pressed:', product.name);
  };

  const handleAddToCart = (product: Product) => {
    // In a real app, you would add to cart logic here
    console.log('Added to cart:', product.name);
  };

  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity 
      style={styles.productCard}
      onPress={() => handleProductPress(item)}
    >
      <View style={styles.productImage}>
        <Text style={styles.productEmoji}>{item.image}</Text>
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        
        {/* Compact row for price and profit */}
        <View style={styles.priceProfitRow}>
          <Text style={styles.productPrice}>{item.price}</Text>
          <Text style={styles.productProfit}>{item.profit}</Text>
        </View>
        
        {/* Coin and hashrate info */}
        <View style={styles.productDetails}>
          <Text style={styles.productCoin}>{item.coin}</Text>
          <Text style={styles.productHashrate} numberOfLines={1}>{item.hashrate}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFilterButton = (filter: typeof filterOptions[0]) => (
    <TouchableOpacity
      key={filter.id}
      style={[
        styles.filterChip,
        activeFilter === filter.id && styles.filterChipActive
      ]}
      onPress={() => setActiveFilter(filter.id)}
    >
      <Text style={styles.filterChipIcon}>{filter.icon}</Text>
      <Text style={[
        styles.filterChipText,
        activeFilter === filter.id && styles.filterChipTextActive
      ]}>
        {filter.name}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Ionicons name="search-outline" size={20} color="#8E8E93" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search miners..."
            value={searchInput}
            onChangeText={setSearchInput}
            onSubmitEditing={handleSearch}
            placeholderTextColor="#8E8E93"
            returnKeyType="search"
          />
          {searchInput.length > 0 && (
            <TouchableOpacity onPress={() => setSearchInput('')}>
              <Ionicons name="close-circle" size={20} color="#8E8E93" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Results Info and Sort */}
      <View style={styles.resultsHeader}>
        <View style={styles.resultsInfo}>
          <Text style={styles.resultsCount}>
            {sortedProducts.length} {sortedProducts.length === 1 ? 'result' : 'results'}
          </Text>
          <Text style={styles.searchQuery}>for "{searchQuery}"</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.sortButton}
          onPress={() => setShowSortModal(true)}
        >
          <Ionicons name="filter" size={16} color="#007AFF" />
          <Text style={styles.sortButtonText}>
            {sortBy === 'relevance' ? 'Relevance' :
             sortBy === 'price-low' ? 'Price: Low to High' :
             sortBy === 'price-high' ? 'Price: High to Low' : 'Best Profit'}
          </Text>
          <Ionicons name="chevron-down" size={16} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {/* Filter Chips */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filtersContainer}
        contentContainerStyle={styles.filtersContent}
      >
        {filterOptions.map(renderFilterButton)}
      </ScrollView>

      {/* Products Grid */}
      {sortedProducts.length > 0 ? (
        <FlatList
          ref={flatListRef}
          data={sortedProducts}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProductItem}
          numColumns={2}
          contentContainerStyle={styles.productsGrid}
          showsVerticalScrollIndicator={false}
          columnWrapperStyle={styles.columnWrapper}
          // Key prop to help React identify when to reset scroll position
          key={`${activeFilter}-${sortBy}`}
          // Maintain scroll position better
          maintainVisibleContentPosition={{
            minIndexForVisible: 0,
          }}
        />
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="search-outline" size={64} color="#E9ECEF" />
          <Text style={styles.emptyTitle}>No results found</Text>
          <Text style={styles.emptySubtitle}>
            Try adjusting your search or filters
          </Text>
          <TouchableOpacity 
            style={styles.resetButton}
            onPress={() => {
              setActiveFilter('all');
              setSearchInput('');
            }}
          >
            <Text style={styles.resetButtonText}>Reset Filters</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Sort Modal */}
      {showSortModal && (
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Sort By</Text>
            
            {[
              { id: 'relevance', label: 'Relevance' },
              { id: 'price-low', label: 'Price: Low to High' },
              { id: 'price-high', label: 'Price: High to Low' },
              { id: 'profit', label: 'Best Profit' },
            ].map((option) => (
              <TouchableOpacity
                key={option.id}
                style={styles.sortOption}
                onPress={() => {
                  setSortBy(option.id as any);
                  setShowSortModal(false);
                }}
              >
                <Text style={styles.sortOptionText}>{option.label}</Text>
                {sortBy === option.id && (
                  <Ionicons name="checkmark" size={20} color="#007AFF" />
                )}
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity 
              style={styles.closeModalButton}
              onPress={() => setShowSortModal(false)}
            >
              <Text style={styles.closeModalText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
    marginRight: 12,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    marginRight: 8,
    color: '#000000',
    paddingVertical: 4,
  },
  resultsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  resultsInfo: {
    flex: 1,
  },
  resultsCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  searchQuery: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  sortButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0F8FF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  sortButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#007AFF',
    marginHorizontal: 4,
  },
  filtersContainer: {
    marginBottom: 8, // Reduced from 16 to 8 to decrease space
  },
  filtersContent: {
    paddingHorizontal: 16,
  },
  // Fixed Filter Chip Styles
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    height: 36, // Fixed height for consistency
    borderRadius: 18, // Half of height for perfect rounded shape
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  filterChipActive: {
    backgroundColor: '#FFC000',
    borderColor: '#FFC000',
  },
  filterChipIcon: {
    fontSize: 16, // Consistent icon size
    marginRight: 6,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  filterChipTextActive: {
    color: '#000000',
  },
  // Products Grid - Removed top padding to reduce space
  productsGrid: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 0, // Ensure no top padding
  },
  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  productCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 120,
    backgroundColor: '#F2F2F7',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  productEmoji: {
    fontSize: 40,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212529',
    marginBottom: 6,
  },
  priceProfitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFC000',
  },
  productProfit: {
    fontSize: 12,
    color: '#34C759',
    fontWeight: '600',
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productCoin: {
    fontSize: 12,
    color: '#6C757D',
    fontWeight: '500',
  },
  productHashrate: {
    fontSize: 11,
    color: '#8E8E93',
    flex: 1,
    textAlign: 'right',
    marginLeft: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 24,
  },
  resetButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  resetButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
    textAlign: 'center',
  },
  sortOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  sortOptionText: {
    fontSize: 16,
    color: '#000000',
  },
  closeModalButton: {
    marginTop: 16,
    padding: 12,
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
  },
  closeModalText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
});