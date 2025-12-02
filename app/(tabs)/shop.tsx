import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Animated, TextInput, Dimensions, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useRef, useMemo, useCallback, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';

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

// Updated categories to be a list of coins
const categories = [
  { id: 'BTC', name: 'BTC', icon: '₿' },
  { id: 'KAS', name: 'KAS', icon: '💠' },
  { id: 'ALEO', name: 'ALEO', icon: '🔒' },
  { id: 'ETC', name: 'ETC', icon: '💚' },
  { id: 'DOGE', name: 'DOGE', icon: '🐕' },
  { id: 'SEC', name: 'SEC', icon: '🛡️' },
  { id: 'ALPH', name: 'ALPH', icon: '⚛️' },
  { id: 'CKB', name: 'CKB', icon: '🧱' },
  { id: 'DASH', name: 'DASH', icon: '💨' },
  { id: 'KDA', name: 'KDA', icon: '🔗' },
  { id: 'XTM', name: 'XTM', icon: '💎' },
];

// All products will be displayed in the main grid
const allProducts = [
  { id: 1, name: 'Antminer S19 Pro', price: '$3,500', image: '⚙️', coin: 'BTC', hashrate: '110 TH/s', algorithm: 'SHA-256', profit: '$15/day' },
  { id: 2, name: 'Whatsminer M30S+', price: '$2,800', image: '🔧', coin: 'BTC', hashrate: '100 TH/s', algorithm: 'SHA-256', profit: '$12/day' },
  { id: 3, name: 'AvalonMiner 1246', price: '$4,200', image: '⚡', coin: 'BTC', hashrate: '90 TH/s', algorithm: 'SHA-256', profit: '$14/day' },
  { id: 4, name: 'Goldshell KD6', price: '$3,800', image: '🔩', coin: 'KAS', hashrate: '29.2 TH/s', algorithm: 'kHeavyHash', profit: '$18/day' },
  { id: 5, name: 'Aleo Miner F1', price: '$2,900', image: '💎', coin: 'ALEO', hashrate: '250 G/s', algorithm: 'AleoPoW', profit: '$16/day' },
  { id: 6, name: 'iPollo V1 Mini', price: '$1,200', image: '📱', coin: 'ETH', hashrate: '320 MH/s', algorithm: 'Ethash', profit: '$8/day' },
  { id: 7, name: 'Antminer S19 XP', price: '$4,200', image: '⚙️', coin: 'BTC', hashrate: '140 TH/s', algorithm: 'SHA-256', profit: '$18/day' },
  { id: 8, name: 'Whatsminer M50', price: '$3,500', image: '🔩', coin: 'BTC', hashrate: '118 TH/s', algorithm: 'SHA-256', profit: '$17/day' },
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

// Memoized ProductCard component
const ProductCard = React.memo<{ item: ProductItem }>(({ item }) => (
  <Link href={`/(shop)/product/${item.id}`} asChild>
  <TouchableOpacity style={styles.productCard}>
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
  </Link>
));

// New CategoryItem Component
const CategoryItem = React.memo<{ item: { id: string; name: string; icon: string }; onPress: () => void }>(({ item, onPress }) => (
  <TouchableOpacity style={styles.categoryItem} onPress={onPress} activeOpacity={0.7}>
    <View style={styles.categoryAvatar}>
      <Text style={styles.categoryIcon}>{item.icon}</Text>
    </View>
    <Text style={styles.categoryName}>{item.name}</Text>
  </TouchableOpacity>
));


export default function ShopScreen() {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchBarWidth = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  // Placeholder function for category press
  const handleCategoryPress = useCallback((categoryId: string) => {
    console.log(`Category pressed: ${categoryId}`);
    router.push(`/(essentials)/search/${categoryId}`);
    // Future functionality will go here
  }, []);

  // Handle search submission
  const handleSearchSubmit = useCallback(() => {
    if (searchQuery.trim()) {
      // Navigate to search results page with the query as parameter
      router.push(`/(essentials)/search/${encodeURIComponent(searchQuery.trim())}`);
      // Close search bar after submission
      handleCloseSearch();
    }
  }, [searchQuery, router]);

  // Optimized handlers with useCallback
  const handleSearchPress = useCallback(() => {
    if (showSearchBar) {
      // If search bar is already open and has text, submit the search
      if (searchQuery.trim()) {
        handleSearchSubmit();
      } else {
        // Otherwise close the search bar
        Animated.timing(searchBarWidth, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }).start(() => {
          setShowSearchBar(false);
          setSearchQuery('');
        });
      }
    } else {
      setShowSearchBar(true);
      Animated.timing(searchBarWidth, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [showSearchBar, searchBarWidth, searchQuery, handleSearchSubmit]);

  const handleCloseSearch = useCallback(() => {
    Animated.timing(searchBarWidth, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      setShowSearchBar(false);
      setSearchQuery('');
    });
  }, [searchBarWidth]);

  const searchBarInterpolatedWidth = searchBarWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header with Search and Cart */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
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
                  {searchQuery ? (
                    <TouchableOpacity onPress={handleSearchSubmit}>
                      <Ionicons name="search-outline" size={24} color="#007AFF" />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity onPress={handleCloseSearch}>
                      <Ionicons name="close-outline" size={24} color="#8E8E93" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
          </Animated.View>

          <View style={styles.headerActions}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={handleSearchPress}
            >
              <Ionicons 
                name={showSearchBar && searchQuery ? "search" : "search-outline"} 
                size={20} 
                color={showSearchBar && searchQuery ? "#007AFF" : "#000"} 
              />
            </TouchableOpacity>
            <Link href="/cart" asChild>
              <TouchableOpacity style={styles.headerButton}>
                <Ionicons name="cart-outline" size={20} color="#000" />
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
        >
          {/* Featured Banner Carousel */}
          <BannerCarousel />
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Coins</Text>
          </View>
          {/* Categories Section */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            style={styles.categoriesContainer}
            contentContainerStyle={styles.categoriesContentContainer}
          >
            {categories.map(category => (
              <CategoryItem
                key={category.id}
                item={category}
                onPress={() => handleCategoryPress(category.id)}
              />
            ))}
          </ScrollView>

          {/* Products Grid */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>For You</Text>
          </View>
          
          <View style={styles.productsGrid}>
            {allProducts.map(product => (
              <ProductCard key={product.id} item={product} />
            ))}
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
    height: 40,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    marginLeft: 8,
    marginRight: 8,
    color: '#000000',
    paddingVertical: 4,
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
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
  },
  // Carousel Styles
  carouselContainer: {
    marginBottom: 24,
  },
  bannerItem: {
    width: screenWidth - 32,
    height: 180,
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
  // Categories Styles
  categoriesContainer: {
    marginBottom: 20,
  },
  categoriesContentContainer: {
    paddingRight: 16,
  },
  categoryItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  categoryAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  categoryIcon: {
    fontSize: 28,
  },
  categoryName: {
    fontSize: 12,
    color: '#212529',
    fontWeight: '500',
    textAlign: 'center',
  },
  // Products Grid Styles
  productsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 16,
  },
  productCard: {
    width: '48%',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
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
});