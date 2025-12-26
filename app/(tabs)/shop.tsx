import { View, Text, ScrollView, TouchableOpacity, Animated, TextInput, Dimensions, FlatList } from 'react-native';
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
    <View className="rounded-2xl overflow-hidden mr-0" style={{ width: screenWidth - 32, height: 180, backgroundColor: item.backgroundColor }}>
      <View className="flex-1 flex-row p-5">
        <View className="flex-1 justify-center">
          <Text className="text-[22px] font-bold text-white mb-2">{item.title}</Text>
          <Text className="text-base text-white opacity-90 mb-4">{item.subtitle}</Text>
          <TouchableOpacity className="bg-white rounded-[20px] px-4 py-2 self-start">
            <Text className="text-sm font-semibold text-black">Shop Now</Text>
          </TouchableOpacity>
        </View>
        <View className="w-[120px] h-[120px] bg-white/20 rounded-xl justify-center items-center self-center">
          <Text className="text-white text-xs font-semibold text-center">📸 Banner Image</Text>
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
        className="h-2 rounded bg-[#FFC000] mx-1"
        style={{
          width: dotWidth,
          opacity: opacity,
        }}
      />
    );
  }, [scrollX]);

  return (
    <View className="mb-6">
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
      <View className="flex-row justify-center items-center mt-3">
        {featuredBanners.map((_, index) => renderDot(_, index))}
      </View>
    </View>
  );
};

// Memoized ProductCard component
const ProductCard = React.memo<{ item: ProductItem }>(({ item }) => (
  <Link href={`/(shop)/product/${item.id}`} asChild>
    <TouchableOpacity className="w-[48%] rounded-xl p-3 mb-3">
      <View className="w-full h-[120px] bg-gray-100 rounded-lg justify-center items-center mb-2">
        <Text className="text-4xl">{item.image}</Text>
      </View>
      <View className="flex-1">
        <Text className="text-sm font-semibold text-gray-900 mb-1.5" numberOfLines={1}>{item.name}</Text>
        
        {/* Compact row for price and profit */}
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-base font-bold text-[#FFC000]">{item.price}</Text>
          <Text className="text-xs text-[#34C759] font-semibold">{item.profit}</Text>
        </View>
        
        {/* Coin and hashrate info */}
        <View className="flex-row justify-between items-center">
          <Text className="text-xs text-gray-600 font-medium">{item.coin}</Text>
          <Text className="text-[11px] text-gray-400 flex-1 text-right ml-1" numberOfLines={1}>{item.hashrate}</Text>
        </View>
      </View>
    </TouchableOpacity>
  </Link>
));

// New CategoryItem Component
const CategoryItem = React.memo<{ item: { id: string; name: string; icon: string }; onPress: () => void }>(({ item, onPress }) => (
  <TouchableOpacity className="items-center mr-5" onPress={onPress} activeOpacity={0.7}>
    <View className="w-[60px] h-[60px] rounded-full bg-gray-100 items-center justify-center mb-2">
      <Text className="text-[28px]">{item.icon}</Text>
    </View>
    <Text className="text-xs text-gray-900 font-medium text-center">{item.name}</Text>
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
    <SafeAreaView className="flex-1 bg-gray-50" edges={['top']}>
      {/* Header with Search and Cart */}
      <View className="px-4 py-3 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <Animated.View
            className="flex-grow mr-3"
            style={{ width: searchBarInterpolatedWidth }}
          >
            {showSearchBar && (
              <View className="flex-1">
                <View className="flex-row items-center bg-gray-100 rounded-xl px-3 h-10">
                  <Ionicons name="search-outline" size={20} color="#8E8E93" />
                  <TextInput
                    className="flex-1 text-base ml-2 mr-2 text-black py-1"
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

          <View className="flex-row items-center">
            <TouchableOpacity
              className="w-9 h-9 rounded-xl bg-gray-100 items-center justify-center ml-2"
              onPress={handleSearchPress}
            >
              <Ionicons 
                name={showSearchBar && searchQuery ? "search" : "search-outline"} 
                size={20} 
                color={showSearchBar && searchQuery ? "#007AFF" : "#000"} 
              />
            </TouchableOpacity>
            <Link href="/cart" asChild>
              <TouchableOpacity className="w-9 h-9 rounded-xl bg-gray-100 items-center justify-center ml-2">
                <Ionicons name="cart-outline" size={20} color="#000" />
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
        <ScrollView 
          className="flex-1 p-4" 
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
        >
          {/* Featured Banner Carousel */}
          <BannerCarousel />
          <View className="mb-3">
            <Text className="text-lg font-bold text-gray-900">Coins</Text>
          </View>
          {/* Categories Section */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false} 
            className="mb-5"
            contentContainerStyle={{ paddingRight: 16 }}
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
          <View className="mb-3">
            <Text className="text-lg font-bold text-gray-900">For You</Text>
          </View>
          
          <View className="flex-row flex-wrap justify-between pb-4">
            {allProducts.map(product => (
              <ProductCard key={product.id} item={product} />
            ))}
          </View>
        </ScrollView>
    </SafeAreaView>
  );
}
