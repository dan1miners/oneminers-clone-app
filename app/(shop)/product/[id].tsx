import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  Modal,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');

// Mock product data
const PRODUCTS_DATA = {
  1: {
    id: 1,
    name: 'Antminer S19 Pro',
    price: '$3,500',
    originalPrice: '$4,200',
    discount: '17% off',
    rating: 4.8,
    reviewCount: 128,
    images: ['⚙️', '🔧', '⚡', '🔩'],
    coin: 'BTC',
    hashrate: '110 TH/s',
    algorithm: 'SHA-256',
    profit: '$15/day',
    power: '3250W',
    efficiency: '29.5 J/TH',
    noiseLevel: '75 dB',
    dimensions: '400 x 195 x 290 mm',
    weight: '14.2 kg',
    warranty: '180 days',
    stock: 12,
    brand: 'Bitmain',
    model: 'S19 Pro',
    description:
      'The Antminer S19 Pro is one of the most efficient and powerful Bitcoin miners on the market. With its advanced cooling system and high hashrate, it delivers exceptional performance for professional mining operations.',
    features: [
      'High efficiency with 29.5 J/TH',
      'Advanced cooling system',
      'Low noise operation',
      'Easy setup and configuration',
      'Remote monitoring capability',
    ],
    specifications: {
      Manufacturer: 'Bitmain',
      Model: 'Antminer S19 Pro',
      'Release Date': 'March 2020',
      Size: '400 x 195 x 290 mm',
      Weight: '14.2 kg',
      'Noise Level': '75 dB',
      'Fan(s)': '2 x 12038 Fans',
      Power: '3250W',
      Voltage: '200-240V',
      Interface: 'Ethernet',
      Temperature: '5 - 40 °C',
      Humidity: '5 - 95 %',
    },
  },
  2: {
    id: 2,
    name: 'Whatsminer M30S+',
    price: '$2,800',
    originalPrice: '$3,400',
    discount: '18% off',
    rating: 4.5,
    reviewCount: 94,
    images: ['🔧', '⚙️', '⚡', '🔩'],
    coin: 'BTC',
    hashrate: '100 TH/s',
    algorithm: 'SHA-256',
    profit: '$12/day',
    power: '3400W',
    efficiency: '34 J/TH',
    noiseLevel: '82 dB',
    dimensions: '390 x 190 x 290 mm',
    weight: '13.8 kg',
    warranty: '180 days',
    stock: 8,
    brand: 'MicroBT',
    model: 'M30S+',
    description:
      'The Whatsminer M30S+ offers reliable performance with competitive efficiency. Built for durability and consistent mining output.',
    features: [
      '100 TH/s hashrate',
      'Stable performance',
      'Robust construction',
      'Easy maintenance',
      'Global voltage support',
    ],
    specifications: {
      Manufacturer: 'MicroBT',
      Model: 'Whatsminer M30S+',
      'Release Date': 'April 2020',
      Size: '390 x 190 x 290 mm',
      Weight: '13.8 kg',
      'Noise Level': '82 dB',
      'Fan(s)': '2 x 12038 Fans',
      Power: '3400W',
      Voltage: '200-240V',
      Interface: 'Ethernet',
      Temperature: '0 - 40 °C',
      Humidity: '5 - 95 %',
    },
  },
};

type Product = typeof PRODUCTS_DATA[1];

export default function ProductDetailsPage() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const productId = params.id ? parseInt(params.id as string) : 1;

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedSpecTab, setSelectedSpecTab] = useState<'overview' | 'specs' | 'reviews'>('overview');

  // NEW UI states
  const [isLiked, setIsLiked] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [shareOpen, setShareOpen] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);

  const product: Product =
    PRODUCTS_DATA[productId as keyof typeof PRODUCTS_DATA] || PRODUCTS_DATA[1];

  const handleBackPress = () => router.back();

  const handleIncrementQuantity = () => {
    if (quantity < product.stock) setQuantity((p) => p + 1);
  };

  const handleDecrementQuantity = () => {
    if (quantity > 1) setQuantity((p) => p - 1);
  };

  const handleAddToCart = () => {
    setCartCount((c) => c + quantity);

    Alert.alert(
      'Added to Cart',
      `${quantity} × ${product.name} has been added to your cart.`,
      [
        { text: 'OK', style: 'cancel' },
        { text: 'View Cart', onPress: () => router.push('/cart') },
      ]
    );
  };

  const handleBuyNow = () => {
    // Direct to checkout (simple + clean)
    router.push({
      pathname: '/checkout',
      params: { id: String(product.id), qty: String(quantity) },
    });
  };

  const handleSupport = () => {
    Alert.alert(
      'Get Expert Support',
      'Our mining experts are ready to help you with setup, configuration, and optimization.',
      [{ text: 'Close', style: 'cancel' }]
    );
  };

  const handleQuickAdd = () => {
    setQuantity(1);
    setCartCount((c) => c + 1);
    Alert.alert('Added to Cart', `1 × ${product.name} has been added to your cart.`);
  };

  const renderStars = (rating: number) => {
    const stars: React.ReactNode[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Ionicons key={`full-${i}`} name="star" size={16} color="#FFC000" />);
    }

    if (hasHalfStar) {
      stars.push(<Ionicons key="half" name="star-half" size={16} color="#FFC000" />);
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Ionicons key={`empty-${i}`} name="star-outline" size={16} color="#FFC000" />);
    }
    return stars;
  };

  const formatPrice = (price: string, qty: number) => {
    const numericPrice = parseFloat(price.replace('$', '').replace(',', ''));
    const total = numericPrice * qty;
    return `$${total.toLocaleString()}`;
  };

  const calculateSavings = () => {
    if (!product.originalPrice) return 0;
    const currentPrice = parseFloat(product.price.replace('$', '').replace(',', ''));
    const originalPrice = parseFloat(product.originalPrice.replace('$', '').replace(',', ''));
    return originalPrice - currentPrice;
  };

  const isOverview = selectedSpecTab === 'overview';
  const isSpecs = selectedSpecTab === 'specs';
  const isReviews = selectedSpecTab === 'reviews';

  return (
    <SafeAreaView className="flex-1 bg-white" edges={['top']}>
      {/* Header (simpler + pro) */}
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-[#F2F2F7] bg-white">
        <TouchableOpacity onPress={handleBackPress} className="p-1">
          <Ionicons name="arrow-back" size={22} color="#111827" />
        </TouchableOpacity>

        <View className="flex-row items-center">
          {/* Cart with badge */}
          <TouchableOpacity onPress={() => router.push('/cart')} className="w-10 h-10 rounded-full bg-[#F2F2F7] items-center justify-center mr-2">
            <Ionicons name="cart-outline" size={20} color="#111827" />
            {cartCount > 0 && (
              <View className="absolute -top-1 -right-1 bg-[#FFC000] rounded-full min-w-[18px] h-[18px] px-1 items-center justify-center border border-white">
                <Text className="text-[10px] font-extrabold text-black">
                  {cartCount > 99 ? '99+' : cartCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Share */}
          <TouchableOpacity onPress={() => setShareOpen(true)} className="w-10 h-10 rounded-full bg-[#F2F2F7] items-center justify-center mr-2">
            <Ionicons name="share-outline" size={20} color="#111827" />
          </TouchableOpacity>

          {/* Like */}
          <TouchableOpacity onPress={() => setIsLiked((v) => !v)} className="w-10 h-10 rounded-full bg-[#F2F2F7] items-center justify-center">
            <Ionicons name={isLiked ? 'heart' : 'heart-outline'} size={20} color={isLiked ? '#EF4444' : '#111827'} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 140 }}
      >
        {/* Image Section */}
        <View className="px-4 pt-4">
          <View className="relative mb-4">
            <View className="w-full h-[280px] bg-[#FFF8E6] rounded-2xl items-center justify-center border border-[#FFE5B4]">
              <Text className="text-[110px]">{product.images[selectedImageIndex]}</Text>
            </View>

            {product.discount && (
              <View className="absolute top-4 left-4 bg-[#FFC000] px-3 py-1.5 rounded-md">
                <Text className="text-black text-sm font-bold">{product.discount}</Text>
              </View>
            )}

            <TouchableOpacity
              onPress={handleQuickAdd}
              className="absolute bottom-4 right-4 bg-[#FFC000] w-12 h-12 rounded-full items-center justify-center"
            >
              <Ionicons name="add" size={22} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Thumbnails */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row">
            {product.images.map((image, index) => {
              const active = selectedImageIndex === index;
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => setSelectedImageIndex(index)}
                  className={[
                    'w-[56px] h-[56px] rounded-lg items-center justify-center mr-3 border',
                    active ? 'border-[#FFC000] bg-[#FFE5B4]' : 'border-[#F2F2F7] bg-[#FFF8E6]',
                  ].join(' ')}
                >
                  <Text className="text-[26px]">{image}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Product Info */}
        <View className="p-4">
          {/* Brand + stock */}
          <View className="flex-row items-center justify-between mb-3">
            <View className="flex-row items-center bg-[#FFF8E6] px-3 py-1.5 rounded-full">
              <Ionicons name="business-outline" size={14} color="#FFC000" />
              <Text className="text-xs text-black font-semibold ml-1">{product.brand}</Text>
            </View>

            <View className="flex-row items-center bg-[#FFF8E6] px-3 py-1.5 rounded-full">
              <Ionicons name="checkmark-circle" size={14} color="#FFC000" />
              <Text className="text-xs text-black font-semibold ml-1">
                {product.stock} in stock
              </Text>
            </View>
          </View>

          <Text className="text-2xl font-extrabold text-[#212529] mb-2">{product.name}</Text>

          <View className="flex-row items-center mb-4">
            <View className="flex-row items-center mr-2">{renderStars(product.rating)}</View>
            <Text className="text-sm font-semibold text-black mr-2">{product.rating}</Text>
            <Text className="text-sm text-[#6C757D]">({product.reviewCount} reviews)</Text>
          </View>

          {/* Price */}
          <View className="bg-white border border-[#F2F2F7] rounded-2xl p-4 mb-4">
            <View className="flex-row items-end justify-between">
              <View>
                <Text className="text-xs text-[#8E8E93] mb-1">Total price</Text>
                <Text className="text-2xl font-extrabold text-[#FFC000]">
                  {formatPrice(product.price, quantity)}
                </Text>
              </View>

              {product.originalPrice && (
                <View className="items-end">
                  <Text className="text-sm text-[#8E8E93] line-through">{product.originalPrice}</Text>
                  <View className="mt-1 bg-[#FFF8E6] px-2.5 py-1.5 rounded-full">
                    <Text className="text-xs font-semibold text-black">
                      Save ${calculateSavings() * quantity}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            <View className="mt-3 bg-[#FFF8E6] px-3 py-2 rounded-xl flex-row items-center self-start">
              <Ionicons name="trending-up" size={16} color="#FFC000" />
              <Text className="text-sm text-black font-semibold ml-2">
                Estimated profit: {product.profit}
              </Text>
            </View>
          </View>

          {/* Quick Stats (simpler grid) */}
          <View className="flex-row flex-wrap justify-between mb-5">
            {[
              { icon: <MaterialIcons name="speed" size={18} color="#FFC000" />, label: 'Hashrate', value: product.hashrate },
              { icon: <MaterialIcons name="bolt" size={18} color="#FFC000" />, label: 'Power', value: product.power },
              { icon: <FontAwesome5 name="coins" size={16} color="#FFC000" />, label: 'Coin', value: product.coin },
              { icon: <Ionicons name="flash-outline" size={18} color="#FFC000" />, label: 'Efficiency', value: product.efficiency },
            ].map((s, idx) => (
              <View key={idx} className="w-[48%] bg-[#FFF8E6] rounded-2xl p-4 mb-3 border border-[#FFE5B4]">
                <View className="flex-row items-center">
                  <View className="w-9 h-9 rounded-xl bg-white items-center justify-center mr-3 border border-[#F2F2F7]">
                    {s.icon}
                  </View>
                  <View className="flex-1">
                    <Text className="text-xs text-[#6C757D]">{s.label}</Text>
                    <Text className="text-sm font-extrabold text-[#212529]" numberOfLines={1}>
                      {s.value}
                    </Text>
                  </View>
                </View>
              </View>
            ))}
          </View>

          {/* Quantity (cleaner) */}
          <View className="flex-row items-center justify-between bg-white border border-[#F2F2F7] rounded-2xl p-4 mb-5">
            <Text className="text-base font-semibold text-[#212529]">Quantity</Text>

            <View className="flex-row items-center">
              <TouchableOpacity
                onPress={handleDecrementQuantity}
                disabled={quantity <= 1}
                className={`w-10 h-10 rounded-xl items-center justify-center border ${
                  quantity <= 1 ? 'bg-gray-100 border-gray-200' : 'bg-white border-[#E5E7EB]'
                }`}
              >
                <Ionicons name="remove" size={18} color={quantity <= 1 ? '#9CA3AF' : '#111827'} />
              </TouchableOpacity>

              <Text className="mx-4 text-base font-extrabold text-black">{quantity}</Text>

              <TouchableOpacity
                onPress={handleIncrementQuantity}
                disabled={quantity >= product.stock}
                className={`w-10 h-10 rounded-xl items-center justify-center border ${
                  quantity >= product.stock ? 'bg-gray-100 border-gray-200' : 'bg-white border-[#E5E7EB]'
                }`}
              >
                <Ionicons name="add" size={18} color={quantity >= product.stock ? '#9CA3AF' : '#111827'} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Tabs */}
          <View className="flex-row mb-5 bg-[#FFF8E6] rounded-xl p-1 border border-[#FFE5B4]">
            {[
              { key: 'overview', label: 'Overview', icon: 'information-circle-outline' },
              { key: 'specs', label: 'Specs', icon: 'list-outline' },
              { key: 'reviews', label: 'Reviews', icon: 'star-outline' },
            ].map((t) => {
              const active = selectedSpecTab === (t.key as any);
              return (
                <TouchableOpacity
                  key={t.key}
                  onPress={() => setSelectedSpecTab(t.key as any)}
                  className={`flex-1 flex-row items-center justify-center py-3 rounded-lg ${
                    active ? 'bg-[#FFC000]' : 'bg-transparent'
                  }`}
                >
                  <Ionicons name={t.icon as any} size={18} color={active ? '#000' : '#8E8E93'} />
                  <Text className={`text-sm font-semibold ml-2 ${active ? 'text-black' : 'text-[#8E8E93]'}`}>
                    {t.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Tab Content */}
          {isOverview && (
            <View className="mb-5">
              <Text className="text-sm leading-6 text-[#212529] mb-4">{product.description}</Text>

              <View className="bg-white border border-[#F2F2F7] rounded-2xl p-5 mb-4">
                <View className="flex-row items-center mb-3">
                  <Ionicons name="checkmark-circle" size={18} color="#FFC000" />
                  <Text className="text-base font-extrabold text-[#212529] ml-2">Key Features</Text>
                </View>

                {product.features.map((feature, index) => (
                  <View key={index} className="flex-row items-start mb-2">
                    <View className="w-6 h-6 rounded-full bg-[#FFF8E6] items-center justify-center mr-3 border border-[#FFE5B4]">
                      <Text className="text-xs font-extrabold text-black">{index + 1}</Text>
                    </View>
                    <Text className="text-sm text-[#212529] flex-1 leading-6">{feature}</Text>
                  </View>
                ))}
              </View>

              <View className="bg-white border border-[#F2F2F7] rounded-2xl p-5">
                <View className="flex-row items-center mb-3">
                  <Ionicons name="settings-outline" size={18} color="#FFC000" />
                  <Text className="text-base font-extrabold text-[#212529] ml-2">Key Specifications</Text>
                </View>

                <View className="flex-row flex-wrap justify-between">
                  {[
                    { icon: 'calculator-outline', label: 'Algorithm', value: product.algorithm },
                    { icon: 'flash-outline', label: 'Efficiency', value: product.efficiency },
                    { icon: 'volume-high-outline', label: 'Noise', value: product.noiseLevel },
                    { icon: 'cube-outline', label: 'Dimensions', value: product.dimensions },
                  ].map((s, idx) => (
                    <View key={idx} className="w-[48%] bg-[#FFF8E6] rounded-2xl p-4 mb-3 border border-[#FFE5B4]">
                      <Ionicons name={s.icon as any} size={18} color="#FFC000" />
                      <Text className="text-xs text-[#6C757D] mt-2">{s.label}</Text>
                      <Text className="text-sm font-extrabold text-[#212529]" numberOfLines={2}>
                        {s.value}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          )}

          {isSpecs && (
            <View className="mb-5">
              <View className="bg-white border border-[#F2F2F7] rounded-2xl overflow-hidden">
                {Object.entries(product.specifications).map(([key, value], index) => (
                  <View
                    key={key}
                    className={`flex-row justify-between px-4 py-4 ${
                      index === 0 ? '' : 'border-t border-[#F2F2F7]'
                    }`}
                  >
                    <Text className="text-sm text-[#6C757D] font-medium flex-1">{key}</Text>
                    <Text className="text-sm text-[#212529] font-semibold flex-1 text-right">
                      {value}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {isReviews && (
            <View className="mb-5">
              <View className="bg-white border border-[#F2F2F7] rounded-2xl p-4 mb-4">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="text-3xl font-extrabold text-black">{product.rating}</Text>
                    <Text className="text-sm text-[#6C757D]">out of 5</Text>
                    <View className="flex-row mt-2">{renderStars(product.rating)}</View>
                    <Text className="text-xs text-[#8E8E93] mt-2">{product.reviewCount} reviews</Text>
                  </View>

                  <View className="flex-1 ml-4">
                    {[5, 4, 3, 2, 1].map((star) => (
                      <View key={star} className="flex-row items-center mb-2">
                        <Text className="text-xs text-[#6C757D] w-[46px]">{star}★</Text>
                        <View className="flex-1 h-2 bg-[#FFE5B4] rounded-full mx-2 overflow-hidden">
                          <View className="h-full bg-[#FFC000]" style={{ width: `${(star / 5) * 100}%` }} />
                        </View>
                        <Text className="text-xs text-[#6C757D] w-[34px] text-right">
                          {((star / 5) * 100).toFixed(0)}%
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>

              <View className="items-center py-8">
                <Ionicons name="chatbubble-outline" size={46} color="#FFE5B4" />
                <Text className="text-sm text-[#8E8E93] mt-4 mb-4">
                  Be the first to review this product
                </Text>
                <TouchableOpacity className="bg-[#FFC000] px-6 py-3 rounded-xl">
                  <Text className="text-sm font-extrabold text-black">Write a Review</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View className="h-5" />
        </View>
      </ScrollView>

      {/* Bottom Actions (simpler) */}
      <View className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#F2F2F7] px-4 py-3">
        <View className="flex-row items-center mb-3">
          <TouchableOpacity
            onPress={handleSupport}
            className="w-12 h-12 rounded-xl bg-[#F2F2F7] items-center justify-center"
          >
            <Ionicons name="help-circle-outline" size={22} color="#111827" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleAddToCart}
            className="flex-1 bg-white rounded-xl py-4 items-center border border-[#FFC000] mx-3"
          >
            <Text className="text-sm font-extrabold text-black">Add to Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleBuyNow}
            className="flex-1 bg-[#FFC000] rounded-xl py-4 items-center"
          >
            <Text className="text-sm font-extrabold text-black">Buy Now</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-between items-center">
          <Text className="text-xs text-[#6C757D] font-semibold">Total</Text>
          <Text className="text-lg font-extrabold text-black">
            {formatPrice(product.price, quantity)}
          </Text>
        </View>
      </View>

      {/* Share Modal */}
      <Modal visible={shareOpen} transparent animationType="fade">
        <Pressable className="flex-1 bg-black/40" onPress={() => setShareOpen(false)}>
          <Pressable
            className="absolute left-4 right-4 bottom-10 bg-white rounded-2xl p-5 border border-[#F2F2F7]"
            onPress={() => {}}
          >
            <Text className="text-lg font-extrabold text-black mb-1">Share</Text>
            <Text className="text-sm text-[#6C757D] mb-4" numberOfLines={2}>
              Share this product with your friends.
            </Text>

            <TouchableOpacity
              className="flex-row items-center py-3 border-b border-[#F2F2F7]"
              onPress={() => {
                setShareOpen(false);
                Alert.alert('Copied', 'Product link copied (mock).');
              }}
            >
              <Ionicons name="link-outline" size={18} color="#111827" />
              <Text className="text-sm font-semibold text-black ml-3">Copy link</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="flex-row items-center py-3 border-b border-[#F2F2F7]"
              onPress={() => {
                setShareOpen(false);
                Alert.alert('Shared', 'Shared to apps (mock).');
              }}
            >
              <Ionicons name="share-social-outline" size={18} color="#111827" />
              <Text className="text-sm font-semibold text-black ml-3">Share to apps</Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="py-3 items-center mt-2"
              onPress={() => setShareOpen(false)}
            >
              <Text className="text-sm font-extrabold text-[#FFC000]">Close</Text>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}
