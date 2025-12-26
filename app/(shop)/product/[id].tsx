import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
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
  const [selectedSpecTab, setSelectedSpecTab] = useState<
    'overview' | 'specs' | 'reviews'
  >('overview');

  const scrollViewRef = useRef<ScrollView>(null);

  const product: Product =
    PRODUCTS_DATA[productId as keyof typeof PRODUCTS_DATA] || PRODUCTS_DATA[1];

  const handleBackPress = () => router.back();

  const handleAddToCart = () => {
    Alert.alert(
      'Added to Cart',
      `${quantity} × ${product.name} has been added to your cart.`,
      [
        { text: 'Continue Shopping', style: 'cancel' },
        { text: 'View Cart', onPress: () => router.push('/cart') },
      ]
    );
  };

  const handleBuyNow = () => {
    Alert.alert('Proceed to Checkout', `You are about to purchase ${quantity} × ${product.name}.`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Continue', onPress: () => router.push('/checkout') },
    ]);
  };

  const handleSupport = () => {
    Alert.alert(
      'Get Expert Support',
      'Our mining experts are ready to help you with setup, configuration, and optimization.',
      [{ text: 'Cancel', style: 'cancel' }, { text: 'Start Consultation', onPress: () => {} }]
    );
  };

  const handleIncrementQuantity = () => {
    if (quantity < product.stock) setQuantity((p) => p + 1);
  };

  const handleDecrementQuantity = () => {
    if (quantity > 1) setQuantity((p) => p - 1);
  };

  const handleQuickAdd = () => {
    setQuantity(1);
    handleAddToCart();
  };

  const renderStars = (rating: number) => {
    const stars: React.ReactNode[] = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Ionicons key={`full-${i}`} name="star" size={16} color="#FFC000" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Ionicons key="half" name="star-half" size={16} color="#FFC000" />
      );
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Ionicons
          key={`empty-${i}`}
          name="star-outline"
          size={16}
          color="#FFC000"
        />
      );
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
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 py-3 border-b border-[#F2F2F7]">
        <TouchableOpacity onPress={handleBackPress} className="p-1">
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>

        <View className="flex-row items-center">
          <TouchableOpacity className="w-10 h-10 rounded-full bg-[#F2F2F7] items-center justify-center ml-3">
            <Ionicons name="share-outline" size={22} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity className="w-10 h-10 rounded-full bg-[#F2F2F7] items-center justify-center ml-3">
            <Ionicons name="heart-outline" size={22} color="#000" />
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
            <View className="w-full h-[300px] bg-[#FFF8E6] rounded-2xl items-center justify-center border border-[#FFE5B4]">
              <Text className="text-[120px]">{product.images[selectedImageIndex]}</Text>
            </View>

            {product.discount && (
              <View
                className="absolute top-4 left-4 bg-[#FFC000] px-3 py-1.5 rounded-md"
                style={{
                  shadowColor: '#FFC000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.3,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <Text className="text-black text-sm font-bold">
                  {product.discount}
                </Text>
              </View>
            )}

            <TouchableOpacity
              onPress={handleQuickAdd}
              className="absolute bottom-4 right-4 bg-[#FFC000] w-12 h-12 rounded-full items-center justify-center"
              style={{
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 4,
              }}
            >
              <Ionicons name="cart-outline" size={20} color="#FFFFFF" />
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
                    'w-[60px] h-[60px] rounded-lg items-center justify-center mr-3 border-2',
                    active ? 'border-[#FFC000] bg-[#FFE5B4]' : 'border-transparent bg-[#FFF8E6]',
                  ].join(' ')}
                >
                  <Text className="text-[28px]">{image}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Product Info */}
        <View className="p-4">
          {/* Header */}
          <View className="mb-4">
            <View className="flex-row justify-between items-center mb-2">
              <View className="flex-row items-center bg-[#FFF8E6] px-2.5 py-1.5 rounded-xl">
                <Ionicons name="business-outline" size={14} color="#FFC000" />
                <Text className="text-xs text-black font-semibold ml-1">
                  {product.brand}
                </Text>
              </View>

              <View className="flex-row items-center bg-[#FFF8E6] px-2 py-1.5 rounded-xl">
                <Ionicons name="checkmark-circle" size={14} color="#FFC000" />
                <Text className="text-xs text-black font-medium ml-1">
                  {product.stock} in stock
                </Text>
              </View>
            </View>

            <Text className="text-2xl font-bold text-[#212529] mb-3">
              {product.name}
            </Text>

            <View className="flex-row items-center">
              <View className="flex-row items-center mr-2">
                {renderStars(product.rating)}
                <Text className="text-base font-semibold text-[#212529] ml-1.5">
                  {product.rating}
                </Text>
              </View>
              <Text className="text-sm text-[#6C757D]">
                ({product.reviewCount} reviews)
              </Text>
            </View>
          </View>

          {/* Price Section */}
          <View className="mb-5 pb-5 border-b border-[#FFF8E6]">
            <View className="flex-row items-center mb-2">
              <Text className="text-[28px] font-bold text-[#FFC000] mr-3">
                {formatPrice(product.price, quantity)}
              </Text>

              {product.originalPrice && (
                <View className="items-start">
                  <Text className="text-base text-[#8E8E93] line-through mb-1">
                    {product.originalPrice}
                  </Text>
                  <View className="bg-[#FFF8E6] px-2 py-1 rounded-md">
                    <Text className="text-xs text-black font-semibold">
                      Save ${calculateSavings()}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            <View className="flex-row items-center bg-[#FFF8E6] px-3 py-2 rounded-lg self-start">
              <Ionicons name="trending-up" size={16} color="#FFC000" />
              <Text className="text-sm text-black font-semibold ml-1.5">
                Estimated profit: {product.profit}
              </Text>
            </View>
          </View>

          {/* Quick Stats */}
          <View className="flex-row items-center justify-between bg-[#FFF8E6] rounded-2xl p-4 mb-5">
            {/* Hashrate */}
            <View className="flex-row items-center flex-1">
              <View className="w-10 h-10 rounded-full bg-[#FFF8E6] items-center justify-center mr-3">
                <MaterialIcons name="speed" size={20} color="#FFC000" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-[#212529] mb-0.5">
                  {product.hashrate}
                </Text>
                <Text className="text-xs text-[#6C757D]">Hashrate</Text>
              </View>
            </View>

            <View className="w-px h-10 bg-[#FFE5B4]" />

            {/* Power */}
            <View className="flex-row items-center flex-1 ml-3">
              <View className="w-10 h-10 rounded-full bg-[#FFF8E6] items-center justify-center mr-3">
                <MaterialIcons name="bolt" size={20} color="#FFC000" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-[#212529] mb-0.5">
                  {product.power}
                </Text>
                <Text className="text-xs text-[#6C757D]">Power</Text>
              </View>
            </View>

            <View className="w-px h-10 bg-[#FFE5B4]" />

            {/* Coin */}
            <View className="flex-row items-center flex-1 ml-3">
              <View className="w-10 h-10 rounded-full bg-[#FFF8E6] items-center justify-center mr-3">
                <FontAwesome5 name="coins" size={18} color="#FFC000" />
              </View>
              <View className="flex-1">
                <Text className="text-sm font-bold text-[#212529] mb-0.5">
                  {product.coin}
                </Text>
                <Text className="text-xs text-[#6C757D]">Coin</Text>
              </View>
            </View>
          </View>

          {/* Quantity */}
          <View className="flex-row justify-between items-center mb-6 pb-5 border-b border-[#FFF8E6]">
            <Text className="text-base font-semibold text-[#212529]">
              Quantity
            </Text>

            <View className="flex-row items-center bg-[#FFF8E6] rounded-xl p-1">
              <TouchableOpacity
                onPress={handleDecrementQuantity}
                disabled={quantity <= 1}
                className={[
                  'w-10 h-10 rounded-lg items-center justify-center',
                  quantity <= 1 ? 'bg-[#FFE5B4]' : 'bg-[#FFC000]',
                ].join(' ')}
              >
                <Ionicons
                  name="remove"
                  size={20}
                  color={quantity <= 1 ? '#FFE5B4' : '#000'}
                />
              </TouchableOpacity>

              <Text className="text-lg font-bold text-[#212529] min-w-[40px] text-center mx-3">
                {quantity}
              </Text>

              <TouchableOpacity
                onPress={handleIncrementQuantity}
                disabled={quantity >= product.stock}
                className={[
                  'w-10 h-10 rounded-lg items-center justify-center',
                  quantity >= product.stock ? 'bg-[#FFE5B4]' : 'bg-[#FFC000]',
                ].join(' ')}
              >
                <Ionicons
                  name="add"
                  size={20}
                  color={quantity >= product.stock ? '#FFE5B4' : '#000'}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Tabs */}
          <View className="flex-row mb-5 bg-[#FFF8E6] rounded-xl p-1">
            <TouchableOpacity
              onPress={() => setSelectedSpecTab('overview')}
              className={[
                'flex-1 flex-row items-center justify-center py-3 rounded-lg',
                isOverview ? 'bg-[#FFC000]' : 'bg-transparent',
              ].join(' ')}
            >
              <Ionicons
                name="information-circle-outline"
                size={18}
                color={isOverview ? '#000' : '#8E8E93'}
              />
              <Text
                className={[
                  'text-sm font-medium ml-1.5',
                  isOverview ? 'text-black font-semibold' : 'text-[#8E8E93]',
                ].join(' ')}
              >
                Overview
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelectedSpecTab('specs')}
              className={[
                'flex-1 flex-row items-center justify-center py-3 rounded-lg',
                isSpecs ? 'bg-[#FFC000]' : 'bg-transparent',
              ].join(' ')}
            >
              <Ionicons
                name="list-outline"
                size={18}
                color={isSpecs ? '#000' : '#8E8E93'}
              />
              <Text
                className={[
                  'text-sm font-medium ml-1.5',
                  isSpecs ? 'text-black font-semibold' : 'text-[#8E8E93]',
                ].join(' ')}
              >
                Specs
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelectedSpecTab('reviews')}
              className={[
                'flex-1 flex-row items-center justify-center py-3 rounded-lg',
                isReviews ? 'bg-[#FFC000]' : 'bg-transparent',
              ].join(' ')}
            >
              <Ionicons
                name="star-outline"
                size={18}
                color={isReviews ? '#000' : '#8E8E93'}
              />
              <Text
                className={[
                  'text-sm font-medium ml-1.5',
                  isReviews ? 'text-black font-semibold' : 'text-[#8E8E93]',
                ].join(' ')}
              >
                Reviews
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          {isOverview && (
            <View className="mb-5">
              <Text className="text-base leading-6 text-[#212529] mb-6">
                {product.description}
              </Text>

              <View className="bg-[#FFF8E6] rounded-2xl p-5 mb-6">
                <View className="flex-row items-center mb-4">
                  <Ionicons name="checkmark-circle" size={20} color="#FFC000" />
                  <Text className="text-lg font-bold text-[#212529] ml-2">
                    Key Features
                  </Text>
                </View>

                {product.features.map((feature, index) => (
                  <View key={index} className="flex-row items-center mb-3">
                    <View className="w-7 h-7 rounded-full bg-[#FFC000] items-center justify-center mr-3">
                      <Text className="text-xs font-bold text-black">
                        {index + 1}
                      </Text>
                    </View>
                    <Text className="text-base text-[#212529] leading-[22px] flex-1">
                      {feature}
                    </Text>
                  </View>
                ))}
              </View>

              <View className="bg-[#FFF8E6] rounded-2xl p-5">
                <View className="flex-row items-center mb-4">
                  <Ionicons name="settings-outline" size={20} color="#FFC000" />
                  <Text className="text-lg font-bold text-[#212529] ml-2">
                    Key Specifications
                  </Text>
                </View>

                <View className="flex-row flex-wrap justify-between">
                  {[
                    { icon: 'calculator-outline', label: 'Algorithm', value: product.algorithm },
                    { icon: 'flash-outline', label: 'Efficiency', value: product.efficiency },
                    { icon: 'volume-high-outline', label: 'Noise', value: product.noiseLevel },
                    { icon: 'cube-outline', label: 'Dimensions', value: product.dimensions },
                  ].map((s, idx) => (
                    <View
                      key={idx}
                      className="w-[48%] bg-white rounded-xl p-4 mb-3 items-center"
                    >
                      <Ionicons name={s.icon as any} size={20} color="#FFC000" />
                      <Text className="text-xs text-[#6C757D] mt-2 mb-1">
                        {s.label}
                      </Text>
                      <Text className="text-sm font-semibold text-[#212529] text-center">
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
              <View className="bg-[#FFF8E6] rounded-xl overflow-hidden">
                {Object.entries(product.specifications).map(([key, value], index) => {
                  const alternate = index % 2 === 0;
                  return (
                    <View
                      key={key}
                      className={[
                        'flex-row justify-between px-4 py-4',
                        alternate ? 'bg-transparent' : 'bg-[#FFE5B4]',
                      ].join(' ')}
                    >
                      <Text className="text-sm text-[#6C757D] font-medium flex-1">
                        {key}
                      </Text>
                      <Text className="text-sm text-[#212529] font-semibold flex-1 text-right">
                        {value}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {isReviews && (
            <View className="mb-5">
              <View className="flex-row bg-[#FFF8E6] rounded-xl p-4 mb-6">
                <View className="items-center pr-6 mr-6 border-r border-[#FFE5B4]">
                  <Text className="text-4xl font-bold text-[#212529]">
                    {product.rating}
                  </Text>
                  <Text className="text-sm text-[#6C757D] mb-2">
                    out of 5
                  </Text>
                  <View className="flex-row mb-2">{renderStars(product.rating)}</View>
                  <Text className="text-xs text-[#8E8E93]">
                    {product.reviewCount} reviews
                  </Text>
                </View>

                <View className="flex-1">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <View key={star} className="flex-row items-center mb-2">
                      <Text className="text-xs text-[#6C757D] w-[50px]">
                        {star} star
                      </Text>
                      <View className="flex-1 h-2 bg-[#FFE5B4] rounded-full mx-2 overflow-hidden">
                        <View
                          className="h-full bg-[#FFC000]"
                          style={{ width: `${(star / 5) * 100}%` }}
                        />
                      </View>
                      <Text className="text-xs text-[#6C757D] w-[30px] text-right">
                        {((star / 5) * 100).toFixed(0)}%
                      </Text>
                    </View>
                  ))}
                </View>
              </View>

              <View className="items-center py-10">
                <Ionicons name="chatbubble-outline" size={48} color="#FFE5B4" />
                <Text className="text-base text-[#8E8E93] mt-4 mb-6">
                  Be the first to review this product
                </Text>
                <TouchableOpacity className="bg-[#FFC000] px-6 py-3 rounded-lg">
                  <Text className="text-base font-semibold text-black">
                    Write a Review
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          <View className="h-5" />
        </View>
      </ScrollView>

      {/* Fixed Bottom Actions */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white border-t border-[#F2F2F7] px-4 py-3"
        style={{
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 8,
        }}
      >
        <View className="flex-row items-center mb-3">
          <TouchableOpacity
            onPress={handleSupport}
            className="w-[50px] h-[50px] rounded-full bg-[#F9FAFB] items-center justify-center border border-[#E5E7EB]"
          >
            <Ionicons name="help-circle-outline" size={24} color="#000" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleAddToCart}
            className="flex-1 bg-white rounded-xl py-4 items-center border-2 border-[#FFC000] mx-3"
          >
            <Text className="text-base font-semibold text-black">Add to Cart</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleBuyNow}
            className="flex-1 bg-[#FFC000] rounded-xl py-4 items-center"
          >
            <Text className="text-base font-semibold text-black">Buy Now</Text>
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-between items-center border-b border-[#F2F2F7] pb-3">
          <View className="flex-row items-baseline">
            <Text className="text-base text-[#6C757D] font-medium mr-2">
              Total:
            </Text>
            <Text className="text-[22px] font-bold text-[#FFC000]">
              {formatPrice(product.price, quantity)}
            </Text>
          </View>

          {product.originalPrice && (
            <View className="flex-row items-center bg-[#FFF8E6] px-2.5 py-1.5 rounded-xl">
              <Text className="text-xs font-semibold text-black">
                Save ${calculateSavings() * quantity}
              </Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}
