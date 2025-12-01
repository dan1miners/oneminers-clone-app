import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ScrollView,
  Alert,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// --- Types ---

type CartItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  fee: number;
  total: number;
  coin: string;
};

type PaymentMethod = {
  id: string;
  name: string;
  icon: string;
  type: 'bank' | 'card' | 'crypto' | 'wallet';
  details: string;
};

// --- Mock Data ---

const mockCartItems: CartItem[] = [
  {
    id: 'cart1',
    name: 'Antminer S19 Pro',
    image: '⚙️',
    price: 3500,
    quantity: 1,
    fee: 35,
    total: 3535,
    coin: 'BTC'
  },
  {
    id: 'cart2',
    name: 'Goldshell KD6',
    image: '🔩',
    price: 3800,
    quantity: 2,
    fee: 76,
    total: 7676,
    coin: 'KAS'
  },
  {
    id: 'cart3',
    name: 'Aleo Miner F1',
    image: '💎',
    price: 2900,
    quantity: 1,
    fee: 29,
    total: 2929,
    coin: 'ALEO'
  }
];

const paymentMethods: PaymentMethod[] = [
  {
    id: 'bank1',
    name: 'Bank Transfer',
    icon: '🏦',
    type: 'bank',
    details: 'Chase •••• 1234'
  },
  {
    id: 'card1',
    name: 'Credit Card',
    icon: '💳',
    type: 'card',
    details: 'Visa •••• 5678'
  },
  {
    id: 'wallet1',
    name: 'Wallet Balance',
    icon: '💰',
    type: 'wallet',
    details: 'USDT Balance'
  },
  {
    id: 'crypto1',
    name: 'Crypto Transfer',
    icon: '🪙',
    type: 'crypto',
    details: 'BTC Address'
  }
];

// --- Main Component ---

export default function CartPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems);
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0].id);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [promoCode, setPromoCode] = useState('');

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const fees = cartItems.reduce((sum, item) => sum + (item.fee * item.quantity), 0);
  const discount = promoCode === 'CRYPTO10' ? subtotal * 0.1 : 0;
  const total = subtotal + fees - discount;

  const selectedPaymentMethod = paymentMethods.find(method => method.id === selectedPayment);

  const handleBackPress = () => {
    router.back();
  };

  const handleRemoveItem = (itemId: string) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Remove', 
          style: 'destructive',
          onPress: () => {
            setCartItems(prev => prev.filter(item => item.id !== itemId));
          }
        }
      ]
    );
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId);
      return;
    }

    setCartItems(prev => prev.map(item => {
      if (item.id === itemId) {
        const total = newQuantity * item.price + (item.fee * newQuantity);
        return { ...item, quantity: newQuantity, total };
      }
      return item;
    }));
  };

  const handleApplyPromo = () => {
    if (promoCode === 'CRYPTO10') {
      Alert.alert('Success', '10% discount applied!');
    } else if (promoCode) {
      Alert.alert('Invalid Code', 'The promo code you entered is invalid.');
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert('Empty Cart', 'Your cart is empty. Add some items to proceed.');
      return;
    }
    setShowConfirmModal(true);
  };

  const confirmCheckout = () => {
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setShowConfirmModal(false);
      Alert.alert(
        'Order Placed!', 
        'Your order has been successfully placed and is being processed.',
        [
          { 
            text: 'OK', 
            onPress: () => {
              setCartItems([]);
              router.back();
            }
          }
        ]
      );
    }, 3000);
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.cartItem}>
      {/* Product Image and Basic Info */}
      <View style={styles.itemHeader}>
        <View style={styles.productImage}>
          <Text style={styles.productEmoji}>{item.image}</Text>
        </View>
        <View style={styles.productInfo}>
          <Text style={styles.productName}>{item.name}</Text>
          <Text style={styles.productCoin}>Mines {item.coin}</Text>
        </View>
        <TouchableOpacity 
          onPress={() => handleRemoveItem(item.id)}
          style={styles.removeButton}
        >
          <Ionicons name="close" size={20} color="#8E8E93" />
        </TouchableOpacity>
      </View>

      {/* Quantity and Price Row */}
      <View style={styles.controlRow}>
        <View style={styles.quantitySection}>
          <Text style={styles.quantityLabel}>Quantity</Text>
          <View style={styles.quantityControls}>
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}
            >
              <Ionicons name="remove" size={16} color="#007AFF" />
            </TouchableOpacity>
            <Text style={styles.quantityText}>{item.quantity}</Text>
            <TouchableOpacity 
              style={styles.quantityButton}
              onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}
            >
              <Ionicons name="add" size={16} color="#007AFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.priceSection}>
          <Text style={styles.unitPrice}>${item.price.toLocaleString()} each</Text>
          <Text style={styles.feeText}>+ ${item.fee} fee per item</Text>
        </View>
      </View>

      {/* Total for this item */}
      <View style={styles.itemTotalSection}>
        <Text style={styles.itemTotal}>Item Total: ${item.total.toFixed(2)}</Text>
      </View>
    </View>
  );

  const renderPaymentMethod = ({ item }: { item: PaymentMethod }) => (
    <TouchableOpacity
      style={[
        styles.paymentMethod,
        selectedPayment === item.id && styles.paymentMethodSelected
      ]}
      onPress={() => setSelectedPayment(item.id)}
    >
      <View style={styles.paymentLeft}>
        <Text style={styles.paymentIcon}>{item.icon}</Text>
        <View style={styles.paymentInfo}>
          <Text style={styles.paymentName}>{item.name}</Text>
          <Text style={styles.paymentDetails}>{item.details}</Text>
        </View>
      </View>
      <View style={[
        styles.radioButton,
        selectedPayment === item.id && styles.radioButtonSelected
      ]}>
        {selectedPayment === item.id && (
          <View style={styles.radioButtonInner} />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cart</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Cart Items */}
        {cartItems.length > 0 ? (
          <>
            <View style={styles.cartSection}>
              <Text style={styles.sectionTitle}>
                Your Items ({cartItems.length})
              </Text>
              <FlatList
                data={cartItems}
                keyExtractor={(item) => item.id}
                renderItem={renderCartItem}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
              />
            </View>

            {/* Promo Code */}
            <View style={styles.promoSection}>
              <Text style={styles.sectionTitle}>Promo Code</Text>
              <View style={styles.promoInputContainer}>
                <TextInput
                  style={styles.promoInput}
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChangeText={setPromoCode}
                  placeholderTextColor="#8E8E93"
                />
                <TouchableOpacity 
                  style={styles.applyButton}
                  onPress={handleApplyPromo}
                >
                  <Text style={styles.applyButtonText}>Apply</Text>
                </TouchableOpacity>
              </View>
              {discount > 0 && (
                <View style={styles.discountApplied}>
                  <Ionicons name="checkmark-circle" size={16} color="#34C759" />
                  <Text style={styles.discountText}>10% discount applied</Text>
                </View>
              )}
            </View>

            {/* Payment Method */}
            <View style={styles.paymentSection}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Payment Method</Text>
                <TouchableOpacity onPress={() => setShowPaymentModal(true)}>
                  <Text style={styles.changeText}>Change</Text>
                </TouchableOpacity>
              </View>
              
              {selectedPaymentMethod && (
                <View style={styles.selectedPayment}>
                  <Text style={styles.selectedPaymentIcon}>
                    {selectedPaymentMethod.icon}
                  </Text>
                  <View style={styles.selectedPaymentInfo}>
                    <Text style={styles.selectedPaymentName}>
                      {selectedPaymentMethod.name}
                    </Text>
                    <Text style={styles.selectedPaymentDetails}>
                      {selectedPaymentMethod.details}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* Order Total */}
            <View style={styles.totalSection}>
              <Text style={styles.sectionTitle}>Order Summary</Text>
              <View style={styles.summaryRows}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Subtotal</Text>
                  <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Fees</Text>
                  <Text style={styles.summaryValue}>${fees.toFixed(2)}</Text>
                </View>
                {discount > 0 && (
                  <View style={styles.summaryRow}>
                    <Text style={[styles.summaryLabel, styles.discountLabel]}>Discount</Text>
                    <Text style={[styles.summaryValue, styles.discountValue]}>
                      -${discount.toFixed(2)}
                    </Text>
                  </View>
                )}
                <View style={styles.divider} />
                <View style={styles.summaryRow}>
                  <Text style={styles.finalTotalLabel}>Total</Text>
                  <Text style={styles.finalTotalValue}>${total.toFixed(2)}</Text>
                </View>
              </View>
            </View>

            {/* Checkout Button */}
            <TouchableOpacity 
              style={styles.checkoutButton}
              onPress={handleCheckout}
            >
              <Text style={styles.checkoutButtonText}>
                Proceed to Checkout
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          // Empty Cart State
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Ionicons name="cart-outline" size={64} color="#E9ECEF" />
            </View>
            <Text style={styles.emptyTitle}>Your cart is empty</Text>
            <Text style={styles.emptySubtitle}>
              Add some mining equipment to get started
            </Text>
            <TouchableOpacity 
              style={styles.shopButton}
              onPress={() => router.back()}
            >
              <Text style={styles.shopButtonText}>Start Shopping</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* Payment Methods Modal */}
      <Modal
        visible={showPaymentModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Payment Method</Text>
              <TouchableOpacity onPress={() => setShowPaymentModal(false)}>
                <Ionicons name="close" size={24} color="#000" />
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={paymentMethods}
              keyExtractor={(item) => item.id}
              renderItem={renderPaymentMethod}
              showsVerticalScrollIndicator={false}
            />

            <TouchableOpacity 
              style={styles.confirmPaymentButton}
              onPress={() => setShowPaymentModal(false)}
            >
              <Text style={styles.confirmPaymentButtonText}>Confirm Payment Method</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Order</Text>
            
            <View style={styles.confirmationDetails}>
              <Text style={styles.confirmationSubtitle}>
                Please review your order details:
              </Text>

              <View style={styles.orderSummary}>
                {cartItems.map(item => (
                  <View key={item.id} style={styles.orderItem}>
                    <View style={styles.orderItemLeft}>
                      <Text style={styles.orderItemIcon}>{item.image}</Text>
                      <View>
                        <Text style={styles.orderItemName}>{item.name}</Text>
                        <Text style={styles.orderItemQuantity}>
                          Qty: {item.quantity} × ${item.price}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.orderItemTotal}>
                      ${item.total.toFixed(2)}
                    </Text>
                  </View>
                ))}
              </View>

              <View style={styles.finalSummary}>
                <View style={styles.finalRow}>
                  <Text style={styles.finalLabel}>Payment Method:</Text>
                  <Text style={styles.finalValue}>
                    {selectedPaymentMethod?.name}
                  </Text>
                </View>
                <View style={styles.finalRow}>
                  <Text style={styles.finalLabel}>Total Amount:</Text>
                  <Text style={styles.finalTotal}>${total.toFixed(2)}</Text>
                </View>
              </View>

              <View style={styles.warningBox}>
                <Ionicons name="warning-outline" size={16} color="#FF9500" />
                <Text style={styles.warningText}>
                  Orders cannot be cancelled once confirmed. Please double-check all details.
                </Text>
              </View>
            </View>

            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelOrderButton}
                onPress={() => setShowConfirmModal(false)}
                disabled={isProcessing}
              >
                <Text style={styles.cancelOrderButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[
                  styles.confirmOrderButton,
                  isProcessing && styles.confirmOrderButtonDisabled
                ]}
                onPress={confirmCheckout}
                disabled={isProcessing}
              >
                {isProcessing ? (
                  <Text style={styles.confirmOrderButtonText}>Processing...</Text>
                ) : (
                  <Text style={styles.confirmOrderButtonText}>Confirm Order</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    marginEnd: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
    flex: 1,
    textAlign: 'center',
  },
  headerPlaceholder: {
    width: 36,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  cartSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  changeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
  },
  
  // Modern Cart Item Styles
  cartItem: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  itemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  productImage: {
    width: 50,
    height: 50,
    borderRadius: 12,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  productEmoji: {
    fontSize: 24,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  productCoin: {
    fontSize: 14,
    color: '#8E8E93',
  },
  removeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#F8F9FA',
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  quantitySection: {
    alignItems: 'flex-start',
  },
  quantityLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 8,
    fontWeight: '500',
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 4,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  quantityText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginHorizontal: 16,
    minWidth: 20,
    textAlign: 'center',
  },
  priceSection: {
    alignItems: 'flex-end',
  },
  unitPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 4,
  },
  feeText: {
    fontSize: 12,
    color: '#8E8E93',
  },
  itemTotalSection: {
    borderTopWidth: 1,
    borderTopColor: '#F2F2F7',
    paddingTop: 12,
    alignItems: 'flex-end',
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007AFF',
  },

  // Rest of the styles remain similar but updated for consistency
  promoSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  promoInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  promoInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    padding: 16,
    marginRight: 12,
    fontSize: 16,
    backgroundColor: '#F8F9FA',
  },
  applyButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderRadius: 12,
  },
  applyButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  discountApplied: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 12,
    backgroundColor: '#E8F5E9',
    borderRadius: 8,
  },
  discountText: {
    fontSize: 14,
    color: '#2E7D32',
    marginLeft: 8,
    fontWeight: '500',
  },
  paymentSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  selectedPayment: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  selectedPaymentIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  selectedPaymentInfo: {
    flex: 1,
  },
  selectedPaymentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  selectedPaymentDetails: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  totalSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  summaryRows: {},
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#8E8E93',
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  discountLabel: {
    color: '#34C759',
  },
  discountValue: {
    color: '#34C759',
  },
  divider: {
    height: 1,
    backgroundColor: '#E9ECEF',
    marginVertical: 12,
  },
  finalTotalLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  finalTotalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#007AFF',
  },
  checkoutButton: {
    backgroundColor: '#007AFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 30,
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  checkoutButtonText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyIcon: {
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 32,
  },
  shopButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 12,
  },
  shopButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  modalOverlay: {
    flex: 1,
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
    maxWidth: 400,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#000000',
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderWidth: 1,
    borderColor: '#E9ECEF',
    borderRadius: 12,
    marginBottom: 8,
  },
  paymentMethodSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#F0F8FF',
  },
  paymentLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  paymentInfo: {
    flex: 1,
  },
  paymentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
  paymentDetails: {
    fontSize: 14,
    color: '#8E8E93',
    marginTop: 2,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#E9ECEF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonSelected: {
    borderColor: '#007AFF',
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#007AFF',
  },
  confirmPaymentButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 16,
  },
  confirmPaymentButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  confirmationDetails: {
    marginBottom: 24,
  },
  confirmationSubtitle: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 16,
  },
  orderSummary: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  orderItemIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  orderItemName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  orderItemQuantity: {
    fontSize: 12,
    color: '#8E8E93',
    marginTop: 2,
  },
  orderItemTotal: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  finalSummary: {
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  finalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  finalLabel: {
    fontSize: 14,
    color: '#8E8E93',
  },
  finalValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000000',
  },
  finalTotal: {
    fontSize: 16,
    fontWeight: '700',
    color: '#007AFF',
  },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: '#FFF8E1',
    padding: 12,
    borderRadius: 8,
    alignItems: 'flex-start',
  },
  warningText: {
    fontSize: 12,
    color: '#8B6914',
    marginLeft: 8,
    flex: 1,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelOrderButton: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  cancelOrderButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#8E8E93',
  },
  confirmOrderButton: {
    flex: 1,
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  confirmOrderButtonDisabled: {
    backgroundColor: '#E9ECEF',
  },
  confirmOrderButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});