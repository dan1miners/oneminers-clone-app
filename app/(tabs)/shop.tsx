import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useRef, useMemo, useCallback } from 'react';
import { Ionicons } from '@expo/vector-icons';

// Move static data outside component to prevent re-renders
const featuredBanners = [
  { id: 1, image: '🔄', title: 'Summer Sale', subtitle: 'Up to 30% OFF' },
  { id: 2, image: '🎯', title: 'New Arrivals', subtitle: 'Latest Mining Rigs' },
  { id: 3, image: '⚡', title: 'Flash Deal', subtitle: 'Limited Time Offer' },
];

const filterTags = ['All', 'BTC', 'KAS', 'ALEO', 'ETH', 'Others'];

const recommendedProducts = [
  { id: 1, name: 'Antminer S19 XP', price: '$4,200', image: '⚙️', coin: 'BTC' },
  { id: 2, name: 'Goldshell KD6', price: '$3,800', image: '🔧', coin: 'KAS' },
  { id: 3, name: 'Aleo Miner F1', price: '$2,900', image: '⚡', coin: 'ALEO' },
  { id: 4, name: 'Whatsminer M50', price: '$3,500', image: '🔩', coin: 'BTC' },
];

const allProducts = [
  { id: 1, name: 'Antminer S19 Pro', price: '$3,500', image: '⚙️', coin: 'BTC', hashrate: '110 TH/s', algorithm: 'SHA-256', profit: '$15/day' },
  { id: 2, name: 'Whatsminer M30S+', price: '$2,800', image: '🔧', coin: 'BTC', hashrate: '100 TH/s', algorithm: 'SHA-256', profit: '$12/day' },
  { id: 3, name: 'AvalonMiner 1246', price: '$4,200', image: '⚡', coin: 'BTC', hashrate: '90 TH/s', algorithm: 'SHA-256', profit: '$14/day' },
  { id: 4, name: 'Goldshell KD6', price: '$3,800', image: '🔩', coin: 'KAS', hashrate: '29.2 TH/s', algorithm: 'kHeavyHash', profit: '$18/day' },
  { id: 5, name: 'Aleo Miner F1', price: '$2,900', image: '💎', coin: 'ALEO', hashrate: '250 G/s', algorithm: 'AleoPoW', profit: '$16/day' },
  { id: 6, name: 'iPollo V1 Mini', price: '$1,200', image: '📱', coin: 'ETH', hashrate: '320 MH/s', algorithm: 'Ethash', profit: '$8/day' },
];

type BannerItem = {
  id: number;
  image: string;
  title: string;
  subtitle: string;
};

type ProductItem = {
  id: number;
  name: string;
  price: string;
  image: string;
  coin: string;
  hashrate?: string;
  algorithm?: string;
  profit?: string;
};

// Memoized components to prevent unnecessary re-renders
const FeaturedBanner = React.memo<{ item: BannerItem }>(({ item }) => (
  <View style={styles.banner}>
    <Text style={styles.bannerEmoji}>{item.image}</Text>
    <View style={styles.bannerText}>
      <Text style={styles.bannerTitle}>{item.title}</Text>
      <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
    </View>
  </View>
));

const ProductCard = React.memo<{ item: ProductItem; horizontal?: boolean }>(({ item, horizontal = false }) => (
  <TouchableOpacity style={[styles.productCard, horizontal && styles.horizontalCard]}>
    <View style={styles.productImage}>
      <Text style={styles.productEmoji}>{item.image}</Text>
    </View>
    <View style={styles.productInfo}>
      <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
      <Text style={styles.productPrice}>{item.price}</Text>
      {!horizontal && (
        <>
          <Text style={styles.productCoin}>{item.coin}</Text>
          <Text style={styles.productProfit}>{item.profit}</Text>
        </>
      )}
    </View>
  </TouchableOpacity>
));

export default function ShopScreen() {
  const [selectedTag, setSelectedTag] = useState('All');
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const searchBarWidth = useRef(new Animated.Value(0)).current;

  // Memoized filtered products
  const filteredProducts = useMemo(() => 
    selectedTag === 'All' 
      ? allProducts 
      : allProducts.filter(product => product.coin === selectedTag),
    [selectedTag]
  );

  // Memoized search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return allProducts.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.coin.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  // Optimized handlers with useCallback
  const handleSearchPress = useCallback(() => {
    if (showSearchBar) {
      // Hide search bar
      Animated.timing(searchBarWidth, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setShowSearchBar(false);
        setSearchQuery('');
        setIsSearching(false);
      });
    } else {
      // Show search bar
      setShowSearchBar(true);
      Animated.timing(searchBarWidth, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [showSearchBar, searchBarWidth]);

  const handleCloseSearch = useCallback(() => {
    Animated.timing(searchBarWidth, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setShowSearchBar(false);
      setSearchQuery('');
      setIsSearching(false);
    });
  }, [searchBarWidth]);

  const handleSearchSubmit = useCallback(() => {
    if (searchQuery.trim()) {
      setIsSearching(true);
    }
  }, [searchQuery]);

  const searchBarInterpolatedWidth = searchBarWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  // Memoized list renderers
  const renderFeaturedBanner = useCallback(({ item }: { item: BannerItem }) => (
    <FeaturedBanner item={item} />
  ), []);

  const renderProductCard = useCallback(({ item, horizontal = false }: { item: ProductItem; horizontal?: boolean }) => (
    <ProductCard item={item} horizontal={horizontal} />
  ), []);

  const renderTag = useCallback((tag: string) => (
    <TouchableOpacity
      key={tag}
      style={[styles.tag, selectedTag === tag && styles.tagSelected]}
      onPress={() => setSelectedTag(tag)}
    >
      <Text style={[styles.tagText, selectedTag === tag && styles.tagTextSelected]}>
        {tag}
      </Text>
    </TouchableOpacity>
  ), [selectedTag]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header with Search and Cart */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          {/* Animated Search Bar */}
          <Animated.View
            style={[
              styles.searchBarContainer,
              { width: searchBarInterpolatedWidth }
            ]}
          >
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
                    onSubmitEditing={handleSearchSubmit}
                    returnKeyType="search"
                  />
                  <TouchableOpacity onPress={handleCloseSearch}>
                    <Ionicons name="close-outline" size={24} color="#8E8E93" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </Animated.View>

          {/* Header actions: search + cart */}
          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={handleSearchPress}
            >
              <Ionicons 
                name={showSearchBar ? "search" : "search-outline"} 
                size={20} 
                color="#000" 
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Ionicons name="cart-outline" size={20} color="#000" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Main Content */}
      {isSearching ? (
        // Search Results View - Only shows when user submits search
        <View style={styles.searchResults}>
          <View style={styles.searchResultsHeader}>
            <TouchableOpacity onPress={() => setIsSearching(false)} style={styles.backButton}>
              <Ionicons name="arrow-back" size={24} color="#007AFF" />
            </TouchableOpacity>
            <Text style={styles.searchResultsTitle}>
              {searchResults.length} results for "{searchQuery}"
            </Text>
          </View>
          
          {searchResults.length > 0 ? (
            <ScrollView 
              style={styles.searchResultsList}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.productsGrid}>
                {searchResults.map(product => (
                  <ProductCard key={product.id} item={product} />
                ))}
              </View>
            </ScrollView>
          ) : (
            <View style={styles.placeholderResults}>
              <Ionicons name="search-outline" size={64} color="#E5E5EA" />
              <Text style={styles.placeholderText}>No results found</Text>
              <Text style={styles.placeholderSubtext}>Try different keywords</Text>
            </View>
          )}
        </View>
      ) : (
        // Main Shop Content
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
        >
          {/* Featured Banner Carousel */}
          <Text style={styles.sectionTitle}>Featured</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.bannerContainer}
            removeClippedSubviews={true}
          >
            {featuredBanners.map(banner => (
              <FeaturedBanner key={banner.id} item={banner} />
            ))}
          </ScrollView>

          {/* Recommended Section */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommended</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.recommendedContainer}
            removeClippedSubviews={true}
          >
            {recommendedProducts.map(product => (
              <ProductCard key={product.id} item={product} horizontal />
            ))}
          </ScrollView>

          {/* Filter Tags */}
          <Text style={styles.sectionTitle}>Browse by Coin</Text>
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.tagsContainer}
            removeClippedSubviews={true}
          >
            {filterTags.map(renderTag)}
          </ScrollView>

          {/* Products Grid */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>All Products</Text>
            <Text style={styles.productCount}>{filteredProducts.length} items</Text>
          </View>
          
          <View style={styles.productsGrid}>
            {filteredProducts.map(product => (
              <ProductCard key={product.id} item={product} />
            ))}
          </View>
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchBarContainer: {
    flexGrow: 1,
    marginRight: 12,
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
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    marginRight: 8,
    color: '#000000',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 12,
  },
  seeAllText: {
    color: '#007AFF',
    fontWeight: '600',
    fontSize: 14,
  },
  productCount: {
    color: '#6C757D',
    fontSize: 14,
  },
  bannerContainer: {
    marginBottom: 24,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#007AFF',
    borderRadius: 16,
    padding: 20,
    marginRight: 12,
    minWidth: 280,
  },
  bannerEmoji: {
    fontSize: 40,
    marginRight: 16,
  },
  bannerText: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#E7F3FF',
  },
  recommendedContainer: {
    marginBottom: 24,
  },
  tagsContainer: {
    marginBottom: 24,
  },
  tag: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  tagSelected: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  tagText: {
    color: '#6C757D',
    fontWeight: '600',
    fontSize: 14,
  },
  tagTextSelected: {
    color: '#FFFFFF',
  },
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  horizontalCard: {
    width: 160,
    marginRight: 12,
  },
  productImage: {
    width: '100%',
    height: 100,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
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
    marginBottom: 4,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007AFF',
    marginBottom: 2,
  },
  productCoin: {
    fontSize: 12,
    color: '#6C757D',
    marginBottom: 2,
  },
  productProfit: {
    fontSize: 12,
    color: '#28A745',
    fontWeight: '600',
  },
  searchResults: {
    flex: 1,
  },
  searchResultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  backButton: {
    marginRight: 12,
  },
  searchResultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#212529',
    flex: 1,
  },
  searchResultsList: {
    flex: 1,
    padding: 16,
  },
  placeholderResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  placeholderText: {
    marginTop: 16,
    fontSize: 18,
    color: '#8E8E93',
    fontWeight: '600',
    textAlign: 'center',
  },
  placeholderSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
});