import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useState, useRef } from 'react';
import { Ionicons, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';

const { width: screenWidth } = Dimensions.get('window');

// Mock product data - In a real app, this would come from an API
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
    description: 'The Antminer S19 Pro is one of the most efficient and powerful Bitcoin miners on the market. With its advanced cooling system and high hashrate, it delivers exceptional performance for professional mining operations.',
    features: [
      'High efficiency with 29.5 J/TH',
      'Advanced cooling system',
      'Low noise operation',
      'Easy setup and configuration',
      'Remote monitoring capability',
    ],
    specifications: {
      'Manufacturer': 'Bitmain',
      'Model': 'Antminer S19 Pro',
      'Release Date': 'March 2020',
      'Size': '400 x 195 x 290 mm',
      'Weight': '14.2 kg',
      'Noise Level': '75 dB',
      'Fan(s)': '2 x 12038 Fans',
      'Power': '3250W',
      'Voltage': '200-240V',
      'Interface': 'Ethernet',
      'Temperature': '5 - 40 °C',
      'Humidity': '5 - 95 %',
    }
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
    description: 'The Whatsminer M30S+ offers reliable performance with competitive efficiency. Built for durability and consistent mining output.',
    features: [
      '100 TH/s hashrate',
      'Stable performance',
      'Robust construction',
      'Easy maintenance',
      'Global voltage support',
    ],
    specifications: {
      'Manufacturer': 'MicroBT',
      'Model': 'Whatsminer M30S+',
      'Release Date': 'April 2020',
      'Size': '390 x 190 x 290 mm',
      'Weight': '13.8 kg',
      'Noise Level': '82 dB',
      'Fan(s)': '2 x 12038 Fans',
      'Power': '3400W',
      'Voltage': '200-240V',
      'Interface': 'Ethernet',
      'Temperature': '0 - 40 °C',
    }
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
  const scrollViewRef = useRef<ScrollView>(null);
  
  const product = PRODUCTS_DATA[productId as keyof typeof PRODUCTS_DATA] || PRODUCTS_DATA[1];

  const handleBackPress = () => {
    router.back();
  };

  const handleAddToCart = () => {
    Alert.alert(
      'Added to Cart',
      `${quantity} × ${product.name} has been added to your cart.`,
      [
        { text: 'Continue Shopping', style: 'cancel' },
        { text: 'View Cart', onPress: () => router.push('/cart') }
      ]
    );
  };

  const handleBuyNow = () => {
    Alert.alert(
      'Proceed to Checkout',
      `You are about to purchase ${quantity} × ${product.name}.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => router.push('/checkout') }
      ]
    );
  };

  const handleSupport = () => {
    Alert.alert(
      'Get Expert Support',
      'Our mining experts are ready to help you with setup, configuration, and optimization.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Start Consultation', 
          onPress: () => {
            // Navigate to chat/support screen
            console.log('Starting support consultation');
          }
        }
      ]
    );
  };

  const handleIncrementQuantity = () => {
    if (quantity < product.stock) {
      setQuantity(prev => prev + 1);
    }
  };

  const handleDecrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  const handleQuickAdd = () => {
    setQuantity(1);
    handleAddToCart();
  };

  const renderStars = (rating: number) => {
    const stars = [];
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

  const formatPrice = (price: string, quantity: number) => {
    const numericPrice = parseFloat(price.replace('$', '').replace(',', ''));
    const total = numericPrice * quantity;
    return `$${total.toLocaleString()}`;
  };

  // Calculate savings if there's a discount
  const calculateSavings = () => {
    if (!product.originalPrice) return 0;
    const currentPrice = parseFloat(product.price.replace('$', '').replace(',', ''));
    const originalPrice = parseFloat(product.originalPrice.replace('$', '').replace(',', ''));
    return originalPrice - currentPrice;
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerIconButton}>
            <Ionicons name="share-outline" size={22} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerIconButton}>
            <Ionicons name="heart-outline" size={22} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Product Images */}
        <View style={styles.imageSection}>
          <View style={styles.mainImageContainer}>
            <View style={styles.mainImage}>
              <Text style={styles.mainImageEmoji}>{product.images[selectedImageIndex]}</Text>
            </View>
            
            {/* Discount Badge */}
            {product.discount && (
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{product.discount}</Text>
              </View>
            )}
            
            {/* Quick Action - Add to cart from image */}
            <TouchableOpacity 
              style={styles.quickAddButton}
              onPress={handleQuickAdd}
            >
              <Ionicons name="cart-outline" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
          
          {/* Thumbnail Images */}
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            style={styles.thumbnailsContainer}
          >
            {product.images.map((image, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.thumbnail,
                  selectedImageIndex === index && styles.thumbnailActive
                ]}
                onPress={() => setSelectedImageIndex(index)}
              >
                <Text style={styles.thumbnailEmoji}>{image}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Product Info */}
        <View style={styles.productInfo}>
          <View style={styles.productHeader}>
            <View style={styles.brandContainer}>
              <View style={styles.brandTag}>
                <Ionicons name="business-outline" size={14} color="#FFC000" />
                <Text style={styles.brand}>{product.brand}</Text>
              </View>
              <View style={styles.stockBadge}>
                <Ionicons name="checkmark-circle" size={14} color="#FFC000" />
                <Text style={styles.stockText}>{product.stock} in stock</Text>
              </View>
            </View>
            <Text style={styles.productName}>{product.name}</Text>
            
            {/* Rating */}
            <View style={styles.ratingContainer}>
              <View style={styles.starsContainer}>
                {renderStars(product.rating)}
                <Text style={styles.ratingText}>{product.rating}</Text>
              </View>
              <Text style={styles.reviewsText}>({product.reviewCount} reviews)</Text>
            </View>
          </View>

          {/* Price Section */}
          <View style={styles.priceSection}>
            <View style={styles.priceRow}>
              <Text style={styles.price}>{formatPrice(product.price, quantity)}</Text>
              {product.originalPrice && (
                <View style={styles.originalPriceContainer}>
                  <Text style={styles.originalPrice}>{product.originalPrice}</Text>
                  <View style={styles.savingsBadge}>
                    <Text style={styles.savingsText}>Save ${calculateSavings()}</Text>
                  </View>
                </View>
              )}
            </View>
            
            {/* Profit Info */}
            <View style={styles.profitInfo}>
              <Ionicons name="trending-up" size={16} color="#FFC000" />
              <Text style={styles.profitText}>Estimated profit: {product.profit}</Text>
            </View>
          </View>

          {/* Quick Stats */}
          <View style={styles.quickStats}>
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: '#FFF8E6' }]}>
                <MaterialIcons name="speed" size={20} color="#FFC000" />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{product.hashrate}</Text>
                <Text style={styles.statLabel}>Hashrate</Text>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: '#FFF8E6' }]}>
                <MaterialIcons name="bolt" size={20} color="#FFC000" />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{product.power}</Text>
                <Text style={styles.statLabel}>Power</Text>
              </View>
            </View>
            
            <View style={styles.divider} />
            
            <View style={styles.statItem}>
              <View style={[styles.statIcon, { backgroundColor: '#FFF8E6' }]}>
                <FontAwesome5 name="coins" size={18} color="#FFC000" />
              </View>
              <View style={styles.statContent}>
                <Text style={styles.statValue}>{product.coin}</Text>
                <Text style={styles.statLabel}>Coin</Text>
              </View>
            </View>
          </View>

          {/* Quantity Selector */}
          <View style={styles.quantitySection}>
            <Text style={styles.quantityLabel}>Quantity</Text>
            <View style={styles.quantitySelector}>
              <TouchableOpacity 
                style={[
                  styles.quantityButton,
                  quantity <= 1 && styles.quantityButtonDisabled
                ]}
                onPress={handleDecrementQuantity}
                disabled={quantity <= 1}
              >
                <Ionicons 
                  name="remove" 
                  size={20} 
                  color={quantity <= 1 ? "#FFE5B4" : "#000"} 
                />
              </TouchableOpacity>
              
              <Text style={styles.quantityText}>{quantity}</Text>
              
              <TouchableOpacity 
                style={[
                  styles.quantityButton,
                  quantity >= product.stock && styles.quantityButtonDisabled
                ]}
                onPress={handleIncrementQuantity}
                disabled={quantity >= product.stock}
              >
                <Ionicons 
                  name="add" 
                  size={20} 
                  color={quantity >= product.stock ? "#FFE5B4" : "#000"} 
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Tabs */}
          <View style={styles.tabsContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                selectedSpecTab === 'overview' && styles.tabActive
              ]}
              onPress={() => setSelectedSpecTab('overview')}
            >
              <Ionicons 
                name="information-circle-outline" 
                size={18} 
                color={selectedSpecTab === 'overview' ? '#FFC000' : '#8E8E93'} 
              />
              <Text style={[
                styles.tabText,
                selectedSpecTab === 'overview' && styles.tabTextActive
              ]}>
                Overview
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.tab,
                selectedSpecTab === 'specs' && styles.tabActive
              ]}
              onPress={() => setSelectedSpecTab('specs')}
            >
              <Ionicons 
                name="list-outline" 
                size={18} 
                color={selectedSpecTab === 'specs' ? '#FFC000' : '#8E8E93'} 
              />
              <Text style={[
                styles.tabText,
                selectedSpecTab === 'specs' && styles.tabTextActive
              ]}>
                Specs
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.tab,
                selectedSpecTab === 'reviews' && styles.tabActive
              ]}
              onPress={() => setSelectedSpecTab('reviews')}
            >
              <Ionicons 
                name="star-outline" 
                size={18} 
                color={selectedSpecTab === 'reviews' ? '#FFC000' : '#8E8E93'} 
              />
              <Text style={[
                styles.tabText,
                selectedSpecTab === 'reviews' && styles.tabTextActive
              ]}>
                Reviews
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab Content */}
          {selectedSpecTab === 'overview' && (
            <View style={styles.tabContent}>
              <Text style={styles.description}>{product.description}</Text>
              
              <View style={styles.featuresContainer}>
                <View style={styles.featuresHeader}>
                  <Ionicons name="checkmark-circle" size={20} color="#FFC000" />
                  <Text style={styles.featuresTitle}>Key Features</Text>
                </View>
                {product.features.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <View style={styles.featureIcon}>
                      <Text style={styles.featureNumber}>{index + 1}</Text>
                    </View>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
              
              {/* Key Specifications Preview */}
              <View style={styles.specsPreview}>
                <View style={styles.specsHeader}>
                  <Ionicons name="settings-outline" size={20} color="#FFC000" />
                  <Text style={styles.specsTitle}>Key Specifications</Text>
                </View>
                <View style={styles.specsGrid}>
                  <View style={styles.specCard}>
                    <Ionicons name="calculator-outline" size={20} color="#FFC000" />
                    <Text style={styles.specCardLabel}>Algorithm</Text>
                    <Text style={styles.specCardValue}>{product.algorithm}</Text>
                  </View>
                  <View style={styles.specCard}>
                    <Ionicons name="flash-outline" size={20} color="#FFC000" />
                    <Text style={styles.specCardLabel}>Efficiency</Text>
                    <Text style={styles.specCardValue}>{product.efficiency}</Text>
                  </View>
                  <View style={styles.specCard}>
                    <Ionicons name="volume-high-outline" size={20} color="#FFC000" />
                    <Text style={styles.specCardLabel}>Noise</Text>
                    <Text style={styles.specCardValue}>{product.noiseLevel}</Text>
                  </View>
                  <View style={styles.specCard}>
                    <Ionicons name="cube-outline" size={20} color="#FFC000" />
                    <Text style={styles.specCardLabel}>Dimensions</Text>
                    <Text style={styles.specCardValue}>{product.dimensions}</Text>
                  </View>
                </View>
              </View>
            </View>
          )}

          {selectedSpecTab === 'specs' && (
            <View style={styles.tabContent}>
              <View style={styles.specsTable}>
                {Object.entries(product.specifications).map(([key, value], index) => (
                  <View 
                    key={key} 
                    style={[
                      styles.specRow,
                      index % 2 === 0 && styles.specRowAlternate
                    ]}
                  >
                    <Text style={styles.specLabel}>{key}</Text>
                    <Text style={styles.specValue}>{value}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {selectedSpecTab === 'reviews' && (
            <View style={styles.tabContent}>
              {/* Review Summary */}
              <View style={styles.reviewSummary}>
                <View style={styles.overallRating}>
                  <Text style={styles.overallRatingNumber}>{product.rating}</Text>
                  <Text style={styles.overallRatingText}>out of 5</Text>
                  <View style={styles.overallStars}>
                    {renderStars(product.rating)}
                  </View>
                  <Text style={styles.totalReviews}>{product.reviewCount} reviews</Text>
                </View>
                
                {/* Rating Distribution */}
                <View style={styles.ratingDistribution}>
                  {[5, 4, 3, 2, 1].map((star) => (
                    <View key={star} style={styles.ratingBarRow}>
                      <Text style={styles.ratingLabel}>{star} star</Text>
                      <View style={styles.ratingBarContainer}>
                        <View 
                          style={[
                            styles.ratingBar,
                            { width: `${(star / 5) * 100}%` }
                          ]} 
                        />
                      </View>
                      <Text style={styles.ratingPercent}>{(star / 5 * 100).toFixed(0)}%</Text>
                    </View>
                  ))}
                </View>
              </View>
              
              {/* Placeholder for review list */}
              <View style={styles.noReviewsMessage}>
                <Ionicons name="chatbubble-outline" size={48} color="#FFE5B4" />
                <Text style={styles.noReviewsText}>Be the first to review this product</Text>
                <TouchableOpacity style={styles.writeReviewButton}>
                  <Text style={styles.writeReviewButtonText}>Write a Review</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
        
        {/* Spacer for bottom buttons */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Fixed Action Buttons - Yellow Theme */}
      <View style={styles.actionButtonsContainer}>
        <View style={styles.priceSummary}>
          <View style={styles.totalSection}>
            <Text style={styles.totalLabel}>Total:</Text>
            <Text style={styles.totalPrice}>{formatPrice(product.price, quantity)}</Text>
          </View>
          {product.originalPrice && (
            <View style={styles.savingsSection}>
              <Ionicons name="pricetag-outline" size={14} color="#FFC000" />
              <Text style={styles.savingsLabel}>
                Save ${calculateSavings() * quantity}
              </Text>
            </View>
          )}
        </View>
        
        <View style={styles.buttonRow}>
          {/* Support Button - Unique yellow variant */}
          <TouchableOpacity 
            style={[styles.actionButton, styles.supportButton]}
            onPress={handleSupport}
          >
            <View style={styles.supportButtonContent}>
              <MaterialCommunityIcons name="headset" size={22} color="#000" />
              <View style={styles.supportButtonTextContainer}>
                <Text style={styles.supportButtonMainText}>Expert</Text>
              </View>
            </View>
          </TouchableOpacity>
          
          {/* Add to Cart Button - Primary yellow */}
          <TouchableOpacity 
            style={[styles.actionButton, styles.cartButton]}
            onPress={handleAddToCart}
          >
            <View style={styles.cartButtonContent}>
              <Ionicons name="cart-outline" size={22} color="#000" />
              <Text style={styles.cartButtonText}>Add to Cart</Text>
            </View>
          </TouchableOpacity>
          
          {/* Buy Now Button - Darker yellow for emphasis */}
          <TouchableOpacity 
            style={[styles.actionButton, styles.buyButton]}
            onPress={handleBuyNow}
          >
            <View style={styles.buyButtonContent}>
              <Ionicons name="flash" size={22} color="#000" />
              <Text style={styles.buyButtonText}>Buy Now</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  backButton: {
    padding: 4,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerIconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  scrollContent: {
    paddingBottom: 140, // Space for fixed buttons
  },
  imageSection: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  mainImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  mainImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#FFF8E6',
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#FFE5B4',
  },
  mainImageEmoji: {
    fontSize: 120,
  },
  discountBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: '#FFC000',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    shadowColor: '#FFC000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  discountText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '700',
  },
  quickAddButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: '#FFC000',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  thumbnailsContainer: {
    flexDirection: 'row',
  },
  thumbnail: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#FFF8E6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbnailActive: {
    borderColor: '#FFC000',
    backgroundColor: '#FFE5B4',
  },
  thumbnailEmoji: {
    fontSize: 28,
  },
  productInfo: {
    padding: 16,
  },
  productHeader: {
    marginBottom: 16,
  },
  brandContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  brandTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E6',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  brand: {
    fontSize: 12,
    color: '#000',
    fontWeight: '600',
    marginLeft: 4,
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E6',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
  },
  stockText: {
    fontSize: 12,
    color: '#000',
    fontWeight: '500',
    marginLeft: 4,
  },
  productName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 12,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  ratingText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
    marginLeft: 6,
  },
  reviewsText: {
    fontSize: 14,
    color: '#6C757D',
  },
  priceSection: {
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#FFF8E6',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFC000',
    marginRight: 12,
  },
  originalPriceContainer: {
    alignItems: 'flex-start',
  },
  originalPrice: {
    fontSize: 16,
    color: '#8E8E93',
    textDecorationLine: 'line-through',
    marginBottom: 4,
  },
  savingsBadge: {
    backgroundColor: '#FFF8E6',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  savingsText: {
    fontSize: 12,
    color: '#000',
    fontWeight: '600',
  },
  profitInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E6',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  profitText: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
    marginLeft: 6,
  },
  quickStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFF8E6',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#212529',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 12,
    color: '#6C757D',
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#FFE5B4',
  },
  quantitySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#FFF8E6',
  },
  quantityLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#212529',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E6',
    borderRadius: 12,
    padding: 4,
  },
  quantityButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: '#FFC000',
  },
  quantityButtonDisabled: {
    backgroundColor: '#FFE5B4',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
    minWidth: 40,
    textAlign: 'center',
  },
  tabsContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    backgroundColor: '#FFF8E6',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    gap: 6,
  },
  tabActive: {
    backgroundColor: '#FFC000',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#8E8E93',
  },
  tabTextActive: {
    color: '#000000',
    fontWeight: '600',
  },
  tabContent: {
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#212529',
    marginBottom: 24,
  },
  featuresContainer: {
    marginBottom: 24,
    backgroundColor: '#FFF8E6',
    borderRadius: 16,
    padding: 20,
  },
  featuresHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  featuresTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
    marginLeft: 8,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#FFC000',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  featureNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000',
  },
  featureText: {
    fontSize: 16,
    color: '#212529',
    lineHeight: 22,
    flex: 1,
  },
  specsPreview: {
    backgroundColor: '#FFF8E6',
    borderRadius: 16,
    padding: 20,
  },
  specsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  specsTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#212529',
    marginLeft: 8,
  },
  specsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  specCard: {
    width: '48%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
  },
  specCardLabel: {
    fontSize: 12,
    color: '#6C757D',
    marginTop: 8,
    marginBottom: 4,
  },
  specCardValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#212529',
    textAlign: 'center',
  },
  specsTable: {
    backgroundColor: '#FFF8E6',
    borderRadius: 12,
    overflow: 'hidden',
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  specRowAlternate: {
    backgroundColor: '#FFE5B4',
  },
  specLabel: {
    fontSize: 14,
    color: '#6C757D',
    fontWeight: '500',
    flex: 1,
  },
  specValue: {
    fontSize: 14,
    color: '#212529',
    fontWeight: '600',
    flex: 1,
    textAlign: 'right',
  },
  reviewSummary: {
    flexDirection: 'row',
    marginBottom: 24,
    backgroundColor: '#FFF8E6',
    borderRadius: 12,
    padding: 16,
  },
  overallRating: {
    alignItems: 'center',
    paddingRight: 24,
    marginRight: 24,
    borderRightWidth: 1,
    borderRightColor: '#FFE5B4',
  },
  overallRatingNumber: {
    fontSize: 36,
    fontWeight: '700',
    color: '#212529',
  },
  overallRatingText: {
    fontSize: 14,
    color: '#6C757D',
    marginBottom: 8,
  },
  overallStars: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  totalReviews: {
    fontSize: 12,
    color: '#8E8E93',
  },
  ratingDistribution: {
    flex: 1,
  },
  ratingBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  ratingLabel: {
    fontSize: 12,
    color: '#6C757D',
    width: 50,
  },
  ratingBarContainer: {
    flex: 1,
    height: 8,
    backgroundColor: '#FFE5B4',
    borderRadius: 4,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  ratingBar: {
    height: '100%',
    backgroundColor: '#FFC000',
  },
  ratingPercent: {
    fontSize: 12,
    color: '#6C757D',
    width: 30,
    textAlign: 'right',
  },
  noReviewsMessage: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  noReviewsText: {
    fontSize: 16,
    color: '#8E8E93',
    marginTop: 16,
    marginBottom: 24,
  },
  writeReviewButton: {
    backgroundColor: '#FFC000',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  writeReviewButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 20,
  },
  actionButtonsContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#FFF8E6',
    paddingHorizontal: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  priceSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  totalSection: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  totalLabel: {
    fontSize: 16,
    color: '#6C757D',
    marginRight: 8,
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFC000',
  },
  savingsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF8E6',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  savingsLabel: {
    fontSize: 12,
    color: '#000',
    fontWeight: '600',
    marginLeft: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionButton: {
    borderRadius: 12,
    paddingVertical: 16,
    flex: 1,
  },
  // Support Button - Unique yellow variant
  supportButton: {
    backgroundColor: '#FFF8E6',
    borderWidth: 2,
    borderColor: '#FFC000',
    flex: 0.8,
  },
  supportButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  supportButtonTextContainer: {
    alignItems: 'center',
  },
  supportButtonMainText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#000',
  },
  supportButtonSubText: {
    fontSize: 10,
    color: '#666',
    fontWeight: '500',
  },
  // Cart Button - Primary yellow
  cartButton: {
    backgroundColor: '#FFC000',
    flex: 1.2,
    shadowColor: '#FFC000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  cartButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  cartButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  // Buy Now Button - Darker yellow for emphasis
  buyButton: {
    backgroundColor: '#FFA000',
    flex: 1,
    shadowColor: '#FFA000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  buyButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buyButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
});