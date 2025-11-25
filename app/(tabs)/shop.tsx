import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, TextInput, Dimensions, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';

const { width: screenWidth } = Dimensions.get('window');

// Move static data outside component to prevent re-renders
const featuredBanners = [
  { 
    id: 1, 
    image: '🔄', 
    title: 'Summer Sale', 
    subtitle: 'Up to 30% OFF on Mining Rigs',
    backgroundColor: '#007AFF'
  },
  { 
    id: 2, 
    image: '🎯', 
    title: 'New Arrivals', 
    subtitle: 'Latest Mining Equipment',
    backgroundColor: '#34C759'
  },
  { 
    id: 3, 
    image: '⚡', 
    title: 'Flash Deal', 
    subtitle: 'Limited Time Offers',
    backgroundColor: '#FF9500'
  },
  { 
    id: 4, 
    image: '🔥', 
    title: 'Hot Products', 
    subtitle: 'Best Selling Miners',
    backgroundColor: '#FF3B30'
  },
];

const filterTags = ['All', 'BTC', 'KAS', 'ALEO', 'ETH', 'Others'];

// Updated products with consistent information
const recommendedProducts = [
  { id: 1, name: 'Antminer S19 XP', price: '$4,200', image: '⚙️', coin: 'BTC', hashrate: '140 TH/s', algorithm: 'SHA-256', profit: '$18/day' },
  { id: 2, name: 'Goldshell KD6', price: '$3,800', image: '🔧', coin: 'KAS', hashrate: '29.2 TH/s', algorithm: 'kHeavyHash', profit: '$22/day' },
  { id: 3, name: 'Aleo Miner F1', price: '$2,900', image: '⚡', coin: 'ALEO', hashrate: '250 G/s', algorithm: 'AleoPoW', profit: '$16/day' },
  { id: 4, name: 'Whatsminer M50', price: '$3,500', image: '🔩', coin: 'BTC', hashrate: '118 TH/s', algorithm: 'SHA-256', profit: '$17/day' },
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
  backgroundColor: string;
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

// Auto-scrolling Carousel Component
const BannerCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const scrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % featuredBanners.length;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({
        index: nextIndex,
        animated: true,
      });
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [currentIndex]);

  const onViewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems[0]) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 50,
  }).current;

  const renderBannerItem = useCallback(({ item, index }: { item: BannerItem; index: number }) => (
    <View style={[styles.bannerItem, { backgroundColor: item.backgroundColor }]}>
      <View style={styles.bannerContent}>
        <View style={styles.bannerTextContainer}>
          <Text style={styles.bannerTitle}>{item.title}</Text>
          <Text style={styles.bannerSubtitle}>{item.subtitle}</Text>
          <TouchableOpacity style={styles.bannerButton}>
            <Text style={styles.bannerButtonText}>Shop Now</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.bannerImagePlaceholder}>
          <Text style={styles.bannerImageText}>📸 Banner Image</Text>
        </View>
      </View>
    </View>
  ), []);

  const renderDot = useCallback((_: any, index: number) => {
    const inputRange = [
      (index - 1) * screenWidth,
      index * screenWidth,
      (index + 1) * screenWidth,
    ];

    const dotWidth = scrollX.interpolate({
      inputRange,
      outputRange: [8, 20, 8],
      extrapolate: 'clamp',
    });

    const opacity = scrollX.interpolate({
      inputRange,
      outputRange: [0.3, 1, 0.3],
      extrapolate: 'clamp',
    });

    return (
      <Animated.View
        key={index}
        style={[
          styles.dot,
          {
            width: dotWidth,
            opacity: opacity,
          },
        ]}
      />
    );
  }, [scrollX]);

  return (
    <View style={styles.carouselContainer}>
      <FlatList
        ref={flatListRef}
        data={featuredBanners}
        renderItem={renderBannerItem}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        getItemLayout={(_, index) => ({
          length: screenWidth - 32,
          offset: (screenWidth - 32) * index,
          index,
        })}
      />
      <View style={styles.dotsContainer}>
        {featuredBanners.map((_, index) => renderDot(_, index))}
      </View>
    </View>
  );
};

// Memoized components to prevent unnecessary re-renders
const ProductCard = React.memo<{ item: ProductItem; horizontal?: boolean }>(({ item, horizontal = false }) => (
  <TouchableOpacity style={[styles.productCard, horizontal && styles.horizontalCard]}>
    <View style={styles.productImage}>
      <Text style={styles.productEmoji}>{item.image}</Text>
    </View>
    <View style={styles.productInfo}>
      <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
      
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
          <BannerCarousel />

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
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 12,
  },
  seeAllText: {
    color: '#6C757D',
    fontWeight: '600',
    fontSize: 14,
  },
  productCount: {
    color: '#6C757D',
    fontSize: 14,
  },
  // Carousel Styles
  carouselContainer: {
    marginBottom: 24,
  },
  bannerItem: {
    width: screenWidth - 32,
    height: 250,
    borderRadius: 16,
    marginRight: 0,
    overflow: 'hidden',
  },
  bannerContent: {
    flex: 1,
    flexDirection: 'row',
    padding: 20,
  },
  bannerTextContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  bannerSubtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.9,
    marginBottom: 16,
  },
  bannerButton: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  bannerImagePlaceholder: {
    width: 120,
    height: 120,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  bannerImageText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 12,
  },
  dot: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFC000',
    marginHorizontal: 4,
  },
  recommendedContainer: {
    marginBottom: 20,
  },
  tagsContainer: {
    marginBottom: 20,
  },
  tag: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E9ECEF',
  },
  tagSelected: {
    backgroundColor: '#FFC000',
    borderColor: '#FFC000',
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
    paddingBottom: 16,
  },
  productCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    width: '48%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  horizontalCard: {
    width: 160,
    marginRight: 12,
    padding: 10,
  },
  //Recommended and All Products Card Styles
  productImage: {
    width: '100%',
    height: 150,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  productEmoji: {
    fontSize: 32,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 13,
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
    fontSize: 15,
    fontWeight: '700',
    color: '#FFC000',
  },
  productProfit: {
    fontSize: 11,
    color: '#34C759',
    fontWeight: '600',
  },
  productDetails: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productCoin: {
    fontSize: 11,
    color: '#6C757D',
    fontWeight: '500',
  },
  productHashrate: {
    fontSize: 10,
    color: '#8E8E93',
    flex: 1,
    textAlign: 'right',
    marginLeft: 4,
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